"""Order and OTP models — purchase flow with OTP authentication."""

from datetime import datetime, timedelta

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    customer_name: Mapped[str] = mapped_column(String(200), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(15), nullable=False, index=True)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id"), nullable=False)
    brand_name: Mapped[str | None] = mapped_column(String(150), nullable=True)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    price_per_unit: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    total_price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_method: Mapped[str] = mapped_column(
        String(50), nullable=False, default="card"
    )  # card, upi, cod, netbanking
    payment_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="paid"
    )  # paid, pending, failed
    order_status: Mapped[str] = mapped_column(
        String(20), nullable=False, default="confirmed"
    )  # confirmed, processing, shipped, delivered, cancelled
    tracking_stage: Mapped[str] = mapped_column(
        String(30), nullable=False, default="Order Placed"
    )
    tracking_history: Mapped[str | None] = mapped_column(
        Text, nullable=True
    )  # JSON string of tracking updates
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationship
    medicine: Mapped["Medicine"] = relationship("Medicine")

    def __repr__(self) -> str:
        return f"<Order(id={self.id}, customer='{self.customer_name}', status='{self.order_status}')>"


class OTP(Base):
    __tablename__ = "otps"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    phone_number: Mapped[str] = mapped_column(String(15), nullable=False, index=True)
    otp_code: Mapped[str] = mapped_column(String(6), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    verified: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    @property
    def is_expired(self) -> bool:
        return datetime.utcnow() > self.expires_at

    def __repr__(self) -> str:
        return f"<OTP(id={self.id}, phone='{self.phone_number}', verified={self.verified})>"


# Late import to avoid circular dependency
from app.models.medicine import Medicine  # noqa: E402
