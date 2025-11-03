# 📦 Create Educational Project Backup
# Creates a complete backup ZIP file including .env credentials
# ⚠️ FOR EDUCATIONAL USE ONLY - DO NOT SHARE PUBLICLY

Write-Host "📦 Creating Educational Project Backup..." -ForegroundColor Cyan
Write-Host "⚠️  WARNING: This backup includes .env file with API credentials" -ForegroundColor Yellow
Write-Host "   For educational purposes only - Keep private!" -ForegroundColor Yellow
Write-Host ""

# Configuration
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$projectName = "horizon-banking-management"
$backupName = "${projectName}_backup_${timestamp}"
$backupDir = "..\${backupName}"
$zipFile = "..\${backupName}.zip"

# Files and folders to EXCLUDE from backup
# NOTE: .env is INCLUDED for educational purposes
$excludeItems = @(
    "node_modules",
    ".next",
    ".git",
    ".vercel",
    "*.log",
    "*.tsbuildinfo"
    # .env is INCLUDED (educational project)
)

Write-Host "📋 Backup Configuration:" -ForegroundColor Yellow
Write-Host "  Project: $projectName" -ForegroundColor Gray
Write-Host "  Backup Name: $backupName" -ForegroundColor Gray
Write-Host "  Location: $zipFile" -ForegroundColor Gray
Write-Host ""

# Create temporary backup directory
Write-Host "📁 Creating temporary backup directory..." -ForegroundColor Yellow
if (Test-Path $backupDir) {
    Remove-Item $backupDir -Recurse -Force
}
New-Item -ItemType Directory -Path $backupDir | Out-Null
Write-Host "  ✅ Created: $backupDir" -ForegroundColor Green
Write-Host ""

# Copy files (excluding unnecessary items)
Write-Host "📄 Copying project files..." -ForegroundColor Yellow
$itemCount = 0

Get-ChildItem -Path . -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Location).Path, "")
    $shouldExclude = $false
    
    # Check if item should be excluded
    foreach ($exclude in $excludeItems) {
        if ($relativePath -like "*$exclude*" -or $_.Name -like $exclude) {
            $shouldExclude = $true
            break
        }
    }
    
    if (-not $shouldExclude) {
        $destPath = Join-Path $backupDir $relativePath
        $destDir = Split-Path $destPath -Parent
        
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        if (-not $_.PSIsContainer) {
            Copy-Item $_.FullName -Destination $destPath -Force
            $itemCount++
            
            if ($itemCount % 50 -eq 0) {
                Write-Host "  Copied $itemCount files..." -ForegroundColor Gray
            }
        }
    }
}

Write-Host "  ✅ Copied $itemCount files" -ForegroundColor Green
Write-Host ""

# Create .env.example copy for reference
Write-Host "📝 Creating environment template..." -ForegroundColor Yellow
if (Test-Path ".env.example") {
    Copy-Item ".env.example" -Destination "$backupDir\.env.example" -Force
    Write-Host "  ✅ .env.example included" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  .env.example not found" -ForegroundColor Yellow
}
Write-Host ""

# Create backup info file
Write-Host "📋 Creating backup information file..." -ForegroundColor Yellow
$backupInfo = @"
# Horizon Banking Management - Backup Information

**Created:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Branch:** main
**Status:** Production Ready
**Purpose:** Educational Project

## ⚠️ IMPORTANT: Educational Use Only

This backup includes the .env file with API credentials.
**DO NOT share this backup publicly or on GitHub!**

## What's Included

- ✅ All source code
- ✅ Configuration files
- ✅ Documentation
- ✅ Deployment guides
- ✅ Package dependencies list
- ✅ .env file (API credentials included)
- ✅ .env.example template

## What's Excluded

- ❌ node_modules (reinstall with: npm install)
- ❌ .next build cache (rebuild with: npm run build)
- ❌ .git history
- ❌ Log files

## How to Restore

1. Extract this ZIP file
2. .env file is already included (no need to copy)
3. Run: npm install
4. Run: npm run build
5. Run: npm start

## Environment Variables Included

✅ .env file with all credentials is included in this backup:
- Next.js configuration
- Appwrite credentials (Cloud database)
- Plaid API credentials (Sandbox mode)
- Dwolla API credentials (Sandbox mode)

All APIs are in sandbox/development mode - safe for educational use.

## Deployment

Follow the guides in the backup:
- START_DEPLOYMENT_HERE.md
- VERCEL_DEPLOYMENT_GUIDE.md
- QUICK_DEPLOY.md

## Support

All documentation is included in this backup.

---
Backup created by: backup-project.ps1
"@

$backupInfo | Out-File -FilePath "$backupDir\BACKUP_INFO.md" -Encoding UTF8
Write-Host "  ✅ BACKUP_INFO.md created" -ForegroundColor Green
Write-Host ""

# Calculate backup size
Write-Host "📊 Calculating backup size..." -ForegroundColor Yellow
$size = (Get-ChildItem -Path $backupDir -Recurse | Measure-Object -Property Length -Sum).Sum
$sizeMB = [math]::Round($size / 1MB, 2)
Write-Host "  Size: $sizeMB MB" -ForegroundColor Gray
Write-Host ""

# Create ZIP file
Write-Host "🗜️  Creating ZIP archive..." -ForegroundColor Yellow
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

try {
    Compress-Archive -Path "$backupDir\*" -DestinationPath $zipFile -CompressionLevel Optimal
    Write-Host "  ✅ ZIP created successfully" -ForegroundColor Green
}
catch {
    Write-Host "  ❌ Failed to create ZIP: $_" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Clean up temporary directory
Write-Host "🧹 Cleaning up..." -ForegroundColor Yellow
Remove-Item $backupDir -Recurse -Force
Write-Host "  ✅ Temporary files removed" -ForegroundColor Green
Write-Host ""

# Verify ZIP file
Write-Host "✅ Verifying backup..." -ForegroundColor Yellow
if (Test-Path $zipFile) {
    $zipSize = (Get-Item $zipFile).Length
    $zipSizeMB = [math]::Round($zipSize / 1MB, 2)
    Write-Host "  ✅ Backup verified" -ForegroundColor Green
    Write-Host "  Size: $zipSizeMB MB (compressed)" -ForegroundColor Gray
}
else {
    Write-Host "  ❌ Backup verification failed" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Success summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "              ✅ BACKUP COMPLETED SUCCESSFULLY              " -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Backup Details:" -ForegroundColor Yellow
Write-Host "  File: $zipFile" -ForegroundColor White
Write-Host "  Size: $zipSizeMB MB" -ForegroundColor White
Write-Host "  Files: $itemCount" -ForegroundColor White
Write-Host "  Created: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor White
Write-Host ""
Write-Host "📍 Location:" -ForegroundColor Yellow
Write-Host "  $(Resolve-Path $zipFile)" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  SECURITY NOTICE:" -ForegroundColor Yellow
Write-Host "  This backup includes .env file with API credentials" -ForegroundColor White
Write-Host "  For educational purposes only - Keep private!" -ForegroundColor White
Write-Host ""
Write-Host "💡 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Store this backup in a PRIVATE location" -ForegroundColor White
Write-Host "  2. DO NOT upload to public GitHub or share publicly" -ForegroundColor White
Write-Host "  3. Keep it as rollback option for your educational project" -ForegroundColor White
Write-Host "  4. Share only with instructors/classmates if needed" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Ready to Deploy!" -ForegroundColor Green
Write-Host "  Follow: VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor White
Write-Host "  .env file is included - no need to add manually!" -ForegroundColor White
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Your educational project is safely backed up! ✨" -ForegroundColor Green
