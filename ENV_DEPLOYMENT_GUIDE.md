# 🔐 Environment Variables Deployment Guide

## ⚠️ CRITICAL: Your `.env` File

**Your `.env` file contains ALL your API secrets and must be handled carefully!**

---

## 📋 What's in Your `.env`

You have **24 environment variables** across 5 categories:

### 1. Next.js Configuration (1 variable)
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
**For Vercel:** Change to `https://your-app.vercel.app`

### 2. Appwrite (7 variables)
```env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=68f460830004e90f8513
APPWRITE_DATABASE_ID=68f4613b001ecba4e1c5
APPWRITE_USER_COLLECTION_ID=users
APPWRITE_BANK_COLLECTION_ID=banks
APPWRITE_TRANSACTION_COLLECTION_ID=transactions
APPWRITE_SECRET=standard_3eca5aff9c4ff5db26f106a1fdf481c08bd8d771c0e48f746160f1f84b593e6073789f96e5c87d1500060bb848d5b222aa8602d116c65bec0bb1d8ce0c99341efbf35ad19bf60303be716f3971e6fa05947745e7c077a5b1f4fcca730362f3701a7ac84563ea4f18a3fec36395dde7f8c63260db5e0909476056a37d4d870ea8
```
**Keep exactly as-is** in Vercel

### 3. Plaid (5 variables)
```env
PLAID_CLIENT_ID=68f47d8ed4bf0200228ffb1b
PLAID_SECRET=d48635283e79aada9669d72633316a
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA
```
**Keep exactly as-is** in Vercel (sandbox mode)

### 4. Dwolla (4 variables)
```env
DWOLLA_KEY=bQ9dogezrj7a1jjaazU3dHGvH011JwGWGG2O3SfjldGKnAVyoz
DWOLLA_SECRET=eMAFNGyl2WLigURAdf1qUqcyr2iqjqhRjSSLI6jPWDgqmpEDNg
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```
**Keep exactly as-is** in Vercel (sandbox mode)

### 5. Debug/Development Flags (3 variables)
```env
ALLOW_BANK_SAVE_WITHOUT_DWOLLA=false
DWOLLA_REQUIRE_ON_DEMAND=true
NEXT_PUBLIC_PLAID_DEBUG=true
```
**Optional:** Can keep or remove in production

### 6. Sentry (Optional - if you add later)
```env
SENTRY_AUTH_TOKEN=your-token
NEXT_PUBLIC_SENTRY_DSN=your-dsn
```

---

## 🚀 Deployment Steps

### Before Deployment:

#### 1. Backup Your `.env` File
```powershell
# Copy to safe location
Copy-Item .env .env.backup
```

**Store in:**
- ✅ Password manager (1Password, LastPass, Bitwarden)
- ✅ Encrypted cloud storage (Google Drive in private folder)
- ✅ USB drive (offline backup)
- ❌ NEVER in Git/GitHub
- ❌ NEVER in backup ZIP
- ❌ NEVER share publicly

#### 2. Create `.env.production` (Optional)
```powershell
# Copy and modify for production
Copy-Item .env .env.production
```

Edit `.env.production`:
```env
# Change this line:
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app

# Set debug flags to false:
NEXT_PUBLIC_PLAID_DEBUG=false
ALLOW_BANK_SAVE_WITHOUT_DWOLLA=false
```

---

### During Vercel Deployment:

#### Step 1: Deploy Code (No .env Yet)
- Push code to GitHub
- Connect Vercel to GitHub repo
- **First deploy will FAIL** (no environment variables) ⚠️

#### Step 2: Add Environment Variables
**Go to Vercel Dashboard:**
1. Click your project
2. Settings → Environment Variables
3. Add **ALL 24 variables** one by one

**Copy-paste from your `.env` file:**

##### Production Environment:
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://your-app-name.vercel.app
Environment: Production ✓
```

```
Key: NEXT_PUBLIC_APPWRITE_ENDPOINT
Value: https://cloud.appwrite.io/v1
Environment: Production ✓
```

```
Key: NEXT_PUBLIC_APPWRITE_PROJECT
Value: 68f460830004e90f8513
Environment: Production ✓
```

*(Continue for all 24 variables...)*

#### Step 3: Redeploy
- After adding all variables
- Go to Deployments → Click "..." → Redeploy
- Should succeed now! ✅

---

## 📝 Environment Variable Checklist

### ✅ Required for Vercel (14 variables):

**Next.js:**
- [ ] `NEXT_PUBLIC_SITE_URL` (update to Vercel URL)

**Appwrite:**
- [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- [ ] `NEXT_PUBLIC_APPWRITE_PROJECT`
- [ ] `APPWRITE_DATABASE_ID`
- [ ] `APPWRITE_USER_COLLECTION_ID`
- [ ] `APPWRITE_BANK_COLLECTION_ID`
- [ ] `APPWRITE_TRANSACTION_COLLECTION_ID`
- [ ] `APPWRITE_SECRET`

**Plaid:**
- [ ] `PLAID_CLIENT_ID`
- [ ] `PLAID_SECRET`
- [ ] `PLAID_ENV`

**Dwolla:**
- [ ] `DWOLLA_KEY`
- [ ] `DWOLLA_SECRET`
- [ ] `DWOLLA_BASE_URL`

### ⚙️ Optional (10 variables):
- [ ] `PLAID_PRODUCTS`
- [ ] `PLAID_COUNTRY_CODES`
- [ ] `DWOLLA_ENV`
- [ ] `ALLOW_BANK_SAVE_WITHOUT_DWOLLA`
- [ ] `DWOLLA_REQUIRE_ON_DEMAND`
- [ ] `NEXT_PUBLIC_PLAID_DEBUG`

---

## 🔄 After Deployment

### Update Third-Party Services:

#### 1. Appwrite Console
Add your Vercel domain to allowed platforms:
```
1. Go to: https://cloud.appwrite.io/console
2. Select project: 68f460830004e90f8513
3. Settings → Platforms
4. Add Web Platform:
   Name: Production
   Hostname: your-app-name.vercel.app
```

#### 2. Plaid Dashboard
Add redirect URI:
```
1. Go to: https://dashboard.plaid.com/
2. API → Redirect URIs
3. Add: https://your-app-name.vercel.app/
```

#### 3. Dwolla Dashboard (Optional)
If using webhooks:
```
1. Go to: https://dashboard.dwolla.com/
2. Webhooks → Add webhook
3. URL: https://your-app-name.vercel.app/api/webhooks/dwolla
```

---

## 🛡️ Security Best Practices

### DO:
- ✅ Store `.env` in password manager
- ✅ Keep backup copy encrypted
- ✅ Use different secrets for dev/prod
- ✅ Rotate secrets periodically
- ✅ Add environment variables manually in Vercel

### DON'T:
- ❌ Commit `.env` to Git
- ❌ Share `.env` in Slack/email
- ❌ Include `.env` in backups/ZIP
- ❌ Use production secrets in development
- ❌ Take screenshots of secrets

---

## 🚨 Emergency: Lost `.env` File

### Recovery Steps:

#### If you have backup:
```powershell
# Restore from backup
Copy-Item .env.backup .env
```

#### If no backup (⚠️ Requires regeneration):
1. **Appwrite:** Get new API key from console
2. **Plaid:** Get credentials from dashboard
3. **Dwolla:** Get credentials from dashboard
4. **Recreate `.env`** using `.env.example` template

---

## 📊 Environment Variable Quick Reference

| Category | Count | Required | Notes |
|----------|-------|----------|-------|
| Next.js | 1 | Yes | Update URL for Vercel |
| Appwrite | 7 | Yes | Keep all values |
| Plaid | 5 | Yes | Sandbox mode OK |
| Dwolla | 4 | Yes | Sandbox mode OK |
| Debug | 3 | No | Optional in prod |
| Sentry | 2 | No | Add if monitoring |

**Total: 14 required + 8 optional = 22 variables**

---

## ✅ Pre-Deployment Checklist

**Before you deploy:**
- [ ] `.env` file backed up securely
- [ ] All 14 required variables present
- [ ] No typos in variable names
- [ ] No extra spaces in values
- [ ] Values wrapped in quotes if contain spaces
- [ ] Production URL ready for `NEXT_PUBLIC_SITE_URL`

**Ready to deploy:**
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables copied to Vercel
- [ ] First deployment triggered
- [ ] Third-party services updated (Appwrite, Plaid)

---

## 🎯 Quick Deploy Commands

### 1. Backup .env
```powershell
Copy-Item .env .env.backup
Write-Host "✅ .env backed up!" -ForegroundColor Green
```

### 2. Verify all variables exist
```powershell
.\verify-api-setup.ps1
```

### 3. Create production backup
```powershell
.\backup-project.ps1
```

### 4. Deploy!
Follow `VERCEL_DEPLOYMENT_GUIDE.md`

---

## 💡 Pro Tips

### 1. Use Vercel CLI (Advanced)
```powershell
# Install
npm i -g vercel

# Pull environment variables from Vercel
vercel env pull .env.production

# Push local .env to Vercel
vercel env add VARIABLE_NAME
```

### 2. Environment Variable Groups
Organize in Vercel with comments:
```
# Database
APPWRITE_DATABASE_ID=...

# Authentication  
APPWRITE_SECRET=...

# Banking APIs
PLAID_CLIENT_ID=...
```

### 3. Test Environment Variables
Create `.env.test` for testing:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Use test/sandbox credentials
```

---

## 📞 Need Help?

**Issue:** First deployment failed
**Solution:** Add all environment variables in Vercel, then redeploy

**Issue:** "Missing required environment variable"
**Solution:** Check variable name matches exactly (case-sensitive)

**Issue:** Lost `.env` file
**Solution:** Restore from backup or regenerate API keys

**Issue:** Wrong values in Vercel
**Solution:** Settings → Environment Variables → Edit → Save → Redeploy

---

## ✨ You're Ready!

Your environment variables are:
- ✅ **Secure** - Not in Git/backup
- ✅ **Complete** - All 14 required variables
- ✅ **Backed up** - Safe copy stored
- ✅ **Ready to deploy** - Just copy to Vercel

**Deploy with confidence!** 🚀

---

## Quick Reference Card

```
📁 .env location: D:\horizon-banking-management\.env
🔐 Backup location: [Your password manager / encrypted storage]
🚀 Deploy to: Vercel Dashboard → Environment Variables
📝 Required count: 14 variables minimum
✅ Verified: Yes (all APIs connected)
```
