# Global Rules for AI Coding Agents (v3)

**Purpose:** Make AI-generated changes safer, smaller, simpler, and easier to review, while maximizing AI tenacity leverage.

---

## 🔴 THE GOLDEN RULE (Karpathy Insight)

> **"Don't tell it what to do — give it success criteria and watch it go."**

Declarative prompts enable AI to loop until success. Imperative prompts limit AI to single-shot.

---

## Operating principles

1. **Correctness > Simplicity > Consistency > Style**
   - First be correct, then simple, then consistent with the codebase, then pretty.

2. **Minimal Diff**
   - Touch the smallest number of files and lines needed.
   - **Never** reformat, rename, move files, or “clean up” unrelated code unless explicitly requested.

3. **Assumptions Ledger**
   - If anything is unclear, write:
     - **Assumptions (A1…A5)** (max 5)
     - **Critical assumptions** (mark with 🔴)
     - **Questions (Q1…Q3)** (max 3) you need answered before implementing

4. **Plan → Patch → Verify → Explain**
   - Always follow this loop, even if the plan is 5 lines.

5. **Do not invent repo facts**
   - Don’t hallucinate file paths, env vars, package names, or existing functions.
   - If you can’t see it, ask or propose a safe default *and label it as a proposal*.

## Three-Phase Development Pattern

1. **NAIVE CORRECT** — First make it work (simplest possible solution)
2. **ADD TESTS** — Lock in behavior with tests
3. **OPTIMIZE** — Only if needed, tests must stay green

Never skip phase 1 or 2.

---

## Anti-bloat / Complexity budget

- Default to the simplest shape:
  - **1 file** change if possible.
  - **1 new function** before new abstractions.
- Only introduce abstractions if:
  - there is **duplication in 2+ places**, or
  - it materially improves **testability**, or
  - it is required for **security/performance**.
- If solution is going beyond **~200 LOC**, stop and propose a simpler approach first.

## Safety rails (common failure modes)

### 1) Hidden assumptions
- When you infer something (API contract, schema, auth model), say it explicitly.
- Prefer asking questions over guessing.

### 2) Conceptual bugs
- Validate edge cases:
  - null/undefined
  - empty lists
  - timeouts / retries
  - idempotency
  - partial failures

### 3) “Side-effect edits”
- Never remove/change comments or code you “don’t like”.
- Never delete code unless you:
  - show it is unused (reference search), AND
  - it is part of the requested scope, AND
  - you call it out explicitly.

## Required output structure (recommended)

### A) Plan (max 10 lines)
- What you will change and where
- Risks & edge cases
- How you will verify

### B) Patch
- Provide diffs or file snippets with file paths.

### C) Verification steps
- Commands to run (lint/typecheck/tests)
- What to inspect manually (UI flow, endpoint response, logs)

### D) Notes
- Assumptions (if any)
- Tradeoffs (if any)
- Anything not verified

## Quick review checklist (before you “send”)

- [ ] I didn't change unrelated files/formatting.
- [ ] I listed assumptions or asked questions if ambiguous.
- [ ] I handled error/empty/loading states where applicable.
- [ ] I added/updated tests or provided a test plan.
- [ ] I included run steps and the exact files changed.
