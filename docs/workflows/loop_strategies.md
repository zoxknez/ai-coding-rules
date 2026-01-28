# 🔁 Loop Strategies & Leverage Patterns (v3)

**Purpose:** Leverage AI "stamina" (tenacity) for maximum effectiveness.

Karpathy insight:
> *"It's a 'feel the AGI' moment to watch it struggle with something for a long time just to come out victorious 30 minutes later. Stamina is a core bottleneck to work."*

---

## 🎯 Core Principle: Declarative > Imperative

```
❌ IMPERATIVE (bad):
"Click here, add this, change that..."

✅ DECLARATIVE (good):
"Goal: X works. Success criteria: [list]. Loop until met."
```

---

## 📋 Loop Pattern Catalog

### 1. TEST-FIRST LOOP (Highest Leverage!)

**When:** New functionality or bug fix

```markdown
STEP 1: "Write a failing test that demonstrates expected behavior"
STEP 2: "Implement minimum to make test pass"
STEP 3: "Run all tests, fix if anything breaks"
STEP 4: "Refactor if needed, tests must stay green"
```

**Why it works:** AI can iterate indefinitely until test passes.

---

### 2. LINT/TYPE/TEST LOOP

**When:** Every code change

```bash
# AI repeats until all pass:
1. pnpm lint        → fix lint errors
2. pnpm typecheck   → fix type errors  
3. pnpm test        → fix test failures
4. REPEAT until all green
```

**Prompt:**
```
"Run lint, typecheck, and test.
If anything fails, fix and repeat.
Loop until everything is green."
```

---

### 3. BROWSER/UI VERIFICATION LOOP

**When:** Frontend changes

```markdown
STEP 1: "Open http://localhost:3000/path"
STEP 2: "Check if X works"
STEP 3: "If not working, read console/network errors"
STEP 4: "Fix based on error"
STEP 5: "Repeat until working"
```

**Prompt:**
```
"Open page in browser, test flow:
1. Click button
2. Expect modal
3. Submit form
4. Expect success message

Loop until working. Max 5 iterations."
```

---

### 4. NAIVE → CORRECT → OPTIMIZE LOOP

**When:** Performance-sensitive code

```markdown
PHASE 1: NAIVE
"Build simplest correct version. Ignore performance."

PHASE 2: TEST
"Add tests for all behaviors. All must pass."

PHASE 3: BENCHMARK
"Measure performance: time, memory, queries."

PHASE 4: OPTIMIZE
"Optimize. Tests must stay green.
Measure again. Loop until you hit target."
```

---

### 5. ERROR-DRIVEN DEBUGGING LOOP

**When:** Bug hunting

```markdown
STEP 1: "Reproduce bug - show exact steps"
STEP 2: "Identify error message/stack trace"
STEP 3: "Hypothesis: cause is X"
STEP 4: "Create fix for hypothesis"
STEP 5: "Test - is bug gone?"
STEP 6: "If not, new hypothesis, repeat"
```

**Prompt:**
```
"Bug: [description]
Repro: [steps]
Expected: [X]
Actual: [Y]

Debug loop:
1. Add logs to find root cause
2. Hypothesis
3. Fix
4. Test repro
5. Repeat until fixed"
```

---

### 6. MULTI-FILE REFACTOR LOOP

**When:** Larger changes (with caution!)

```markdown
STEP 1: "Create plan: which files, what order"
STEP 2: "Change 1 file, verify everything works"
STEP 3: "Commit checkpoint"
STEP 4: "Next file, repeat"
STEP 5: "Final verification: lint + typecheck + tests"
```

**Guardrail:**
```
"If plan requires >5 files, stop and propose smaller scope."
```

---

### 7. DOCUMENTATION EXTRACTION LOOP

**When:** Documentation from code

```markdown
STEP 1: "Read code and extract API contract"
STEP 2: "Write documentation"
STEP 3: "Verify: does documentation match code?"
STEP 4: "Fix discrepancies"
STEP 5: "Repeat until 100% accurate"
```

---

### 8. MIGRATION/UPGRADE LOOP

**When:** Dependency upgrades, schema migrations

```markdown
STEP 1: "Create backup/checkpoint"
STEP 2: "Apply change"
STEP 3: "Run tests"
STEP 4: "If fails, fix and repeat"
STEP 5: "If 3 iterations fail, rollback and ask"
```

---

## ⚙️ Loop Configuration

### Max Iterations
```
| Loop Type          | Max Iterations | After Max         |
|--------------------|----------------|-------------------|
| Lint/Type/Test     | 10             | Ask for help      |
| Browser verify     | 5              | Report findings   |
| Debug              | 5              | Escalate          |
| Optimization       | 3              | Report tradeoffs  |
```

### Stop Conditions
```
STOP if:
- Same error 2x → change approach
- >10 iterations → escalate
- Scope growing → propose MVP
- Contradictory requirements → ask
```

---

## 📊 Leverage Metrics

**What to measure to know loop is working:**

| Metric | Good sign | Bad sign |
|--------|-----------|----------|
| Iterations to success | <5 | >10 |
| Test coverage | Increasing | Same |
| Code simplicity | Lower LOC | Higher LOC |
| Regressions | 0 | >0 |

---

## 🎮 Quick Prompt Templates

### Test Loop
```
"Write test for [X]. Implement to pass. Loop until green."
```

### Debug Loop
```
"Bug: [description]. Repro: [steps]. Debug, fix, verify. Max 5 iterations."
```

### Optimize Loop
```
"Baseline: [current]. Target: [goal]. Optimize, measure, loop until achieved."
```

### Verify Loop
```
"Run: lint, typecheck, test. Fix errors. Repeat until all pass."
```

---

## 🚨 Anti-Patterns (Loops Gone Wrong)

### ❌ Infinite Scope Creep
```
Problem: Each iteration adds new feature
Fix: "Scope is LOCKED. Only [X]. Nothing more."
```

### ❌ Oscillating Fixes
```
Problem: Fix for A breaks B, fix for B breaks A
Fix: "Create test for both. Both must pass simultaneously."
```

### ❌ Over-Optimization
```
Problem: Loop never ends because there's always "one more optimization"
Fix: "Target is [X]. When we reach it, STOP."
```

---

## 📁 Related Docs

- [agent_loop.md](agent_loop.md) — General loop workflow
- [prompt_patterns.md](prompt_patterns.md) — Prompt templates
- [quality_control.md](quality_control.md) — Verification gates
