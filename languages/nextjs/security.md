# Next.js Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| XSS via dangerouslySetInnerHTML | Fast HTML rendering | Use SafeHTML with sanitization |
| SSR injection in script tags | Naive JSON.stringify | Use framework data passing |
| Server/client boundary leaks | Mixing components | Keep server logic out of client components |

## Required Controls

- Use server actions or route handlers for privileged operations.
- No unsafe HTML without sanitization.
- No manual script tag JSON injection.
- Keep secrets in server-only code paths.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Security guardrails](../../docs/operations/SECURITY_GUARDRAILS.md)

## Sources

- Next.js data security guide. https://nextjs.org/docs/app/guides/data-security
- OWASP Cross Site Scripting. https://owasp.org/www-community/attacks/xss/
