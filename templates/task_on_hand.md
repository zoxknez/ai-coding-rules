# 📋 Task On Hand (Context Hygiene)

> **Purpose:** Short-term memory to combat "context rot" in AI conversations.
> **Update:** After every successful implementation.
> **Read:** Before starting any new task.

---

## 🎯 Current Task

**Goal:** [Describe the current objective]

**Status:** 🔴 Not Started | 🟡 In Progress | 🟢 Completed

**Started:** YYYY-MM-DD HH:MM

---

## ✅ Completed Steps

1. [ ] Step description — `filename.ts` — [commit hash]
2. [ ] ...

---

## 🔜 Next Steps

1. [ ] Next immediate action
2. [ ] Following action
3. [ ] ...

---

## 📊 Context State

### Files Modified This Session
| File | Change Type | Status |
|------|-------------|--------|
| `src/example.ts` | CREATE | ✅ Done |
| `src/other.ts` | MODIFY | 🟡 WIP |

### Active Assumptions
- A1: [Assumption about the codebase]
- A2: 🔴 [Critical assumption - needs confirmation]
- A3: [Another assumption]

### Open Questions
- Q1: [Question that needs answer]
- Q2: [Another question]

### Blockers
- [ ] [Blocker description]

---

## 🔄 Last Successful Checkpoint

**Time:** YYYY-MM-DD HH:MM  
**Commit:** [hash]  
**State:** [Brief description of working state]

### How to resume:
```bash
git checkout [hash]
# Then continue with: [next step description]
```

---

## 📝 Session Notes

### Decisions Made
- [Decision 1: Reason]
- [Decision 2: Reason]

### Things Learned
- [Learning 1]
- [Learning 2]

### Mistakes to Avoid
- ❌ [What not to do]

---

## 🧠 Context Refresh Prompt

> Copy this to refresh the AI's context:

```
I'm continuing work on: [TASK NAME]

Current state:
- Last completed: [STEP]
- Next step: [STEP]
- Key files: [LIST]

Active assumptions:
- [A1, A2, A3]

Please read task_on_hand.md for full context, then proceed with [NEXT STEP].
```

---

## 📏 Quick Stats

| Metric | Value |
|--------|-------|
| Messages in conversation | 0 |
| Files created | 0 |
| Files modified | 0 |
| Tests passing | 0/0 |
| Commits made | 0 |

---

## ⚠️ Context Rot Prevention

### When to Update This File

1. ✅ After completing a step
2. ✅ After making a commit
3. ✅ Before asking a new question
4. ✅ When assumptions change
5. ✅ Every 10-15 messages (mandatory refresh)

### Signs of Context Rot

- 🔴 AI forgets file names
- 🔴 AI suggests already-rejected solutions
- 🔴 AI makes contradictory assumptions
- 🔴 Responses become generic/less specific

### Recovery Actions

1. Update this file with current state
2. Commit working code
3. Start new conversation with:
   ```
   Read task_on_hand.md and continue from the last checkpoint.
   ```
