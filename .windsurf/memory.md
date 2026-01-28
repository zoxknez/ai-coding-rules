# Windsurf Memory

> This file is automatically loaded by Windsurf/Cascade at session start.
> Equivalent to CLAUDE.md for Claude Code.

## 🎯 Repository Purpose

This is the **ai-coding-rules** repository — a comprehensive framework for controlling AI-assisted coding across Cursor, GitHub Copilot, Claude Code, and Windsurf. It defines high-signal, low-noise rules that enable AI agents to operate as senior-level engineering partners.

## 📋 Core Contract

- **Correctness > simplicity > consistency > style**
- Minimal diff. No drive-by refactors
- Ask when ambiguous (max 3 questions)
- Test-first loop: failing test → green → refactor
- No secrets or PII in code/logs

## 🛑 Stop Triggers

Pause and confirm before:
- 🔴 Security implications (auth, crypto, secrets)
- 🔴 Data loss potential (migrations, deletions)
- 🔴 Breaking changes (API, schema)
- 🔴 >3 files or >200 LOC without explicit approval

## 📂 Project Structure

```
ai-coding-rules/
├── MASTER_RULES.md          # Central rules (Golden Rule, Three-Phase Pattern)
├── CLAUDE.md                # Claude Code memory
├── .windsurf/
│   └── memory.md            # This file - Windsurf memory
├── .cursor/rules/           # Modular Cursor rules (MDC format)
├── .github/
│   ├── copilot-instructions.md
│   └── instructions/
├── global_rules.md
├── security_privacy.md
└── stack_*.md               # Technology-specific guides
```

## 🔄 Work Protocol

1. **Plan First** - Read relevant files before editing
2. **Minimal Diff** - Change only what's necessary
3. **Consistency** - Match surrounding style
4. **Verify** - Check Markdown renders correctly
5. **Document** - Update CHANGELOG.md for significant changes

## 🔐 Security Rules (Non-Negotiable)

- **Never** add real API keys, tokens, or secrets
- **Always** use `EXAMPLE_` prefix for placeholder values
- **Never** log PII or sensitive data
- **Always** validate inputs in code examples

## 📚 Key References

| Document | Purpose |
|----------|---------|
| `MASTER_RULES.md` | Golden Rule, Three-Phase Pattern |
| `global_rules.md` | Correctness > Simplicity > Consistency > Style |
| `security_privacy.md` | Security guardrails and privacy requirements |

## 🎸 Vibe Coding Mode

This repository embraces **Vibe Coding** principles:
- **Speed over perfection** in early iterations
- **Reroll** instead of debugging when stuck >10 minutes
- **Commit checkpoints** frequently
- **Product thinking** — focus on what we're building, not just how

---

*For Windsurf-specific configuration, see `.windsurf/rules/` directory.*
