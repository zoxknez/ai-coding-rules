# Java Structure

> Layered packages with explicit boundaries.

## Canonical Layout

```text
project-root/
├── src/
│   ├── main/
│   │   ├── java/com/example/app/
│   │   │   ├── domain/
│   │   │   ├── application/
│   │   │   ├── infrastructure/
│   │   │   └── presentation/
│   │   └── resources/
│   └── test/
│       └── java/com/example/app/
└── pom.xml
```

## Agent Workflow

1. Define domain types and interfaces in domain/.
2. Implement use cases in application/.
3. Wire adapters in infrastructure/.
4. Expose controllers in presentation/.

## Boundary Rules

- domain must not depend on infrastructure.
- presentation must not bypass application.
- data mapping happens at application boundaries.
