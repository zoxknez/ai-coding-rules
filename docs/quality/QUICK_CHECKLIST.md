# ✅ Vibe Coding Quick Checklist

> **Instant Verification for AI-Assisted Development**
> 
> Print this. Tape it to your monitor. Check after every AI session.

---

## 🚦 Pre-Flight Checks

Before asking AI to implement anything:

- [ ] **Proposal exists** — For features >10 LOC
- [ ] **Context is fresh** — <50 messages in conversation
- [ ] **task_on_hand.md is current** — Last step documented
- [ ] **Tests exist** — For code being modified

---

## 📏 Code Quality Thresholds

### File Size Limits

| Type | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| Component file | 200 | Split into smaller components |
| Utility file | 150 | Extract modules |
| Any file | 300 | 🔴 MUST refactor before adding |
| Test file | 400 | Split by feature |

### Function Size Limits

| Type | Max Lines | Action if Exceeded |
|------|-----------|-------------------|
| Function | 50 | Extract helper functions |
| React component body | 100 | Extract hooks/components |
| API handler | 75 | Extract service layer |

### Complexity Limits

| Metric | Max | Action if Exceeded |
|--------|-----|-------------------|
| Nesting depth | 3 | Use early returns |
| Parameters | 4 | Use options object |
| Branches in function | 5 | Extract strategy pattern |
| Cyclomatic complexity | 10 | Split function |

---

## 🔄 After Every Implementation

### Immediate Checks

- [ ] **Tests pass** — `npm test`
- [ ] **Types check** — `npm run typecheck`
- [ ] **Lint passes** — `npm run lint`
- [ ] **Build succeeds** — `npm run build`

### Git Discipline

- [ ] **Commit after success** — Don't batch commits
- [ ] **Meaningful message** — `type(scope): description`
- [ ] **Small commits** — One logical change per commit

```bash
# Good commit flow
git add .
git commit -m "feat(auth): add Google OAuth provider"
# Not: "WIP" or "changes" or "fix stuff"
```

### Documentation

- [ ] **Update task_on_hand.md** — Mark step complete
- [ ] **Add JSDoc** — For public functions
- [ ] **Update README** — If user-facing change

---

## 🛡️ Security Checklist

### For Every PR

- [ ] No secrets in code
- [ ] No PII in logs
- [ ] Input validated at boundaries
- [ ] Auth checked on protected routes
- [ ] SQL queries parameterized

### Never Do

```
❌ Modify .env files
❌ Hardcode credentials
❌ Trust user input without validation
❌ Use mock data in production
❌ Expose stack traces to users
```

---

## 🧪 TDD Flow

```
1. Write failing test    → RED
2. Write minimal code    → GREEN  
3. Refactor if needed    → REFACTOR
4. Commit                → SAVE
5. Repeat
```

### Test Requirements

| Code Type | Test Required |
|-----------|--------------|
| New feature | ✅ Yes — unit + integration |
| Bug fix | ✅ Yes — test that reproduces bug |
| Refactor | ⚠️ Existing tests must pass |
| Config change | ❌ No — manual verification |

---

## 📐 Placeholders for Portability

Use placeholders to make rules portable:

```
{{PROJECT_NAME}}     → actual project name
{{FRAMEWORK}}        → next, express, fastapi, etc.
{{DB_TYPE}}          → postgres, mysql, mongodb
{{AUTH_PROVIDER}}    → next-auth, clerk, supabase
{{UI_LIBRARY}}       → shadcn, chakra, mui
{{TEST_FRAMEWORK}}   → vitest, jest, pytest
```

### Example Usage

```markdown
# Rules for {{PROJECT_NAME}}

## Stack
- Framework: {{FRAMEWORK}}
- Database: {{DB_TYPE}}
- Auth: {{AUTH_PROVIDER}}

## Commands
- Test: `npm test` ({{TEST_FRAMEWORK}})
- Build: `npm run build`
```

---

## 🔴 Context Rot Signs

Watch for these symptoms:

| Sign | Action |
|------|--------|
| AI forgets file names | Update task_on_hand.md, refresh context |
| AI suggests rejected solutions | Remind of decision, add to rules |
| Responses become generic | Start new conversation with context |
| AI contradicts itself | Stop, commit, start fresh |

### Recovery

```bash
# Commit working state
git add -A && git commit -m "checkpoint: before context refresh"

# Update task_on_hand.md with current state

# Start new conversation with:
"Read task_on_hand.md and continue from the last checkpoint."
```

---

## 📊 Session Stats to Track

| Metric | Target | Red Flag |
|--------|--------|----------|
| Messages | <50 | >100 |
| Files modified | <5 | >10 |
| Uncommitted changes | 0 | >3 steps |
| Test coverage | >80% | <60% |

---

## 🚀 Quick Commands

### Start New Feature

```
Create proposal for: [FEATURE]
After approval, implement with TDD.
Commit after each passing test.
```

### Resume Work

```
Read task_on_hand.md.
Continue from last completed step.
Run tests before making changes.
```

### Check Quality

```
Check for code smells using R.E.F.A.C.T.:
- Files >300 lines?
- Functions >50 lines?
- Nesting >3 levels?
If found, propose refactoring.
```

### End Session

```
Update task_on_hand.md with:
- Last completed step
- Next step to do
- Any blockers

Commit all changes.
```

---

## 📋 One-Page Summary

```
┌─────────────────────────────────────────────────────────────┐
│  BEFORE CODING                                              │
│  ✓ Proposal approved (>10 LOC)                             │
│  ✓ Context <50 messages                                     │
│  ✓ task_on_hand.md current                                  │
├─────────────────────────────────────────────────────────────┤
│  DURING CODING                                              │
│  ✓ TDD: test → code → refactor → commit                    │
│  ✓ Files <300 lines, Functions <50 lines                   │
│  ✓ Validate all input at trust boundaries                  │
│  ✓ No secrets, no PII in logs                              │
├─────────────────────────────────────────────────────────────┤
│  AFTER EACH STEP                                            │
│  ✓ Tests pass                                               │
│  ✓ Commit with meaningful message                          │
│  ✓ Update task_on_hand.md                                   │
├─────────────────────────────────────────────────────────────┤
│  CONTEXT ROT? (>50 messages, generic responses)             │
│  → Commit → Update task_on_hand → New conversation          │
└─────────────────────────────────────────────────────────────┘
```
