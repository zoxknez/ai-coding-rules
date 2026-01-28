# Backend Stack Guidelines (Node.js/Express/Nest) (v2)

## API design
- Be explicit about request/response shapes.
- Use consistent status codes and error format.
- Support pagination/filtering where relevant (and consistent with existing patterns).

## Validation
- Validate inputs (schema-based preferred).
- Validate auth context (user/roles/tenant) explicitly.

## Auth & security
- Never assume permissions.
- Apply rate limiting where sensitive endpoints exist (login, password reset).
- Use timeouts for outbound calls.
- Avoid leaking internal errors to clients; log internally.

## Error handling
- Standardize error envelope:
  - `code`, `message`, `details` (optional)
- Distinguish user errors (4xx) vs server errors (5xx).

## Observability
- Structured logs.
- Never log secrets or full tokens.
- Include request id / correlation id when possible.

## Idempotency & retries
- For mutation endpoints, consider idempotency keys if retries are likely.
- Avoid double-charging/double-writing.

## Performance
- Avoid N+1 DB queries.
- Use batching/caching if it exists in the repo.
- Keep handlers thin; move logic to services only when reused.

## Minimal diff rule
- Do not reorganize layers or add new frameworks without approval.
