@echo off
echo ===========================================
echo   CodeOrbit: Auto Updating to GitHub & Vercel
echo ===========================================
git add .
git commit -m "Auto update CodeOrbit %date% %time%"
git push origin main
echo.
echo ===========================================
echo   Done! Pushed to GitHub.
echo   Vercel will redeploy automatically!
echo ===========================================
pause
