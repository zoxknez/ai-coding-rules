# Rule Test: Error Handling

## Rule Reference
- **ID:** `quality-error-handling`
- **Category:** Quality
- **Severity:** Medium
- **STRICT:** No (context-dependent)

## Test Cases

### ❌ FAIL: Empty catch block

**Input:**
```typescript
try {
  await saveData(data);
} catch (error) {
  // silently ignore
}
```

**Expected:** FAIL
**Violation:** Swallowing errors hides bugs
**Fix:**
```typescript
try {
  await saveData(data);
} catch (error) {
  console.error('Failed to save data:', error);
  throw error; // or handle appropriately
}
```

---

### ❌ FAIL: Console.log only in catch

**Input:**
```typescript
try {
  await processPayment(order);
} catch (error) {
  console.log(error);
}
// continues execution as if nothing happened
```

**Expected:** FAIL
**Violation:** Critical error not handled properly
**Fix:**
```typescript
try {
  await processPayment(order);
} catch (error) {
  logger.error('Payment failed:', { orderId: order.id, error });
  await notifyAdmin('Payment failure', error);
  throw new PaymentError('Payment processing failed', { cause: error });
}
```

---

### ❌ FAIL: No error handling on async operation

**Input:**
```typescript
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}
```

**Expected:** FAIL
**Violation:** Network errors and non-ok responses not handled
**Fix:**
```typescript
async function fetchData() {
  const response = await fetch('/api/data');
  
  if (!response.ok) {
    throw new ApiError(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}
```

---

### ❌ FAIL: Ignoring promise rejection

**Input:**
```typescript
// Missing .catch() or try/catch
someAsyncFunction();
doNextThing();
```

**Expected:** FAIL
**Violation:** Unhandled promise rejection
**Fix:**
```typescript
try {
  await someAsyncFunction();
  doNextThing();
} catch (error) {
  handleError(error);
}
```

---

### ❌ FAIL: Generic error message

**Input:**
```typescript
catch (error) {
  throw new Error('Something went wrong');
}
```

**Expected:** FAIL
**Violation:** Lost error context
**Fix:**
```typescript
catch (error) {
  throw new Error('Failed to process order', { cause: error });
}
```

---

### ✅ PASS: Proper error logging and re-throw

**Input:**
```typescript
try {
  await processOrder(order);
} catch (error) {
  logger.error('Order processing failed', {
    orderId: order.id,
    error: error instanceof Error ? error.message : String(error)
  });
  throw error;
}
```

**Expected:** PASS
**Why:** Error is logged with context and re-thrown

---

### ✅ PASS: Custom error class

**Input:**
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public readonly field: string,
    public readonly value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateEmail(email: string): string {
  if (!email.includes('@')) {
    throw new ValidationError('Invalid email format', 'email', email);
  }
  return email;
}
```

**Expected:** PASS
**Why:** Custom error with full context

---

### ✅ PASS: Result type pattern

**Input:**
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: new Error(`HTTP ${response.status}`) };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage forces handling both cases
const result = await fetchUser('123');
if (!result.success) {
  console.error(result.error);
  return;
}
console.log(result.data.name);
```

**Expected:** PASS
**Why:** Explicit error handling with Result type

---

### ✅ PASS: Intentional silent catch with comment

**Input:**
```typescript
try {
  await analytics.track('page_view');
} catch (error) {
  // Intentionally silent: analytics failure should not break the app
  // Error is still reported to monitoring
  Sentry.captureException(error);
}
```

**Expected:** PASS
**Why:** Intentional decision documented, still reported to monitoring

---

### ✅ PASS: Retry logic

**Input:**
```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      logger.warn(`Attempt ${attempt} failed, retrying...`, { error });
      await sleep(delay * attempt);
    }
  }
  throw new Error('Unreachable');
}
```

**Expected:** PASS
**Why:** Retry with backoff, final failure is thrown

---

## Error Handling Patterns

| Pattern | When to Use |
|---------|-------------|
| Re-throw | Don't know how to handle, let caller decide |
| Wrap and throw | Add context, preserve original error |
| Return Result | Caller must handle both cases |
| Log and continue | Non-critical operation (analytics) |
| Retry | Transient failures (network) |
| Fallback | Default value is acceptable |

## Required Error Information

Every caught error should preserve:
- Original error (as `cause`)
- Context (what operation failed)
- Identifiers (userId, orderId, etc.)
- Timestamp (usually from logger)

## HTTP Status Codes

| Error Type | Status | Example |
|------------|--------|---------|
| Validation | 400 | Invalid input |
| Auth | 401 | Not logged in |
| Permission | 403 | Not allowed |
| Not Found | 404 | Resource missing |
| Conflict | 409 | Duplicate |
| Server Error | 500 | Unexpected error |
