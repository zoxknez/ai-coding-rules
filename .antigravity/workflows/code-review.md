# Code Review Workflow

> **Agent-assisted code review procedure**
>
> Use this workflow when reviewing PRs or preparing code for review.

---

## Phase 1: Context Gathering

Before reviewing any code:

1. **Read the PR description**
   - What problem does this solve?
   - What approach was taken?
   - Any known limitations?

2. **Check for ADRs**
   - Does this change relate to any architectural decision?
   - Are there constraints we need to respect?

3. **Identify the scope**
   - How many files changed?
   - What subsystems are affected?

---

## Phase 2: Security Review

### Mandatory Checks

```markdown
[ ] No hardcoded secrets
[ ] No eval() or dynamic code execution
[ ] No unsanitized user input
[ ] No SQL string interpolation
[ ] No pickle/marshal deserialization
[ ] Auth checks on all protected routes
[ ] Input validation present
```

### Security Scan

```bash
# Run security linter
semgrep --config auto --severity ERROR

# Check for secrets
detect-secrets scan
```

---

## Phase 3: Code Quality Review

### Structure

```markdown
[ ] Files under 300 lines
[ ] Functions under 50 lines
[ ] Nesting under 3 levels
[ ] Clear separation of concerns
[ ] No circular dependencies
```

### Patterns

```markdown
[ ] Error handling is explicit
[ ] Types are complete (no `any`)
[ ] Side effects are documented
[ ] Resources are properly closed
[ ] Async operations have timeouts
```

### Naming

```markdown
[ ] Names are descriptive
[ ] No abbreviations (except well-known)
[ ] Consistent with existing codebase
[ ] No misleading names
```

---

## Phase 4: Test Coverage

### Required Tests

```markdown
[ ] Happy path covered
[ ] Edge cases handled
[ ] Error paths tested
[ ] Integration points verified
```

### Coverage Check

```bash
# Generate coverage report
npm run test:coverage
# OR
pytest --cov --cov-report=html
```

**Minimum thresholds:**
- Statements: 80%
- Branches: 75%
- Functions: 80%

---

## Phase 5: Documentation

### Check Documentation

```markdown
[ ] Public functions have docstrings
[ ] Complex logic has comments
[ ] README updated if needed
[ ] API docs updated if applicable
[ ] CHANGELOG entry added
```

---

## Phase 6: Review Summary

Generate a structured review summary:

```markdown
## Review Summary

### 🟢 Approved Items
- [List of good practices observed]

### 🟡 Suggestions (Non-blocking)
- [Optional improvements]

### 🔴 Required Changes (Blocking)
- [Must fix before merge]

### 📋 Verification
- [ ] Tests pass locally
- [ ] Build succeeds
- [ ] No new warnings
```

---

## Decision Matrix

| Finding | Severity | Action |
|---------|----------|--------|
| Security vulnerability | 🔴 Critical | Block merge, fix immediately |
| Missing tests | 🔴 High | Block merge |
| Type errors | 🔴 High | Block merge |
| Lint violations | 🟡 Medium | Fix or document exception |
| Style inconsistencies | 🟡 Medium | Suggest fix |
| Minor improvements | 🟢 Low | Optional |

---

*Use this workflow consistently to maintain code quality.*
