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

## Sources

- Go modules layout guidance (cmd and internal patterns). https://go.dev/doc/modules/layout

