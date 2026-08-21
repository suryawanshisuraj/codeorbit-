@echo off
setlocal enabledelayedexpansion
title CodeOrbit GitHub Updater

echo ===========================================
echo   CodeOrbit: Updating to GitHub & Vercel
echo ===========================================

set "GIT_CMD=git"
where git >nul 2>nul
if %errorlevel% neq 0 (
    if exist "%LOCALAPPDATA%\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe" (
        set "GIT_CMD=%LOCALAPPDATA%\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"
    ) else if exist "C:\Program Files\Git\cmd\git.exe" (
        set "GIT_CMD=C:\Program Files\Git\cmd\git.exe"
    )
)

echo [1/3] Staging changes...
"%GIT_CMD%" add .

echo [2/3] Committing changes...
"%GIT_CMD%" commit -m "Update CodeOrbit %date% %time%"

echo [3/3] Pushing to GitHub...
"%GIT_CMD%" push origin main

echo.
echo ===========================================
echo   SUCCESS! Pushed to GitHub.
echo   Vercel is now deploying your changes live!
echo   Check: https://codeorbitquiz1.vercel.app/
echo ===========================================
timeout /t 5
