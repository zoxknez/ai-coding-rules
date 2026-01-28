---
paths:
  - "**/auth/**"
  - "**/security/**"
  - "**/middleware/auth*"
---

# Security Rules

🔴 **Non-negotiable security requirements for this project.**

## Secrets Management
- NEVER log tokens, passwords, or API keys
- NEVER commit secrets to version control
- Use environment variables or secret managers
- Prefix placeholder values with `EXAMPLE_`

## Input Validation
- ALWAYS validate and sanitize user input
- Use schema validation (Zod, Joi, class-validator)
- Reject invalid input early

## Authentication & Authorization
- Verify both authn AND authz
- Use constant-time comparison for secrets
- Implement rate limiting on auth endpoints
- Use secure session management

## Database
- ALWAYS use parameterized queries
- NEVER concatenate user input into SQL
- Apply principle of least privilege

## Cryptography
- Hash passwords with bcrypt/argon2 (NOT MD5/SHA1)
- Validate JWT signatures and check expiration
- Use TLS for all external communication
