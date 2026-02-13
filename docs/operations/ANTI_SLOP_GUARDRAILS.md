# Anti‑Slop Guardrails (v2)

> Slop = unnecessary code, bloated output, drive-by refactors, hallucinated architecture. Fight entropy with every iteration.

---

## Iteration Limits (Hard Caps)

| Constraint | Limit | Rationale |
|-----------|-------|-----------|
| Files changed per iteration | **Max 3** | Limits blast radius |
| Net LOC change | **Max 200** | Keeps diffs reviewable |
| New dependencies | **0 without approval** | Every dep is attack surface + maintenance |
| New abstractions | **0 without justification** | Premature abstraction is worse than duplication |
| New files | **Max 2** | Prevent framework proliferation |

## If Limits Are Exceeded
1. **Split** into smaller, independently verifiable iterations
2. **Justify** in writing why the larger change is atomically necessary
3. **Never** merge without extra review when exceeding limits

## Output Quality Rules

### Mandatory Cleanup (same iteration)
- ✅ Remove unused imports/vars you introduced
- ✅ Remove dead code you introduced
- ✅ Remove TODO/FIXME comments that are already addressed
- ✅ Remove console.log/print statements used for debugging
- ✅ Confirm output follows the task spec exactly

### Forbidden Patterns (AI must never produce)

| Pattern | Why It's Slop | Fix |
|---------|---------------|-----|
| `// TODO: implement later` | Deferred work disguised as progress | Implement or explicitly scope out |
| `catch (e) { /* ignore */ }` | Silent failures hide bugs | Log + handle or rethrow |
| `any` type (TypeScript) | Defeats type safety | Use proper types |
| Copy-paste with minor variations | Duplication debt | Extract shared function |
| Wrapper functions that just call another function | Useless indirection | Call directly |
| Unused function parameters | Code noise | Remove or document why needed |
| Empty CSS classes / unused styles | Dead weight | Remove |
| Commented-out code blocks | Version control exists | Delete |

### Drive-By Refactor Ban
```
Rule: Never refactor code unrelated to the current task.

If you notice a problem in passing, document it as a separate task.
Don't fix it in the same PR/iteration as your feature work.
```

## Dependency Approval Protocol

Before adding ANY new dependency:

| Question | Must Answer |
|----------|------------|
| What problem does it solve? | Specific use case, not "might be useful" |
| Is it actively maintained? | Last publish < 6 months, >100 GitHub stars |
| What is its bundle/binary size impact? | Measured, not estimated |
| Are there lighter alternatives? | Check if stdlib or existing deps cover it |
| What is the security surface? | Number of transitive dependencies |
| Can this be implemented in <50 LOC? | If yes, don't add the dependency |

### Severity: Adding a dependency to fix a one-liner = instant reject.

## Code Volume Heuristics

| Signal | Action |
|--------|--------|
| Generating > 100 LOC without tests | Stop, write tests first |
| Creating > 2 new files for a simple feature | Reconsider architecture |
| Introducing a design pattern for 1 use case | Remove the pattern, use plain code |
| Adding configuration for something that has one value | Hardcode it |
| Building an abstraction used exactly once | Inline it |

## Anti-Hallucination Rules

| Don't | Do |
|-------|-----|
| Invent API endpoints that don't exist | Check the actual API/docs first |
| Assume a library has a method | Verify in docs or types |
| Generate plausible-looking mock data | Use real schema + faker |
| Create files in directories that don't exist | Check project structure first |
| Reference environment variables that aren't set | Check .env.example or docs |

## Verification Checklist (End of Every Iteration)

```
□ All changes are within the task scope
□ No unrelated modifications
□ No new dependencies without approval
□ No dead code, unused imports, debug output
□ Output compiles/passes linting
□ Tests exist and pass for new code
□ Diff is humanly reviewable (< 200 LOC)
□ Every new file/function has a clear reason to exist
```

## Related Docs
- [global_rules](../core/global_rules.md) — Golden Rule hierarchy
- [agent_loop](../workflows/agent_loop.md) — the verification step enforces these
- [code_review_rubric](../quality/code_review_rubric.md) — scoring criteria
