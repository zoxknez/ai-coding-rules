# Next.js Security# Next.js Security

















- Use server actions or route handlers for privileged operations.- No unsafe HTML without sanitization.- No manual script tag JSON injection.## Required Controls| Server/client boundary leaks | Mixing components | Keep server logic out of client components || SSR injection in script tags | Naive JSON.stringify | Use framework data passing || XSS via dangerouslySetInnerHTML | Fast HTML rendering | Use SafeHTML with sanitization ||---|---|---|| Risk | Why Agents Do It | Mitigation |## High-Risk Patterns> Top agent-induced risks and mitigations.
> Top agent-induced risks and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| XSS via dangerouslySetInnerHTML | Fast HTML rendering | Use SafeHTML with sanitization |
| SSR injection in script tags | Naive JSON.stringify | Use framework data passing |
| Server/client boundary leaks | Mixing components | Keep server logic out of client components |

## Required Controls

- No manual script tag JSON injection.
- No unsafe HTML without sanitization.
- Use server actions or route handlers for privileged operations.
