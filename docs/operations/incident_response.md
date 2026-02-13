# Incident Response for AI-Introduced Bugs (v2)

> **When AI breaks things, respond systematically**
>
> AI-generated code fails differently than human-written code. These playbooks
> cover detection, triage, fix, and prevention of AI-introduced regressions.

---

## Severity Classification

| Severity | Definition | Response Time | Example |
|----------|-----------|---------------|---------|
| **SEV-1** | Production down, data loss, security breach | < 15 min | Auth bypass, data corruption |
| **SEV-2** | Major feature broken, significant user impact | < 1 hour | Payment failures, broken signup |
| **SEV-3** | Minor feature broken, workaround exists | < 4 hours | UI glitch, non-critical API error |
| **SEV-4** | Cosmetic, low impact | Next sprint | Typo, minor styling issue |

---

## Incident Response Playbook

### Phase 1: Detect & Triage (0-15 min)

```markdown
1. Confirm the incident
   - Reproduce the issue or verify monitoring alerts
   - Check: Is this affecting production users RIGHT NOW?

2. Classify severity (SEV-1 through SEV-4)

3. Assign incident commander
   - SEV-1/2: Senior engineer or tech lead
   - SEV-3/4: Any available engineer

4. Open incident channel
   - Dedicated Slack/Teams channel or thread
   - Pin: timeline, severity, affected systems, owner

5. Notify stakeholders
   - SEV-1: Immediate notification to engineering lead + on-call
   - SEV-2: Notification within 30 minutes
   - SEV-3/4: Update in daily standup
```

### Phase 2: Contain (15-60 min)

```markdown
1. Identify the offending change
   - git log --oneline --since="2 hours ago"
   - Check: Was this an AI-assisted commit? (look for Co-authored-by)
   - Check CI/CD deployment timestamps

2. Decide: Rollback or Hotfix?
   - Rollback if: change is isolated, no data migration involved
   - Hotfix if: rollback would cause data inconsistency or is complex

3. Execute containment
   Rollback:
     git revert <commit-hash>
     # Deploy immediately, skip non-critical CI checks

   Hotfix:
     git checkout -b hotfix/SEV1-description
     # Minimal fix, maximum 20 lines changed
     # Fast-track review (1 reviewer, focus on correctness only)

4. Verify fix in production
   - Confirm monitoring returns to normal
   - Test the exact scenario that triggered the incident
```

### Phase 3: Root Cause Analysis (1-24 hours)

```markdown
1. Identify root cause category:

   [ ] AI generated incorrect logic
   [ ] AI introduced side effects outside scope
   [ ] AI misunderstood requirements (ambiguous spec)
   [ ] AI generated code that passed tests but was wrong
   [ ] Human reviewer missed the issue
   [ ] Insufficient test coverage for the changed area
   [ ] AI hallucinated a non-existent API/library
   [ ] Race condition in AI-generated async code
   [ ] Security vulnerability in AI-generated code

2. Trace the full failure chain:
   - What was the original task/prompt?
   - What did the AI generate?
   - What did the reviewer check?
   - What tests existed (and why didn't they catch it)?
   - When did the issue reach production?
```

### Phase 4: Fix & Prevent (24-72 hours)

```markdown
1. Write regression test
   - Test MUST reproduce the exact failure
   - Test MUST pass with the fix and fail without it

2. Update rules/guardrails
   - Add to project_profile.md or prompt cookbook
   - Example: "When modifying auth code, always verify
     session invalidation on password change"

3. Update code review rubric
   - Add specific check that would have caught this
   - Example: "For AI-generated async code, verify all
     error paths are handled"

4. Strengthen CI/CD
   - Add linter rule if applicable
   - Add integration test if unit test was insufficient
   - Consider adding canary deployment step
```

---

## Postmortem Template

```markdown
## Incident Postmortem: [Title]

**Date:** YYYY-MM-DD
**Duration:** X hours Y minutes
**Severity:** SEV-N
**Commander:** [Name]

### Summary
One-paragraph summary of what happened and impact.

### Timeline
| Time (UTC) | Event |
|-----------|-------|
| HH:MM | Issue first detected (how?) |
| HH:MM | Incident declared, SEV-N |
| HH:MM | Root cause identified |
| HH:MM | Fix deployed |
| HH:MM | Incident resolved |

### Root Cause
What was the root cause? Be specific.

### AI-Specific Factors
- Was this AI-generated code? [ ] Yes [ ] No
- Was the task description clear? [ ] Yes [ ] No
- Did the AI deviate from the spec? [ ] Yes [ ] No
- Did code review catch the issue? [ ] Yes [ ] No
- Were relevant tests in place? [ ] Yes [ ] No

### Impact
- Users affected: N
- Revenue impact: $X
- Data affected: describe

### What Went Well
- Bullet list of things that worked

### What Went Wrong
- Bullet list of failures

### Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Add regression test for X | @name | YYYY-MM-DD | [ ] |
| Update AI rules to prevent Y | @name | YYYY-MM-DD | [ ] |
| Add CI check for Z | @name | YYYY-MM-DD | [ ] |

### Lessons Learned
What did we learn that applies broadly?
```

---

## Common AI-Introduced Bug Patterns

| Pattern | Description | Prevention |
|---------|-------------|------------|
| Silent logic error | Code compiles, tests pass, but logic is wrong | Property-based tests, edge case reviews |
| Scope creep mutation | AI changes files outside the requested scope | Diff budget enforcement, scope review |
| Hallucinated API | AI uses a function/method that doesn't exist | Type checking, compilation step |
| Stale pattern | AI copies outdated patterns from training data | Verify against current docs |
| Missing error path | "Happy path" only — crashes on errors | Error injection testing |
| Race condition | Async code without proper synchronization | Concurrency review checklist |
| Security regression | Removed validation, weakened auth | Security-focused review pass |
| Performance regression | N+1 queries, unnecessary computation | Load testing, query analysis |

---

## Escalation Matrix

| Situation | Action |
|-----------|--------|
| Can't identify root cause in 30 min | Escalate to senior engineer |
| SEV-1 not resolved in 1 hour | Escalate to engineering manager |
| Data breach suspected | Invoke security incident procedure |
| Same bug pattern repeats 3+ times | Schedule architecture review |
| AI tool consistently produces bad output | Re-evaluate tool/model selection |

---

## Agent Instructions

```markdown
When responding to incidents:

1. ALWAYS rollback first if the fix is not immediately obvious
2. ALWAYS write a regression test before marking resolved
3. ALWAYS update rules/guardrails to prevent recurrence
4. NEVER deploy a hotfix without at least one reviewer
5. NEVER skip the postmortem for SEV-1 or SEV-2
6. Keep the fix minimal — solve the incident, refactor later
```

---

*Version: 2.0.0*
