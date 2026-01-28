# Example Configuration Files

> **Ready-to-use configurations for governance automation**
>
> Copy these files to your project and customize as needed.

This directory contains example configurations for:

- [Pre-commit hooks](#pre-commit)
- [Semgrep rules](#semgrep)
- [GitHub Actions workflows](#github-actions)
- [EditorConfig](#editorconfig)

---

## Pre-commit

Copy `.pre-commit-config.yaml` from [GOVERNANCE_AUTOMATION.md](../operations/GOVERNANCE_AUTOMATION.md#pre-commit-configuration)

**Quick start:**
```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```

---

## Semgrep

Create `.semgrep/agent-patterns.yaml` with the rules from [GOVERNANCE_AUTOMATION.md](../operations/GOVERNANCE_AUTOMATION.md#semgrep-rules)

**Quick start:**
```bash
pip install semgrep
semgrep --config .semgrep/ .
```

---

## GitHub Actions

See `.github/workflows/security.yml` example in [GOVERNANCE_AUTOMATION.md](../operations/GOVERNANCE_AUTOMATION.md#github-actions)

---

## EditorConfig

```.editorconfig
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.py]
indent_size = 4

[*.go]
indent_style = tab

[*.rs]
indent_size = 4

[Makefile]
indent_style = tab
```

---

## Gitignore Additions

Add these patterns to catch common agent mistakes:

```gitignore
# Secrets (agents sometimes create these)
.env
.env.local
.env.*.local
*.pem
*.key
secrets.json
credentials.json

# Agent artifacts
.antigravity/cache/
.cursor/cache/
.copilot/

# Debug files agents create
debug.log
*.debug.*
test-output/
```

---

## VS Code Settings

Recommended workspace settings for agentic development:

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "python.analysis.typeCheckingMode": "strict",
  "python.formatting.provider": "none",
  "[python]": {
    "editor.defaultFormatter": "charliermarsh.ruff",
    "editor.formatOnSave": true
  },
  "files.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/__pycache__": true,
    "**/.pytest_cache": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/coverage": true,
    "**/*.lock": true
  }
}
```

---

## Implementation Checklist

- [ ] Copy `.pre-commit-config.yaml` to project root
- [ ] Create `.semgrep/` directory with custom rules
- [ ] Add security workflow to `.github/workflows/`
- [ ] Add `.editorconfig` for consistent formatting
- [ ] Update `.gitignore` with secret patterns
- [ ] Configure VS Code workspace settings
- [ ] Run `pre-commit install`
- [ ] Run `pre-commit run --all-files` to verify

---

*These configurations implement the governance framework described in [GOVERNANCE_AUTOMATION.md](../operations/GOVERNANCE_AUTOMATION.md)*
