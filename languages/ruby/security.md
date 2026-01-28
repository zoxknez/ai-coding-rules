# Ruby Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Mass assignment | Permitting all params | Use strong parameters and DTOs |
| SQL injection | String interpolation | Use ActiveRecord query APIs |
| Unsafe YAML | YAML.load | Use YAML.safe_load only |

## Required Controls

- Enforce authorization with policies.
- Validate all inputs before model writes.
- No secrets in code or logs.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
