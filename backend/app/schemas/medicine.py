"""Pydantic schemas for request/response serialization."""
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


# ── Category ──────────────────────────────────────────────────────────────

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None


# ── Brand ─────────────────────────────────────────────────────────────────

class BrandOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    manufacturer: str


# ── Medicine Brand (nested in detail view) ────────────────────────────────

class MedicineBrandOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    brand_name: str
    manufacturer: str
    price: Decimal


# ── Medicine List (summary) ───────────────────────────────────────────────

class MedicineListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    purpose: str
    age_group: str
    price: Decimal
    in_stock: bool
    category_name: str


# ── Medicine Detail ───────────────────────────────────────────────────────

class MedicineDetailOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    purpose: str
    age_group: str
    price: Decimal
    in_stock: bool
    category: CategoryOut
    brands: list[MedicineBrandOut]


# ── Paginated Response ────────────────────────────────────────────────────

class PaginatedMedicines(BaseModel):
    data: list[MedicineListItem]
    total: int
    page: int
    page_size: int
