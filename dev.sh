#!/bin/bash

# Prepend local Node.js bin to PATH
export PATH="/Users/mridulavengathattil/Downloads/Dryway/.node/bin:$PATH"

echo "=========================================================="
echo "          DRYWAY MERN DEVELOPER ENVIRONMENT               "
echo "=========================================================="

# Trap SIGINT and SIGTERM to clean up background server processes
cleanup() {
    echo ""
    echo "Gracefully terminating Dryway servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}
trap cleanup SIGINT SIGTERM

# 1. Start Backend
echo "Launching Express Backend Server (Port 5001)..."
cd backend
npm run start &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "Launching Vite React Frontend Server (Port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "=========================================================="
echo "  ✓ Backend API running at: http://localhost:5001"
echo "  ✓ Frontend Application running at: http://localhost:5173"
echo "  ✓ Press Ctrl+C to terminate both servers."
echo "=========================================================="

# Keep shell open and wait for child process exits
wait
