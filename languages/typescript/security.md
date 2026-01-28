# TypeScript Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| XSS via dangerouslySetInnerHTML | Fast HTML rendering | Use SafeHTML with DOMPurify |
| SSR serialization injection | Naive JSON.stringify | Use framework data passing or safe serializers |
| Prototype pollution | Deep merge helpers | Use safe merge utilities and block __proto__ |
| Client/server boundary leaks | Confused component types | Use explicit server-only modules and lint rules |

## Required Controls

- No any types in domain code.
- Zod validation for all external inputs.
- No prop spreading to DOM elements.
- No manual script tag JSON injection.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Security guardrails](../../docs/operations/SECURITY_GUARDRAILS.md)
