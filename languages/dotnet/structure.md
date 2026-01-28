# .NET Structure

> Clean Architecture with strict layer boundaries.

## Canonical Layout

```text
Solution.sln
├── src/
│   ├── Core/
│   │   ├── Domain/
│   │   └── Application/
│   ├── Infrastructure/
│   │   └── Data/
│   └── Presentation/
│       └── WebApi/
│           ├── Controllers/
│           └── Program.cs
└── tests/
    ├── Core.UnitTests/
    └── Infra.IntegrationTests/
```

## Agent Workflow

1. Add entities in Core/Domain.
2. Add DTOs and use cases in Core/Application.
3. Implement persistence in Infrastructure.
4. Expose endpoints in Presentation/WebApi.

## Boundary Rules

- Domain has no external dependencies.
- Application depends only on Domain.
- Infrastructure depends on Application.
- Presentation depends on Application only.
