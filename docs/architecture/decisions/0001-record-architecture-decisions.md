# ADR-0001: Record Architecture Decisions

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-28 |
| **Author** | AI Coding Rules Team |
| **Supersedes** | N/A |

---

## Context

In the era of Agentic Development ("Vibe Coding"), AI agents make implementation decisions based on their context window. Without documented architectural decisions, agents may:

- Suggest refactors that violate design principles
- Introduce patterns inconsistent with existing architecture
- Repeat discussions about already-decided topics
- Make assumptions that contradict team decisions

We need a systematic way to capture and communicate architectural decisions to both humans and AI agents.

## Decision

> We will use Architecture Decision Records (ADRs) to document significant architectural decisions.

Each ADR will:
- Be stored in `docs/architecture/decisions/`
- Follow a numbered naming convention: `NNNN-short-title.md`
- Use a standardized template
- Include a section specifically for agent instructions
- Be referenced in platform rule files (.cursorrules, .antigravity/rules.md)

## Alternatives Considered

### Alternative 1: Inline Comments

**Description:** Document decisions as code comments.

**Pros:**
- Close to the code
- Easy to find

**Cons:**
- Scattered across codebase
- No central index
- Hard for agents to aggregate

**Why rejected:** Doesn't provide the centralized, discoverable format needed for agentic context.

### Alternative 2: Wiki/Confluence

**Description:** Use external wiki for documentation.

**Pros:**
- Rich formatting
- Search capabilities

**Cons:**
- Not in repository
- Agents can't easily access
- Requires sync

**Why rejected:** Must be in-repo for agent access.

## Consequences

### Positive

- Agents have explicit context for architectural constraints
- Decisions are discoverable and versionable
- New team members understand the "why" behind choices
- Reduces repeated discussions

### Negative

- Overhead to maintain ADRs
- Risk of outdated ADRs if not maintained
- Requires discipline to create ADRs before major changes

### Neutral

- Changes workflow to include ADR creation step

## Implementation Notes

When creating a new ADR:

```bash
# Copy template
cp docs/architecture/decisions/template.md docs/architecture/decisions/NNNN-title.md

# Edit with your decision
# Update the README.md index
```

## Agent Instructions

```markdown
CONTEXT: This project uses ADRs to document architectural decisions.

CONSTRAINTS:
- Before implementing major features, check if a relevant ADR exists
- Do not contradict decisions in accepted ADRs
- If no ADR exists for a major decision, flag for human review

DO:
- Reference ADR numbers when implementing related features
- Follow patterns established in ADRs

DO NOT:
- Implement alternatives that were explicitly rejected in ADRs
- Make architectural decisions without checking for existing ADRs
```

## References

- [Michael Nygard's ADR article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [adr-tools](https://github.com/npryce/adr-tools)
- [MADR template](https://adr.github.io/madr/)

---

*Review checklist:*
- [x] Context clearly explains the problem
- [x] Decision is unambiguous
- [x] Alternatives were genuinely considered
- [x] Consequences are realistic
- [x] Agent instructions are actionable
