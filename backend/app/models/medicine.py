"""Medicine model — a pharmaceutical product."""
from decimal import Decimal

from sqlalchemy import Boolean, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    purpose: Mapped[str] = mapped_column(Text, nullable=False)
    age_group: Mapped[str] = mapped_column(
        String(20), nullable=False, default="all"
    )  # adult, child, infant, all
    price: Mapped[Decimal] = mapped_column(
        Numeric(10, 2), nullable=False
    )
    in_stock: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False
    )

    # Relationships
    category: Mapped["Category"] = relationship(
        "Category", back_populates="medicines"
    )
    medicine_brands: Mapped[list["MedicineBrand"]] = relationship(
        "MedicineBrand", back_populates="medicine"
    )

    def __repr__(self) -> str:
        return f"<Medicine(id={self.id}, name='{self.name}')>"


from app.models.category import Category  # noqa: E402
from app.models.brand import MedicineBrand  # noqa: E402
