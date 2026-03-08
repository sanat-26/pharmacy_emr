from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    generic_name = Column(String, index=True)
    category = Column(String, index=True)
    batch_no = Column(String, unique=True, index=True)
    expiry_date = Column(String)  # Stored as YYYY-MM-DD
    quantity = Column(Integer, default=0)
    cost_price = Column(Float, default=0.0)
    mrp = Column(Float, default=0.0)
    supplier = Column(String)
    status = Column(String, default="Active")

class Sale(Base):
    __tablename__ = "sales"

    id = Column(Integer, primary_key=True, index=True)
    invoice_no = Column(String, unique=True, index=True)
    patient_id = Column(String, nullable=True)
    items_count = Column(Integer, default=0)
    total_amount = Column(Float, default=0.0)
    payment_method = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Completed")

class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    order_no = Column(String, unique=True, index=True)
    supplier = Column(String)
    amount = Column(Float, default=0.0)
    status = Column(String, default="Pending")
    date = Column(DateTime, default=datetime.datetime.utcnow)
