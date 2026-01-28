# Kotlin Security

> Common agent-induced vulnerabilities and mitigations.

## High-Risk Patterns

| Risk | Why Agents Do It | Mitigation |
|---|---|---|
| Intent hijacking | Implicit intents | Use explicit intents with setPackage |
| WebView RCE | addJavascriptInterface | Use only trusted local content |
| Insecure storage | SharedPreferences | Use EncryptedSharedPreferences |

## Required Controls

- Network security config with cleartext disabled.
- File sharing via FileProvider only.
- No exported components without intent filters.

## References

- [Android security](https://developer.android.com/training/security)
- [Agent vulnerabilities](../../docs/security/AGENT_VULNERABILITIES.md)

## Sources

- Android security best practices. https://developer.android.com/topic/security/best-practices
- WebView addJavascriptInterface risk notes. https://developer.android.com/reference/android/webkit/WebView#addJavascriptInterface(java.lang.Object,%20java.lang.String)
