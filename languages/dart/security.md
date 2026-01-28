# Dart Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Secrets in assets | Convenience | Store secrets in secure storage |
| Insecure storage | SharedPreferences | Use flutter_secure_storage |
| Unsafe deep links | Over-trusting URLs | Validate schemes and hosts |

## Required Controls

- Use HTTPS and certificate pinning where applicable.
- Do not log tokens or PII.
- Validate all external input.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
