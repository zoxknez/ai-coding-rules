# Dart Structure

> Flutter feature modules with clean architecture.

## Canonical Layout

```text
project-root/
├── lib/
│   ├── core/
│   │   ├── network/
│   │   ├── security/
│   │   └── utils/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   └── home/
│   └── app.dart
├── test/
└── pubspec.yaml
```

## Agent Workflow

1. Define models and interfaces in features/*/domain.
2. Implement repositories in features/*/data.
3. Build UI and state in features/*/presentation.
4. Keep shared utilities in core/.

## Boundary Rules

- presentation depends on domain only.
- data depends on domain and core.
- core must not depend on features.
