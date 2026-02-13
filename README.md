# 🤖 AI Coding Rules

<div align="center">

**The definitive ruleset for AI coding assistants.**

*Make Cursor, GitHub Copilot, Claude Code, and Windsurf reliable, predictable, and effective.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)](CHANGELOG.md)
[![Docs](https://img.shields.io/badge/docs-140%2B_files-purple.svg)](docs/)
[![Languages](https://img.shields.io/badge/languages-15-orange.svg)](languages/)

---

> *"Don't tell it what to do — give it success criteria and watch it go."*
> — **Andrej Karpathy**

</div>

---

## Why This Exists

Without rules, AI assistants produce **inconsistent, insecure, over-engineered code**.
With rules, they become **force multipliers**.

| | Without Rules | With AI Coding Rules |
|---|---|---|
| **Security** | Hardcoded secrets, no input validation | STRICT mode — zero-tolerance guardrails |
| **Consistency** | Different patterns every session | Same conventions, every time |
| **Scope** | Drive-by refactors, runaway changes | Diff budgets, focused patches |
| **Quality** | Happy-path only, no error handling | Full error paths, edge cases, tests |
| **Cost** | 8K+ tokens of context per prompt | 500-1K tokens with optimization |

---

## Quick Start

> **Pick one approach. You can always expand later.**

### ① One File (Fastest)

Copy [`docs/core/MASTER_RULES.md`](docs/core/MASTER_RULES.md) into your project root or AI assistant settings. Done.

### ② Platform-Specific (Recommended)

<table>
<tr>
<td width="25%" align="center">
<br>
<img src="https://img.shields.io/badge/Cursor-000?style=for-the-badge&logo=cursor&logoColor=white" alt="Cursor"><br><br>

```bash
cp -r .cursor/rules/ \
  your-project/.cursor/rules/
```

<sub>19 modular .mdc rules, glob-activated</sub>
</td>
<td width="25%" align="center">
<br>
<img src="https://img.shields.io/badge/Copilot-000?style=for-the-badge&logo=github&logoColor=white" alt="Copilot"><br><br>

```bash
cp -r .github/ \
  your-project/.github/
```

<sub>Path-specific instructions</sub>
</td>
<td width="25%" align="center">
<br>
<img src="https://img.shields.io/badge/Claude_Code-D4A574?style=for-the-badge&logo=anthropic&logoColor=white" alt="Claude"><br><br>

```bash
cp CLAUDE.md your-project/
cp -r .claude/ your-project/
```

<sub>Auto-loaded memory + skills</sub>
</td>
<td width="25%" align="center">
<br>
<img src="https://img.shields.io/badge/Windsurf-0EA5E9?style=for-the-badge&logoColor=white" alt="Windsurf"><br><br>

```bash
cp -r .windsurf/ \
  your-project/.windsurf/
```

<sub>Cascade memory + rules</sub>
</td>
</tr>
</table>

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         AI CODING RULES                         │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │   CORE   │──▶│  STACKS  │──▶│ WORKFLOWS│──▶│ SECURITY │    │
│  │          │   │          │   │          │   │          │    │
│  │ Golden   │   │ Python   │   │ Agent    │   │ STRICT   │    │
│  │ Rule     │   │ Rust     │   │ Loop     │   │ Mode     │    │
│  │ STRICT   │   │ Frontend │   │ Git Flow │   │ OWASP    │    │
│  │ Mode     │   │ Backend  │   │ Playbooks│   │ Privacy  │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│       │                                              │         │
│       ▼──────────────────────────────────────────────▼         │
│                    PLATFORM ADAPTERS                            │
│         .cursor/  ·  .github/  ·  .claude/  ·  .windsurf/     │
└─────────────────────────────────────────────────────────────────┘
```

---

## What's Inside

### 🎯 Core Rules — *Start here*

| Document | What you get |
|----------|-------------|
| [**MASTER_RULES.md**](docs/core/MASTER_RULES.md) | ⭐ The single file that covers everything essential |
| [global_rules.md](docs/core/global_rules.md) | Operating principles — Correctness > Simplicity > Consistency > Style |
| [STRICT_MODE.md](docs/core/STRICT_MODE.md) | Non-negotiable security rules that can't be overridden |
| [AI_MODEL_SELECTION.md](docs/core/AI_MODEL_SELECTION.md) | Which model for which task — decision matrix |
| [CONSTITUTION.md](docs/core/CONSTITUTION.md) | Supreme law for AI agents — boundary definitions |

### 🔵 Technology Stacks — *Match your project*

| Document | Coverage |
|----------|----------|
| [stack_frontend.md](docs/stacks/stack_frontend.md) | React, Next.js, TypeScript |
| [stack_backend.md](docs/stacks/stack_backend.md) | Node.js, Express, NestJS |
| [stack_python.md](docs/stacks/stack_python.md) | FastAPI, SQLAlchemy, async, ML — **380 lines** |
| [stack_rust.md](docs/stacks/stack_rust.md) | Tokio, Axum, SQLx, error handling — **380 lines** |
| [stack_db.md](docs/stacks/stack_db.md) | SQL, Prisma, Drizzle |
| [stack_go.md](docs/stacks/stack_go.md) | Go idioms, project layout — **314 lines** |
| [stack_csharp.md](docs/stacks/stack_csharp.md) | .NET, EF Core, patterns — **339 lines** |
| [ROLE_BUNDLES.md](docs/stacks/ROLE_BUNDLES.md) | Role-based rule sets (Frontend, Backend, DevOps, QA...) |

### 🏛️ Architecture — *Design decisions*

| Document | What you get |
|----------|-------------|
| [API_DESIGN_PATTERNS.md](docs/architecture/API_DESIGN_PATTERNS.md) | REST, GraphQL, gRPC — pagination, rate limiting, versioning |
| [CACHING_STRATEGIES.md](docs/architecture/CACHING_STRATEGIES.md) | 4 cache layers, invalidation, stampede prevention |
| [ADR_TEMPLATE_AND_EXAMPLES.md](docs/architecture/decisions/ADR_TEMPLATE_AND_EXAMPLES.md) | Architecture Decision Record template + examples |

### 🟡 Workflows — *How agents operate*

| Document | What you get |
|----------|-------------|
| [agent_loop.md](docs/workflows/agent_loop.md) | Plan → Patch → Verify iteration cycle |
| [AGENTS.md](docs/workflows/AGENTS.md) | Agent operating manual — initialization, quality gates |
| [GIT_WORKFLOW.md](docs/workflows/GIT_WORKFLOW.md) | Branching strategy, conventional commits, diff budgets |
| [WORKFLOW_PLAYBOOKS.md](docs/workflows/WORKFLOW_PLAYBOOKS.md) | 6 step-by-step playbooks for common goals |
| [DEBUGGING_PROTOCOL.md](docs/workflows/DEBUGGING_PROTOCOL.md) | RAPID framework — systematic debugging |
| [MULTI_AGENT.md](docs/workflows/MULTI_AGENT.md) | Multi-agent orchestration & coordination |
| [MEMORY_BANK.md](docs/workflows/MEMORY_BANK.md) | Persist context across sessions |
| [task_template.md](docs/workflows/task_template.md) | How to specify tasks for AI |

### 🔴 Security — *Non-negotiable*

| Document | What you get |
|----------|-------------|
| [SECURITY_PRIVACY_BASELINE.md](docs/operations/SECURITY_PRIVACY_BASELINE.md) | 9 MUST rules, OWASP mapping, encryption, compliance |
| [PROMPT_INJECTION_DEFENSE.md](docs/security/PROMPT_INJECTION_DEFENSE.md) | Threat model, injection defense, tool call safety |
| [AGENT_VULNERABILITIES.md](docs/security/AGENT_VULNERABILITIES.md) | Language-specific vulnerability patterns |
| [CLOUD_IAC_SECURITY.md](docs/security/CLOUD_IAC_SECURITY.md) | Terraform, Docker, Kubernetes hardening |
| [security_privacy.md](docs/operations/security_privacy.md) | Security guardrails |

### ⚪ Operations — *Run the machine*

| Document | What you get |
|----------|-------------|
| [CI_CD_PIPELINE.md](docs/operations/CI_CD_PIPELINE.md) | Pipeline design, deployment strategy, rollback |
| [OBSERVABILITY.md](docs/operations/OBSERVABILITY.md) | Logging, metrics, tracing (SRE golden signals) |
| [ERROR_HANDLING.md](docs/operations/ERROR_HANDLING.md) | Error classification, retry, circuit breaker |
| [incident_response.md](docs/operations/incident_response.md) | Severity levels, 4-phase playbook, postmortem template |
| [team_workflows.md](docs/operations/team_workflows.md) | PR process, AI code review, knowledge sharing |
| [tool_integration.md](docs/operations/tool_integration.md) | Toolchain loop, IDE setup, CI gates |
| [ANTI_SLOP_GUARDRAILS.md](docs/operations/ANTI_SLOP_GUARDRAILS.md) | Prevent AI slop — forbidden patterns |

### 🟢 Quality — *Ship with confidence*

| Document | What you get |
|----------|-------------|
| [DATA_VALIDATION_PATTERNS.md](docs/quality/DATA_VALIDATION_PATTERNS.md) | Schema validation, sanitization, DTOs |
| [NAMING_CONVENTIONS.md](docs/quality/NAMING_CONVENTIONS.md) | Naming rules across 5 languages |
| [testing_strategy.md](docs/quality/testing_strategy.md) | Testing pyramid, TDD, coverage |
| [code_review_rubric.md](docs/quality/code_review_rubric.md) | PR checklist |
| [ACCESSIBILITY.md](docs/quality/ACCESSIBILITY.md) | WCAG 2.2 AA compliance |
| [REFACT_METHODOLOGY.md](docs/quality/REFACT_METHODOLOGY.md) | R.E.F.A.C.T. refactoring method |

### 🧩 Language Blueprints — *15 languages*

<details>
<summary><b>Click to expand all 15 language blueprints</b></summary>

Each blueprint includes **structure**, **security**, and **authoritative sources**.

| Language | Folder |
|----------|--------|
| Python | [languages/python/](languages/python/) |
| TypeScript | [languages/typescript/](languages/typescript/) |
| JavaScript | [languages/javascript/](languages/javascript/) |
| Next.js | [languages/nextjs/](languages/nextjs/) |
| Go | [languages/go/](languages/go/) |
| Rust | [languages/rust/](languages/rust/) |
| .NET / C# | [languages/dotnet/](languages/dotnet/) |
| Java | [languages/java/](languages/java/) |
| Kotlin | [languages/kotlin/](languages/kotlin/) |
| Swift | [languages/swift/](languages/swift/) |
| PHP | [languages/php/](languages/php/) |
| Ruby | [languages/ruby/](languages/ruby/) |
| Dart | [languages/dart/](languages/dart/) |
| C | [languages/c/](languages/c/) |
| C++ | [languages/cpp/](languages/cpp/) |

</details>

### 💰 Token Optimization

<details>
<summary><b>Reduce AI costs by 60-90%</b></summary>

| Document | What you get |
|----------|-------------|
| [TOKEN_OPTIMIZATION.md](docs/optimization/TOKEN_OPTIMIZATION.md) | Cost reduction strategies |
| [RULE_INDEX.md](docs/optimization/RULE_INDEX.md) | Lightweight rule index |
| [RULE_SELECTION.md](docs/optimization/RULE_SELECTION.md) | Pick the right rules for the job |

</details>

---

## Key Principles

<table>
<tr>
<td width="50%">

### 🏆 Golden Rule

```
Correctness > Simplicity > Consistency > Style
```

When principles conflict, follow this hierarchy.
Every AI agent must internalize this.

</td>
<td width="50%">

### 🔒 STRICT Mode

Rules that **cannot be bypassed**, ever:

- 🔐 No hardcoded secrets
- 🛡️ SQL injection prevention
- 🔑 Auth on every protected route
- ✅ Input validation on every boundary

</td>
</tr>
<tr>
<td>

### 🔄 Three-Phase Pattern

Every AI task follows:

```
① PLAN   — Understand, break down, confirm
② PATCH  — Minimal, focused changes
③ VERIFY — Test, check, validate
```

</td>
<td>

### 📏 Diff Discipline

AI changes must stay within budget:

| PR Type | Max Lines |
|---------|-----------|
| Feature | 400 |
| Refactor | 200 |
| Bug fix | 100 |

</td>
</tr>
</table>

---

## 💡 Skills System (Claude Code)

Invoke structured outputs for consistent, repeatable AI responses:

```bash
/skill:code-review [file]       # Structured code review with severity ratings
/skill:security-audit [scope]   # OWASP Top 10 scan with fix suggestions  
/skill:refactor-plan [target]   # Strategic refactoring with risk assessment
/skill:rigor-audit [scope]      # Combined quality + security check
```

---

## 💰 Token Optimization

Reduce AI context costs by **60-90%** without losing quality:

```
Full MASTER_RULES    ████████████████████░░░░  ~8,000 tokens
Core + 1 Stack       ████░░░░░░░░░░░░░░░░░░░░  ~1,000 tokens  (88% savings)
Core only            █░░░░░░░░░░░░░░░░░░░░░░░    ~500 tokens  (94% savings)
```

See [docs/optimization/](docs/optimization/) for the full guide.

---

## 🔄 Sync Scripts

Keep all platform configs in sync with the canonical source:

```bash
./scripts/sync_instructions.sh       # Unix/macOS
./scripts/sync_instructions.ps1      # Windows
```

---

## 📊 Version History

| Version | Date | Highlights |
|---------|------|------------|
| **5.0.0** | 2025-06-25 | 8 new docs, 7 expanded — API Design, Caching, Git Workflow, Prompt Injection, Data Validation, Naming Conventions, security baseline, stack guides |
| **4.9.0** | 2025-06-25 | 11 new docs — Testing, Playbooks, Observability, CI/CD, Model Selection, Error Handling, Debugging, Multi-Agent, ADRs, Role Bundles, Accessibility |
| **4.8.1** | 2026-01-28 | Source citations for all language structure blueprints |
| **4.3.0** | 2025-01-28 | Skills system, STRICT mode, Universal Rule Format |
| **4.2.0** | 2025-01-28 | Multi-platform support (Copilot, Claude, Windsurf) |

<details>
<summary>Full changelog</summary>

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

</details>

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-rule`)
3. Follow [CONTRIBUTING.md](CONTRIBUTING.md)
4. Submit a PR with the [PR template](docs/operations/team_workflows.md)

---

<div align="center">

## 📜 License

MIT — see [LICENSE](LICENSE)

---

### Built With

[![Cursor](https://img.shields.io/badge/Cursor-000?style=flat-square&logo=cursor&logoColor=white)](https://cursor.sh)
[![Claude](https://img.shields.io/badge/Claude-D4A574?style=flat-square&logo=anthropic&logoColor=white)](https://claude.ai)
[![Copilot](https://img.shields.io/badge/Copilot-000?style=flat-square&logo=github&logoColor=white)](https://github.com/features/copilot)

### Credits

Inspired by [Andrej Karpathy](https://x.com/karpathy/status/2015883857489522876) ·
Skills from [mamut-lab](https://github.com/orange-dot/mamut-lab) ·
Format from [aicodingrules.org](https://aicodingrules.org/) ·
Community rules from [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)

---

**If this helped you, give it a ⭐**

</div>
