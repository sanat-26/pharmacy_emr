from pydantic import BaseModel, Field, field_validator, ValidationInfo
from typing import Optional, List
from datetime import datetime

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=1)
    generic_name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    batch_no: str = Field(..., min_length=1)
    expiry_date: str
    quantity: int = Field(..., ge=0)
    cost_price: float = Field(..., ge=0)
    mrp: float = Field(..., ge=0)
    supplier: str = Field(..., min_length=1)
    status: str

class MedicineCreate(MedicineBase):
    @field_validator('expiry_date')
    @classmethod
    def validate_expiry_date(cls, v: str) -> str:
        try:
            # Parse YYYY-MM-DD
            exp_date = datetime.strptime(v, "%Y-%m-%d").date()
            if exp_date <= datetime.now().date():
                raise ValueError("Expiry date must be in the future")
            return v
        except ValueError as e:
            if "does not match format" in str(e):
                raise ValueError("Incorrect data format, should be YYYY-MM-DD")
            raise e

    @field_validator('mrp')
    @classmethod
    def validate_mrp(cls, v: float, info: ValidationInfo) -> float:
        if 'cost_price' in info.data and v < info.data['cost_price']:
            raise ValueError("MRP cannot be less than cost price")
        return v

class MedicineUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1)
    generic_name: Optional[str] = Field(None, min_length=1)
    category: Optional[str] = Field(None, min_length=1)
    batch_no: Optional[str] = Field(None, min_length=1)
    expiry_date: Optional[str] = None
    quantity: Optional[int] = Field(None, ge=0)
    cost_price: Optional[float] = Field(None, ge=0)
    mrp: Optional[float] = Field(None, ge=0)
    supplier: Optional[str] = Field(None, min_length=1)
    status: Optional[str] = None

    @field_validator('expiry_date')
    @classmethod
    def validate_expiry_date(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        try:
            # Just validate format for updates to allow existing expired data to be updated
            datetime.strptime(v, "%Y-%m-%d").date()
            return v
        except ValueError as e:
            if "does not match format" in str(e):
                raise ValueError("Incorrect data format, should be YYYY-MM-DD")
            raise e

    @field_validator('mrp')
    @classmethod
    def validate_mrp(cls, v: Optional[float], info: ValidationInfo) -> Optional[float]:
        if v is not None and 'cost_price' in info.data and info.data['cost_price'] is not None:
            if v < info.data['cost_price']:
                raise ValueError("MRP cannot be less than cost price")
        return v

class MedicineResponse(MedicineBase):
    id: int

    class Config:
        from_attributes = True

class SaleItem(BaseModel):
    medicine_id: int
    quantity: int

class SaleCreate(BaseModel):
    patient_id: Optional[str] = None
    payment_method: str
    items: List[SaleItem]

class SaleResponse(BaseModel):
    id: int
    invoice_no: str
    patient_id: Optional[str]
    items_count: int
    total_amount: float
    payment_method: str
    date: datetime
    status: str

    class Config:
        from_attributes = True

class PurchaseOrderCreate(BaseModel):
    supplier: str
    amount: float

class PurchaseOrderResponse(BaseModel):
    id: int
    order_no: str
    supplier: str
    amount: float
    status: str
    date: datetime

    class Config:
        from_attributes = True
