# Quick Start Script - Kills existing process and starts server

Write-Host "🚀 Starting Horizon Banking Management..." -ForegroundColor Cyan

# Try to kill existing process on port 3000
Write-Host "`n🔍 Checking for existing process on port 3000..." -ForegroundColor Yellow
try {
    $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
    if ($process) {
        Write-Host "✅ Found process $process, terminating..." -ForegroundColor Green
        Stop-Process -Id $process -Force
        Start-Sleep -Seconds 2
        Write-Host "✅ Process terminated successfully" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  No existing process found on port 3000" -ForegroundColor Gray
    }
} catch {
    Write-Host "ℹ️  Port 3000 is available" -ForegroundColor Gray
}

# Start the server
Write-Host "`n🚀 Starting Next.js server..." -ForegroundColor Cyan
Write-Host "📊 Watch for [perf] logs to see timing data`n" -ForegroundColor Magenta

npm start
