from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import crud, schemas
from database import get_db

router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"]
)

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    return crud.get_dashboard_summary(db)

@router.get("/recent-sales", response_model=List[schemas.SaleResponse])
def get_recent_sales_list(limit: int = 5, db: Session = Depends(get_db)):
    return crud.get_recent_sales(db, limit=limit)

@router.post("/sales", response_model=schemas.SaleResponse)
def create_new_sale(sale: schemas.SaleCreate, db: Session = Depends(get_db)):
    return crud.create_sale(db, sale)

@router.post("/purchase-orders", response_model=schemas.PurchaseOrderResponse)
def create_new_purchase_order(po: schemas.PurchaseOrderCreate, db: Session = Depends(get_db)):
    return crud.create_purchase_order(db, po)

