# Java Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Insecure deserialization | Java serialization defaults | Avoid Java serialization and use JSON |
| SQL injection | String concatenation | Use prepared statements or ORM |
| SSRF | Trusting URLs | Allowlist hosts and enforce timeouts |

## Required Controls

- Bean validation on DTOs.
- Disable Jackson default typing.
- Use parameterized queries only.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
