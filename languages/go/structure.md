# Go Structure

> Standard Go project layout with internal fortress.

## Canonical Layout

```text
project-root/
├── cmd/
│   └── api-server/
│       └── main.go
# Go Structure

> cmd + internal layout with explicit layers.

## Canonical Layout

```text
project/
├─ go.mod
├─ README.md
├─ cmd/
│  └─ app/
│     └─ main.go
├─ internal/
│  ├─ config/
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  ├─ api/
│  │  └─ handlers/
│  └─ shared/
├─ pkg/
└─ tests/
```

