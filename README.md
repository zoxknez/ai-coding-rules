# 🤖 AI Coding Rules

**Battle-tested rules for AI coding assistants: Cursor, GitHub Copilot, Claude Code, Windsurf.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

---

## 🎯 What is this?

A comprehensive ruleset that makes AI coding assistants **more reliable, predictable, and effective**.

> *"Don't tell it what to do — give it success criteria and watch it go."* — Karpathy

---

## 🚀 Quick Start

### Option 1: One File
Copy [`docs/core/MASTER_RULES.md`](docs/core/MASTER_RULES.md) into your AI assistant.

### Option 2: Platform-Specific

| Platform | Config File | Auto-loaded |
|----------|-------------|-------------|
| **Cursor** | `.cursor/rules/*.mdc` | ✅ By glob pattern |
| **GitHub Copilot** | `.github/copilot-instructions.md` | ✅ Always |
| **Claude Code** | `CLAUDE.md` | ✅ At session start |
| **Windsurf** | `.windsurf/memory.md` | ✅ By Cascade |

### Option 3: Copy Platform Files
```bash
# Cursor - copy all modular rules
cp -r .cursor/rules/ your-project/.cursor/rules/

# Copilot - copy instructions
cp .github/copilot-instructions.md your-project/.github/
cp -r .github/instructions/ your-project/.github/instructions/

# Claude Code - copy CLAUDE.md and skills
cp CLAUDE.md your-project/
cp -r .claude/ your-project/.claude/

# Windsurf - copy config
cp -r .windsurf/ your-project/.windsurf/
```

---

## 📁 Repository Structure

```
ai-coding-rules/
│
├── 📖 README.md                    # You are here
├── 📋 CHANGELOG.md                 # Version history
├── 🤝 CONTRIBUTING.md              # How to contribute
│
├── 🎯 Platform Configs (Root)
│   ├── CLAUDE.md                   # Claude Code memory
│   ├── cursor-rules.md             # Cursor quick-start
│   ├── claude-instructions.md      # Claude Projects
│   ├── copilot-instructions.md     # Copilot quick-start
│   └── AI_ASSISTANTS.md            # Integration guide
│
├── 📚 docs/                        # Organized documentation
│   ├── core/                       # 🎯 Essential rules
│   │   ├── MASTER_RULES.md         # ⭐ Start here
│   │   ├── global_rules.md         # Operating principles
│   │   ├── STRICT_MODE.md          # Non-negotiable rules
│   │   └── UNIVERSAL_RULE_FORMAT.md
│   │
│   ├── stacks/                     # 🔵 Technology guides
│   │   ├── stack_frontend.md       # React, Next.js, TS
│   │   ├── stack_backend.md        # Node, Express, Nest
│   │   ├── stack_db.md             # SQL, Prisma, Drizzle
│   │   ├── stack_python.md         # Python
│   │   └── stack_rust.md           # Rust
│   │
│   ├── architecture/               # 🏛️ Decision records (NEW v4.6)
│   │   └── decisions/              # ADRs
│   │       ├── template.md
│   │       └── 0001-*.md
│   │
│   ├── workflows/                  # 🟡 Agent patterns
│   │   ├── task_template.md        # Task specification
│   │   ├── agent_loop.md           # Iteration workflow
│   │   └── MEMORY_BANK.md          # Long-term context
│   │
│   ├── operations/                 # ⚪ Security & ops
│   │   ├── security_privacy.md     # Security rules
│   │   ├── GOVERNANCE_AUTOMATION.md # Pre-commit, CI (NEW v4.6)
│   │   └── incident_response.md    # When AI breaks things
│   │
│   ├── security/                   # 🔴 Security guides (NEW v4.6)
│   │   ├── AGENT_VULNERABILITIES.md # Language-specific vulns
│   │   └── CLOUD_IAC_SECURITY.md   # Terraform, Docker, K8s
│   │
│   ├── quality/                    # 🟢 Reviews & metrics
│   │   ├── quality_control.md      # Review gates
│   │   └── code_review_rubric.md   # PR checklist
│   │
│   └── optimization/               # 💰 Token costs
│       ├── TOKEN_OPTIMIZATION.md   # Cost reduction
│       └── RULE_INDEX.md           # Lightweight index
│
├── 🤖 .cursor/rules/               # Cursor MDC rules (23 files)
│   ├── 00-global.mdc               # Always active
│   ├── 20-security-privacy.mdc     # Security files
│   ├── 60-stack-frontend.mdc       # React/Next.js
│   ├── 80-vibe-coding.mdc          # Rapid prototyping
│   ├── 90-ui-components.mdc        # Component patterns (NEW v4.5)
│   ├── 91-api-routes.mdc           # API patterns (NEW v4.5)
│   └── ...
│
├── 🚀 .antigravity/                # Google Antigravity (NEW v4.6)
│   ├── rules.md                    # Project constitution
│   ├── allowlist.json              # Terminal security
│   └── workflows/                  # SOPs
│       ├── deployment-prep.md
│       └── code-review.md
│
├── 🧠 .claude/                     # Claude Code config
│   ├── rules/                      # Path-specific rules
│   │   ├── security.md
│   │   ├── frontend.md
│   │   └── ...
│   └── skills/                     # Structured outputs
│       ├── code-review.md          # Code review skill
│       ├── security-audit.md       # Security audit skill
│       └── rigor-audit.md          # Combined audit
│
├── 🐙 .github/                     # GitHub configs
│   ├── copilot-instructions.md     # Copilot main config
│   └── instructions/               # Path-specific
│       ├── backend.instructions.md
│       ├── frontend.instructions.md
│       └── security.instructions.md
│
├── 🌊 .windsurf/                   # Windsurf/Cascade config
│   ├── memory.md                   # Main memory
│   └── rules/                      # Modular rules
│
├── 🧩 languages/                   # Language blueprints (NEW v4.7)
│   ├── python/                     # Python folder blueprint
│   ├── typescript/                 # TypeScript folder blueprint
│   ├── javascript/                 # JavaScript folder blueprint
│   ├── nextjs/                     # Next.js folder blueprint
│   ├── go/                         # Go folder blueprint
│   ├── rust/                       # Rust folder blueprint
│   ├── dotnet/                     # .NET folder blueprint
│   ├── java/                       # Java folder blueprint
│   ├── kotlin/                     # Kotlin folder blueprint
│   ├── swift/                      # Swift folder blueprint
│   ├── php/                        # PHP folder blueprint
│   ├── ruby/                       # Ruby folder blueprint
│   ├── dart/                       # Dart folder blueprint
│   ├── c/                          # C folder blueprint
│   └── cpp/                        # C++ folder blueprint
│
├── 📝 examples/                    # Examples & tests
│   ├── config/                     # Governance configs (NEW v4.6)
│   ├── modular-structure/          # Per-folder rules
│   └── rule-tests/                 # Rule verification
│       ├── security/               # Security test cases
│       └── quality/                # Quality test cases
│
├── 📋 templates/                   # Reusable templates
│   ├── task_on_hand.md             # Context hygiene (NEW v4.5)
│   └── proposal.md                 # Feature proposals (NEW v4.5)
│
├── 🧪 prompts/                     # Canonical prompts
│   └── vibe-coding-instructions.md
│
└── 🔧 scripts/                     # Automation
    ├── sync_instructions.ps1       # Windows sync
    └── sync_instructions.sh        # Unix sync
```

---

## 🎯 Key Concepts

### Golden Rule
> **Correctness > Simplicity > Consistency > Style**

### Project Constitution (NEW v4.6)
> **The supreme law for AI agents — defines non-negotiable boundaries.**
> See [docs/core/CONSTITUTION.md](docs/core/CONSTITUTION.md)

### Three-Phase Pattern
1. **PLAN** — Understand, break down, confirm
2. **PATCH** — Make minimal, focused changes  
3. **VERIFY** — Test, check, validate

### STRICT Mode
Non-negotiable rules that cannot be bypassed:
- 🔐 No hardcoded secrets
- 🛡️ SQL injection prevention
- 🔑 Auth required on protected routes
- ✅ Input validation required

---

## 🤖 Platform Features

### Cursor (.mdc rules)
- **19 modular rules** with glob-based activation
- **Vibe Coding mode** for rapid prototyping
- **Stack-specific rules** for React, Next.js, Python, Rust

### GitHub Copilot
- **Path-specific instructions** with `applyTo` patterns
- **Terminal warning** for known command execution bug
- **Testing, security, docs** specialized files

### Claude Code
- **CLAUDE.md** auto-loaded at session start
- **Skills system** for structured outputs
- **Path-specific rules** in `.claude/rules/`

### Windsurf
- **Cascade memory** for context persistence
- **Modular rules** matching other platforms

---

## 💡 Skills System (Claude)

Structured output templates for consistent AI responses:

| Skill | Purpose | Invoke |
|-------|---------|--------|
| `code-review` | Structured code review | `/skill:code-review [file]` |
| `security-audit` | OWASP Top 10 scan | `/skill:security-audit [scope]` |
| `refactor-plan` | Strategic refactoring | `/skill:refactor-plan [target]` |
| `rigor-audit` | Combined quality check | `/skill:rigor-audit [scope]` |

---

## 💰 Token Optimization

Reduce AI costs by 60-90%:

| Approach | Tokens | Savings |
|----------|--------|---------|
| Full MASTER_RULES | ~8,000 | — |
| Core only | ~500 | 94% |
| Core + 1 stack | ~1,000 | 88% |

See [docs/optimization/](docs/optimization/) for details.

---

## 🔄 Sync Scripts

Keep platform files in sync with canonical source:

```bash
# Windows
./scripts/sync_instructions.ps1

# Unix/macOS
./scripts/sync_instructions.sh
```

---

## 📊 Version History

| Version | Date | Highlights |
|---------|------|------------|
| **4.3.0** | 2025-01-28 | Skills system, STRICT mode, Universal Rule Format |
| **4.2.0** | 2025-01-28 | Multi-platform support (Copilot, Claude, Windsurf) |
| **4.1.0** | 2025-01-28 | Token optimization guides |

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Follow [CONTRIBUTING.md](CONTRIBUTING.md)
4. Submit PR

---

## 📜 License

MIT License — see [LICENSE](LICENSE)

---

## 🌟 Credits

- Inspired by [Andrej Karpathy's Claude Code observations](https://x.com/karpathy/status/2015883857489522876)
- Skills system inspired by [mamut-lab](https://github.com/orange-dot/mamut-lab)
- Universal format inspired by [aicodingrules.org](https://aicodingrules.org/)
