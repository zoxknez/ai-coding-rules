# Prompt Patterns for AI Coding (v3)

## 1) Declarative Success Criteria (most effective)
**Bad:** "Add a button, then do... then do..."  
**Good:** "Goal: user can do X. Success criteria: [ ] A [ ] B [ ] C. Scope: … Constraints: …"

## 2) Naive → Correct → Optimize
1) "First build the simplest correct solution."
2) "Add tests."
3) "Now optimize without changing behavior; tests must stay green."

## 3) Minimal Diff
"Don't change formatting/naming/comments. Only change lines in these 2 files."

## 4) Ask-First Mode (when unclear)
"If you have 2+ possible interpretations, write assumptions ledger + up to 3 questions before code."

## 5) Patch Format
"Return result as diff with file paths and verification steps."

## 6) Anti-Bloat Guard
"If solution exceeds 200 LOC or requires new dependency, stop and offer simpler alternative."

## 7) Test-First Loop
"Write failing test first. Implement until it passes. Loop until green."

## 8) Scoped Debugging
"Bug: [description]. Repro: [steps]. Debug, fix, verify. Max 5 iterations."

## 9) Explicit Verification
"After implementation, run: lint, typecheck, test. Report results."

## 10) Tradeoff Request
"If multiple valid approaches exist, present options with pros/cons before implementing."
