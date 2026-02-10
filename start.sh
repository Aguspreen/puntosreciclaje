#!/bin/bash
# Quick start script for SIG Reciclaje project

echo "🌍 SIG Reciclaje - Quick Start"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Please install Docker Desktop."
  exit 1
fi

echo "✓ Docker found"

# Setup backend env
if [ ! -f "backend/.env" ]; then
  echo "📝 Creating backend/.env from .env.example..."
  cp backend/.env.example backend/.env
  echo "⚠️  Edit backend/.env to set JWT_SECRET and ADMIN_EMAIL"
fi

# Ensure directories exist
mkdir -p backend/sql
mkdir -p frontend/src

echo ""
echo "🚀 Starting services with Docker Compose..."
echo "   - PostgreSQL with PostGIS on port 5432"
echo "   - Backend API on port 4000"
echo "   - Frontend on port 3000"
echo ""

docker compose up --build

echo ""
echo "✓ Services started!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:4000"
echo "  Database: localhost:5432"
