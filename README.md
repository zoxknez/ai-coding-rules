# 🤖 AI Coding Rules

**Battle-tested rules and protocols for AI coding assistants (Copilot, Cursor, Claude, Codex).**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/yourusername/ai-coding-rules/issues)
[![Sync Instructions Check](https://github.com/zoxknez/ai-coding-rules/actions/workflows/sync-instructions.yml/badge.svg)](https://github.com/zoxknez/ai-coding-rules/actions/workflows/sync-instructions.yml)

---

## 🎯 What is this?

A comprehensive ruleset that makes AI coding assistants **more reliable, predictable, and effective**.

Based on [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) about working with Claude Code (January 2026) and real-world production experience.

> *"Don't tell it what to do — give it success criteria and watch it go."* — Karpathy

---

## 🚀 Quick Start

### Option 1: One File (Recommended)
Copy [`MASTER_RULES.md`](./MASTER_RULES.md) into your AI assistant's project rules.

### Option 2: Platform-Specific

| Platform | File | Where to put it |
|----------|------|-----------------|
| **GitHub Copilot** | [`.github/copilot-instructions.md`](./.github/copilot-instructions.md) | `.github/copilot-instructions.md` |
| **Cursor** | [`cursor-rules.md`](./cursor-rules.md) | `.cursor/rules` or `.cursorrules` |
| **Claude Code** | [`CLAUDE.md`](./CLAUDE.md) | Repository root (auto-loaded) |
| **Claude Projects** | [`claude-instructions.md`](./claude-instructions.md) | Project custom instructions |

### Option 3: Modular Cursor (Premium)
Use the `.cursor/rules/*.mdc` set for conditional, context-aware rule activation:

| Module | File | Activates When |
|--------|------|----------------|
| Global | `00-global.mdc` | Always |
| Security | `20-security-privacy.mdc` | Auth, secrets, crypto files |
| Frontend | `60-stack-frontend.mdc` | React/Next.js files |
| Database | `63-stack-db.mdc` | Prisma, Drizzle, SQL files |
| **Supabase** | `65-stack-supabase.mdc` | Supabase client/functions |
| **Shadcn** | `66-stack-shadcn.mdc` | UI components |
| **Next.js 15** | `67-stack-nextjs15.mdc` | App Router files |
| **Vibe Coding** | `80-vibe-coding.mdc` | Rapid prototyping mode |

### Option 4: Full Setup
1. Add `global_rules.md` + `ai_model_contract.md` to project rules
2. Fill out `project_profile.md` for your repo
3. Use `task_template.md` for every task
4. Pick relevant `stack_*.md` guides
5. Use `prompts/vibe-coding-instructions.md` as the canonical source

### Option 5: Sync Canonical → Platform Files
Use the scripts to keep platform-specific instruction files in sync.

- Windows (PowerShell): `scripts/sync_instructions.ps1`
- macOS/Linux (Bash): `scripts/sync_instructions.sh`

### Option 6: Pre-Commit Guard (Recommended)
Install repo-local git hooks to prevent commits when instructions are out of sync.

- Windows (PowerShell): `scripts/install_git_hooks.ps1`
- macOS/Linux (Bash): `scripts/install_git_hooks.sh`

---

## 📁 Repository Structure

```
ai-coding-rules/
├── 🎯 MASTER_RULES.md           # All-in-one (start here!)
├── 🧱 MONOREPO_RULES.md          # Unified single source of truth (monorepo)
├── 📖 README.md                  # This file
├── 🌐 LANGUAGE_POLICY.md         # English-only content policy
├── 🧠 MEMORY_BANK.md             # Long-term context (template)
├── 🤖 AGENTS.md                  # Agent operating rules (template)
├── ✅ TASK_LIST.md               # Task tracking (template)
│
├── � Token Optimization (NEW!)
│   ├── TOKEN_OPTIMIZATION.md     # Cost reduction strategies
│   ├── RULE_SELECTION.md         # Flowchart for choosing rules
│   └── RULE_INDEX.md             # RAG-friendly lightweight index
│
├── �🔴 Core Rules
│   ├── global_rules.md           # Operating principles
│   ├── ai_model_contract.md      # Behavioral contract
│   ├── cognitive_protocols.md    # Confusion/pushback handling
│   └── project_profile.md        # Repo-specific template
│
├── 🟡 Workflow
│   ├── task_template.md          # Task specification format
│   ├── agent_loop.md             # Iteration workflow
│   ├── loop_strategies.md        # Leverage AI stamina
│   └── prompt_patterns.md        # Copy-paste prompts
│
├── 🟢 Quality
│   ├── quality_control.md        # Review gates
│   ├── code_review_rubric.md     # PR checklist
│   └── evaluation_benchmarks.md  # Measuring effectiveness
│
├── 🔵 Stack Guides
│   ├── stack_frontend.md         # React/Next.js/TypeScript
│   ├── stack_backend.md          # Node/Express/Nest
│   ├── stack_db.md               # SQL/ORM/Migrations
│   ├── stack_python.md           # Python
│   └── stack_rust.md             # Rust
│
├── ⚪ Operations
│   ├── context_management.md     # How to pack context
│   ├── security_privacy.md       # Security guardrails
│   ├── SECURITY_PRIVACY_BASELINE.md
│   ├── incident_response.md      # When AI breaks things
│   ├── team_workflows.md         # Team processes
│   └── tool_integration.md       # CI/CD setup
│
├── 🎯 Platform-Ready
│   ├── copilot-instructions.md   # GitHub Copilot
│   ├── cursor-rules.md           # Cursor
│   └── claude-instructions.md    # Claude Projects

├── 🧭 GitHub Instructions
│   ├── .github/copilot-instructions.md
│   └── .github/instructions/*.instructions.md

├── 🧩 Cursor Modular Rules
│   └── .cursor/rules/*.mdc        # Conditional rule activation

├── 🤖 Claude Code
│   ├── CLAUDE.md                  # Claude Code project memory (auto-loaded)
│   └── .claude/skills/            # Structured output templates (NEW!)
│       ├── code-review.md         # Code review simulation
│       ├── security-audit.md      # OWASP security scanning
│       ├── refactor-plan.md       # Strategic refactoring
│       └── rigor-audit.md         # Combined quality audit

├── 📐 Standards (NEW!)
│   ├── UNIVERSAL_RULE_FORMAT.md   # Cross-platform rule spec (RDL)
│   └── STRICT_MODE.md             # Non-negotiable enforcement rules

├── 🧪 Canonical Prompt Source
│   └── prompts/vibe-coding-instructions.md
│
├── 📁 Examples
│   ├── examples/modular-structure/  # Per-folder rule organization
│   └── examples/rule-tests/         # Rule verification tests (NEW!)
│       ├── security/                # Security rule tests
│       └── quality/                 # Quality rule tests
│
├── 🧹 Guardrails
│   └── ANTI_SLOP_GUARDRAILS.md

├── 🔁 Sync Scripts
│   ├── scripts/sync_instructions.ps1
│   └── scripts/sync_instructions.sh

├── 🧷 Git Hooks (optional)
│   ├── .githooks/pre-commit
│   ├── scripts/install_git_hooks.ps1
│   └── scripts/install_git_hooks.sh
│
└── 📊 report.md                  # Full analysis
```

---

## � Token Optimization & Cost Reduction

**Problem:** Monolithic rules files can cost $50+/day for heavy users.  
**Solution:** Modular loading + prompt caching = 60-90% cost reduction.

### Quick Start

| Approach | Token Cost | Use Case |
|----------|------------|----------|
| Core only | ~500 | Quick fixes, simple tasks |
| Core + 1 stack | ~1,000 | Single-domain features |
| Core + 2 stacks | ~1,500 | Cross-domain work |
| Full MASTER_RULES | ~8,000 | Reference only (don't load daily) |

### Implementation Options

1. **Cursor `.mdc` files** — Use `globs` for automatic conditional loading
2. **Per-folder `.cursorrules`** — Minimal rules per directory
3. **RAG-style index** — AI fetches rules on-demand

### Key Documents

| Document | Purpose |
|----------|---------|
| [**TOKEN_OPTIMIZATION.md**](./TOKEN_OPTIMIZATION.md) | Full cost reduction guide |
| [**RULE_SELECTION.md**](./RULE_SELECTION.md) | Flowchart for choosing rules |
| [**context_management.md**](./context_management.md) | How to pack context efficiently |

### Prompt Caching (Anthropic)

- Cache read tokens cost **10%** of normal input
- Place stable rules at prompt start
- Use `cache_control` breakpoints for 5-min or 1-hour caching
- See [Anthropic docs](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching)

---

## �💡 Key Insights

### The Phase Shift (Karpathy, Jan 2026)

> *"I rapidly went from about 80% manual+autocomplete coding and 20% agents in November to 80% agent coding and 20% edits+touchups in December."*

### What AI Does Wrong
1. **Wrong assumptions** — concludes without checking
2. **Subtle conceptual errors** — violates edge cases, auth, idempotency
3. **Poor confusion management** — doesn't ask, doesn't highlight contradictions
4. **Overengineering** — too many abstractions without need
5. **Side effects** — changes code outside scope

### What AI Does Right
- **Tenacity** — can iterate until success
- **Test loops** — test-first → implement → fix until green
- **Declarative goals** — works best with "what is success" not "what to type"

### The Rules That Work

| Rule | Why It Works |
|------|--------------|
| **Declarative > Imperative** | Enables AI to loop until success |
| **Minimal diff** | Prevents scope creep and side effects |
| **Assumptions ledger** | Surfaces hidden assumptions |
| **Three-phase pattern** | Naive → Correct → Optimize |
| **Test-first loop** | Leverages AI stamina |
| **Pushback protocol** | Prevents bad decisions |
| **Vibe Coding** | Speed > perfection for prototyping |

---

## 🎸 Vibe Coding Protocol

For rapid prototyping and exploration (v4.0):

### When to Activate
- POC or prototype phase
- Solo developer or demo
- Deadline < 48 hours

### Core Principles
1. **Speed > Perfection** — ship fast, iterate later
2. **Reroll Strategy** — 3 AI attempts before manual fix
3. **Commit Checkpoints** — save every 15-30 minutes
4. **Context Preservation** — keep working state clean

### Guardrails (Never Skip)
- [ ] Auth/secrets handled properly
- [ ] No infinite loops or recursion
- [ ] Data is recoverable (soft delete)
- [ ] Graceful error handling

### Exit Criteria
When prototype → production:
- Add comprehensive tests
- Tighten TypeScript strict mode
- Security audit pass
- Documentation complete

---

## ✅ CI Status

This repo enforces instruction sync between the canonical prompt and platform files.

- Sync workflow: [Sync Instructions Check](https://github.com/zoxknez/ai-coding-rules/actions/workflows/sync-instructions.yml)

---

## 📊 Effectiveness Metrics

| Metric | Target | Red Flag |
|--------|--------|----------|
| Iterations to success | <5 | >10 |
| Files changed per task | <3 | >5 |
| LOC per change | <200 | >400 |
| New dependencies | 0 | Any without approval |
| Regressions post-merge | 0 | Any |

---

## 🤝 Contributing

**Contributions are welcome!** This is a living document that improves with community input.

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-rule`)
3. **Commit** your changes (`git commit -m 'Add amazing rule'`)
4. **Push** to the branch (`git push origin feature/amazing-rule`)
5. **Open** a Pull Request

### What We're Looking For

- 🐛 **Bug fixes** — typos, broken links, incorrect info
- 📝 **Improvements** — clearer explanations, better examples
- 🌍 **Translations** — help make this accessible globally
- 🔧 **New stack guides** — Go, Java, C#, Swift, Kotlin, etc.
- 💡 **New patterns** — what works for you?
- 📊 **Case studies** — real-world results

### Contribution Guidelines

- Keep rules **practical and battle-tested**
- Prefer **concrete examples** over abstract theory
- Maintain **consistent formatting**
- Add **your experience** — what worked? what failed?

---

## 📚 Credits & Inspiration

### Primary Source
- **[Andrej Karpathy](https://x.com/karpathy)** — Original insights from [Claude Code observations](https://x.com/karpathy/status/2015883857489522876) (January 2026)

### Built With
- Real-world production experience
- Community contributions
- Continuous iteration

---

## 📜 License

MIT License — use freely, contribute back!

```
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## ⭐ Star History

If this helps you, please ⭐ the repo — it helps others discover it!

---

## 🔗 Related Resources

- [Karpathy's Tweet](https://x.com/karpathy/status/2015883857489522876) — Original inspiration
- [GitHub Copilot Docs](https://docs.github.com/en/copilot)
- [Cursor Docs](https://cursor.sh/docs)
- [Claude Documentation](https://docs.anthropic.com/)

---

<p align="center">
  <b>Made with 🤖 + 🧠 for better AI-assisted coding</b>
</p>
