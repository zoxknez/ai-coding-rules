---
description: "USE WHEN: implementing API endpoints or consuming external APIs"
globs: ["**/api/**", "**/routes/**", "**/controllers/**"]
alwaysApply: false
priority: 74
---

# API Design Rules

## RESTful Conventions
- GET: Retrieve resources (idempotent)
- POST: Create resources
- PUT: Replace resources (idempotent)
- PATCH: Partial update
- DELETE: Remove resources (idempotent)

## URL Design
- Use nouns for resources: `/users`, `/orders`
- Use hyphens for readability: `/order-items`
- Nest for relationships: `/users/:id/orders`
- Version your API: `/v1/users`

## Request/Response
```typescript
// Consistent error shape
interface ApiError {
  code: string;        // "USER_NOT_FOUND"
  message: string;     // User-friendly message
  details?: unknown;   // Additional context
}

// Paginated response
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
```

## Status Codes
- 200: Success
- 201: Created
- 204: No Content (DELETE)
- 400: Bad Request (validation)
- 401: Unauthorized (authn)
- 403: Forbidden (authz)
- 404: Not Found
- 422: Unprocessable Entity
- 500: Internal Server Error

## Best Practices
- Validate inputs at the boundary
- Use rate limiting
- Add request IDs for tracing
- Document with OpenAPI/Swagger
