# 📖 Rule Index (RAG-Friendly)

**Purpose:** Lightweight lookup table for on-demand rule loading (~200 tokens).

> Load this index instead of all rules. Fetch specific sections when needed.

---

## Quick Reference

| Need | Section | File | Tokens |
|------|---------|------|--------|
| Core principles | `#core` | global_rules.md | ~200 |
| Output format | `#output` | ai_model_contract.md | ~150 |
| Assumptions ledger | `#assumptions` | cognitive_protocols.md | ~100 |
| Pushback protocol | `#pushback` | cognitive_protocols.md | ~100 |

---

## By Technology

| Stack | Section | File | Tokens |
|-------|---------|------|--------|
| React/Next.js | `#react` | stack_frontend.md | ~300 |
| TypeScript | `#typescript` | stack_frontend.md | ~150 |
| Tailwind | `#tailwind` | stack_frontend.md | ~100 |
| Node.js | `#nodejs` | stack_backend.md | ~200 |
| Express/Fastify | `#api` | stack_backend.md | ~150 |
| Prisma | `#prisma` | stack_db.md | ~150 |
| Drizzle | `#drizzle` | stack_db.md | ~150 |
| PostgreSQL | `#postgres` | stack_db.md | ~100 |
| Python | `#python` | stack_python.md | ~300 |
| Rust | `#rust` | stack_rust.md | ~300 |

---

## By Framework

| Framework | Section | File | Tokens |
|-----------|---------|------|--------|
| Next.js 15 | `#nextjs15` | stack_frontend.md | ~200 |
| Supabase | `#supabase` | stack_db.md | ~200 |
| shadcn/ui | `#shadcn` | stack_frontend.md | ~100 |
| Vercel | `#vercel` | stack_frontend.md | ~100 |

---

## By Task Type

| Task | Section | File | Tokens |
|------|---------|------|--------|
| Writing tests | `#testing` | quality_control.md | ~200 |
| Security audit | `#security` | security_privacy.md | ~300 |
| Auth implementation | `#auth` | security_privacy.md | ~200 |
| Database migration | `#migrations` | stack_db.md | ~150 |
| API endpoint | `#api-design` | stack_backend.md | ~200 |
| Error handling | `#errors` | global_rules.md | ~100 |
| Input validation | `#validation` | security_privacy.md | ~150 |

---

## By Mode

| Mode | Section | File | Tokens |
|------|---------|------|--------|
| Vibe coding | `#vibe` | prompts/vibe-coding-instructions.md | ~400 |
| Production | `#production` | quality_control.md | ~200 |
| Debugging | `#debugging` | incident_response.md | ~150 |
| Code review | `#review` | code_review_rubric.md | ~300 |

---

## Usage Instructions

### For AI Agents

```
When you need specific guidance:
1. Check this index for relevant section
2. Request: "@fetch [file]#[section]"
3. Apply fetched rules to current task

Default behavior: Use core principles only.
Escalate: Fetch additional rules when task requires.
```

### For Cursor/Copilot

Reference sections in your prompts:
```
Following rules from stack_frontend.md#react:
[your request here]
```

### For RAG Systems

Each section is designed to be:
- Self-contained (~100-300 tokens)
- Context-specific
- Actionable without dependencies

---

## Section Anchors

All files use consistent heading anchors:

```markdown
## Core Principles {#core}
## Output Format {#output}
## React Patterns {#react}
## Testing Strategy {#testing}
## Security Checklist {#security}
## Migration Process {#migrations}
```

---

## Full Rule Inventory

| File | Total Tokens | Sections |
|------|--------------|----------|
| global_rules.md | ~800 | 5 |
| ai_model_contract.md | ~600 | 4 |
| cognitive_protocols.md | ~500 | 3 |
| stack_frontend.md | ~1,200 | 8 |
| stack_backend.md | ~1,000 | 6 |
| stack_db.md | ~800 | 5 |
| stack_python.md | ~700 | 4 |
| stack_rust.md | ~700 | 4 |
| security_privacy.md | ~900 | 6 |
| quality_control.md | ~600 | 4 |
| incident_response.md | ~400 | 3 |
| code_review_rubric.md | ~500 | 3 |
| **MASTER_RULES.md** | **~8,000** | All combined |

---

## Anti-Pattern: Loading Everything

```
❌ DON'T: Load MASTER_RULES.md for every request (8,000 tokens)
✅ DO: Load index (200 tokens) + fetch sections as needed
```

**Savings Example:**
- Quick fix: 200 + 100 = 300 tokens (vs 8,000)
- Feature: 200 + 300 + 200 = 700 tokens (vs 8,000)
- Complex: 200 + 500 + 300 + 200 = 1,200 tokens (vs 8,000)

---

## Related Documents

- [TOKEN_OPTIMIZATION.md](./TOKEN_OPTIMIZATION.md) - Cost reduction strategies
- [RULE_SELECTION.md](./RULE_SELECTION.md) - Decision flowchart
- [context_management.md](./context_management.md) - Context packing techniques
