# Rust Stack Guidelines (v2)

## Simplicity first
- Prefer concrete types over generics unless needed.
- Keep lifetimes simple; avoid complex bounds unless justified.

## Errors
- No `unwrap()`/`expect()` in production paths.
- Use `thiserror`/custom enums for clear error types.
- Add context when propagating errors.

## Async
- Prefer `tokio` conventions if project uses it.
- Always set timeouts for network calls.
- Avoid blocking calls inside async tasks.

## Observability
- Use `tracing` where applicable.
- Keep logs structured.

## Safety
- Avoid `unsafe`.
- If `unsafe` is necessary, document invariants and add tests.

## Testing & tooling
- Unit tests for core logic.
- Integration tests for I/O boundaries.
- Use `rustfmt` + `clippy`.
- Remove dead code introduced during iterations.
