@echo off
title Mathfingers Auto-Deploy to Production
powershell -ExecutionPolicy Bypass -File "%~dp0deploy.ps1"
echo.
pause
