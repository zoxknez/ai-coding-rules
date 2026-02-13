# CI/CD Pipeline Guide for AI-Assisted Development (v1)

> Ship fast, ship safe. Every change must pass automated gates before reaching users.

---

## Pipeline Philosophy

```
Local Dev → Pre-Commit → PR Checks → Merge → Staging → Production
   ↳ fast feedback    ↳ quality gate    ↳ final gate
```

**Principle:** Catch errors as early and cheaply as possible. A bug caught in pre-commit costs 1 minute. In production, it costs hours.

## Pre-Commit Hooks (Local)

### Minimum Set
```yaml
# .pre-commit-config.yaml or git hooks
hooks:
  - lint          # ESLint, Ruff, golangci-lint
  - format        # Prettier, Black, gofmt
  - typecheck     # tsc --noEmit, mypy, go vet
  - test:changed  # Run tests for changed files only
  - secrets       # gitleaks, trufflehog — NEVER skip
```

### Installation
```bash
# Using scripts from this repo
./scripts/install_git_hooks.sh    # Unix
.\scripts\install_git_hooks.ps1  # Windows
```

### Rules
- Pre-commit must complete in < 30 seconds
- Secret detection is **non-negotiable** — cannot be bypassed
- Format automatically (don't reject, fix)

## PR / Merge Request Pipeline

### Required Checks (all must pass)

| Check | Tool | Timeout | Blocking |
|-------|------|---------|----------|
| Lint | ESLint/Ruff/clippy | 2 min | Yes |
| Type check | tsc/mypy/go vet | 3 min | Yes |
| Unit tests | Vitest/pytest/go test | 5 min | Yes |
| Integration tests | Supertest/httpx | 10 min | Yes |
| Security scan | Snyk/Trivy/gitleaks | 5 min | Yes |
| Coverage check | Istanbul/coverage.py | 2 min | Yes (no decrease) |
| Build | Next build/cargo build | 10 min | Yes |
| Bundle size | Bundleanalyzer | 1 min | Warn if > budget |

### PR Quality Gates
```
□ All CI checks green
□ At least 1 human approval (or AI-assisted review)
□ No unresolved conversations
□ Branch is up to date with main
□ No secrets detected
□ Coverage did not decrease
```

## GitHub Actions Example

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- --coverage
      - run: npm run build
      
      # Security scan
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'

  # E2E tests only on PR (slower)
  e2e:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

## Deployment Strategy

### Environments

| Environment | Trigger | Purpose | Rollback |
|-------------|---------|---------|----------|
| Preview | Every PR | Review changes in isolation | Auto-cleanup |
| Staging | Merge to main | Final validation | Instant |
| Production | Manual approval or tag | Real users | < 5 min |

### Deployment Checklist
```
□ All CI checks passed
□ Staging tested (manual or automated smoke test)
□ Database migrations tested on staging first
□ Feature flags configured for risky changes
□ Rollback plan documented
□ Monitoring dashboards open
□ On-call engineer aware
```

### Rollback Strategy

| Strategy | When | Speed |
|----------|------|-------|
| **Revert commit** | Code-only change broke something | < 5 min |
| **Feature flag off** | New feature is problematic | < 1 min |
| **Blue/green switch** | Full deployment is bad | < 2 min |
| **DB restore** | Data corruption (worst case) | 15-60 min |

### Rules
- Every deployment must be revertible
- Database migrations must be backwards-compatible
- Never deploy on Friday afternoon (unless you have full weekend coverage)
- Canary deploy for > 10% user-facing changes

## Database Migration Safety

```
Rule: Migrations must be additive and backwards-compatible.
```

### Safe Migrations
- ✅ Add column (nullable or with default)
- ✅ Add table
- ✅ Add index (concurrently if large table)
- ✅ Backfill data in batches

### Dangerous Migrations (require extra care)
- ⚠️ Rename column → add new, migrate data, remove old (3 deployments)
- ⚠️ Change column type → add new column, migrate, switch, remove old
- ⚠️ Drop column → deploy code that doesn't use it first, then drop
- ❌ Never drop table in the same deployment as removing code references

## Feature Flags

### When to Use
- New feature for subset of users
- Risky change that might need instant rollback
- A/B testing
- Gradual rollout (1% → 10% → 50% → 100%)

### Pattern
```typescript
// ✅ Feature flag pattern
if (await featureFlags.isEnabled('new-checkout', { userId })) {
  return newCheckoutFlow(req);
}
return legacyCheckoutFlow(req);
```

### Rules
- Remove dead flags within 2 sprints
- Flag names must be descriptive: `new-checkout-v2`, not `flag1`
- Log flag evaluations for debugging

## Secrets Management

| Do | Don't |
|----|-------|
| Use environment variables | Hardcode in source code |
| Use vault (AWS SSM, HashiCorp Vault) | Commit `.env` files |
| Rotate regularly | Share via Slack/email |
| Scope to minimum access | Use wildcard permissions |
| Audit access logs | Ignore access anomalies |

## AI-Specific CI Rules

1. **AI-generated code gets the same CI gates** — no shortcuts
2. **Larger AI PRs get stricter review** — >200 LOC requires human review
3. **AI can suggest CI config changes** — but a human must approve
4. **Never let AI disable CI checks** — even "temporarily"
5. **AI-generated migrations must be reviewed line-by-line** — most dangerous output

## Related Docs
- [GOVERNANCE_AUTOMATION](GOVERNANCE_AUTOMATION.md) — automated governance policies
- [team_workflows](team_workflows.md) — PR and review processes
- [SECURITY_GUARDRAILS](SECURITY_GUARDRAILS.md) — security in the pipeline
- [tool_integration](tool_integration.md) — tool configuration
