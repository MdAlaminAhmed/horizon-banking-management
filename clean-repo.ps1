# Clean Repository Script
# Run this to remove contributors and push to GitHub

Write-Host "🧹 Cleaning Repository..." -ForegroundColor Cyan

# Step 1: Backup current state
Write-Host "`n📦 Creating backup..." -ForegroundColor Yellow
Copy-Item -Path . -Destination ../horizon-banking-backup -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Backup created at ../horizon-banking-backup" -ForegroundColor Green

# Step 2: Remove git history
Write-Host "`n🗑️  Removing old git history..." -ForegroundColor Yellow
Remove-Item -Path .git -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "✅ Git history removed" -ForegroundColor Green

# Step 3: Initialize new repository
Write-Host "`n🔧 Initializing new repository..." -ForegroundColor Yellow
git init
Write-Host "✅ New repository initialized" -ForegroundColor Green

# Step 4: Configure git user
Write-Host "`n👤 Configuring git user..." -ForegroundColor Yellow
git config user.name "Md. Al-Amin Ahmed"
git config user.email "contact.alamin02@gmail.com"
Write-Host "✅ Git user configured" -ForegroundColor Green

# Step 5: Add all files
Write-Host "`n📄 Adding files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files added" -ForegroundColor Green

# Step 6: Create initial commit
Write-Host "`n💾 Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Horizon Banking Management System"
Write-Host "✅ Initial commit created" -ForegroundColor Green

# Step 7: Add remote
Write-Host "`n🌐 Adding remote repository..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/MdAlaminAhmed/horizon-banking-management.git"
git remote add origin $remoteUrl
git branch -M main
Write-Host "✅ Remote added: $remoteUrl" -ForegroundColor Green

# Step 8: Push to GitHub
Write-Host "`n🚀 Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⚠️  This will force push and overwrite remote repository!" -ForegroundColor Red
$confirm = Read-Host "Do you want to continue? (yes/no)"

if ($confirm -eq "yes") {
    git push -u origin main --force
    Write-Host "`n✅ Successfully pushed to GitHub!" -ForegroundColor Green
    Write-Host "`n🎉 Repository cleaned! Only you will show as contributor." -ForegroundColor Cyan
    Write-Host "`n📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Visit: https://github.com/MdAlaminAhmed/horizon-banking-management"
    Write-Host "   2. Verify contributors section shows only your name"
    Write-Host "   3. Check README.md looks good"
    Write-Host "   4. Deploy to Vercel (see DEPLOYMENT.md)"
} else {
    Write-Host "`n❌ Push cancelled. No changes made to remote repository." -ForegroundColor Red
}
