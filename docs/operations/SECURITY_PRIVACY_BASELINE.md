# Security & Privacy Baseline

## MUST
- Never log secrets (API keys, tokens, passwords).
- Validate all external input (shape, type, range).
- Escape/sanitize where HTML/templating is involved.
- Authn ≠ authz: always check permissions per resource.
- SSRF guard: allowlist domains for outbound fetch.
- Path traversal guard: normalize + allowlist folders.
- SQL safety: parameterize queries; no string concatenation.
- File upload: size limits, MIME checks, sandboxed storage.
- Rate‑limit sensitive routes (login/reset).

## If risk exists
- Call it out in Risks/Notes.
- Propose mitigation.
