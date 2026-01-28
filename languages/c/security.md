# C Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Buffer overflow | Unsafe string APIs | Use bounded functions and length checks |
| Use-after-free | Manual memory management | Clear ownership and free paths |
| Format string bugs | printf with user input | Use fixed format strings |

## Required Controls

- Enable compiler warnings and treat as errors.
- Use sanitizers in CI (ASan, UBSan).
- Avoid strcpy, strcat, gets.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
