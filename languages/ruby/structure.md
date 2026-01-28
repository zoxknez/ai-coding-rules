# Ruby Structure

> Rails-like layout with clear service boundaries.

## Canonical Layout

```text
project-root/
├── app/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   ├── policies/
│   └── serializers/
├── config/
├── db/
│   └── migrations/
└── spec/
```

## Agent Workflow

1. Add validation and strong params in controllers.
2. Implement business logic in services.
3. Use policies for authorization.
4. Keep models focused on persistence only.

## Boundary Rules

- Controllers must not implement business rules.
- Services must not render HTTP responses.
- Policies must be enforced before mutations.
