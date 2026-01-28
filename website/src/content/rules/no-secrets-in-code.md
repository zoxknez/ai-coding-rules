---
title: "No Secrets in Code"
description: "Never hard-code API keys, tokens, or passwords. Use environment variables and mask logs."
category: "security"
complexity: "low"
impact: "critical"
tags: ["security", "secrets", "env-vars", "compliance"]
relatedRules: ["input-validation", "auth-verification"]
pubDate: 2026-01-27
---

## The Rule

> **Never commit secrets to version control. Ever.**

Even "temporary" commits leak secrets forever (Git history persists).

---

## What Are Secrets?

- API keys (OpenAI, Stripe, AWS, etc.)
- Database passwords
- JWT signing keys
- OAuth client secrets
- SSH private keys
- Encryption keys
- Webhook secrets
- Any token that grants access

---

## ❌ Never Do This

```typescript
// config.ts
export const config = {
  openaiKey: 'sk-proj-abc123...', // ❌ LEAKED!
  dbPassword: 'myPassword123',     // ❌ LEAKED!
  jwtSecret: 'supersecret',        // ❌ LEAKED!
};
```

```bash
# .env (committed to Git)
DATABASE_URL=postgresql://user:password@... # ❌ LEAKED!
STRIPE_SECRET_KEY=sk_live_...              # ❌ LEAKED!
```

**Why it's bad:**
- GitHub bots scan for secrets → auto-revoked keys
- Public repos = anyone can steal credentials
- Git history persists → can't un-leak a secret

---

## ✅ Always Do This

### 1. Use Environment Variables

```typescript
// config.ts
export const config = {
  openaiKey: process.env.OPENAI_API_KEY!,
  dbPassword: process.env.DATABASE_PASSWORD!,
  jwtSecret: process.env.JWT_SECRET!,
};
```

```bash
# .env (in .gitignore)
OPENAI_API_KEY=sk-proj-abc123...
DATABASE_PASSWORD=myPassword123
JWT_SECRET=supersecret
```

```bash
# .env.example (committed to Git)
OPENAI_API_KEY=sk-proj-REPLACE_ME
DATABASE_PASSWORD=your_password_here
JWT_SECRET=generate_random_string
```

---

### 2. Mask Secrets in Logs

```typescript
// ❌ Bad: Logs full token
logger.info('User logged in', { token: userToken });

// ✅ Good: Masks token
logger.info('User logged in', { 
  token: userToken.slice(0, 8) + '...' 
});

// ✅ Better: Don't log tokens at all
logger.info('User logged in', { userId: user.id });
```

---

### 3. Validate Environment Variables

```typescript
// server.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'OPENAI_API_KEY',
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required env var: ${envVar}`);
  }
}
```

**Why:** Fail fast on startup instead of crashing in production.

---

## Real-World Examples

### Example 1: API Client

```typescript
// ❌ Bad
class OpenAIClient {
  private apiKey = 'sk-proj-abc123...'; // LEAKED!
  
  async complete(prompt: string) {
    return fetch('https://api.openai.com/v1/completions', {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      // ...
    });
  }
}

// ✅ Good
class OpenAIClient {
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async complete(prompt: string) {
    return fetch('https://api.openai.com/v1/completions', {
      headers: { Authorization: `Bearer ${this.apiKey}` },
      // ...
    });
  }
}

// Usage
const client = new OpenAIClient(process.env.OPENAI_API_KEY!);
```

---

### Example 2: Database Connection

```typescript
// ❌ Bad
const db = new Pool({
  user: 'postgres',
  password: 'myPassword123', // LEAKED!
  host: 'localhost',
  database: 'mydb',
});

// ✅ Good
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production',
});
```

---

### Example 3: JWT Signing

```typescript
// ❌ Bad
function generateToken(user: User) {
  return jwt.sign({ id: user.id }, 'supersecret'); // LEAKED!
}

// ✅ Good
function generateToken(user: User) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  
  return jwt.sign({ id: user.id }, secret);
}
```

---

## Deployment Checklist

### Development
```bash
# .env (local, in .gitignore)
DATABASE_URL=postgresql://localhost/dev
JWT_SECRET=dev-secret-change-in-prod
OPENAI_API_KEY=sk-proj-...
```

### Production (Vercel/Netlify/AWS)
```bash
# Set via platform UI or CLI
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add OPENAI_API_KEY production
```

**Never** set production secrets in `.env` files.

---

## What If I Leaked a Secret?

### Immediate Response

1. **Revoke the key** (OpenAI dashboard, AWS IAM, etc.)
2. **Rotate the secret** (generate new key)
3. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   ```
4. **Force push** (breaks others' local repos - warn team first):
   ```bash
   git push origin --force --all
   ```
5. **Notify affected users** (if customer data at risk)

---

## Tools to Prevent Leaks

### Pre-commit Hooks
```bash
# Install git-secrets
brew install git-secrets

# Scan for common patterns
git secrets --scan
git secrets --register-aws
```

### GitHub Secret Scanning
- Automatically enabled on public repos
- Detects 200+ secret types (API keys, tokens, etc.)
- Sends alerts to repo admins

### Environment Variable Validation
```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  OPENAI_API_KEY: z.string().startsWith('sk-'),
});

export const env = envSchema.parse(process.env);
```

---

## Summary

```
✅ Use environment variables
✅ Add .env to .gitignore
✅ Commit .env.example with placeholder values
✅ Mask secrets in logs (first 8 chars only)
✅ Validate required env vars on startup
✅ Use secret scanning tools (git-secrets, GitHub)

❌ Never hard-code secrets
❌ Never commit .env files
❌ Never log full tokens
❌ Never put secrets in client-side code
```

**One leaked secret = entire system compromised.**

---

## Related Rules

- [Input Validation](/rules/input-validation) - Validate env vars with Zod
- [Auth Verification](/rules/auth-verification) - Server-side token checks
- [Logging Best Practices](/rules/logging-best-practices) - What to log safely
