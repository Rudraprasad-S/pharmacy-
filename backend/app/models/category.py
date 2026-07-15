"""Category model — groups medicines (e.g., Pain Relief, Antibiotics)."""
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    medicines: Mapped[list["Medicine"]] = relationship(
        "Medicine", back_populates="category"
    )

    def __repr__(self) -> str:
        return f"<Category(id={self.id}, name='{self.name}')>"

# Late imports to avoid circular dependencies
from app.models.medicine import Medicine  # noqa: E402, F811
