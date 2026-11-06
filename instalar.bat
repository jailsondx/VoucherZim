@echo off
setlocal EnableExtensions
chcp 65001 >nul
title Instalador VoucherZim

rem Uso: instalar.bat [pasta_de_destino]
rem Gera o build do frontend (Next standalone) e monta a pasta do software para rodar no PM2.

set "ORIGEM=%~dp0"
if "%ORIGEM:~-1%"=="\" set "ORIGEM=%ORIGEM:~0,-1%"
set "DESTINO=C:\VoucherZim"
set "COPIA=/NFL /NDL /NJH /NJS /NP"

echo ============================================
echo   Instalador VoucherZim
echo ============================================
echo.

if not "%~1"=="" (
  set "DESTINO=%~1"
) else (
  set /p "ESCOLHA=Pasta de instalacao [%DESTINO%]: "
)
if defined ESCOLHA set "DESTINO=%ESCOLHA%"
echo.
echo Instalando em: %DESTINO%
echo.

rem ---- 1. Pre-requisitos ----
echo [1/6] Verificando pre-requisitos...
where node >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale o Node.js 22 ou superior.
  goto :erro
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] npm nao encontrado.
  goto :erro
)
set "TEM_PM2=1"
where pm2 >nul 2>nul
if errorlevel 1 (
  set "TEM_PM2=0"
  echo [AVISO] PM2 nao encontrado. A instalacao continua, mas sera preciso instalar o PM2 para usar o iniciar-pm2.bat.
)

if not exist "%ORIGEM%\server\.env" (
  echo [ERRO] Arquivo server\.env nao encontrado. Crie a partir de server\exemple.env.
  goto :erro
)
if not exist "%ORIGEM%\client\.env" (
  echo [ERRO] Arquivo client\.env nao encontrado. Crie a partir de client\exemple.env.
  goto :erro
)

rem ---- 2. Build do frontend (feito no projeto) ----
echo [2/6] Gerando o build do frontend...
pushd "%ORIGEM%\client"
if not exist "node_modules" (
  echo Instalando dependencias do frontend...
  call npm ci
  if errorlevel 1 (
    popd
    echo [ERRO] Falha ao instalar as dependencias do frontend.
    goto :erro
  )
)
call npm run build
if errorlevel 1 (
  popd
  echo [ERRO] Falha ao gerar o build do frontend.
  goto :erro
)
popd
if not exist "%ORIGEM%\client\.next\standalone\server.js" (
  echo [ERRO] Build standalone nao encontrado. Confira se o next.config.ts tem output: "standalone".
  goto :erro
)

rem ---- 3. Para os servicos se for uma atualizacao ----
set "ATUALIZACAO=0"
if exist "%DESTINO%\ecosystem.config.cjs" if "%TEM_PM2%"=="1" set "ATUALIZACAO=1"
if "%ATUALIZACAO%"=="1" (
  echo [3/6] Instalacao existente encontrada. Parando servicos no PM2...
  pushd "%DESTINO%"
  call pm2 stop ecosystem.config.cjs >nul 2>nul
  popd
) else (
  echo [3/6] Nenhum servico para parar.
)

rem ---- 4. Backend ----
echo [4/6] Copiando o backend e instalando dependencias...
robocopy "%ORIGEM%\server" "%DESTINO%\server" /E /XD node_modules .git %COPIA% >nul
if errorlevel 8 goto :erro_copia
pushd "%DESTINO%\server"
call npm ci --omit=dev
if errorlevel 1 (
  popd
  echo [ERRO] Falha ao instalar as dependencias do backend.
  goto :erro
)
popd

rem ---- 5. Frontend: so o resultado do build ----
echo [5/6] Copiando o build do frontend...
rem src\data guarda dados gravados pelo sistema em uso: nunca e copiada nem apagada
robocopy "%ORIGEM%\client\.next\standalone" "%DESTINO%\client" /MIR /XD "%ORIGEM%\client\.next\standalone\src\data" "%DESTINO%\client\src\data" %COPIA% >nul
if errorlevel 8 goto :erro_copia
robocopy "%ORIGEM%\client\.next\static" "%DESTINO%\client\.next\static" /MIR %COPIA% >nul
if errorlevel 8 goto :erro_copia
robocopy "%ORIGEM%\client\public" "%DESTINO%\client\public" /MIR %COPIA% >nul
if errorlevel 8 goto :erro_copia

rem ---- 6. Arquivos de execucao ----
echo [6/6] Copiando configuracao do PM2 e guia...
robocopy "%ORIGEM%\instalador" "%DESTINO%" /E %COPIA% >nul
if errorlevel 8 goto :erro_copia

echo.
echo ============================================
echo   Instalacao concluida em: %DESTINO%
echo ============================================
echo   - iniciar-pm2.bat : inicia backend e frontend no PM2
echo   - GUIA.txt        : como iniciar manualmente e comandos uteis
echo.

if "%TEM_PM2%"=="0" goto :fim
set /p "INICIAR=Deseja iniciar os servicos no PM2 agora? [S/N]: "
if /i "%INICIAR%"=="S" call "%DESTINO%\iniciar-pm2.bat"

goto :fim

:erro_copia
echo [ERRO] Falha ao copiar os arquivos para %DESTINO%.

:erro
echo.
echo A instalacao foi interrompida.
pause
exit /b 1

:fim
pause
exit /b 0
