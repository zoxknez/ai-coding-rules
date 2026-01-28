# Universal Rule Format (URF)

> Cross-platform AI coding rules specification inspired by [aicodingrules.org](https://aicodingrules.org/).

## The Problem

AI coding assistants use different configuration formats:

| Platform | Format | Location | Syntax |
|----------|--------|----------|--------|
| **Cursor** | MDC (Markdown Components) | `.cursor/rules/*.mdc` | Frontmatter + MD |
| **GitHub Copilot** | Markdown with applyTo | `.github/instructions/*.instructions.md` | YAML frontmatter |
| **Claude Code** | Plain Markdown | `.claude/rules/*.md`, `CLAUDE.md` | Markdown |
| **Windsurf** | Markdown + JSON | `.windsurf/rules/*.md`, `cascade-config.md` | Markdown |
| **Augment** | Markdown | `.augment/rules/*.md` | Markdown |

## Universal Rule Definition Language (RDL)

Based on aicodingrules.org proposal, with practical adaptations:

### Core Schema

```yaml
# rule.yaml
id: "security-no-hardcoded-secrets"
name: "No Hardcoded Secrets"
version: "1.0.0"
category: "security"
severity: "critical"  # critical | high | medium | low | info

applies_to:
  globs: ["**/*.{ts,js,py,go,rs}"]
  excludes: ["**/*.test.*", "**/fixtures/**"]

guidance: |
  Never hardcode secrets, API keys, passwords, or tokens in source code.
  
  ## What to Check
  - API keys (AWS, Stripe, etc.)
  - Database passwords
  - JWT secrets
  - OAuth tokens
  
  ## Instead
  - Use environment variables
  - Use secret management (Vault, AWS Secrets Manager)
  - Use .env files (gitignored)
  
  ## Examples
  
  ❌ Bad:
  ```typescript
  const API_KEY = "sk-abc123...";
  ```
  
  ✅ Good:
  ```typescript
  const API_KEY = process.env.API_KEY;
  ```

enforcement:
  strict: true  # Non-negotiable, cannot be overridden
  autofix: false  # Cannot be auto-fixed safely
  
tests:
  - input: "const key = 'sk-abc123';"
    expected: "FAIL"
  - input: "const key = process.env.API_KEY;"
    expected: "PASS"

references:
  - "https://owasp.org/Top10/A02_2021-Cryptographic_Failures/"
  - "https://cwe.mitre.org/data/definitions/798.html"
```

### Field Definitions

| Field | Required | Description |
|-------|----------|-------------|
| `id` | ✅ | Unique identifier (kebab-case) |
| `name` | ✅ | Human-readable name |
| `version` | ❌ | Semantic version |
| `category` | ✅ | Category: security, quality, style, performance |
| `severity` | ✅ | critical, high, medium, low, info |
| `applies_to.globs` | ✅ | File patterns to apply rule |
| `applies_to.excludes` | ❌ | File patterns to exclude |
| `guidance` | ✅ | Markdown content with examples |
| `enforcement.strict` | ❌ | If true, cannot be overridden |
| `enforcement.autofix` | ❌ | If true, can be auto-fixed |
| `tests` | ❌ | Test cases for rule validation |
| `references` | ❌ | External documentation links |

## Platform Mapping

### Converting URF to Platform-Specific Formats

#### Cursor (.mdc)

```markdown
---
description: No Hardcoded Secrets
globs: ["**/*.{ts,js,py,go,rs}"]
alwaysApply: false
---

# No Hardcoded Secrets

{guidance content from URF}
```

#### GitHub Copilot (.instructions.md)

```markdown
---
applyTo: "**/*.{ts,js,py,go,rs}"
---

# No Hardcoded Secrets

{guidance content from URF}
```

#### Claude Code (.md)

```markdown
# No Hardcoded Secrets

> **Severity:** Critical | **Category:** Security

{guidance content from URF}

## STRICT Mode
This rule cannot be overridden.
```

#### Windsurf (.md)

```markdown
# No Hardcoded Secrets

**Applies to:** `**/*.{ts,js,py,go,rs}`

{guidance content from URF}
```

## Directory Structure

```
.ai-rules/                    # Universal rules (source of truth)
├── rules/
│   ├── security/
│   │   ├── no-secrets.yaml
│   │   ├── input-validation.yaml
│   │   └── auth-required.yaml
│   ├── quality/
│   │   ├── no-any.yaml
│   │   ├── error-handling.yaml
│   │   └── naming-conventions.yaml
│   └── performance/
│       ├── no-n-plus-one.yaml
│       └── bundle-size.yaml
├── rulesets/
│   ├── strict.yaml           # Combines critical rules
│   └── recommended.yaml      # Default ruleset
└── config.yaml               # Global configuration

# Generated platform-specific files
.cursor/rules/                # Auto-generated from .ai-rules/
.github/instructions/         # Auto-generated from .ai-rules/
.claude/rules/               # Auto-generated from .ai-rules/
.windsurf/rules/             # Auto-generated from .ai-rules/
```

## Sync Script

```bash
#!/bin/bash
# sync-ai-rules.sh - Generate platform-specific rules from URF

set -e

SOURCE_DIR=".ai-rules/rules"
CURSOR_DIR=".cursor/rules"
COPILOT_DIR=".github/instructions"
CLAUDE_DIR=".claude/rules"
WINDSURF_DIR=".windsurf/rules"

# Create directories
mkdir -p "$CURSOR_DIR" "$COPILOT_DIR" "$CLAUDE_DIR" "$WINDSURF_DIR"

# Process each URF rule
for rule_file in "$SOURCE_DIR"/**/*.yaml; do
    # Extract fields with yq or similar
    id=$(yq '.id' "$rule_file")
    name=$(yq '.name' "$rule_file")
    globs=$(yq '.applies_to.globs | join(",")' "$rule_file")
    guidance=$(yq '.guidance' "$rule_file")
    severity=$(yq '.severity' "$rule_file")
    
    # Generate Cursor .mdc
    cat > "$CURSOR_DIR/${id}.mdc" << EOF
---
description: $name
globs: $globs
---

# $name

$guidance
EOF

    # Generate Copilot .instructions.md
    cat > "$COPILOT_DIR/${id}.instructions.md" << EOF
---
applyTo: "$globs"
---

# $name

$guidance
EOF

    # Generate Claude .md
    cat > "$CLAUDE_DIR/${id}.md" << EOF
# $name

> **Severity:** $severity

$guidance
EOF

    # Generate Windsurf .md
    cat > "$WINDSURF_DIR/${id}.md" << EOF
# $name

**Applies to:** \`$globs\`

$guidance
EOF

    echo "✅ Generated rules for: $id"
done

echo "🎉 All platform-specific rules generated!"
```

## Rule Categories

### Security Rules (severity: critical/high)

| ID | Name | Strict |
|----|------|--------|
| `security-no-secrets` | No Hardcoded Secrets | ✅ |
| `security-input-validation` | Input Validation Required | ✅ |
| `security-auth-required` | Auth on Protected Routes | ✅ |
| `security-no-sql-injection` | No SQL Injection | ✅ |
| `security-no-eval` | No eval() Usage | ✅ |

### Quality Rules (severity: medium)

| ID | Name | Strict |
|----|------|--------|
| `quality-no-any` | No TypeScript any | ❌ |
| `quality-error-handling` | Proper Error Handling | ❌ |
| `quality-max-complexity` | Cyclomatic Complexity < 10 | ❌ |
| `quality-test-coverage` | Test Coverage > 70% | ❌ |

### Style Rules (severity: low/info)

| ID | Name | Strict |
|----|------|--------|
| `style-naming` | Naming Conventions | ❌ |
| `style-comments` | Comment Guidelines | ❌ |
| `style-file-structure` | File Organization | ❌ |

## Rulesets

Group rules into reusable sets:

```yaml
# .ai-rules/rulesets/strict.yaml
id: strict
name: Strict Ruleset
description: Maximum enforcement for production code

includes:
  - security/*      # All security rules
  - quality/*       # All quality rules

config:
  fail_on: high     # Fail on high severity or above
  autofix: false    # No auto-fixing in strict mode
```

```yaml
# .ai-rules/rulesets/recommended.yaml
id: recommended
name: Recommended Ruleset
description: Balanced rules for most projects

includes:
  - security/*
  - quality/no-any
  - quality/error-handling

excludes:
  - style/*         # Style rules are optional

config:
  fail_on: critical
  autofix: true
```

## Migration Guide

### From Cursor Rules

```bash
# 1. Export existing rules
cat .cursor/rules/*.mdc > exported-rules.md

# 2. Convert to URF (manual or scripted)
# 3. Generate new platform files with sync script
```

### From Copilot Instructions

```bash
# 1. Read existing instructions
cat .github/instructions/*.md > exported-rules.md

# 2. Convert to URF format
# 3. Regenerate all platform files
```

## Best Practices

1. **Single Source of Truth** - Define rules in `.ai-rules/` only
2. **Auto-Generate** - Never manually edit platform-specific files
3. **Version Control** - Track `.ai-rules/` in git
4. **Test Rules** - Include test cases in URF
5. **Document Changes** - Use semantic versioning for rules

## Roadmap

- [ ] CLI tool for URF management
- [ ] IDE extensions for rule authoring
- [ ] Rule marketplace/registry
- [ ] Import from existing rulesets (ESLint, etc.)
- [ ] LLM-assisted rule generation

## References

- [aicodingrules.org](https://aicodingrules.org/) - Original proposal
- [Cursor Rules](https://docs.cursor.com/rules)
- [Copilot Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions)
- [Claude Code Settings](https://docs.anthropic.com/claude-code)
