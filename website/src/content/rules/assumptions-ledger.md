---
title: "Assumptions Ledger"
description: "When requirements are unclear, document assumptions and ask max 3 critical questions before implementing."
category: "core"
complexity: "low"
impact: "high"
tags: ["clarity", "communication", "risk-management"]
relatedRules: ["golden-rule", "minimal-diff"]
pubDate: 2026-01-27
---

## The Problem

> **Ambiguous requirements = wrong implementation = wasted time.**

AI agents (and humans) often guess when unclear. Guessing wrong = rebuild from scratch.

---

## The Solution: Assumptions Ledger

Before implementing, **explicitly document**:

1. **Assumptions (A1...A5)** — What you're inferring from context
2. **Critical Assumptions (🔴)** — Ones that could derail the project if wrong
3. **Questions (Q1...Q3)** — Max 3 questions to resolve ambiguity

---

## Format Template

```markdown
## Assumptions
A1. User authentication uses JWT (saw `auth.ts` with `jsonwebtoken`)
A2. Database is PostgreSQL (found `pool.query()` calls)
A3. API follows REST conventions (all routes in `routes/api/*.ts`)
🔴 A4. Payment processing must be idempotent (critical for money)
🔴 A5. User passwords are already hashed (no plaintext in DB)

## Questions (Max 3)
Q1. Should the new endpoint require authentication?
Q2. What's the rate limit for this API? (default to 100/min?)
Q3. Do we need to support pagination? (assuming yes if > 100 results)

## Plan
[Implementation details based on assumptions above...]
```

---

## Why Max 3 Questions?

- **Forces prioritization** (which unknowns actually matter?)
- **Reduces decision paralysis** (infinite questions = never ship)
- **Respects reviewer time** (more than 3 = TLDR)

**If you need > 3 questions, the task is too ambiguous. Ask for clarification before starting.**

---

## Examples

### Example 1: Add User Profile Page

**Bad (No Assumptions):**
```
Prompt: "Add a user profile page."

AI: Creates /profile route with hardcoded data, no auth check, 
    no database integration.

Developer: "Wait, this doesn't fetch real user data!"
AI: "You didn't specify..."
```

**Good (With Assumptions Ledger):**
```markdown
## Assumptions
A1. Profile page shows data from `users` table (name, email, avatar)
A2. Must be authenticated to view (redirect to /login if not)
A3. Uses existing `getUserById()` function from `lib/db.ts`
🔴 A4. Profile is read-only (no edit functionality in this task)

## Questions
Q1. Should profile show creation date / last login? (assuming no)
Q2. Do we need avatar upload in this task? (assuming no, future task)
Q3. Should profile be public or private? (assuming private)

## Plan
1. Create `src/pages/profile.astro`
2. Add auth middleware check
3. Fetch user data with `getUserById(session.userId)`
4. Display name, email, avatar (if exists)
5. Add link to profile in navbar
```

**Why it's better:**
- ✅ Clear scope (read-only, no edit)
- ✅ Calls out critical assumption (A4)
- ✅ Questions resolve edge cases
- ✅ Reviewer can confirm/correct before implementation

---

### Example 2: API Rate Limiting

**Bad:**
```
Prompt: "Add rate limiting to the API."

AI: Adds rate limiting to... one random endpoint? All endpoints? 
    What's the limit? Per user? Per IP?
```

**Good:**
```markdown
## Assumptions
A1. Rate limit applies to ALL `/api/*` routes (global middleware)
A2. Limit is per API key (from `Authorization` header)
A3. Default: 100 requests/minute (found in other projects)
🔴 A4. Exceeded limit returns 429 status (standard HTTP)
A5. Use in-memory store for dev, Redis for production

## Questions
Q1. Should admin users bypass rate limit? (assuming no)
Q2. Do we need per-endpoint custom limits? (e.g., /api/search = 10/min)
Q3. Should we track rate limit in database for analytics?

## Plan
1. Install `express-rate-limit` package
2. Create middleware in `src/middleware/rateLimit.ts`
3. Apply to `app.use('/api', rateLimitMiddleware)`
4. Return 429 with `Retry-After` header
5. Add tests for edge cases (burst requests, key expiry)
```

---

## Marking Critical Assumptions (🔴)

**What makes an assumption critical?**

- If wrong, requires **complete rewrite** (not just minor fix)
- Affects **security** (auth, permissions, data access)
- Involves **money** (payments, billing, refunds)
- Impacts **user data** (privacy, GDPR, deletion)
- Breaks **API contracts** (versioning, breaking changes)

**Examples:**

| Assumption | Critical? | Why |
|------------|-----------|-----|
| "User passwords are hashed" | 🔴 Yes | Security violation if wrong |
| "Payment webhook is idempotent" | 🔴 Yes | Duplicate charges = lawsuit |
| "Button color is blue" | ❌ No | Easy to change |
| "API returns JSON" | 🔴 Yes | Wrong = entire integration broken |

---

## When to Use Assumptions Ledger

### ✅ Always Use For:

- New features with unclear requirements
- Refactoring existing code (what behavior to preserve?)
- API integrations (3rd party assumptions)
- Security-critical changes (auth, payments, data access)

### ❌ Skip For:

- Trivial fixes (typos, formatting)
- Explicit requirements (detailed spec provided)
- Copy-paste from existing working code

---

## Anti-Pattern: Assumption Overload

```markdown
## Assumptions
A1. User table has `id` column
A2. User table has `email` column
A3. User table has `name` column
A4. Email is unique
A5. Email is validated
A6. Name is optional
A7. Name max length 255
A8. Database uses UUID for id
A9. Created_at timestamp exists
A10. Updated_at timestamp exists
... (30 more assumptions)
```

**Problem:** Too granular. Focus on **high-level unknowns**, not schema details.

**Better:**
```markdown
## Assumptions
A1. User schema matches existing `users` table (id, email, name)
🔴 A2. Email uniqueness enforced at DB level (constraint exists)
A3. Name is optional (null allowed)

## Questions
Q1. Should we validate email format on input? (assuming yes)
```

---

## Checklist

```
Before implementing:
  [ ] Documented 3-5 key assumptions
  [ ] Marked critical ones with 🔴
  [ ] Asked max 3 questions (if any)
  [ ] Waited for confirmation on 🔴 assumptions

During implementation:
  [ ] Followed plan based on confirmed assumptions
  [ ] Added comments for non-obvious decisions

After implementation:
  [ ] Verified all assumptions were correct
  [ ] Updated docs if assumptions changed
```

---

## Summary

```
Unclear task + no assumptions = wrong implementation

Assumptions Ledger:
  1. Document what you're inferring (A1...A5)
  2. Mark critical ones (🔴)
  3. Ask max 3 questions (Q1...Q3)
  4. Get confirmation before coding

Result: Build the right thing, faster, with less rework.
```

---

## Related Rules

- [Golden Rule](/rules/golden-rule) - Define success criteria upfront
- [Minimal Diff](/rules/minimal-diff) - Set clear scope constraints
- [Plan → Patch → Verify](/rules/plan-patch-verify) - Always follow the loop
