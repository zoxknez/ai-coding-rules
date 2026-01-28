---
applyTo: "**/*.{ts,js}"
---

Follow MASTER_RULES.md.

Backend/API rules:
- Input validation is required (schema or explicit checks).
- Authn ≠ authz: always verify permissions explicitly.
- Use consistent error shape (code/message/details).
- Add timeouts/retry for external calls where appropriate.
- Never log secrets (tokens/passwords).
