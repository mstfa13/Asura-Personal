@echo off
echo ====================================
echo    ASURA - MOBILE SETUP GUIDE
echo ====================================
echo.
echo Your Asura app is now running and accessible on mobile!
echo.
echo STEP 1: Connect your phone to the same WiFi network as this computer
echo.
echo STEP 2: Open any browser on your phone and go to:
echo    http://192.168.1.13:4173/
echo.
echo STEP 3: Install as mobile app:
echo    iPhone: Tap Share button → "Add to Home Screen"
echo    Android: Tap menu (⋮) → "Add to Home screen" or "Install app"
echo.
echo FEATURES YOU'LL GET:
echo ✓ Full offline functionality
echo ✓ Native app experience  
echo ✓ All your data synced
echo ✓ Push to home screen
echo ✓ Works without internet
echo.
echo Alternative URL (if first doesn't work):
echo    http://192.168.137.1:4173/
echo.
echo Press any key to start the server...
pause >nul

npm run build
if errorlevel 1 (
    echo Build failed! Check for errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Build complete! Starting mobile server...
echo.
npx vite preview --host
