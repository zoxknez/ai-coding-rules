---
description: "USE WHEN: handling errors, exceptions, or error states"
globs: ["**/*.{ts,tsx,js,jsx,py}"]
alwaysApply: false
priority: 73
---

# Error Handling Rules

## Philosophy
- Fail fast, fail loud
- Errors are values (not just exceptions)
- Never swallow errors silently
- Log with context

## Patterns

### TypeScript/JavaScript
```typescript
// Prefer Result types for expected failures
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

// Use try-catch for unexpected failures
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', { error, context });
  throw new AppError('USER_FRIENDLY_MESSAGE', { cause: error });
}
```

### Python
```python
# Use specific exceptions
try:
    risky_operation()
except SpecificError as e:
    logger.error("Operation failed", exc_info=True)
    raise AppError("User message") from e
```

## Best Practices
- Create custom error classes
- Include error codes for programmatic handling
- Separate user-facing from developer messages
- Add correlation IDs for tracing
- Never expose stack traces to users
- Log at appropriate levels (error vs warn vs info)
