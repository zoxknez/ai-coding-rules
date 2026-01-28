# Rust Structure

> Cargo workspace layout with crate boundaries.

## Canonical Layout

```text
workspace-root/
├── Cargo.toml
├── crates/
│   ├── core/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   ├── api_server/
│   │   ├── src/main.rs
│   │   └── Cargo.toml
│   ├── storage/
│   │   ├── src/lib.rs
│   │   └── Cargo.toml
│   └── utils/
│       ├── src/lib.rs
│       └── Cargo.toml
└── scripts/
```

## Agent Workflow

1. Define domain types in crates/core.
2. Implement persistence in crates/storage.
3. Expose transport in crates/api_server.
4. Keep utils minimal and reusable.

## Boundary Rules

- core must not depend on storage or api_server.
- storage must not depend on api_server.
- api_server depends on core and storage only.
