# Naming Conventions (v1)

> **Consistent naming is the cheapest readability improvement**
>
> When AI agents generate code, naming inconsistencies compound rapidly.
> These conventions prevent naming drift and ensure generated code
> blends seamlessly with existing codebases.

---

## Universal Principles

### Golden Rule
> **Match the existing codebase.** If the project uses `camelCase`, you use `camelCase`.
> These defaults apply only when no convention exists yet.

### Naming Quality Checklist

| Principle | Rule | Example |
|-----------|------|---------|
| Descriptive | Name reveals intent | `getUserById` not `getData` |
| Pronounceable | Can say it in code review | `customerAddress` not `cstmrAddr` |
| Searchable | Easy to grep/find | `MAX_RETRY_COUNT` not `MRC` |
| No encoding | No type in name | `users` not `usersList` or `arrUsers` |
| No abbreviations | Spell it out (mostly) | `configuration` not `cfg` |
| Consistent | Same concept = same name | Don't mix `fetch`/`get`/`retrieve` |

### Allowed Abbreviations

These abbreviations are universally understood and acceptable:

```
id, url, api, db, io, http, html, css, json, xml, sql,
ui, ux, os, env, config, auth, admin, err, msg, req, res,
ctx, fn, arg, param, src, dst, tmp, max, min, len, num, idx
```

---

## Language-Specific Conventions

### TypeScript / JavaScript

```typescript
// Variables and functions: camelCase
const userName = "Jane";
function getUserById(id: string): User { ... }
const handleSubmit = async (data: FormData) => { ... };

// Classes and types: PascalCase
class UserService { ... }
interface CreateUserRequest { ... }
type UserRole = "admin" | "user";

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = "/api/v1";
const DEFAULT_PAGE_SIZE = 20;

// Enums: PascalCase name, PascalCase members
enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

// Booleans: is/has/can/should prefix
const isActive = true;
const hasPermission = false;
const canEdit = user.role === "admin";
const shouldRedirect = !isAuthenticated;

// Event handlers: handle + Event
const handleClick = () => { ... };
const handleUserCreated = (user: User) => { ... };
const handleFormSubmit = (data: FormData) => { ... };

// React components: PascalCase
function UserProfileCard({ user }: UserProfileCardProps) { ... }
// Component files: PascalCase.tsx
// UserProfileCard.tsx

// Test files: *.test.ts or *.spec.ts
// user-service.test.ts
```

### Python

```python
# Variables and functions: snake_case
user_name = "Jane"
def get_user_by_id(user_id: int) -> User: ...

# Classes: PascalCase
class UserService: ...
class CreateUserRequest(BaseModel): ...

# Constants: UPPER_SNAKE_CASE
MAX_RETRY_COUNT = 3
API_BASE_URL = "/api/v1"
DEFAULT_PAGE_SIZE = 20

# Module-level private: _leading_underscore
_internal_cache: dict[str, User] = {}
def _validate_email(email: str) -> bool: ...

# Booleans: is_/has_/can_/should_ prefix
is_active = True
has_permission = False

# Packages/modules: short_snake_case
# user_service.py, auth_middleware.py

# Test functions: test_ prefix (required by pytest)
def test_create_user_with_valid_email(): ...
def test_reject_user_with_short_password(): ...
```

### Go

```go
// Exported: PascalCase (visible outside package)
func GetUserByID(id string) (*User, error) { ... }
type UserService struct { ... }
const MaxRetryCount = 3

// Unexported: camelCase (package-private)
func validateEmail(email string) bool { ... }
type userCache struct { ... }
const defaultPageSize = 20

// Interfaces: -er suffix for single-method
type Reader interface { Read(p []byte) (n int, err error) }
type UserStore interface { GetUser(id string) (*User, error) }

// Acronyms: ALL CAPS
var userID string      // Not userId
var httpClient *http.Client  // Not httpClient (but this is fine per convention)
func ServeHTTP()       // Not ServeHttp
func ParseJSON()       // Not ParseJson

// Errors: Err prefix
var ErrNotFound = errors.New("not found")
var ErrInvalidInput = errors.New("invalid input")

// Test files: _test.go suffix
// user_service_test.go
func TestGetUserByID(t *testing.T) { ... }
```

### Rust

```rust
// Variables and functions: snake_case
let user_name = "Jane";
fn get_user_by_id(user_id: u64) -> Result<User> { ... }

// Types, traits, enums: PascalCase
struct UserService { ... }
trait Authenticate { ... }
enum OrderStatus { Pending, Completed, Cancelled }

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT: u32 = 3;
static API_BASE_URL: &str = "/api/v1";

// Modules: snake_case
mod user_service;
mod auth_middleware;

// Lifetimes: short lowercase ('a, 'b, 'ctx)
fn find<'a>(items: &'a [Item], id: u64) -> Option<&'a Item> { ... }

// Macros: snake_case!
macro_rules! define_error { ... }
```

### C# / .NET

```csharp
// Public members: PascalCase
public class UserService { ... }
public string GetUserById(string id) { ... }
public string Email { get; set; }

// Private fields: _camelCase
private readonly IUserRepository _userRepository;
private string _connectionString;

// Parameters and locals: camelCase
public void CreateUser(string userName, string email) {
    var validatedEmail = ValidateEmail(email);
}

// Constants: PascalCase
public const int MaxRetryCount = 3;

// Interfaces: I prefix
public interface IUserRepository { ... }
public interface ILogger { ... }

// Async methods: Async suffix
public async Task<User> GetUserByIdAsync(string id) { ... }
public async Task SendEmailAsync(string to, string body) { ... }
```

---

## File & Directory Naming

### Files

| Context | Convention | Example |
|---------|-----------|---------|
| TypeScript/JS | kebab-case | `user-service.ts` |
| Python | snake_case | `user_service.py` |
| Go | snake_case | `user_service.go` |
| Rust | snake_case | `user_service.rs` |
| C# | PascalCase | `UserService.cs` |
| React components | PascalCase | `UserProfile.tsx` |
| CSS/SCSS modules | kebab-case | `user-profile.module.css` |
| Config files | kebab-case | `eslint-config.json` |
| Markdown | UPPER_SNAKE_CASE or kebab | `CONTRIBUTING.md`, `api-design.md` |

### Directories

```
# Feature-based (preferred for apps)
src/
├── users/
│   ├── user.service.ts
│   ├── user.controller.ts
│   └── user.model.ts
├── orders/
└── auth/

# Layer-based (traditional)
src/
├── controllers/
├── services/
├── models/
└── middleware/
```

- Directories are **always lowercase**.
- Use **hyphens** for multi-word: `error-handling/`, not `errorHandling/`.
- Match existing project convention.

---

## Database Naming

### Tables and Columns

```sql
-- Tables: plural snake_case
CREATE TABLE users ( ... );
CREATE TABLE order_items ( ... );
CREATE TABLE user_preferences ( ... );

-- Columns: singular snake_case
id              BIGINT PRIMARY KEY,
email           VARCHAR(255) NOT NULL,
first_name      VARCHAR(100),
created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
is_active       BOOLEAN NOT NULL DEFAULT TRUE,
order_count     INTEGER NOT NULL DEFAULT 0,

-- Foreign keys: referenced_table_singular_id
user_id         BIGINT REFERENCES users(id),
parent_order_id BIGINT REFERENCES orders(id),

-- Indexes: idx_table_column(s)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id_created_at ON orders(user_id, created_at);

-- Constraints: chk/uq/fk prefix
CONSTRAINT uq_users_email UNIQUE (email),
CONSTRAINT chk_users_age CHECK (age >= 0),
CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
```

---

## API Naming

### REST Endpoints

```
# Resources: plural nouns, lowercase, hyphens for multi-word
/api/v1/users
/api/v1/order-items
/api/v1/user-preferences

# Query parameters: camelCase
/api/v1/users?pageSize=20&sortBy=createdAt&filterStatus=active

# Response fields: camelCase (JSON convention)
{
  "userId": "usr_123",
  "firstName": "Jane",
  "createdAt": "2025-01-15T10:30:00Z",
  "isActive": true
}
```

### Event Names

```
# Domain events: past tense, dot notation
user.created
order.payment.completed
inventory.stock.depleted

# Commands: imperative, dot notation
user.create
order.payment.process
email.notification.send
```

---

## Anti-Patterns

### Common AI Agent Naming Mistakes

```typescript
// Too generic
function processData(data: any) { ... }     // What data? What process?
function handleStuff(items: unknown[]) { ... } // Handle what?
const temp = getResult();                    // WHY is it temp?

// Inconsistent verbs
getUserById()   // get
fetchUserList() // fetch — pick one verb
retrieveOrder() // retrieve — three different words for the same action

// Redundant type encoding
const usersArray = [];        // Just: users
interface IUserInterface { }  // Just: User (TS doesn't need I prefix)
const strName = "Jane";      // Just: name
const bIsActive = true;       // Just: isActive

// Meaningless names
const data = await fetchData();
const result = processResult(data);
const output = transformOutput(result);
// Better: const users = await fetchUsers();

// Abbreviation soup
const usrMgr = new UsrMgr();  // UserManager
const cstmrAddr = getCstmrAddr();  // customerAddress
function calcTtlAmt() { ... }  // calculateTotalAmount
```

---

## Agent Instructions

```markdown
When naming things in code:

1. ALWAYS match the existing codebase's naming convention
2. ALWAYS use descriptive, pronounceable names
3. ALWAYS use consistent verbs (pick get/fetch/retrieve — not all three)
4. ALWAYS use boolean prefixes (is/has/can/should)
5. NEVER abbreviate unless the abbreviation is universally known
6. NEVER encode types in variable names
7. NEVER use single-letter names outside tiny loop scopes
8. NEVER mix naming styles in the same codebase
9. Follow language-specific conventions from this guide
```

---

*Version: 1.0.0*
