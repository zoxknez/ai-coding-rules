# 🎯 Token Optimization & Context Management

**Purpose:** Reduce AI costs by 60-90% through strategic rule loading and context compression.

> Based on [Anthropic's Prompt Caching](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching) best practices and real-world production experience.

---

## 📊 The Problem

| Issue | Impact |
|-------|--------|
| Monolithic rules file | 10k+ tokens per request |
| All rules loaded always | $50+/day for heavy users |
| Context window overflow | Hallucinations, missed context |
| No rule reuse | Cache misses, repeated processing |

---

## 🧠 The Solution: Modular Rule Architecture

### 1. Rule Categories by Load Frequency

```
┌─────────────────────────────────────────────────────────────┐
│ ALWAYS LOAD (Core)           ~500-800 tokens               │
│ ├── global_rules.md (minimal version)                      │
│ └── safety guardrails                                      │
├─────────────────────────────────────────────────────────────┤
│ LOAD BY STACK (Conditional)  ~300-600 tokens each          │
│ ├── stack_frontend.md   → when editing .tsx, .jsx, .css    │
│ ├── stack_backend.md    → when editing .ts, .js (server)   │
│ ├── stack_db.md         → when editing .sql, prisma, etc   │
│ └── stack_python.md     → when editing .py                 │
├─────────────────────────────────────────────────────────────┤
│ LOAD BY TASK (On Demand)     ~200-400 tokens each          │
│ ├── security_privacy.md → auth, crypto, secrets            │
│ ├── testing.md          → when writing tests               │
│ └── incident_response.md → debugging production issues     │
└─────────────────────────────────────────────────────────────┘
```

### 2. Token Budget Guidelines

| Task Type | Max Rules | Est. Tokens | Cost/Request* |
|-----------|-----------|-------------|---------------|
| Quick fix | Core only | ~800 | $0.002 |
| Feature | Core + 1 stack | ~1,400 | $0.004 |
| Full module | Core + 2 stacks | ~2,000 | $0.006 |
| Complex refactor | Core + 3 stacks + task | ~3,000 | $0.009 |

*Based on Claude Sonnet 4 pricing ($3/MTok input)

---

## 🔧 Implementation Patterns

### Pattern 1: Cursor .mdc Files (Recommended)

Use `.cursor/rules/*.mdc` with `globs` for automatic conditional loading:

```markdown
---
description: "Load only for React/Next.js files"
globs: ["**/*.tsx", "**/*.jsx", "src/components/**/*"]
alwaysApply: false
priority: 60
---

# React/Next.js Rules
[Minimal rules here - max 500 tokens]
```

**Directory structure:**
```
.cursor/rules/
├── 00-global.mdc       # Always on (~500 tokens)
├── 20-security.mdc     # When auth/crypto files touched
├── 60-frontend.mdc     # When .tsx/.jsx files touched
├── 63-db.mdc           # When prisma/sql files touched
└── 80-vibe.mdc         # Manual activation only
```

### Pattern 2: Per-Folder .cursorrules

Place minimal `.cursorrules` in subfolders:

```
project/
├── .cursorrules              # Minimal global (~300 tokens)
├── src/
│   ├── components/
│   │   └── .cursorrules      # React-specific only
│   ├── server/
│   │   └── .cursorrules      # Backend-specific only
│   └── database/
│       └── .cursorrules      # DB-specific only
```

Each file inherits parent rules, so keep child rules **additive, not duplicative**.

### Pattern 3: RAG-Style Rule Loading (Advanced)

For agentic workflows, use a **rule index** that AI queries on-demand:

```markdown
## Rule Index (load this, reference others as needed)

| Rule | File | Load When |
|------|------|-----------|
| React patterns | stack_frontend.md#react | Editing React components |
| API routes | stack_backend.md#api | Creating/modifying API endpoints |
| Migrations | stack_db.md#migrations | Database schema changes |
| Auth | security_privacy.md#auth | Authentication/authorization |

→ AI reads index first, fetches specific section when relevant.
```

---

## 🚀 Prompt Caching Optimization

### Leverage Anthropic's Prompt Caching

1. **Place static rules at prompt start** - tools → system → messages order
2. **Use `cache_control` breakpoints** - mark end of reusable content
3. **Cache read = 10% of input cost** - 90% savings on repeated requests

### Optimal Structure for Caching

```
┌────────────────────────────────────────┐
│ SYSTEM PROMPT (cached)                 │ ← cache_control here
│ ├── Global rules (stable)              │
│ ├── Stack rules (per-project)          │
│ └── Tool definitions                   │
├────────────────────────────────────────┤
│ CONTEXT (semi-cached)                  │ ← cache_control here
│ ├── File contents                      │
│ └── Type definitions                   │
├────────────────────────────────────────┤
│ USER MESSAGE (never cached)            │
│ └── Current task/question              │
└────────────────────────────────────────┘
```

### Cache Invalidation Rules

| Change | Cache Impact |
|--------|--------------|
| Modify tool definitions | Invalidates ALL cache |
| Modify system prompt | Invalidates system + messages cache |
| Modify earlier messages | Invalidates from that point forward |
| Add new user message | No impact on prior cache |

---

## 📋 Quick-Start Checklist

### For Individual Developers

- [ ] Replace monolithic `.cursorrules` with modular `.cursor/rules/*.mdc`
- [ ] Keep `alwaysApply: true` only for `00-global.mdc`
- [ ] Use specific `globs` patterns for stack-specific rules
- [ ] Set `priority` values (higher = loaded first)
- [ ] Keep each `.mdc` file under 500 tokens

### For Teams

- [ ] Establish shared `00-global.mdc` as team standard
- [ ] Create project-specific stack rules (not global)
- [ ] Document which rules are required vs optional
- [ ] Add rule selection guide to project README
- [ ] Monitor token usage and optimize weekly

### For Agentic Workflows

- [ ] Create lightweight rule index (~200 tokens)
- [ ] Structure rules with clear section headers
- [ ] Enable AI to fetch sections on-demand
- [ ] Use hierarchical loading: core → stack → task
- [ ] Implement "rule not found" fallback behavior

---

## 📉 Cost Reduction Examples

### Before (Monolithic)
```
MASTER_RULES.md: 8,000 tokens
× 100 requests/day
× $3/MTok
= $2.40/day = $72/month
```

### After (Modular + Caching)
```
Core rules: 500 tokens (cached after 1st request)
Stack rules: 400 tokens (cached per file type)
Cache reads: 90% of requests

Effective tokens: 500 + (400 × 10% writes) = 540 tokens avg
× 100 requests/day
× $3/MTok × 0.1 (cache read discount)
= $0.016/day = $0.49/month

💰 SAVINGS: 99% reduction
```

---

## 🎯 Token Compression Techniques

### 1. Use Tables Instead of Prose

**Before (45 tokens):**
```markdown
When you're working on frontend code, you should use TypeScript.
For styling, prefer Tailwind CSS. Make sure to use React Server
Components when possible, but use Client Components when you need
interactivity.
```

**After (25 tokens):**
```markdown
| Area | Standard |
|------|----------|
| Lang | TypeScript |
| Style | Tailwind |
| React | RSC default, 'use client' for interactivity |
```

### 2. Remove Examples from Rules

Move few-shot examples to separate files, referenced only when needed:

```markdown
# ❌ Don't embed examples in rules
See `examples/react-patterns.md` for code samples.

# ✅ Do reference them
Examples: `examples/react-patterns.md` (load on request)
```

### 3. Use Abbreviations Consistently

```markdown
Abbreviations used:
- RSC = React Server Component
- CC = Client Component
- TS = TypeScript
- API = API route/endpoint
```

### 4. One-Line Rules

```markdown
- RSC by default; CC only for useState/useEffect
- No `any`; use `unknown` + type guards
- Zod for all external input validation
```

---

## 📚 Further Reading

- [Anthropic Prompt Caching](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching)
- [Cursor Rules Documentation](https://cursor.com/docs)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
- [context_management.md](./context_management.md) - How to pack context efficiently

---

## 🔄 Changelog

| Date | Change |
|------|--------|
| 2026-01-28 | Initial version based on community feedback |
