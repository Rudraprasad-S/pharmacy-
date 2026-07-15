"""Brand model and MedicineBrand join table."""
from decimal import Decimal

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Brand(Base):
    __tablename__ = "brands"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    manufacturer: Mapped[str] = mapped_column(String(200), nullable=False)

    medicine_brands: Mapped[list["MedicineBrand"]] = relationship(
        "MedicineBrand", back_populates="brand"
    )

    def __repr__(self) -> str:
        return f"<Brand(id={self.id}, name='{self.name}')>"


class MedicineBrand(Base):
    """Join table linking medicines to their available brands with optional price override."""

    __tablename__ = "medicine_brands"

    medicine_id: Mapped[int] = mapped_column(
        ForeignKey("medicines.id"), primary_key=True
    )
    brand_id: Mapped[int] = mapped_column(
        ForeignKey("brands.id"), primary_key=True
    )
    price_override: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2), nullable=True
    )

    medicine: Mapped["Medicine"] = relationship(
        "Medicine", back_populates="medicine_brands"
    )
    brand: Mapped["Brand"] = relationship(
        "Brand", back_populates="medicine_brands"
    )


from app.models.medicine import Medicine  # noqa: E402
