---
applyTo: "**/auth/**,**/security/**,**/middleware/auth*"
---

Follow MASTER_RULES.md and security_privacy.md.

Security-critical code rules:
- 🔴 NEVER log tokens, passwords, or API keys.
- 🔴 NEVER commit secrets (use env vars or secret managers).
- 🔴 ALWAYS validate and sanitize user input.
- 🔴 ALWAYS use parameterized queries (no string concatenation for SQL).
- Use constant-time comparison for secrets (crypto.timingSafeEqual).
- Implement rate limiting on auth endpoints.
- Use secure session management (httpOnly, secure, sameSite cookies).
- Hash passwords with bcrypt/argon2, never MD5/SHA1.
- Verify both authentication AND authorization.
- Set appropriate CORS policies (no wildcard in production).
- Validate JWT signatures and check expiration.
