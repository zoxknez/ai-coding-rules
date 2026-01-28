# Kotlin Structure

> Android Clean Architecture with feature modules.

## Canonical Layout

```text
project-root/
├── app/
├── buildSrc/
├── core/
│   ├── ui/
│   └── network/
├── feature/
│   ├── login/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── home/
└── gradle/
```

## Agent Workflow

1. Define domain models in feature/*/domain.
2. Implement repository in feature/*/data.
3. Expose ViewModels in feature/*/presentation.
4. Keep shared UI in core/ui.

## Boundary Rules

- Presentation depends on domain only.
- Data depends on domain and core.
- core must not depend on features.
