---
description: "USE WHEN: working with Supabase, RLS policies, Auth, or Edge Functions."
globs: ["**/supabase/**","**/*.sql","**/edge-functions/**","**/functions/**"]
alwaysApply: false
priority: 45
---

# Supabase Stack Rules

## Row-Level Security (RLS)

### Mandatory Practices
- Enable RLS on ALL tables (no exceptions)
- Use `(SELECT auth.uid())` pattern for performance (17x faster)
- Index all columns used in RLS policies
- Always guard against null auth state

### Performance Patterns

#### Function Caching (CRITICAL)
```sql
-- ❌ BAD: O(N × f(C)) — function per row
auth.uid() = user_id

-- ✅ GOOD: O(N + f(C)) — function once
(SELECT auth.uid()) = user_id
```

#### Join Optimization
```sql
-- ❌ BAD: Subquery per row
user_id IN (SELECT id FROM team_members WHERE team_id = ...)

-- ✅ GOOD: Array comparison
user_id = ANY(ARRAY(SELECT id FROM team_members WHERE team_id = ...))
```

#### Null Guards
```sql
-- ✅ Always include
auth.uid() IS NOT NULL AND (SELECT auth.uid()) = user_id
```

### Policy Types
- Use **permissive** policies by default
- Use **restrictive** only for complex multi-condition scenarios
- Combine policies with OR logic (permissive) or AND logic (restrictive)

---

## Authentication

### Client-Side
- Never trust client-side auth state for sensitive operations
- Always verify session server-side before mutations
- Use `supabase.auth.getUser()` NOT `getSession()` for security

### Server-Side
```typescript
// ✅ Secure: Validates JWT with Supabase
const { data: { user }, error } = await supabase.auth.getUser();

// ❌ Insecure: Can be spoofed
const { data: { session } } = await supabase.auth.getSession();
```

### Token Handling
- Never log full tokens
- Use short-lived access tokens
- Implement token refresh logic

---

## Edge Functions

### Structure
```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async (req) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Function logic
    return new Response(JSON.stringify({ data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
```

### Best Practices
- Handle CORS explicitly for all endpoints
- Return proper HTTP status codes
- Use Deno standard library
- Validate input with Zod or similar
- Never expose internal errors to clients

---

## Database

### Schema Changes
- Use migrations for ALL schema changes
- Never edit production DB directly
- Test migrations in staging first

### Relationships
- Use foreign keys for referential integrity
- Document cascade behavior
- Prefer soft deletes (`deleted_at` column)

### Queries
- Use parameterized queries always
- Avoid `SELECT *` — specify columns
- Add indexes for frequent query patterns

---

## Security-Definer Functions

Use with extreme caution:

```sql
CREATE OR REPLACE FUNCTION admin_action(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ✅ ALWAYS validate auth
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- ✅ ALWAYS check permissions
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  -- Actual operation
  UPDATE users SET status = 'active' WHERE id = target_user_id;
END;
$$;
```

### Rules
- Always validate `auth.uid() IS NOT NULL`
- Always check user permissions inside function
- Set explicit `search_path`
- Document why SECURITY DEFINER is needed
- Review with security team before production
