# Architecture Decision Records (ADRs)

> **Documenting Architectural Decisions for Agentic Development**
>
> ADRs capture the context, decision, and consequences of significant architectural choices.
> Agents MUST read relevant ADRs before implementing features that touch these domains.

---

## What is an ADR?

An Architecture Decision Record captures:

1. **Context** - The situation and constraints at the time
2. **Decision** - The choice made
3. **Consequences** - What follows from this decision
4. **Status** - Proposed, Accepted, Deprecated, Superseded

## Why ADRs for Vibe Coding?

When you instruct an agent to "Refactor the authentication flow," the agent needs to understand:

- Why was the current approach chosen?
- What constraints exist?
- What alternatives were considered and rejected?

Without this context, agents may suggest refactors that violate fundamental architectural premises.

## Directory Structure

```
docs/
└── architecture/
    └── decisions/
        ├── README.md (this file)
        ├── 0001-record-architecture-decisions.md
        ├── 0002-use-adr-template.md
        └── template.md
```

## Creating a New ADR

1. Copy `template.md` to `NNNN-short-title.md`
2. Fill in all sections
3. Submit for review
4. Once accepted, reference in agent instructions

## Instructing Agents

In your `.cursorrules` or `.antigravity/rules.md`:

```markdown
Before implementing features related to:
- Authentication → Read docs/architecture/decisions/0003-auth-strategy.md
- Database schema → Read docs/architecture/decisions/0004-data-model.md
- API design → Read docs/architecture/decisions/0005-api-versioning.md
```

## ADR Index

| Number | Title | Status | Domain |
|--------|-------|--------|--------|
| 0001 | [Record Architecture Decisions](0001-record-architecture-decisions.md) | Accepted | Process |
| 0002 | [Use ADR Template](0002-use-adr-template.md) | Accepted | Process |

---

*Add new ADRs to the index table above.*
