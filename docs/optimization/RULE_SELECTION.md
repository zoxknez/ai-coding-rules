# 🧭 Rule Selection Guide

**Purpose:** Choose the right rules for your task to minimize token usage and maximize effectiveness.

---

## 🎯 Quick Decision Flowchart

```
START: What are you building/fixing?
│
├─► Quick bug fix (single file)?
│   └── Load: Core only (~500 tokens)
│       → 00-global.mdc
│
├─► Frontend feature?
│   └── Load: Core + Frontend (~1,000 tokens)
│       → 00-global.mdc + 60-stack-frontend.mdc
│       → Add: 66-stack-shadcn.mdc if using UI components
│       → Add: 67-stack-nextjs15.mdc if App Router
│
├─► Backend/API work?
│   └── Load: Core + Backend (~1,000 tokens)
│       → 00-global.mdc + 61-stack-backend.mdc
│       → Add: 63-stack-db.mdc if database involved
│       → Add: 65-stack-supabase.mdc if Supabase
│
├─► Database migration?
│   └── Load: Core + DB (~1,000 tokens)
│       → 00-global.mdc + 63-stack-db.mdc
│
├─► Security-sensitive code?
│   └── Load: Core + Security (~1,200 tokens)
│       → 00-global.mdc + 20-security-privacy.mdc
│
├─► Writing tests?
│   └── Load: Core + Testing (~1,000 tokens)
│       → 00-global.mdc + 30-testing.mdc
│
├─► Rapid prototyping / MVP?
│   └── Load: Core + Vibe (~1,200 tokens)
│       → 00-global.mdc + 80-vibe-coding.mdc
│
└─► Full-stack feature?
    └── Load: Core + Stack combination (~2,000 tokens)
        → 00-global.mdc
        → 60-stack-frontend.mdc (if UI)
        → 61-stack-backend.mdc (if API)
        → 63-stack-db.mdc (if data)
```

---

## 📊 Rule Categories & Token Costs

### Always Load (Core)

| File | Tokens | When |
|------|--------|------|
| `00-global.mdc` | ~500 | Every task |
| `10-output-contract.mdc` | ~300 | When you need structured output |

### Stack-Specific (Load by File Type)

| File | Tokens | Trigger |
|------|--------|---------|
| `60-stack-frontend.mdc` | ~400 | `.tsx`, `.jsx`, `.css` |
| `61-stack-backend.mdc` | ~400 | Server-side `.ts`, `.js` |
| `62-stack-python.mdc` | ~400 | `.py` files |
| `63-stack-db.mdc` | ~350 | `.sql`, `prisma/`, `drizzle/` |
| `64-stack-rust.mdc` | ~400 | `.rs` files |

### Framework-Specific (Load When Using)

| File | Tokens | Trigger |
|------|--------|---------|
| `65-stack-supabase.mdc` | ~350 | Supabase client/functions |
| `66-stack-shadcn.mdc` | ~300 | UI component work |
| `67-stack-nextjs15.mdc` | ~400 | App Router, RSC |

### Task-Specific (Load On Demand)

| File | Tokens | When |
|------|--------|------|
| `20-security-privacy.mdc` | ~400 | Auth, secrets, crypto |
| `30-testing.mdc` | ~350 | Writing/fixing tests |
| `40-context-memory.mdc` | ~300 | Long-running sessions |
| `50-mcp-tools.mdc` | ~300 | Using MCP tools |
| `80-vibe-coding.mdc` | ~500 | Prototyping mode |

---

## 🏗️ Common Task Profiles

### Profile: Bug Fix
```yaml
rules:
  - 00-global.mdc
total_tokens: ~500
```

### Profile: React Component
```yaml
rules:
  - 00-global.mdc
  - 60-stack-frontend.mdc
  - 66-stack-shadcn.mdc  # if using UI library
total_tokens: ~1,200
```

### Profile: API Endpoint
```yaml
rules:
  - 00-global.mdc
  - 61-stack-backend.mdc
  - 63-stack-db.mdc      # if database access
total_tokens: ~1,250
```

### Profile: Full-Stack Feature
```yaml
rules:
  - 00-global.mdc
  - 60-stack-frontend.mdc
  - 61-stack-backend.mdc
  - 63-stack-db.mdc
  - 67-stack-nextjs15.mdc
total_tokens: ~2,050
```

### Profile: MVP / Prototype
```yaml
rules:
  - 00-global.mdc
  - 80-vibe-coding.mdc
  - [one stack file]
total_tokens: ~1,400
```

### Profile: Security Audit
```yaml
rules:
  - 00-global.mdc
  - 20-security-privacy.mdc
  - 30-testing.mdc
total_tokens: ~1,250
```

---

## 🎛️ Configuration Examples

### Cursor: Auto-Loading via globs

In `.cursor/rules/60-stack-frontend.mdc`:
```yaml
---
description: "React/Next.js patterns"
globs: ["**/*.tsx", "**/*.jsx", "src/components/**/*"]
alwaysApply: false
priority: 60
---
```

### Cursor: Manual Activation

In `.cursor/rules/80-vibe-coding.mdc`:
```yaml
---
description: "Rapid prototyping mode"
globs: ["**/*"]
alwaysApply: false  # User must explicitly request
priority: 30
---
```

### GitHub Copilot: Folder-Based

```
.github/
└── instructions/
    ├── backend.instructions.md    # Applied to **/*.{ts,js}
    ├── frontend.instructions.md   # Applied to **/*.{tsx,jsx}
    └── db.instructions.md         # Applied to prisma/**, *.sql
```

---

## ❌ Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Load all rules always | Token waste, confusion | Use conditional loading |
| Duplicate rules across files | Inconsistency, bloat | Single source of truth |
| Examples in rules | Token bloat | Reference external files |
| Prose over tables | Token inefficiency | Use compact formats |
| No priority ordering | Wrong rules applied first | Set explicit priorities |

---

## 📐 Priority Ordering

Higher priority = loaded first = can be overridden by lower priority.

| Priority | Category | Example |
|----------|----------|---------|
| 100 | Core/Global | `00-global.mdc` |
| 80 | Output Contract | `10-output-contract.mdc` |
| 70 | Security | `20-security-privacy.mdc` |
| 60 | Stack Rules | `60-stack-frontend.mdc` |
| 50 | Framework | `65-stack-supabase.mdc` |
| 40 | Context | `40-context-memory.mdc` |
| 30 | Mode | `80-vibe-coding.mdc` |

---

## 🔄 Dynamic Rule Selection (Advanced)

For agentic workflows, the AI can request rules dynamically:

```markdown
## Available Rules Index

Request specific rules when needed:

| Need | Request |
|------|---------|
| React patterns | @fetch stack_frontend.md#react |
| Database queries | @fetch stack_db.md#queries |
| Auth implementation | @fetch security_privacy.md#auth |
| Error handling | @fetch global_rules.md#errors |

Default: I have core rules loaded. Ask me to load specific sections for your task.
```

---

## 📚 Related Documents

- [TOKEN_OPTIMIZATION.md](./TOKEN_OPTIMIZATION.md) - Cost reduction strategies
- [context_management.md](./context_management.md) - How to pack context
- [MASTER_RULES.md](./MASTER_RULES.md) - Complete all-in-one reference
