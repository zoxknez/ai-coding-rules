# Task Specification Template for AI Models (v2)

Use this template for *every* task. It prevents wrong assumptions, overengineering, and scope creep.

## 0) Context (what the AI needs to know)
- Where in the app? (page/route/component/service)
- Links/screenshots/logs? (paste)
- Related code pointers? (file paths)

## 1) Goal (1 sentence)
Describe the outcome you want.

## 2) Success Criteria (acceptance checklist)
- [ ] Expected behavior A
- [ ] Expected behavior B
- [ ] No regression in C
- [ ] Lint/typecheck/tests pass

## 3) Non-goals (explicitly out of scope)
- Not doing …
- Not refactoring …
- Not changing UI design …

## 4) Scope
### Allowed to change
- `path/to/file1`
- `path/to/file2`

### Must NOT change
- `path/to/critical/area`
- formatting, comments, naming (unless specified)

## 5) Constraints
- No new dependencies
- Minimal diff
- Backward compatible (if relevant)
- Performance budget: (e.g., no extra API calls, avoid heavy re-renders)

## 6) Risks & edge cases to handle
- empty state
- invalid input
- network failure/timeouts
- concurrency/race conditions
- permissions/roles

## 7) Verification plan
- Commands to run:
  - `…lint`
  - `…typecheck`
  - `…test`
- Manual checks:
  - UI flow: …
  - API: …
  - Logs: …

## 8) Deliverable format (what to output)
- Plan (max 10 lines)
- Patch (diff)
- Verification steps
- Notes (assumptions/tradeoffs)

---

## Quick task prompt (compact)
```txt
Goal: …
Success criteria: …
Scope: allowed … forbidden …
Constraints: minimal diff, no new deps, preserve existing comments
Verification: lint/typecheck/test
If unclear: assumptions + 1–3 questions before code
```
