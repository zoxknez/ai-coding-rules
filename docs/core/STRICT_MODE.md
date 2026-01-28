# STRICT Mode Enforcement

> Non-negotiable rules that cannot be bypassed under any circumstances.

## What is STRICT Mode?

STRICT mode defines rules that:
- **Cannot** be overridden by user request
- **Cannot** be disabled in configuration
- **Must** fail builds/audits if violated
- **Apply** regardless of context or deadline

## STRICT Mode Categories

### 🔴 Security (Always Enforced)

| Rule | Description | Why Non-Negotiable |
|------|-------------|-------------------|
| **No Hardcoded Secrets** | Never commit API keys, passwords, tokens | Data breach risk |
| **SQL Injection Prevention** | Always use parameterized queries | Database compromise |
| **Auth on Protected Routes** | Every protected endpoint must verify auth | Unauthorized access |
| **Input Validation** | All external input must be validated | Injection attacks |
| **No eval()** | Never use eval() with user input | Remote code execution |
| **HTTPS Only** | Production must use HTTPS | Man-in-the-middle attacks |

### 🔴 Type Safety (Always Enforced for TypeScript)

| Rule | Description | Why Non-Negotiable |
|------|-------------|-------------------|
| **strict: true** | TypeScript strict mode enabled | Catches bugs at compile time |
| **No untyped any** | Every `any` must have justification comment | Type safety defeats purpose |
| **No @ts-ignore** | No suppressing TypeScript errors | Hides real problems |

### 🔴 Data Integrity (Always Enforced)

| Rule | Description | Why Non-Negotiable |
|------|-------------|-------------------|
| **No Cascade Delete Without Backup** | Destructive operations need safeguards | Data loss prevention |
| **No Silent Failures** | All errors must be logged/handled | Debugging, audit trails |
| **Idempotent Operations** | Critical operations must be idempotent | Partial failure recovery |

## STRICT Mode Declaration

### In Rules

```markdown
## STRICT Mode Rules

> These rules are **non-negotiable** and cannot be bypassed:

1. **NEVER** approve code with hardcoded secrets
2. **NEVER** proceed without auth verification on protected routes
3. **ALWAYS** validate user input before processing
4. **ALWAYS** use parameterized queries for database access
```

### In Configuration

```yaml
# .ai-rules/config.yaml
strict_mode:
  enabled: true
  rules:
    - security-no-secrets
    - security-no-sql-injection
    - security-auth-required
    - security-input-validation
    - typescript-no-any
  
  # Cannot be overridden even with user request
  override_protection: true
  
  # Fails PR checks if violated
  fail_ci: true
```

### In Skills

```markdown
## STRICT Mode Rules

These are **non-negotiable** and must be enforced:

1. **NEVER** approve code with hardcoded secrets
2. **NEVER** approve code without auth checks on protected routes
3. **NEVER** approve code with SQL injection vulnerabilities
4. **ALWAYS** flag missing input validation
```

## Enforcement Matrix

| Context | STRICT Violation Behavior |
|---------|--------------------------|
| Code Review | Block approval, REQUEST_CHANGES |
| Security Audit | FAIL audit, immediate action required |
| PR Check | Fail CI, block merge |
| Refactoring | Stop and fix before continuing |
| Vibe Mode | **Still enforced** - no exceptions |

## Handling STRICT Mode Violations

### 1. Detection

```markdown
## 🔴 STRICT MODE VIOLATION DETECTED

**Rule:** security-no-hardcoded-secrets
**Location:** `src/config.ts:15`
**Violation:** Hardcoded API key detected

**Code:**
```typescript
const API_KEY = "sk-abc123..."; // ❌ STRICT VIOLATION
```

**This is a non-negotiable rule and cannot be bypassed.**
```

### 2. Resolution Required

```markdown
### Required Fix

Replace hardcoded secret with environment variable:

```typescript
const API_KEY = process.env.API_KEY; // ✅ Correct
```

### Steps
1. Remove hardcoded secret from code
2. Add to `.env.example` with placeholder
3. Add to secret management system
4. Rotate the exposed secret (it may be in git history)
```

### 3. No Override Possible

```markdown
⚠️ **Override Attempted**

User requested: "Just commit it for now, we'll fix later"

**DENIED:** This is a STRICT mode rule. It cannot be bypassed because:
- Secrets in git history are permanent
- They can be extracted by anyone with repo access
- Automated scanners actively look for leaked secrets

**Alternative:** Use a temporary secret in `.env.local` (gitignored)
```

## Adding STRICT Rules

### Criteria for STRICT Mode

A rule should be STRICT if:

1. **Violation causes immediate security risk** (secrets, injection, auth bypass)
2. **Violation is irreversible or hard to fix** (data loss, leaked secrets)
3. **Violation affects user safety/privacy** (PII exposure, consent bypass)
4. **Industry standard requires it** (PCI-DSS, HIPAA, SOC2)

### Process

1. Document the rule clearly
2. Explain why it's non-negotiable
3. Provide examples of violations
4. Provide clear resolution steps
5. Add to `strict_mode.rules` in config
6. Add tests to verify detection

## STRICT Mode vs Normal Rules

| Aspect | Normal Rules | STRICT Rules |
|--------|--------------|--------------|
| Override | User can request exception | No exceptions |
| Deadline pressure | Can be deferred | Never deferred |
| Vibe Mode | May be relaxed | Always enforced |
| Auto-fix | Usually available | Often disabled (manual review needed) |
| CI behavior | Warning | Fail |
| Review behavior | Suggestion | Blocking |

## Examples

### ✅ STRICT Rule (Security)

```markdown
# No SQL Injection (STRICT)

**ALWAYS** use parameterized queries:

```typescript
// ❌ STRICT VIOLATION - SQL Injection
const user = await db.query(`SELECT * FROM users WHERE id = ${userId}`);

// ✅ Correct - Parameterized
const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
```

This rule is STRICT because SQL injection can lead to:
- Full database access
- Data exfiltration
- Data modification/deletion
- Privilege escalation
```

### ❌ Not STRICT (Style)

```markdown
# Use camelCase for Variables

**Prefer** camelCase for variable names:

```typescript
// ⚠️ Not preferred
const user_name = "John";

// ✅ Preferred
const userName = "John";
```

This is a style preference, not a security concern.
User can override if there's a good reason (external API compatibility, etc.).
```

## Implementation Checklist

- [ ] All STRICT rules documented with "Why Non-Negotiable" section
- [ ] All STRICT rules have clear violation examples
- [ ] All STRICT rules have resolution steps
- [ ] STRICT rules are marked in skills templates
- [ ] CI/CD enforces STRICT rules
- [ ] Override attempts are logged/alerted
- [ ] Team understands STRICT vs normal rules
