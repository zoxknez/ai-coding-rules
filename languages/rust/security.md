# Rust Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| unsafe blocks | Borrow checker frustration | Ban unsafe without explicit approval |
| unwrap in production | Shorter code paths | Use Result and proper error handling |
| SQL injection | Raw string queries | Use query macros or parameterized APIs |

## Required Controls

- clippy and rustfmt in CI.
- cargo-geiger to track unsafe usage.
- No panics in library code.

## References

- [Rust workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html)
- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)
