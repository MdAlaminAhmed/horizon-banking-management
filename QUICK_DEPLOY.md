# 🚀 Vercel Deployment - Quick Start (5 Minutes)

The fastest way to deploy your app to Vercel.

---

## Step 1: Push to GitHub (1 min)
```powershell
git add .
git commit -m "Ready for Vercel"
git push origin main
```

---

## Step 2: Import to Vercel (1 min)
1. Go to [vercel.com](https://vercel.com) → Login with GitHub
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to `horizon-banking-management`

---

## Step 3: Add Environment Variables (2 min)

**Copy from your `.env` file and paste into Vercel:**

```env
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT=YOUR_VALUE
APPWRITE_DATABASE_ID=YOUR_VALUE
APPWRITE_USER_COLLECTION_ID=YOUR_VALUE
APPWRITE_BANK_COLLECTION_ID=YOUR_VALUE
APPWRITE_TRANSACTION_COLLECTION_ID=YOUR_VALUE
APPWRITE_SECRET=YOUR_VALUE
PLAID_CLIENT_ID=YOUR_VALUE
PLAID_SECRET=YOUR_VALUE
PLAID_ENV=sandbox
PLAID_PRODUCTS=auth,transactions,identity
PLAID_COUNTRY_CODES=US,CA
NEXT_PUBLIC_PLAID_REDIRECT_URI=https://your-app.vercel.app
DWOLLA_KEY=YOUR_VALUE
DWOLLA_SECRET=YOUR_VALUE
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```

**⚠️ Important:** Replace `YOUR_VALUE` with actual values from your `.env`

---

## Step 4: Deploy (1 min)
1. Click **"Deploy"**
2. Wait for build (2-3 minutes)
3. Copy your URL: `https://horizon-banking-xyz.vercel.app`

---

## Step 5: Update URLs (1 min)

### In Vercel:
1. Go to **Settings** → **Environment Variables**
2. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
3. Update `NEXT_PUBLIC_PLAID_REDIRECT_URI` with your actual Vercel URL
4. Click **"Redeploy"**

### In Appwrite:
1. Go to [Appwrite Console](https://cloud.appwrite.io/console)
2. Your Project → **Settings** → **Platforms**
3. Add Web App with hostname: `horizon-banking-xyz.vercel.app`

### In Plaid:
1. Go to [Plaid Dashboard](https://dashboard.plaid.com)
2. **Team Settings** → **API** → **Redirect URIs**
3. Add: `https://horizon-banking-xyz.vercel.app`

---

## ✅ Done! Test Your App

Visit your Vercel URL and test:
- Sign Up
- Add Bank
- View Transactions
- Transfer Funds

---

## 🐛 Issues?

### Build fails?
- Check environment variables are set
- Look at build logs in Vercel

### Runtime errors?
- Check Vercel Function Logs
- Verify Appwrite platform is added
- Verify Plaid redirect URI is added

### Need detailed help?
👉 Read `VERCEL_DEPLOYMENT_GUIDE.md` for full instructions

---

## 🎉 That's It!

Your app is live at: **https://your-app.vercel.app**

Every push to `main` branch will auto-deploy! 🚀
