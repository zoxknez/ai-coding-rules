# 🟢 Quality

> Code review, quality gates, and evaluation metrics.

## Files

| File | Purpose |
|------|---------|
| [quality_control.md](quality_control.md) | Review gates |
| [code_review_rubric.md](code_review_rubric.md) | PR checklist |
| [evaluation_benchmarks.md](evaluation_benchmarks.md) | Measuring AI effectiveness |
| [MONOREPO_RULES.md](MONOREPO_RULES.md) | Monorepo patterns |
| [testing_strategy.md](testing_strategy.md) | Testing pyramid, TDD, coverage |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | WCAG compliance, A11Y patterns |
| [REFACT_METHODOLOGY.md](REFACT_METHODOLOGY.md) | R.E.F.A.C.T. refactoring method |
| [DATA_VALIDATION_PATTERNS.md](DATA_VALIDATION_PATTERNS.md) | Input validation, sanitization, schemas |
| [NAMING_CONVENTIONS.md](NAMING_CONVENTIONS.md) | Naming rules across languages |

## Code Review Process

### AI-Assisted Review
1. AI does first pass (use `/skill:code-review`)
2. Human reviews AI suggestions
3. Focus human attention on security, architecture

### Review Checklist
- [ ] Tests pass
- [ ] No security issues
- [ ] Follows patterns
- [ ] Documented
- [ ] Minimal diff

### Quality Gates
| Gate | When | What |
|------|------|------|
| Pre-commit | Before commit | Lint, format, secrets scan |
| PR | Before merge | Tests, review, coverage |
| Deploy | Before prod | Security audit, performance |

## Metrics

Track AI coding effectiveness:
- **Acceptance rate** — % of AI suggestions accepted
- **Fix rate** — % of AI code requiring fixes
- **Coverage delta** — Test coverage change
- **Review time** — Time to approve PRs

See [evaluation_benchmarks.md](evaluation_benchmarks.md).
