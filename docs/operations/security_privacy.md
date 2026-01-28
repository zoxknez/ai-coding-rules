# Security & Privacy Guardrails for AI Coding (v3)

## 🔐 Secrets Management

### Never Do
- Hard-code API keys, tokens, passwords
- Commit .env files with real values
- Log secrets or full tokens
- Store secrets in plaintext

### Always Do
- Use `EXAMPLE_...` values in examples
- Use environment variables
- Mask in logs: tokens, emails, phones, addresses
- Document required env vars

## 🔑 Auth / Authorization

### Rules
- Never assume role/tenant permissions
- Always verify permissions server-side
- Validate JWT/session on every request
- Check resource ownership explicitly

### Common Mistakes
```
❌ if (user.role === 'admin') // Client-side only
✅ await authz.check(user, resource, 'write') // Server-side
```

## 🛡️ Input Validation

### All External Inputs
- HTTP request bodies/params/headers
- Environment variables
- File contents
- Database results (for type safety)

### Frontend XSS Prevention
- Never use `dangerouslySetInnerHTML` without sanitization
- Escape user content in templates
- Use Content-Security-Policy headers

## 🌐 SSRF / Path Traversal

### SSRF Prevention
- Never fetch arbitrary URLs without allow-list
- Validate URL schemes (http/https only)
- Block internal IPs (127.0.0.1, 10.x, 192.168.x)

### Path Traversal Prevention
- Validate file paths against base directory
- Reject paths with `..` segments
- Use path.resolve() and verify result

## 📦 Dependencies

### Before Adding
- Check license compatibility
- Review security advisories
- Verify maintenance status
- Assess bundle size impact

### Updates
- Major versions require migration plan
- Run security audit after updates
- Test thoroughly before deploying

## 🚨 Incident Response (Quick)

When vulnerability discovered:
1. **Rollback** affected code immediately
2. **Rotate** any exposed secrets
3. **Notify** security team
4. **Add test** to prevent recurrence
5. **Postmortem** to document and learn

## 📋 Security Review Checklist

- [ ] No hard-coded secrets
- [ ] All inputs validated
- [ ] Auth checks on all protected routes
- [ ] No SSRF vectors
- [ ] No path traversal vectors
- [ ] Dependencies audited
- [ ] Sensitive data masked in logs
- [ ] Error messages don't leak internals
