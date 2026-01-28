---
title: "Test-First Loop"
description: "Write failing test first, make it pass, then refactor. Red → Green → Refactor cycle."
category: "testing"
complexity: "medium"
impact: "critical"
tags: ["tdd", "testing", "quality", "regression-prevention"]
relatedRules: ["three-phase-pattern", "minimal-diff"]
pubDate: 2026-01-27
---

## The Pattern

> **Red → Green → Refactor**

1. **Red:** Write a failing test
2. **Green:** Make the test pass (simplest code)
3. **Refactor:** Clean up while keeping tests green

---

## Why Test-First?

### ✅ Benefits

- **Prevents regressions:** Can't break what's tested
- **Documents behavior:** Tests are executable specs
- **Enables refactoring:** Change code fearlessly
- **Forces good design:** Testable code = decoupled code

### ❌ Without Tests

```typescript
// You: "This function works perfectly!"
// Future you: "I changed 1 line and broke 3 features."
```

---

## The Cycle

### Step 1: Red (Failing Test)

```typescript
// ❌ Test fails (feature doesn't exist yet)
describe('calculateDiscount', () => {
  it('applies 10% discount for orders over $100', () => {
    const order = { total: 150 };
    const discounted = calculateDiscount(order);
    
    expect(discounted).toBe(135); // 150 - 15
  });
});

// Error: calculateDiscount is not defined
```

---

### Step 2: Green (Make it Pass)

```typescript
// Simplest code to make test pass
function calculateDiscount(order: { total: number }) {
  if (order.total > 100) {
    return order.total * 0.9; // 10% off
  }
  return order.total;
}

// ✅ Test passes
```

---

### Step 3: Refactor (Clean Up)

```typescript
// Add more tests for edge cases
it('applies no discount for orders under $100', () => {
  expect(calculateDiscount({ total: 50 })).toBe(50);
});

it('handles exactly $100 (no discount)', () => {
  expect(calculateDiscount({ total: 100 })).toBe(100);
});

// Refactor: extract magic numbers
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function calculateDiscount(order: { total: number }) {
  if (order.total > DISCOUNT_THRESHOLD) {
    return order.total * (1 - DISCOUNT_RATE);
  }
  return order.total;
}

// ✅ All tests still pass
```

---

## Real-World Example

### Task: Add user registration

#### 1️⃣ Red: Write Failing Test

```typescript
describe('POST /api/register', () => {
  it('creates new user with valid data', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        email: 'test@example.com',
        password: 'SecurePass123!',
      });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
});

// ❌ Fails: route doesn't exist
```

---

#### 2️⃣ Green: Simplest Implementation

```typescript
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Simplest version (no validation yet)
  const user = await db.user.create({
    data: { email, password },
  });
  
  res.status(201).json({ id: user.id, email: user.email });
});

// ✅ Test passes
```

---

#### 3️⃣ Red: Add Edge Case Tests

```typescript
it('rejects duplicate email', async () => {
  await createUser({ email: 'test@example.com' });
  
  const response = await request(app)
    .post('/api/register')
    .send({ email: 'test@example.com', password: 'pass' });
  
  expect(response.status).toBe(409); // Conflict
});

it('rejects weak password', async () => {
  const response = await request(app)
    .post('/api/register')
    .send({ email: 'test@example.com', password: '123' });
  
  expect(response.status).toBe(400); // Bad Request
});

// ❌ Both tests fail
```

---

#### 4️⃣ Green: Handle Edge Cases

```typescript
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password too weak' });
  }
  
  // Check for duplicate email
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const user = await db.user.create({
    data: { email, password },
  });
  
  res.status(201).json({ id: user.id, email: user.email });
});

// ✅ All tests pass
```

---

#### 5️⃣ Refactor: Extract Validation

```typescript
function validatePassword(password: string): string | null {
  if (password.length < 8) return 'Password too weak';
  if (!/[A-Z]/.test(password)) return 'Password needs uppercase';
  if (!/[0-9]/.test(password)) return 'Password needs number';
  return null;
}

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }
  
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  const user = await db.user.create({
    data: { email, password },
  });
  
  res.status(201).json({ id: user.id, email: user.email });
});

// ✅ All tests still pass, code is cleaner
```

---

## Common Mistakes

### ❌ Writing Tests After Code

```typescript
// 1. Write feature
function complexFunction() { /* 200 LOC */ }

// 2. Try to write tests
// Problem: Hard to test, requires mocking 5 dependencies
```

**Fix:** Write test first → forces simple, testable design.

---

### ❌ Skipping Red Phase

```typescript
// ⚠️ Test passes immediately (already implemented)
it('fetches user', async () => {
  const user = await getUser('123');
  expect(user).toBeDefined();
});

// How do you know the test is correct?
```

**Fix:** Run test first, see it fail, THEN implement.

---

### ❌ Testing Implementation, Not Behavior

```typescript
// ❌ Bad: Tests internal implementation
it('calls bcrypt.hash with correct args', () => {
  const spy = jest.spyOn(bcrypt, 'hash');
  hashPassword('mypass');
  expect(spy).toHaveBeenCalledWith('mypass', 10);
});

// ✅ Good: Tests behavior (output)
it('returns hashed password', async () => {
  const hashed = await hashPassword('mypass');
  expect(hashed).not.toBe('mypass');
  expect(hashed.length).toBeGreaterThan(50);
});
```

**Why?** Implementation tests break when refactoring.

---

## Test Coverage Targets

### Critical Paths (100% coverage)
- Authentication
- Payment processing
- Data deletion
- Permissions

### Business Logic (80%+ coverage)
- Validation
- Calculations
- State machines

### UI Components (50%+ coverage)
- User interactions
- Error states
- Loading states

---

## Checklist

```
Before writing code:

[ ] Write failing test for happy path
[ ] Run test → see it fail (RED)
[ ] Write simplest code to pass (GREEN)
[ ] Add edge case tests (RED again)
[ ] Handle edge cases (GREEN again)
[ ] Refactor while keeping tests green
[ ] All tests still pass

Ship with confidence.
```

---

## Integration with Three-Phase Pattern

```
Phase 1: NAIVE CORRECT
  → Write tests first
  → Simplest code to pass tests

Phase 2: ADD MORE TESTS
  → Edge cases
  → Error scenarios
  → Integration tests

Phase 3: OPTIMIZE
  → Refactor for performance
  → Tests ensure correctness preserved
```

---

## Summary

```
Test-First Loop:
1. RED    → Write failing test
2. GREEN  → Simplest code to pass
3. REFACTOR → Clean up, tests stay green

Benefits:
✅ Prevents regressions
✅ Documents behavior
✅ Enables fearless refactoring
✅ Forces good design

Never skip tests. Future you will thank you.
```

---

## Related Rules

- [Three-Phase Pattern](/rules/three-phase-pattern) - Naive → Tests → Optimize
- [Minimal Diff](/rules/minimal-diff) - Small, testable changes
- [Assumptions Ledger](/rules/assumptions-ledger) - Test assumptions explicitly
