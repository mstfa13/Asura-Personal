@echo off
echo Starting Asura Life Tracker (Development Mode)...
echo.
echo ===============================================
echo   Asura Life Tracker is starting...
echo   This will open in your browser automatically
echo   Press Ctrl+C to stop the server
echo ===============================================
echo.

start http://localhost:5173
call npm run dev

pause
