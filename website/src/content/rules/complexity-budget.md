---
title: "Complexity Budget"
description: "Default to 1 file, ~200 LOC, 1 new function before abstractions. Only add complexity when justified."
category: "core"
complexity: "low"
impact: "high"
tags: ["simplicity", "bloat-prevention", "maintainability"]
relatedRules: ["minimal-diff", "three-phase-pattern"]
pubDate: 2026-01-27
---

## The Rule

> **Default to the simplest shape: 1 file, 1 function, ~200 LOC.**

Only introduce abstractions when:
- **Duplication exists in 2+ places**, or
- It materially improves **testability**, or
- Required for **security/performance**

---

## Budget Guidelines

### File Count
- **Ideal:** 1 file change
- **Good:** 2-3 files (if tightly coupled)
- **Review carefully:** 4+ files

**Question:** Can this be done in fewer files?

---

### Lines of Code (LOC)
- **Ideal:** < 200 LOC per file
- **Good:** 200-400 LOC
- **Review carefully:** > 400 LOC

**Question:** Can this be simplified or split?

---

### Function Count
- **Ideal:** 1 new function
- **Good:** 2-3 functions (if composing a feature)
- **Review carefully:** 4+ functions

**Question:** Are all these functions necessary?

---

## Anti-Patterns

### ❌ Premature Abstraction

```typescript
// ❌ Bad: Abstract before duplication
class UserRepository {
  constructor(private db: Database) {}
  
  async findById(id: string) { /* ... */ }
  async findByEmail(email: string) { /* ... */ }
  async create(data: UserData) { /* ... */ }
  async update(id: string, data: Partial<UserData>) { /* ... */ }
  async delete(id: string) { /* ... */ }
}

class PostRepository { /* same pattern */ }
class CommentRepository { /* same pattern */ }

// ✅ Good: Wait for 2+ instances, then abstract
// Just write the queries inline until you see duplication
async function createUser(data: UserData) {
  return db.query('INSERT INTO users ...', data);
}

async function createPost(data: PostData) {
  return db.query('INSERT INTO posts ...', data);
}

// After 3rd entity, if pattern is clear:
class BaseRepository<T> { /* ... */ }
```

**Why wait?**
- You don't know the pattern yet (users ≠ posts ≠ comments)
- Premature abstraction = harder to change
- Inline code is easier to understand

---

### ❌ Over-Engineering

**Task:** Add user logout button.

```typescript
// ❌ Bad: 300 LOC across 5 files
// components/LogoutButton.tsx
// hooks/useLogout.ts
// services/AuthService.ts
// store/authSlice.ts
// api/logout.ts

// ✅ Good: 30 LOC in 1 file
function LogoutButton() {
  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  };
  
  return <button onClick={logout}>Logout</button>;
}
```

**Why simpler?**
- Logout is trivial (POST + redirect)
- No reuse across app (only 1 logout button)
- Less code = less bugs

---

### ❌ Unnecessary Layers

```typescript
// ❌ Bad: 4 layers for 1 operation
// Controller → Service → Repository → ORM

class UserController {
  async getUser(req, res) {
    const user = await this.userService.getUserById(req.params.id);
    res.json(user);
  }
}

class UserService {
  async getUserById(id: string) {
    return this.userRepository.findById(id);
  }
}

class UserRepository {
  async findById(id: string) {
    return this.orm.user.findUnique({ where: { id } });
  }
}

// ✅ Good: Direct ORM call in route handler
app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ 
    where: { id: req.params.id } 
  });
  res.json(user);
});
```

**Why direct?**
- No business logic (just fetch + return)
- ORM already abstracts DB
- Layers only hide simple operations

---

## When to Add Complexity

### ✅ Duplication in 2+ Places

```typescript
// After seeing this pattern twice:
function createUser(data: UserData) {
  const validated = validateUser(data);
  const hashed = await bcrypt.hash(validated.password, 10);
  return db.insert({ ...validated, password: hashed });
}

function updateUser(id: string, data: Partial<UserData>) {
  const validated = validateUser(data);
  if (data.password) {
    const hashed = await bcrypt.hash(data.password, 10);
    data.password = hashed;
  }
  return db.update(id, validated);
}

// Extract common logic:
async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
```

---

### ✅ Testability

```typescript
// ❌ Hard to test (mixed concerns)
async function registerUser(req, res) {
  const user = req.body;
  const hashed = await bcrypt.hash(user.password, 10);
  await db.insert({ ...user, password: hashed });
  await sendEmail(user.email, 'Welcome!');
  res.json({ success: true });
}

// ✅ Easy to test (separated concerns)
async function createUser(data: UserData) {
  const hashed = await bcrypt.hash(data.password, 10);
  return db.insert({ ...data, password: hashed });
}

async function registerUser(req, res) {
  const user = await createUser(req.body);
  await sendEmail(user.email, 'Welcome!');
  res.json({ success: true });
}

// Now you can test createUser() without HTTP/email
```

---

### ✅ Security/Performance

```typescript
// ❌ Security risk (no rate limiting)
app.post('/api/login', async (req, res) => {
  // Brute force vulnerability
});

// ✅ Add middleware (justified complexity)
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 5, // 5 attempts
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // Protected
});
```

---

## The 200 LOC Threshold

**Why 200?**
- Fits on 1-2 screens (easy to review)
- Human working memory limit (~7 concepts)
- Forces you to modularize organically

**If file exceeds 200 LOC:**
1. Can you extract utilities? (validation, formatting, etc.)
2. Can you split into logical submodules?
3. Is there duplication to remove?

**Don't split just to hit 200 LOC** — split when it makes sense.

---

## Checklist Before Adding Complexity

```
Before adding a new file/function/abstraction:

[ ] Is there duplication in 2+ places?
[ ] Does it improve testability?
[ ] Is it required for security/performance?
[ ] Can I achieve this with less code?
[ ] Will future-me understand this easily?

If all answers are "no", DON'T abstract yet.
```

---

## Real-World Example

**Task:** Add CSV export to user table.

### ❌ Over-Engineered (300 LOC, 4 files)

```
services/ExportService.ts (100 LOC)
  - ExportFactory
  - CSVExporter
  - PDFExporter
  - ExcelExporter

formatters/CSVFormatter.ts (80 LOC)
  - formatters for every field type

routes/export.ts (60 LOC)
  - /export/csv
  - /export/pdf
  - /export/excel

types/export.d.ts (60 LOC)
  - interfaces for everything
```

### ✅ Simple (40 LOC, 1 file)

```typescript
// routes/users.ts
app.get('/users/export', async (req, res) => {
  const users = await db.query('SELECT name, email, role FROM users');
  
  const csv = [
    'Name,Email,Role',
    ...users.map(u => `${u.name},${u.email},${u.role}`)
  ].join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
  res.send(csv);
});
```

**Why simple wins:**
- CSV is only export format needed (YAGNI)
- No field customization required
- Easy to extend later if needed

---

## Summary

```
Complexity Budget:
  1 file > 2 files > 3 files
  1 function > 2 functions
  < 200 LOC ideal

Add complexity only when:
  ✅ Duplication in 2+ places
  ✅ Improves testability
  ✅ Security/performance requirement

Default answer: "Can I do this simpler?"
```

**Simplicity is not laziness — it's discipline.**

---

## Related Rules

- [Minimal Diff](/rules/minimal-diff) - Touch only what's needed
- [Three-Phase Pattern](/rules/three-phase-pattern) - Start naive, optimize later
- [YAGNI Principle](/rules/yagni) - You Aren't Gonna Need It
