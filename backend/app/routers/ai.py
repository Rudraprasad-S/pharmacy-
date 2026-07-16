"""AI assistant router — medicine recommendations and health queries."""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.medicine import Medicine
from app.models.category import Category

router = APIRouter(prefix="/api/ai", tags=["ai"])

# ── Simple symptom-to-category mapping ─────────────────────────────────────
SYMPTOM_MAP = {
    # Pain
    "headache": "Pain Relief",
    "head": "Pain Relief",
    "migraine": "Pain Relief",
    "fever": "Pain Relief",
    "pain": "Pain Relief",
    "ache": "Pain Relief",
    "back pain": "Pain Relief",
    "joint pain": "Pain Relief",
    "muscle pain": "Pain Relief",
    "toothache": "Pain Relief",
    "cramps": "Pain Relief",
    "menstrual": "Pain Relief",
    # Cold & Cough
    "cold": "Cold & Cough",
    "cough": "Cold & Cough",
    "sneeze": "Cold & Cough",
    "runny nose": "Cold & Cough",
    "congestion": "Cold & Cough",
    "allergy": "Cold & Cough",
    "sore throat": "Cold & Cough",
    "flu": "Cold & Cough",
    "sinus": "Cold & Cough",
    # Digestive
    "stomach": "Digestive Health",
    "acidity": "Digestive Health",
    "heartburn": "Digestive Health",
    "gas": "Digestive Health",
    "bloating": "Digestive Health",
    "constipation": "Digestive Health",
    "diarrhea": "Digestive Health",
    "indigestion": "Digestive Health",
    "nausea": "Digestive Health",
    "vomiting": "Digestive Health",
    # Skin
    "skin": "Skin Care",
    "rash": "Skin Care",
    "acne": "Skin Care",
    "eczema": "Skin Care",
    "dry skin": "Skin Care",
    "itching": "Skin Care",
    "sunburn": "Skin Care",
    "wound": "Skin Care",
    # Vitamins
    "weakness": "Vitamins & Supplements",
    "fatigue": "Vitamins & Supplements",
    "vitamin": "Vitamins & Supplements",
    "supplement": "Vitamins & Supplements",
    "immunity": "Vitamins & Supplements",
    "energy": "Vitamins & Supplements",
    # Diabetes
    "diabetes": "Diabetes Care",
    "sugar": "Diabetes Care",
    "blood sugar": "Diabetes Care",
    # Heart
    "heart": "Heart & BP",
    "bp": "Heart & BP",
    "blood pressure": "Heart & BP",
    "cholesterol": "Heart & BP",
    "hypertension": "Heart & BP",
    # Respiratory
    "asthma": "Respiratory",
    "breathing": "Respiratory",
    "wheezing": "Respiratory",
    "inhaler": "Respiratory",
    # Eye/Ear
    "eye": "Eye & Ear Care",
    "ear": "Eye & Ear Care",
    "vision": "Eye & Ear Care",
    # Women's health
    "pregnancy": "Women's Health",
    "pregnant": "Women's Health",
    "hormonal": "Women's Health",
    "pms": "Women's Health",
    # Baby
    "baby": "Baby & Child Care",
    "child": "Baby & Child Care",
    "infant": "Baby & Child Care",
    "kid": "Baby & Child Care",
    "pediatric": "Baby & Child Care",
    # Antibiotics (prescription note)
    "infection": "Antibiotics",
    "bacterial": "Antibiotics",
    "antibiotic": "Antibiotics",
}

# Greeting keywords
GREETINGS = {"hi", "hello", "hey", "good morning", "good evening", "help", "what can you do"}


def _match_category(query: str) -> str | None:
    """Find the best matching category from the query."""
    q = query.lower().strip()
    # Sort by key length (longest match first)
    for keyword, cat in sorted(SYMPTOM_MAP.items(), key=lambda x: -len(x[0])):
        if keyword in q:
            return cat
    return None


@router.get("/chat")
def ai_chat(
    query: str = Query(..., min_length=1, description="User's health query"),
    db: Session = Depends(get_db),
):
    """AI-powered medicine recommendation based on symptoms/query."""
    q = query.lower().strip()

    # Handle greetings
    if q in GREETINGS:
        return {
            "response": "Hello! 👋 I'm your pharmacy AI assistant. Tell me your symptoms (e.g., 'headache', 'cold and cough', 'acidity'), and I'll recommend the right medicines for you!",
            "medicines": [],
            "category": None,
        }

    # Find matching category
    category_name = _match_category(q)

    medicines = []
    if category_name:
        results = (
            db.query(Medicine)
            .join(Category)
            .filter(
                Category.name == category_name,
                Medicine.in_stock == True,  # noqa: E712
            )
            .order_by(Medicine.price)
            .limit(5)
            .all()
        )
        medicines = [
            {
                "id": m.id,
                "name": m.name,
                "price": float(m.price),
                "purpose": m.purpose,
                "category_name": category_name,
            }
            for m in results
        ]

    if medicines:
        response = (
            f"I understand you're experiencing {'/'.join(q.split()[:3])}... "
            f"Based on your symptoms, here are some medicines from the **{category_name}** category that may help:"
        )
    else:
        # Fallback: search by name/purpose
        pattern = f"%{q}%"
        results = (
            db.query(Medicine)
            .filter(
                Medicine.in_stock == True,  # noqa: E712
                Medicine.name.ilike(pattern) | Medicine.purpose.ilike(pattern),
            )
            .order_by(Medicine.price)
            .limit(5)
            .all()
        )
        medicines = [
            {
                "id": m.id,
                "name": m.name,
                "price": float(m.price),
                "purpose": m.purpose,
                "category_name": m.category.name if m.category else "General",
            }
            for m in results
        ]

        if medicines:
            response = (
                f"I found these medicines that match your query '{query}':"
            )
        else:
            response = (
                f"I couldn't find specific medicines for '{query}'. "
                "Try describing your symptoms like 'headache', 'cold', 'acidity', or 'skin rash'. "
                "You can also browse all categories on our homepage!"
            )

    return {
        "response": response,
        "medicines": medicines,
        "category": category_name,
    }
