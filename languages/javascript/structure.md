# JavaScript Structure

> Modular layout for API and web projects.

## Canonical Layout

```text
project-root/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── schemas/
│   ├── models/
│   ├── middleware/
│   └── index.js
├── tests/
└── package.json
```

## Agent Workflow

1. Define request/response schemas in src/schemas.
2. Implement business logic in src/services.
3. Keep controllers thin and call services.
4. Route files only compose controllers.

## Boundary Rules

- Controllers must not access database directly.
- Services must not import routes.
- Schemas must not import models.
