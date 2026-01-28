# 📋 Spec-Driven Development (OpenSpec)

> **Plan Before You Code — No More "Vibe" Disasters**
>
> Professional workflow that requires AI to propose, get approval, then implement.
> Prevents scope creep, clarifies requirements, and creates audit trail.

---

## 🎯 The Problem with "Vibe Coding"

```
❌ User: "Add authentication to my app"
❌ AI: *Writes 500 lines of auth code*
❌ User: "I meant just Google Sign-In, not a full auth system!"
```

**Result:** Wasted time, wrong implementation, frustration.

---

## ✅ The Solution: Three Phases

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  PROPOSAL   │  →   │   APPLY     │  →   │  ARCHIVE    │
│             │      │             │      │             │
│ Plan first  │      │ Implement   │      │ Clean up    │
│ Get approval│      │ Test        │      │ Document    │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 📝 Phase 1: PROPOSAL

**Rule:** AI must generate `proposal.md` BEFORE writing any code.

### Proposal Template

```markdown
# Proposal: [Feature Name]

**Date:** YYYY-MM-DD
**Author:** [AI/Human]
**Status:** 🟡 Pending Approval

---

## 1. Goal

[One-sentence description of what this achieves]

## 2. Success Criteria

- [ ] [Measurable outcome 1]
- [ ] [Measurable outcome 2]
- [ ] [Measurable outcome 3]

## 3. Scope

### In Scope
- [What WILL be done]
- [What WILL be done]

### Out of Scope
- [What will NOT be done]
- [What will NOT be done]

## 4. Technical Approach

### Files to Create
| File | Purpose |
|------|---------|
| `src/auth/google.ts` | Google OAuth implementation |
| `src/auth/google.test.ts` | Unit tests |

### Files to Modify
| File | Change |
|------|--------|
| `src/app/api/auth/route.ts` | Add Google OAuth endpoint |

### Dependencies
| Package | Reason |
|---------|--------|
| `next-auth` | OAuth abstraction |

## 5. Alternatives Considered

| Option | Pros | Cons | Decision |
|--------|------|------|----------|
| next-auth | Batteries included | Heavier | ✅ Selected |
| Custom OAuth | Lightweight | More code | ❌ Rejected |

## 6. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Token storage | Security | Use httpOnly cookies |

## 7. Testing Plan

- [ ] Unit tests for auth logic
- [ ] Integration test for OAuth flow
- [ ] Manual test: complete sign-in flow

## 8. Estimated Effort

| Task | Time |
|------|------|
| Implementation | 2 hours |
| Testing | 1 hour |
| Documentation | 30 min |
| **Total** | **3.5 hours** |

---

## Approval

- [ ] User approves scope
- [ ] User approves technical approach
- [ ] User approves timeline

**Approval Date:** ___________
```

---

## 🔨 Phase 2: APPLY

**Rule:** Only after approval, implement the proposal.

### Implementation Checklist

```markdown
## Implementation Progress

**Proposal:** [link to proposal.md]
**Started:** YYYY-MM-DD HH:MM

### Completed
- [x] Created `src/auth/google.ts`
- [x] Added Google OAuth endpoint
- [x] Unit tests passing

### In Progress
- [ ] Integration tests

### Blocked
- [ ] Need Google OAuth credentials (waiting for user)

### Commits
| Commit | Message |
|--------|---------|
| abc123 | feat: add Google OAuth provider |
| def456 | test: add auth unit tests |
```

### Commit After Each Step

```bash
# After each successful implementation step:
git add .
git commit -m "feat(auth): [description] - per proposal.md"
```

---

## 📦 Phase 3: ARCHIVE

**Rule:** After merge, clean up and document.

### Archive Checklist

- [ ] Move `proposal.md` to `docs/proposals/YYYY-MM-feature.md`
- [ ] Update README if needed
- [ ] Update CHANGELOG
- [ ] Close related issues
- [ ] Delete any scratch files

### Proposal Archive Structure

```
docs/
└── proposals/
    ├── 2026-01-auth-google.md      # Implemented
    ├── 2026-01-dashboard-v2.md     # Implemented
    └── rejected/
        └── 2026-01-graphql.md      # Not implemented
```

---

## 🤖 AI Assistant Rules

### Before Any Implementation

```markdown
RULE: Never write implementation code until a proposal exists and is approved.

When asked to implement something:
1. Generate proposal.md with full details
2. Ask: "Please review this proposal. Should I proceed?"
3. Wait for explicit approval
4. Only then begin implementation

If asked to "just do it" or "skip the proposal":
Respond: "I recommend a quick proposal to align on scope. 
It will take 2 minutes and prevent rework. Shall I create one?"
```

### Exception: Trivial Changes

Skip proposal for:
- Bug fixes with clear root cause
- Typo corrections
- Formatting changes
- <10 LOC changes

### Proposal Triggers

Require proposal for:
- New features
- Architecture changes
- Database migrations
- Breaking changes
- Changes to >3 files
- Changes to >100 LOC

---

## 📋 Quick Commands

### Generate Proposal

```
Create a proposal for: [FEATURE]

Include:
- Goal and success criteria
- Scope (in/out)
- Files to create/modify
- Testing plan
- Time estimate

Output format: proposal.md template
```

### Approve Proposal

```
Approved. Proceed with implementation per proposal.
Update task_on_hand.md after each step.
Commit after each successful step.
```

### Reject/Modify Proposal

```
Proposal needs changes:
- [Change 1]
- [Change 2]

Please update and resubmit.
```

---

## 🔄 Integration with Other Tools

### With task_on_hand.md

```markdown
## 🎯 Current Task

**Goal:** Implement Google OAuth per proposal.md

**Proposal:** ./proposals/2026-01-auth-google.md
**Status:** ✅ Approved

## ✅ Completed Steps
1. [x] Created auth provider — `src/auth/google.ts` — abc123
```

### With R.E.F.A.C.T.

Before implementing from proposal:
1. **R**ecognise — Check existing code for smells
2. If refactoring needed, update proposal with refactoring scope
3. Get re-approval if scope changed

### With Git Workflow

```bash
# Branch per proposal
git checkout -b feat/auth-google-proposal-2026-01

# Commit references proposal
git commit -m "feat(auth): add Google OAuth - per 2026-01 proposal"

# PR description links to proposal
# "Implements proposal: docs/proposals/2026-01-auth-google.md"
```

---

## 📊 Benefits

| Before (Vibe) | After (Spec-Driven) |
|---------------|---------------------|
| Ambiguous scope | Clear success criteria |
| Scope creep | Documented boundaries |
| Wrong implementation | Approved approach |
| No audit trail | Full documentation |
| Wasted rework | Aligned expectations |

---

## Example Proposal

```markdown
# Proposal: Add Dark Mode Toggle

**Date:** 2026-01-28
**Status:** 🟡 Pending Approval

## 1. Goal
Users can toggle between light and dark themes.

## 2. Success Criteria
- [ ] Toggle button in header
- [ ] Preference persists across sessions
- [ ] System preference respected by default
- [ ] Smooth transition animation

## 3. Scope

### In Scope
- Theme toggle component
- CSS variables for colors
- localStorage persistence

### Out of Scope
- Per-component theme overrides
- Custom color picker
- High contrast mode

## 4. Technical Approach

### Files to Create
| File | Purpose |
|------|---------|
| `src/components/ThemeToggle.tsx` | Toggle component |
| `src/hooks/useTheme.ts` | Theme state hook |

### Files to Modify
| File | Change |
|------|--------|
| `src/styles/global.css` | Add CSS variables |
| `src/app/layout.tsx` | Add theme provider |

## 5. Testing Plan
- [ ] Toggle changes theme
- [ ] Preference persists on reload
- [ ] System preference detected
```
