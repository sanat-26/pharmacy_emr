from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import crud, models, schemas
from database import get_db

router = APIRouter(
    prefix="/api/inventory",
    tags=["inventory"]
)

@router.get("/medicines", response_model=List[schemas.MedicineResponse])
def read_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    medicines = crud.get_medicines(db, skip=skip, limit=limit)
    return medicines

@router.post("/medicines", response_model=schemas.MedicineResponse)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    return crud.create_medicine(db=db, medicine=medicine)

@router.put("/medicines/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(medicine_id: int, medicine_update: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    db_medicine = crud.update_medicine(db, medicine_id, medicine_update)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return db_medicine

@router.patch("/medicines/{medicine_id}/status", response_model=schemas.MedicineResponse)
def update_medicine_status(medicine_id: int, status: str, db: Session = Depends(get_db)):
    # Quick patch just for status
    from schemas import MedicineUpdate
    update_data = MedicineUpdate(status=status)
    db_medicine = crud.update_medicine(db, medicine_id, update_data)
    if db_medicine is None:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return db_medicine
