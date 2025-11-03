# Horizon Banking - Quick Reference

## 🚀 Essential Commands

### Development
```bash
npm run dev              # Start development server (http://localhost:3000)
npm run type-check       # Validate TypeScript
npm run lint            # Check code quality
```

### Production
```bash
npm run build           # Build for production
npm start              # Run production server
npm run precommit       # Pre-commit validation
```

### Maintenance
```bash
npm audit              # Security audit
npm audit fix          # Fix vulnerabilities
npm update             # Update dependencies
```

---

## 🔐 Environment Variables Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Yes | Your app URL (e.g., http://localhost:3000) |
| `NEXT_PUBLIC_APPWRITE_PROJECT` | Yes | Appwrite project ID |
| `APPWRITE_SECRET` | Yes | Appwrite API key |
| `APPWRITE_DATABASE_ID` | Yes | Database ID |
| `APPWRITE_USER_COLLECTION_ID` | Yes | Users collection ID |
| `APPWRITE_BANK_COLLECTION_ID` | Yes | Banks collection ID |
| `APPWRITE_TRANSACTION_COLLECTION_ID` | Yes | Transactions collection ID |
| `PLAID_CLIENT_ID` | Yes | Plaid client ID |
| `PLAID_SECRET` | Yes | Plaid secret key |
| `PLAID_ENV` | Yes | `sandbox`/`development`/`production` |
| `DWOLLA_KEY` | Yes | Dwolla API key |
| `DWOLLA_SECRET` | Yes | Dwolla secret |
| `DWOLLA_ENV` | Yes | `sandbox` or `production` |
| `NEXT_PUBLIC_SENTRY_DSN` | No | Sentry error tracking DSN |

---

## 📁 Project Structure

```
banking/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (sign-in, sign-up)
│   ├── (root)/              # Protected pages (dashboard, etc.)
│   └── api/                 # API routes
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   └── *.tsx                # Feature components
├── lib/                     # Utilities & server actions
│   ├── actions/             # Server actions (Appwrite, Plaid, Dwolla)
│   ├── appwrite.ts          # Appwrite client
│   ├── plaid.ts             # Plaid client
│   └── utils.ts             # Helper functions
├── types/                   # TypeScript types
├── constants/               # App constants
└── public/                  # Static assets
```

---

## 🔄 Common Workflows

### Add a New Feature
1. Create component in `components/`
2. Add server action in `lib/actions/` if needed
3. Add types to `types/index.d.ts`
4. Create page in `app/(root)/`
5. Test with `npm run dev`

### Update Environment Variables
1. Edit `.env` (never commit)
2. Update `.env.example` (template only)
3. Restart dev server

### Deploy to Production
1. Run `npm run type-check`
2. Run `npm run build`
3. Test with `npm start`
4. Deploy to Vercel/Platform
5. Add environment variables in platform
6. Update service environments (Plaid/Dwolla to production)

---

## 🐛 Troubleshooting

### "No session" Error
- Check if `APPWRITE_SECRET` is set correctly
- Verify Appwrite project ID matches
- Clear cookies and try signing in again

### Plaid Link Won't Open
- Verify `PLAID_CLIENT_ID` and `PLAID_SECRET`
- Check `PLAID_ENV` setting
- Review Plaid dashboard for account status

### Transfer Failed
- Ensure Dwolla customer is created
- Verify funding source is connected
- Check Dwolla environment matches (sandbox/production)

### Build Errors
- Run `npm run type-check` to see TypeScript errors
- Check `npm audit` for dependency issues
- Clear `.next/` folder and rebuild

---

## 🎯 Key Features Implementation

### User Authentication
- **File**: `lib/actions/user.actions.ts`
- **Flow**: Sign up → Create Appwrite user → Create Dwolla customer
- **Session**: Stored in httpOnly cookie

### Bank Linking
- **File**: `components/PlaidLink.tsx`
- **Flow**: PlaidLink → Exchange token → Create processor token → Add Dwolla funding source
- **Storage**: Bank metadata in Appwrite

### Money Transfer
- **File**: `lib/actions/dwolla.actions.ts`
- **Flow**: Create transfer → Process via Dwolla → Store transaction in Appwrite
- **Status**: Tracked in Dwolla dashboard

### Transaction Display
- **File**: `lib/actions/transaction.actions.ts`
- **Data**: Merged from Appwrite (transfers) and Plaid (bank transactions)

---

## 📊 Service Dashboards

- **Appwrite**: https://cloud.appwrite.io
- **Plaid**: https://dashboard.plaid.com
- **Dwolla**: https://dashboard.dwolla.com (sandbox)
- **Sentry**: https://sentry.io (if configured)
- **Vercel**: https://vercel.com/dashboard (if deployed)

---

## 🔒 Security Reminders

- ✅ Never commit `.env` file
- ✅ Use different credentials per environment
- ✅ Rotate API keys regularly
- ✅ Enable 2FA on all service accounts
- ✅ Review security logs monthly
- ✅ Keep dependencies updated

---

## 📈 Performance Tips

- Use React Server Components by default
- Add `'use client'` only when needed (forms, interactions)
- Leverage Next.js caching with `revalidatePath()`
- Optimize images with Next.js Image component
- Monitor Core Web Vitals in production

---

## 📝 Development Best Practices

1. **Type Safety**: Add types to `types/index.d.ts`
2. **Server Actions**: Use `'use server'` for data mutations
3. **Error Handling**: Log errors, use Sentry in production
4. **Validation**: Use Zod schemas for form validation
5. **Styling**: Prefer Tailwind utilities, use `cn()` for conditionals

---

## 🔗 Quick Links

- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](./SECURITY.md) - Security checklist
- [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - Setup summary

---

**💡 Tip**: Bookmark this file for quick reference during development!
