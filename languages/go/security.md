# Go Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Nil pointer panic | Happy-path bias | Add explicit nil checks |
| Goroutine leaks | Missing cancellation | Pass context and use WaitGroup |
| SQL injection | fmt.Sprintf queries | Use parameterized queries |

## Required Controls

- Always propagate context.Context in I/O paths.
- Enforce timeouts on HTTP clients and servers.
- Use staticcheck or golangci-lint with errcheck.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Go layout](https://github.com/golang-standards/project-layout)
