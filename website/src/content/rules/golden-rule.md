---
title: "The Golden Rule"
description: "Declarative prompts enable AI to loop until success. Don't tell AI what to do — give it success criteria and let it solve."
category: "prompting"
complexity: "low"
impact: "critical"
tags: ["karpathy", "declarative", "success-criteria", "prompt-engineering"]
relatedRules: ["three-phase-pattern", "minimal-diff"]
pubDate: 2026-01-27
---

## The Core Insight

> **"Don't tell it what to do — give it success criteria and watch it go."**  
> — Andrej Karpathy

Declarative prompts enable AI to **loop until success**. Imperative prompts limit AI to **single-shot execution**.

---

## ❌ Bad: Imperative (Step-by-Step)

```
"Add a button that calls the API, handle the error, update state, 
add loading spinner, redirect on success..."
```

**Problem:** AI executes once and stops. If something fails, you debug manually.

---

## ✅ Good: Declarative (Success Criteria)

```
Goal: User can submit the form.

Success criteria:
  [ ] Submit calls POST /api/submit
  [ ] Loading state while waiting for response
  [ ] Error message displayed to user
  [ ] Success redirects to /thank-you
  [ ] Tests pass

Scope: only src/components/Form.tsx
Constraints: minimal diff, no new deps
```

**Why it works:** AI iterates, runs tests, fixes failures automatically until all checkboxes are green.

---

## Key Principles

1. **Define the goal**, not the implementation
2. **List success criteria** as testable checkboxes
3. **Set scope** (which files can be touched)
4. **Add constraints** (no new deps, minimal diff, preserve existing behavior)

---

## Real-World Example

**Bad prompt:**
> "Refactor the auth middleware to use JWT instead of sessions."

**Good prompt:**
> Goal: Replace session auth with JWT.
> 
> Success criteria:
> - [ ] All existing routes stay protected
> - [ ] User login returns JWT in response
> - [ ] JWT validated on every protected route
> - [ ] Existing integration tests pass
> - [ ] No breaking changes to API contracts
> 
> Scope: src/middleware/auth.ts, src/routes/login.ts
> Constraints: use existing `jsonwebtoken` package, no database schema changes

---

## Why This Matters

- **Leverage AI tenacity:** It loops until success
- **Reduce back-and-forth:** Clear criteria = fewer iterations with you
- **Safer changes:** Explicit constraints prevent scope creep
- **Easier review:** Success criteria = your acceptance test checklist

---

## Related Rules

- [Three-Phase Pattern](/rules/three-phase-pattern) - How to structure iterative development
- [Minimal Diff](/rules/minimal-diff) - Keep changes surgical
- [Assumptions Ledger](/rules/assumptions-ledger) - Handle ambiguity explicitly
