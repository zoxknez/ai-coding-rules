# Rust Structure

> Cargo layout with explicit layers.

## Canonical Layout

```text
project/
├─ Cargo.toml
├─ README.md
├─ src/
│  ├─ main.rs
│  ├─ lib.rs
│  ├─ config.rs
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  ├─ api/
│  └─ shared/
├─ tests/
├─ benches/
└─ examples/
```

## Sources

- Cargo package layout conventions. https://doc.rust-lang.org/cargo/guide/project-layout.html
