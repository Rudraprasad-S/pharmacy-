"""Orders router: OTP authentication, checkout with payment, and order tracking."""
import json
import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.medicine import Medicine
from app.models.order import OTP, Order
from app.schemas.order import (
    CheckoutRequest,
    OrderFilterRequest,
    OrderListOut,
    OrderOut,
    SendOTPRequest,
    SendOTPResponse,
    TrackingEvent,
    VerifyOTPRequest,
    VerifyOTPResponse,
)

router = APIRouter(prefix="/api", tags=["orders"])

# ── Tracking stage definitions ──────────────────────────────────────────────
TRACKING_STAGES = [
    ("Order Placed", "Your order has been received and confirmed."),
    ("Processing", "The pharmacy is preparing your medicines."),
    ("Packed", "Your order has been packed and is ready for dispatch."),
    ("Shipped", "Your order is on its way via courier."),
    ("Out for Delivery", "The delivery partner is on the way to your address."),
    ("Delivered", "Your order has been delivered successfully."),
]


# ── Helpers ─────────────────────────────────────────────────────────────────

def _generate_otp() -> str:
    return f"{random.randint(100000, 999999)}"


def _cleanup_expired_otps(db: Session, phone: str) -> None:
    """Remove all expired or already-verified OTPs for this phone."""
    now = datetime.utcnow()
    db.query(OTP).filter(
        OTP.phone_number == phone,
        (OTP.expires_at < now) | (OTP.verified == True),  # noqa: E712
    ).delete()
    db.commit()


def _build_tracking_history(current_stage: str) -> list[dict]:
    """Build a tracking history list up to the given stage."""
    history = []
    now = datetime.utcnow().isoformat()
    for idx, (stage, desc) in enumerate(TRACKING_STAGES):
        entry = {
            "stage": stage,
            "timestamp": now,
            "description": desc,
        }
        history.append(entry)
        if stage == current_stage:
            break
    return history


# ── OTP Endpoints ───────────────────────────────────────────────────────────

@router.post("/otp/send", response_model=SendOTPResponse)
def send_otp(payload: SendOTPRequest, db: Session = Depends(get_db)):
    """Send a 6-digit OTP to the given phone number (simulated)."""
    phone = payload.phone_number

    # Cleanup old OTPs for this phone
    _cleanup_expired_otps(db, phone)

    # Rate limit: max 3 unverified OTPs per phone
    active_count = (
        db.query(OTP)
        .filter(OTP.phone_number == phone, OTP.verified == False)  # noqa: E712
        .count()
    )
    if active_count >= 3:
        raise HTTPException(
            status_code=429,
            detail="Too many OTP requests. Please wait before requesting again.",
        )

    code = _generate_otp()
    expires_at = datetime.utcnow() + timedelta(seconds=300)

    otp = OTP(phone_number=phone, otp_code=code, expires_at=expires_at)
    db.add(otp)
    db.commit()
    db.refresh(otp)

    # In production, send via SMS; for demo, we return it in the response
    print(f"\n{'='*50}")
    print(f"  OTP for {phone}: {code}")
    print(f"  Expires at: {expires_at.isoformat()}")
    print(f"{'='*50}\n")

    return SendOTPResponse(
        message=f"OTP sent to {phone}. (Demo: your OTP is {code})",
        otp_code=code,
        expires_in_seconds=300,
    )


@router.post("/otp/verify", response_model=VerifyOTPResponse)
def verify_otp(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    """Verify the OTP for a phone number."""
    phone = payload.phone_number
    now = datetime.utcnow()

    # Find the latest unverified, non-expired OTP
    otp = (
        db.query(OTP)
        .filter(
            OTP.phone_number == phone,
            OTP.verified == False,  # noqa: E712
            OTP.expires_at > now,
        )
        .order_by(OTP.created_at.desc())
        .first()
    )

    if not otp:
        raise HTTPException(
            status_code=400,
            detail="No valid OTP found. Please request a new OTP.",
        )

    if otp.otp_code != payload.otp_code:
        raise HTTPException(status_code=400, detail="Invalid OTP. Please try again.")

    # Mark as verified
    otp.verified = True
    db.commit()

    return VerifyOTPResponse(verified=True, message="OTP verified successfully.")


# ── Checkout / Place Order ──────────────────────────────────────────────────

@router.post("/orders/checkout", response_model=list[OrderOut], status_code=201)
def checkout(payload: CheckoutRequest, db: Session = Depends(get_db)):
    """Place an order after OTP verification. Supports multiple items."""
    # 1. Verify OTP is valid and verified for this phone
    now = datetime.utcnow()
    verified_otp = (
        db.query(OTP)
        .filter(
            OTP.phone_number == payload.customer_phone,
            OTP.verified == True,  # noqa: E712
            OTP.otp_code == payload.otp_code,
        )
        .first()
    )

    if not verified_otp:
        raise HTTPException(
            status_code=401,
            detail="OTP verification required. Please verify OTP before checkout.",
        )

    # Check OTP freshness (must be verified within last 10 minutes)
    if verified_otp.created_at < now - timedelta(minutes=10):
        raise HTTPException(
            status_code=401,
            detail="OTP session expired. Please request and verify a new OTP.",
        )

    if not payload.items:
        raise HTTPException(status_code=400, detail="No items in order.")

    created_orders = []

    for item in payload.items:
        # Validate medicine exists and is in stock
        medicine = db.query(Medicine).filter(Medicine.id == item.medicine_id).first()
        if not medicine:
            raise HTTPException(
                status_code=404,
                detail=f"Medicine with id {item.medicine_id} not found.",
            )
        if not medicine.in_stock:
            raise HTTPException(
                status_code=400,
                detail=f"'{medicine.name}' is currently out of stock.",
            )

        total_price = float(medicine.price) * item.quantity
        tracking_history = _build_tracking_history("Order Placed")

        order = Order(
            customer_name=payload.customer_name,
            customer_phone=payload.customer_phone,
            medicine_id=medicine.id,
            brand_name=item.brand_name,
            quantity=item.quantity,
            price_per_unit=float(medicine.price),
            total_price=total_price,
            payment_method=payload.payment_method,
            payment_status="paid",
            order_status="confirmed",
            tracking_stage="Order Placed",
            tracking_history=json.dumps(tracking_history),
        )
        db.add(order)
        db.flush()

        created_orders.append(
            OrderOut(
                id=order.id,
                customer_name=order.customer_name,
                customer_phone=order.customer_phone,
                medicine_name=medicine.name,
                brand_name=order.brand_name,
                quantity=order.quantity,
                price_per_unit=order.price_per_unit,
                total_price=order.total_price,
                payment_method=order.payment_method,
                payment_status=order.payment_status,
                order_status=order.order_status,
                tracking_stage=order.tracking_stage,
                tracking_history=[TrackingEvent(**e) for e in tracking_history],
                created_at=order.created_at,
                updated_at=order.updated_at,
            )
        )

    # Clean up the used OTP
    db.delete(verified_otp)
    db.commit()

    return created_orders


# ── Order Tracking ──────────────────────────────────────────────────────────

@router.post("/orders/track", response_model=OrderListOut)
def track_orders(payload: OrderFilterRequest, db: Session = Depends(get_db)):
    """Get all orders for a phone number with tracking info."""
    orders = (
        db.query(Order)
        .options(joinedload(Order.medicine))
        .filter(Order.customer_phone == payload.phone_number)
        .order_by(Order.created_at.desc())
        .all()
    )

    result = []
    for order in orders:
        history = []
        if order.tracking_history:
            try:
                raw = json.loads(order.tracking_history)
                history = [TrackingEvent(**e) for e in raw]
            except (json.JSONDecodeError, TypeError):
                pass

        result.append(
            OrderOut(
                id=order.id,
                customer_name=order.customer_name,
                customer_phone=order.customer_phone,
                medicine_name=order.medicine.name if order.medicine else "Unknown",
                brand_name=order.brand_name,
                quantity=order.quantity,
                price_per_unit=order.price_per_unit,
                total_price=order.total_price,
                payment_method=order.payment_method,
                payment_status=order.payment_status,
                order_status=order.order_status,
                tracking_stage=order.tracking_stage,
                tracking_history=history,
                created_at=order.created_at,
                updated_at=order.updated_at,
            )
        )

    return OrderListOut(orders=result, total=len(result))


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific order by ID with full tracking history."""
    order = (
        db.query(Order)
        .options(joinedload(Order.medicine))
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    history = []
    if order.tracking_history:
        try:
            raw = json.loads(order.tracking_history)
            history = [TrackingEvent(**e) for e in raw]
        except (json.JSONDecodeError, TypeError):
            pass

    return OrderOut(
        id=order.id,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        medicine_name=order.medicine.name if order.medicine else "Unknown",
        brand_name=order.brand_name,
        quantity=order.quantity,
        price_per_unit=order.price_per_unit,
        total_price=order.total_price,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        tracking_stage=order.tracking_stage,
        tracking_history=history,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )


@router.patch("/orders/{order_id}/tracking")
def advance_tracking(
    order_id: int,
    db: Session = Depends(get_db),
):
    """Advance the tracking stage of an order (simulates delivery progress)."""
    order = (
        db.query(Order)
        .options(joinedload(Order.medicine))
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    # Find current stage index
    current_idx = None
    for idx, (stage, _) in enumerate(TRACKING_STAGES):
        if stage == order.tracking_stage:
            current_idx = idx
            break

    if current_idx is None or current_idx >= len(TRACKING_STAGES) - 1:
        raise HTTPException(
            status_code=400,
            detail="Order is already at the final stage (Delivered).",
        )

    next_stage = TRACKING_STAGES[current_idx + 1][0]
    order.tracking_stage = next_stage
    order.order_status = (
        "delivered" if next_stage == "Delivered" else order.order_status
    )
    order.tracking_history = json.dumps(_build_tracking_history(next_stage))
    db.commit()
    db.refresh(order)

    history = [TrackingEvent(**e) for e in json.loads(order.tracking_history)]
    return OrderOut(
        id=order.id,
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        medicine_name=order.medicine.name if order.medicine else "Unknown",
        brand_name=order.brand_name,
        quantity=order.quantity,
        price_per_unit=order.price_per_unit,
        total_price=order.total_price,
        payment_method=order.payment_method,
        payment_status=order.payment_status,
        order_status=order.order_status,
        tracking_stage=order.tracking_stage,
        tracking_history=history,
        created_at=order.created_at,
        updated_at=order.updated_at,
    )
