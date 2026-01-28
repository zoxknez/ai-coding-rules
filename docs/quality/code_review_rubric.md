# Code Review Checklist for AI-Assisted PRs (v3)

## Must-Pass (fail = reject)
- [ ] **Scope discipline**: no drive-by refactors
- [ ] **Correctness**: edge cases covered
- [ ] **Security**: authz checks where needed
- [ ] **Tests**: new behavior covered
- [ ] **No secrets** in code/logs
- [ ] **Performance**: no obvious regression

## Scoring Rubric (0-2 each)

| Category | 0 (Reject) | 1 (Needs Work) | 2 (Pass) |
|----------|------------|----------------|----------|
| Correctness | Broken / missing edge cases | Works but fragile | Solid with edge cases |
| Scope | Drive-by changes | Minor scope creep | Exactly what was asked |
| Simplicity | Overengineered | Could be simpler | Minimal viable solution |
| Tests | None | Partial coverage | Full coverage |
| Security | Vulnerability present | Minor concerns | Secure |
| Performance | Regression | Neutral | Optimized |
| Maintainability | Unreadable | OK | Clean and documented |

**Rule:** If any category is 0 → do not merge.

## Red Flags
- Large diff without clear reason
- New dependency without justification
- "Helper" files that are just wrappers
- Deep abstraction without reuse
- "Fix" without test
- Removed code without explanation
- Changed formatting outside scope

## AI-Specific Review Points
- [ ] Assumptions listed and validated
- [ ] No hallucinated file paths or functions
- [ ] Follows existing codebase patterns
- [ ] Verification steps provided and executed
- [ ] No unexplained side effects

## Merge Requirements
- Summary of files changed
- Verification commands run
- Manual test confirmation (if applicable)
- All CI checks passing
