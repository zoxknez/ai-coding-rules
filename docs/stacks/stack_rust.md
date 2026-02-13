# Rust Stack Guidelines (v2)

> **Rust patterns for agentic development**
>
> Rust's ownership model prevents entire classes of bugs, but agents frequently
> fight the borrow checker. These rules keep agents productive within Rust's guarantees.

---

## Project Structure

Follow the Cargo workspace layout:

```
project/
├── Cargo.toml                   # Workspace root
├── Cargo.lock                   # Committed for binaries
├── crates/
│   ├── app/                     # Binary crate (main)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── main.rs
│   │       ├── config.rs
│   │       └── cli.rs
│   ├── core/                    # Business logic (lib)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── domain/
│   │       ├── services/
│   │       └── errors.rs
│   ├── infra/                   # I/O, DB, HTTP (lib)
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── db/
│   │       ├── http/
│   │       └── config.rs
│   └── api/                     # HTTP handlers (lib)
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── routes/
│           └── middleware/
├── tests/                       # Integration tests
│   └── api_tests.rs
├── benches/                     # Benchmarks
└── README.md
```

### Crate Organization Rules

- **core** depends on NOTHING external (pure logic).
- **infra** depends on core — implements traits defined there.
- **api** depends on core + infra — assembles the application.
- **app** (binary) wires everything together with dependency injection.
- Agents MUST respect crate boundaries; never add cross-crate dependencies without approval.

---

## Error Handling

### REQUIRED: `thiserror` for Libraries

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("User '{0}' not found")]
    NotFound(String),

    #[error("Validation failed: {field} — {reason}")]
    Validation { field: String, reason: String },

    #[error("Database error")]
    Database(#[from] sqlx::Error),

    #[error("External service error")]
    External(#[from] reqwest::Error),

    #[error("Internal error: {0}")]
    Internal(String),
}

// Implement conversion to HTTP responses
impl AppError {
    pub fn status_code(&self) -> u16 {
        match self {
            Self::NotFound(_) => 404,
            Self::Validation { .. } => 422,
            Self::Database(_) | Self::Internal(_) => 500,
            Self::External(_) => 502,
        }
    }
}
```

### REQUIRED: `anyhow` for Applications

```rust
use anyhow::{Context, Result};

// Add context when propagating errors
fn load_config(path: &str) -> Result<Config> {
    let content = std::fs::read_to_string(path)
        .context(format!("Failed to read config from {path}"))?;

    toml::from_str(&content)
        .context("Failed to parse config TOML")
}

// Use bail! for early returns
fn validate_port(port: u16) -> Result<()> {
    if port < 1024 {
        anyhow::bail!("Port {port} is privileged; use >= 1024");
    }
    Ok(())
}
```

### PROHIBITED Patterns

```rust
// Never unwrap/expect in production paths
let user = get_user(id).unwrap();         // Panics on None
let data = parse(input).expect("valid");  // Panics on Err

// Never use panic! in library code
panic!("unexpected state");  // Crashes the process

// Never ignore Results
let _ = file.write_all(data);  // Error silently discarded
```

---

## Ownership & Lifetimes

### Keep It Simple

```rust
// Prefer owned types in structs (simpler for agents)
struct User {
    name: String,       // Owned — safe default
    email: String,
}

// Use references only when performance requires it
fn find_user<'a>(users: &'a [User], id: u64) -> Option<&'a User> {
    users.iter().find(|u| u.id == id)
}

// Clone when ownership is unclear (correctness > performance)
let name = user.name.clone();  // Safe; optimize later if needed
```

### Common Borrow Checker Patterns

```rust
// Pattern: Compute index, then mutate
// (avoids borrowing &self and &mut self simultaneously)
let idx = items.iter().position(|i| i.id == target_id);
if let Some(idx) = idx {
    items[idx].update();
}

// Pattern: Extract data before mutation
let names: Vec<String> = users.iter().map(|u| u.name.clone()).collect();
users.retain(|u| !names.contains(&u.name));

// Pattern: Use entry API for HashMap
use std::collections::HashMap;
let mut counts: HashMap<String, usize> = HashMap::new();
*counts.entry(key).or_insert(0) += 1;
```

### When Agents Get Stuck

```rust
// If the borrow checker rejects code:
// 1. Try cloning first (correctness > micro-optimization)
// 2. Extract the borrow into a separate scope with { }
// 3. Use indices instead of references
// 4. Ask: "Do I really need this reference to live so long?"
// 5. NEVER reach for unsafe as a workaround
```

---

## Generics & Traits

### Prefer Concrete Types

```rust
// Start concrete, generalize only when needed
fn send_email(to: &str, body: &str) -> Result<()> { ... }

// Generalize only when you have 2+ concrete implementations
fn send_notification(notifier: &dyn Notifier, msg: &str) -> Result<()> { ... }

trait Notifier {
    fn send(&self, message: &str) -> Result<()>;
}
```

### Trait Object vs Generic

```rust
// Use generics for performance-critical paths (monomorphized)
fn process<T: Serialize>(item: T) -> Result<String> {
    serde_json::to_string(&item).context("serialization failed")
}

// Use trait objects for flexibility / reducing compile times
fn log_all(loggers: &[Box<dyn Logger>]) {
    for logger in loggers {
        logger.flush();
    }
}
```

---

## Async (Tokio)

### REQUIRED Patterns

```rust
use tokio::time::{timeout, Duration};

// Always set timeouts for network operations
async fn fetch_data(url: &str) -> Result<String> {
    let response = timeout(
        Duration::from_secs(30),
        reqwest::get(url),
    )
    .await
    .context("Request timed out")?
    .context("Request failed")?;

    response.text().await.context("Failed to read body")
}

// Use tokio::select! for cancellation-aware operations
async fn race_fetch(url_a: &str, url_b: &str) -> Result<String> {
    tokio::select! {
        result = reqwest::get(url_a) => {
            Ok(result?.text().await?)
        }
        result = reqwest::get(url_b) => {
            Ok(result?.text().await?)
        }
    }
}

// Graceful shutdown
async fn run_server(listener: TcpListener) -> Result<()> {
    let (shutdown_tx, shutdown_rx) = tokio::sync::oneshot::channel();

    tokio::spawn(async move {
        tokio::signal::ctrl_c().await.ok();
        let _ = shutdown_tx.send(());
    });

    loop {
        tokio::select! {
            Ok((stream, _)) = listener.accept() => {
                tokio::spawn(handle_connection(stream));
            }
            _ = shutdown_rx => {
                tracing::info!("Shutting down gracefully");
                break;
            }
        }
    }
    Ok(())
}
```

### PROHIBITED Async Patterns

```rust
// Never block inside async tasks
async fn bad() {
    std::thread::sleep(Duration::from_secs(5)); // Blocks executor
    // Use: tokio::time::sleep(Duration::from_secs(5)).await;
}

// Never use blocking I/O in async context
async fn also_bad() {
    let data = std::fs::read_to_string("file.txt"); // Blocks
    // Use: tokio::fs::read_to_string("file.txt").await;
}

// Never spawn unbounded tasks without tracking
loop {
    tokio::spawn(handle(request)); // Unbounded — OOM risk
}
// Use: tokio::sync::Semaphore to limit concurrency
```

---

## HTTP (Axum)

### Route Structure

```rust
use axum::{
    extract::{Json, Path, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Router,
};

pub fn routes() -> Router<AppState> {
    Router::new()
        .route("/users", post(create_user))
        .route("/users/:id", get(get_user))
}

async fn create_user(
    State(state): State<AppState>,
    Json(payload): Json<CreateUserRequest>,
) -> Result<impl IntoResponse, AppError> {
    // Validate
    payload.validate()?;

    // Execute
    let user = state.user_service.create(payload).await?;

    Ok((StatusCode::CREATED, Json(user)))
}

async fn get_user(
    State(state): State<AppState>,
    Path(id): Path<u64>,
) -> Result<Json<UserResponse>, AppError> {
    let user = state.user_service.get_by_id(id).await?
        .ok_or_else(|| AppError::NotFound(format!("user/{id}")))?;

    Ok(Json(user.into()))
}
```

### Input Validation

```rust
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUserRequest {
    #[validate(email)]
    pub email: String,

    #[validate(length(min = 8, max = 128))]
    pub password: String,

    #[validate(length(min = 1, max = 100))]
    pub name: String,
}
```

### Error Responses

```rust
use axum::response::{IntoResponse, Response};

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let status = StatusCode::from_u16(self.status_code())
            .unwrap_or(StatusCode::INTERNAL_SERVER_ERROR);

        let body = serde_json::json!({
            "error": {
                "code": format!("{:?}", self),
                "message": self.to_string(),
            }
        });

        (status, Json(body)).into_response()
    }
}
```

---

## Database (SQLx)

### Compile-Time Checked Queries

```rust
use sqlx::PgPool;

// Queries checked at compile time against real schema
async fn get_user(pool: &PgPool, id: i64) -> Result<Option<User>> {
    let user = sqlx::query_as!(
        User,
        r#"SELECT id, email, name, created_at FROM users WHERE id = $1"#,
        id
    )
    .fetch_optional(pool)
    .await
    .context("Failed to query user")?;

    Ok(user)
}

// Transactions
async fn transfer_funds(
    pool: &PgPool,
    from: i64,
    to: i64,
    amount: i64,
) -> Result<()> {
    let mut tx = pool.begin().await?;

    sqlx::query!("UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, from)
        .execute(&mut *tx)
        .await?;

    sqlx::query!("UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, to)
        .execute(&mut *tx)
        .await?;

    tx.commit().await.context("Failed to commit transfer")?;
    Ok(())
}
```

### Connection Pool Configuration

```rust
use sqlx::postgres::PgPoolOptions;

let pool = PgPoolOptions::new()
    .max_connections(20)
    .min_connections(5)
    .acquire_timeout(Duration::from_secs(5))
    .idle_timeout(Duration::from_secs(600))
    .max_lifetime(Duration::from_secs(1800))
    .connect(&database_url)
    .await
    .context("Failed to create connection pool")?;
```

---

## Observability

### Tracing (Structured Logging)

```rust
use tracing::{info, error, instrument, warn};

// Instrument functions for automatic span creation
#[instrument(skip(pool), fields(user_id = %id))]
async fn get_user(pool: &PgPool, id: i64) -> Result<User> {
    info!("Fetching user");
    let user = query_user(pool, id).await?;
    info!(email = %user.email, "User found");
    Ok(user)
}

// Structured error logging
#[instrument(skip(pool))]
async fn process_order(pool: &PgPool, order_id: i64) -> Result<()> {
    match execute_order(pool, order_id).await {
        Ok(result) => {
            info!(order_id, status = "completed", "Order processed");
            Ok(result)
        }
        Err(e) => {
            error!(order_id, error = %e, "Order processing failed");
            Err(e)
        }
    }
}
```

### Tracing Initialization

```rust
use tracing_subscriber::{fmt, EnvFilter, layer::SubscriberExt, util::SubscriberInitExt};

fn init_tracing() {
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()))
        .with(fmt::layer().json())  // JSON output for production
        .init();
}
```

---

## Unsafe Code

### Rules

1. **Avoid `unsafe`** — if safe Rust can solve it, use safe Rust.
2. If `unsafe` is necessary:
   - Document **every invariant** that must hold.
   - Wrap in a safe API with `#[doc(hidden)]` internal unsafe.
   - Add exhaustive tests including edge cases.
   - Get explicit code review approval.

```rust
// If unsafe is truly needed, document WHY and WHAT invariants hold
/// SAFETY: `ptr` must be a valid, aligned pointer to an initialized `T`.
/// The caller guarantees the pointer is not aliased mutably.
unsafe fn deref_raw<T>(ptr: *const T) -> &T {
    &*ptr
}
```

---

## Testing

### Test Organization

```rust
// Unit tests — in the same file
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_email() {
        assert!(validate_email("user@example.com").is_ok());
        assert!(validate_email("invalid").is_err());
        assert!(validate_email("").is_err());
    }

    #[tokio::test]
    async fn test_async_fetch() {
        let result = fetch_data("https://httpbin.org/get").await;
        assert!(result.is_ok());
    }
}

// Integration tests — in tests/ directory
// tests/api_tests.rs
use your_crate::create_app;

#[tokio::test]
async fn test_create_user_endpoint() {
    let app = create_app().await;
    let response = app
        .oneshot(Request::builder()
            .method("POST")
            .uri("/users")
            .header("content-type", "application/json")
            .body(Body::from(r#"{"email":"test@example.com","name":"Test"}"#))
            .unwrap())
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::CREATED);
}
```

### Property-Based Testing

```rust
use proptest::prelude::*;

proptest! {
    #[test]
    fn test_parse_never_panics(s in "\\PC*") {
        // Should never panic, regardless of input
        let _ = parse_input(&s);
    }

    #[test]
    fn test_roundtrip_serialization(user in arb_user()) {
        let json = serde_json::to_string(&user).unwrap();
        let deserialized: User = serde_json::from_str(&json).unwrap();
        assert_eq!(user, deserialized);
    }
}
```

---

## Tooling

### Required Tools

```bash
# Format
cargo fmt --all

# Lint (deny warnings in CI)
cargo clippy --all-targets --all-features -- -D warnings

# Test
cargo test --all-features

# Security audit
cargo audit

# Unused dependencies
cargo machete

# Code coverage
cargo tarpaulin --out Html
```

### Clippy Configuration

```toml
# clippy.toml
cognitive-complexity-threshold = 15
too-many-arguments-threshold = 5

# Cargo.toml
[lints.clippy]
unwrap_used = "deny"
expect_used = "warn"
panic = "deny"
todo = "warn"
dbg_macro = "deny"
```

---

## Agent Instructions

```markdown
When generating Rust code:

1. ALWAYS handle Results explicitly (no unwrap/expect in production)
2. ALWAYS use thiserror for library errors, anyhow for applications
3. ALWAYS set timeouts on network operations
4. ALWAYS use tracing for structured logging
5. NEVER use unsafe unless absolutely necessary and documented
6. NEVER block inside async tasks (use tokio equivalents)
7. Prefer owned types (String, Vec) over references when ownership is unclear
8. Clone when stuck on borrow checker — optimize later
9. Use cargo clippy and cargo fmt before submitting
```

---

*Version: 2.0.0*
