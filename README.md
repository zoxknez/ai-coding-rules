# 🤖 AI Coding Rules

**Battle-tested rules and protocols for AI coding assistants (Copilot, Cursor, Claude, Codex).**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/yourusername/ai-coding-rules/issues)

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
| **GitHub Copilot** | [`copilot-instructions.md`](./copilot-instructions.md) | `.github/copilot-instructions.md` |
| **Cursor** | [`cursor-rules.md`](./cursor-rules.md) | `.cursor/rules` or `.cursorrules` |
| **Claude** | [`claude-instructions.md`](./claude-instructions.md) | Project custom instructions |

### Option 3: Full Setup
1. Add `global_rules.md` + `ai_model_contract.md` to project rules
2. Fill out `project_profile.md` for your repo
3. Use `task_template.md` for every task
4. Pick relevant `stack_*.md` guides

---

## 📁 Repository Structure

```
ai-coding-rules/
├── 🎯 MASTER_RULES.md           # All-in-one (start here!)
├── 📖 README.md                  # This file
│
├── 🔴 Core Rules
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
│   ├── incident_response.md      # When AI breaks things
│   ├── team_workflows.md         # Team processes
│   └── tool_integration.md       # CI/CD setup
│
├── 🎯 Platform-Ready
│   ├── copilot-instructions.md   # GitHub Copilot
│   ├── cursor-rules.md           # Cursor
│   └── claude-instructions.md    # Claude Projects
│
└── 📊 report.md                  # Full analysis
```

---

## 💡 Key Insights

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
