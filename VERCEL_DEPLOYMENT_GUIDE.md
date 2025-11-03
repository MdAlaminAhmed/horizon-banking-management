# 🚀 Vercel Deployment Guide - Step by Step

This guide will help you deploy your Horizon Banking Management app to Vercel without any hassle.

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ GitHub account with your code pushed
- ✅ Vercel account (free tier works)
- ✅ Appwrite Cloud project setup
- ✅ Plaid sandbox credentials
- ✅ Dwolla sandbox credentials

---

## 🔧 Step 1: Prepare Your Local Repository

### 1.1 Commit All Changes
```powershell
# Check if you have uncommitted changes
git status

# Add all changes
git add .

# Commit with a message
git commit -m "Ready for Vercel deployment"

# Push to GitHub
git push origin main
```

### 1.2 Verify Your `.gitignore` (Already Done ✅)
Make sure `.env` and `.env.local` are in `.gitignore` (they already are).

---

## 🌐 Step 2: Connect GitHub to Vercel

### 2.1 Sign Up/Login to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub account

### 2.2 Import Your Repository
1. Click **"Add New..."** → **"Project"**
2. Find and click **"Import"** next to `horizon-banking-management`
3. If you don't see it, click **"Adjust GitHub App Permissions"** to grant access

---

## ⚙️ Step 3: Configure Project Settings

### 3.1 Project Configuration (Usually Auto-Detected ✅)
Vercel should automatically detect:
- **Framework Preset:** Next.js
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `.next`

**No changes needed here!**

---

## 🔐 Step 4: Add Environment Variables

This is the **most important step**. You need to copy ALL your environment variables.

### 4.1 Open Your Local `.env` File
```powershell
# Open in VS Code
code .env
```

### 4.2 In Vercel, Add Environment Variables
1. Scroll down to **"Environment Variables"** section
2. For **each** variable in your `.env` file, do:
   - **Key:** Variable name (e.g., `NEXT_PUBLIC_APPWRITE_ENDPOINT`)
   - **Value:** Your actual value
   - **Environment:** Select **"Production"**, **"Preview"**, and **"Development"**

### 4.3 Complete List of Variables to Add

Copy these from your `.env` file:

```env
# Site URL (IMPORTANT: Update after deployment)
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app

# Appwrite
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id_here
APPWRITE_DATABASE_ID=your_database_id_here
APPWRITE_USER_COLLECTION_ID=your_user_collection_id_here
APPWRITE_BANK_COLLECTION_ID=your_bank_collection_id_here
APPWRITE_TRANSACTION_COLLECTION_ID=your_transaction_collection_id_here
APPWRITE_SECRET=your_appwrite_secret_here

# Plaid
PLAID_CLIENT_ID=your_plaid_client_id_here
PLAID_SECRET=your_plaid_secret_here
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA

# Plaid OAuth (if using OAuth banks)
NEXT_PUBLIC_PLAID_REDIRECT_URI=https://your-app-name.vercel.app

# Dwolla
DWOLLA_KEY=your_dwolla_key_here
DWOLLA_SECRET=your_dwolla_secret_here
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox

# Optional: Dwolla settings
DWOLLA_REQUIRE_ON_DEMAND=false
ALLOW_BANK_SAVE_WITHOUT_DWOLLA=false

# Sentry (Optional - for error tracking)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
SENTRY_DSN=your_sentry_dsn_here
SENTRY_AUTH_TOKEN=your_sentry_auth_token_here
```

**⚠️ IMPORTANT:**
- For `NEXT_PUBLIC_SITE_URL`, use your Vercel URL (you'll get it after first deploy)
- For `NEXT_PUBLIC_PLAID_REDIRECT_URI`, use the same Vercel URL

---

## 🚀 Step 5: Deploy

### 5.1 Click "Deploy"
After adding all environment variables, click the **"Deploy"** button.

### 5.2 Wait for Build (2-5 minutes)
You'll see:
- ✅ Building
- ✅ Uploading
- ✅ Deploying

### 5.3 Get Your Deployment URL
Once complete, you'll see:
```
🎉 Your project has been deployed!
https://horizon-banking-management-xyz123.vercel.app
```

**Copy this URL!** You'll need it for the next steps.

---

## 🔄 Step 6: Update Environment Variables

### 6.1 Update NEXT_PUBLIC_SITE_URL
1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_SITE_URL`
3. Click **"Edit"**
4. Update value to: `https://your-actual-vercel-url.vercel.app`
5. Click **"Save"**

### 6.2 Update NEXT_PUBLIC_PLAID_REDIRECT_URI (if using OAuth)
1. Find `NEXT_PUBLIC_PLAID_REDIRECT_URI`
2. Update to: `https://your-actual-vercel-url.vercel.app`
3. Click **"Save"**

### 6.3 Redeploy
After updating env vars:
1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**

---

## 🔧 Step 7: Configure Third-Party Services

### 7.1 Update Appwrite Settings

1. **Go to Appwrite Console:** [https://cloud.appwrite.io/console](https://cloud.appwrite.io/console)
2. Open your project
3. Go to **Settings** → **Platforms**
4. Click **"Add Platform"** → **"Web App"**
5. Add these details:
   - **Name:** Horizon Banking Production
   - **Hostname:** `your-app-name.vercel.app` (without https://)
6. Click **"Next"** → **"Done"**

### 7.2 Update Plaid Redirect URIs

1. **Go to Plaid Dashboard:** [https://dashboard.plaid.com](https://dashboard.plaid.com)
2. Go to **Team Settings** → **API**
3. Under **Allowed redirect URIs**, add:
   ```
   https://your-app-name.vercel.app
   ```
4. Click **"Save Changes"**

### 7.3 Update Dwolla (Usually No Action Needed)
Dwolla sandbox typically works without additional configuration for Vercel domains.

---

## ✅ Step 8: Test Your Deployment

### 8.1 Test Basic Functionality
1. Visit your Vercel URL
2. Try **Sign Up** with a new account
3. Try **Sign In** with existing account
4. Click **"Add Bank"** and connect a test bank
5. Navigate between pages (My Banks, Transaction History)
6. Try a test transfer

### 8.2 Check Console Logs
1. Open browser DevTools (F12)
2. Check **Console** for errors
3. Check **Network** tab for failed requests

### 8.3 Check Vercel Logs
1. Go to Vercel Dashboard → **Deployments**
2. Click on your deployment
3. Click **"Logs"** tab
4. Look for any errors

---

## 🎨 Step 9: Add Custom Domain (Optional)

### 9.1 Add Domain in Vercel
1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `banking.yourdomain.com`)
4. Click **"Add"**

### 9.2 Update DNS Records
Vercel will show you the DNS records to add:
```
Type: CNAME
Name: banking (or @)
Value: cname.vercel-dns.com
```

### 9.3 Update Environment Variables
After domain is verified:
1. Update `NEXT_PUBLIC_SITE_URL` to your custom domain
2. Update `NEXT_PUBLIC_PLAID_REDIRECT_URI` to your custom domain
3. Update Appwrite platform hostname
4. Update Plaid redirect URI
5. Redeploy

---

## 🐛 Troubleshooting

### Build Fails
**Error:** "Module not found"
```powershell
# Solution: Make sure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

**Error:** "Environment variable not found"
- Double-check all env vars are added in Vercel
- Make sure there are no typos
- Redeploy after adding missing vars

### Runtime Errors

**Error:** "Failed to connect to Appwrite"
- Verify Appwrite platform is added with correct hostname
- Check `NEXT_PUBLIC_APPWRITE_ENDPOINT` and `NEXT_PUBLIC_APPWRITE_PROJECT`
- Make sure no trailing slashes in URLs

**Error:** "Plaid Link initialization failed"
- Verify Plaid redirect URI is added in Plaid Dashboard
- Check `PLAID_CLIENT_ID` and `PLAID_SECRET`
- Make sure `NEXT_PUBLIC_PLAID_REDIRECT_URI` matches your Vercel URL

**Error:** "Dwolla funding source creation failed"
- Check `DWOLLA_KEY` and `DWOLLA_SECRET`
- Verify `DWOLLA_ENV=sandbox`
- Check Vercel logs for detailed error message

### Pages Load Slowly
The optimizations we implemented should help! But also:
- Check Vercel region (should be close to your Appwrite region)
- Monitor performance in Vercel Analytics
- Check [perf] logs in Vercel Function Logs

---

## 📊 Step 10: Monitor Your App

### 10.1 Vercel Analytics
1. Go to **Analytics** tab in Vercel
2. Monitor page load times
3. Check Core Web Vitals

### 10.2 Vercel Logs
1. Go to **Logs** tab
2. Watch for errors in real-time
3. Filter by time/status

### 10.3 Sentry (if configured)
1. Go to [sentry.io](https://sentry.io)
2. Check **Issues** for runtime errors
3. Monitor **Performance** for slow operations

---

## 🔄 Future Deployments

### Automatic Deployments (Already Enabled ✅)
Every time you push to `main` branch:
1. Vercel automatically detects the push
2. Builds your project
3. Deploys if build succeeds

### Manual Redeployment
1. Go to Vercel Dashboard → **Deployments**
2. Click **"..."** on any deployment
3. Click **"Redeploy"**

---

## 🎉 You're Done!

Your Horizon Banking Management app is now live on Vercel! 🚀

**Your app URL:** `https://your-app-name.vercel.app`

### Quick Links:
- 📊 [Vercel Dashboard](https://vercel.com/dashboard)
- 🔧 [Appwrite Console](https://cloud.appwrite.io/console)
- 🏦 [Plaid Dashboard](https://dashboard.plaid.com)
- 💰 [Dwolla Dashboard](https://dashboard.dwolla.com)

---

## 📞 Need Help?

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console
3. Review this guide step-by-step
4. Check DEPLOYMENT.md for additional troubleshooting

**Common Issues Quick Fixes:**
- Build fails → Check package.json and env vars
- Runtime errors → Check Vercel Function Logs
- API errors → Verify third-party credentials
- Slow performance → Check your optimizations are deployed

Good luck! 🍀
