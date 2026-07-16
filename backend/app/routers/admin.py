"""Admin router — add medicines, view all orders (admin-only)."""
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.medicine import Medicine
from app.models.category import Category
from app.models.order import Order
from app.routers.auth import require_admin
from app.routers.orders import _build_tracking_history
from app.schemas.order import OrderOut, TrackingEvent

import json

router = APIRouter(prefix="/api/admin", tags=["admin"])


class AddMedicineRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    purpose: str = Field(..., min_length=1)
    age_group: str = Field(default="all", pattern="^(adult|child|infant|all)$")
    price: float = Field(..., gt=0)
    category_id: int = Field(..., gt=0)


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.post("/medicines", status_code=201)
def add_medicine(
    payload: AddMedicineRequest,
    db: Session = Depends(get_db),
    _admin: None = Depends(require_admin),
):
    """Add a new medicine to the catalog (admin only)."""
    cat = db.query(Category).filter(Category.id == payload.category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    med = Medicine(
        name=payload.name,
        purpose=payload.purpose,
        age_group=payload.age_group,
        price=Decimal(str(payload.price)),
        in_stock=True,
        category_id=payload.category_id,
    )
    db.add(med)
    db.commit()
    db.refresh(med)
    return {"id": med.id, "name": med.name, "message": "Medicine added successfully"}


@router.get("/orders")
def list_all_orders(
    db: Session = Depends(get_db),
    _admin: None = Depends(require_admin),
):
    """List all orders across all users (admin only)."""
    orders = (
        db.query(Order)
        .options(joinedload(Order.medicine))
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

    return {"orders": result, "total": len(result)}


@router.get("/categories")
def list_categories_for_admin(
    db: Session = Depends(get_db),
    _admin: None = Depends(require_admin),
):
    """List all categories with IDs (for the add-medicine form)."""
    return [
        {"id": c.id, "name": c.name}
        for c in db.query(Category).order_by(Category.name).all()
    ]
