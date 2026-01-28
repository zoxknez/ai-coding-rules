# PHP Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Mass assignment | Shortcut with Model::create | Use fillable DTOs and guarded fields |
| SQL injection | Raw queries | Use parameterized queries or ORM |
| File upload abuse | Minimal validation | Validate MIME, size, and store outside web root |

## Required Controls

- Use form requests for validation.
- Disable eval and dynamic includes.
- No secrets in .env committed.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
