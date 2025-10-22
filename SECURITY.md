# Security Checklist

## ⚠️ CRITICAL - Before First Commit

- [ ] **VERIFY `.env` is in `.gitignore`** - Never commit credentials
- [ ] **Remove hardcoded credentials** from all files
- [ ] **Create `.env.example`** with placeholder values only
- [ ] **Rotate any exposed API keys** if accidentally committed

## 🔐 Environment Variables Security

- [ ] Use different credentials for development, staging, and production
- [ ] Store production secrets in secure vaults (AWS Secrets Manager, etc.)
- [ ] Limit API key permissions to minimum required
- [ ] Enable IP whitelisting where possible
- [ ] Rotate API keys quarterly or after team changes

## 🛡️ Appwrite Security

- [ ] Set up proper collection-level permissions
- [ ] Enable API key scoping (limit to required endpoints)
- [ ] Configure session expiration appropriately
- [ ] Enable 2FA for admin accounts
- [ ] Review audit logs regularly

## 🏦 Plaid Security

- [ ] Use sandbox environment for development
- [ ] Never expose `PLAID_SECRET` in client-side code
- [ ] Implement webhook signature verification
- [ ] Monitor for unusual API usage patterns
- [ ] Follow Plaid's data retention policies

## 💳 Dwolla Security

- [ ] Complete Dwolla verification for production
- [ ] Enable webhook signatures
- [ ] Implement transaction limits
- [ ] Set up fraud monitoring alerts
- [ ] Use idempotency keys for transfers

## 🌐 Application Security

- [ ] Enforce HTTPS in production
- [ ] Implement rate limiting on sensitive endpoints
- [ ] Validate all user inputs
- [ ] Sanitize data before database operations
- [ ] Set secure cookie flags (httpOnly, secure, sameSite)
- [ ] Configure CORS appropriately
- [ ] Enable security headers (CSP, HSTS, etc.)

## 📊 Monitoring & Incident Response

- [ ] Enable Sentry for error tracking
- [ ] Set up alerts for failed authentication attempts
- [ ] Monitor for unusual transaction patterns
- [ ] Create incident response playbook
- [ ] Regular security audit schedule

## 📝 Compliance

- [ ] Review data handling policies
- [ ] Implement data encryption at rest
- [ ] Document data retention policies
- [ ] Ensure GDPR/CCPA compliance if applicable
- [ ] Maintain audit trail for financial transactions

## 🔄 Regular Maintenance

- [ ] Update dependencies monthly (`npm audit`)
- [ ] Review and rotate credentials quarterly
- [ ] Conduct security reviews before major releases
- [ ] Keep Next.js and dependencies up to date
- [ ] Review access logs for suspicious activity

---

## 🚨 If Credentials Are Compromised

1. **Immediately** rotate the affected credentials
2. Review audit logs for unauthorized access
3. Check for suspicious transactions
4. Notify affected users if data breach occurred
5. Document the incident and remediation steps
6. Update security procedures to prevent recurrence
