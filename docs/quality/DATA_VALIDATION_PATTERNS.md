# Data Validation & Transformation Patterns (v1)

> **Validate at boundaries, transform explicitly, fail fast**
>
> Data corruption starts at the boundary where external input enters
> the system. These patterns ensure agents generate robust validation
> that catches problems early and produces clear error messages.

---

## Validation Architecture

### Boundary Principle

```
External World                    Your Application
┌─────────────────┐              ┌─────────────────┐
│  HTTP Request    │──validate──→│  Domain Model    │
│  File Upload     │──validate──→│  (trusted types) │
│  Database Row    │──validate──→│                  │
│  Message Queue   │──validate──→│  Business Logic  │
│  Environment Var │──validate──→│  (operates on    │
│  CLI Argument    │──validate──→│   valid data)    │
└─────────────────┘              └─────────────────┘
```

**Rule:** Validate at EVERY boundary. Once data enters the domain layer, it is trusted.

---

## Input Validation Patterns

### Schema Validation (Recommended)

```typescript
// TypeScript — Zod (preferred)
import { z } from "zod";

const CreateUserSchema = z.object({
  email: z.string().email().max(255).toLowerCase().trim(),
  name: z.string().min(1).max(100).trim(),
  age: z.number().int().min(13).max(150),
  role: z.enum(["user", "admin", "moderator"]).default("user"),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

type CreateUserInput = z.infer<typeof CreateUserSchema>;

// Usage in handler
app.post("/users", async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(422).json({
      error: {
        code: "VALIDATION_ERROR",
        details: result.error.issues.map(i => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
    });
  }
  const user = await createUser(result.data); // Typed & validated
  res.status(201).json({ data: user });
});
```

```python
# Python — Pydantic v2
from pydantic import BaseModel, Field, field_validator
from datetime import date

class CreateUserInput(BaseModel):
    email: str = Field(..., max_length=255)
    name: str = Field(..., min_length=1, max_length=100)
    birth_date: date
    role: str = Field(default="user", pattern=r"^(user|admin|moderator)$")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.lower().strip()

    @field_validator("birth_date")
    @classmethod
    def validate_age(cls, v: date) -> date:
        from datetime import date as d
        age = (d.today() - v).days // 365
        if age < 13:
            raise ValueError("Must be at least 13 years old")
        return v
```

### Validation Rules

| Rule | Example | Why |
|------|---------|-----|
| Type check | `string`, `number`, `boolean` | Prevent type confusion |
| Length limits | `min=1`, `max=255` | Prevent DoS, buffer issues |
| Range check | `min=0`, `max=999999` | Business logic bounds |
| Pattern match | `^[a-zA-Z0-9_]+$` | Prevent injection |
| Enum/allowlist | `["draft", "published"]` | Restrict to valid values |
| Required fields | `required: true` | Prevent null errors |
| Default values | `default: "user"` | Safe fallback |
| Trim/normalize | `.trim().toLowerCase()` | Consistent storage |

---

## Sanitization Patterns

### HTML/XSS Prevention

```typescript
// NEVER trust user input in HTML context
import DOMPurify from "dompurify";

// If you MUST render user HTML (rich text editors)
const sanitized = DOMPurify.sanitize(userHtml, {
  ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li"],
  ALLOWED_ATTR: ["href"],
});

// Prefer: escape everything by default (React does this automatically)
// <p>{userInput}</p>  ← React auto-escapes

// NEVER do this
element.innerHTML = userInput;            // XSS
document.write(userInput);               // XSS
eval(userInput);                          // RCE
`<div>${userInput}</div>`;               // XSS in template literals
```

### SQL Injection Prevention

```python
# ALWAYS use parameterized queries
# Good
cursor.execute("SELECT * FROM users WHERE email = %s", (email,))

# Good (SQLAlchemy)
stmt = select(User).where(User.email == email)

# Good (Prisma / Drizzle — parameterized by default)
await prisma.user.findUnique({ where: { email } })

# NEVER do this
cursor.execute(f"SELECT * FROM users WHERE email = '{email}'")  # SQLi
cursor.execute("SELECT * FROM users WHERE email = '" + email + "'")  # SQLi
```

### Path Traversal Prevention

```python
from pathlib import Path

UPLOAD_DIR = Path("/app/uploads").resolve()

def safe_file_path(user_filename: str) -> Path:
    """Resolve and validate file path within allowed directory."""
    # Remove directory traversal attempts
    clean_name = Path(user_filename).name  # Strips any path components
    resolved = (UPLOAD_DIR / clean_name).resolve()

    # Verify path is still within allowed directory
    if not resolved.is_relative_to(UPLOAD_DIR):
        raise ValueError("Invalid file path")

    return resolved
```

---

## Data Transformation Patterns

### DTO / Mapper Pattern

```typescript
// Domain entity (internal)
interface User {
  id: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
  internalNotes: string;
}

// Response DTO (external) — never expose internal fields
interface UserResponse {
  id: string;
  email: string;
  createdAt: string;
}

// Explicit mapper — no auto-mapping magic
function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    // passwordHash: NEVER exposed
    // isAdmin: ONLY if explicitly needed
    // internalNotes: NEVER exposed
  };
}
```

### Transform Pipeline

```python
from typing import TypeVar, Callable

T = TypeVar("T")

def pipe(value: T, *transforms: Callable) -> T:
    """Apply transforms sequentially."""
    for transform in transforms:
        value = transform(value)
    return value

# Usage
clean_email = pipe(
    raw_input,
    str.strip,
    str.lower,
    validate_email_format,
    check_email_uniqueness,
)
```

---

## Environment & Configuration Validation

```typescript
// Validate ALL environment variables at startup
import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().int().min(1024).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  API_KEY: z.string().min(16),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

// Fail fast at startup — not at first request
export const env = EnvSchema.parse(process.env);
```

```python
# Python equivalent with pydantic-settings
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str
    redis_url: str
    jwt_secret: str = Field(..., min_length=32)
    port: int = Field(default=8000, ge=1024, le=65535)
    environment: str = Field(default="production", pattern=r"^(dev|staging|production)$")
    log_level: str = Field(default="info", pattern=r"^(debug|info|warn|error)$")

    model_config = {"env_file": ".env"}

# Validate at import time
settings = Settings()  # Raises on missing/invalid env vars
```

---

## File Upload Validation

```python
ALLOWED_MIME_TYPES = {
    "image/jpeg", "image/png", "image/webp", "image/gif",
    "application/pdf",
}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf"}

async def validate_upload(file: UploadFile) -> None:
    """Validate uploaded file before processing."""
    # 1. Check file size
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise ValidationError("file", f"File exceeds {MAX_FILE_SIZE // 1024 // 1024}MB limit")

    # 2. Check extension
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise ValidationError("file", f"Extension '{ext}' not allowed")

    # 3. Check MIME type (don't trust Content-Type header)
    import magic
    detected_mime = magic.from_buffer(content, mime=True)
    if detected_mime not in ALLOWED_MIME_TYPES:
        raise ValidationError("file", f"File type '{detected_mime}' not allowed")

    # 4. Reset file position
    await file.seek(0)
```

---

## Serialization Safety

### JSON

```python
import json
from datetime import datetime, date
from decimal import Decimal

class SafeJsonEncoder(json.JSONEncoder):
    """JSON encoder that handles common Python types safely."""
    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        if isinstance(obj, Decimal):
            return str(obj)  # Preserve precision
        if isinstance(obj, set):
            return list(obj)
        if isinstance(obj, bytes):
            return obj.decode("utf-8", errors="replace")
        return super().default(obj)

# NEVER use pickle for serialization of external data
# NEVER use yaml.load() without Loader=yaml.SafeLoader
# NEVER use eval() to parse data
```

### Date/Time

```python
from datetime import datetime, timezone

# ALWAYS store and transmit in UTC
now = datetime.now(timezone.utc)

# ALWAYS use ISO 8601 format for serialization
timestamp = now.isoformat()  # "2025-01-15T10:30:00+00:00"

# NEVER use naive datetimes
bad = datetime.now()  # No timezone — ambiguous
```

---

## Validation Testing

```python
import pytest

class TestCreateUserValidation:
    """Test validation at the boundary — both valid and invalid inputs."""

    def test_valid_input(self):
        result = CreateUserInput(
            email="user@example.com",
            name="Jane Doe",
            birth_date=date(1990, 1, 1),
        )
        assert result.email == "user@example.com"

    def test_email_normalized(self):
        result = CreateUserInput(
            email="  USER@Example.COM  ",
            name="Test",
            birth_date=date(1990, 1, 1),
        )
        assert result.email == "user@example.com"

    def test_invalid_email_rejected(self):
        with pytest.raises(ValidationError):
            CreateUserInput(email="not-an-email", name="Test", birth_date=date(1990, 1, 1))

    def test_underage_rejected(self):
        with pytest.raises(ValidationError, match="at least 13"):
            CreateUserInput(email="kid@test.com", name="Test", birth_date=date(2020, 1, 1))

    def test_missing_required_field(self):
        with pytest.raises(ValidationError):
            CreateUserInput(name="Test", birth_date=date(1990, 1, 1))  # Missing email

    def test_sql_injection_in_email(self):
        with pytest.raises(ValidationError):
            CreateUserInput(
                email="'; DROP TABLE users; --",
                name="Test",
                birth_date=date(1990, 1, 1),
            )
```

---

## Agent Instructions

```markdown
When handling data in code:

1. ALWAYS validate at system boundaries (API, file, env, queue)
2. ALWAYS use schema validation libraries (Zod, Pydantic, Joi)
3. ALWAYS sanitize HTML output (use framework defaults)
4. ALWAYS use parameterized queries (never string concatenation)
5. ALWAYS use explicit DTO mappers (never expose internal models)
6. NEVER trust Content-Type headers — verify with magic bytes
7. NEVER use eval/pickle/yaml.load for external data
8. NEVER store or transmit naive datetimes
9. Validate environment variables at startup, not at first use
10. Write tests for both valid AND invalid input paths
```

---

*Version: 1.0.0*
