# Iterative Agent Loop Workflow (v3)

**Goal:** Maximize AI tenacity leverage while maintaining correctness via small, verifiable steps.

> Karpathy: *"Stamina is a core bottleneck to work and with LLMs it has been dramatically increased."*

---

## Core Insight: Declarative Leverage

Instead of: "Do X, then Y, then Z"
Use: "Success criteria: [list]. Loop until met."

## Loop (repeat until success criteria are met)

### 1) Triage (when debugging)
- Reproduce the bug (steps + expected vs actual)
- Create a minimal failing test or repro snippet
- Identify likely layer (UI/API/DB)

### 2) Plan (max 10 lines)
- Approach
- Edge cases
- Which files will change
- Verification commands

### 3) Implement small
- One logical change-set per iteration
- Prefer editing existing code over creating new frameworks
- Keep diffs reviewable (avoid “drive-by refactors”)

### 4) Verify
- Run lint/typecheck/tests
- If tools are unavailable, provide exact commands + expected outcomes
- Validate edge cases explicitly

### 5) Refactor (optional, only if needed)
- After correctness is proven
- Keep refactor scoped and justified

### 6) Cleanup
- Remove unused imports/vars introduced in this iteration
- Remove dead branches introduced while experimenting
- Do not delete unrelated code

### 7) Report
- What changed, where, why
- What was verified
- What is still uncertain

## Stop / Escalate rules
- If 2 iterations fail for unclear reasons → ask 1–3 clarifying questions
- If scope is growing → propose a smaller MVP first
- If solution exceeds ~200 LOC → propose a simpler alternative
