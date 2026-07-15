"""Medicine endpoints: list with search/filter/pagination and detail view."""
from math import ceil

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.medicine import Medicine
from app.models.category import Category
from app.models.brand import MedicineBrand, Brand
from app.schemas.medicine import (
    MedicineDetailOut,
    MedicineListItem,
    PaginatedMedicines,
)

router = APIRouter(prefix="/api/medicines", tags=["medicines"])


@router.get("", response_model=PaginatedMedicines)
def list_medicines(
    q: str | None = Query(None, description="Search by name or purpose"),
    category: str | None = Query(None, description="Filter by category name"),
    age_group: str | None = Query(None, description="Filter: adult, child, infant, all"),
    in_stock: bool | None = Query(None, description="Filter by availability"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
):
    base_query = db.query(Medicine).join(Category)

    # Apply filters
    if q:
        pattern = f"%{q}%"
        base_query = base_query.filter(
            Medicine.name.ilike(pattern) | Medicine.purpose.ilike(pattern)
        )
    if category:
        base_query = base_query.filter(Category.name == category)
    if age_group:
        base_query = base_query.filter(
            (Medicine.age_group == age_group) | (Medicine.age_group == "all")
        )
    if in_stock is not None:
        base_query = base_query.filter(Medicine.in_stock == in_stock)

    # Get total count
    total = base_query.count()

    # Paginate
    medicines = (
        base_query.order_by(Medicine.name)
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    # Build response
    items = [
        MedicineListItem(
            id=m.id,
            name=m.name,
            purpose=m.purpose,
            age_group=m.age_group,
            price=float(m.price),
            in_stock=m.in_stock,
            category_name=m.category.name,
        )
        for m in medicines
    ]

    return PaginatedMedicines(
        data=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/{medicine_id}", response_model=MedicineDetailOut)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = (
        db.query(Medicine)
        .options(
            joinedload(Medicine.category),
            joinedload(Medicine.medicine_brands).joinedload(MedicineBrand.brand),
        )
        .filter(Medicine.id == medicine_id)
        .first()
    )

    if not medicine:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Build brands list
    brands = []
    for mb in medicine.medicine_brands:
        b = mb.brand
        brands.append({
            "brand_name": b.name,
            "manufacturer": b.manufacturer,
            "price": float(mb.price_override) if mb.price_override else float(medicine.price),
        })

    return MedicineDetailOut(
        id=medicine.id,
        name=medicine.name,
        purpose=medicine.purpose,
        age_group=medicine.age_group,
        price=float(medicine.price),
        in_stock=medicine.in_stock,
        category=medicine.category,
        brands=brands,
    )
