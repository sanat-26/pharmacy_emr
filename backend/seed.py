from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from datetime import datetime, timedelta
import random

def seed_database():
    print("Connecting to database...")
    db: Session = SessionLocal()
    
    try:
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        
        print("Clearing existing data...")
        db.query(models.Sale).delete()
        db.query(models.PurchaseOrder).delete()
        db.query(models.Medicine).delete()
        db.commit()

        print("Seeding Medicines...")
        medicines_data = [
            {"name": "Paracetamol 650mg", "generic_name": "Acetaminophen", "category": "Analgesic", "batch_no": "PCM-2024-0892", "expiry_date": "2026-08-20", "quantity": 400, "cost_price": 15.00, "mrp": 25.00, "supplier": "MedSupply Co.", "status": "Active"},
            {"name": "Omeprazole 20mg Capsule", "generic_name": "Omeprazole", "category": "Gastric", "batch_no": "OMP-2024-5873", "expiry_date": "2025-11-10", "quantity": 45, "cost_price": 65.00, "mrp": 95.75, "supplier": "HealthCare Ltd.", "status": "Active"},
            {"name": "Amoxicillin 500mg", "generic_name": "Amoxicillin", "category": "Antibiotic", "batch_no": "AMX-2024-1102", "expiry_date": "2025-05-15", "quantity": 120, "cost_price": 85.00, "mrp": 120.00, "supplier": "PharmaCorp", "status": "Active"},
            {"name": "Cetirizine 10mg", "generic_name": "Cetirizine", "category": "Antihistamine", "batch_no": "CET-2023-9901", "expiry_date": "2026-01-20", "quantity": 350, "cost_price": 12.00, "mrp": 22.00, "supplier": "MedSupply Co.", "status": "Active"},
            {"name": "Atorvastatin 10mg", "generic_name": "Atorvastatin", "category": "Cardiovascular", "batch_no": "ATR-2024-0012", "expiry_date": "2025-10-10", "quantity": 8, "cost_price": 145.00, "mrp": 195.00, "supplier": "HeartCare Meds", "status": "Low Stock"}, # Low stock trigger
            {"name": "Azithromycin 500mg", "generic_name": "Azithromycin", "category": "Antibiotic", "batch_no": "AZI-2024-5544", "expiry_date": "2026-03-12", "quantity": 0, "cost_price": 110.00, "mrp": 150.00, "supplier": "PharmaCorp", "status": "Out of Stock"}, # Out of stock
            {"name": "Pantoprazole 40mg", "generic_name": "Pantoprazole", "category": "Gastric", "batch_no": "PAN-2023-8877", "expiry_date": "2025-12-01", "quantity": 210, "cost_price": 45.00, "mrp": 75.00, "supplier": "HealthCare Ltd.", "status": "Active"},
            {"name": "Ciprofloxacin 500mg", "generic_name": "Ciprofloxacin", "category": "Antibiotic", "batch_no": "CIP-2024-2233", "expiry_date": "2026-07-15", "quantity": 180, "cost_price": 55.00, "mrp": 85.00, "supplier": "LifeSciences Inc.", "status": "Active"},
            {"name": "Metformin 500mg", "generic_name": "Metformin", "category": "Anti-Diabetic", "batch_no": "MET-2024-1122", "expiry_date": "2025-09-30", "quantity": 4, "cost_price": 35.00, "mrp": 55.00, "supplier": "DiabetesCare", "status": "Low Stock"}, # Low stock
            {"name": "Losartan 50mg", "generic_name": "Losartan", "category": "Cardiovascular", "batch_no": "LOS-2024-4455", "expiry_date": "2026-04-20", "quantity": 150, "cost_price": 60.00, "mrp": 90.00, "supplier": "HeartCare Meds", "status": "Active"},
            {"name": "Levocetirizine 5mg", "generic_name": "Levocetirizine", "category": "Antihistamine", "batch_no": "LEV-2023-7766", "expiry_date": "2025-08-10", "quantity": 280, "cost_price": 18.00, "mrp": 30.00, "supplier": "MedSupply Co.", "status": "Active"},
            {"name": "Vitamin C 500mg", "generic_name": "Ascorbic Acid", "category": "Supplement", "batch_no": "VIT-2024-9988", "expiry_date": "2026-11-25", "quantity": 500, "cost_price": 20.00, "mrp": 40.00, "supplier": "HealthVitals", "status": "Active"},
            {"name": "Ibuprofen 400mg", "generic_name": "Ibuprofen", "category": "Analgesic", "batch_no": "IBU-2024-3344", "expiry_date": "2025-06-18", "quantity": 0, "cost_price": 25.00, "mrp": 45.00, "supplier": "PainRelief Inc.", "status": "Out of Stock"}, # Out of stock
            {"name": "B-Complex Syrup", "generic_name": "B-Vitamins", "category": "Supplement", "batch_no": "BCO-2023-5566", "expiry_date": "2025-10-05", "quantity": 60, "cost_price": 45.00, "mrp": 80.00, "supplier": "HealthVitals", "status": "Active"},
            {"name": "Diclofenac Gel", "generic_name": "Diclofenac", "category": "Topical", "batch_no": "DIC-2024-1199", "expiry_date": "2026-02-28", "quantity": 85, "cost_price": 50.00, "mrp": 90.00, "supplier": "PainRelief Inc.", "status": "Active"}
        ]

        db_medicines = []
        for med_data in medicines_data:
            med = models.Medicine(**med_data)
            db.add(med)
            db_medicines.append(med)
        
        db.commit()
        for med in db_medicines:
            db.refresh(med)
        
        print("Seeding Sales...")
        # Create some fake sales for today
        for i in range(5):
            med1 = random.choice(db_medicines)
            med2 = random.choice(db_medicines)
            
            qty1 = random.randint(1, 3)
            qty2 = random.randint(1, 2)
            
            total = (med1.mrp * qty1) + (med2.mrp * qty2)
            
            sale = models.Sale(
                invoice_no=f"INV-2024-100{i+1}",
                patient_id=f"Patient {random.randint(100, 999)}",
                items_count=qty1 + qty2,
                total_amount=total,
                payment_method=random.choice(["Cash", "Card", "UPI"]),
                date=datetime.utcnow() - timedelta(hours=random.randint(1, 8)),
                status="Completed"
            )
            db.add(sale)
            
        print("Seeding Purchase Orders...")
        po1 = models.PurchaseOrder(
            order_no="PO-2024-8801",
            supplier="PharmaCorp",
            amount=15000.00,
            status="Pending",
            date=datetime.utcnow() - timedelta(days=2)
        )
        po2 = models.PurchaseOrder(
            order_no="PO-2024-8802",
            supplier="HeartCare Meds",
            amount=8500.00,
            status="Pending",
            date=datetime.utcnow() - timedelta(days=1)
        )
        db.add(po1)
        db.add(po2)
        
        db.commit()
        print("Done: Database successfully seeded with rich dummy data!")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
