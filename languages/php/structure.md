# PHP Structure

> Layered layout with explicit validation.

## Canonical Layout

```text
project-root/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Requests/
│   │   └── Middleware/
│   ├── Domain/
│   │   ├── Entities/
│   │   └── Services/
│   ├── DTO/
│   └── Models/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
└── tests/
```

## Agent Workflow

1. Add request validation in app/Http/Requests.
2. Implement business logic in app/Domain/Services.
3. Keep controllers thin and orchestration-only.
4. Use DTOs for input and output boundaries.

## Boundary Rules

- Controllers must not call models directly.
- Domain services must not import Http layer.
- Requests validate all external input.
