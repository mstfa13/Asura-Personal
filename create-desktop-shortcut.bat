@echo off
echo Creating Desktop Shortcut for Asura Life Tracker...

set "shortcutName=Asura Life Tracker"
set "targetPath=%~dp0start-asura.bat"
set "iconPath=%~dp0public\Asura-png.png"
set "desktopPath=%USERPROFILE%\Desktop"

powershell -Command "& {$ws = New-Object -ComObject WScript.Shell; $s = $ws.CreateShortcut('%desktopPath%\%shortcutName%.lnk'); $s.TargetPath = '%targetPath%'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = '%iconPath%'; $s.Description = 'Launch Asura Life Tracker'; $s.Save()}"

if exist "%desktopPath%\%shortcutName%.lnk" (
    echo Desktop shortcut created successfully!
    echo You can now double-click "%shortcutName%" on your desktop to start the app.
) else (
    echo Failed to create desktop shortcut.
)

echo.
pause
