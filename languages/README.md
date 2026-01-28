# Languages

> Machine-readable structures for each programming language.

## Goals

- Provide a canonical folder structure per language.
- Reduce context ambiguity for AI agents.
- Encode schema-first design and explicit boundaries.

## Included Languages

| Language | Folder | Focus |
|---|---|---|
| Python | [languages/python](python) | FastAPI/Django patterns, Pydantic-first schemas |
| TypeScript | [languages/typescript](typescript) | Next.js/React FSD layout |
| JavaScript | [languages/javascript](javascript) | React/Node module boundaries |
| Go | [languages/go](go) | Standard Go project layout and internal boundary |
| Rust | [languages/rust](rust) | Cargo workspaces and crate boundaries |
| .NET | [languages/dotnet](dotnet) | Clean Architecture with DDD layering |
| Java | [languages/java](java) | Modular packages and service boundaries |
| Kotlin | [languages/kotlin](kotlin) | Android Clean Architecture layout |
| Swift | [languages/swift](swift) | iOS feature modularization |
| PHP | [languages/php](php) | Laravel-style layering and DTOs |
| Ruby | [languages/ruby](ruby) | Rails-ish domain boundaries |
| Dart | [languages/dart](dart) | Flutter feature modules and state separation |
| C | [languages/c](c) | Explicit include and src boundaries |
| C++ | [languages/cpp](cpp) | Modern C++ layout with RAII |

## Folder Contract

Each language folder contains:

- README.md: Summary, purpose, and links.
- structure.md: Canonical folder and file layout.
- security.md: Top agent-induced vulnerabilities and mitigations.

## How To Use

- Pick your language folder.
- Apply the structure in new projects or refactor existing ones gradually.
- Reference security.md in platform rules and ADRs.

## How To Add Another Language

1. Create a new folder under languages/.
2. Add README.md, structure.md, and security.md.
3. Update this index table.
4. Link the new folder from docs/README.md.
