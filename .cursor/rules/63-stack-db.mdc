---
description: "USE WHEN: editing SQL, migrations, or DB schema."
globs: ["db/**","migrations/**","**/*.sql","**/schema.ts","**/schema.prisma"]
alwaysApply: false
priority: 40
---

# Database Rules

## Migrations
- Use transactions where supported.
- Ensure down migrations are safe or explicitly irreversible.
- Schema changes require migrations — no manual DB edits.

## Queries
- Prefer parameterized queries — never concatenate user input.
- Document performance-critical queries with EXPLAIN output.
- Avoid `SELECT *` — select only needed fields.

## Indexes
- Add indexes only for real query patterns.
- Verify cardinality and expected benefit before adding.
- Index columns used in WHERE, JOIN, and ORDER BY clauses.

## Data Integrity
- Use PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK constraints.
- Handle cascade deletes deliberately — document behavior.
- Prefer soft deletes (`deleted_at`) for recoverable data.

---

## Supabase RLS Patterns (Optional)

> Apply when working with Supabase Row-Level Security policies.

### Enable RLS (MANDATORY)
- Enable RLS on ALL tables with user data
- No exceptions — even admin tables need policies
- Use permissive policies as default

### Performance Optimization (CRITICAL)

#### Function Caching Pattern
```sql
-- ❌ BAD: Function called per row — O(N × f(C))
CREATE POLICY "Users see own data"
ON documents FOR SELECT
USING (auth.uid() = user_id);

-- ✅ GOOD: Function cached once — O(N + f(C))
CREATE POLICY "Users see own data"
ON documents FOR SELECT
USING ((SELECT auth.uid()) = user_id);
```

**Impact:** 170ms → <10ms on million-row datasets (17x improvement)

#### Join Direction Optimization
```sql
-- ❌ BAD: Subquery evaluated per row
USING (user_id IN (SELECT id FROM team_members WHERE team_id = ...));

-- ✅ GOOD: Array comparison with cached subquery
USING (user_id = ANY(ARRAY(SELECT id FROM team_members WHERE team_id = ...)));
```

### Null User Handling
```sql
-- ✅ Always guard against null auth
USING (
  auth.uid() IS NOT NULL
  AND (SELECT auth.uid()) = user_id
);
```

### Indexing for RLS
- Index ALL columns used in RLS policies
- Priority: `user_id`, `tenant_id`, `organization_id`
- Composite indexes for multi-column policies

### Security-Definer Functions
- Use sparingly (only when RLS bypass needed)
- Always validate `auth.uid() IS NOT NULL` inside function
- Document security implications in function comments
- Never expose to public schema without review
