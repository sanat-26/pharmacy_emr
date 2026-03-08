from sqlalchemy.orm import Session
import models, schemas
from datetime import datetime

# Medicines
def get_medicines(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Medicine).offset(skip).limit(limit).all()

def create_medicine(db: Session, medicine: schemas.MedicineCreate):
    db_medicine = models.Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

def update_medicine(db: Session, medicine_id: int, medicine_update: schemas.MedicineUpdate):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not db_medicine:
        return None
    for key, value in medicine_update.model_dump(exclude_unset=True).items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

# Dashboard
def get_dashboard_summary(db: Session):
    total_sales = db.query(models.Sale).count()
    total_sales_amount = sum([s.total_amount for s in db.query(models.Sale).all()])
    items_sold = sum([s.items_count for s in db.query(models.Sale).all()])
    low_stock = db.query(models.Medicine).filter(models.Medicine.status == "Low Stock").count()
    purchase_orders = db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status == "Pending").count()
    total_po_amount = sum([p.amount for p in db.query(models.PurchaseOrder).filter(models.PurchaseOrder.status == "Pending").all()])

    return {
        "today_sales": total_sales_amount,
        "items_sold_today": items_sold,
        "low_stock_items": low_stock,
        "purchase_orders": total_po_amount,
        "pending_po_count": purchase_orders,
        "total_active_stock": db.query(models.Medicine).filter(models.Medicine.status == "Active").count(),
        "total_inventory_value": sum([m.quantity * m.cost_price for m in db.query(models.Medicine).all()])
    }

def get_recent_sales(db: Session, limit: int = 5):
    return db.query(models.Sale).order_by(models.Sale.date.desc()).limit(limit).all()

def create_sale(db: Session, sale: schemas.SaleCreate):
    # Calculate totals
    total_amount = 0.0
    items_count = 0
    
    # Check and deduct inventory
    for item in sale.items:
        db_medicine = db.query(models.Medicine).filter(models.Medicine.id == item.medicine_id).first()
        if db_medicine and db_medicine.quantity >= item.quantity:
            db_medicine.quantity -= item.quantity
            # Simple stock status check
            if db_medicine.quantity == 0:
                db_medicine.status = "Out of Stock"
            elif db_medicine.quantity < 10:
                db_medicine.status = "Low Stock"
                
            total_amount += (db_medicine.mrp * item.quantity)
            items_count += item.quantity
            
    # Create the sale record
    invoice_no = f"INV-{datetime.utcnow().year}-{datetime.utcnow().strftime('%H%M%S')}"
    db_sale = models.Sale(
        invoice_no=invoice_no,
        patient_id=sale.patient_id,
        items_count=items_count,
        total_amount=total_amount,
        payment_method=sale.payment_method,
        status="Completed"
    )
    db.add(db_sale)
    db.commit()
    db.refresh(db_sale)
    return db_sale

def create_purchase_order(db: Session, po: schemas.PurchaseOrderCreate):
    order_no = f"PO-{datetime.utcnow().year}-{datetime.utcnow().strftime('%H%M%S')}"
    db_po = models.PurchaseOrder(
        order_no=order_no,
        supplier=po.supplier,
        amount=po.amount,
        status="Pending"
    )
    db.add(db_po)
    db.commit()
    db.refresh(db_po)
    return db_po

