# Go Structure

> Standard Go project layout with internal fortress.

## Canonical Layout

```text
project-root/
├── cmd/
│   └── api-server/
│       └── main.go
├── internal/
│   ├── domain/
│   │   ├── user.go
│   │   └── repository.go
│   ├── handler/
│   │   └── user_handler.go
│   └── service/
│       └── user_service.go
├── pkg/
│   ├── logger/
│   └── validator/
├── migrations/
├── configs/
└── go.mod
```

## Agent Workflow

1. Define interfaces in internal/domain.
2. Implement business logic in internal/service.
3. Expose transport in internal/handler.
4. Wire dependencies in cmd/*/main.go.

## Boundary Rules

- internal/ is private and must not leak to external packages.
- pkg/ must be stable and reusable.
- cmd/ must contain minimal glue code only.
