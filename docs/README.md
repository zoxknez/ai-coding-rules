# 📚 Documentation

> Organized documentation for AI coding rules.

## Structure

```
docs/
├── core/           # 🎯 Essential rules (start here)
├── stacks/         # 🔵 Technology-specific guides
├── workflows/      # 🟡 Agent workflows & patterns
├── operations/     # ⚪ Security, incidents, team processes
├── quality/        # 🟢 Code review, quality gates
└── optimization/   # 💰 Token costs, performance
```

## Quick Links

| Need | Go To |
|------|-------|
| **Start here** | [core/MASTER_RULES.md](core/MASTER_RULES.md) |
| **MCP Servers** | [core/MCP_SERVERS.md](core/MCP_SERVERS.md) |
| **React/Next.js help** | [stacks/stack_frontend.md](stacks/stack_frontend.md) |
| **Task template** | [workflows/task_template.md](workflows/task_template.md) |
| **Spec-Driven Dev** | [workflows/SPEC_DRIVEN_DEVELOPMENT.md](workflows/SPEC_DRIVEN_DEVELOPMENT.md) |
| **Security rules** | [operations/SECURITY_GUARDRAILS.md](operations/SECURITY_GUARDRAILS.md) |
| **Refactoring** | [quality/REFACT_METHODOLOGY.md](quality/REFACT_METHODOLOGY.md) |
| **Quick Checklist** | [quality/QUICK_CHECKLIST.md](quality/QUICK_CHECKLIST.md) |
| **Reduce AI costs** | [optimization/TOKEN_OPTIMIZATION.md](optimization/TOKEN_OPTIMIZATION.md) |

## By Category

### 🎯 Core (Required Reading)
- [MASTER_RULES.md](core/MASTER_RULES.md) — Central rules document
- [global_rules.md](core/global_rules.md) — Operating principles
- [ai_model_contract.md](core/ai_model_contract.md) — Behavioral contract
- [STRICT_MODE.md](core/STRICT_MODE.md) — Non-negotiable rules
- [MCP_SERVERS.md](core/MCP_SERVERS.md) — **NEW** Model Context Protocol integration

### 🔵 Stack Guides
- [stack_frontend.md](stacks/stack_frontend.md) — React, Next.js, TypeScript
- [stack_backend.md](stacks/stack_backend.md) — Node.js, Express, Nest
- [stack_db.md](stacks/stack_db.md) — SQL, ORMs, Migrations
- [stack_python.md](stacks/stack_python.md) — Python
- [stack_rust.md](stacks/stack_rust.md) — Rust

### 🟡 Workflows
- [task_template.md](workflows/task_template.md) — Task specification
- [agent_loop.md](workflows/agent_loop.md) — Iteration workflow
- [AGENTS.md](workflows/AGENTS.md) — Agent operating rules
- [MEMORY_BANK.md](workflows/MEMORY_BANK.md) — Long-term context
- [SPEC_DRIVEN_DEVELOPMENT.md](workflows/SPEC_DRIVEN_DEVELOPMENT.md) — **NEW** Proposal→Apply→Archive

### ⚪ Operations
- [security_privacy.md](operations/security_privacy.md) — Security policies
- [SECURITY_GUARDRAILS.md](operations/SECURITY_GUARDRAILS.md) — **NEW** Explicit bans & OWASP
- [incident_response.md](operations/incident_response.md) — When AI breaks things
- [team_workflows.md](operations/team_workflows.md) — Team processes

### 🟢 Quality
- [quality_control.md](quality/quality_control.md) — Review gates
- [code_review_rubric.md](quality/code_review_rubric.md) — PR checklist
- [REFACT_METHODOLOGY.md](quality/REFACT_METHODOLOGY.md) — **NEW** R.E.F.A.C.T. anti-slop
- [QUICK_CHECKLIST.md](quality/QUICK_CHECKLIST.md) — **NEW** One-page verification
- [MONOREPO_RULES.md](quality/MONOREPO_RULES.md) — Monorepo patterns

### 💰 Optimization
- [TOKEN_OPTIMIZATION.md](optimization/TOKEN_OPTIMIZATION.md) — Cost reduction
- [RULE_SELECTION.md](optimization/RULE_SELECTION.md) — Which rules to load
- [RULE_INDEX.md](optimization/RULE_INDEX.md) — Lightweight index

## Templates

Located in `/templates/`:

| Template | Purpose |
|----------|---------|
| [task_on_hand.md](../templates/task_on_hand.md) | **NEW** Context hygiene - short-term memory |
| [proposal.md](../templates/proposal.md) | **NEW** Feature proposal for spec-driven dev |

## MDC Rules

Located in `.cursor/rules/`:

| Rule | Auto-Activates For |
|------|-------------------|
| `90-ui-components.mdc` | `**/components/**/*.tsx` |
| `91-api-routes.mdc` | `**/api/**/*.ts` |
| `92-database.mdc` | `**/prisma/**`, `**/*.sql` |
| `93-state-management.mdc` | `**/stores/**/*.ts` |

