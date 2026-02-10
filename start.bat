@echo off
REM Quick start script for SIG Reciclaje project (Windows)

echo.
echo 🌍 SIG Reciclaje - Quick Start (Windows)
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
  echo ❌ Docker not found. Please install Docker Desktop.
  pause
  exit /b 1
)

echo ✓ Docker found

REM Setup backend env
if not exist "backend\.env" (
  echo 📝 Creating backend\.env from .env.example...
  copy backend\.env.example backend\.env
  echo ⚠️  Edit backend\.env to set JWT_SECRET and ADMIN_EMAIL
)

REM Ensure directories exist
if not exist "backend\sql" mkdir backend\sql
if not exist "frontend\src" mkdir frontend\src

echo.
echo 🚀 Starting services with Docker Compose...
echo    - PostgreSQL with PostGIS on port 5432
echo    - Backend API on port 4000
echo    - Frontend on port 3000
echo.

docker compose up --build

echo.
echo ✓ Services started!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:4000
echo   Database: localhost:5432
echo.
pause
