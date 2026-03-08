from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import dashboard, inventory

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pharmacy CRM API")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router)
app.include_router(inventory.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Pharmacy CRM API"}
