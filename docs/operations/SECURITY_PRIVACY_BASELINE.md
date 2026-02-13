# Security & Privacy Baseline (v2)

> **Non-negotiable security and privacy rules for every project.**
>
> These are MUST-level requirements. Every AI agent, every developer,
> every code review must enforce these without exception.

---

## MUST Rules — Zero Tolerance

These rules apply to ALL code, in ALL languages, at ALL times.
AI agents must treat violations as blockers, never as warnings.

### 1. Never Log Secrets

```typescript
// ❌ NEVER
logger.info(`Connecting with password: ${dbPassword}`);
logger.debug(`API key: ${apiKey}`);
console.log(`Token: ${token}`);

// ✅ ALWAYS
logger.info('Database connection established', { host: dbHost, port: dbPort });
logger.debug('API request authenticated', { userId: user.id });
```

**Rule:** Never log, print, or expose: passwords, API keys, tokens,
private keys, connection strings with credentials, PII (SSN, credit cards).

### 2. Validate All Input

Every piece of external input must be validated BEFORE processing.

```typescript
// ✅ Validate at the boundary
const CreateUserSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().min(1).max(100).regex(/^[\p{L}\p{N}\s'-]+$/u),
  age: z.number().int().min(13).max(150),
});

function createUser(raw: unknown) {
  const input = CreateUserSchema.parse(raw);  // Throws on invalid
  // ... safe to use input
}
```

**What counts as external input:**
- HTTP request bodies, query params, headers
- File uploads
- Database query results (when used in further queries)
- Environment variables
- Message queue payloads
- Third-party API responses
- User-provided file paths

### 3. Escape and Sanitize Output

```typescript
// XSS prevention — sanitize HTML output
import DOMPurify from 'dompurify';
const safeHtml = DOMPurify.sanitize(userInput);

// SQL injection — always parameterize
// ❌ NEVER
const query = `SELECT * FROM users WHERE id = ${userId}`;
// ✅ ALWAYS
const query = 'SELECT * FROM users WHERE id = $1';
await db.query(query, [userId]);

// Shell injection — never interpolate
// ❌ NEVER
exec(`convert ${filename} output.png`);
// ✅ ALWAYS
execFile('convert', [filename, 'output.png']);
```

### 4. Authentication ≠ Authorization

```typescript
// ❌ Checking only authentication
app.get('/api/users/:id', requireAuth, (req, res) => {
  return db.getUser(req.params.id); // Any authenticated user can read any user!
});

// ✅ Checking both authentication AND authorization
app.get('/api/users/:id', requireAuth, (req, res) => {
  if (req.user.id !== req.params.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  return db.getUser(req.params.id);
});
```

**Rules:**
- Every endpoint checks both authn AND authz.
- Admin endpoints require role verification.
- Resource access checks ownership or permissions.
- Default deny — no access unless explicitly granted.

### 5. Prevent SSRF

```typescript
// ❌ Accepting arbitrary URLs
const response = await fetch(req.body.url);

// ✅ Allow-listed domains only
const ALLOWED_HOSTS = new Set(['api.example.com', 'cdn.example.com']);

function safeFetch(url: string) {
  const parsed = new URL(url);

  // Block private/internal IPs
  if (isPrivateIP(parsed.hostname)) {
    throw new SecurityError('Internal addresses not allowed');
  }

  // Allow-listed hosts only
  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new SecurityError(`Host not allowed: ${parsed.hostname}`);
  }

  // Enforce HTTPS
  if (parsed.protocol !== 'https:') {
    throw new SecurityError('HTTPS required');
  }

  return fetch(url, { redirect: 'error' }); // No redirects
}
```

### 6. Prevent Path Traversal

```typescript
import path from 'path';

// ❌ NEVER trust user-provided paths
const file = fs.readFileSync(`uploads/${req.params.filename}`);

// ✅ Validate and resolve to safe base
function safeFilePath(basedir: string, userPath: string): string {
  const resolved = path.resolve(basedir, userPath);
  if (!resolved.startsWith(path.resolve(basedir))) {
    throw new SecurityError('Path traversal detected');
  }
  return resolved;
}

const safePath = safeFilePath('/var/app/uploads', req.params.filename);
const file = fs.readFileSync(safePath);
```

### 7. SQL Safety

```python
# ❌ NEVER — string formatting in queries
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")

# ✅ ALWAYS — parameterized queries
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))

# ✅ ORM with parameterized filters
User.objects.filter(name=name)

# ✅ Query builder with bound parameters
db.select().from('users').where('name', '=', name)
```

**Rules:**
- Never use string concatenation or f-strings in SQL.
- Always use parameterized queries or ORM.
- If raw SQL is needed, use prepared statements.
- Validate and allowlist column names for dynamic ordering/filtering.

### 8. File Upload Security

```typescript
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'application/pdf'
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function validateUpload(file: UploadedFile): void {
  // Check size
  if (file.size > MAX_FILE_SIZE) {
    throw new ValidationError('File too large');
  }

  // Check MIME type (don't trust Content-Type header alone)
  const detectedType = detectMimeType(file.buffer); // magic bytes
  if (!ALLOWED_TYPES.has(detectedType)) {
    throw new ValidationError(`File type not allowed: ${detectedType}`);
  }

  // Generate safe filename (never use original name)
  const safeName = `${crypto.randomUUID()}.${getExtension(detectedType)}`;

  // Store outside web root
  const dest = path.join(UPLOAD_DIR, safeName);
}
```

### 9. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// Global rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // per IP
  standardHeaders: true,
  legacyHeaders: false,
}));

// Stricter limit for auth endpoints
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                    // 10 attempts per 15 min
  skipSuccessfulRequests: true,
}));
```

**Minimum rate limits by endpoint type:**

| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Login/auth | 10 | 15 min |
| Password reset | 5 | 15 min |
| API (authenticated) | 1000 | 15 min |
| API (public) | 100 | 15 min |
| File upload | 20 | 15 min |
| Webhooks | 500 | 15 min |

---

## OWASP Top 10 Mapping

| OWASP Category | Our Rule | Section |
|---------------|----------|---------|
| A01: Broken Access Control | AuthN ≠ AuthZ, Path Traversal | §4, §6 |
| A02: Cryptographic Failures | Never log secrets, HTTPS only | §1, §5 |
| A03: Injection | SQL Safety, Input Validation | §7, §2 |
| A04: Insecure Design | Validate all input, default deny | §2, §4 |
| A05: Security Misconfiguration | Rate limiting, headers | §9 |
| A06: Vulnerable Components | Dependency scanning | CI gates |
| A07: Auth Failures | Rate limiting on auth | §9 |
| A08: Data Integrity | Input validation, schema checks | §2 |
| A09: Logging Failures | Never log secrets, structured logs | §1 |
| A10: SSRF | SSRF prevention | §5 |

---

## Privacy Requirements

### Data Classification

| Level | Examples | Handling |
|-------|----------|----------|
| **Public** | Marketing content, docs | No restrictions |
| **Internal** | Employee names, internal IDs | Access control required |
| **Confidential** | Email, phone, address | Encrypted at rest + transit |
| **Restricted** | SSN, credit card, health data | Encrypted, audited, minimal retention |

### Privacy Rules

1. **Minimize collection** — only collect data you actively need.
2. **Purpose limitation** — use data only for its stated purpose.
3. **Retention limits** — delete data when no longer needed.
4. **Consent** — obtain and record user consent for data processing.
5. **Right to delete** — implement data deletion/anonymization.
6. **Encryption at rest** — encrypt Confidential and Restricted data.
7. **Encryption in transit** — TLS 1.2+ for all connections.
8. **Audit logging** — log all access to Restricted data.

### PII Handling

```typescript
// ❌ Storing PII in plain text logs
logger.info(`User signed up: ${email}, DOB: ${dateOfBirth}`);

// ✅ Redact PII in logs
logger.info('User signed up', {
  userId: user.id,
  email: maskEmail(email),  // j***@example.com
  hasDateOfBirth: Boolean(dateOfBirth),  // Boolean only
});

// ❌ Returning unnecessary PII in API responses
return { ...user };  // Leaks password hash, SSN, etc.

// ✅ Explicit response shaping
return {
  id: user.id,
  name: user.name,
  email: user.email,
  // Only fields the client needs
};
```

---

## Encryption Standards

### Minimum Requirements

| Purpose | Algorithm | Key Size |
|---------|-----------|----------|
| Symmetric encryption | AES-256-GCM | 256-bit |
| Hashing (passwords) | bcrypt / Argon2id | cost factor ≥ 12 |
| Hashing (integrity) | SHA-256+ | — |
| TLS | 1.2+ (prefer 1.3) | — |
| JWT signing | RS256 or ES256 | 2048-bit RSA / P-256 |
| API keys | crypto.randomBytes | ≥ 32 bytes |

### Password Storage

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Verify
const isValid = await bcrypt.compare(password, storedHash);

// ❌ NEVER
const hash = crypto.createHash('md5').update(password).digest('hex');
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

---

## Dependency Security

### Supply Chain Safety

```yaml
# Automated dependency updates
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: "/"
    schedule:
      interval: weekly
    open-pull-requests-limit: 10
    reviewers:
      - security-team
```

### Dependency Rules

1. **Audit regularly** — run `npm audit` / `pip audit` / `cargo audit` in CI.
2. **Pin versions** — use lockfiles (package-lock.json, poetry.lock, Cargo.lock).
3. **Review new deps** — before adding, check: maintenance status, download count,
   known vulnerabilities, license compatibility.
4. **Minimize deps** — fewer dependencies = smaller attack surface.
5. **No wildcard versions** — never use `*` or `latest` in production.

---

## Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
```

---

## AI Agent Security Rules

When an AI agent generates or modifies code:

1. **Never weaken security** — if existing code has validation/auth, keep it.
2. **Never add eval()** — no dynamic code execution from user input.
3. **Never disable SSL verification** — no `rejectUnauthorized: false`.
4. **Never hardcode secrets** — use environment variables or secret managers.
5. **Never bypass auth** — no `// TODO: add auth later` in production code.
6. **Flag uncertainty** — if unsure about a security implication, flag it.

---

## Compliance Quick Reference

| Regulation | Key Requirements | Applies When |
|------------|-----------------|--------------|
| GDPR | Consent, right to delete, DPO, breach notification | EU user data |
| CCPA/CPRA | Opt-out, data inventory, privacy policy | California users |
| HIPAA | PHI encryption, access controls, audit trails | Health data |
| PCI DSS | Card data encryption, network segmentation | Payment processing |
| SOC 2 | Access controls, monitoring, incident response | B2B SaaS |

---

*Version: 2.0.0*
