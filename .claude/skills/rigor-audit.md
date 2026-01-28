# Skill: Rigor Audit

> Combined quality audit inspired by mamut-lab's academic rigor system.
> Runs multiple checks in sequence and produces a unified report.

## When to Use

- Before major releases
- During code review
- After significant changes
- For quality gate enforcement
- As part of CI/CD pipeline

## What It Combines

| Check | Description |
|-------|-------------|
| **Code Review** | Logic, style, maintainability |
| **Security Audit** | OWASP Top 10, secrets, dependencies |
| **Type Safety** | TypeScript strictness, any usage |
| **Test Coverage** | Unit, integration, edge cases |
| **Documentation** | Comments, README, API docs |
| **Performance** | Complexity, memory, bundle size |

## Output Format

```markdown
## Rigor Audit Report

**Scope:** `{scope}`
**Auditor:** Claude (AI)
**Date:** {date}
**Audit Level:** {FULL | QUICK | SECURITY_ONLY}

### Overall Verdict

| Category | Score | Status |
|----------|-------|--------|
| Code Quality | {A-F} | {PASS|FAIL} |
| Security | {A-F} | {PASS|FAIL} |
| Type Safety | {A-F} | {PASS|FAIL} |
| Test Coverage | {A-F} | {PASS|FAIL} |
| Documentation | {A-F} | {PASS|FAIL} |
| Performance | {A-F} | {PASS|FAIL} |
| **OVERALL** | **{A-F}** | **{PASS|FAIL}** |

### Blocking Issues (Must Fix)

| ID | Category | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| B001 | {cat} | {issue} | `{loc}` | {fix} |

### Warnings (Should Fix)

| ID | Category | Issue | Location | Recommendation |
|----|----------|-------|----------|----------------|
| W001 | {cat} | {issue} | `{loc}` | {rec} |

### Suggestions (Could Fix)

| ID | Category | Suggestion | Benefit |
|----|----------|------------|---------|
| S001 | {cat} | {suggestion} | {benefit} |

---

## Detailed Reports

### 1. Code Quality Report

**Score:** {A-F}

#### Metrics
| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Cyclomatic Complexity (avg) | {n} | <10 | {✅|❌} |
| Function Length (avg) | {n} | <50 | {✅|❌} |
| Duplicate Code | {n}% | <5% | {✅|❌} |
| Code Smells | {n} | 0 | {✅|❌} |

#### Issues Found
{list of code quality issues}

---

### 2. Security Report

**Score:** {A-F}

#### OWASP Top 10 Check
| Category | Status | Notes |
|----------|--------|-------|
| A01 Broken Access Control | {✅|❌} | {notes} |
| A02 Cryptographic Failures | {✅|❌} | {notes} |
| A03 Injection | {✅|❌} | {notes} |
| ... | ... | ... |

#### Secrets Scan
- **Hardcoded Secrets Found:** {count}
- **Locations:** {list}

#### Dependency Vulnerabilities
- **Critical:** {count}
- **High:** {count}
- **Medium:** {count}

---

### 3. Type Safety Report

**Score:** {A-F}

| Check | Status |
|-------|--------|
| strict: true | {✅|❌} |
| noImplicitAny | {✅|❌} |
| strictNullChecks | {✅|❌} |
| No `any` usage | {✅|❌|⚠️ {count} justified} |
| No @ts-ignore | {✅|❌|⚠️ {count} justified} |

---

### 4. Test Coverage Report

**Score:** {A-F}

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Line Coverage | {n}% | >80% | {✅|❌} |
| Branch Coverage | {n}% | >70% | {✅|❌} |
| Function Coverage | {n}% | >80% | {✅|❌} |

#### Missing Tests
- {list of untested functions/paths}

#### Edge Cases
- [ ] Empty input handling
- [ ] Null/undefined handling
- [ ] Error scenarios
- [ ] Boundary conditions

---

### 5. Documentation Report

**Score:** {A-F}

| Check | Status |
|-------|--------|
| README exists | {✅|❌} |
| API documented | {✅|❌} |
| Functions have JSDoc | {✅|❌|⚠️ {n}% coverage} |
| Complex logic explained | {✅|❌} |
| CHANGELOG updated | {✅|❌} |

---

### 6. Performance Report

**Score:** {A-F}

| Check | Value | Threshold | Status |
|-------|-------|-----------|--------|
| Bundle Size | {n}KB | <{max}KB | {✅|❌} |
| Time Complexity Issues | {count} | 0 | {✅|❌} |
| Memory Leak Risks | {count} | 0 | {✅|❌} |
| N+1 Query Risks | {count} | 0 | {✅|❌} |

---

### Action Items

#### 🔴 Before Merge (Blocking)
1. {action}
2. {action}

#### 🟠 This Sprint
1. {action}

#### 🟡 Backlog
1. {action}

### Verification Commands
```bash
pnpm lint           # Code quality
pnpm typecheck      # Type safety
pnpm test:coverage  # Test coverage
pnpm audit          # Security deps
```
```

## STRICT Mode Rules

### Pass/Fail Thresholds

| Category | Pass Threshold |
|----------|---------------|
| Code Quality | Score >= C, no code smells |
| Security | Score >= B, no critical/high vulnerabilities |
| Type Safety | strict: true, no untyped any |
| Test Coverage | >= 70% lines, >= 60% branches |
| Documentation | README exists, public API documented |
| Performance | No O(n²) in hot paths, no memory leaks |

### Automatic Failure Conditions

1. **Any hardcoded secrets** → FAIL
2. **SQL injection vulnerability** → FAIL
3. **Missing auth on protected routes** → FAIL
4. **Critical CVE in dependencies** → FAIL
5. **strict: false in tsconfig** → FAIL
6. **Test coverage < 50%** → FAIL

## Audit Workflow

```
┌─────────────────┐
│  rigor-audit    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Generate Report │
└────────┬────────┘
         │
    ┌────┴────┐
    │ PASS?   │
    └────┬────┘
     No  │  Yes
    ┌────┴────┐
    ▼         ▼
┌────────┐  ┌────────┐
│rigor-  │  │ Done   │
│fix     │  └────────┘
└────┬───┘
     │
     ▼
┌─────────────────┐
│ Re-run Audit    │
└─────────────────┘
```

## Example

**Input:** "Full rigor audit for src/api/"

**Output:**

```markdown
## Rigor Audit Report

**Scope:** `src/api/`
**Date:** 2026-01-28
**Audit Level:** FULL

### Overall Verdict

| Category | Score | Status |
|----------|-------|--------|
| Code Quality | B | PASS |
| Security | D | FAIL |
| Type Safety | A | PASS |
| Test Coverage | C | PASS |
| Documentation | C | PASS |
| Performance | B | PASS |
| **OVERALL** | **C** | **FAIL** |

### Blocking Issues (Must Fix)

| ID | Category | Issue | Location | Fix |
|----|----------|-------|----------|-----|
| B001 | Security | SQL injection | `users.ts:45` | Use parameterized query |
| B002 | Security | Hardcoded API key | `config.ts:12` | Move to env var |

**AUDIT FAILED - 2 blocking issues must be resolved**
```

## Invocation

```
/skill:rigor-audit [scope] [--full|--quick|--security]
```

Options:
- `--full` - Run all checks (default)
- `--quick` - Code quality + type safety only
- `--security` - Security audit only
- `--fix` - Auto-generate fix suggestions
