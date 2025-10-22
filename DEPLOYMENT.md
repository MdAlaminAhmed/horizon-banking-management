# Deployment Guide

## Quick Deploy to Vercel

1. **Prepare Your Repository**
   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Select `horizon-banking-management`
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables**
   
   Add these in Vercel dashboard under Settings → Environment Variables:

   ```
   NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
   APPWRITE_DATABASE_ID=your_database_id
   APPWRITE_USER_COLLECTION_ID=your_collection_id
   APPWRITE_BANK_COLLECTION_ID=your_collection_id
   APPWRITE_TRANSACTION_COLLECTION_ID=your_collection_id
   APPWRITE_SECRET=your_secret
   PLAID_CLIENT_ID=your_client_id
   PLAID_SECRET=your_secret
   PLAID_ENV=sandbox
   PLAID_PRODUCTS=auth,transactions,identity
   PLAID_COUNTRY_CODES=US,CA
   DWOLLA_KEY=your_key
   DWOLLA_SECRET=your_secret
   DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
   DWOLLA_ENV=sandbox
   ```

4. **Post-Deployment Configuration**

   a. **Update Appwrite**
   - Go to Appwrite Console → Your Project → Settings
   - Add your Vercel URL to "Platforms"
   - Add it as a Web platform

   b. **Update Plaid**
   - Go to Plaid Dashboard → API → Redirect URIs
   - Add: `https://your-project.vercel.app`

   c. **Update Dwolla** (if needed)
   - Add your domain to allowed origins

5. **Verify Deployment**
   - Visit your Vercel URL
   - Test sign-up/sign-in
   - Test bank connection
   - Test fund transfer

## Custom Domain (Optional)

1. Go to Vercel Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables with new domain

## Monitoring

- Check deployment logs in Vercel dashboard
- Use Sentry for error tracking
- Monitor Appwrite usage in Appwrite console

## Troubleshooting

**Issue:** Build fails
- Check environment variables are set correctly
- Verify all dependencies are in package.json

**Issue:** Runtime errors
- Check Vercel logs under "Deployments"
- Verify API credentials

**Issue:** Database connection fails
- Verify Appwrite credentials
- Check if Vercel IP is whitelisted in Appwrite

## Rollback

If deployment fails:
```bash
# In Vercel dashboard
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
```

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Appwrite platform configured
- [ ] Plaid redirect URI updated
- [ ] Custom domain configured (if using)
- [ ] SSL certificate active
- [ ] Error monitoring enabled
- [ ] Test all features in production
