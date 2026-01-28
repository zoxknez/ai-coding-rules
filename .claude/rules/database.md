---
paths:
  - "**/prisma/**"
  - "**/drizzle/**"
  - "**/migrations/**"
  - "**/*.sql"
---

# Database Rules

## Schema Design
- Use singular table names (user, not users)
- Include created_at, updated_at timestamps
- Define explicit foreign key constraints
- Add indexes for frequently queried columns

## Migrations
- One logical change per migration
- Test migrations on production-like data
- Include both up and down migrations
- Never modify existing migrations

## Queries
- ALWAYS use parameterized queries
- Prefer ORM methods over raw SQL
- Use transactions for multi-step operations
- Add appropriate indexes for query patterns

## Security
- Apply principle of least privilege
- Don't store sensitive data unencrypted
- Sanitize data before insertion
- Use row-level security where applicable
