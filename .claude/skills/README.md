# Claude Skills

> Structured output templates for consistent, high-quality AI assistance.
> Inspired by [mamut-lab](https://github.com/orange-dot/mamut-lab) patterns.

## What Are Skills?

Skills are pre-defined templates that give Claude structured output formats for specific tasks. They ensure:

- **Consistency** - Same format every time
- **Completeness** - Nothing important is missed
- **Actionability** - Clear next steps
- **Strictness** - Non-negotiable rules enforced

## Available Skills

| Skill | Purpose | Invocation |
|-------|---------|------------|
| [code-review](code-review.md) | Structured code review | `/skill:code-review [file]` |
| [security-audit](security-audit.md) | OWASP Top 10 security scan | `/skill:security-audit [scope]` |
| [refactor-plan](refactor-plan.md) | Strategic refactoring | `/skill:refactor-plan [target]` |
| [rigor-audit](rigor-audit.md) | Combined quality check | `/skill:rigor-audit [scope]` |

## Skill Structure

Every skill follows this pattern:

```markdown
# Skill: {Name}

## When to Use
{Triggers and use cases}

## What It Checks
{Table of categories and items}

## Output Format
{Exact template with placeholders}

## STRICT Mode Rules
{Non-negotiable requirements}

## Example
{Sample input and output}

## Invocation
{How to call the skill}
```

## STRICT Mode

Each skill has STRICT mode rules that are **never bypassed**:

- Security skills: Never approve code with vulnerabilities
- Review skills: Always flag missing tests
- Audit skills: Fail on critical issues

To invoke strict mode:
```
/skill:code-review src/auth/ --strict
```

## Creating New Skills

1. Copy the template structure
2. Define clear output format with tables
3. Add non-negotiable STRICT rules
4. Include realistic example
5. Place in `.claude/skills/`

## Skill Workflow

```
┌─────────────────────┐
│   User Request      │
│ "Review this code"  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Skill Selection    │
│  code-review.md     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Apply Template     │
│  + STRICT rules     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Structured Output  │
│  (Consistent)       │
└─────────────────────┘
```

## Integration with Rules

Skills work alongside `.claude/rules/`:

- **Rules** = What principles to follow
- **Skills** = How to structure specific outputs

Example:
- `rules/security.md` says "validate all inputs"
- `skills/security-audit.md` provides the audit report template

## Best Practices

1. **Use skills for repeatable tasks** - Code review, audits, planning
2. **Customize output formats** - Add project-specific sections
3. **Keep STRICT rules minimal** - Only truly non-negotiable items
4. **Include examples** - Show expected input/output
5. **Version skills** - Track changes in git
