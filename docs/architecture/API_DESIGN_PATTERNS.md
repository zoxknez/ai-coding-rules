# API Design Patterns (v1)

> **REST, GraphQL, and gRPC conventions for AI-assisted development**
>
> APIs are contracts. Agents must generate consistent, versioned, well-documented
> endpoints that follow established patterns — never invent new conventions.

---

## REST API Design

### URL Structure

```
# Resources are nouns (plural), never verbs
GET    /api/v1/users              # List users
POST   /api/v1/users              # Create user
GET    /api/v1/users/{id}         # Get user
PUT    /api/v1/users/{id}         # Full update
PATCH  /api/v1/users/{id}         # Partial update
DELETE /api/v1/users/{id}         # Delete user

# Nested resources for clear ownership
GET    /api/v1/users/{id}/orders           # User's orders
POST   /api/v1/users/{id}/orders           # Create order for user
GET    /api/v1/users/{id}/orders/{orderId} # Specific order

# Actions as sub-resources (when CRUD doesn't fit)
POST   /api/v1/users/{id}/activate         # State change
POST   /api/v1/orders/{id}/cancel          # Action
POST   /api/v1/reports/generate            # Process trigger
```

### PROHIBITED URL Patterns

```
# Never use verbs in resource URLs
GET  /api/v1/getUsers          # Wrong
POST /api/v1/createUser        # Wrong
POST /api/v1/deleteUser/{id}   # Wrong

# Never use query params for resource identity
GET /api/v1/users?id=123       # Wrong for single resource

# Never mix singular and plural inconsistently
GET /api/v1/user/123           # Wrong (should be /users/123)
```

---

### HTTP Status Codes

| Code | Usage | When |
|------|-------|------|
| `200 OK` | Success with body | GET, PUT, PATCH with response |
| `201 Created` | Resource created | POST that creates a resource |
| `204 No Content` | Success, no body | DELETE, PUT with no response body |
| `400 Bad Request` | Malformed request | Invalid JSON, missing fields |
| `401 Unauthorized` | Not authenticated | Missing or invalid token |
| `403 Forbidden` | Not authorized | Valid token, insufficient permissions |
| `404 Not Found` | Resource missing | ID doesn't exist |
| `409 Conflict` | State conflict | Duplicate email, version mismatch |
| `422 Unprocessable` | Validation failure | Valid JSON, business rule violation |
| `429 Too Many Requests` | Rate limited | Exceeded request quota |
| `500 Internal Server Error` | Server bug | Unhandled exception |
| `502 Bad Gateway` | Upstream failure | Third-party service down |
| `503 Service Unavailable` | Temporarily down | Maintenance, overloaded |

### Error Response Envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address",
        "value": "not-an-email"
      },
      {
        "field": "age",
        "message": "Must be between 13 and 150",
        "value": -5
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

### Success Response Envelope

```json
// Single resource
{
  "data": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "Jane Doe",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}

// Collection with pagination
{
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Pagination

### Offset-Based (Simple)

```
GET /api/v1/users?page=2&pageSize=20
GET /api/v1/users?offset=40&limit=20
```

Best for: admin panels, small datasets, when total count is needed.
Drawback: performance degrades on large offsets, inconsistent with concurrent writes.

### Cursor-Based (Scalable)

```
GET /api/v1/users?cursor=eyJpZCI6MTAwfQ&limit=20
```

```json
{
  "data": [...],
  "pagination": {
    "nextCursor": "eyJpZCI6MTIwfQ",
    "hasNext": true
  }
}
```

Best for: infinite scroll, real-time feeds, large datasets.
Rule: cursor MUST be opaque (base64-encoded); never expose internal IDs directly.

### Keyset-Based (Performance)

```
GET /api/v1/users?after_id=100&limit=20
```

Best for: sorted, sequential data with stable ordering.

---

## Filtering & Sorting

### Query Parameters

```
# Filtering
GET /api/v1/users?status=active&role=admin
GET /api/v1/orders?created_after=2025-01-01&created_before=2025-02-01
GET /api/v1/products?price_min=10&price_max=100

# Sorting
GET /api/v1/users?sort=created_at:desc
GET /api/v1/users?sort=name:asc,created_at:desc

# Field selection (sparse fieldsets)
GET /api/v1/users?fields=id,name,email

# Search
GET /api/v1/users?q=jane+doe
```

### Rules

- ALWAYS validate and whitelist sortable/filterable fields.
- NEVER allow arbitrary SQL-like filters from clients.
- ALWAYS set maximum page size (e.g., 100).
- ALWAYS set default page size (e.g., 20).

---

## Versioning

### URL Versioning (Recommended)

```
/api/v1/users
/api/v2/users
```

- Simple, explicit, easy to route.
- Each version is a separate controller/handler set.

### Header Versioning (Alternative)

```
Accept: application/vnd.myapp.v2+json
```

### Versioning Rules

1. **NEVER break existing clients** — additive changes only within a version.
2. New optional fields are backward-compatible.
3. Removing or renaming fields requires a new version.
4. Support at most **2 versions** simultaneously.
5. Announce deprecation with `Sunset` header and minimum 6-month window.

```
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Deprecation: true
Link: </api/v2/users>; rel="successor-version"
```

---

## Authentication & Authorization

### Token Patterns

```
# Bearer token in Authorization header
Authorization: Bearer eyJhbGciOiJSUzI1NiJ9...

# API key (for service-to-service)
X-API-Key: sk_live_abc123...
```

### Authorization Rules

1. ALWAYS check permissions per-resource, not just per-route.
2. NEVER rely solely on client-side role checks.
3. Use middleware/guards for authentication.
4. Use per-handler checks for authorization.
5. Return `401` for missing/invalid auth, `403` for insufficient permissions.
6. NEVER leak information in auth errors ("user not found" vs "wrong password").

---

## Rate Limiting

### Response Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1672531200
Retry-After: 60
```

### Strategy by Endpoint Type

| Endpoint Type | Window | Limit | Algorithm |
|---------------|--------|-------|-----------|
| Public read | 1 min | 60 | Sliding window |
| Authenticated read | 1 min | 120 | Token bucket |
| Write operations | 1 min | 30 | Fixed window |
| Auth (login/reset) | 15 min | 5 | Fixed window |
| Webhook receivers | 1 min | 100 | Sliding window |

---

## GraphQL Patterns

### Schema Design

```graphql
type Query {
  user(id: ID!): User
  users(filter: UserFilter, pagination: PaginationInput): UserConnection!
}

type Mutation {
  createUser(input: CreateUserInput!): CreateUserPayload!
  updateUser(id: ID!, input: UpdateUserInput!): UpdateUserPayload!
}

# Use Input types for mutations
input CreateUserInput {
  email: String!
  name: String!
  role: Role = USER
}

# Use Payload types for mutation responses
type CreateUserPayload {
  user: User
  errors: [UserError!]
}

# Connection pattern for pagination
type UserConnection {
  edges: [UserEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}
```

### GraphQL Rules

1. **Depth limiting** — set max query depth (e.g., 5) to prevent abuse.
2. **Cost analysis** — assign cost to fields, reject expensive queries.
3. **N+1 prevention** — use DataLoader for batching.
4. **No sensitive data in introspection** — disable in production or limit.
5. **Input validation** — validate at resolver level, not just schema.

---

## gRPC Patterns

### Proto File Design

```protobuf
syntax = "proto3";
package myapp.user.v1;

service UserService {
  rpc GetUser(GetUserRequest) returns (GetUserResponse);
  rpc ListUsers(ListUsersRequest) returns (ListUsersResponse);
  rpc CreateUser(CreateUserRequest) returns (CreateUserResponse);
}

message GetUserRequest {
  string id = 1;
}

message GetUserResponse {
  User user = 1;
}

message ListUsersRequest {
  int32 page_size = 1;
  string page_token = 2;
  string filter = 3;
}

message ListUsersResponse {
  repeated User users = 1;
  string next_page_token = 2;
  int32 total_count = 3;
}
```

### gRPC Rules

1. ALWAYS version your packages (`v1`, `v2`).
2. NEVER change field numbers after deployment.
3. Use `google.rpc.Status` for error details.
4. Set deadlines on every RPC call.
5. Use streaming only when actually needed.

---

## Cross-Cutting Concerns

### Request/Response Headers

```
# REQUIRED on every response
Content-Type: application/json
X-Request-Id: req_abc123        # For tracing
Cache-Control: no-store          # Or appropriate cache directive

# REQUIRED for CORS
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400

# Security headers
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

### Idempotency

```
# Client provides idempotency key for non-idempotent operations
POST /api/v1/payments
Idempotency-Key: idem_abc123

# Server behavior:
# 1. Check if key exists in store
# 2. If yes: return cached response (same status + body)
# 3. If no: process request, store response, return it
# 4. Key expires after 24 hours
```

### HATEOAS (When Applicable)

```json
{
  "data": {
    "id": "usr_123",
    "name": "Jane Doe",
    "links": {
      "self": "/api/v1/users/usr_123",
      "orders": "/api/v1/users/usr_123/orders",
      "avatar": "/api/v1/users/usr_123/avatar"
    }
  }
}
```

---

## API Documentation

### OpenAPI (Swagger) Requirements

1. EVERY endpoint must have a description.
2. EVERY parameter must have type, description, and example.
3. EVERY response code must be documented with example body.
4. Security schemes must be defined.
5. Keep spec in sync with implementation (generate from code or validate in CI).

---

## Agent Instructions

```markdown
When generating API code:

1. ALWAYS use plural nouns for resource URLs
2. ALWAYS return consistent error envelopes
3. ALWAYS validate and sanitize all input
4. ALWAYS include pagination for list endpoints
5. ALWAYS use appropriate HTTP status codes
6. NEVER expose internal IDs or database structure
7. NEVER break backward compatibility within a version
8. NEVER allow unbounded queries (always limit/paginate)
9. Match existing API conventions in the project
```

---

*Version: 1.0.0*
