# AI Agent Operating Manual (v2)

> **How AI agents operate in this repository**
>
> This document defines the contract between human developers and AI coding agents.
> It governs agent behavior, boundaries, communication, and quality expectations.

---

## Agent Initialization

### Startup Sequence

When an AI agent begins a session, it MUST:

```
1. Read project_profile.md       → Understand project context
2. Read MASTER_RULES.md          → Load operating rules
3. Read CONSTITUTION.md          → Load non-negotiable boundaries
4. Read STRICT_MODE.md           → Load security invariants
5. Check MEMORY_BANK.md          → Load previous decisions and context
6. Identify relevant stack guide → Load stack-specific rules
```

### Context Verification

Before writing any code, verify:

```markdown
- [ ] I understand the project's tech stack
- [ ] I know the directory structure conventions
- [ ] I know the testing framework and patterns
- [ ] I know the linting/formatting tools
- [ ] I have read any relevant ADRs
- [ ] I have checked for existing patterns to follow
```

---

## Operating Principles

### The Agent Contract

```
INPUT:  Task description + success criteria + constraints
OUTPUT: Assumptions → Plan → Patch → Verification → Notes
```

Every agent response MUST follow this structure:

1. **Assumptions** — what I'm assuming about the task (mark critical with RED_FLAG)
2. **Plan** — what I intend to do (step-by-step, reviewable)
3. **Patch** — the actual code changes (minimal diff)
4. **Verification** — how to verify the changes work
5. **Notes** — edge cases, risks, follow-up items

### Core Rules

| Rule | Description |
|------|-------------|
| **Minimal diff** | Change only what the task requires — nothing more |
| **No scope creep** | If something is out of scope, note it but don't fix it |
| **Ask, don't guess** | When requirements are ambiguous, ask for clarification |
| **Match existing patterns** | Follow the patterns already in the codebase |
| **One task at a time** | Focus on the current task completely before moving on |
| **Test before ship** | Every change must be verifiable |

---

## Assumptions Ledger

### Risk Levels

```markdown
🟢 LOW    — Reasonable assumption, unlikely to be wrong
🟡 MEDIUM — Assumption based on conventions, could vary
🔴 HIGH   — Critical assumption that could invalidate the solution
```

### Format

```markdown
## Assumptions

🟢 Database is PostgreSQL (based on prisma schema)
🟡 Auth middleware is applied globally (based on route structure)
🔴 User deletion should cascade to orders (NOT confirmed — please verify)
```

### Rules

- **Every 🔴 assumption MUST be confirmed** before proceeding with implementation.
- If an assumption would change the approach, stop and ask.
- Log assumptions even if they seem obvious — future agents need this context.

---

## Task Execution Flow

### Step 1: Understand

```markdown
Before writing code:
1. Read the full task description
2. Identify success criteria (what does "done" mean?)
3. Identify constraints (what CAN'T I do?)
4. Check for related code/tests/docs
5. List assumptions
```

### Step 2: Plan

```markdown
Write a plan that a reviewer can approve BEFORE implementation:
1. Files to modify (and why)
2. Functions to add/change (and what they do)
3. Tests to add (and what they verify)
4. Order of operations
```

### Step 3: Implement

```markdown
Follow the plan:
1. Make changes in the planned order
2. Keep diffs small and focused
3. Run lint/typecheck/tests after each logical change
4. If the plan needs to change, explain why
```

### Step 4: Verify

```markdown
Before submitting:
1. Run full test suite
2. Check lint + typecheck
3. Manually verify the change works
4. Review your own diff (would you approve this PR?)
5. Update MEMORY_BANK.md with decisions made
```

---

## Simplify Pass

After every task, run a simplify pass:

```markdown
## Simplify Checklist

- [ ] Can any new abstraction be removed without losing clarity?
- [ ] Can any new file be merged into an existing one?
- [ ] Can any new dependency be avoided?
- [ ] Is the solution simpler than the problem requires?
- [ ] Would a junior developer understand this code?
```

If the solution seems larger than necessary:
1. Remove unnecessary abstractions.
2. Inline functions that are called only once.
3. Remove dead code introduced during iteration.
4. Preserve correctness — simplify, don't break.

---

## Multi-Agent Coordination

When multiple agents work on the same codebase:

### Conflict Prevention

```markdown
1. Lock scope — each agent works on designated files/features
2. No overlapping file edits — coordinate through task assignments
3. Use MEMORY_BANK.md as shared context
4. Agent B should read Agent A's output before starting
```

### Handoff Protocol

```markdown
## Agent Handoff

**From:** [Agent/Role]
**To:** [Agent/Role]
**Context:** [What was done, what remains]

### Completed
- List of completed items

### In Progress
- Current state of work

### Blocked
- Items needing human decision

### Key Decisions Made
- Decision 1: [rationale]
- Decision 2: [rationale]

### Files Modified
- file1.ts — [what changed]
- file2.ts — [what changed]
```

---

## Communication Standards

### When to Ask vs. Proceed

| Situation | Action |
|-----------|--------|
| Requirements are clear | Proceed |
| Minor ambiguity, obvious default | Proceed, note assumption |
| Multiple valid approaches | Ask which approach to use |
| Critical assumption (🔴) | STOP and ask |
| Out of scope issue found | Note it, don't fix it |
| Security concern | STOP and flag immediately |

### How to Report Issues

```markdown
## Issue Found

**Severity:** [Low/Medium/High/Critical]
**Location:** [file:line]
**Description:** What I found
**Impact:** What could go wrong
**Recommendation:** What I suggest
**Blocked:** [Yes/No] — Does this block my current task?
```

---

## Quality Gates

Before an agent's work is considered complete:

```markdown
## Completion Checklist

### Code Quality
- [ ] All lint errors resolved
- [ ] Type checking passes
- [ ] No commented-out code
- [ ] No TODO without ticket reference

### Testing
- [ ] New/modified code has tests
- [ ] All existing tests pass
- [ ] Edge cases covered

### Documentation
- [ ] Complex logic has comments explaining WHY
- [ ] Public APIs have documentation
- [ ] MEMORY_BANK.md updated with decisions

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Auth checks on protected routes
- [ ] No SQL injection risks

### Diff Discipline
- [ ] Changes are within scope
- [ ] No unnecessary refactoring
- [ ] Diff is reviewable (< 400 lines)
```

---

## Update Policy

After each completed task:

1. Update `MEMORY_BANK.md` with:
   - Decisions made and rationale
   - Patterns established
   - Gotchas discovered

2. If a new pattern was established:
   - Add it to the relevant stack guide or rule file
   - Reference it for future agents

3. If an AI failure pattern was discovered:
   - Add it to the mistake log
   - Update rules to prevent recurrence

---

*Version: 2.0.0*
