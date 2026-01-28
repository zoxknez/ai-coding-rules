# .NET Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Mass assignment | Binding entities directly | Use DTOs for all inputs |
| Captive dependency | Singleton default bias | Match DI lifetimes |
| XXE | Default XmlDocument usage | Set XmlResolver = null |

## Required Controls

- Enable nullable reference types.
- Use FluentValidation for inputs.
- Use analyzers to detect DI issues.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
- [Clean Architecture](https://learn.microsoft.com/dotnet/architecture/clean-architecture/)

## Sources

- XML and entity security in .NET (XXE). https://learn.microsoft.com/dotnet/standard/security/xml-and-entity-security
- .NET secure coding guidelines. https://learn.microsoft.com/dotnet/standard/security/secure-coding-guidelines
