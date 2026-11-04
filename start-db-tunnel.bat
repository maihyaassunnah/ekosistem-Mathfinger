@echo off
title Ekosistem Mathfingers - SSH DB Tunnel
echo ========================================================
echo  MENGHUBUNGKAN LOCALHOST KE DATABASE POSTGRESQL VPS
echo ========================================================
echo Host VPS : 43.173.12.46 (User: ubuntu)
echo Port DB  : localhost:5432 -^> VPS:5432
echo.
echo Menghubungkan tunnel menggunakan SSH key...
echo (Biarkan jendela ini tetap terbuka selama membuka localhost)
echo ========================================================
ssh -N -L 5432:127.0.0.1:5432 -o ServerAliveInterval=30 -o ServerAliveCountMax=3 ubuntu@43.173.12.46
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Koneksi SSH terputus atau gagal.
)
pause
