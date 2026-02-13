# Multi-Agent Orchestration Patterns (v1)

> One agent writes code. Two agents review each other. Multiple agents build systems. Coordination is the hard part.

---

## When to Use Multi-Agent

| Scenario | Single Agent | Multi-Agent |
|----------|-------------|-------------|
| Fix a bug | ✅ | Overkill |
| Add a feature | ✅ | If cross-domain |
| Full project build | Insufficient | ✅ |
| Security audit + fix | Insufficient | ✅ |
| Code review + improve | Insufficient | ✅ |

## Agent Roles

### The Core Four

| Role | Responsibility | Rules Loaded |
|------|---------------|--------------|
| **Architect** | System design, decide patterns, approve interfaces | MASTER_RULES, cognitive_protocols, stack guides |
| **Implementer** | Write code, follow specs, run tests | global_rules, agent_loop, testing_strategy |
| **Reviewer** | Review output, find bugs, check quality | code_review_rubric, SECURITY_GUARDRAILS |
| **Tester** | Write tests, verify edge cases, validate security | testing_strategy, AGENT_VULNERABILITIES |

### Specialized Roles (add when needed)

| Role | When | Responsibility |
|------|------|---------------|
| **Security Auditor** | Handling auth, payments, PII | Threat modeling, vulnerability scanning |
| **DevOps** | Infrastructure changes | CI/CD, deployment, IaC review |
| **Documenter** | Public API, user-facing features | API docs, user guides, changelogs |

## Orchestration Patterns

### Pattern 1: Sequential Pipeline
```
Architect → Implementer → Tester → Reviewer → Ship
```
- Simplest pattern
- Each agent's output feeds the next
- Bottleneck: each agent waits for the previous

### Pattern 2: Parallel with Merge
```
         ┌→ Implementer (frontend) ──┐
Architect ─┤                           ├→ Reviewer → Ship
         └→ Implementer (backend)  ──┘
Tester runs in parallel with each Implementer
```
- Faster for full-stack work
- Requires clear interface contract from Architect
- Merge point needs conflict resolution

### Pattern 3: Review Loop
```
Implementer → Reviewer → Implementer (fix) → Reviewer (verify) → Ship
                ↓ (if critical)
              Architect (redesign)
```
- Higher quality output
- Catches issues early
- Can loop indefinitely without stop criteria

### Pattern 4: Adversarial Testing
```
Implementer → writes code
Tester → tries to break it (edge cases, security, load)
Implementer → fixes failures
Repeat until Tester passes
```
- Best for security-critical code
- Red team / blue team dynamic
- Computationally expensive

## Communication Protocol

### Agent-to-Agent Handoff Format
```markdown
## Handoff: [Source Role] → [Target Role]

### Context
- Task: [what is being done]
- Current state: [what is complete]
- Decisions made: [key choices with rationale]

### Your Assignment
- [Specific task for the receiving agent]
- [Acceptance criteria]
- [Constraints and boundaries]

### Files Touched
- [file1.ts — what was changed/created]
- [file2.ts — what was changed/created]

### Open Questions
- [Anything unresolved that needs the next agent's judgment]
```

### Rules for Handoffs
1. **Include all context** — receiving agent has no memory of previous agents' work
2. **Be specific about expectations** — "review" is vague; "check for SQL injection in auth endpoints" is specific
3. **Include file paths** — agents don't know where to look unless told
4. **State what is NOT done** — prevents false completion claims

## Conflict Resolution

### When Agents Disagree
```
Implementer wants Pattern A.
Reviewer prefers Pattern B.

Resolution Protocol:
1. Both state their rationale (pros, cons, tradeoffs)
2. Apply the Golden Rule: Correctness > Simplicity > Consistency > Style
3. If still tied → the Architect decides
4. If no Architect → the simpler solution wins
5. Document the decision as an ADR
```

### Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Agent echo chamber | Agents agree uncritically | Assign adversarial role explicitly |
| Infinite review loop | Reviewer always finds something | Set max 2 review rounds |
| Context loss | Agent 3 doesn't know Agent 1's decisions | Use handoff format above |
| Scope creep | Each agent adds "improvements" | Freeze scope per agent |
| Authority vacuum | No agent makes final decision | Designate Architect as tiebreaker |

## Token Budget Management

### Rule: Multi-agent is expensive. Budget accordingly.

| Phase | Est. Tokens | Strategy |
|-------|------------|----------|
| Architecture | 5-10K | Load only core rules |
| Implementation | 10-30K per file | Load stack-specific rules |
| Testing | 5-15K | Load testing + security rules |
| Review | 5-10K | Load review rubric + security |

### Optimization
- Don't load all rules for all agents — each role needs different rules
- See [RULE_SELECTION](../optimization/RULE_SELECTION.md) for which rules to load per role
- Share context via files, not via agent-to-agent prompt relay
- Use [TOKEN_OPTIMIZATION](../optimization/TOKEN_OPTIMIZATION.md) for cost reduction

## Practical Setup Examples

### Claude Code (Multi-session)
```bash
# Session 1: Architect
claude --prompt "You are the Architect. Design the API for [feature]."

# Session 2: Implementer  
claude --prompt "You are the Implementer. Here is the spec: [paste architect output]."

# Session 3: Reviewer
claude --prompt "You are the Reviewer. Review this code: [paste implementation]."
```

### Cursor (Multi-agent via Composer)
```
Agent 1 (Architect): @workspace Design the data model for user billing
Agent 2 (Implementer): Implement the billing service following this spec: [spec]
Agent 3 (Reviewer): Review the billing service in src/billing/ for security issues
```

### GitHub Copilot (Sequential in Chat)
```
1. Ask Copilot to design the architecture
2. Ask Copilot to implement (with architecture context)
3. Ask Copilot to review (with implementation context)
4. Each step in a new chat to avoid context contamination
```

## Quality Checks for Multi-Agent Output

```
□ All agents referenced the same spec/requirements
□ No agent contradicted another's decisions without justification
□ Final output passes all automated checks (lint, test, type)
□ Security-critical paths were reviewed by at least 2 agents
□ An ADR exists for significant architectural decisions
□ Total scope stayed within original boundaries
```

## Related Docs
- [AGENTS](AGENTS.md) — single agent operating rules
- [agent_loop](agent_loop.md) — inner execution loop per agent
- [RULE_SELECTION](../optimization/RULE_SELECTION.md) — which rules per role
- [TOKEN_OPTIMIZATION](../optimization/TOKEN_OPTIMIZATION.md) — cost management
