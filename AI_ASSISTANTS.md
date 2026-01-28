# AI Assistants Integration Guide

> How to configure each AI coding assistant to use rules from this repository.

---

## 📊 Platform Comparison

| Platform | Config Location | Auto-Load | Path-Specific | Format |
|----------|-----------------|-----------|---------------|--------|
| **Cursor** | `.cursor/rules/*.mdc` | ✅ `alwaysApply` | ✅ `globs` | MDC (YAML + Markdown) |
| **GitHub Copilot** | `.github/copilot-instructions.md` | ✅ | ✅ `applyTo` | Markdown + Frontmatter |
| **Claude Code** | `CLAUDE.md`, `.claude/rules/` | ✅ | ✅ `paths` | Markdown + Frontmatter |
| **Windsurf** | `.windsurf/memory.md` | ✅ | Manual | Markdown |

---

## 🔮 Cursor

### Files
```
.cursor/
└── rules/
    ├── 00-global.mdc          # Always-on, priority 0
    ├── 20-security-privacy.mdc
    ├── 60-stack-frontend.mdc
    └── ...
```

### MDC Format
```markdown
---
description: "USE WHEN: [trigger condition]"
globs: ["**/*.ts", "**/*.tsx"]
alwaysApply: false
priority: 50
---

# Rule Title

- Rule content here
```

### How It Works
1. **alwaysApply: true** → Always loaded
2. **globs match** → Loaded when working with matching files
3. **priority** → Higher numbers = higher precedence
4. **description** → Shown to AI as context hint

### Quick Setup
```bash
# Copy this repo's Cursor rules to your project
cp -r .cursor/rules/ /path/to/your-project/.cursor/rules/
```

---

## 🤖 GitHub Copilot

### Files
```
.github/
├── copilot-instructions.md      # Global instructions
└── instructions/
    ├── backend.instructions.md  # applyTo: **/*.{ts,js}
    ├── frontend.instructions.md # applyTo: **/*.{tsx,jsx}
    ├── security.instructions.md # applyTo: **/auth/**
    └── ...
```

### Frontmatter Format
```markdown
---
applyTo: "**/*.{ts,js}"
---

Follow MASTER_RULES.md.

Backend rules:
- Input validation is required
- Never log secrets
```

### Glob Patterns
- `**/*.ts` - All TypeScript files
- `**/api/**` - All files in any api folder
- `{prisma/**,**/*.sql}` - Multiple patterns

### ⚠️ Known Issue: Terminal Commands

🔴 **CRITICAL:** Copilot may attempt to execute commands in a terminal with a running process (dev server), causing crashes.

**Workarounds:**
- Request a new terminal for long-running processes
- Run commands one at a time
- Verify terminal is free before running commands

### Quick Setup
```bash
# Copy Copilot instructions
cp -r .github/ /path/to/your-project/.github/
```

---

## 🧠 Claude Code

### Files
```
project-root/
├── CLAUDE.md                    # Main memory (auto-loaded)
├── CLAUDE.local.md              # Personal (gitignored)
└── .claude/
    ├── settings.json            # Permissions config
    └── rules/
        ├── security.md          # paths: **/auth/**
        ├── frontend.md          # paths: **/*.tsx
        └── ...
```

### Memory Format
```markdown
# CLAUDE.md

## Project Purpose
Brief description...

## Coding Conventions
- Use TypeScript
- Prefer functional patterns

## Key Commands
| Action | Command |
|--------|---------|
| Dev | `pnpm dev` |
```

### Path-Specific Rules
```markdown
---
paths:
  - "**/auth/**"
  - "**/security/**"
---

# Security Rules

- Never log secrets
- Validate all inputs
```

### Permissions (settings.json)
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git diff *)"],
    "deny": ["Read(./.env)", "Bash(rm -rf *)"]
  }
}
```

### Quick Setup
```bash
# Copy Claude Code config
cp CLAUDE.md /path/to/your-project/
cp -r .claude/ /path/to/your-project/.claude/
```

---

## 🏄 Windsurf (Cascade)

### Files
```
project-root/
├── .windsurf/
│   ├── memory.md              # Main memory
│   ├── cascade-config.md      # Tips and shortcuts
│   └── rules/
│       ├── security.md
│       └── ...
└── .codeiumignore             # Files to exclude
```

### Memory Format
```markdown
# Windsurf Memory

## Project Purpose
Brief description...

## Core Contract
- Correctness > simplicity > consistency > style
- Minimal diff, no drive-by refactors

## Key Commands
| Action | Command |
|--------|---------|
| Dev | `pnpm dev` |
```

### Ignore File (.codeiumignore)
```
.env
.env.*
node_modules/
dist/
*.log
```

### Keyboard Shortcuts
| Action | Shortcut |
|--------|----------|
| Open Cascade | `Cmd/Ctrl + L` |
| Inline Command | `Cmd/Ctrl + I` |
| Accept Changes | `Cmd/Ctrl + Enter` |

### Quick Setup
```bash
# Copy Windsurf config
cp -r .windsurf/ /path/to/your-project/.windsurf/
cp .codeiumignore /path/to/your-project/
```

---

## 🔄 Cross-Platform Setup

### 1. Copy All Configs
```bash
# From ai-coding-rules repo root
cp -r .cursor/ /path/to/project/
cp -r .github/ /path/to/project/
cp -r .claude/ /path/to/project/
cp -r .windsurf/ /path/to/project/
cp CLAUDE.md /path/to/project/
cp .codeiumignore /path/to/project/
```

### 2. Customize for Your Project
- Update `CLAUDE.md` and `.windsurf/memory.md` with your project's specifics
- Adjust path patterns in rules to match your structure
- Add project-specific commands and conventions

### 3. Keep Rules in Sync
The sync script maintains consistency:
```bash
# Windows
./scripts/sync_instructions.ps1

# Unix/Mac
./scripts/sync_instructions.sh
```

---

## 📏 Rule Priority Guidelines

| Priority | Category | When to Use |
|----------|----------|-------------|
| 0-19 | Global | Always-on rules |
| 20-39 | Security | Security-critical patterns |
| 40-59 | Process | Testing, documentation |
| 60-79 | Stack | Language/framework specific |
| 80-99 | Project | Project-specific overrides |

---

## 🛠️ Troubleshooting

### Cursor
- Rules not loading? Check `globs` pattern matches your files
- Priority conflicts? Higher number wins

### GitHub Copilot
- Instructions ignored? Check frontmatter syntax
- Terminal issues? Use new terminal for servers

### Claude Code
- Memory not loading? Check file is in project root
- Permission denied? Add to `allow` in settings.json

### Windsurf
- Files not indexed? Check `.codeiumignore` isn't too broad
- Slow responses? Reduce context with focused @-mentions

---

## 📚 Related Documentation

- [Cursor Rules Documentation](https://docs.cursor.com/context/rules-for-ai)
- [GitHub Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)
- [Claude Code Memory](https://code.claude.com/docs/en/memory)
- [Windsurf Cascade](https://docs.windsurf.com/windsurf/cascade)

---

*Last Updated: 2025-01-28*
