# Swift Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Secrets in UserDefaults | One-line API | Use Keychain services |
| Missing certificate pinning | Default URLSession | Pin certificates for sensitive APIs |
| Unsafe deep links | Over-trusting URLs | Validate host and path |

## Required Controls

- Use Keychain for all tokens and credentials.
- Enforce ATS and HTTPS only.
- Avoid storing PII in logs.

## References

- [Keychain services](https://developer.apple.com/documentation/security/keychain-services)
- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)

## Sources

- Apple Platform Security guide. https://support.apple.com/guide/security/welcome/web
- App Transport Security (ATS) configuration. https://developer.apple.com/documentation/bundleresources/information_property_list/nsapptransportsecurity
