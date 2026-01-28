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

## Sources

- Oracle Java secure coding guidelines. https://www.oracle.com/java/technologies/javase/seccodeguide.html
- OWASP SQL Injection. https://owasp.org/www-community/attacks/SQL_Injection
- OWASP Server Side Request Forgery. https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
