"""
Seed script: populates the SQLite database with realistic Indian pharmacy data.

Usage:
    cd backend
    venv\Scripts\python seed.py
"""
from decimal import Decimal

from app.database import SessionLocal, engine, Base
from app.models.category import Category
from app.models.medicine import Medicine
from app.models.brand import Brand, MedicineBrand


def seed():
    """Drop all tables, recreate, and insert sample data."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    # ── Categories (12 total) ─────────────────────────────────────────────
    categories_data = [
        ("Pain Relief", "Medicines for headaches, body aches, fever, and inflammation"),
        ("Antibiotics", "Bacterial infection treatments — requires prescription"),
        ("Vitamins & Supplements", "Nutritional supplements, multivitamins, and minerals"),
        ("Cold & Cough", "Remedies for common cold, cough, flu, and allergy symptoms"),
        ("Diabetes Care", "Blood sugar management medications and insulin"),
        ("Digestive Health", "Antacids, laxatives, probiotics, and gut health"),
        ("Skin Care", "Creams, ointments, and treatments for skin conditions"),
        ("Heart & BP", "Blood pressure, cholesterol, and cardiac medications"),
        ("Respiratory", "Asthma inhalers, bronchodilators, and breathing aids"),
        ("Eye & Ear Care", "Eye drops, ear drops, and ophthalmic solutions"),
        ("Women's Health", "Pregnancy supplements, hormonal support, feminine care"),
        ("Baby & Child Care", "Pediatric formulations — drops, syrups, and low-dose tablets"),
    ]
    categories = {}
    for name, desc in categories_data:
        cat = Category(name=name, description=desc)
        db.add(cat)
        db.flush()
        categories[name] = cat

    # ── Brands (30 total) ─────────────────────────────────────────────────
    brands_data = [
        ("Crocin", "GSK"), ("Dolo", "Micro Labs"), ("Saridon", "Bayer"),
        ("Combiflam", "Sanofi"), ("Amoxil", "GSK"), ("Mox", "Sun Pharma"),
        ("Azithral", "Alembic"), ("Becosules", "Pfizer"), ("Supradyn", "Bayer"),
        ("Zincovit", "Apex"), ("Cheston Cold", "Cipla"), ("Sinarest", "Centaur"),
        ("Benadryl", "J&J"), ("Glycomet", "USV"), ("Janumet", "MSD"),
        ("Diamicron", "Serdia"), ("Pantocid", "Sun Pharma"), ("Digene", "Abbott"),
        ("Electral", "FDC"), ("Betnovate", "GSK"), ("Cetaphil", "Galderma"),
        ("Aten", "Zydus"), ("Ciplox", "Cipla"), ("Foracort", "Cipla"),
        ("Refresh Tears", "Allergan"), ("Ciplox Eye", "Cipla"),
        ("Folvite", "Pfizer"), ("Calpol", "GSK"), ("T-Bact", "GSK"),
        ("Otrivin", "Novartis"),
    ]
    brands = {}
    for name, manufacturer in brands_data:
        b = Brand(name=name, manufacturer=manufacturer)
        db.add(b)
        db.flush()
        brands[name] = b

    # ── Medicines (80+ total) ─────────────────────────────────────────────
    medicines_data = [
        # ─ Pain Relief ──────────────────────────────────────────────────────
        ("Paracetamol 500mg", "Fever reducer and mild pain reliever — first-line for headaches and body aches",
         "all", "1.50", "Pain Relief", ["Crocin", "Dolo"]),
        ("Ibuprofen 400mg", "NSAID for inflammation, moderate pain, and fever reduction",
         "adult", "4.20", "Pain Relief", ["Combiflam"]),
        ("Diclofenac 50mg", "Strong NSAID for arthritis, back pain, and muscle sprains",
         "adult", "5.80", "Pain Relief", []),
        ("Aspirin 75mg", "Blood thinner — low-dose for heart protection and mild pain",
         "adult", "2.30", "Pain Relief", []),
        ("Paracetamol 250mg Syrup", "Child-safe fever reducer — banana/strawberry flavored",
         "child", "2.00", "Pain Relief", ["Crocin", "Calpol"]),
        ("Paracetamol 125mg Drops", "Infant fever relief — calibrated dropper included",
         "infant", "1.80", "Pain Relief", ["Dolo", "Calpol"]),
        ("Naproxen 500mg", "Long-acting NSAID — 12-hour relief for chronic joint pain",
         "adult", "7.50", "Pain Relief", []),
        ("Tramadol 50mg", "Prescription opioid for moderate-to-severe acute pain",
         "adult", "9.00", "Pain Relief", []),
        ("Saridon Headache Relief", "Triple-action formula: paracetamol + propyphenazone + caffeine",
         "adult", "3.50", "Pain Relief", ["Saridon"]),
        ("Diclofenac Gel 30g", "Topical pain relief gel for joint and muscle pain — applied directly",
         "adult", "8.50", "Pain Relief", []),
        ("Mefenamic Acid 250mg", "NSAID for menstrual cramps and dental pain",
         "adult", "3.80", "Pain Relief", []),

        # ─ Antibiotics ─────────────────────────────────────────────────────
        ("Amoxicillin 500mg", "Broad-spectrum penicillin — first-line for respiratory and dental infections",
         "adult", "6.00", "Antibiotics", ["Amoxil", "Mox"]),
        ("Azithromycin 500mg", "3-day macrolide course for bronchitis, sinusitis, and pneumonia",
         "adult", "12.50", "Antibiotics", ["Azithral"]),
        ("Ciprofloxacin 500mg", "Fluoroquinolone for UTIs, gut infections, and typhoid",
         "adult", "8.00", "Antibiotics", ["Ciplox"]),
        ("Doxycycline 100mg", "Tetracycline — acne treatment plus malaria prophylaxis",
         "adult", "5.50", "Antibiotics", []),
        ("Cefixime 200mg", "Third-gen cephalosporin for resistant bacterial infections",
         "adult", "15.00", "Antibiotics", []),
        ("Amoxicillin 125mg Syrup", "Pediatric antibiotic — bubblegum flavor, 5-day course",
         "child", "4.50", "Antibiotics", ["Mox"]),
        ("Metronidazole 400mg", "Anti-protozoal + anaerobic bacteria — dental and gut infections",
         "adult", "3.00", "Antibiotics", []),
        ("Levofloxacin 500mg", "Broad-spectrum fluoroquinolone for pneumonia and sinusitis",
         "adult", "11.00", "Antibiotics", []),

        # ─ Vitamins & Supplements ──────────────────────────────────────────
        ("Multivitamin Tablets", "Daily A-to-Z multivitamin with minerals for overall wellness",
         "adult", "8.00", "Vitamins & Supplements", ["Becosules", "Supradyn"]),
        ("Vitamin C 500mg", "Immunity booster — chewable orange-flavored tablets",
         "all", "3.50", "Vitamins & Supplements", []),
        ("Vitamin D3 60K", "Weekly high-dose vitamin D — essential for bones in low-sunlight regions",
         "adult", "10.00", "Vitamins & Supplements", []),
        ("Calcium + Vitamin D3", "Bone density supplement — 500mg calcium + 250IU D3",
         "adult", "12.00", "Vitamins & Supplements", []),
        ("Zinc + Multivitamin Syrup", "Children's growth tonic with zinc, iron, and lysine",
         "child", "6.50", "Vitamins & Supplements", ["Zincovit"]),
        ("Iron + Folic Acid", "Anemia prevention — ferrous sulphate 200mg + folic acid 5mg",
         "adult", "4.00", "Vitamins & Supplements", ["Folvite"]),
        ("B-Complex Forte", "All B vitamins: B1, B2, B3, B5, B6, B7, B9, B12 combined",
         "adult", "5.50", "Vitamins & Supplements", ["Becosules"]),
        ("Omega-3 Fish Oil", "1000mg EPA/DHA — heart, brain, and joint health",
         "adult", "15.00", "Vitamins & Supplements", []),
        ("Protein Powder 500g", "Whey protein isolate — 25g protein per scoop, vanilla flavor",
         "adult", "45.00", "Vitamins & Supplements", []),

        # ─ Cold & Cough ────────────────────────────────────────────────────
        ("Cetirizine 10mg", "Non-drowsy antihistamine for seasonal allergies and cold",
         "adult", "2.50", "Cold & Cough", ["Cheston Cold"]),
        ("Paracetamol + Phenylephrine", "Cold+flu combo: fever reducer + nasal decongestant",
         "adult", "4.80", "Cold & Cough", ["Sinarest"]),
        ("Dextromethorphan Syrup 100ml", "Dry cough suppressant — honey-lemon flavor",
         "adult", "6.20", "Cold & Cough", ["Benadryl"]),
        ("Ambroxol Syrup 100ml", "Mucolytic — breaks down mucus for wet/productive cough",
         "all", "5.00", "Cold & Cough", []),
        ("Paracetamol + CPM Drops 15ml", "Infant cold relief — fever + antihistamine",
         "infant", "2.20", "Cold & Cough", []),
        ("Steam Inhalation Capsules", "Eucalyptus + menthol capsules for steam inhalation therapy",
         "all", "1.50", "Cold & Cough", []),
        ("Otrivin Nasal Spray 10ml", "Xylometazoline — instant nasal decongestant, 12-hour relief",
         "adult", "5.50", "Cold & Cough", ["Otrivin"]),
        ("Cough Syrup (Herbal) 100ml", "Tulsi + honey + mulethi — Ayurvedic cough remedy",
         "all", "4.00", "Cold & Cough", []),
        ("Montelukast 10mg", "Allergy + asthma preventive — blocks leukotrienes",
         "adult", "8.00", "Cold & Cough", []),

        # ─ Diabetes Care ───────────────────────────────────────────────────
        ("Metformin 500mg", "First-line T2DM medication — reduces liver glucose production",
         "adult", "3.00", "Diabetes Care", ["Glycomet"]),
        ("Metformin 1000mg SR", "Extended-release once-daily metformin — fewer GI side effects",
         "adult", "4.50", "Diabetes Care", ["Glycomet"]),
        ("Glimepiride 2mg", "Sulfonylurea — stimulates pancreas to release insulin",
         "adult", "5.50", "Diabetes Care", []),
        ("Sitagliptin 100mg", "DPP-4 inhibitor — protects incretin hormones for better control",
         "adult", "18.00", "Diabetes Care", ["Janumet"]),
        ("Gliclazide 80mg", "Insulin secretion stimulator with vascular protective effects",
         "adult", "6.00", "Diabetes Care", ["Diamicron"]),
        ("Insulin Glargine Pen", "Long-acting basal insulin — 24-hour coverage, 100IU/ml",
         "adult", "45.00", "Diabetes Care", []),
        ("Blood Glucose Test Strips (50 pack)", "Compatible with Accu-Chek / OneTouch meters",
         "adult", "25.00", "Diabetes Care", []),

        # ─ Digestive Health ────────────────────────────────────────────────
        ("Pantoprazole 40mg", "Proton pump inhibitor — 24-hour acid suppression for GERD",
         "adult", "7.00", "Digestive Health", ["Pantocid"]),
        ("Digene Gel 200ml", "Antacid liquid — immediate relief from acidity and heartburn",
         "all", "3.50", "Digestive Health", ["Digene"]),
        ("ORS Powder Sachet", "Oral rehydration salts — WHO formula for dehydration",
         "all", "0.50", "Digestive Health", ["Electral"]),
        ("Lactobacillus Capsules", "Probiotic — 2 billion CFU for gut flora restoration",
         "adult", "6.50", "Digestive Health", []),
        ("Domperidone 10mg", "Anti-nausea — speeds gastric emptying, relieves bloating",
         "adult", "3.00", "Digestive Health", []),
        ("Loperamide 2mg", "Anti-diarrheal — slows gut motility for acute diarrhea",
         "adult", "1.50", "Digestive Health", []),
        ("Lactulose Solution 200ml", "Gentle laxative — osmotic action, safe for elderly",
         "all", "5.00", "Digestive Health", []),
        ("Bisacodyl 5mg", "Stimulant laxative — overnight relief from constipation",
         "adult", "1.00", "Digestive Health", []),

        # ─ Skin Care ───────────────────────────────────────────────────────
        ("Betnovate Cream 20g", "Corticosteroid — for eczema, dermatitis, and psoriasis",
         "adult", "7.50", "Skin Care", ["Betnovate"]),
        ("Cetaphil Moisturizer 100g", "Gentle moisturizer for dry and sensitive skin",
         "all", "12.00", "Skin Care", ["Cetaphil"]),
        ("T-Bact Ointment 5g", "Mupirocin antibiotic cream — for bacterial skin infections",
         "adult", "6.00", "Skin Care", ["T-Bact"]),
        ("Clotrimazole Cream 20g", "Antifungal cream — ringworm, athlete's foot, jock itch",
         "all", "4.00", "Skin Care", []),
        ("Sunscreen SPF 50+ 100ml", "Broad-spectrum UV protection — water-resistant gel formula",
         "all", "18.00", "Skin Care", []),
        ("Benzoyl Peroxide Gel 2.5% 20g", "Acne treatment — kills bacteria and unclogs pores",
         "adult", "5.50", "Skin Care", []),
        ("Calamine Lotion 100ml", "Soothing lotion for itching, rashes, and insect bites",
         "all", "2.50", "Skin Care", []),

        # ─ Heart & BP ──────────────────────────────────────────────────────
        ("Amlodipine 5mg", "Calcium channel blocker — first-line for hypertension",
         "adult", "4.00", "Heart & BP", []),
        ("Atenolol 50mg", "Beta blocker — lowers BP and heart rate, prevents angina",
         "adult", "3.50", "Heart & BP", ["Aten"]),
        ("Atorvastatin 10mg", "Statin — lowers LDL cholesterol, prevents heart attacks",
         "adult", "6.00", "Heart & BP", []),
        ("Losartan 50mg", "ARB class — kidney-protective BP medication for diabetics",
         "adult", "5.50", "Heart & BP", []),
        ("Aspirin + Clopidogrel", "Dual antiplatelet — post-stent or post-heart attack prevention",
         "adult", "8.00", "Heart & BP", []),

        # ─ Respiratory ─────────────────────────────────────────────────────
        ("Salbutamol Inhaler 200 doses", "Blue rescue inhaler — instant bronchodilation for asthma",
         "adult", "12.00", "Respiratory", []),
        ("Foracort Inhaler 120 doses", "Budesonide + formoterol — daily asthma controller",
         "adult", "22.00", "Respiratory", ["Foracort"]),
        ("Montelukast + Levocetirizine", "Allergic asthma and rhinitis combo tablet",
         "adult", "9.00", "Respiratory", []),
        ("Nebulizer Solution 5ml x 10", "Salbutamol + ipratropium — for nebulizer machine",
         "all", "15.00", "Respiratory", []),

        # ─ Eye & Ear Care ──────────────────────────────────────────────────
        ("Refresh Tears Eye Drops 10ml", "Artificial tears — lubricating drops for dry eyes",
         "all", "8.00", "Eye & Ear Care", ["Refresh Tears"]),
        ("Ciprofloxacin Eye Drops 5ml", "Antibiotic eye drops for bacterial conjunctivitis",
         "all", "4.50", "Eye & Ear Care", ["Ciplox Eye"]),
        ("Ciprofloxacin Ear Drops 5ml", "Antibiotic ear drops for otitis externa",
         "all", "5.00", "Eye & Ear Care", ["Ciplox"]),
        ("Ketorolac Eye Drops 5ml", "NSAID eye drops — post-cataract surgery inflammation",
         "adult", "6.50", "Eye & Ear Care", []),
        ("Ear Wax Removal Drops 10ml", "Carbamide peroxide — softens and removes ear wax",
         "all", "3.00", "Eye & Ear Care", []),

        # ─ Women's Health ──────────────────────────────────────────────────
        ("Folic Acid 5mg", "Essential for pregnancy — prevents neural tube defects",
         "adult", "1.50", "Women's Health", ["Folvite"]),
        ("Iron Sucrose Injection 100mg", "IV iron for pregnancy anemia when oral iron fails",
         "adult", "20.00", "Women's Health", []),
        ("Calcium + Vitamin D3 (Prenatal)", "High-potency calcium for pregnancy and breastfeeding",
         "adult", "10.00", "Women's Health", []),
        ("Mefenamic Acid + Dicyclomine", "Menstrual cramp relief — NSAID + antispasmodic combo",
         "adult", "4.50", "Women's Health", []),
        ("Evening Primrose Oil 500mg", "Hormonal balance — PMS and menopause support",
         "adult", "12.00", "Women's Health", []),

        # ─ Baby & Child Care ───────────────────────────────────────────────
        ("Paracetamol 125mg Drops 15ml", "Infant fever drops — banana flavor, graduated dropper",
         "infant", "1.80", "Baby & Child Care", ["Calpol"]),
        ("Paracetamol 250mg Syrup 60ml", "Child fever syrup — mixed fruit flavor, 5ml dosing cup",
         "child", "2.20", "Baby & Child Care", ["Crocin", "Calpol"]),
        ("Ibuprofen 100mg Syrup 60ml", "Pediatric NSAID — for fever unresponsive to paracetamol",
         "child", "3.00", "Baby & Child Care", []),
        ("Multivitamin Drops 15ml", "Infant ACD vitamins — essential for growth and immunity",
         "infant", "5.50", "Baby & Child Care", ["Zincovit"]),
        ("Zinc Dispersible Tablet 20mg", "WHO-recommended zinc for childhood diarrhea",
         "child", "0.80", "Baby & Child Care", []),
        ("ORS Pediatric 200ml", "Ready-to-drink ORS — apple flavor, for diarrhea management",
         "child", "2.00", "Baby & Child Care", ["Electral"]),
        ("Diaper Rash Cream 50g", "Zinc oxide barrier cream — prevents and treats diaper rash",
         "infant", "4.50", "Baby & Child Care", []),
        ("Saline Nasal Drops 10ml", "0.65% saline — gentle nasal decongestion for infants",
         "infant", "1.50", "Baby & Child Care", []),
    ]

    for name, purpose, age_group, price, cat_name, brand_names in medicines_data:
        med = Medicine(
            name=name,
            purpose=purpose,
            age_group=age_group,
            price=Decimal(price),
            in_stock=True,
            category_id=categories[cat_name].id,
        )
        db.add(med)
        db.flush()

        for brand_name in brand_names:
            if brand_name in brands:
                mb = MedicineBrand(
                    medicine_id=med.id,
                    brand_id=brands[brand_name].id,
                    price_override=None,
                )
                db.add(mb)

    db.commit()
    db.close()
    print(f"Database seeded: {len(categories_data)} categories, {len(brands_data)} brands, {len(medicines_data)} medicines")


if __name__ == "__main__":
    seed()
