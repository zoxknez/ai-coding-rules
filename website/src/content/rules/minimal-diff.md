---
title: "Minimal Diff Principle"
description: "Touch only what's needed. No drive-by refactors, no reformatting, no scope creep."
category: "core"
complexity: "low"
impact: "high"
tags: ["surgical-changes", "code-review", "minimal-impact"]
relatedRules: ["assumptions-ledger", "complexity-budget"]
pubDate: 2026-01-27
---

## The Principle

> **Touch the smallest number of files and lines needed.**

Every line changed = risk of bugs + review burden. Minimize both.

---

## Rules

### ✅ DO

- **Change only files in scope** (defined in prompt)
- **Touch only relevant lines** (preserve whitespace, indentation, comments)
- **Keep existing patterns** (don't "fix" unrelated style issues)

### ❌ DON'T (Unless Explicitly Asked)

- Reformat code (Prettier, ESLint auto-fix)
- Rename variables/functions
- Move files or reorganize folders
- "Clean up" unrelated code
- Add "improvements" outside scope

---

## Why It Matters

### Code Review Burden
```diff
# Bad: 200 lines changed (50 relevant, 150 formatting)
- User can't see what actually matters
- Review takes 30 minutes instead of 5

# Good: 12 lines changed (all relevant)
+ Reviewer focuses on logic, not noise
+ Faster approval, less back-and-forth
```

### Bug Risk
```
More changes = more surface area for bugs
Unrelated changes = hard to bisect failures
```

---

## Examples

### ❌ Bad: Drive-By Refactor

**Task:** Add error handling to login function.

```diff
// login.ts
function login(email: string, password: string) {
-  const user = findUser(email);
-  if (user.password === password) {
+  // Refactored to async/await (NOT IN SCOPE!)
+  const user = await findUserAsync(email);
+  if (await bcrypt.compare(password, user.password)) {
+    // Added proper error handling
+    try {
       return { token: generateToken(user) };
+    } catch (error) {
+      logger.error('Token generation failed', error);
+      throw new Error('Login failed');
+    }
   }
-  return null;
+  throw new Error('Invalid credentials');
}

-// Also renamed function (NOT ASKED!)
-function findUser(email: string) { /* ... */ }
+function findUserAsync(email: string) { /* ... */ }
```

**Problems:**
- ❌ Changed from sync to async (breaking change!)
- ❌ Renamed `findUser` → `findUserAsync` (affects other files)
- ❌ Replaced `bcrypt` call (not in scope)
- ❌ Total: 15 lines changed, only 3 were needed

---

### ✅ Good: Surgical Change

**Task:** Add error handling to login function.

```diff
// login.ts
function login(email: string, password: string) {
  const user = findUser(email);
  if (user.password === password) {
-    return { token: generateToken(user) };
+    try {
+      return { token: generateToken(user) };
+    } catch (error) {
+      logger.error('Token generation failed', error);
+      throw new Error('Login failed');
+    }
  }
  return null;
}
```

**Why it's good:**
- ✅ Only 5 lines changed
- ✅ No side effects outside scope
- ✅ Easy to review and approve
- ✅ Safe to rollback if needed

---

## Edge Case: When Refactoring IS Needed

**Prompt must explicitly request it:**

```
Goal: Add error handling to login function.

Scope: src/auth/login.ts
Constraints: minimal diff

⚠️ Exception: If adding try/catch makes the function too complex (> 50 LOC),
you MAY extract a helper function. Document why in the PR description.
```

**AI Response:**

```diff
// login.ts
function login(email: string, password: string) {
-  const user = findUser(email);
-  if (user.password === password) {
-    return { token: generateToken(user) };
-  }
-  return null;
+  return loginWithErrorHandling(email, password);
+}
+
+function loginWithErrorHandling(email: string, password: string) {
+  try {
+    const user = findUser(email);
+    if (user.password === password) {
+      return { token: generateToken(user) };
+    }
+    return null;
+  } catch (error) {
+    logger.error('Login failed', error);
+    throw new Error('Login failed');
+  }
}
```

**Explanation in PR:**
> Extracted `loginWithErrorHandling` helper to avoid nesting try/catch inside existing if/else logic (would exceed 50 LOC complexity budget).

---

## Measuring "Minimal"

### File Count
- **Ideal:** 1 file
- **Good:** 2-3 files (if they're tightly coupled)
- **Review carefully:** 4+ files (is this really minimal scope?)

### Line Count
- **Ideal:** < 20 lines
- **Good:** 20-100 lines
- **Review carefully:** 100+ lines (break into smaller tasks?)

### Changed vs. Added Ratio
```
Changed: 5 lines
Added: 50 lines
= Probably fine (new feature)

Changed: 50 lines  
Added: 5 lines
= Review: are 50 changes all necessary?
```

---

## Checklist Before Committing

```
[ ] All changes are in the defined scope
[ ] No formatting-only changes (unless that's the task)
[ ] No renamed variables/functions (unless that's the task)
[ ] No file moves (unless that's the task)
[ ] Diff is < 100 lines (or task explicitly needs more)
[ ] Can explain WHY every single line changed
```

---

## Related Rules

- [Assumptions Ledger](/rules/assumptions-ledger) - Clarify scope before starting
- [Complexity Budget](/rules/complexity-budget) - Default to 1 file, < 200 LOC
- [Golden Rule](/rules/golden-rule) - Set clear scope in prompt

---

## Summary

```
Minimal Diff = Minimal Risk = Faster Review = Ship Faster

Every extra line changed:
  +10% bug risk
  +5 minutes review time
  +1 day to merge (compound delays)

Be surgical. Be precise. Be minimal.
```
