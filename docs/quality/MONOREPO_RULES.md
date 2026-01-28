# AI Coding Rules — Monorepo / Single Source of Truth (v1)

This document is the **canonical single source of truth** for all AI assistants (Copilot/Cursor/Claude/agents).
If there is a conflict between style rules and correctness/security, **correctness and security always win**.

---

## 0) Priorities (decision order)

1. **Correctness** (correct behavior, no regressions)
2. **Safety/Security** (no vulnerabilities, no secrets leakage)
3. **Simplicity** (the simplest solution that works)
4. **Consistency** (follow existing repo conventions)
5. **Style** (format, “beauty” of code)

---

## 1) Assumptions Ledger (REQUIRED)

Before writing code:
- Write 1–5 assumptions you are making.
- Mark **CRITICAL** ones (those that change the solution).
- If a critical unknown exists: ask up to **3 questions** and stop.

Format:

- Assumptions:
  - A1: ...
  - A2 (CRITICAL): ...
- Questions:
  - Q1: ...
  - Q2: ...

---

## 2) Minimal Diff (REQUIRED)

- Change **only** what is in scope.
- Do not touch comments, formatting, naming, or files outside scope.
- No “drive‑by refactor” unless required for the task to work.
- Do not add new dependencies without explicit approval.
- If removing dead code: only in files you already touch and mention it in the summary.

---

## 3) Complexity Budget (ANTI‑BLOAT)

Default limits (unless the task says otherwise):
- ≤ **3 files** changed per iteration
- ≤ **200 LOC** net change per iteration
- 0 new abstractions without reason

Introduce an abstraction only if at least one is true:
- duplication in 2+ places
- testability improves materially
- performance/security requires it

If you must exceed limits:
- propose a SIMPLE variant first
- split into 2–3 iterations (MVP → polish)

---

## 4) Tradeoffs (when real options exist)

If there are 2 real options:
- **Option A (simple)**: 1 sentence benefit/risk
- **Option B (robust)**: 1 sentence benefit/risk

Do not invent a third option if it isn’t needed.

---

## 5) Agent Loop (recommended flow)

1) **Plan** (max 10 lines)
2) **Implement small** (1–3 files)
3) **Verify** (lint/type/test + sanity checks)
4) **Simplify pass** (reduce abstractions, remove dead code in scope)
5) **Report** (what changed + commands + risks)

Stop rules (when to pause and ask):
- Unclear requirement or conflicting requirements
- Missing critical context
- Large architectural change requested for a small task
- Security‑sensitive change without clear rules

---

## 6) Quality Gates before final (REQUIRED)

Before final response:
- List verification commands:
  - lint:
  - typecheck:
  - test:
- List edge cases you covered.
- State what **could not** be verified (if you lack runtime).

---

## 7) Output Contract (REQUIRED response format)

Always deliver in this order:

1) **Assumptions** (brief)
2) **Plan** (max 10 lines)
3) **Files changed** (list of files + what)
4) **Verify** (commands)
5) **Risks/Notes** (brief)

---

# TASK TEMPLATE (copy/paste)

## Goal
One sentence describing what it should do.

## Context
Relevant files/links, current behavior.

## Success Criteria
- [ ] Correct behavior A
- [ ] Correct behavior B
- [ ] No regression in X
- [ ] Lint/type/test passes

## Scope
ALLOWED to change:
- ...

NOT ALLOWED to change:
- ...

## Constraints
- Minimal Diff
- No new dependencies
- Preserve existing style and comments

## Edge Cases
- ...
- ...

## Verification
- lint:
- typecheck:
- test:

Output format:
Assumptions → Plan → Files → Verify → Notes

---

# SECURITY & PRIVACY BASELINE

MUST:
- Never log secrets (API keys, tokens, passwords).
- Validate input (shape/type/range).
- Authn != Authz: explicitly verify permissions per resource.
- SSRF guard: allowlist domains for fetch.
- Path traversal guard: normalize + allowlist folders.
- SQL safety: parameterize queries; no string concatenation.
- File upload: size limits + MIME checks + sandboxed storage.
- Rate‑limit sensitive routes (login/reset).

If a risk exists:
- call it out in “Risks/Notes”
- propose mitigation

---

# CODE REVIEW RUBRIC (0–2)

Score 0: fail, 1: needs changes, 2: ready.

## Correctness
- covers success criteria
- no obvious bugs
- edge cases covered

## Minimal Diff
- no side‑effect changes
- no drive‑by refactors
- changes only within scope

## Complexity
- no unnecessary abstractions
- no duplicates/dead code
- LOC/files within budget

## Safety/Security
- input validation
- authz checks
- no secrets in logs
- no injection risks

## Verification
- commands listed (lint/type/test)
- tests added when appropriate

Red flags:
- massive refactor without reason
- new architecture for a small task
- 1000 lines where 100 would do
- deleting comments/code outside scope

---

# ANTI‑SLOP GUARDRAILS

Default:
- Max 3 files per iteration
- Max 200 LOC net change
- 0 new dependencies without approval

Required after generation:
- remove unused imports/vars (within scope)
- remove dead code you introduced
- confirm output follows the task spec
