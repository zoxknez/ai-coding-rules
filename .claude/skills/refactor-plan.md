# Skill: Refactor Plan

> Strategic refactoring planning with risk assessment and incremental steps.

## When to Use

- Before major code restructuring
- When technical debt is blocking progress
- When preparing for new feature development
- When improving test coverage
- When addressing performance issues

## What It Analyzes

| Aspect | Analysis |
|--------|----------|
| **Code Smells** | Long methods, large classes, duplicate code |
| **Coupling** | Tight coupling, circular dependencies |
| **Cohesion** | Mixed responsibilities, god objects |
| **Complexity** | Cyclomatic complexity, nesting depth |
| **Testability** | Hard-to-test code, missing seams |
| **Dependencies** | External coupling, version conflicts |

## Output Format

```markdown
## Refactoring Plan

**Target:** `{file_or_module}`
**Planner:** Claude (AI)
**Date:** {date}
**Estimated Effort:** {hours/days}

### Current State Assessment

**Code Health Score:** {A|B|C|D|F}

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Cyclomatic Complexity | {n} | <10 | {✅|⚠️|❌} |
| Lines per Function | {n} | <50 | {✅|⚠️|❌} |
| Nesting Depth | {n} | <4 | {✅|⚠️|❌} |
| Test Coverage | {n}% | >80% | {✅|⚠️|❌} |
| Duplicate Code | {n}% | <5% | {✅|⚠️|❌} |

### Identified Issues

| Priority | Issue | Location | Impact |
|----------|-------|----------|--------|
| P1 | {issue} | `{file}:{line}` | {impact} |
| P2 | {issue} | `{file}:{line}` | {impact} |

### Refactoring Strategy

**Approach:** {Extract Method | Extract Class | Introduce Interface | Replace Conditional with Polymorphism | etc.}

**Pattern Applied:** {Strategy | Factory | Decorator | etc.}

### Step-by-Step Plan

#### Phase 1: Safety Net (Tests)
- [ ] Add characterization tests for current behavior
- [ ] Ensure all edge cases are covered
- [ ] Verify tests pass before changes

```typescript
// Example test to add
describe('{module}', () => {
  it('should {expected_behavior}', () => {
    // Characterization test
  });
});
```

#### Phase 2: Extract/Isolate
- [ ] {specific step 1}
- [ ] {specific step 2}
- [ ] Run tests after each step

```typescript
// Before
{code_before}

// After
{code_after}
```

#### Phase 3: Simplify
- [ ] {specific step}
- [ ] {specific step}

#### Phase 4: Clean Up
- [ ] Remove dead code
- [ ] Update documentation
- [ ] Final test run

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| {risk} | {H|M|L} | {H|M|L} | {mitigation} |

### Rollback Plan
1. All changes in feature branch
2. Each phase is a separate commit
3. If tests fail, revert to last green commit
4. Keep old code commented until verified

### Dependencies
- **Blocked By:** {nothing | list}
- **Blocks:** {nothing | list}
- **Notify:** {stakeholders}

### Success Criteria
- [ ] All existing tests pass
- [ ] New tests added for extracted components
- [ ] Code coverage maintained or improved
- [ ] No new linting errors
- [ ] Performance not degraded (benchmark if applicable)

### Verification Commands
```bash
pnpm test                    # All tests pass
pnpm lint                    # No new errors
pnpm typecheck               # Type safety maintained
pnpm test:coverage           # Coverage >= {n}%
```
```

## STRICT Mode Rules

These are **non-negotiable** during refactoring:

1. **NEVER** refactor without tests (add them first if missing)
2. **NEVER** change behavior while refactoring (separate commits)
3. **NEVER** do "big bang" refactors (incremental only)
4. **ALWAYS** commit after each successful step
5. **ALWAYS** run tests after each change
6. **ALWAYS** keep the code working at each step

## Refactoring Catalog

| Smell | Refactoring | Risk |
|-------|-------------|------|
| Long Method | Extract Method | Low |
| Large Class | Extract Class | Medium |
| Duplicate Code | Extract Function/Module | Low |
| Long Parameter List | Introduce Parameter Object | Low |
| Switch Statements | Replace with Polymorphism | Medium |
| Feature Envy | Move Method | Medium |
| Data Clumps | Extract Class | Medium |
| Primitive Obsession | Replace with Value Object | Medium |
| Parallel Inheritance | Collapse Hierarchy | High |
| Shotgun Surgery | Move Field/Method | High |

## Example

**Input:** "Plan refactoring for UserService - it's 500 lines"

**Output:**

```markdown
## Refactoring Plan

**Target:** `src/services/UserService.ts`
**Planner:** Claude (AI)
**Date:** 2026-01-28
**Estimated Effort:** 4 hours

### Current State Assessment

**Code Health Score:** D

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Cyclomatic Complexity | 45 | <10 | ❌ |
| Lines per Function | 120 | <50 | ❌ |
| Nesting Depth | 6 | <4 | ❌ |
| Test Coverage | 35% | >80% | ❌ |

### Identified Issues

| Priority | Issue | Location | Impact |
|----------|-------|----------|--------|
| P1 | God class with 12 responsibilities | L1-500 | Maintainability |
| P1 | 3 duplicated validation blocks | L45,L120,L280 | Bug risk |
| P2 | Nested callbacks 6 levels deep | L200-250 | Readability |

### Refactoring Strategy

**Approach:** Extract Class + Extract Method
**Pattern Applied:** Single Responsibility Principle

### Step-by-Step Plan

#### Phase 1: Safety Net
- [ ] Add tests for createUser() - 5 cases
- [ ] Add tests for updateUser() - 4 cases
- [ ] Add tests for validateUser() - 6 cases

#### Phase 2: Extract
- [ ] Extract UserValidator class (L45-80)
- [ ] Extract UserRepository class (L100-200)
- [ ] Extract UserNotificationService class (L300-400)

#### Phase 3: Simplify
- [ ] Replace callbacks with async/await
- [ ] Consolidate duplicate validation

### Success Criteria
- [ ] UserService.ts < 100 lines
- [ ] 4 focused classes instead of 1 god class
- [ ] Test coverage > 80%
```

## Invocation

```
/skill:refactor-plan [target] [--strict] [--phases]
```

Options:
- `--strict` - Require 100% test coverage before starting
- `--phases` - Generate detailed phase breakdown
- `--risk-analysis` - Include detailed risk matrix
