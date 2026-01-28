# Go Stack Guidelines (v1)

> **Golang patterns for agentic development**
>
> Go's simplicity helps agents, but manual error handling and nil pointers are common pitfalls.

---

## Project Structure

Follow the [golang-standards/project-layout](https://github.com/golang-standards/project-layout):

```
project/
├── cmd/                    # Main applications
│   └── server/
│       └── main.go
├── internal/               # Private application code
│   ├── domain/             # Business entities
│   ├── service/            # Business logic
│   └── repository/         # Data access
├── pkg/                    # Public library code
├── api/                    # OpenAPI/gRPC definitions
├── configs/                # Configuration files
└── scripts/                # Build/deploy scripts
```

### The `internal` Boundary

The `internal/` directory is **compiler-enforced**:
- Code inside cannot be imported by external packages
- Prevents architectural drift and spaghetti dependencies
- Agents MUST respect this boundary

---

## Error Handling

### ✅ REQUIRED Patterns

```go
// Always check errors - never _ = err
result, err := doSomething()
if err != nil {
    return fmt.Errorf("doSomething failed: %w", err)
}

// Wrap errors with context
if err := db.Query(ctx, query); err != nil {
    return fmt.Errorf("querying users: %w", err)
}

// Use sentinel errors for expected conditions
var ErrNotFound = errors.New("resource not found")

if errors.Is(err, ErrNotFound) {
    return nil, nil  // Expected case
}
```

### ❌ PROHIBITED Patterns

```go
// Never ignore errors
_ = file.Close()  // ❌ WRONG

// Never panic in library code
panic("unexpected state")  // ❌ WRONG

// Never use bare string errors in APIs
return errors.New("failed")  // ❌ Too vague
```

---

## Nil Safety

### The Nil Pointer Panic (DoS Vulnerability)

Agents often generate "happy path" code that panics on nil:

```go
// ❌ DANGEROUS: No nil checks
func GetCity(user *User) string {
    return user.Address.City  // Panics if user or Address is nil
}

// ✅ SAFE: Explicit nil checks
func GetCity(user *User) string {
    if user == nil || user.Address == nil {
        return ""
    }
    return user.Address.City
}
```

### Nil-Safe Accessor Pattern

```go
// Create safe accessor methods
func (u *User) GetAddress() *Address {
    if u == nil {
        return nil
    }
    return u.Address
}

func (a *Address) GetCity() string {
    if a == nil {
        return ""
    }
    return a.City
}

// Usage: No panic possible
city := user.GetAddress().GetCity()
```

---

## Concurrency

### Context Propagation

```go
// ✅ REQUIRED: Accept context, respect cancellation
func ProcessData(ctx context.Context, data []Item) error {
    for _, item := range data {
        select {
        case <-ctx.Done():
            return ctx.Err()  // Respect cancellation
        default:
            if err := process(ctx, item); err != nil {
                return err
            }
        }
    }
    return nil
}
```

### Goroutine Discipline

```go
// ❌ WRONG: Goroutine without cancellation
go func() {
    for {
        doWork()  // Runs forever, leaks resources
    }
}()

// ✅ CORRECT: Goroutine with context
go func(ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            return  // Clean shutdown
        default:
            doWork()
        }
    }
}(ctx)
```

### WaitGroup for Coordination

```go
// ✅ REQUIRED: Wait for goroutines to complete
var wg sync.WaitGroup

for _, item := range items {
    wg.Add(1)
    go func(i Item) {
        defer wg.Done()
        process(i)
    }(item)
}

wg.Wait()  // Block until all complete
```

---

## HTTP Handlers

### Input Validation

```go
type CreateUserRequest struct {
    Email    string `json:"email" validate:"required,email"`
    Password string `json:"password" validate:"required,min=8"`
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
    var req CreateUserRequest
    
    // Decode with limit
    r.Body = http.MaxBytesReader(w, r.Body, 1048576)  // 1MB limit
    
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid JSON", http.StatusBadRequest)
        return
    }
    
    // Validate
    if err := validate.Struct(req); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    
    // Process...
}
```

### Timeouts

```go
// ✅ REQUIRED: Set timeouts on all clients
client := &http.Client{
    Timeout: 30 * time.Second,
}

// ✅ REQUIRED: Set timeouts on servers
server := &http.Server{
    ReadTimeout:  5 * time.Second,
    WriteTimeout: 10 * time.Second,
    IdleTimeout:  120 * time.Second,
}
```

---

## Database Access

### Parameterized Queries

```go
// ❌ WRONG: SQL injection vulnerability
query := fmt.Sprintf("SELECT * FROM users WHERE email = '%s'", email)

// ✅ CORRECT: Parameterized query
query := "SELECT * FROM users WHERE email = $1"
rows, err := db.QueryContext(ctx, query, email)
```

### Connection Management

```go
// ✅ REQUIRED: Configure connection pool
db.SetMaxOpenConns(25)
db.SetMaxIdleConns(5)
db.SetConnMaxLifetime(5 * time.Minute)
db.SetConnMaxIdleTime(1 * time.Minute)
```

---

## Tooling

### Required Tools

```bash
# Format
gofmt -w .
goimports -w .

# Lint
golangci-lint run

# Static analysis
staticcheck ./...

# Nil safety
nilaway ./...  # If available
```

### golangci-lint Configuration

```yaml
# .golangci.yml
linters:
  enable:
    - errcheck       # Check error handling
    - govet          # Examine code for bugs
    - staticcheck    # Advanced static analysis
    - unused         # Find unused code
    - gosec          # Security issues
    - nilnil         # Nil check analysis
    
linters-settings:
  errcheck:
    check-blank: true  # Catch _ = err
```

---

## Agent Instructions

```markdown
When generating Go code:

1. ALWAYS handle errors explicitly
2. ALWAYS add nil checks before pointer access
3. ALWAYS pass context.Context to functions that do I/O
4. ALWAYS set timeouts on network operations
5. NEVER use panic() in library code
6. NEVER ignore context cancellation in loops
7. Use the internal/ directory for private code
```

---

*Version: 1.0.0*
