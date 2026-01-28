---
title: "Input Validation"
description: "Validate all external inputs: HTTP requests, env vars, file contents, database results. Never trust user data."
category: "security"
complexity: "medium"
impact: "critical"
tags: ["security", "validation", "xss", "injection", "zod"]
relatedRules: ["no-secrets-in-code", "auth-verification"]
pubDate: 2026-01-27
---

## The Rule

> **Validate all external inputs. Never trust user data.**

External inputs include:
- HTTP request bodies, params, headers
- Environment variables
- File uploads
- Database query results (for type safety)
- Third-party API responses

---

## Why Validate?

### ❌ Without Validation

```typescript
// Injection vulnerability
app.get('/users/:id', async (req, res) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
  res.json(user);
});

// Attack: /users/1%20OR%201=1 → SQL injection
```

### ✅ With Validation

```typescript
import { z } from 'zod';

const userIdSchema = z.string().uuid();

app.get('/users/:id', async (req, res) => {
  const id = userIdSchema.parse(req.params.id); // Throws if invalid
  const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  res.json(user);
});

// Attack blocked: "1 OR 1=1" is not a valid UUID
```

---

## Validation Tools

### Recommended: Zod

```typescript
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().min(18).optional(),
});

// Validate
const result = userSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.issues });
}

const user = result.data; // Type-safe!
```

---

## HTTP Request Validation

### Body

```typescript
const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().max(10000),
  tags: z.array(z.string()).max(5).optional(),
});

app.post('/posts', async (req, res) => {
  const data = createPostSchema.parse(req.body);
  
  const post = await db.post.create({ data });
  res.json(post);
});
```

---

### Query Parameters

```typescript
const searchSchema = z.object({
  q: z.string().min(1).max(100),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

app.get('/search', async (req, res) => {
  const { q, page, limit } = searchSchema.parse(req.query);
  
  const results = await search(q, { page, limit });
  res.json(results);
});
```

**Note:** `z.coerce.number()` converts string query params to numbers.

---

### Path Parameters

```typescript
const uuidSchema = z.string().uuid();

app.get('/users/:id', async (req, res) => {
  const id = uuidSchema.parse(req.params.id);
  
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return res.status(404).json({ error: 'Not found' });
  
  res.json(user);
});
```

---

### Headers

```typescript
const authHeaderSchema = z.string().startsWith('Bearer ');

app.get('/protected', async (req, res) => {
  const authHeader = authHeaderSchema.parse(req.headers.authorization);
  const token = authHeader.slice(7); // Remove "Bearer "
  
  const user = await verifyToken(token);
  res.json({ user });
});
```

---

## File Upload Validation

### Image Upload

```typescript
import multer from 'multer';

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    
    cb(null, true);
  },
});

app.post('/upload', upload.single('avatar'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  // Additional validation: check actual file content (not just mimetype)
  const buffer = req.file.buffer;
  const type = await fileTypeFromBuffer(buffer);
  
  if (!type || !['jpg', 'png', 'webp'].includes(type.ext)) {
    return res.status(400).json({ error: 'Invalid image file' });
  }
  
  res.json({ url: `/uploads/${req.file.filename}` });
});
```

---

## Environment Variable Validation

### Startup Validation

```typescript
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  PORT: z.coerce.number().int().min(1000).max(65535).default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const env = envSchema.parse(process.env);

// Now use type-safe env vars
console.log(env.PORT); // number (not string!)
```

**Why validate at startup?**
- Fail fast (before accepting requests)
- Type safety (TypeScript knows `env.PORT` is a number)
- Clear error messages (missing `DATABASE_URL` → helpful error)

---

## Database Result Validation

### Why?

Database might return unexpected types (NULL, different schema after migration, etc.).

```typescript
const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
});

async function getUser(id: string) {
  const row = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  
  // Validate DB result
  return userSchema.parse(row);
}
```

---

## XSS Prevention

### Frontend: Escape User Content

```typescript
// ❌ Bad: Vulnerable to XSS
function Comment({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} />;
}

// Attack: text = "<img src=x onerror='alert(1)'>"

// ✅ Good: Auto-escaped by React
function Comment({ text }: { text: string }) {
  return <div>{text}</div>;
}
```

---

### Backend: Sanitize HTML

```typescript
import DOMPurify from 'isomorphic-dompurify';

const postSchema = z.object({
  content: z.string().max(10000),
});

app.post('/posts', async (req, res) => {
  const { content } = postSchema.parse(req.body);
  
  // Sanitize HTML (remove <script>, etc.)
  const sanitized = DOMPurify.sanitize(content);
  
  const post = await db.post.create({ 
    data: { content: sanitized } 
  });
  
  res.json(post);
});
```

---

## SQL Injection Prevention

### ❌ Never Use String Interpolation

```typescript
// ❌ VULNERABLE
const id = req.params.id;
const user = await db.query(`SELECT * FROM users WHERE id = ${id}`);

// Attack: id = "1 OR 1=1" → returns all users
```

---

### ✅ Use Parameterized Queries

```typescript
// ✅ SAFE (PostgreSQL)
const id = req.params.id;
const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);

// ✅ SAFE (MySQL)
const user = await db.query('SELECT * FROM users WHERE id = ?', [id]);

// ✅ SAFE (ORMs like Prisma)
const user = await prisma.user.findUnique({ where: { id } });
```

---

## Path Traversal Prevention

### ❌ Vulnerable File Access

```typescript
// ❌ Bad
app.get('/files/:filename', (req, res) => {
  const file = path.join('/uploads', req.params.filename);
  res.sendFile(file);
});

// Attack: /files/../../etc/passwd
```

---

### ✅ Validate Filename

```typescript
const filenameSchema = z.string().regex(/^[a-zA-Z0-9_-]+\.[a-z]{2,5}$/);

app.get('/files/:filename', (req, res) => {
  const filename = filenameSchema.parse(req.params.filename);
  
  const file = path.join('/uploads', filename);
  
  // Additional check: ensure file is within /uploads
  const realPath = fs.realpathSync(file);
  if (!realPath.startsWith('/uploads')) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  res.sendFile(file);
});
```

---

## Validation Middleware

### Reusable Validator

```typescript
import { z } from 'zod';

function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ 
        errors: result.error.issues 
      });
    }
    
    req.body = result.data; // Type-safe body
    next();
  };
}

// Usage
app.post('/users', validate(createUserSchema), async (req, res) => {
  // req.body is now validated and type-safe
  const user = await createUser(req.body);
  res.json(user);
});
```

---

## Checklist

```
Before accepting input:

[ ] HTTP request body validated (Zod schema)
[ ] Query/path params validated
[ ] File uploads restricted (size, type, content)
[ ] Environment variables validated at startup
[ ] Database results validated (type safety)
[ ] User content sanitized (XSS prevention)
[ ] SQL queries parameterized (injection prevention)
[ ] File paths validated (traversal prevention)

Never trust external data.
```

---

## Summary

```
Input Validation:
✅ Use Zod for schema validation
✅ Validate HTTP requests (body, params, query, headers)
✅ Validate env vars at startup
✅ Parameterize SQL queries
✅ Sanitize HTML content
✅ Restrict file uploads
✅ Prevent path traversal

Never trust:
❌ User input
❌ Environment variables
❌ Database results
❌ Third-party APIs

Validate everything. Assume malicious input.
```

---

## Related Rules

- [No Secrets in Code](/rules/no-secrets-in-code) - Validate env vars with Zod
- [Auth Verification](/rules/auth-verification) - Validate JWT tokens
- [SSRF Prevention](/rules/ssrf-prevention) - Validate URLs before fetching
