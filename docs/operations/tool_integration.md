# Tool Integration Guide (v2)

> **How to connect AI assistants, linters, CI, and dev tools into
> a coherent workflow that catches defects at the earliest stage.**

---

## The Ideal Toolchain Loop

```
┌──────────────────────────────────────────────────────────┐
│                   DEVELOPMENT LOOP                       │
│                                                          │
│  ① Write ──► ② Lint/Format ──► ③ Type-check ──►         │
│          ④ Test ──► ⑤ Commit ──► ⑥ CI ──► ⑦ Deploy      │
│                                                          │
│  AI assists ①②③④  |  Hooks gate ⑤  |  CI gates ⑥⑦      │
└──────────────────────────────────────────────────────────┘
```

**Principle:** Shift problems left. The closer to write-time a defect is caught,
the cheaper it is to fix.

---

## IDE Integration

### VS Code / Cursor Setup

```jsonc
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "files.autoSave": "onFocusChange",
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff"
  },
  "[rust]": {
    "editor.defaultFormatter": "rust-lang.rust-analyzer"
  }
}
```

### Recommended Extensions

| Language | Linter/Formatter | Type Checker | AI Tool |
|----------|-----------------|--------------|---------|
| TypeScript | ESLint + Prettier | tsc (built-in) | Copilot / Cursor |
| Python | Ruff | Mypy / Pyright | Copilot / Claude |
| Go | gofmt + golangci-lint | go vet | Copilot |
| Rust | rustfmt + clippy | rustc | Copilot |
| C# | dotnet format + Roslyn | Roslyn analyzers | Copilot |

---

## Pre-Commit Automation

### Git Hooks with pre-commit

```yaml
# .pre-commit-config.yaml
repos:
  # Universal
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-merge-conflict
      - id: detect-private-key
      - id: no-commit-to-branch
        args: ['--branch', 'main']

  # Secrets detection
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks

  # JavaScript / TypeScript
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v9.0.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
        additional_dependencies:
          - eslint
          - typescript

  # Python
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.5.0
    hooks:
      - id: ruff
        args: ['--fix']
      - id: ruff-format

  # Go
  - repo: https://github.com/dnephin/pre-commit-golang
    rev: v0.5.1
    hooks:
      - id: go-fmt
      - id: go-vet

  # Rust
  - repo: local
    hooks:
      - id: cargo-fmt
        name: cargo fmt
        entry: cargo fmt --all -- --check
        language: system
        types: [rust]
      - id: cargo-clippy
        name: cargo clippy
        entry: cargo clippy --all-targets -- -D warnings
        language: system
        types: [rust]
```

### What Each Hook Stage Catches

| Stage | What It Catches | Fix Cost |
|-------|----------------|----------|
| Pre-commit (save) | Format, imports, trivial bugs | Seconds |
| Pre-commit (lint) | Style violations, unused vars | Seconds |
| Pre-commit (type) | Type errors, API misuse | Minutes |
| Pre-push (test) | Logic bugs, regressions | Minutes |
| CI (full suite) | Integration issues, security | Hours |
| Production | Everything else | Days/weeks |

---

## CI Pipeline Gates

### Minimum CI Pipeline

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

      # Stage 1: Fast checks (< 1 min)
      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Format check
        run: npm run format:check

      # Stage 2: Tests (< 5 min)
      - name: Unit tests
        run: npm test -- --coverage

      - name: Coverage gate
        run: |
          COVERAGE=$(npx coverage-summary)
          if [ "$COVERAGE" -lt 80 ]; then
            echo "Coverage $COVERAGE% < 80% threshold"
            exit 1
          fi

      # Stage 3: Security (< 2 min)
      - name: Dependency audit
        run: npm audit --audit-level=high

      - name: Secret scan
        uses: gitleaks/gitleaks-action@v2

      # Stage 4: Build verification
      - name: Build
        run: npm run build
```

### CI Gate Requirements

| Gate | Threshold | Blocks Merge? |
|------|-----------|---------------|
| Lint | 0 errors | ✅ Yes |
| Type check | 0 errors | ✅ Yes |
| Unit tests | 100% pass | ✅ Yes |
| Coverage | ≥ 80% | ✅ Yes |
| Security audit | No high/critical | ✅ Yes |
| Build | Successful | ✅ Yes |
| Integration tests | 100% pass | ✅ Yes |
| Performance | No regression > 10% | ⚠️ Warning |
| Bundle size | No increase > 5% | ⚠️ Warning |

---

## Tool Selection Guidance

### When to Use What

| Task | Best Tool | Why |
|------|-----------|-----|
| New feature scaffolding | AI assistant | Fast boilerplate generation |
| Complex algorithm | Human design + AI assist | AI may hallucinate edge cases |
| Bug investigation | AI + debugger | AI reads logs fast; debugger confirms |
| Refactoring | AI with strict diff budget | AI excels at mechanical transforms |
| Security review | Human + SAST tools | AI misses subtle vulnerabilities |
| Performance tuning | Profiler + human analysis | Profiler data > AI guessing |
| Code review | Human reviewer | Final judgment requires context |
| Documentation | AI first draft + human edit | AI generates fast; human verifies |
| Test generation | AI + coverage report | AI generates cases; coverage finds gaps |
| Dependency updates | Dependabot / Renovate | Automated, tested, PR-based |

### Tool Priority Hierarchy

When tools disagree, follow this priority:

1. **Compiler / type checker** — absolute truth
2. **SAST / security scanner** — safety first
3. **Linter** — team conventions
4. **AI assistant** — suggestions only, not authority
5. **Formatter** — cosmetic, auto-fixable

### Anti-Pattern: AI Override

```
❌ AI says "ignore the linter warning, it's fine"
✅ Fix the lint issue OR add a documented suppression with reason
```

---

## Monitoring & Observability Integration

### Structured Logging

```typescript
// Use structured logs, not string interpolation
// ✅ Good
logger.info('Order processed', {
  orderId: order.id,
  userId: order.userId,
  amount: order.total,
  duration_ms: elapsed,
});

// ❌ Bad
logger.info(`Order ${order.id} processed for user ${order.userId}`);
```

### Recommended Observability Stack

| Layer | Tool Options | Purpose |
|-------|-------------|---------|
| Logging | Pino, Winston, structlog | Structured event logs |
| Metrics | Prometheus, Datadog, CloudWatch | Quantitative measurements |
| Tracing | OpenTelemetry, Jaeger | Request flow tracking |
| Error tracking | Sentry, Bugsnag | Exception aggregation |
| Uptime | Pingdom, UptimeRobot | Availability monitoring |
| APM | Datadog, New Relic | Full application performance |

### Health Check Endpoint

```typescript
// Every service must expose /health
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION,
    checks: {
      database: await checkDb(),
      cache: await checkRedis(),
      memory: process.memoryUsage(),
    },
  };
  const status = health.checks.database && health.checks.cache ? 200 : 503;
  res.status(status).json(health);
});
```

---

## Automation Checklist

Before considering a project "production ready," verify:

```markdown
- [ ] Format-on-save configured in IDE
- [ ] Pre-commit hooks installed (lint, format, secrets)
- [ ] CI pipeline runs on every PR
- [ ] All CI gates are blocking (lint, type, test, security)
- [ ] Coverage threshold enforced (≥ 80%)
- [ ] Dependency update bot enabled (Renovate / Dependabot)
- [ ] Secret scanning active (gitleaks or GitHub secret scanning)
- [ ] Health check endpoint deployed
- [ ] Structured logging in place
- [ ] Error tracking connected (Sentry or equivalent)
- [ ] .gitignore covers build outputs, .env, IDE files
- [ ] Documentation auto-generates from code (TypeDoc / Sphinx / rustdoc)
```

---

*Version: 2.0.0*
