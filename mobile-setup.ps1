$ErrorActionPreference = "SilentlyContinue"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "    ASURA - MOBILE QUICK SETUP" -ForegroundColor Cyan  
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Get local IP
$localIP = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*" | Where-Object {$_.IPAddress -like "192.168.*"})[0].IPAddress
$appUrl = "http://${localIP}:4173/"

Write-Host "🚀 Starting Asura for mobile access..." -ForegroundColor Green
Write-Host ""

# Build the app
Write-Host "📦 Building app..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Build complete!" -ForegroundColor Green
Write-Host ""

# Start server in background
Write-Host "🌐 Starting mobile server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-Command", "npx vite preview --host" -WindowStyle Hidden

# Wait for server to start
Start-Sleep -Seconds 3

Write-Host "📱 MOBILE ACCESS READY!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your mobile URL:" -ForegroundColor White
Write-Host "   $appUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 TO INSTALL ON MOBILE:" -ForegroundColor White
Write-Host "1. Connect phone to same WiFi" -ForegroundColor Gray
Write-Host "2. Open browser and visit the URL above" -ForegroundColor Gray
Write-Host "3. iPhone: Share → 'Add to Home Screen'" -ForegroundColor Gray  
Write-Host "   Android: Menu → 'Install app'" -ForegroundColor Gray
Write-Host ""

# Try to generate QR code using online service
Write-Host "🔍 Generating QR code for easy scanning..." -ForegroundColor Yellow
try {
    $qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=$appUrl"
    Write-Host "📲 QR Code URL: $qrUrl" -ForegroundColor Cyan
    Write-Host "   (Open this in browser to see QR code for scanning)" -ForegroundColor Gray
} catch {
    Write-Host "⚠️  QR code generation skipped" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✨ Features you'll get on mobile:" -ForegroundColor White
Write-Host "   • Native app experience" -ForegroundColor Gray
Write-Host "   • Offline functionality" -ForegroundColor Gray
Write-Host "   • All data synced" -ForegroundColor Gray
Write-Host "   • Home screen icon" -ForegroundColor Gray
Write-Host ""

# Keep server running
Write-Host "🔄 Server is running... Press Ctrl+C to stop" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Wait for user to stop
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "🛑 Stopping server..." -ForegroundColor Yellow
}
