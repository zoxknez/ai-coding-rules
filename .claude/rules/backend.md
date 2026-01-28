---
paths:
  - "**/api/**"
  - "**/server/**"
  - "**/routes/**"
---

# Backend Rules

## API Design
- Use consistent error shape: `{ code, message, details }`
- Validate all inputs at the boundary
- Return appropriate HTTP status codes
- Document endpoints with OpenAPI/Swagger

## Security
- Authn ≠ Authz: always verify permissions
- Never log secrets
- Add timeouts for external calls
- Implement rate limiting

## Error Handling
- Catch errors at controller level
- Log with correlation IDs
- Return user-safe error messages
- Never expose stack traces to clients

## Performance
- Use pagination for list endpoints
- Implement caching where appropriate
- Add request timeouts
- Use connection pooling for databases
