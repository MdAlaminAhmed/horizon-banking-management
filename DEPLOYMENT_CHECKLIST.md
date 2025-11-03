# 🚀 Vercel Deployment Checklist

Use this checklist to ensure smooth deployment.

---

## Before Deployment

### Code Repository
- [ ] All changes committed to git
- [ ] Code pushed to GitHub main branch
- [ ] `.env` file is in `.gitignore`
- [ ] Build succeeds locally (`npm run build`)

### Third-Party Credentials Ready
- [ ] Appwrite project ID and secret
- [ ] Plaid client ID and secret (sandbox)
- [ ] Dwolla key and secret (sandbox)
- [ ] Sentry DSN (optional)

---

## Vercel Setup

### Account & Project
- [ ] Logged into Vercel with GitHub
- [ ] Repository imported to Vercel
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Build settings: Default (no changes needed)

### Environment Variables (Critical!)
Add ALL these in Vercel dashboard:

#### Site Configuration
- [ ] `NEXT_PUBLIC_SITE_URL` (update after first deploy)

#### Appwrite (7 variables)
- [ ] `NEXT_PUBLIC_APPWRITE_ENDPOINT`
- [ ] `NEXT_PUBLIC_APPWRITE_PROJECT`
- [ ] `APPWRITE_DATABASE_ID`
- [ ] `APPWRITE_USER_COLLECTION_ID`
- [ ] `APPWRITE_BANK_COLLECTION_ID`
- [ ] `APPWRITE_TRANSACTION_COLLECTION_ID`
- [ ] `APPWRITE_SECRET`

#### Plaid (6 variables)
- [ ] `PLAID_CLIENT_ID`
- [ ] `PLAID_SECRET`
- [ ] `PLAID_ENV` (set to "sandbox")
- [ ] `PLAID_PRODUCTS` (set to "auth,transactions,identity")
- [ ] `PLAID_COUNTRY_CODES` (set to "US,CA")
- [ ] `NEXT_PUBLIC_PLAID_REDIRECT_URI` (update after first deploy)

#### Dwolla (4 variables)
- [ ] `DWOLLA_KEY`
- [ ] `DWOLLA_SECRET`
- [ ] `DWOLLA_BASE_URL` (set to "https://api-sandbox.dwolla.com")
- [ ] `DWOLLA_ENV` (set to "sandbox")

#### Optional Variables
- [ ] `NEXT_PUBLIC_SENTRY_DSN` (if using Sentry)
- [ ] `SENTRY_DSN` (if using Sentry)
- [ ] `SENTRY_AUTH_TOKEN` (if using Sentry)
- [ ] `DWOLLA_REQUIRE_ON_DEMAND` (set to "false")
- [ ] `ALLOW_BANK_SAVE_WITHOUT_DWOLLA` (set to "false")

---

## First Deployment

- [ ] Click "Deploy" button in Vercel
- [ ] Wait for build to complete (2-5 minutes)
- [ ] Build succeeds without errors
- [ ] Copy your Vercel deployment URL
- [ ] Note the URL: `https://_________________________.vercel.app`

---

## Post-Deployment Configuration

### Update Environment Variables
- [ ] Update `NEXT_PUBLIC_SITE_URL` with actual Vercel URL
- [ ] Update `NEXT_PUBLIC_PLAID_REDIRECT_URI` with actual Vercel URL
- [ ] Click "Redeploy" after updating

### Configure Appwrite
- [ ] Login to Appwrite Console
- [ ] Go to Settings → Platforms
- [ ] Add Web Platform with Vercel hostname (no https://)
- [ ] Save changes

### Configure Plaid
- [ ] Login to Plaid Dashboard
- [ ] Go to Team Settings → API
- [ ] Add Vercel URL to "Allowed redirect URIs"
- [ ] Save changes

### Configure Dwolla (Usually not needed)
- [ ] Verify sandbox environment is accessible
- [ ] No additional configuration typically required

---

## Testing Checklist

### Basic Functionality
- [ ] Homepage loads without errors
- [ ] Sign Up creates new account
- [ ] Sign In works with existing account
- [ ] Dashboard displays correctly
- [ ] Navigation works (all menu items)

### Banking Features
- [ ] "Add Bank" button appears
- [ ] Plaid Link modal opens
- [ ] Can connect test bank account
- [ ] Bank appears in "My Banks"
- [ ] Account balance displays

### Transactions
- [ ] Transaction History loads
- [ ] Transactions display correctly
- [ ] Pagination works

### Transfers
- [ ] Transfer Funds page loads
- [ ] Form displays correctly
- [ ] Can select source/destination accounts
- [ ] Transfer completes successfully

### Performance
- [ ] Pages load in < 3 seconds (first visit)
- [ ] Cached pages load in < 300ms
- [ ] No console errors in browser DevTools
- [ ] No 500 errors in Vercel logs

---

## Production Checklist (When Going Live)

### Security
- [ ] Change Plaid from `sandbox` to `production`
- [ ] Update `PLAID_ENV=production`
- [ ] Change Dwolla from `sandbox` to `production`
- [ ] Update `DWOLLA_ENV=production`
- [ ] Update `DWOLLA_BASE_URL=https://api.dwolla.com`
- [ ] Regenerate all API keys for production
- [ ] Enable rate limiting
- [ ] Set up monitoring/alerts

### Performance
- [ ] Enable Vercel Analytics
- [ ] Configure Sentry for error tracking
- [ ] Set appropriate cache TTLs
- [ ] Monitor Core Web Vitals

### Domain
- [ ] Add custom domain in Vercel
- [ ] Update DNS records
- [ ] Update all environment variables with new domain
- [ ] Update Appwrite platform
- [ ] Update Plaid redirect URIs
- [ ] SSL certificate verified

---

## Troubleshooting Quick Reference

### Build Fails
**Check:**
- [ ] All dependencies in `package.json`
- [ ] No TypeScript errors locally
- [ ] Environment variables syntax

### Runtime Errors
**Check:**
- [ ] Vercel Function Logs
- [ ] Browser Console (F12)
- [ ] Network tab for failed requests
- [ ] Environment variables are correct

### API Connection Fails
**Check:**
- [ ] Appwrite platform configured
- [ ] Plaid redirect URI added
- [ ] No typos in API keys
- [ ] Correct API endpoints

### Performance Issues
**Check:**
- [ ] Optimizations are deployed
- [ ] Cache is working (check headers)
- [ ] No unnecessary API calls
- [ ] [perf] logs in Vercel

---

## Emergency Rollback

If deployment has critical issues:
- [ ] Go to Vercel Dashboard → Deployments
- [ ] Find last working deployment
- [ ] Click "..." → "Promote to Production"
- [ ] Verify rollback works

---

## Success Criteria

✅ **Deployment is successful when:**
1. Build completes without errors
2. All pages load correctly
3. Sign up/sign in works
4. Bank connection works
5. Transfers work
6. No critical errors in logs
7. Performance is acceptable (< 3s initial load)

---

## 📝 Notes

**Date Deployed:** _______________

**Vercel URL:** _______________________________________________

**Issues Encountered:** 



**Solutions Applied:**



---

## Need Help?

- 📖 Read: `VERCEL_DEPLOYMENT_GUIDE.md` for detailed steps
- 🔍 Check: Vercel logs and browser console
- 🐛 Debug: Enable verbose logging
- 💬 Support: Vercel Discord or documentation

**Good luck with your deployment! 🚀**
