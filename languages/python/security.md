# Python Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Insecure deserialization (pickle) | Short API, common in tutorials | Ban pickle and use JSON or msgpack |
| SQL injection via f-strings | Convenience and readability | Use parameterized queries or ORM |
| Path traversal | Direct string concatenation | Resolve paths and enforce base directory |
| Unsafe YAML | yaml.load in old examples | Use yaml.safe_load only |

## Required Controls

- Pydantic validation for all external input.
- Parameterized queries or ORM only.
- Explicit allowlists for file paths and uploads.
- bandit with B301 enabled for pickle detection.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Security guardrails](../../docs/operations/SECURITY_GUARDRAILS.md)

## Sources

- Python pickle module security notes. https://docs.python.org/3/library/pickle.html
- OWASP SQL Injection. https://owasp.org/www-community/attacks/SQL_Injection
- OWASP Path Traversal. https://owasp.org/www-community/attacks/Path_Traversal
- PyYAML safe loading guidance. https://pyyaml.org/wiki/PyYAMLDocumentation
