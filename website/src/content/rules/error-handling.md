---
title: "Error Handling"
description: "Handle errors explicitly. Never swallow exceptions. Return meaningful error messages. Fail fast, fail loud."
category: "core"
complexity: "medium"
impact: "critical"
tags: ["errors", "exceptions", "reliability", "debugging"]
relatedRules: ["input-validation", "plan-patch-verify"]
pubDate: 2026-01-27
---

## The Rules

1. **Handle errors explicitly** (no silent failures)
2. **Fail fast, fail loud** (don't mask errors)
3. **Return meaningful messages** (help users & developers)
4. **Never swallow exceptions** (catch only to handle)

---

## Anti-Patterns

### ❌ Silent Failures

```typescript
// ❌ Bad: Error is swallowed
try {
  await saveUser(data);
} catch (error) {
  // Do nothing
}

// User thinks save succeeded, but it didn't

// ✅ Good: Propagate or handle
try {
  await saveUser(data);
} catch (error) {
  logger.error('Failed to save user', { error, data });
  throw new Error('Failed to save user');
}
```

---

### ❌ Generic Error Messages

```typescript
// ❌ Bad: Unhelpful
throw new Error('Something went wrong');

// Developer has no idea what failed

// ✅ Good: Specific
throw new Error('Failed to save user: email already exists');

// Clear what failed and why
```

---

### ❌ Catching Everything

```typescript
// ❌ Bad: Catch-all hides bugs
try {
  const user = await getUser(id);
  const posts = await getPosts(user.id);
  return { user, posts };
} catch (error) {
  return { user: null, posts: [] };
}

// What if getUser() has a bug? Silently returns null

// ✅ Good: Catch specific errors only
const user = await getUser(id); // Let errors propagate
if (!user) {
  throw new Error(`User not found: ${id}`);
}

const posts = await getPosts(user.id);
return { user, posts };
```

---

## Error Handling Patterns

### 1. Try-Catch for Expected Errors

```typescript
async function createUser(data: UserData) {
  try {
    return await db.user.create({ data });
  } catch (error) {
    // Handle known error (duplicate email)
    if (error.code === 'P2002') { // Prisma unique constraint
      throw new Error('Email already exists');
    }
    
    // Re-throw unknown errors
    throw error;
  }
}
```

---

### 2. Result Type Pattern

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

async function getUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return { ok: false, error: new Error('User not found') };
    }
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}

// Usage
const result = await getUser('123');
if (!result.ok) {
  console.error(result.error);
  return;
}

const user = result.value; // Type-safe!
```

---

### 3. Custom Error Classes

```typescript
class NotFoundError extends Error {
  statusCode = 404;
  
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`);
    this.name = 'NotFoundError';
  }
}

class ValidationError extends Error {
  statusCode = 400;
  
  constructor(public fields: Record<string, string>) {
    super('Validation failed');
    this.name = 'ValidationError';
  }
}

// Usage
async function getUser(id: string) {
  const user = await db.user.findUnique({ where: { id } });
  if (!user) {
    throw new NotFoundError('User', id);
  }
  return user;
}

// Error middleware
app.use((error, req, res, next) => {
  if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  }
  
  if (error instanceof ValidationError) {
    return res.status(400).json({ 
      error: error.message,
      fields: error.fields,
    });
  }
  
  // Unknown error
  logger.error('Unhandled error', error);
  res.status(500).json({ error: 'Internal server error' });
});
```

---

## HTTP API Error Handling

### Express.js Example

```typescript
// Error response format
interface ErrorResponse {
  error: string;
  details?: unknown;
  requestId?: string;
}

// Global error handler
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const requestId = req.headers['x-request-id'] as string;
  
  logger.error('Request failed', {
    error: error.message,
    stack: error.stack,
    requestId,
    url: req.url,
    method: req.method,
  });
  
  // Don't leak internal errors to client
  const response: ErrorResponse = {
    error: 'Internal server error',
    requestId,
  };
  
  if (process.env.NODE_ENV === 'development') {
    response.details = {
      message: error.message,
      stack: error.stack,
    };
  }
  
  res.status(500).json(response);
});

// Async error wrapper
function asyncHandler(fn: RequestHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Usage
app.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await getUser(req.params.id);
  res.json(user);
}));
```

---

## Frontend Error Handling

### React Example

```typescript
// Error boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined };
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React error', { error, errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Reload page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}
```

---

### API Error Handling

```typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    
    if (!response.ok) {
      // Parse error from API
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    // Network error or API error
    logger.error('Failed to fetch user', { error, id });
    
    // Show user-friendly message
    throw new Error('Unable to load user. Please try again.');
  }
}
```

---

## Logging Errors

### What to Log

```typescript
// ✅ Good: Contextual error logging
logger.error('Payment failed', {
  error: error.message,
  stack: error.stack,
  userId: user.id,
  amount: payment.amount,
  paymentMethod: payment.method,
  requestId: req.headers['x-request-id'],
  timestamp: new Date().toISOString(),
});

// ❌ Bad: No context
console.error(error);
```

---

### Log Levels

```typescript
logger.debug('Detailed diagnostic info');     // Development only
logger.info('Normal operation');               // General info
logger.warn('Potential issue');                // Degraded but working
logger.error('Operation failed');              // User-facing failure
logger.fatal('System crash');                  // Unrecoverable
```

---

## Error Recovery

### Retry Logic

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry client errors (4xx)
      if (error.statusCode >= 400 && error.statusCode < 500) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  
  throw lastError!;
}

// Usage
const user = await fetchWithRetry(() => getUser('123'));
```

---

### Circuit Breaker

```typescript
class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  constructor(
    private threshold = 5,
    private timeout = 60000 // 1 minute
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }
    
    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  private onSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }
  
  private onFailure() {
    this.failures++;
    this.lastFailTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }
}

// Usage
const breaker = new CircuitBreaker();
const data = await breaker.execute(() => fetchFromUnreliableAPI());
```

---

## Checklist

```
Error handling checklist:

[ ] Errors are caught explicitly (no silent failures)
[ ] Error messages are meaningful (what failed, why)
[ ] Errors are logged with context (userId, requestId, etc.)
[ ] Sensitive data is not leaked (credentials, tokens)
[ ] Client errors (400) vs server errors (500) distinguished
[ ] Retry logic for transient failures
[ ] Circuit breaker for unreliable dependencies
[ ] Error boundary in frontend (React)
[ ] Global error handler in backend (Express)

Production readiness:
[ ] Error monitoring configured (Sentry, etc.)
[ ] Alerts set up for critical errors
[ ] Error budget defined (acceptable failure rate)
```

---

## Summary

```
Error Handling Rules:
1. Fail fast, fail loud
2. Handle errors explicitly
3. Return meaningful messages
4. Never swallow exceptions
5. Log with context
6. Retry transient failures
7. Use circuit breakers
8. Don't leak sensitive data

❌ Don't:
- Catch and ignore
- Return generic errors
- Log errors without context
- Retry non-retryable errors

✅ Do:
- Propagate or handle explicitly
- Use custom error classes
- Log structured errors
- Implement graceful degradation

"Errors are inevitable. Handling them well is not."
```

---

## Related Rules

- [Input Validation](/rules/input-validation) - Prevent errors at the edge
- [Plan-Patch-Verify](/rules/plan-patch-verify) - Verify error scenarios
- [Test-First Loop](/rules/test-first-loop) - Test error paths
