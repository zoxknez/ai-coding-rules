# 📚 Documentation

> Organized documentation for AI coding rules.

## Structure

```
docs/
├── core/           # 🎯 Essential rules (start here)
├── architecture/   # 🏛️ Architecture Decision Records
├── stacks/         # 🔵 Technology-specific guides
├── workflows/      # 🟡 Agent workflows & patterns
├── operations/     # ⚪ Security, incidents, team processes
├── security/       # 🔴 Vulnerability guides, IaC security
├── quality/        # 🟢 Code review, quality gates
└── optimization/   # 💰 Token costs, performance
```

## Quick Links

| Need | Go To |
|------|-------|
| **Start here** | [core/MASTER_RULES.md](core/MASTER_RULES.md) |
| **Project Constitution** | [core/CONSTITUTION.md](core/CONSTITUTION.md) |
| **MCP Servers** | [core/MCP_SERVERS.md](core/MCP_SERVERS.md) |
| **ADRs** | [architecture/decisions/](architecture/decisions/) |
| **Agent Vulnerabilities** | [security/AGENT_VULNERABILITIES.md](security/AGENT_VULNERABILITIES.md) |
| **Cloud/IaC Security** | [security/CLOUD_IAC_SECURITY.md](security/CLOUD_IAC_SECURITY.md) |
| **Governance Automation** | [operations/GOVERNANCE_AUTOMATION.md](operations/GOVERNANCE_AUTOMATION.md) |
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
- [CONSTITUTION.md](core/CONSTITUTION.md) — **NEW v4.6** Supreme governance for AI agents
- [global_rules.md](core/global_rules.md) — Operating principles
- [ai_model_contract.md](core/ai_model_contract.md) — Behavioral contract
- [STRICT_MODE.md](core/STRICT_MODE.md) — Non-negotiable rules
- [MCP_SERVERS.md](core/MCP_SERVERS.md) — Model Context Protocol integration

### 🏛️ Architecture
- [decisions/README.md](architecture/decisions/README.md) — **NEW v4.6** ADR index and workflow
- [decisions/template.md](architecture/decisions/template.md) — **NEW v4.6** ADR template with agent instructions
- [decisions/0001-*.md](architecture/decisions/) — **NEW v4.6** Active architecture decisions

### 🔵 Stack Guides
- [stack_frontend.md](stacks/stack_frontend.md) — React, Next.js, TypeScript
- [stack_backend.md](stacks/stack_backend.md) — Node.js, Express, Nest
- [stack_db.md](stacks/stack_db.md) — SQL, ORMs, Migrations
- [stack_python.md](stacks/stack_python.md) — Python
- [stack_rust.md](stacks/stack_rust.md) — Rust
- [stack_go.md](stacks/stack_go.md) — **NEW v4.6** Go patterns & nil safety
- [stack_csharp.md](stacks/stack_csharp.md) — **NEW v4.6** C#/.NET 8+ patterns
- [stack_mobile.md](stacks/stack_mobile.md) — **NEW v4.6** iOS & Android security

### 🟡 Workflows
- [task_template.md](workflows/task_template.md) — Task specification
- [agent_loop.md](workflows/agent_loop.md) — Iteration workflow
- [AGENTS.md](workflows/AGENTS.md) — Agent operating rules
- [MEMORY_BANK.md](workflows/MEMORY_BANK.md) — Long-term context
- [SPEC_DRIVEN_DEVELOPMENT.md](workflows/SPEC_DRIVEN_DEVELOPMENT.md) — Proposal→Apply→Archive

### ⚪ Operations
- [security_privacy.md](operations/security_privacy.md) — Security policies
- [SECURITY_GUARDRAILS.md](operations/SECURITY_GUARDRAILS.md) — Explicit bans & OWASP
- [GOVERNANCE_AUTOMATION.md](operations/GOVERNANCE_AUTOMATION.md) — **NEW v4.6** Pre-commit, semgrep, CI
- [incident_response.md](operations/incident_response.md) — When AI breaks things
- [team_workflows.md](operations/team_workflows.md) — Team processes

### 🔴 Security
- [AGENT_VULNERABILITIES.md](security/AGENT_VULNERABILITIES.md) — **NEW v4.6** Language-specific vulns
- [CLOUD_IAC_SECURITY.md](security/CLOUD_IAC_SECURITY.md) — **NEW v4.6** Terraform, Docker, K8s

### 🟢 Quality
- [quality_control.md](quality/quality_control.md) — Review gates
- [code_review_rubric.md](quality/code_review_rubric.md) — PR checklist
- [REFACT_METHODOLOGY.md](quality/REFACT_METHODOLOGY.md) — R.E.F.A.C.T. anti-slop
- [QUICK_CHECKLIST.md](quality/QUICK_CHECKLIST.md) — One-page verification
- [MONOREPO_RULES.md](quality/MONOREPO_RULES.md) — Monorepo patterns

### 💰 Optimization
- [TOKEN_OPTIMIZATION.md](optimization/TOKEN_OPTIMIZATION.md) — Cost reduction
- [RULE_SELECTION.md](optimization/RULE_SELECTION.md) — Which rules to load
- [RULE_INDEX.md](optimization/RULE_INDEX.md) — Lightweight index

## Templates

Located in `/templates/`:

| Template | Purpose |
|----------|---------|
| [task_on_hand.md](../templates/task_on_hand.md) | Context hygiene - short-term memory |
| [proposal.md](../templates/proposal.md) | Feature proposal for spec-driven dev |

## Platform Configurations

| Platform | Location | Description |
|----------|----------|-------------|
| **Cursor** | `.cursor/rules/` | MDC rules with glob activation |
| **Antigravity** | `.antigravity/` | **NEW v4.6** Rules, workflows, allowlist |
| **Copilot** | `.github/copilot-instructions.md` | GitHub Copilot config |
| **Claude** | `CLAUDE.md` | Claude Code memory |
| **Windsurf** | `.windsurf/` | Windsurf config |

## MDC Rules

Located in `.cursor/rules/`:

| Rule | Auto-Activates For |
|------|-------------------|
| `90-ui-components.mdc` | `**/components/**/*.tsx` |
| `91-api-routes.mdc` | `**/api/**/*.ts` |
| `92-database.mdc` | `**/prisma/**`, `**/*.sql` |
| `93-state-management.mdc` | `**/stores/**/*.ts` |

## Examples

Located in `/examples/`:

| Example | Purpose |
|---------|---------|
| [config/README.md](../examples/config/README.md) | **NEW v4.6** Ready-to-use governance configs |

