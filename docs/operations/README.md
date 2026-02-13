# ⚪ Operations

> Security, incident response, team processes, and tooling.

## Files

| File | Purpose |
|------|---------|
| [security_privacy.md](security_privacy.md) | Security guardrails |
| [SECURITY_PRIVACY_BASELINE.md](SECURITY_PRIVACY_BASELINE.md) | Security baseline |
| [incident_response.md](incident_response.md) | Incident response playbook (expanded v2) |
| [team_workflows.md](team_workflows.md) | PR workflow, reviews, knowledge sharing (expanded v2) |
| [tool_integration.md](tool_integration.md) | Toolchain loop, IDE, CI gates (expanded v2) |
| [context_management.md](context_management.md) | How to pack context |
| [ANTI_SLOP_GUARDRAILS.md](ANTI_SLOP_GUARDRAILS.md) | Prevent AI slop (expanded v2) |
| [OBSERVABILITY.md](OBSERVABILITY.md) | Logging, metrics, tracing, alerting |
| [CI_CD_PIPELINE.md](CI_CD_PIPELINE.md) | CI/CD pipeline design and deployment |
| [ERROR_HANDLING.md](ERROR_HANDLING.md) | Error classification, retry, circuit breaker |
| [SECURITY_GUARDRAILS.md](SECURITY_GUARDRAILS.md) | Security guardrails |

## Security Priority

### 🔴 Critical (STRICT Mode)
These rules cannot be bypassed:
- No hardcoded secrets
- SQL injection prevention
- Auth on protected routes
- Input validation

See [security_privacy.md](security_privacy.md) for details.

### 🟡 Incident Response
When AI causes issues:
1. Identify scope
2. Rollback if needed
3. Document incident
4. Update rules to prevent recurrence

See [incident_response.md](incident_response.md).

## Team Integration

### CI/CD
- Pre-commit hooks for secret scanning
- Automated testing before merge
- Rule sync verification in CI

### Code Review
- Use AI for first pass
- Human review for security-sensitive code
- Follow [code_review_rubric.md](../quality/code_review_rubric.md)
