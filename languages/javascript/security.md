# JavaScript Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| eval or new Function | Shortcuts for dynamic logic | Ban dynamic code execution |
| XSS via innerHTML | Fast HTML rendering | Sanitize with DOMPurify |
| SQL injection | String concatenation | Use parameterized queries |
| SSRF | Trusting user URLs | Allowlist hosts and enforce timeouts |

## Required Controls

- Schema validation for all external input.
- CSP headers for web output.
- No secrets in code or logs.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Security guardrails](../../docs/operations/SECURITY_GUARDRAILS.md)
