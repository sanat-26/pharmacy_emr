@echo off
echo ===================================================
echo        Starting Pharmacy CRM Environments
echo ===================================================

echo.
echo [1/2] Starting Python FastAPI Backend...
start "Pharmacy CRM - Backend" cmd /k "cd backend && backend_env\Scripts\activate && uvicorn main:app --reload --port 8000"

echo [2/2] Starting React Vite Frontend...
start "Pharmacy CRM - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Both servers are starting in separate windows!
echo.
echo * Backend API: http://localhost:8000/docs
echo * Frontend UI: http://localhost:5173 (or 5174)
echo ===================================================
echo You can close this window.
