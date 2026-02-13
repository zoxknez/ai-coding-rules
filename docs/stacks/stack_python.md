# Python Stack Guidelines (Scripts, APIs, Data Science) (v2)

> **Python patterns for agentic development**
>
> Python's flexibility is a double-edged sword — agents must be guided toward
> explicit typing, structured projects, and safe patterns to avoid dynamic-language pitfalls.

---

## Project Structure

Follow the `src` layout for packages and applications:

```
project/
├── src/
│   └── myapp/
│       ├── __init__.py
│       ├── main.py              # Entry point
│       ├── config.py            # Settings / env loading
│       ├── domain/              # Business entities
│       │   ├── __init__.py
│       │   ├── models.py
│       │   └── exceptions.py
│       ├── services/            # Business logic
│       │   ├── __init__.py
│       │   └── user_service.py
│       ├── repositories/        # Data access
│       │   ├── __init__.py
│       │   └── user_repo.py
│       └── api/                 # HTTP layer (FastAPI/Flask)
│           ├── __init__.py
│           ├── routes/
│           └── middleware/
├── tests/
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── pyproject.toml               # Project metadata + deps
├── Makefile                     # Common commands
└── README.md
```

### Architectural Rules

- **I/O at the edges, pure logic in the core** — domain and services MUST NOT import HTTP/DB/file libraries directly.
- **Small modules** — avoid god files; split when a module exceeds ~200 lines.
- **Explicit imports** — no wildcard `from module import *`.
- Agents MUST match existing project layout; never reorganize without approval.

---

## Type Hints & Typing

### REQUIRED Patterns

```python
# Public functions MUST have type hints
def get_user(user_id: int) -> User | None:
    ...

# Use Pydantic for data validation + serialization
from pydantic import BaseModel, Field

class CreateUserRequest(BaseModel):
    email: str = Field(..., max_length=255)
    password: str = Field(..., min_length=8)
    role: str = Field(default="user")

# Use TypedDict for unstructured dicts
from typing import TypedDict

class UserDict(TypedDict):
    id: int
    name: str
    email: str

# Use Literal for constrained strings
from typing import Literal
Status = Literal["active", "inactive", "suspended"]
```

### PROHIBITED Patterns

```python
# Never use bare dict for structured data
def create_user(data: dict) -> dict:  # No shape info
    ...

# Never use Any unless absolutely necessary
from typing import Any
def process(data: Any) -> Any:  # Defeats type checking
    ...

# Never omit return types on public functions
def calculate_total(items):  # Missing hints
    ...
```

---

## Error Handling

### REQUIRED Patterns

```python
# Custom exception hierarchy
class AppError(Exception):
    """Base application error."""
    def __init__(self, message: str, code: str = "UNKNOWN"):
        self.message = message
        self.code = code
        super().__init__(message)

class NotFoundError(AppError):
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} '{identifier}' not found",
            code="NOT_FOUND"
        )

class ValidationError(AppError):
    def __init__(self, field: str, reason: str):
        super().__init__(
            message=f"Validation failed for '{field}': {reason}",
            code="VALIDATION_ERROR"
        )

# Catch specific exceptions, add context
try:
    user = repo.get_by_id(user_id)
except DatabaseError as e:
    raise AppError(f"Failed to fetch user {user_id}") from e
```

### PROHIBITED Patterns

```python
# Never catch bare Exception (hides bugs)
try:
    process()
except Exception:  # Too broad
    pass

# Never silently swallow errors
try:
    send_email(user)
except Exception:  # Silent failure
    pass

# Never use assert for validation (disabled with -O)
assert len(password) >= 8  # Not a runtime check
```

---

## Input Validation

### External Data

```python
# ALWAYS validate external input — never trust it
from pydantic import BaseModel, validator
import re

class SignupRequest(BaseModel):
    email: str
    username: str
    age: int

    @validator("email")
    def valid_email(cls, v: str) -> str:
        if not re.match(r"^[^@]+@[^@]+\.[^@]+$", v):
            raise ValueError("Invalid email format")
        return v.lower().strip()

    @validator("username")
    def valid_username(cls, v: str) -> str:
        if not re.match(r"^[a-zA-Z0-9_]{3,30}$", v):
            raise ValueError("Username must be 3-30 alphanumeric chars")
        return v

    @validator("age")
    def valid_age(cls, v: int) -> int:
        if not (13 <= v <= 150):
            raise ValueError("Age must be between 13 and 150")
        return v
```

### File Path Safety

```python
from pathlib import Path

# REQUIRED: Resolve and check against allowed base
def safe_read(user_path: str, base_dir: Path) -> str:
    resolved = (base_dir / user_path).resolve()
    if not resolved.is_relative_to(base_dir.resolve()):
        raise ValueError("Path traversal detected")
    return resolved.read_text()

# DANGEROUS: No path validation
def unsafe_read(user_path: str) -> str:
    return open(user_path).read()  # Path traversal risk
```

---

## Async / Concurrency

### AsyncIO Patterns

```python
import asyncio
import httpx

# Use async context managers
async def fetch_users(base_url: str) -> list[dict]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(f"{base_url}/users")
        response.raise_for_status()
        return response.json()

# Gather for concurrent I/O (with error handling)
async def fetch_all(urls: list[str]) -> list[str]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        tasks = [client.get(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [
            r.text for r in results
            if not isinstance(r, Exception)
        ]

# Semaphore for rate limiting
async def fetch_limited(urls: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)
    async with httpx.AsyncClient(timeout=30.0) as client:
        async def fetch(url: str) -> str:
            async with semaphore:
                resp = await client.get(url)
                return resp.text
        return await asyncio.gather(*[fetch(u) for u in urls])
```

### Async Antipatterns

```python
# Never block the event loop
import time
async def bad():
    time.sleep(5)  # Blocks entire loop
    # Use: await asyncio.sleep(5)

# Never mix sync and async DB calls in async context
def sync_query():
    return db.execute("SELECT ...")  # Wrong in async context

# Never fire-and-forget without error handling
asyncio.create_task(risky_operation())  # Exceptions lost
```

### CPU-Bound Work

```python
from concurrent.futures import ProcessPoolExecutor
import asyncio

# Use ProcessPoolExecutor for CPU-heavy work
async def parallel_compute(data: list[int]) -> list[int]:
    loop = asyncio.get_event_loop()
    with ProcessPoolExecutor(max_workers=4) as pool:
        results = await loop.run_in_executor(pool, heavy_compute, data)
    return results
```

---

## Database Access

### SQLAlchemy Patterns

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

# Use parameterized queries (always)
async def get_user(session: AsyncSession, email: str) -> User | None:
    stmt = select(User).where(User.email == email)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()

# NEVER use string concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"  # SQL injection

# Use session context manager for transactions
async def create_user(session: AsyncSession, data: CreateUserRequest) -> User:
    user = User(email=data.email, name=data.name)
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user
```

### Connection Management

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

# Configure pool properly
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,  # Recycle connections every 30 min
    echo=False,         # Never True in production
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# Dependency injection pattern (FastAPI)
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
```

---

## FastAPI Patterns

### Route Structure

```python
from fastapi import FastAPI, Depends, HTTPException, status

app = FastAPI()

@app.post("/users", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(
    request: CreateUserRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")

    user = await user_service.create(db, request)
    return user

# Consistent error responses
@app.exception_handler(AppError)
async def app_error_handler(request, exc: AppError):
    status_map = {
        "NOT_FOUND": 404,
        "VALIDATION_ERROR": 422,
        "UNAUTHORIZED": 401,
    }
    return JSONResponse(
        status_code=status_map.get(exc.code, 500),
        content={"error": {"code": exc.code, "message": exc.message}},
    )
```

### Middleware

```python
import time
import logging

logger = logging.getLogger(__name__)

@app.middleware("http")
async def request_logging(request, call_next):
    start = time.perf_counter()
    response = await call_next(request)
    duration = time.perf_counter() - start
    logger.info(
        "request",
        extra={
            "method": request.method,
            "path": request.url.path,
            "status": response.status_code,
            "duration_ms": round(duration * 1000, 2),
        },
    )
    return response
```

---

## Data Science / ML Specifics

### Reproducibility

```python
import random
import numpy as np

# Fix seeds for reproducibility
def set_seeds(seed: int = 42):
    random.seed(seed)
    np.random.seed(seed)
    # torch.manual_seed(seed)  # If using PyTorch

# Use deterministic operations where possible
# Log hyperparameters and data versions
```

### Data Handling

```python
import pandas as pd

# Validate data shape on load
def load_dataset(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    required_cols = {"id", "feature_1", "label"}
    missing = required_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing columns: {missing}")
    return df

# Chain operations for readability (not mutation)
result = (
    df
    .query("age > 18")
    .assign(age_group=lambda x: pd.cut(x.age, bins=[18, 30, 50, 100]))
    .groupby("age_group")
    .agg(count=("id", "count"), mean_score=("score", "mean"))
)
```

---

## Performance

### Profiling First

```python
# Profile before optimizing
import cProfile

cProfile.run("main()", sort="cumulative")

# Or use line_profiler for fine-grained analysis
# @profile decorator + kernprof -l -v script.py
```

### Common Optimizations

```python
# Use generators for large datasets
def process_lines(filepath: str):
    with open(filepath) as f:
        for line in f:  # Memory-efficient
            yield transform(line)

# Don't load everything into memory
lines = open(filepath).readlines()  # Loads entire file

# Use list comprehensions over loops
result = [x * 2 for x in data]  # Faster than append loop

# Use sets for membership testing
valid_ids = set(get_valid_ids())  # O(1) lookup
if user_id in valid_ids:
    ...
```

---

## Packaging & Dependencies

### pyproject.toml (Modern Standard)

```toml
[project]
name = "myapp"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.100",
    "sqlalchemy>=2.0",
    "pydantic>=2.0",
    "httpx>=0.24",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-asyncio>=0.21",
    "ruff>=0.1",
    "mypy>=1.5",
]

[tool.ruff]
target-version = "py311"
line-length = 88

[tool.mypy]
python_version = "3.11"
strict = true
```

### Environment Rules

- **ALWAYS** use virtual environments (`venv`, `poetry`, `uv`).
- **ALWAYS** pin exact versions in lock files.
- **NEVER** install globally; never `pip install` without a venv.
- **NEVER** commit `.env` files or secrets.

---

## Tooling

### Required Tools

```bash
# Format + Lint (single tool)
ruff check --fix .
ruff format .

# Type checking
mypy src/ --strict

# Testing
pytest tests/ -v --cov=src --cov-report=term-missing

# Security scanning
bandit -r src/ -ll
pip-audit  # Check dependencies for known vulns
```

### Ruff Configuration

```toml
# pyproject.toml
[tool.ruff.lint]
select = [
    "E",   # pycodestyle errors
    "W",   # pycodestyle warnings
    "F",   # pyflakes
    "I",   # isort
    "N",   # pep8-naming
    "UP",  # pyupgrade
    "S",   # bandit (security)
    "B",   # bugbear
    "A",   # builtins shadowing
    "C4",  # comprehension improvements
    "RET", # return statement checks
    "SIM", # simplification
]

[tool.ruff.lint.per-file-ignores]
"tests/**" = ["S101"]  # Allow assert in tests
```

---

## Security

### Common Agent Mistakes

```python
# Never use eval/exec on external input
eval(user_input)  # Remote code execution

# Never use pickle with untrusted data
import pickle
data = pickle.loads(untrusted_bytes)  # Arbitrary code execution

# Never disable SSL verification
requests.get(url, verify=False)  # MITM vulnerability

# Never log sensitive data
logger.info(f"Login: user={email}, password={password}")  # Exposed
```

### Safe Patterns

```python
# Use ast.literal_eval for safe eval of literals
import ast
data = ast.literal_eval(user_input)  # Only parses literals

# Use JSON for serialization (never pickle for external data)
import json
data = json.loads(untrusted_string)

# Secrets management
import os
SECRET_KEY = os.environ["SECRET_KEY"]  # From environment
# Or use python-dotenv + .env (not committed)
```

---

## Agent Instructions

```markdown
When generating Python code:

1. ALWAYS add type hints to public functions and methods
2. ALWAYS use Pydantic for request/response validation
3. ALWAYS use parameterized queries (never f-strings in SQL)
4. ALWAYS use async context managers for I/O resources
5. NEVER use eval(), exec(), or pickle with untrusted data
6. NEVER catch bare Exception without re-raising
7. NEVER use global mutable state
8. Use ruff for linting, mypy for type checking
9. Follow existing project structure — do not reorganize
```

---

*Version: 2.0.0*
