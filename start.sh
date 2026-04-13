#!/bin/bash

# Kill all child processes if the script is interrupted (Ctrl+C)
trap "kill 0" SIGINT

echo "🚀 Starting GravityFlow Backend (Port 5000)..."
cd backend
npm run dev &
BACKEND_PID=$!

echo "🚀 Starting GravityFlow Frontend (Port 5173)..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

cd ..

echo "✅ Both servers are starting up! Press Ctrl+C to stop them both."

# Wait for background processes to prevent the terminal from closing
wait $BACKEND_PID $FRONTEND_PID
