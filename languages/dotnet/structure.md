# .NET Structure

> Clean Architecture layout for .NET 8+.

## Canonical Layout

```text
project/
├─ Project.sln
├─ src/
│  ├─ Project.Api/
│  ├─ Project.Application/
│  ├─ Project.Domain/
│  └─ Project.Infrastructure/
├─ tests/
│  ├─ Project.Api.Tests/
│  ├─ Project.Application.Tests/
│  └─ Project.Domain.Tests/
└─ README.md
```

## Sources

- Microsoft Docs: Common web application architectures (Clean Architecture layers). https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures
