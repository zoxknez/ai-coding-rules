# 🔵 Stack Guides

> Technology-specific rules and best practices.

## Files

| File | Stack | When to Use |
|------|-------|-------------|
| [stack_frontend.md](stack_frontend.md) | React, Next.js, TypeScript | Frontend development |
| [stack_backend.md](stack_backend.md) | Node.js, Express, Nest | API development |
| [stack_db.md](stack_db.md) | SQL, Prisma, Drizzle | Database work |
| [stack_python.md](stack_python.md) | Python, FastAPI, Django | Python projects |
| [stack_rust.md](stack_rust.md) | Rust, Cargo | Rust development |
| [ROLE_BUNDLES.md](ROLE_BUNDLES.md) | Role-based rule sets | Choosing which rules to load |

## Usage

### Option 1: Add to Context
Include the relevant stack file in your AI context when working on that part of the codebase.

### Option 2: Reference in .cursorrules
```markdown
For frontend work, follow rules in docs/stacks/stack_frontend.md
```

### Option 3: Cursor MDC (Automatic)
The `.cursor/rules/6*-stack-*.mdc` files automatically activate based on file globs.

## Coverage

| Technology | File | Cursor MDC |
|------------|------|------------|
| React | stack_frontend.md | 60-stack-frontend.mdc |
| Next.js 15 | stack_frontend.md | 67-stack-nextjs15.mdc |
| Node.js | stack_backend.md | 61-stack-backend.mdc |
| Prisma/Drizzle | stack_db.md | 63-stack-db.mdc |
| Supabase | — | 65-stack-supabase.mdc |
| shadcn/ui | — | 66-stack-shadcn.mdc |
| Python | stack_python.md | 62-stack-python.mdc |
| Rust | stack_rust.md | 64-stack-rust.mdc |
