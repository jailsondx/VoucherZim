@echo off
setlocal EnableExtensions
chcp 65001 >nul
title VoucherZim - PM2

cd /d "%~dp0"

where pm2 >nul 2>nul
if errorlevel 1 (
  echo [ERRO] PM2 nao encontrado. Instale com: npm install -g pm2
  pause
  exit /b 1
)

echo Iniciando VoucherZim no PM2...
call pm2 startOrRestart ecosystem.config.cjs
call pm2 save
echo.
call pm2 status
echo.
echo Frontend: http://localhost:5004
echo Para ver os logs: pm2 logs
pause
