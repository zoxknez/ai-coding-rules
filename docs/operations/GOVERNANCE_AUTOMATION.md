# 🔄 Governance Automation

> **Automated verification loops for agentic development**
>
> AI cannot be trusted to verify itself. External, deterministic tools must validate agent output.

---

## The Verification Hierarchy

```
┌─────────────────────────────────────────────────────┐
│                    AGENT                            │
│                 (generates code)                    │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│              PRE-COMMIT HOOKS                       │
│     (blocks insecure patterns, secrets, style)      │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                 CI PIPELINE                         │
│        (SAST, tests, type checks, builds)           │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│               HUMAN REVIEW                          │
│     (architecture, security, business logic)        │
└─────────────────────────────────────────────────────┘
```

---

## Pre-commit Configuration

### Complete Setup

```yaml
# .pre-commit-config.yaml
default_stages: [commit]
fail_fast: false

repos:
  # ============================================
  # SECRETS DETECTION
  # ============================================
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: package-lock.json|pnpm-lock.yaml
        
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks
        
  # ============================================
  # SECURITY SCANNERS
  # ============================================
  - repo: https://github.com/returntocorp/semgrep
    rev: v1.50.0
    hooks:
      - id: semgrep
        args: ['--config', '.semgrep/', '--error']
        
  - repo: https://github.com/PyCQA/bandit
    rev: 1.7.6
    hooks:
      - id: bandit
        args: ['-c', 'pyproject.toml', '-r', '.']
        additional_dependencies: ['bandit[toml]']
        files: \.py$
        
  # ============================================
  # FORMATTING
  # ============================================
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v3.1.0
    hooks:
      - id: prettier
        types_or: [javascript, typescript, json, yaml, markdown]
        
  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.1.9
    hooks:
      - id: ruff
        args: [--fix]
      - id: ruff-format
        
  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.56.0
    hooks:
      - id: eslint
        files: \.[jt]sx?$
        types: [file]
        additional_dependencies:
          - eslint
          - typescript
          - '@typescript-eslint/parser'
          - '@typescript-eslint/eslint-plugin'
          
  # ============================================
  # TYPE CHECKING
  # ============================================
  - repo: https://github.com/pre-commit/mirrors-mypy
    rev: v1.8.0
    hooks:
      - id: mypy
        additional_dependencies: ['types-all']
        
  # ============================================
  # INFRASTRUCTURE
  # ============================================
  - repo: https://github.com/antonbabenko/pre-commit-terraform
    rev: v1.86.0
    hooks:
      - id: terraform_fmt
      - id: terraform_validate
      - id: terraform_tfsec
      
  - repo: https://github.com/hadolint/hadolint
    rev: v2.12.0
    hooks:
      - id: hadolint-docker
        
  # ============================================
  # GENERAL QUALITY
  # ============================================
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
        args: [--unsafe]
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: check-merge-conflict
      - id: check-case-conflict
      - id: no-commit-to-branch
        args: ['--branch', 'main', '--branch', 'master']
```

### Installation

```bash
# Install pre-commit
pip install pre-commit

# Install hooks
pre-commit install

# Run on all files (initial scan)
pre-commit run --all-files

# Update hooks
pre-commit autoupdate
```

---

## Semgrep Rules

### Custom Agent-Pattern Rules

```yaml
# .semgrep/agent-patterns.yaml
rules:
  # ============================================
  # PYTHON
  # ============================================
  - id: python-pickle-usage
    patterns:
      - pattern-either:
          - pattern: pickle.loads(...)
          - pattern: pickle.load(...)
          - pattern: pickle.dumps(...)
          - pattern: pickle.dump(...)
    message: |
      pickle is unsafe for untrusted data. Use JSON or msgpack instead.
      See: docs/security/AGENT_VULNERABILITIES.md#py-001
    severity: ERROR
    languages: [python]
    metadata:
      category: security
      cwe: CWE-502
      owasp: A8:2021
      
  - id: python-sql-fstring
    patterns:
      - pattern-either:
          - pattern: $DB.execute(f"...")
          - pattern: $DB.executemany(f"...")
          - pattern: cursor.execute(f"...")
    message: |
      SQL injection via f-string. Use parameterized queries.
      See: docs/security/AGENT_VULNERABILITIES.md#py-002
    severity: ERROR
    languages: [python]
    
  - id: python-eval-exec
    patterns:
      - pattern-either:
          - pattern: eval(...)
          - pattern: exec(...)
          - pattern: compile(..., ..., "exec")
    message: |
      eval/exec allows arbitrary code execution. Find a safer alternative.
    severity: ERROR
    languages: [python]
    
  # ============================================
  # JAVASCRIPT/TYPESCRIPT
  # ============================================
  - id: js-dangerous-innerhtml
    patterns:
      - pattern: dangerouslySetInnerHTML={{__html: $VAR}}
    message: |
      dangerouslySetInnerHTML without sanitization causes XSS.
      Use a SafeHTML component with DOMPurify.
      See: docs/security/AGENT_VULNERABILITIES.md#js-001
    severity: WARNING
    languages: [typescript, javascript]
    
  - id: js-eval
    patterns:
      - pattern-either:
          - pattern: eval(...)
          - pattern: new Function(...)
          - pattern: setTimeout($X, ...)
            metavariable-pattern:
              metavariable: $X
              pattern: $STRING
    message: |
      Dynamic code execution is dangerous. Find a safer alternative.
    severity: ERROR
    languages: [typescript, javascript]
    
  - id: js-any-type
    patterns:
      - pattern: ": any"
    message: |
      Avoid 'any' type. Use proper typing or 'unknown' with type guards.
    severity: WARNING
    languages: [typescript]
    paths:
      exclude:
        - "*.d.ts"
        - "*.test.ts"
        
  # ============================================
  # GO
  # ============================================
  - id: go-error-ignored
    patterns:
      - pattern: $VAR, _ = $FUNC(...)
    message: |
      Error is ignored. Handle all errors explicitly.
    severity: WARNING
    languages: [go]
    
  - id: go-sql-injection
    patterns:
      - pattern: $DB.Query(fmt.Sprintf(...))
      - pattern: $DB.Exec(fmt.Sprintf(...))
    message: |
      SQL injection via fmt.Sprintf. Use parameterized queries.
    severity: ERROR
    languages: [go]
    
  # ============================================
  # RUST
  # ============================================
  - id: rust-unsafe-block
    patterns:
      - pattern: unsafe { ... }
    message: |
      unsafe block detected. Requires explicit approval and documentation.
    severity: WARNING
    languages: [rust]
    
  - id: rust-unwrap-production
    patterns:
      - pattern: $X.unwrap()
    message: |
      unwrap() can panic. Use expect() with message or proper error handling.
    severity: WARNING
    languages: [rust]
    paths:
      exclude:
        - "**/*_test.rs"
        - "**/tests/**"
        
  # ============================================
  # INFRASTRUCTURE
  # ============================================
  - id: terraform-wildcard-iam
    patterns:
      - pattern: |
          Action = "*"
      - pattern: |
          Resource = "*"
    message: |
      Wildcard permissions violate least privilege. Specify exact permissions.
    severity: ERROR
    languages: [hcl]
    
  - id: docker-latest-tag
    patterns:
      - pattern-regex: "FROM\\s+\\S+:latest"
    message: |
      Pin specific image versions, avoid :latest tag.
    severity: WARNING
    languages: [dockerfile]
```

### Semgrep Configuration

```yaml
# .semgrep.yaml
rules:
  - include: .semgrep/agent-patterns.yaml
  
# Use registry rules
  - r/python.lang.security
  - r/javascript.lang.security
  - r/go.lang.security
  - r/typescript.lang.security
```

---

## CI Pipeline Integration

### GitHub Actions

```yaml
# .github/workflows/security.yml
name: Security Checks

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: .semgrep/
          generateSarif: true
          
      - name: Upload SARIF
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: semgrep.sarif
          
  secret-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'
          
  iac-scan:
    runs-on: ubuntu-latest
    if: contains(github.event.head_commit.modified, 'terraform') || contains(github.event.head_commit.modified, 'Dockerfile')
    steps:
      - uses: actions/checkout@v4
      
      - name: Checkov IaC scan
        uses: bridgecrewio/checkov-action@v12
        with:
          directory: .
          framework: terraform,dockerfile,kubernetes
          soft_fail: false
```

### Pre-merge Requirements

```yaml
# Branch protection rules (via settings or as code)
protection:
  required_status_checks:
    strict: true
    contexts:
      - security-scan
      - secret-scan
      - tests
      - typecheck
      - lint
      
  required_pull_request_reviews:
    required_approving_review_count: 1
    dismiss_stale_reviews: true
    require_code_owner_reviews: true
```

---

## Verification Loops by Language

### Python

```yaml
# pyproject.toml
[tool.bandit]
exclude_dirs = ["tests", "venv"]
skips = ["B101"]  # assert statements ok in tests

[tool.ruff]
select = ["E", "F", "B", "S", "I", "UP", "PL"]
ignore = ["E501"]  # line length handled by formatter

[tool.mypy]
strict = true
warn_return_any = true
disallow_untyped_defs = true
```

```bash
# Verification script
#!/bin/bash
set -e

echo "Running Python verification..."
ruff check . --fix
ruff format .
mypy .
bandit -r . -c pyproject.toml
pytest --cov=src --cov-fail-under=80
```

### TypeScript

```json
// package.json scripts
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:coverage": "vitest run --coverage",
    "security": "npm audit --audit-level=high",
    "verify": "npm run format:check && npm run lint && npm run typecheck && npm run test"
  }
}
```

### Go

```makefile
# Makefile
.PHONY: verify lint test security

verify: lint test security

lint:
	gofmt -w .
	golangci-lint run
	
test:
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out | tail -n 1
	
security:
	gosec -quiet ./...
	govulncheck ./...
```

### Rust

```toml
# .cargo/config.toml
[alias]
verify = "xtask verify"

# Custom xtask or Makefile
```

```makefile
# Makefile
.PHONY: verify

verify:
	cargo fmt --check
	cargo clippy -- -D warnings
	cargo test
	cargo audit
	cargo geiger  # Check unsafe usage
```

---

## Agent Integration

### Verification Before Commit

Add to platform rules:

```markdown
## Pre-Commit Verification

Before committing any changes:

1. Run the project's verification command:
   - npm: `npm run verify`
   - Python: `./scripts/verify.sh` or `make verify`
   - Go: `make verify`
   - Rust: `cargo verify` or `make verify`

2. If any check fails:
   - Fix the issues
   - Do NOT bypass with --no-verify
   - Do NOT disable rules inline

3. All checks must pass before commit is created.
```

### Continuous Verification During Session

```markdown
## Session Hygiene

Every 5 significant changes:
1. Run lint check
2. Run type check
3. Run relevant tests

If drift accumulates:
1. Stop adding features
2. Fix all errors/warnings
3. Resume only after green state
```

---

## Tool Configuration Files

### ESLint

```javascript
// eslint.config.js (flat config)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import security from 'eslint-plugin-security';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  security.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      'security/detect-object-injection': 'warn',
      'security/detect-eval-with-expression': 'error',
    }
  }
);
```

### Ruff (Python)

```toml
# pyproject.toml
[tool.ruff]
target-version = "py311"
line-length = 100

[tool.ruff.lint]
select = [
    "E",     # pycodestyle errors
    "F",     # pyflakes
    "B",     # flake8-bugbear
    "S",     # flake8-bandit (security)
    "I",     # isort
    "UP",    # pyupgrade
    "PL",    # pylint
    "RUF",   # ruff-specific
]

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["S101"]  # Allow assert in tests
```

---

## Governance Summary

| Layer | Tool | Blocks |
|-------|------|--------|
| Pre-commit | detect-secrets | Hardcoded credentials |
| Pre-commit | semgrep | Language-specific vulnerabilities |
| Pre-commit | prettier/ruff | Formatting issues |
| Pre-commit | eslint/ruff | Code quality issues |
| CI | trivy | Dependency vulnerabilities |
| CI | checkov | IaC misconfigurations |
| CI | tests | Logic errors |
| CI | coverage | Missing tests |
| Review | CODEOWNERS | Unauthorized changes |

---

*Version: 1.0.0*
*Last Updated: 2026-01-28*
