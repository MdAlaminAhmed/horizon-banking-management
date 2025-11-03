# Vercel Deployment Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL DEPLOYMENT FLOW                        │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐
│  1. LOCAL SETUP  │
└────────┬─────────┘
         │
         ├─ Commit code to git
         ├─ Push to GitHub main branch
         └─ Prepare .env values
         │
         ▼
┌──────────────────┐
│  2. VERCEL SETUP │
└────────┬─────────┘
         │
         ├─ Login to vercel.com
         ├─ Import GitHub repo
         └─ Add environment variables
         │
         ▼
┌──────────────────┐
│  3. DEPLOY       │
└────────┬─────────┘
         │
         ├─ Click "Deploy"
         ├─ Wait for build (2-5 min)
         └─ Get deployment URL
         │
         ▼
┌──────────────────┐
│  4. UPDATE URLs  │
└────────┬─────────┘
         │
         ├─ Update NEXT_PUBLIC_SITE_URL in Vercel
         ├─ Update PLAID_REDIRECT_URI in Vercel
         └─ Redeploy
         │
         ▼
┌──────────────────┐
│  5. CONFIGURE    │
└────────┬─────────┘
         │
         ├─ Add Vercel URL to Appwrite Platforms
         ├─ Add Vercel URL to Plaid Redirect URIs
         └─ (Dwolla usually auto-works)
         │
         ▼
┌──────────────────┐
│  6. TEST         │
└────────┬─────────┘
         │
         ├─ Visit Vercel URL
         ├─ Test Sign Up/Login
         ├─ Test Add Bank
         ├─ Test Transactions
         └─ Test Transfers
         │
         ▼
┌──────────────────┐
│  ✅ LIVE!        │
└──────────────────┘

═══════════════════════════════════════════════════════════════════

CONTINUOUS DEPLOYMENT (Automatic)
─────────────────────────────────

Every time you push to main:

  git push origin main
         │
         ▼
  GitHub triggers Vercel webhook
         │
         ▼
  Vercel builds project
         │
         ├─ Success → Deploy to production
         └─ Failure → Keep old version

═══════════════════════════════════════════════════════════════════

ENVIRONMENT VARIABLES FLOW
──────────────────────────

Local (.env) → Copy values → Vercel Dashboard → Deployment
                                    │
                                    ▼
                            Your App Uses These
                                    │
                                    ▼
                            Connects to Services
                                    │
                      ┌─────────────┼─────────────┐
                      ▼             ▼             ▼
                  Appwrite        Plaid        Dwolla

═══════════════════════════════════════════════════════════════════

CRITICAL ENVIRONMENT VARIABLES
───────────────────────────────

Must Have:
  ✅ NEXT_PUBLIC_SITE_URL
  ✅ NEXT_PUBLIC_APPWRITE_PROJECT
  ✅ APPWRITE_SECRET
  ✅ PLAID_CLIENT_ID
  ✅ PLAID_SECRET
  ✅ DWOLLA_KEY
  ✅ DWOLLA_SECRET

Should Update After First Deploy:
  ⚠️ NEXT_PUBLIC_SITE_URL (with real URL)
  ⚠️ NEXT_PUBLIC_PLAID_REDIRECT_URI (with real URL)

═══════════════════════════════════════════════════════════════════

TROUBLESHOOTING DECISION TREE
──────────────────────────────

Build Failed?
  ├─ Missing env vars? → Add them in Vercel
  ├─ TypeScript error? → Fix locally, push again
  └─ Dependency issue? → Check package.json

Deployed but errors?
  ├─ Check Vercel Function Logs
  ├─ Check browser console (F12)
  └─ Verify API credentials

Appwrite not connecting?
  ├─ Check Appwrite Platform added
  ├─ Verify APPWRITE_PROJECT ID
  └─ Check APPWRITE_SECRET

Plaid not working?
  ├─ Check Redirect URI in Plaid Dashboard
  ├─ Verify PLAID_CLIENT_ID and SECRET
  └─ Check NEXT_PUBLIC_PLAID_REDIRECT_URI

Slow performance?
  ├─ Check cache is working
  ├─ Review Vercel Analytics
  └─ Check [perf] logs

═══════════════════════════════════════════════════════════════════
```

## Quick Commands Reference

### Deploy from scratch:
```bash
git push origin main
# → Go to vercel.com → Import → Add env vars → Deploy
```

### Update environment variables:
```bash
# 1. Update in Vercel Dashboard
# 2. Go to Deployments → Latest → ... → Redeploy
```

### Rollback deployment:
```bash
# Go to Vercel → Deployments → Previous → ... → Promote to Production
```

### Check logs:
```bash
# Vercel Dashboard → Project → Logs (real-time)
# Or: Deployments → Latest → Logs
```

### Local test before deploy:
```powershell
npm run build
npm start
# Test on http://localhost:3000
```

---

## Production Checklist

When moving from sandbox to production:

1. **Plaid:** Change to production environment
   - `PLAID_ENV=production`
   - Get production credentials from Plaid

2. **Dwolla:** Change to production environment
   - `DWOLLA_ENV=production`
   - `DWOLLA_BASE_URL=https://api.dwolla.com`
   - Get production credentials from Dwolla

3. **Security:**
   - Enable rate limiting
   - Set up monitoring
   - Configure alerts
   - Review CORS settings

4. **Domain:**
   - Add custom domain in Vercel
   - Update all URLs in env vars
   - Update third-party services

---

For detailed step-by-step instructions, see:
📖 **VERCEL_DEPLOYMENT_GUIDE.md**
