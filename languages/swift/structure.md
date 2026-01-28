# Swift Structure

> Swift Package Manager layout.

## Canonical Layout

```text
project/
├─ Package.swift
├─ README.md
├─ Sources/
│  └─ App/
│     ├─ App.swift
│     ├─ Domain/
│     ├─ Application/
│     ├─ Infrastructure/
│     ├─ Shared/
│     └─ Resources/
└─ Tests/
   └─ AppTests/
```

## Notes

- SwiftPM targets default to Sources/TargetName and Tests/TargetNameTests.
- Resources belong inside the target folder (for example, Sources/App/Resources).

## Sources

- Swift Package Manager docs (targets and resource placement). https://docs.swift.org/package-manager/PackageDescription/PackageDescription.html
