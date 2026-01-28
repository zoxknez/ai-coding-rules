# Windsurf Rules - Security

> Apply when working with auth, security, or sensitive code paths.

## 🔴 Non-Negotiable

- NEVER log tokens, passwords, or API keys
- NEVER commit secrets to version control
- ALWAYS validate and sanitize user input
- ALWAYS use parameterized queries

## Authentication & Authorization

- Verify both authn AND authz
- Use constant-time comparison for secrets
- Implement rate limiting on auth endpoints
- Hash passwords with bcrypt/argon2

## Session Management

- Use httpOnly, secure, sameSite cookies
- Implement proper session invalidation
- Rotate session IDs after login

## API Security

- Validate JWT signatures and expiration
- Set appropriate CORS policies
- Use TLS for all external communication
