# 🧹 Pre-Deployment Cleanup Script
# Removes unnecessary files and optimizes for Vercel

Write-Host "🚀 Preparing for Vercel Deployment..." -ForegroundColor Cyan
Write-Host ""

# Files to remove (not needed for deployment)
$filesToRemove = @(
    "clean-repo.ps1",
    "START_HERE.md",
    "bank_list_to_add.txt",
    ".mailmap",
    ".git-blame-ignore-revs",
    "CONTRIBUTORS.md",
    "CONTRIBUTORS_GUIDE.md",
    "SETUP_COMPLETE.md",
    "tsconfig.tsbuildinfo"
)

# Directories to check
$dirsToCheck = @(
    ".next",
    "node_modules/.cache"
)

Write-Host "📝 Files to remove:" -ForegroundColor Yellow
$filesToRemove | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
Write-Host ""

# Remove unnecessary files
Write-Host "🗑️  Removing unnecessary files..." -ForegroundColor Yellow
$removedCount = 0
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file -Force -ErrorAction SilentlyContinue
        Write-Host "  ✅ Removed: $file" -ForegroundColor Green
        $removedCount++
    }
}

if ($removedCount -eq 0) {
    Write-Host "  ℹ️  No unnecessary files found" -ForegroundColor Gray
}
Write-Host ""

# Clean build artifacts
Write-Host "🧹 Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ Cleaned .next directory" -ForegroundColor Green
}
else {
    Write-Host "  ℹ️  No .next directory found" -ForegroundColor Gray
}

if (Test-Path "node_modules/.cache") {
    Remove-Item "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "  ✅ Cleaned node_modules cache" -ForegroundColor Green
}
Write-Host ""

# Verify .gitignore
Write-Host "📋 Verifying .gitignore..." -ForegroundColor Yellow
$gitignoreContent = Get-Content ".gitignore" -Raw
$requiredEntries = @(".env", ".env*.local", ".vercel", "*.tsbuildinfo", ".next/")
$missingEntries = @()

foreach ($entry in $requiredEntries) {
    if (-not ($gitignoreContent -match [regex]::Escape($entry))) {
        $missingEntries += $entry
    }
}

if ($missingEntries.Count -eq 0) {
    Write-Host "  ✅ .gitignore is properly configured" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  Missing entries in .gitignore:" -ForegroundColor Yellow
    $missingEntries | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
}
Write-Host ""

# Check environment variables
Write-Host "🔐 Checking environment setup..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "  ✅ .env file exists" -ForegroundColor Green
    
    # Check for required variables
    $envContent = Get-Content ".env" -Raw
    $requiredVars = @(
        "NEXT_PUBLIC_APPWRITE_PROJECT",
        "APPWRITE_SECRET",
        "PLAID_CLIENT_ID",
        "PLAID_SECRET",
        "DWOLLA_KEY",
        "DWOLLA_SECRET"
    )
    
    $missingVars = @()
    foreach ($var in $requiredVars) {
        if (-not ($envContent -match "$var=.+")) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "  ✅ All required environment variables are set" -ForegroundColor Green
    }
    else {
        Write-Host "  ⚠️  Missing or empty environment variables:" -ForegroundColor Yellow
        $missingVars | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        Write-Host "  💡 Make sure to add these in Vercel dashboard!" -ForegroundColor Cyan
    }
}
else {
    Write-Host "  ⚠️  .env file not found (expected in development)" -ForegroundColor Yellow
    Write-Host "  💡 Copy values from .env.example and fill them in" -ForegroundColor Cyan
}
Write-Host ""

# Verify package.json scripts
Write-Host "📦 Verifying package.json scripts..." -ForegroundColor Yellow
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$requiredScripts = @("dev", "build", "start")
$missingScripts = @()

foreach ($script in $requiredScripts) {
    if (-not $packageJson.scripts.$script) {
        $missingScripts += $script
    }
}

if ($missingScripts.Count -eq 0) {
    Write-Host "  ✅ All required scripts present" -ForegroundColor Green
}
else {
    Write-Host "  ❌ Missing scripts:" -ForegroundColor Red
    $missingScripts | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
}
Write-Host ""

# Check vercel.json
Write-Host "⚙️  Verifying Vercel configuration..." -ForegroundColor Yellow
if (Test-Path "vercel.json") {
    Write-Host "  ✅ vercel.json exists" -ForegroundColor Green
}
else {
    Write-Host "  ⚠️  vercel.json not found" -ForegroundColor Yellow
    Write-Host "  💡 Will use default Vercel configuration" -ForegroundColor Cyan
}
Write-Host ""

# Run a test build
Write-Host "🔨 Testing production build..." -ForegroundColor Yellow
Write-Host "  Running: npm run build" -ForegroundColor Gray
Write-Host ""

$buildResult = npm run build 2>&1
$buildSuccess = $LASTEXITCODE -eq 0

if ($buildSuccess) {
    Write-Host "  ✅ Build successful!" -ForegroundColor Green
}
else {
    Write-Host "  ❌ Build failed!" -ForegroundColor Red
    Write-Host "  💡 Fix build errors before deploying" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Build output:" -ForegroundColor Yellow
    Write-Host $buildResult
    exit 1
}
Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "                    ✅ CLEANUP COMPLETE                     " -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Summary:" -ForegroundColor Yellow
Write-Host "  ✅ Unnecessary files removed" -ForegroundColor Green
Write-Host "  ✅ Build artifacts cleaned" -ForegroundColor Green
Write-Host "  ✅ Environment variables checked" -ForegroundColor Green
Write-Host "  ✅ Build test passed" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Commit your changes:" -ForegroundColor White
Write-Host "     git add ." -ForegroundColor Gray
Write-Host "     git commit -m 'Clean up for Vercel deployment'" -ForegroundColor Gray
Write-Host "     git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Go to vercel.com and import your project" -ForegroundColor White
Write-Host ""
Write-Host "  3. Follow the guide:" -ForegroundColor White
Write-Host "     📖 VERCEL_DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Good luck with your deployment! 🍀" -ForegroundColor Green
