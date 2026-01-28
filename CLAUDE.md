# CLAUDE.md – Project Memory

> This file is automatically read by Claude Code at session start.
> It provides project-specific context to make Claude an effective coding partner.

---

## 🎯 Repository Purpose

This is the **ai-coding-rules** repository — a comprehensive framework for controlling AI-assisted coding across Cursor, GitHub Copilot, and Claude Code. It defines high-signal, low-noise rules that enable AI agents to operate as senior-level engineering partners.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Documentation** | Markdown, MDC (Cursor rules format) |
| **Package Manager** | pnpm |

---

## 📦 Commands

| Action | Command |
|--------|---------|
| Sync instructions | `./scripts/sync_instructions.ps1` (Windows) or `./scripts/sync_instructions.sh` (Unix) |

---

## 📁 Project Structure

```
ai-coding-rules/
├── MASTER_RULES.md          # Central rules document (Golden Rule, Three-Phase Pattern)
├── CLAUDE.md                # This file - Claude Code context
├── global_rules.md          # Operating principles for all agents
├── security_privacy.md      # Security guardrails (non-negotiable)
├── cognitive_protocols.md   # Thinking patterns and decision-making
├── project_profile.md       # Template for project-specific config
│
├── Stack Guides
│   ├── stack_frontend.md    # React/Next.js/TypeScript
│   ├── stack_backend.md     # Node.js/Express/Nest
│   ├── stack_db.md          # SQL/ORM/Migrations
│   ├── stack_python.md      # Python
│   └── stack_rust.md        # Rust
│
├── .cursor/rules/           # Modular Cursor rules (MDC format)
│   ├── 00-global.mdc        # Always-on global rules
│   ├── 20-security-privacy.mdc
│   ├── 60-stack-frontend.mdc
│   ├── 63-stack-db.mdc
│   └── ...
│
├── .github/
│   ├── copilot-instructions.md   # GitHub Copilot config
│   └── instructions/             # Granular Copilot instructions
│
└── scripts/                 # Automation scripts
    ├── sync_instructions.ps1
    └── sync_instructions.sh
```

---

## ✍️ Coding Conventions

### General
- Use **Markdown** for all documentation
- Use **MDC format** for Cursor rules (YAML frontmatter + Markdown body)
- Prefer **explicit over implicit** — document assumptions
- Keep files **focused and small** — split if >300 lines

### MDC File Format (.mdc)
```markdown
---
description: "USE WHEN: [trigger condition]"
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
priority: 50
---

# Rule Title

## Section
- Rule content here
```

### Markdown Style
- Use ATX headers (`#`, `##`, `###`)
- Use tables for structured comparisons
- Use code blocks with language hints
- Use emoji sparingly for visual hierarchy (🔴, ✅, ⚠️)

---

## 🔄 Work Protocol

When making changes to this repository:

### 1. Plan First
- Read relevant existing files before editing
- Understand the rule hierarchy (MASTER_RULES → global_rules → stack-specific)
- Check if similar rules exist elsewhere

### 2. Minimal Diff
- Change only what's necessary
- Don't reformat or restructure unrelated sections
- Preserve existing patterns and conventions

### 3. Consistency
- Match the style of surrounding content
- Use the same terminology as existing rules
- Follow the priority numbering scheme for .mdc files

### 4. Verify
- Check that Markdown renders correctly
- Ensure no broken links
- Validate YAML frontmatter syntax in .mdc files

### 5. Document
- Update CHANGELOG.md for significant changes
- Add comments explaining non-obvious decisions

---

## 🔐 Security Rules (Non-Negotiable)

- **Never** add real API keys, tokens, or secrets
- **Always** use `EXAMPLE_` prefix for placeholder values
- **Never** log PII or sensitive data
- **Always** validate inputs in code examples

---

## 📚 Key References

| Document | Purpose |
|----------|---------|
| `MASTER_RULES.md` | Golden Rule, Three-Phase Pattern, Assumptions Ledger |
| `global_rules.md` | Correctness > Simplicity > Consistency > Style |
| `security_privacy.md` | Security guardrails and privacy requirements |
| `cognitive_protocols.md` | How AI should think and make decisions |
| `ANALYSIS_REPORT.md` | Enhancement roadmap and implementation plan |

---

## 🎸 Vibe Coding Mode

This repository embraces **Vibe Coding** principles:

- **Speed over perfection** in early iterations
- **Reroll** instead of debugging when stuck >10 minutes
- **Commit checkpoints** frequently
- **Product thinking** — focus on what we're building, not just how

**Guardrails still apply:**
- Tests required before merge
- Security rules always on
- Tech debt must be documented

---

## 🤝 How to Collaborate with Me (Claude)

### Do
- Give me success criteria, not step-by-step instructions
- Share context from related files
- Ask me to explain trade-offs
- Challenge my assumptions

### Don't
- Assume I know the full project state
- Skip verification steps
- Accept my first answer without review

### When I'm Uncertain
I will:
1. State my assumptions explicitly
2. Ask clarifying questions (max 3)
3. Mark critical assumptions with 🔴
4. Stop and ask before making risky changes

---

*Last Updated: 2026-01-28*
*Version: 1.0*
