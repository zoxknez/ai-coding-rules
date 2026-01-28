# Python Structure

> Interface-first layout with schema-first workflow.

## Canonical Layout

```text
project-root/
├── pyproject.toml
├── src/
│   └── app/
│       ├── api/
│       │   ├── v1/
│       │   │   ├── endpoints/
│       │   │   └── router.py
│       │   └── dependencies.py
│       ├── core/
│       │   ├── config.py
│       │   └── security.py
│       ├── schemas/
│       │   ├── user.py
│       │   └── item.py
│       ├── services/
│       │   └── user_service.py
│       ├── models/
│       │   └── user.py
│       └── main.py
└── tests/
```

## Agent Workflow

1. Define schemas in src/app/schemas first.
2. Add service methods in src/app/services.
3. Implement API endpoints in src/app/api.
4. Wire dependencies in src/app/api/dependencies.py.

## Boundary Rules

- Endpoints must be thin and call services.
- Services must not import API modules.
- Schemas must not import ORM models.
