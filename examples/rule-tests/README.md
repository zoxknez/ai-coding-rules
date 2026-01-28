# Rule Tests

> Verification test cases for AI coding rules.
> Ensures rules are correctly applied and enforced.

## Purpose

Rule tests provide:
- **Validation** - Verify rules catch violations
- **Documentation** - Examples of pass/fail cases
- **Regression** - Ensure rules don't break over time
- **Training** - Help AI understand rule intent

## Test Structure

```
examples/rule-tests/
├── README.md           # This file
├── security/
│   ├── no-secrets.test.md
│   ├── sql-injection.test.md
│   └── auth-required.test.md
├── quality/
│   ├── no-any.test.md
│   ├── error-handling.test.md
│   └── complexity.test.md
└── style/
    ├── naming.test.md
    └── imports.test.md
```

## Test File Format

```markdown
# Rule Test: {rule-name}

## Rule Reference
- **ID:** `{rule-id}`
- **Category:** {category}
- **Severity:** {severity}
- **STRICT:** {yes|no}

## Test Cases

### ❌ FAIL: {description}

**Input:**
```{language}
{code that should fail}
```

**Expected:** FAIL
**Violation:** {what rule was violated}
**Fix:** {how to fix}

---

### ✅ PASS: {description}

**Input:**
```{language}
{code that should pass}
```

**Expected:** PASS
**Why:** {why this is correct}
```

## How to Use

### For AI Agents

When implementing a rule, reference its test file:

```
Before implementing security-no-secrets rule, 
see examples/rule-tests/security/no-secrets.test.md
for examples of what to catch and what to allow.
```

### For Rule Authors

When creating new rules:
1. Write test cases first (TDD for rules)
2. Include edge cases
3. Show both obvious and subtle violations
4. Provide clear fix examples

### For Validation

Run tests to verify AI rule implementation:

```bash
# Conceptual - not a real command yet
ai-rules test --rule security-no-secrets
```

## Test Coverage

| Category | Rules | Tests | Coverage |
|----------|-------|-------|----------|
| Security | 5 | 5 | 100% |
| Quality | 4 | 4 | 100% |
| Style | 2 | 2 | 100% |

## Contributing Tests

1. Follow the test file format
2. Include at least 3 FAIL cases
3. Include at least 2 PASS cases
4. Cover edge cases
5. Provide clear fix examples
