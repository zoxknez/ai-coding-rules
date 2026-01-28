# Swift Structure

> SwiftUI app with feature modularization.

## Canonical Layout

```text
Project.xcodeproj
├── App/
│   └── AppEntry.swift
├── Core/
│   ├── Network/
│   ├── Security/
│   └── DesignSystem/
├── Features/
│   ├── Auth/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Services/
│   └── Home/
└── Resources/
```

## Agent Workflow

1. Define API contracts in Core/Network.
2. Implement services in Features/*/Services.
3. Bind state in Features/*/ViewModels.
4. Keep Views UI-only with no direct API calls.

## Boundary Rules

- Views read from ViewModels only.
- Services must not depend on Views.
- Core is dependency-free from Features.
