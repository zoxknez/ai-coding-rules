# Systematic Debugging Protocol (v1)

> Don't guess. Don't scatter print statements. Follow the protocol.

---

## The RAPID Framework

| Phase | Action | Time Budget |
|-------|--------|-------------|
| **R**eproduce | Confirm the bug with a minimal reproduction | 10-20% |
| **A**nalyze | Narrow the scope through systematic elimination | 30-40% |
| **P**inpoint | Identify the exact line/condition causing failure | 20-30% |
| **I**mplement | Write the smallest possible fix | 10-15% |
| **D**efend | Add regression test + document | 5-10% |

---

## Phase 1: Reproduce

### Before anything else
```
Can you reproduce the bug right now? If not, STOP. Get more information.
```

### Reproduction Checklist
- [ ] Environment (OS, runtime version, dependencies)
- [ ] Exact steps to trigger the bug
- [ ] Expected behavior vs actual behavior
- [ ] Frequency (always, sometimes, only under load)
- [ ] When it started (recent deploy? dependency update?)

### Create a Minimal Reproduction
```
Remove everything unrelated until you have the simplest case 
that still exhibits the bug. If removing something fixes the 
bug, you found a clue.
```

### Write the Failing Test First
```typescript
// ✅ Capture the bug as a test BEFORE fixing
it('should not crash when user has no email', () => {
  const user = { id: '1', name: 'Test', email: null };
  expect(() => sendWelcome(user)).not.toThrow();
  // Currently throws: "Cannot read property 'toLowerCase' of null"
});
```

---

## Phase 2: Analyze (Systematic Elimination)

### Strategy 1: Binary Search (Bisect)
```
When: Bug appeared at some point, but you don't know when.
How:
  1. Find a known-good state (commit, version)
  2. Find the current bad state
  3. Test the midpoint
  4. Recurse into the half that contains the bug
  
  git bisect start
  git bisect bad HEAD
  git bisect good v1.2.0
  # Git checks out midpoint; test and mark good/bad
```

### Strategy 2: Layer Isolation
```
When: Bug could be in any layer.
How:
  1. Test the database layer directly (raw query)
  2. Test the service layer with mocked dependencies
  3. Test the API layer with a direct HTTP call
  4. Test the UI layer with hardcoded data
  
  Whichever layer fails in isolation → bug is there.
```

### Strategy 3: Input Reduction
```
When: Bug happens with certain inputs.
How:
  1. Start with the failing input
  2. Remove fields one by one
  3. The minimum input that still fails reveals the trigger
```

### Strategy 4: Diff Analysis
```
When: "It was working yesterday."
How:
  1. git diff HEAD~5 -- src/        # Recent changes
  2. git log --oneline -20          # Recent commits
  3. npm diff / pip freeze diff     # Dependency changes
  4. Check environment variable changes
  5. Check infrastructure/config changes
```

### What NOT to Do
- ❌ Add random `console.log` statements everywhere
- ❌ Change multiple things at once "to see if it helps"
- ❌ Assume you know the cause without evidence
- ❌ Blame the framework/library without proving it
- ❌ Ask AI to "just fix it" without understanding the root cause

---

## Phase 3: Pinpoint

### Narrow to Exact Location
```
You should now know:
  ✅ Which file(s) contain the bug
  ✅ Which function/method is involved
  ✅ Which input triggers it
  ✅ What the expected vs actual behavior is

Now find the exact line where behavior diverges from expectation.
```

### Tools by Stack

| Stack | Debugger | Profiler | Trace |
|-------|----------|----------|-------|
| Node.js | `--inspect` + Chrome DevTools | `clinic.js` | OpenTelemetry |
| Python | `pdb` / `debugpy` | `cProfile` | OpenTelemetry |
| Go | `dlv` | `pprof` | OpenTelemetry |
| Rust | `rust-gdb` / `lldb` | `flamegraph` | `tracing` crate |
| Browser | Chrome DevTools | Performance tab | Network tab |

### Common Root Causes

| Category | Frequent Bugs |
|----------|--------------|
| **Null/Undefined** | Missing null checks, optional chaining needed |
| **Off-by-One** | Array index, pagination, boundary conditions |
| **Race Condition** | Async operations completing out of order |
| **State Mutation** | Shared mutable state modified unexpectedly |
| **Type Coercion** | `"0" == false`, implicit conversions |
| **Stale Closure** | Captured variable has outdated value |
| **Missing Await** | Promise returned but not awaited |
| **Case Sensitivity** | File paths, HTTP headers, DB columns |
| **Timezone** | UTC vs local, daylight saving transitions |
| **Encoding** | UTF-8 vs Latin-1, URL encoding, HTML entities |

---

## Phase 4: Implement Fix

### Rules
1. **Smallest possible change** — one logical fix per commit
2. **Fix the root cause**, not the symptom
3. **Don't refactor while fixing** — separate concerns
4. **Don't add features while fixing** — scope creep kills
5. **Verify the failing test now passes**
6. **Verify no other tests broke**

### Fix Quality Check
```
□ The fix addresses the root cause (not a workaround)
□ The fix handles related edge cases
□ The fix doesn't introduce new complexity
□ The fix is understandable without the bug context
□ Performance is not degraded
```

---

## Phase 5: Defend

### Regression Test
```
The test you wrote in Phase 1 should now pass.
Add additional edge case tests if the bug revealed a pattern.
```

### Document
```markdown
## Bug: [brief description]
**Symptom:** [what users saw]
**Root Cause:** [what actually went wrong]
**Fix:** [what was changed and why]
**Prevention:** [what could prevent similar bugs]
```

### Preventive Action
- Add type checking if the bug was a type error
- Add validation if the bug was bad input
- Add a lint rule if the bug was a common pattern
- Update tests if coverage was insufficient
- Add monitoring if the bug was hard to detect

---

## When AI Should Escalate (Not Debug)

| Signal | Action |
|--------|--------|
| Cannot reproduce after 2 attempts | Ask for more context |
| Root cause is in unfamiliar infrastructure | Escalate to ops |
| Fix requires changing > 5 files | Propose architectural fix as a separate task |
| Bug is in a third-party library | Report upstream, workaround locally |
| Bug involves data corruption | Stop, assess blast radius first |
| Security vulnerability discovered | Follow [incident_response](../operations/incident_response.md) |

## Related Docs
- [Agent Loop](agent_loop.md) — debugging is the Triage phase
- [Testing Strategy](../quality/testing_strategy.md) — writing regression tests
- [OBSERVABILITY](../operations/OBSERVABILITY.md) — using logs/traces to debug
- [incident_response](../operations/incident_response.md) — when a bug is a production incident
