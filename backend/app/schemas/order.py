"""Pydantic schemas for orders, OTP, and payment."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


# ── OTP ────────────────────────────────────────────────────────────────────

class SendOTPRequest(BaseModel):
    phone_number: str = Field(
        ..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$"
    )


class SendOTPResponse(BaseModel):
    message: str
    otp_code: str | None = None  # Demo only: the actual OTP code
    expires_in_seconds: int = 300


class VerifyOTPRequest(BaseModel):
    phone_number: str = Field(
        ..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$"
    )
    otp_code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


class VerifyOTPResponse(BaseModel):
    verified: bool
    message: str


# ── Checkout / Create Order ────────────────────────────────────────────────

class CheckoutItem(BaseModel):
    medicine_id: int
    brand_name: str | None = None
    quantity: int = Field(default=1, ge=1, le=20)


class CheckoutRequest(BaseModel):
    customer_name: str = Field(..., min_length=1, max_length=200)
    customer_phone: str = Field(
        ..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$"
    )
    items: list[CheckoutItem]
    payment_method: str = Field(
        default="card", pattern=r"^(card|upi|cod|netbanking)$"
    )
    otp_code: str = Field(..., min_length=6, max_length=6, pattern=r"^\d{6}$")


# ── Order Response ─────────────────────────────────────────────────────────

class OrderMedicineInfo(BaseModel):
    medicine_id: int
    medicine_name: str
    brand_name: str | None = None
    quantity: int
    price_per_unit: float
    total_price: float


class TrackingEvent(BaseModel):
    stage: str
    timestamp: str
    description: str


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    customer_name: str
    customer_phone: str
    medicine_name: str = ""
    brand_name: str | None = None
    quantity: int
    price_per_unit: float
    total_price: float
    payment_method: str
    payment_status: str
    order_status: str
    tracking_stage: str
    tracking_history: list[TrackingEvent] = []
    created_at: datetime
    updated_at: datetime


class OrderListOut(BaseModel):
    orders: list[OrderOut]
    total: int


class OrderFilterRequest(BaseModel):
    phone_number: str = Field(
        ..., min_length=10, max_length=15, pattern=r"^\+?\d{10,15}$"
    )
