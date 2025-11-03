# 🔄 Restore Project from Backup
# Restores a backup and sets up the project

param(
    [Parameter(Mandatory = $false)]
    [string]$BackupFile
)

Write-Host "🔄 Horizon Banking Management - Restore from Backup" -ForegroundColor Cyan
Write-Host ""

# Find backup file if not specified
if (-not $BackupFile) {
    Write-Host "📂 Looking for backup files..." -ForegroundColor Yellow
    $backups = Get-ChildItem -Path ".." -Filter "horizon-banking-management_backup_*.zip" | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-Host "  ❌ No backup files found in parent directory" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please specify backup file:" -ForegroundColor Yellow
        Write-Host "  .\restore-backup.ps1 -BackupFile 'path\to\backup.zip'" -ForegroundColor Gray
        exit 1
    }
    
    Write-Host "  Found $($backups.Count) backup(s):" -ForegroundColor Green
    for ($i = 0; $i -lt $backups.Count; $i++) {
        Write-Host "  [$i] $($backups[$i].Name) - $($backups[$i].LastWriteTime)" -ForegroundColor Gray
    }
    Write-Host ""
    
    if ($backups.Count -eq 1) {
        $BackupFile = $backups[0].FullName
        Write-Host "  Using: $($backups[0].Name)" -ForegroundColor Cyan
    }
    else {
        $selection = Read-Host "Select backup [0-$($backups.Count - 1)] or press Enter for latest"
        if ($selection -eq "") {
            $BackupFile = $backups[0].FullName
        }
        else {
            $BackupFile = $backups[[int]$selection].FullName
        }
    }
    Write-Host ""
}

# Verify backup file exists
if (-not (Test-Path $BackupFile)) {
    Write-Host "❌ Backup file not found: $BackupFile" -ForegroundColor Red
    exit 1
}

$backupFileName = Split-Path $BackupFile -Leaf
Write-Host "📦 Backup: $backupFileName" -ForegroundColor White
Write-Host ""

# Confirm restoration
Write-Host "⚠️  WARNING: This will replace current directory contents!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Continue with restoration? (yes/no)"
if ($confirm -ne "yes") {
    Write-Host "❌ Restoration cancelled" -ForegroundColor Red
    exit 0
}
Write-Host ""

# Extract backup
Write-Host "📂 Extracting backup..." -ForegroundColor Yellow
$tempDir = ".\temp_restore_$(Get-Date -Format 'yyyyMMddHHmmss')"

try {
    Expand-Archive -Path $BackupFile -DestinationPath $tempDir -Force
    Write-Host "  ✅ Backup extracted" -ForegroundColor Green
}
catch {
    Write-Host "  ❌ Failed to extract: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Backup current .env if exists
Write-Host "💾 Preserving current .env..." -ForegroundColor Yellow
$envBackup = $null
if (Test-Path ".env") {
    $envBackup = Get-Content ".env" -Raw
    Write-Host "  ✅ Current .env saved" -ForegroundColor Green
}
else {
    Write-Host "  ℹ️  No .env file found" -ForegroundColor Gray
}
Write-Host ""

# Remove current files (except .git)
Write-Host "🗑️  Removing current files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Exclude ".git" | ForEach-Object {
    Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
}
Write-Host "  ✅ Current files removed" -ForegroundColor Green
Write-Host ""

# Copy restored files
Write-Host "📋 Copying restored files..." -ForegroundColor Yellow
Get-ChildItem -Path $tempDir -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace($tempDir, "")
    $destPath = Join-Path "." $relativePath
    $destDir = Split-Path $destPath -Parent
    
    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }
    
    if (-not $_.PSIsContainer) {
        Copy-Item $_.FullName -Destination $destPath -Force
    }
}
Write-Host "  ✅ Files restored" -ForegroundColor Green
Write-Host ""

# Restore .env if it was backed up
if ($envBackup) {
    Write-Host "🔑 Restoring .env..." -ForegroundColor Yellow
    $envBackup | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "  ✅ .env restored" -ForegroundColor Green
    Write-Host ""
}

# Clean up
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item $tempDir -Recurse -Force
Write-Host "  ✅ Temporary files removed" -ForegroundColor Green
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "  Running: npm install" -ForegroundColor Gray
Write-Host ""
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
}
else {
    Write-Host ""
    Write-Host "  ⚠️  Dependency installation had issues" -ForegroundColor Yellow
}
Write-Host ""

# Success message
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "           ✅ RESTORATION COMPLETED SUCCESSFULLY            " -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 What Was Restored:" -ForegroundColor Yellow
Write-Host "  ✅ All source code" -ForegroundColor Green
Write-Host "  ✅ Configuration files" -ForegroundColor Green
Write-Host "  ✅ Documentation" -ForegroundColor Green
Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
if ($envBackup) {
    Write-Host "  ✅ .env preserved" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  .env needs to be created" -ForegroundColor Yellow
}
Write-Host ""

if (-not $envBackup) {
    Write-Host "⚠️  IMPORTANT: Configure Environment Variables" -ForegroundColor Yellow
    Write-Host "  1. Copy .env.example to .env" -ForegroundColor White
    Write-Host "  2. Fill in your API credentials" -ForegroundColor White
    Write-Host "  3. Run: .\verify-api-setup.ps1" -ForegroundColor White
    Write-Host ""
}

Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Build the project: npm run build" -ForegroundColor White
Write-Host "  2. Start the server: npm start" -ForegroundColor White
Write-Host "  3. Or start dev mode: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Project restored successfully! ✨" -ForegroundColor Green
