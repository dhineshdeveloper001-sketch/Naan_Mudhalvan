@echo off
echo 🚀 Starting GravityFlow in Local Environment...

:: Start Backend in a new window
echo Starting Backend (Port 5000)...
start "GravityFlow Backend" cmd /c "cd backend && npm run dev"

:: Start Frontend in a new window
echo Starting Frontend (Port 5173)...
start "GravityFlow Frontend" cmd /c "cd frontend && npm run dev"

echo ✅ Servers are starting in separate windows. Close those windows to stop the servers.
pause
