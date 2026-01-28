# Languages

> Machine-readable folder blueprints per language.

## Goals

- Provide a canonical structure per language.
- Reduce context ambiguity for AI agents.
- Keep layouts copy-paste ready.

## Included Languages

| Language | Folder | Focus |
|---|---|---|
| Python | [languages/python](python) | src layout with domain and application |
| JavaScript | [languages/javascript](javascript) | Node.js service layout |
| TypeScript | [languages/typescript](typescript) | Backend and full-stack layout |
| Next.js | [languages/nextjs](nextjs) | App Router 2026 layout |
| Go | [languages/go](go) | cmd + internal layout |
| Rust | [languages/rust](rust) | Cargo layout |
| .NET | [languages/dotnet](dotnet) | Clean Architecture layout |
| Java | [languages/java](java) | Maven/Gradle package layout |
| Kotlin | [languages/kotlin](kotlin) | JVM layout with layers |
| Swift | [languages/swift](swift) | SPM layout |
| PHP | [languages/php](php) | Laravel-style layout |
| Ruby | [languages/ruby](ruby) | Gem layout |
| Dart | [languages/dart](dart) | Flutter layout |
| C | [languages/c](c) | include/src layout |
| C++ | [languages/cpp](cpp) | CMake layout |

## Folder Contract

Each language folder contains:

- README.md: Summary and links.
- structure.md: Canonical folder layout.
- security.md: Top agent-induced risks and mitigations.

## How To Use

- Pick your language folder.
- Apply the structure in new projects or refactor gradually.
- Reference security.md in platform rules and ADRs.
