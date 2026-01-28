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

## Sources

- Rails security guide. https://guides.rubyonrails.org/security.html
- Rails strong parameters. https://guides.rubyonrails.org/action_controller_overview.html#strong-parameters
- OWASP SQL Injection. https://owasp.org/www-community/attacks/SQL_Injection
- Ruby Psych safe_load documentation. https://ruby-doc.org/stdlib-3.3.0/libdoc/psych/rdoc/Psych.html
