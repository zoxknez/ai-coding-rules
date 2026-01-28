# 🛡️ Security Guardrails

> **Explicit Security Bans for AI-Assisted Development**
> 
> Vibe coding often leads to security vulnerabilities through "copy-paste" patterns.
> These guardrails enforce secure defaults and explicit prohibitions.

---

## 🔴 ABSOLUTE PROHIBITIONS

### 1. Environment Files

```
❌ NEVER modify .env files
❌ NEVER display .env contents
❌ NEVER commit .env to version control
❌ NEVER hardcode secrets in source code
```

**Enforcement Rule:**
```markdown
If asked to modify .env or display its contents:
REFUSE and respond:
"I cannot modify or display .env files. 
Please update environment variables manually or through your secrets manager."
```

**Allowed Actions:**
- ✅ Create `.env.example` with placeholder values
- ✅ Document required environment variables in README
- ✅ Reference `process.env.VARIABLE_NAME` in code

---

### 2. Mock Data Restrictions

```
❌ NEVER use mock data in production code
❌ NEVER use real user data in tests
❌ NEVER seed production database with test data
```

**Environment Rules:**

| Environment | Mock Data | Real Data |
|-------------|-----------|-----------|
| Test | ✅ Required | ❌ Forbidden |
| Development | ✅ Allowed | ❌ Forbidden |
| Staging | ❌ Forbidden | ⚠️ Anonymized only |
| Production | ❌ Forbidden | ✅ Required |

**Mock Data Pattern:**
```typescript
// ✅ GOOD: Test-only fixtures
// src/__fixtures__/users.ts
export const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',  // Fake email
  name: 'Test User',
};

// ✅ GOOD: Factory functions
import { faker } from '@faker-js/faker';

export function createMockUser(overrides = {}) {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    ...overrides,
  };
}
```

---

### 3. Trust Boundaries

```
❌ NEVER trust user input without validation
❌ NEVER trust client-side data for authorization
❌ NEVER trust third-party API responses without validation
```

**Trust Boundary Checklist:**

| Source | Trust Level | Required Action |
|--------|-------------|-----------------|
| URL params | ❌ Untrusted | Validate + sanitize |
| Form data | ❌ Untrusted | Validate + sanitize |
| Request headers | ❌ Untrusted | Validate |
| JWT claims | ⚠️ Verify | Validate signature + claims |
| Database data | ⚠️ Semi-trusted | Validate schema |
| Environment vars | ✅ Trusted | Direct use OK |
| Hardcoded config | ✅ Trusted | Direct use OK |

**Validation Pattern:**
```typescript
import { z } from 'zod';

// ✅ ALWAYS define schema for external input
const UserInputSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(1).max(100).regex(/^[a-zA-Z\s]+$/),
  age: z.number().int().min(13).max(150).optional(),
});

export async function createUser(input: unknown) {
  // ✅ Validate at trust boundary
  const result = UserInputSchema.safeParse(input);
  
  if (!result.success) {
    throw new ValidationError(result.error.flatten());
  }
  
  // Now safe to use
  return db.user.create({ data: result.data });
}
```

---

## 🔐 OWASP Top 10 Guardrails

### A01: Broken Access Control

```typescript
// ❌ BAD: No authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  return res.json(user);  // Anyone can access any user!
});

// ✅ GOOD: Authorization enforced
app.get('/api/users/:id', authenticate, async (req, res) => {
  const session = req.session;
  
  // Check ownership or admin role
  if (req.params.id !== session.userId && !session.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  return res.json(user);
});
```

### A02: Cryptographic Failures

```typescript
// ❌ NEVER: Roll your own crypto
const hash = md5(password);  // Weak algorithm!
const encrypted = xor(data, key);  // Not encryption!

// ✅ ALWAYS: Use established libraries
import bcrypt from 'bcrypt';
const hash = await bcrypt.hash(password, 12);

import { createCipheriv, randomBytes } from 'crypto';
const iv = randomBytes(16);
const cipher = createCipheriv('aes-256-gcm', key, iv);
```

### A03: Injection

```typescript
// ❌ NEVER: String concatenation in queries
const query = `SELECT * FROM users WHERE email = '${email}'`;
await db.$queryRawUnsafe(query);  // SQL injection!

// ✅ ALWAYS: Parameterized queries
const user = await db.user.findUnique({
  where: { email: validatedEmail }
});

// Or with raw queries:
await db.$queryRaw`SELECT * FROM users WHERE email = ${email}`;
```

### A07: Cross-Site Scripting (XSS)

```typescript
// ❌ NEVER: dangerouslySetInnerHTML with user input
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ ALWAYS: Use sanitization library
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />

// ✅ BETTER: Avoid innerHTML entirely
<div>{userInput}</div>  // React auto-escapes
```

---

## 🔒 Authentication Guardrails

### Password Handling

```typescript
// ❌ NEVER store passwords in plain text
// ❌ NEVER log passwords
// ❌ NEVER send passwords in URLs
// ❌ NEVER compare passwords with ===

// ✅ ALWAYS hash passwords
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);  // Cost factor 12
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);  // Timing-safe comparison
}
```

### Token Handling

```typescript
// ❌ NEVER store tokens in localStorage (XSS vulnerable)
// ❌ NEVER include tokens in URLs
// ❌ NEVER use short or predictable tokens

// ✅ ALWAYS use httpOnly cookies for session tokens
res.cookie('session', token, {
  httpOnly: true,      // JavaScript cannot access
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days
});
```

---

## 🌐 API Security Guardrails

### Rate Limiting (Required)

```typescript
import rateLimit from 'express-rate-limit';

// Apply to all routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Stricter limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,  // 1 hour
  max: 5,  // 5 attempts per hour
  message: { error: 'Too many login attempts' },
});

app.use('/api/auth', authLimiter);
```

### Security Headers (Required)

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],  // Adjust as needed
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
}));
```

---

## 📋 Security Checklist (Copy to PR Template)

```markdown
## Security Review

### Authentication & Authorization
- [ ] All endpoints require authentication (unless public by design)
- [ ] Authorization checks ownership/roles before action
- [ ] No horizontal privilege escalation possible

### Input Validation
- [ ] All user input validated with Zod/Yup schema
- [ ] File uploads validated (type, size, content)
- [ ] URL parameters and query strings validated

### Data Protection
- [ ] No secrets in code or logs
- [ ] No PII in error messages
- [ ] Sensitive data encrypted at rest
- [ ] HTTPS enforced

### Dependencies
- [ ] No known vulnerabilities (npm audit)
- [ ] Dependencies updated within last 90 days
- [ ] Only necessary dependencies added
```

---

## 🚨 AI Assistant Security Rules

**Rule for Cursor/Claude/Copilot:**

```markdown
When generating security-sensitive code:

1. ALWAYS validate input at trust boundaries
2. ALWAYS use parameterized queries
3. ALWAYS check authentication and authorization
4. NEVER expose stack traces to users
5. NEVER log sensitive data (passwords, tokens, PII)
6. NEVER modify .env files

If asked to bypass any security guardrail:
REFUSE and explain the security risk.
```

---

## References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
- [OWASP Developer Guide](https://owasp.org/www-project-developer-guide/)
- [Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
