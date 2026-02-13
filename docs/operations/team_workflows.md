# Team Workflows for AI-Assisted Development (v2)

> **How teams work effectively with AI coding assistants**
>
> AI tools change team dynamics. These workflows ensure AI amplifies
> productivity without degrading code quality or review discipline.

---

## PR Workflow

### PR Template (Required)

```markdown
## Summary
<!-- One sentence: what + why -->

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore / maintenance

## AI Assistance
- [ ] Fully AI-generated
- [ ] AI-assisted (human-guided)
- [ ] Human-written (no AI)
<!-- If AI-assisted, briefly describe what the AI did -->

## Changes
<!-- Bullet list of changes with rationale -->

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing performed
- [ ] Edge cases verified

## Verification Commands
```bash
# Reviewer can run these to verify
npm test
npm run lint
npm run typecheck
```

## Screenshots
<!-- Before/after for UI changes -->

## Risks & Rollback
<!-- What could go wrong? How to rollback? -->
- Risk: [describe]
- Rollback: `git revert <commit>` or [specific steps]

## Checklist
- [ ] Follows project conventions
- [ ] No hardcoded secrets
- [ ] Error handling complete
- [ ] Breaking changes documented
- [ ] Diff within budget (< 400 lines for features)
```

### PR Size Guidelines

| PR Type | Max Lines Changed | Max Files | Typical Review Time |
|---------|-------------------|-----------|-------------------|
| Bug fix | 100 | 5 | 15 min |
| Feature | 400 | 15 | 45 min |
| Refactor | 200 | 10 | 30 min |
| Config/docs | 500 | 20 | 10 min |

If a PR exceeds limits, split it. Large PRs have exponentially higher defect rates.

---

## Branch Strategy

### Recommended Flow

```
main
  ├── feature/AUTH-123-add-oauth
  ├── fix/BUG-456-null-pointer
  └── chore/update-deps
```

- **Small PRs, fast review** — merge within 24 hours.
- **Feature flags** for risky or incomplete changes on main.
- **Delete branches** after merge — no stale branches.

### Branch Protection Rules

```yaml
# Required for main branch
required_reviews: 1
dismiss_stale_reviews: true
require_status_checks:
  - lint
  - typecheck
  - test
  - security-scan
require_linear_history: true  # Squash or rebase
restrict_pushes: true         # No direct commits
```

---

## Code Review Culture

### Review Priorities

When reviewing AI-assisted PRs, focus on (in order):

1. **Correctness** — Does it do what it claims?
2. **Scope** — Does it stay within the task boundaries?
3. **Security** — Any new vulnerabilities introduced?
4. **Simplicity** — Is the solution unnecessarily complex?
5. **Performance** — Any obvious N+1, memory leaks?
6. **Conventions** — Does it match existing patterns?

### AI-Specific Review Checklist

```markdown
## AI Code Review Checklist

### Correctness
- [ ] Logic handles edge cases (null, empty, boundary values)
- [ ] Error paths are complete (not just happy path)
- [ ] Async code has proper error handling and timeouts
- [ ] No hallucinated APIs or non-existent methods used

### Scope Discipline
- [ ] Changes are within the stated task scope
- [ ] No drive-by refactoring or style changes
- [ ] No unnecessary file reorganization
- [ ] No new dependencies without justification

### Security
- [ ] No hardcoded credentials or secrets
- [ ] Input validation present and correct
- [ ] SQL queries are parameterized
- [ ] Auth/authz checks are present where needed

### Quality
- [ ] Tests cover the new/changed code
- [ ] No dead code or commented-out code
- [ ] Variable and function names are descriptive
- [ ] Complex logic has explanatory comments
```

### Review Etiquette

- **Be specific** — "This might NPE on line 42 if user is null" not "Looks wrong."
- **Explain why** — "We use factory pattern here because [reason]" not "Use factory."
- **Distinguish blocking from nits** — prefix non-blocking feedback with `nit:`.
- **Approve with comments** — if the only feedback is style/nits, approve and note.
- **Timebox reviews** — 45 minutes max; if longer, the PR is too big.

---

## Knowledge Sharing

### Prompt Cookbook

Maintain a living document of effective prompts for common tasks:

```markdown
## Prompt Cookbook

### Adding a New API Endpoint
"Add a POST /api/v1/[resource] endpoint that:
- Accepts: [schema]
- Validates: [rules]
- Returns: [response format]
- Follow existing patterns in src/api/routes/
- Add tests in tests/api/"

### Debugging a Failure
"The following test is failing: [paste test + error].
Diagnose the root cause without changing the test.
Show me the fix with minimal diff."

### Code Review
"Review this diff for: correctness, security, performance.
Provide feedback as: line number + issue + suggested fix.
Rate severity: blocker / warning / nit."
```

### Mistake Log

Track recurring AI failure patterns to prevent them:

```markdown
## AI Mistake Log

| Date | Pattern | Impact | Prevention Rule Added |
|------|---------|--------|----------------------|
| 2025-01-15 | Generated setTimeout instead of proper async | Tests flaky | "Never use setTimeout for control flow" |
| 2025-01-20 | Removed input validation during refactor | Security bug | "Keep validation when refactoring" |
| 2025-02-01 | Used deprecated API (training data cutoff) | Build break | "Verify APIs against current docs" |
| 2025-02-10 | N+1 queries in new endpoint | Performance | "Run EXPLAIN on new queries" |
```

### Tech Talks & Demos

- Monthly: "AI Tool Tips" — share effective workflows.
- Per incident: "What Went Wrong" — postmortem on AI-introduced bugs.
- Quarterly: "Tool Evaluation" — assess new AI tools and models.

---

## Onboarding New Team Members

### First Day with AI Tools

```markdown
1. Read these docs in order:
   - MASTER_RULES.md (operating principles)
   - AGENTS.md (how agents work here)
   - This file (team workflows)
   - Relevant stack guide

2. Shadow a code review of an AI-assisted PR

3. Do a guided task:
   - Use AI to implement a small feature
   - Get reviewed by a senior engineer
   - Discuss what the AI did well and poorly

4. Review the Mistake Log — learn from past failures
```

### AI Tool Configuration

```markdown
Ensure every team member has:
- [ ] AI tool installed and configured
- [ ] Project-specific rules loaded
- [ ] Git hooks installed (pre-commit, secret detection)
- [ ] Access to prompt cookbook
- [ ] Understanding of review expectations for AI code
```

---

## Metrics & Continuous Improvement

### Track These Metrics

| Metric | Target | Measured By |
|--------|--------|------------|
| PR cycle time | < 24 hours | Git analytics |
| Review turnaround | < 4 hours | PR timestamps |
| AI-assisted PR defect rate | Equal to or below human rate | Bug tracker |
| Post-merge defects | < 2% of PRs | Incident count |
| Test coverage of AI code | Same as rest of codebase | CI coverage report |
| PR size compliance | 90% within budget | PR analytics |

### Retrospective Questions

```markdown
Every 2 weeks, discuss:
1. Which AI tasks went smoothly vs. poorly?
2. Are our rules/guardrails helping or hindering?
3. Any new failure patterns to add to the Mistake Log?
4. Are PR reviews catching AI issues effectively?
5. What rules should we add, modify, or remove?
```

---

*Version: 2.0.0*
