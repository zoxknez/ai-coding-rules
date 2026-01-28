---
title: "YAGNI Principle"
description: "You Aren't Gonna Need It. Don't build for imaginary future requirements. Build what you need today."
category: "architecture"
complexity: "low"
impact: "high"
tags: ["yagni", "simplicity", "architecture", "premature-optimization"]
relatedRules: ["complexity-budget", "three-phase-pattern"]
pubDate: 2026-01-27
---

## The Principle

> **"You Aren't Gonna Need It"**

Don't build features, abstractions, or infrastructure for **imaginary future requirements**.

Build what you **need today**. Add more **when you actually need it**.

---

## Why YAGNI?

### ❌ Building for the Future

```typescript
// "We might need to support multiple databases someday..."
interface DatabaseAdapter {
  connect(): Promise<void>;
  query(sql: string): Promise<any>;
  disconnect(): Promise<void>;
}

class PostgresAdapter implements DatabaseAdapter { /* 200 LOC */ }
class MySQLAdapter implements DatabaseAdapter { /* 200 LOC */ }
class MongoAdapter implements DatabaseAdapter { /* 200 LOC */ }

// Only PostgreSQL is used in production
// 400 LOC of unused code
```

### ✅ Build What You Need

```typescript
// Just use Prisma (PostgreSQL)
const user = await prisma.user.findUnique({ where: { id } });

// If we ACTUALLY need MySQL later, we'll add it then
```

**Savings:** 600 LOC, 2 weeks of development, 0 bugs in unused code.

---

## Common YAGNI Violations

### 1. Premature Abstraction

```typescript
// ❌ "We might have multiple payment providers..."
interface PaymentProvider {
  charge(amount: number, token: string): Promise<PaymentResult>;
  refund(chargeId: string): Promise<void>;
}

class StripeProvider implements PaymentProvider { /* ... */ }
class PayPalProvider implements PaymentProvider { /* ... */ }
class CryptoProvider implements PaymentProvider { /* ... */ }

// Reality: Only Stripe is used

// ✅ Just use Stripe directly
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function charge(amount: number, token: string) {
  return stripe.charges.create({ amount, source: token });
}

// If we add PayPal later, THEN we'll abstract
```

---

### 2. Unused Features

```typescript
// ❌ "Users might want to export in 5 formats..."
app.get('/users/export', async (req, res) => {
  const format = req.query.format || 'csv';
  
  switch (format) {
    case 'csv': return exportCSV(res);
    case 'json': return exportJSON(res);
    case 'xml': return exportXML(res);
    case 'pdf': return exportPDF(res);
    case 'excel': return exportExcel(res);
  }
});

// Reality: Only CSV is ever requested
// 4 unused export functions, 400 LOC

// ✅ Just CSV
app.get('/users/export', async (req, res) => {
  const users = await db.user.findMany();
  const csv = /* ... */;
  res.send(csv);
});

// Add other formats when ACTUALLY requested
```

---

### 3. Over-Configurable

```typescript
// ❌ "Let's make everything configurable..."
interface AppConfig {
  database: {
    type: 'postgres' | 'mysql' | 'mongo';
    host: string;
    port: number;
    ssl: boolean;
    poolSize: number;
    timeout: number;
    retries: number;
  };
  cache: {
    enabled: boolean;
    type: 'redis' | 'memcached' | 'memory';
    ttl: number;
    maxSize: number;
  };
  // ... 50 more options
}

// Reality: 90% of config is never changed
// Complex to test (2^50 combinations)

// ✅ Hard-code what works
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Add config options when ACTUALLY needed
```

---

### 4. Speculative Scaling

```typescript
// ❌ "We might have millions of users..."
// Microservices architecture:
// - User service (containerized, auto-scaling)
// - Auth service (separate database)
// - Payment service (message queue)
// - Notification service (pub/sub)
// - API gateway (load balancer)

// Reality: 100 users, 1 request/second
// Total: 20 servers, $2000/month, 6 months to build

// ✅ Monolith first
// Express app with PostgreSQL
// Total: 1 server, $10/month, 2 weeks to build

// Scale when ACTUALLY needed (100k+ users)
```

---

## The YAGNI Decision Tree

```
Should I build this?

┌─ Is it required TODAY?
│  ├─ Yes → Build it
│  └─ No ↓
│
└─ Is it PROVEN to be needed soon? (hard data, not speculation)
   ├─ Yes → Build minimal version
   └─ No → DON'T BUILD IT

Examples of "proven need":
✅ Customer contract requires it next month
✅ 50+ users requested it in feedback
✅ Compliance deadline (GDPR, etc.)

Examples of speculation:
❌ "We might..."
❌ "What if..."
❌ "In the future..."
❌ "To be flexible..."
```

---

## Real-World Example

### Task: User Profile Feature

#### ❌ Over-Engineered (YAGNI Violation)

```
Week 1-2: Design "flexible profile system"
- Custom fields engine
- Profile templates
- Privacy settings (10+ options)
- Profile themes
- Profile analytics
- Social graph

Week 3-4: Build infrastructure
- Profile service (microservice)
- Profile database
- Profile cache layer
- Profile CDN

Week 5-6: Build features
- Profile editor (WYSIWYG)
- Profile preview
- Profile versioning
- Profile export/import

Total: 6 weeks, 3000 LOC, 5 new services
Result: 90% of features unused
```

#### ✅ YAGNI Approach

```typescript
// Week 1: Minimal profile (1 day)
// src/pages/profile.tsx
function ProfilePage() {
  const user = useUser();
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatar} />
    </div>
  );
}

// Week 2: Add edit (1 day if actually requested)
// Week 3+: Add features ONLY when users ask for them
```

**Savings:** 5 weeks, 2800 LOC, $50k in developer time.

---

## When to Break YAGNI

### ✅ Justified Future-Proofing

1. **Migration cost is HIGH**
   ```typescript
   // OK: Use UUID instead of auto-increment ID
   // Reason: Changing ID type later = migrate all foreign keys
   id: uuid() // vs id: serial()
   ```

2. **External constraint**
   ```typescript
   // OK: Support multiple auth providers from day 1
   // Reason: Customer contract requires OAuth + SAML
   ```

3. **Industry standard**
   ```typescript
   // OK: Use semantic versioning for API
   // Reason: Breaking changes without versioning = angry users
   ```

---

## YAGNI Checklist

```
Before building a feature:

[ ] Is it required TODAY?
[ ] Do we have PROOF it will be used? (user requests, contracts, etc.)
[ ] Can we build a minimal version first?
[ ] What's the cost of adding it later? (low = don't build now)
[ ] What's the cost of maintaining unused code? (bugs, complexity)

If in doubt, DON'T build it.
```

---

## Anti-Pattern Detection

### Red Flags (YAGNI Violations)

- "We **might** need..."
- "What **if** we add..."
- "To be **flexible**..."
- "For **future** compatibility..."
- "Just **in case**..."

### Green Flags (Actual Requirements)

- "User requested this **yesterday**"
- "Contract **requires** it by Friday"
- "**Currently** broken for 20% of users"
- "**Compliance** deadline next month"

---

## Summary

```
YAGNI = You Aren't Gonna Need It

❌ Don't build:
- Abstractions before duplication
- Features before user requests
- Scaling before traffic
- Config before complexity

✅ Do build:
- What you need TODAY
- Minimal viable version
- Add more WHEN ACTUALLY NEEDED

Savings:
- Less code = fewer bugs
- Faster iteration
- Easier maintenance
- Lower costs

"The best code is no code at all."
```

---

## Related Rules

- [Complexity Budget](/rules/complexity-budget) - Default to simplest solution
- [Three-Phase Pattern](/rules/three-phase-pattern) - Naive → Tests → Optimize (not → Optimize → Over-engineer)
- [Minimal Diff](/rules/minimal-diff) - Touch only what's needed
