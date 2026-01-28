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

## Sources Index

| Language | Structure Sources | Security Sources |
|---|---|---|
| Python | [structure.md](python/structure.md) | [security.md](python/security.md) |
| JavaScript | [structure.md](javascript/structure.md) | [security.md](javascript/security.md) |
| TypeScript | [structure.md](typescript/structure.md) | [security.md](typescript/security.md) |
| Next.js | [structure.md](nextjs/structure.md) | [security.md](nextjs/security.md) |
| Go | [structure.md](go/structure.md) | [security.md](go/security.md) |
| Rust | [structure.md](rust/structure.md) | [security.md](rust/security.md) |
| .NET | [structure.md](dotnet/structure.md) | [security.md](dotnet/security.md) |
| Java | [structure.md](java/structure.md) | [security.md](java/security.md) |
| Kotlin | [structure.md](kotlin/structure.md) | [security.md](kotlin/security.md) |
| Swift | [structure.md](swift/structure.md) | [security.md](swift/security.md) |
| PHP | [structure.md](php/structure.md) | [security.md](php/security.md) |
| Ruby | [structure.md](ruby/structure.md) | [security.md](ruby/security.md) |
| Dart | [structure.md](dart/structure.md) | [security.md](dart/security.md) |
| C | [structure.md](c/structure.md) | [security.md](c/security.md) |
| C++ | [structure.md](cpp/structure.md) | [security.md](cpp/security.md) |

## Folder Contract

Each language folder contains:

- README.md: Summary and links.
- structure.md: Canonical folder layout.
- security.md: Top agent-induced risks and mitigations.

Each structure.md includes a Sources section with authoritative references.

## How To Use

- Pick your language folder.
- Apply the structure in new projects or refactor gradually.
- Reference security.md in platform rules and ADRs.
