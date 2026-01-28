# C++ Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Buffer overflow | Legacy string APIs | Use std::string and bounds checks |
| Dangling references | Lifetime confusion | Use RAII and smart pointers |
| Integer overflow | Implicit conversions | Use safe casts and bounds checks |

## Required Controls

- Enable sanitizers (ASan, UBSan, TSan).
- Prefer std::span and safe containers.
- Compile with -Wall -Wextra -Werror.

## References

- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
