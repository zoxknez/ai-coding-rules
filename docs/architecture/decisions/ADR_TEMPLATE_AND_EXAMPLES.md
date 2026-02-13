# ADR-000: Template for Architecture Decision Records

**Status:** Template  
**Date:** 2026-02-13  
**Deciders:** [list people/roles involved]  

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive
- [benefit 1]
- [benefit 2]

### Negative
- [tradeoff 1]
- [tradeoff 2]

### Risks
- [risk 1 + mitigation]

## Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| [option A] | ... | ... | ... |
| [option B] | ... | ... | ... |

## Validation

How will we know this decision was correct?
- [metric or observable outcome 1]
- [metric or observable outcome 2]

---

# ADR-001: Declarative Rules Over Imperative Instructions

**Status:** Accepted  
**Date:** 2025-01-15  
**Deciders:** Repository maintainers  

## Context

AI coding assistants can be instructed either imperatively ("do step 1, then step 2, then step 3") or declaratively ("achieve this success criteria, you choose the approach"). Research by Andrej Karpathy and practical experience showed that imperative instructions create brittle, context-dependent behaviors that break when conditions change.

## Decision

All rules in this repository are written as **declarative success criteria** rather than step-by-step commands. We tell AI *what* to achieve, not *how* to achieve it.

## Consequences

### Positive
- Rules remain valid across different models and tool versions
- AI can leverage its full capabilities to find optimal paths
- Rules are more compact and cache-friendly
- Less maintenance burden when tools/APIs change

### Negative
- Harder to debug when AI misinterprets criteria
- Requires clear, unambiguous success criteria (more thought upfront)
- Some tasks genuinely need procedural steps (deployment, migration)

## Validation
- Reduced rule maintenance frequency after tool updates
- Higher AI task completion rates with declarative vs imperative prompts

---

# ADR-002: Security Rules Are Non-Overridable

**Status:** Accepted  
**Date:** 2025-02-01  
**Deciders:** Repository maintainers  

## Context

During vibe-coding sessions, developers may request AI to skip security checks for speed. This creates a systemic risk where the most dangerous changes get the least scrutiny.

## Decision

Security rules (STRICT_MODE) cannot be overridden by any user instruction, project configuration, or AI self-judgment. They are constitutional — immutable during operation.

## Consequences

### Positive
- Prevents the most dangerous category of AI coding errors
- Creates a trust boundary that teams can rely on
- Reduces liability exposure

### Negative
- Slows down prototyping when security checks are false positives
- Frustrated developers may work around the system entirely
- Some legitimate use cases (CTF, security research) require different rules

### Risks
- Developers bypassing AI entirely for security-critical code → mitigated by having STRICT_MODE cover only true non-negotiables (secrets, injection, auth)

## Validation
- Zero security-critical incidents traced to AI-generated code
- Developer satisfaction surveys show understanding of rationale
