# Google Antigravity Rules

> **Project Constitution for Antigravity Agents**
>
> This file governs all AI agent behavior in this repository.
> Agents MUST read this file before any code generation.

---

## Core Principles

1. **Security First** - No security regression is acceptable
2. **Explicit Intent** - All changes require clear justification
3. **Minimal Footprint** - Do only what is requested
4. **Verification Required** - Test before committing

## Constitutional Reference

This project operates under the Project Constitution.
**Read `docs/core/CONSTITUTION.md` before proceeding.**

---

## Architecture Overview

```
src/
├── core/           # Domain logic (NO external dependencies)
├── application/    # Use cases and interfaces
├── infrastructure/ # External services, DB, APIs
└── presentation/   # UI/API controllers
```

### Dependency Rules

```
presentation → application → core
infrastructure → application
core → NOTHING (pure business logic)
```

❌ **NEVER** import from `infrastructure/` into `core/`
❌ **NEVER** import from `presentation/` into `application/`

---

## Code Style

### Formatting
- Use project formatter (Prettier/Black/rustfmt)
- Run formatter before every commit
- Never disable formatter rules inline

### Naming
- Files: `kebab-case.ts` or `snake_case.py`
- Components: `PascalCase`
- Functions: `camelCase` (JS) or `snake_case` (Python/Rust)
- Constants: `SCREAMING_SNAKE_CASE`

### Documentation
- All public functions require docstrings
- Complex logic requires inline comments
- API changes require OpenAPI updates

---

## Security Mandates

### Prohibited Patterns

| Pattern | Language | Reason |
|---------|----------|--------|
| `pickle` | Python | RCE via deserialization |
| `eval()` / `exec()` | All | Code injection |
| `dangerouslySetInnerHTML` | React | XSS without sanitization |
| `unsafe {}` | Rust | Memory safety bypass |
| String SQL | All | SQL injection |
| `any` type | TypeScript | Type safety bypass |

### Required Patterns

| Requirement | Implementation |
|-------------|----------------|
| Input validation | Zod/Pydantic/validator |
| SQL queries | Parameterized only |
| Secrets | Environment variables only |
| Auth | Verify on every request |
| Error handling | Typed error envelopes |

---

## Agent Workflows

### Before Implementation

1. Check for existing ADRs: `docs/architecture/decisions/`
2. Verify no similar feature exists
3. Confirm requirements are clear
4. Create implementation plan (Artifact)

### During Implementation

1. Write failing test first
2. Implement minimal code to pass
3. Refactor for clarity
4. Update documentation

### Before Commit

1. All tests pass
2. Type check passes
3. Lint check passes
4. Security scan passes
5. No new warnings

---

## Review Policy

### Auto-Proceed (Low Risk)
- Formatting changes
- Documentation updates
- Test additions
- Comment improvements

### Request Review (Medium Risk)
- New features (< 100 lines)
- Bug fixes
- Refactoring within one file

### Require Approval (High Risk)
- Authentication/authorization changes
- Database schema changes
- New dependencies
- Multi-file refactoring
- Environment configuration
- CI/CD changes

---

## Terminal Policies

Refer to `.antigravity/allowlist.json` for permitted commands.

### Default Allow
- `npm run test`, `npm run lint`, `npm run build`
- `cargo test`, `cargo build`, `cargo clippy`
- `python -m pytest`, `ruff check`, `mypy`
- `git status`, `git diff`, `git log`

### Default Deny
- `rm -rf`, `sudo`, `chmod 777`
- `curl` to external URLs (except approved CDNs)
- `npm publish`, `cargo publish`
- Environment variable printing

---

## Error Handling

When errors occur:

1. **STOP** - Do not continue with failing tests
2. **DIAGNOSE** - Identify root cause
3. **FIX** - Address the specific issue
4. **VERIFY** - Confirm fix works
5. **DOCUMENT** - Note what went wrong

If stuck after 3 attempts:
- Create Artifact explaining the blocker
- Request human review
- Do NOT force a workaround

---

## References

- Project Constitution: `docs/core/CONSTITUTION.md`
- ADRs: `docs/architecture/decisions/`
- Security Guardrails: `docs/operations/SECURITY_GUARDRAILS.md`
- Stack Guidelines: `docs/stacks/`

---

*This file is the primary governance document for Antigravity agents.*
*Version: 1.0.0*
