@echo off
echo Building Asura Life Tracker...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed! Press any key to exit.
    pause
    exit /b 1
)

echo Build successful! Starting local server...
echo.
echo ===============================================
echo   Asura Life Tracker is starting...
echo   Opening in your default browser...
echo   Press Ctrl+C to stop the server
echo ===============================================
echo.

start http://localhost:4173
call npm run preview

pause
