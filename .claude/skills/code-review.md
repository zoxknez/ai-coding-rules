# Skill: Code Review

> Structured code review simulation based on mamut-lab patterns.

## When to Use

- Before merging PRs
- After significant refactoring
- When reviewing unfamiliar code
- For learning/educational purposes
- As part of quality assurance workflow

## What It Checks

| Category | Items |
|----------|-------|
| **Correctness** | Logic errors, edge cases, null handling, type safety |
| **Security** | Input validation, auth checks, injection vectors, secrets |
| **Performance** | Complexity, memory leaks, unnecessary operations |
| **Maintainability** | Readability, naming, documentation, test coverage |
| **Architecture** | SOLID principles, layer boundaries, dependencies |

## Output Format

```markdown
## Code Review Report

**File:** `{file_path}`
**Reviewer:** Claude (AI)
**Date:** {date}

### Summary
- **Overall Score:** {A|B|C|D|F}
- **Critical Issues:** {count}
- **Warnings:** {count}
- **Suggestions:** {count}

### Critical Issues 🔴
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|
| L{n} | {description} | CRITICAL | {suggested_fix} |

### Warnings ⚠️
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|
| L{n} | {description} | WARNING | {suggested_fix} |

### Suggestions 💡
| Line | Suggestion | Benefit |
|------|------------|---------|
| L{n} | {description} | {benefit} |

### Security Checklist
- [ ] Input validation present
- [ ] Auth checks on protected routes
- [ ] No hardcoded secrets
- [ ] SQL/injection prevention
- [ ] Error messages don't leak internals

### Performance Notes
{observations about complexity, potential optimizations}

### Test Coverage Assessment
- **Has Tests:** {yes|no|partial}
- **Edge Cases Covered:** {yes|no|partial}
- **Recommended Tests:** {list}

### Verdict
{APPROVE | REQUEST_CHANGES | NEEDS_DISCUSSION}

**Blocking Issues:** {list or "None"}
**Before Merge:** {required actions}
```

## STRICT Mode Rules

These are **non-negotiable** and must be enforced:

1. **NEVER** approve code with hardcoded secrets
2. **NEVER** approve code without auth checks on protected routes
3. **NEVER** approve code with SQL injection vulnerabilities
4. **ALWAYS** flag missing input validation
5. **ALWAYS** note missing error handling
6. **ALWAYS** check for proper TypeScript types (no `any` without justification)

## Example

**Input:** "Review this authentication function"

```typescript
async function login(email: string, password: string) {
  const user = await db.query(`SELECT * FROM users WHERE email = '${email}'`);
  if (user && user.password === password) {
    return { token: jwt.sign({ id: user.id }, 'secret123') };
  }
  return null;
}
```

**Output:**

```markdown
## Code Review Report

**File:** `auth/login.ts`
**Reviewer:** Claude (AI)
**Date:** 2026-01-28

### Summary
- **Overall Score:** F
- **Critical Issues:** 3
- **Warnings:** 1
- **Suggestions:** 2

### Critical Issues 🔴
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|
| L2 | SQL Injection vulnerability | CRITICAL | Use parameterized queries |
| L3 | Plain text password comparison | CRITICAL | Use bcrypt.compare() |
| L4 | Hardcoded JWT secret | CRITICAL | Use environment variable |

### Warnings ⚠️
| Line | Issue | Severity | Fix |
|------|-------|----------|-----|
| L1 | No input validation | WARNING | Validate email format and password length |

### Suggestions 💡
| Line | Suggestion | Benefit |
|------|------------|---------|
| L4 | Add token expiration | Security improvement |
| L5 | Return error message type | Better UX |

### Verdict
**REQUEST_CHANGES**

**Blocking Issues:** SQL injection, plaintext passwords, hardcoded secret
**Before Merge:** Fix all 3 critical security issues
```

## Invocation

```
/skill:code-review [file_path] [--strict]
```

Options:
- `--strict` - Fail on any warning, not just critical issues
- `--security-only` - Focus only on security aspects
- `--perf-only` - Focus only on performance aspects
