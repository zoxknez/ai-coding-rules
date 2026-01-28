---
title: "Plan → Patch → Verify"
description: "Always follow the loop: Plan what you'll change, implement the patch, verify it works. Never skip verification."
category: "workflows"
complexity: "low"
impact: "high"
tags: ["workflow", "quality", "verification", "process"]
relatedRules: ["test-first-loop", "assumptions-ledger"]
pubDate: 2026-01-27
---

## The Loop

> **Plan → Patch → Verify → Explain**

Every change, no matter how small, follows this cycle:

1. **Plan:** What will change and where (max 10 lines)
2. **Patch:** Implement the change
3. **Verify:** Confirm it works (tests + manual checks)
4. **Explain:** Document tradeoffs, assumptions, risks

---

## Step 1: Plan

### What to Include

- **Files to change** (with paths)
- **Edge cases** to handle
- **Verification steps** (how you'll confirm it works)
- **Risks** (what could go wrong)

### Example

```markdown
## Plan

Files to change:
- src/api/login.ts (add rate limiting)
- package.json (add express-rate-limit)

Edge cases:
- Burst of requests from same IP
- Legitimate users hitting limit
- Rate limit bypass attempts

Verification:
- Unit tests: mock 10 rapid requests → expect 429 after 5th
- Manual: curl /api/login 10 times → check response headers
- Logs: confirm rate limit counter increments

Risks:
- Legitimate users blocked (mitigated by 5 req/15min limit)
- Distributed attacks bypass IP-based limits (future: add CAPTCHA)
```

**Why max 10 lines?** Forces you to think clearly. If plan is > 10 lines, task is too complex.

---

## Step 2: Patch

### Implementation Rules

- **Minimal diff** (touch only what's needed)
- **No drive-by refactors** (fix only what's in scope)
- **Follow existing patterns** (match codebase style)

### Example

```typescript
// src/api/login.ts
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts, please try again later',
});

app.post('/api/login', loginLimiter, async (req, res) => {
  // ... existing login logic
});
```

---

## Step 3: Verify

### Automated Checks

```bash
# Type check
npm run typecheck

# Linting
npm run lint

# Tests
npm test

# Build (catch import errors)
npm run build
```

---

### Manual Checks

```bash
# Start dev server
npm run dev

# Test happy path
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass"}'

# Test rate limit (6th request should fail)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' &
done

# Expected: First 5 return 401, 6th returns 429
```

---

### Verification Checklist

```
Automated:
[ ] npm run typecheck (no TS errors)
[ ] npm run lint (no lint errors)
[ ] npm test (all tests pass)
[ ] npm run build (builds successfully)

Manual:
[ ] Happy path works (login with valid credentials)
[ ] Edge case 1 works (rate limit after 5 attempts)
[ ] Edge case 2 works (legitimate users can retry after 15min)
[ ] Logs are clean (no unexpected errors)

UI (if applicable):
[ ] No console errors in browser
[ ] UI renders correctly
[ ] Loading states work
[ ] Error messages display properly
```

---

## Step 4: Explain

### What to Document

- **Tradeoffs:** What did you sacrifice?
- **Assumptions:** What did you assume to be true?
- **Risks:** What could still go wrong?
- **Future work:** What's left for later?

### Example

```markdown
## Notes

Tradeoffs:
- Chose IP-based rate limiting (simpler) over user-based (more accurate)
- Reason: IP-based works for both logged-in and logged-out users

Assumptions:
A1. Most users are behind NAT (shared IP) with < 5 users per household
A2. 15-minute window is acceptable UX for legitimate users
🔴 A3. No corporate networks with 100+ users on same IP (CRITICAL)

Risks:
- Shared IPs (offices, schools) might hit limit faster
- Mitigation: use user-based limits after authentication

Future work:
- Add CAPTCHA for distributed attacks
- Track failed attempts in database for analytics
- Whitelist known IPs (CI/CD servers, monitoring)
```

---

## Real-World Example

### Task: Add CSV export to user table

#### 1️⃣ Plan

```markdown
## Plan

Files to change:
- src/routes/users.ts (add /users/export route)

Edge cases:
- Empty user table (return empty CSV)
- Special characters in names (escape commas)
- Large dataset (> 10k users → stream response)

Verification:
- Test: Export 3 users → verify CSV format
- Test: User with comma in name → verify escaping
- Manual: Download CSV, open in Excel → check formatting

Risks:
- No pagination (could timeout for > 100k users)
- No auth check (added in patch)
```

---

#### 2️⃣ Patch

```typescript
// src/routes/users.ts
app.get('/users/export', requireAuth, async (req, res) => {
  const users = await db.user.findMany({
    select: { name: true, email: true, role: true },
  });
  
  const rows = ['Name,Email,Role'];
  for (const user of users) {
    const name = user.name.includes(',') ? `"${user.name}"` : user.name;
    rows.push(`${name},${user.email},${user.role}`);
  }
  
  const csv = rows.join('\n');
  
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
  res.send(csv);
});
```

---

#### 3️⃣ Verify

```bash
# Automated
npm run typecheck  # ✅ No errors
npm test           # ✅ All pass

# Manual
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/users/export \
     -o users.csv

# Check CSV content
cat users.csv
# Name,Email,Role
# Alice,alice@example.com,admin
# "Smith, John",john@example.com,user

# Open in Excel → ✅ Formatting correct
```

---

#### 4️⃣ Explain

```markdown
## Notes

Tradeoffs:
- Chose in-memory CSV generation (simple) over streaming (scalable)
- Reason: Current user count < 1000, acceptable for MVP

Assumptions:
A1. User table has < 10k rows (fits in memory)
🔴 A2. Export doesn't need to be real-time (CRITICAL if users change during export)

Risks:
- Large datasets (> 100k users) could timeout
- Mitigation: switch to streaming if user count exceeds 10k

Future work:
- Add pagination or streaming for large datasets
- Add filters (export only active users, etc.)
- Schedule background job for very large exports
```

---

## Anti-Patterns

### ❌ Skipping Plan

```
"Just add the feature, I know what to do."
→ 3 hours later: "Wait, I forgot about edge case X..."
```

**Fix:** Always plan, even for 10-minute tasks.

---

### ❌ Skipping Verification

```
"Tests pass, ship it!"
→ User reports: "The button doesn't work."
→ You: "But tests passed!" (tests didn't cover UI)
```

**Fix:** Manual verification always required.

---

### ❌ No Explanation

```
PR description: "Fixed login bug"
Reviewer: "What bug? How? What could break?"
```

**Fix:** Document assumptions, tradeoffs, risks.

---

## Checklist Template

```markdown
## Plan (max 10 lines)
Files to change:
- [file paths]

Edge cases:
- [list]

Verification:
- [automated + manual steps]

Risks:
- [what could go wrong]

---

## Patch
[implement change]

---

## Verification

Automated:
[ ] npm run typecheck
[ ] npm run lint
[ ] npm test
[ ] npm run build

Manual:
[ ] Happy path works
[ ] Edge case 1 works
[ ] Edge case 2 works
[ ] No console errors

---

## Notes

Tradeoffs:
- [what you sacrificed and why]

Assumptions:
- A1: [assumption]
- 🔴 A2: [critical assumption]

Risks:
- [what could still go wrong]

Future work:
- [what's left for later]
```

---

## Summary

```
Plan → Patch → Verify → Explain

Plan:
✅ What changes (max 10 lines)
✅ Edge cases
✅ Verification steps
✅ Risks

Patch:
✅ Minimal diff
✅ Follow existing patterns

Verify:
✅ Automated (typecheck, lint, tests, build)
✅ Manual (happy path + edge cases)

Explain:
✅ Tradeoffs
✅ Assumptions
✅ Risks
✅ Future work

Never skip verification. Broken code in production = wasted time.
```

---

## Related Rules

- [Test-First Loop](/rules/test-first-loop) - Write tests before code
- [Assumptions Ledger](/rules/assumptions-ledger) - Document unknowns
- [Minimal Diff](/rules/minimal-diff) - Touch only what's needed
