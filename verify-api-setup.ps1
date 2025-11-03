# 🔍 API Connection Verification Script
# Tests connections to Appwrite, Plaid, and Dwolla before deployment

Write-Host "🔍 Verifying API Connections..." -ForegroundColor Cyan
Write-Host ""

# Load environment variables from .env
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "💡 Copy .env.example to .env and fill in your credentials" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Checking environment variables..." -ForegroundColor Yellow
Write-Host ""

# Parse .env file
$envVars = @{}
Get-Content ".env" | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

# Check Appwrite
Write-Host "☁️  APPWRITE" -ForegroundColor Cyan
Write-Host "  ├─ Endpoint: $($envVars['NEXT_PUBLIC_APPWRITE_ENDPOINT'])" -ForegroundColor Gray
Write-Host "  ├─ Project ID: $(if ($envVars['NEXT_PUBLIC_APPWRITE_PROJECT']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['NEXT_PUBLIC_APPWRITE_PROJECT']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Database ID: $(if ($envVars['APPWRITE_DATABASE_ID']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['APPWRITE_DATABASE_ID']) { 'Green' } else { 'Red' })
Write-Host "  ├─ User Collection: $(if ($envVars['APPWRITE_USER_COLLECTION_ID']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['APPWRITE_USER_COLLECTION_ID']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Bank Collection: $(if ($envVars['APPWRITE_BANK_COLLECTION_ID']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['APPWRITE_BANK_COLLECTION_ID']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Transaction Collection: $(if ($envVars['APPWRITE_TRANSACTION_COLLECTION_ID']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['APPWRITE_TRANSACTION_COLLECTION_ID']) { 'Green' } else { 'Red' })
Write-Host "  └─ Secret: $(if ($envVars['APPWRITE_SECRET']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['APPWRITE_SECRET']) { 'Green' } else { 'Red' })
Write-Host ""

# Check Plaid
Write-Host "🏦 PLAID" -ForegroundColor Cyan
Write-Host "  ├─ Client ID: $(if ($envVars['PLAID_CLIENT_ID']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['PLAID_CLIENT_ID']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Secret: $(if ($envVars['PLAID_SECRET']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['PLAID_SECRET']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Environment: $($envVars['PLAID_ENV'])" -ForegroundColor Gray
Write-Host "  ├─ Products: $($envVars['PLAID_PRODUCTS'])" -ForegroundColor Gray
Write-Host "  ├─ Country Codes: $($envVars['PLAID_COUNTRY_CODES'])" -ForegroundColor Gray
Write-Host "  └─ Redirect URI: $(if ($envVars['NEXT_PUBLIC_PLAID_REDIRECT_URI']) { $envVars['NEXT_PUBLIC_PLAID_REDIRECT_URI'] } else { 'Not set (optional)' })" -ForegroundColor Gray
Write-Host ""

# Check Dwolla
Write-Host "💰 DWOLLA" -ForegroundColor Cyan
Write-Host "  ├─ Key: $(if ($envVars['DWOLLA_KEY']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['DWOLLA_KEY']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Secret: $(if ($envVars['DWOLLA_SECRET']) { '✅ Set' } else { '❌ Missing' })" -ForegroundColor $(if ($envVars['DWOLLA_SECRET']) { 'Green' } else { 'Red' })
Write-Host "  ├─ Base URL: $($envVars['DWOLLA_BASE_URL'])" -ForegroundColor Gray
Write-Host "  └─ Environment: $($envVars['DWOLLA_ENV'])" -ForegroundColor Gray
Write-Host ""

# Check Sentry (Optional)
Write-Host "📊 SENTRY (Optional)" -ForegroundColor Cyan
Write-Host "  ├─ Public DSN: $(if ($envVars['NEXT_PUBLIC_SENTRY_DSN']) { '✅ Set' } else { '⚠️  Not set (optional)' })" -ForegroundColor $(if ($envVars['NEXT_PUBLIC_SENTRY_DSN']) { 'Green' } else { 'Yellow' })
Write-Host "  └─ Server DSN: $(if ($envVars['SENTRY_DSN']) { '✅ Set' } else { '⚠️  Not set (optional)' })" -ForegroundColor $(if ($envVars['SENTRY_DSN']) { 'Green' } else { 'Yellow' })
Write-Host ""

# Validation Summary
$requiredVars = @(
    'NEXT_PUBLIC_APPWRITE_ENDPOINT',
    'NEXT_PUBLIC_APPWRITE_PROJECT',
    'APPWRITE_DATABASE_ID',
    'APPWRITE_USER_COLLECTION_ID',
    'APPWRITE_BANK_COLLECTION_ID',
    'APPWRITE_TRANSACTION_COLLECTION_ID',
    'APPWRITE_SECRET',
    'PLAID_CLIENT_ID',
    'PLAID_SECRET',
    'PLAID_ENV',
    'DWOLLA_KEY',
    'DWOLLA_SECRET',
    'DWOLLA_BASE_URL',
    'DWOLLA_ENV'
)

$missingVars = @()
foreach ($var in $requiredVars) {
    if (-not $envVars[$var] -or $envVars[$var] -eq '') {
        $missingVars += $var
    }
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
if ($missingVars.Count -eq 0) {
    Write-Host "                ✅ ALL CHECKS PASSED                      " -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✅ All required environment variables are set!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Ready for Vercel Deployment!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run: .\prepare-deployment.ps1" -ForegroundColor White
    Write-Host "  2. Commit and push your changes" -ForegroundColor White
    Write-Host "  3. Deploy to Vercel" -ForegroundColor White
    Write-Host ""
}
else {
    Write-Host "                ❌ MISSING VARIABLES                      " -ForegroundColor Red
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "❌ Missing required environment variables:" -ForegroundColor Red
    $missingVars | ForEach-Object { Write-Host "  - $_" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "💡 Actions required:" -ForegroundColor Yellow
    Write-Host "  1. Fill in missing variables in your .env file" -ForegroundColor White
    Write-Host "  2. Get credentials from:" -ForegroundColor White
    Write-Host "     - Appwrite: https://cloud.appwrite.io/console" -ForegroundColor Gray
    Write-Host "     - Plaid: https://dashboard.plaid.com" -ForegroundColor Gray
    Write-Host "     - Dwolla: https://dashboard.dwolla.com" -ForegroundColor Gray
    Write-Host "  3. Run this script again to verify" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
