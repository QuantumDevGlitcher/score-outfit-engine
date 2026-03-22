# SCORE Outfit Engine - Unified Start Script (PowerShell)

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location } # Fallback if not run as a script
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SCORE OUTFIT ENGINE - INITIALIZER   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Start MongoDB
Write-Host ">>> [1/3] Starting MongoDB..." -ForegroundColor Yellow
docker start score-mongo 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "!! MongoDB container 'score-mongo' not found or failed to start." -ForegroundColor Red
    Write-Host "!! If it's your first time, run: docker run -d --name score-mongo -p 27018:27017 mongo" -ForegroundColor Gray
}

# 2. Start ML Service (Python)
Write-Host ">>> [2/3] Starting ML Service (Port 8001)..." -ForegroundColor Yellow
$mlCmd = "Set-Location '$root\ml-service'; if (Test-Path '.\venv\Scripts\activate') { .\venv\Scripts\activate; uvicorn main:app --host 127.0.0.1 --port 8001 } else { Write-Error 'Virtual environment not found in ml-service/venv'; pause }"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { $mlCmd }"

# 3. Start Frontend & Express
Write-Host ">>> [3/3] Starting Frontend & Express (Port 8080)..." -ForegroundColor Yellow
$nodeCmd = "Set-Location '$root'; pnpm dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "& { $nodeCmd }"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " All services are initializing!" -ForegroundColor Green
Write-Host " - Web UI:    http://localhost:8080"
Write-Host " - ML API:    http://127.0.0.1:8001"
Write-Host " - ML Health: http://127.0.0.1:8001/health"
Write-Host "========================================" -ForegroundColor Cyan
