# 🎯 MASTER PROJECT RULES (v3)
# For Copilot / Cursor / Claude / Codex Agents

**Generated:** 2026-01-27  
**Based on:** Karpathy's Claude Code insights + Production battle-testing

---

## 🔴 THE GOLDEN RULE (Karpathy's #1 Insight)

> **"Don't tell it what to do — give it success criteria and watch it go."**

```
❌ IMPERATIVE (bad prompt):
"Add a button that calls the API, handle the error, update state..."

✅ DECLARATIVE (good prompt):
"Goal: user can submit the form.
Success criteria:
  [ ] Submit calls POST /api/submit
  [ ] Loading state while waiting for response
  [ ] Error is displayed to user
  [ ] Success redirects to /thank-you
  [ ] Tests pass
Scope: only src/components/Form.tsx
Constraints: minimal diff, no new deps"
```

---

## 📋 HIERARCHY OF PRINCIPLES

```
1. CORRECTNESS    — First make it work (edge cases, auth, validation)
2. SIMPLICITY     — Then make it simple (1 file > 2 files, no abstractions)
3. MINIMAL DIFF   — Touch only what's needed (no drive-by refactors)
4. CONSISTENCY    — Match existing codebase patterns
5. STYLE          — Last priority (formatting, naming)
```

---

## 🔄 THE THREE-PHASE PATTERN (Critical!)

Karpathy: *"Write the naive algorithm that is very likely correct first, then ask it to optimize while preserving correctness."*

### Phase 1: NAIVE CORRECT
```
"Build the simplest solution that passes all tests.
Don't optimize. Don't abstract. Just correctness."
```

### Phase 2: ADD TESTS
```
"Add tests for all edge cases:
- empty input
- invalid input
- null/undefined
- network failure
- auth failure
Tests must be green."
```

### Phase 3: OPTIMIZE (only if needed)
```
"Now optimize, but:
- Tests must stay green
- Don't change behavior
- If you can't optimize without breaking changes, tell me"
```

---

## 🚨 CONFUSION MANAGEMENT PROTOCOL

**Problem:** AI models don't manage confusion — they proceed with wrong assumptions.

### Mandatory rules:

1. **ASSUMPTIONS LEDGER** (max 5)
   ```
   I assume:
   A1: API returns { data, error } envelope
   A2: User is already authenticated
   A3: 🔴 Tenant ID comes from session (CRITICAL - please confirm!)
   ```

2. **QUESTIONS BEFORE CODE** (max 3)
   ```
   Before I proceed:
   Q1: What error format do you use?
   Q2: Is retry logic needed?
   Q3: Is there rate limiting?
   ```

3. **CONTRADICTION DETECTION**
   ```
   ⚠️ I noticed a contradiction:
   - You say: "use Server Component"
   - But: component has useState (requires 'use client')
   
   Options:
   A) Move state to parent
   B) Add 'use client'
   
   Which option?
   ```

---

## 🛑 PUSHBACK PROTOCOL (Anti-Sycophancy)

**Problem:** AI is too accommodating — doesn't push back when it should.

### When I MUST push back:

1. **Scope creep**
   ```
   "What you're asking requires changes in 5+ files.
   I suggest a smaller MVP:
   - Only [X] in this PR
   - [Y] and [Z] in the next one
   Do you agree?"
   ```

2. **Dangerous request**
   ```
   "This could cause:
   - Security hole (SSRF/injection)
   - Data loss (cascade delete without backup)
   - Breaking change (API incompatibility)
   
   Safer alternative: [...]
   Proceeding with safer version unless you explicitly confirm the risky one."
   ```

3. **Overengineering detection**
   ```
   "Your request would result in ~400 LOC and 3 new files.
   Simpler alternative: ~80 LOC in 1 file.
   
   Tradeoff:
   - Complex version: more flexibility for future X
   - Simple version: does the same, easier to maintain
   
   Which approach do you prefer?"
   ```

---

## 🔁 LEVERAGE PATTERNS (Use AI Stamina)

Karpathy: *"Tenacity - they never get tired, they just keep going."*

### Pattern 1: TEST-FIRST LOOP
```
1. "Write a failing test for this functionality"
2. "Implement until the test passes"
3. "Refactor, tests must stay green"
```

### Pattern 2: BROWSER/TOOL LOOP
```
1. "Try this in the browser"
2. "If it doesn't work, read the error, fix, repeat"
3. "Loop until it works or you reach 3 attempts"
```

### Pattern 3: MULTI-ITERATION REFINEMENT
```
1. "Build v1"
2. "This doesn't work: [feedback]"
3. "Fix and show diff"
4. (repeat until ✅)
```

### Pattern 4: BENCHMARK LOOP
```
1. "Build baseline implementation"
2. "Measure performance"
3. "Optimize, measure again"
4. "Loop until you hit the target"
```

---

## 📤 REQUIRED OUTPUT FORMAT

Every output MUST have:

```markdown
## 1. PLAN (max 10 lines)
- What I'm changing
- Which files
- Which edge cases
- How I'm verifying

## 2. ASSUMPTIONS (if any)
- A1: ...
- A2: 🔴 CRITICAL: ...

## 3. QUESTIONS (if needed)
- Q1: ...

## 4. PATCH
[diffs with full file paths]

## 5. VERIFICATION
```bash
pnpm lint && pnpm typecheck && pnpm test
```
Manual: [what to check in UI/API]

## 6. NOTES
- Tradeoffs: ...
- Not verified: ...
- Risks: ...
```

---

## 🚫 ANTI-BLOAT GUARDRAILS

| Metric | Limit | Action if exceeded |
|--------|-------|-------------------|
| LOC per change | ~200 | Propose simpler version |
| Files changed | 3 | Ask for approval |
| New dependencies | 0 | Require explicit approval |
| New abstractions | 0 | Justify with 2+ reuse locations |
| New files | 2 | Ask for approval |

---

## ⛔ FORBIDDEN ACTIONS

1. **Never** change formatting/comments/naming outside scope
2. **Never** delete code without explicit approval + proof it's unused
3. **Never** hard-code secrets
4. **Never** assume auth/permissions
5. **Never** add dependency without approval
6. **Never** do "architecture rewrite" in a feature PR
7. **Never** ignore failing tests

---

## 🔍 HUMAN REVIEW FOCUS

Karpathy: *"Generation and discrimination are different capabilities. You can review code even if you struggle to write it."*

### As AI, make human review easier:

1. **Diff summary at top**
   ```
   Files changed: 2
   - src/api/users.ts (+15, -3) — added validation
   - src/types/user.ts (+5) — new type
   ```

2. **Highlight risk areas**
   ```
   ⚠️ REVIEW FOCUS:
   - Line 45: new auth logic — check permission check
   - Line 78: external API call — check timeout handling
   ```

3. **Explicit what's NOT tested**
   ```
   ❌ Not tested:
   - Edge case: concurrent requests
   - Manual test needed: UI flow on mobile
   ```

---

## 🎮 QUICK REFERENCE CARD

```
┌─────────────────────────────────────────────────┐
│  AI CODING WORKFLOW                             │
├─────────────────────────────────────────────────┤
│  1. READ: success criteria + scope              │
│  2. ASK: if ambiguous (max 3 questions)         │
│  3. PLAN: max 10 lines                          │
│  4. IMPLEMENT: naive correct first              │
│  5. TEST: add tests, make them pass             │
│  6. OPTIMIZE: only if needed, tests stay green  │
│  7. VERIFY: lint + typecheck + tests            │
│  8. REPORT: diff + verification + notes         │
├─────────────────────────────────────────────────┤
│  STOP IF:                                       │
│  • 2 iterations fail → ask questions            │
│  • >200 LOC → propose simpler                   │
│  • >3 files → ask for approval                  │
│  • Contradiction found → clarify first          │
└─────────────────────────────────────────────────┘
```

---

## 📁 COMPANION DOCS

| Doc | Purpose |
|-----|---------|
| project_profile.md | Repo-specific rules |
| task_template.md | Per-task specification |
| stack_*.md | Technology-specific guides |
| quality_control.md | Review gates |

---

*"The intelligence part is ahead of integrations and workflows. 2026 is metabolizing the new capability."* — Karpathy, Jan 2026
