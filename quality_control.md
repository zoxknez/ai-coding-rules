# Quality Control & Avoiding “Slopacolypse” (v2)

AI can generate a lot of code quickly; without gates, quality drops. This doc defines **quality gates** and **review rubrics**.

## 1) Mandatory gates (CI / local)

- Lint (eslint/ruff/clippy)
- Typecheck (tsc/mypy)
- Unit tests
- Integration/E2E (if present)
- Security checks (dependency audit / SAST if present)

## 2) Review rubric (score 0–2 each)

1. **Correctness** (edge cases handled)
2. **Scope discipline** (minimal diff, no drive-by refactors)
3. **Simplicity** (no unnecessary abstractions)
4. **Test coverage** (new behavior tested)
5. **Security** (no secret leaks, authz checked)
6. **Performance** (no obvious regressions)
7. **Maintainability** (readable, consistent with codebase)

**Rule:** If any category is 0 → do not merge.

## 3) Anti-bloat guardrails

- Max new files: 2 (unless approved)
- Max LOC per PR: ~300 (unless justified)
- No new dependencies without approval
- No “architecture rewrite” in a feature PR

## 4) AI-generated code hygiene

- Always summarize:
  - files changed
  - why
  - how verified
- Prefer PRs over direct commits.
- Optional: label PRs “AI-assisted” to raise reviewer vigilance.

## 5) “Fact” outputs (docs, reports)

- Avoid confident claims without sources.
- If stating an external fact, cite a source or mark it as assumption.

## 6) Post-merge monitoring

- Add logs/metrics for new endpoints.
- Watch error rates, latency, and user feedback.
- Rollback plan for risky changes.

## 7) Continuous improvement

- When AI makes a repeated mistake, add it to:
  - project profile (forbidden patterns)
  - lint rules
  - tests
  - prompt snippets
