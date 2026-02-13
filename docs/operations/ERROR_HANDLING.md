# Error Handling Patterns (v1)

> Errors are not exceptional — they are expected. Design for them explicitly.

---

## Error Classification

| Type | Example | Handling Strategy |
|------|---------|------------------|
| **Validation** | Invalid email, missing field | Return 400, user-friendly message |
| **Authentication** | Expired token, wrong password | Return 401, redirect to login |
| **Authorization** | No access to resource | Return 403, log attempt |
| **Not Found** | Resource doesn't exist | Return 404, helpful message |
| **Conflict** | Duplicate entry, stale data | Return 409, suggest resolution |
| **Rate Limit** | Too many requests | Return 429, include retry-after |
| **Internal** | DB down, null pointer | Return 500, log full details, generic user message |
| **Upstream** | Third-party API failure | Retry with backoff, circuit break |
| **Timeout** | Operation took too long | Cancel, return 504, retry if idempotent |

## Error Response Envelope

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Email address is invalid",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "value": "not-an-email"
      }
    ],
    "requestId": "req-abc-123"
  }
}
```

### Rules
- ✅ Consistent structure across all endpoints
- ✅ Machine-readable error codes (enums, not strings)
- ✅ Human-readable messages
- ✅ Include request ID for debugging
- ❌ Never expose stack traces to users
- ❌ Never expose internal service names
- ❌ Never expose SQL queries or paths

## Error Handling by Layer

### Controller / Handler Layer
```typescript
// ✅ Catch and translate to HTTP
try {
  const result = await service.createUser(dto);
  return res.status(201).json({ success: true, data: result });
} catch (error) {
  if (error instanceof ValidationError) {
    return res.status(400).json(errorEnvelope(error));
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json(errorEnvelope(error));
  }
  // Unexpected errors
  logger.error('Unhandled error', { error, requestId });
  return res.status(500).json(genericError(requestId));
}
```

### Service / Business Logic Layer
```typescript
// ✅ Throw domain-specific errors
async function createUser(dto: CreateUserDTO): Promise<User> {
  const existing = await userRepo.findByEmail(dto.email);
  if (existing) {
    throw new ConflictError('USER_EXISTS', 'Email already registered');
  }
  // ... business logic
}
```

### Repository / Data Layer
```typescript
// ✅ Wrap infrastructure errors
async function findById(id: string): Promise<User> {
  try {
    return await db.user.findUniqueOrThrow({ where: { id } });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new NotFoundError('USER_NOT_FOUND', `User ${id} not found`);
    }
    throw new InternalError('DB_ERROR', 'Database operation failed', error);
  }
}
```

## Custom Error Hierarchy

```typescript
// Base error
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Specific errors
class ValidationError extends AppError {
  constructor(code: string, message: string, public details?: FieldError[]) {
    super(code, message, 400);
  }
}

class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 404);
  }
}

class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 409);
  }
}
```

## Retry Patterns

### Exponential Backoff with Jitter
```
Attempt 1: wait 1s + random(0-500ms)
Attempt 2: wait 2s + random(0-500ms)
Attempt 3: wait 4s + random(0-500ms)
Max attempts: 3-5 (configurable)
```

### When to Retry
- ✅ Network timeouts
- ✅ 429 (rate limited) — respect `Retry-After` header
- ✅ 502, 503, 504 (upstream temporarily down)
- ❌ 400 (bad request — won't fix itself)
- ❌ 401, 403 (auth — won't fix itself)
- ❌ 404 (not found — won't appear)
- ❌ 409 (conflict — needs resolution, not retry)

### Idempotency Requirement
```
Rule: Only retry operations that are idempotent.
GET, PUT, DELETE → safe to retry
POST → only if idempotency key is used
```

## Circuit Breaker Pattern

```
States:
  CLOSED  → normal operation, errors counted
  OPEN    → all calls fail immediately (fast fail)
  HALF-OPEN → allow one test request through

Transitions:
  CLOSED → OPEN: when error count > threshold (e.g., 5 in 60s)
  OPEN → HALF-OPEN: after timeout (e.g., 30s)
  HALF-OPEN → CLOSED: if test request succeeds
  HALF-OPEN → OPEN: if test request fails
```

### When to Use
- Calls to external services (payment, email, third-party APIs)
- Database connections (prevent connection pool exhaustion)
- Any dependency that can be temporarily unavailable

## Graceful Degradation

| Service Down | Degraded Behavior |
|-------------|-------------------|
| Search API | Show recent items instead |
| Payment processor | Queue order, process later |
| Email service | Queue email, retry |
| CDN / images | Show placeholder |
| Analytics | Skip tracking, don't block UX |
| Cache | Fall back to database (slower) |

**Rule:** Core user journey must work even when non-critical services fail.

## Frontend Error Handling

### Error Boundaries (React)
```tsx
// ✅ Catch rendering errors, show fallback
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardWidget />
</ErrorBoundary>
```

### API Error Handling
```typescript
// ✅ Typed error handling
async function fetchUser(id: string): Promise<Result<User, AppError>> {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      const error = await res.json();
      return { ok: false, error: new AppError(error.code, error.message) };
    }
    return { ok: true, data: await res.json() };
  } catch {
    return { ok: false, error: new AppError('NETWORK_ERROR', 'Connection failed') };
  }
}
```

### User-Facing Error Messages
| Don't Say | Say Instead |
|-----------|-------------|
| "Error 500" | "Something went wrong. Please try again." |
| "NullPointerException" | "We couldn't load your data." |
| "Connection refused" | "Service temporarily unavailable." |
| "Invalid token" | "Your session expired. Please log in again." |

## AI-Specific Error Rules

1. **AI forgets error handling** — always ask: "What happens when this fails?"
2. **AI catches too broadly** — `catch (e) {}` swallows everything; demand specific catches
3. **AI ignores async errors** — ensure every `Promise` has `.catch()` or `try/catch`
4. **AI generates optimistic code** — it assumes happy path; insist on failure cases
5. **AI omits cleanup logic** — `finally` blocks for closing connections, releasing locks

## Checklist

```
□ All API errors return consistent envelope format
□ Validation errors include field-level details
□ Internal errors are logged with full context
□ Users never see stack traces or internal details
□ External calls have retry + circuit breaker
□ Frontend has error boundaries and user-friendly messages
□ Error codes are documented and machine-readable
```

## Related Docs
- [OBSERVABILITY](OBSERVABILITY.md) — logging errors correctly
- [incident_response](incident_response.md) — handling production errors
- [SECURITY_GUARDRAILS](SECURITY_GUARDRAILS.md) — don't expose internals in errors
