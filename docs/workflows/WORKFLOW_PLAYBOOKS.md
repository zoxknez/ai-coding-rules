# Workflow Playbooks (v1)

> Workflows are step-by-step execution paths that combine rules and patterns for concrete outcomes. Rules tell you *what*; playbooks tell you *how and when*.

---

## How to Use Playbooks

1. Pick the playbook matching your immediate goal
2. Execute steps in order — each step references the relevant rules
3. Keep output artifacts at each step (plan, tests, validation evidence)
4. Skip steps only if explicitly marked optional

---

## Playbook 1: Ship a New Feature (2-4 hours)

**Scope:** Single feature, one developer + AI assistant

### Prerequisites
- Clear requirement or user story
- Repository cloned with dev environment ready
- Existing tests passing

### Steps

| Step | Goal | Rules to Apply | Output |
|------|------|---------------|--------|
| 1. Scope | Define acceptance criteria | [cognitive_protocols](../core/cognitive_protocols.md) — assumptions ledger | Written criteria + edge cases |
| 2. Plan | Max 10-line implementation plan | [agent_loop](agent_loop.md) — Plan phase | Plan with file list + approach |
| 3. Test First | Write failing test(s) | [testing_strategy](../quality/testing_strategy.md) | Red test(s) |
| 4. Implement | Minimal code to pass tests | [global_rules](../core/global_rules.md) — Golden Rule | Green test(s), <200 LOC |
| 5. Verify | Lint + typecheck + test | [tool_integration](../operations/tool_integration.md) | All checks pass |
| 6. Review | Self-review against rubric | [code_review_rubric](../quality/code_review_rubric.md) | Score ≥ 10/14 |
| 7. Cleanup | Remove dead code, fix imports | [ANTI_SLOP_GUARDRAILS](../operations/ANTI_SLOP_GUARDRAILS.md) | Clean diff |
| 8. Ship | Commit + PR | [team_workflows](../operations/team_workflows.md) | Merged PR |

### Abort Criteria
- 2 failed iterations → ask clarifying questions
- Scope exceeding 3 files → split into sub-features
- New dependency needed → get approval first

---

## Playbook 2: Debug a Production Issue (1-2 hours)

**Scope:** Fix a reported bug with minimal blast radius

### Prerequisites
- Bug report with reproduction steps
- Access to logs/error output
- Existing tests (or ability to add them)

### Steps

| Step | Goal | Rules to Apply | Output |
|------|------|---------------|--------|
| 1. Reproduce | Confirm the bug exists | [debugging_protocol](DEBUGGING_PROTOCOL.md) | Minimal reproduction |
| 2. Failing Test | Write test that captures the bug | [testing_strategy](../quality/testing_strategy.md) | Red test |
| 3. Root Cause | Identify the exact failure point | [debugging_protocol](DEBUGGING_PROTOCOL.md) — bisect | Root cause statement |
| 4. Fix | Smallest possible change | [global_rules](../core/global_rules.md) — minimal diff | Green test, <50 LOC |
| 5. Regression | Ensure no other tests broke | [tool_integration](../operations/tool_integration.md) | All tests pass |
| 6. Document | Add to incident log if severe | [incident_response](../operations/incident_response.md) | Written record |

### Abort Criteria
- Cannot reproduce → request more info, don't guess
- Fix requires architectural change → escalate to playbook 4

---

## Playbook 3: Security Audit Sprint (4-8 hours)

**Scope:** Systematic security review of an existing codebase

### Prerequisites
- Explicit authorization for security testing
- Identified scope (which services/endpoints)
- Access to source code and deployment config

### Steps

| Step | Goal | Rules to Apply | Output |
|------|------|---------------|--------|
| 1. Threat Model | Map assets and attack surfaces | [SECURITY_GUARDRAILS](../operations/SECURITY_GUARDRAILS.md) | Threat map |
| 2. Static Scan | Automated vulnerability detection | [AGENT_VULNERABILITIES](../security/AGENT_VULNERABILITIES.md) | Findings list |
| 3. Auth Review | Check authentication + authorization | [SECURITY_PRIVACY_BASELINE](../operations/SECURITY_PRIVACY_BASELINE.md) | Auth matrix |
| 4. Injection Audit | SQL, XSS, SSRF, path traversal | [AGENT_VULNERABILITIES](../security/AGENT_VULNERABILITIES.md) | Injection report |
| 5. Config Audit | Secrets, env vars, cloud IAM | [CLOUD_IAC_SECURITY](../security/CLOUD_IAC_SECURITY.md) | Config findings |
| 6. Prioritize | Rank by severity + exploitability | [STRICT_MODE](../core/STRICT_MODE.md) | Priority matrix |
| 7. Fix Critical | Address P0/P1 immediately | [agent_loop](agent_loop.md) | Patches + tests |
| 8. Report | Document findings + remediations | [incident_response](../operations/incident_response.md) | Audit report |

---

## Playbook 4: Architecture Refactor (1-2 days)

**Scope:** Restructure code without changing external behavior

### Prerequisites
- Existing tests with >70% coverage
- Clear architectural target state
- Stakeholder alignment on scope

### Steps

| Step | Goal | Rules to Apply | Output |
|------|------|---------------|--------|
| 1. Document Current | Map current architecture | [REFACT_METHODOLOGY](../quality/REFACT_METHODOLOGY.md) — Recognise | Architecture diagram |
| 2. Define Target | Describe desired end state | [SPEC_DRIVEN_DEVELOPMENT](SPEC_DRIVEN_DEVELOPMENT.md) | Architecture proposal |
| 3. Lock Behavior | Ensure tests cover all paths | [testing_strategy](../quality/testing_strategy.md) | Coverage report |
| 4. Extract | Move code in mechanical steps | [REFACT_METHODOLOGY](../quality/REFACT_METHODOLOGY.md) — Extract | Each step passes tests |
| 5. Verify per Step | Run full suite after each move | [agent_loop](agent_loop.md) — Verify | Green suite throughout |
| 6. Clean Seams | Remove adapters/shims | [ANTI_SLOP_GUARDRAILS](../operations/ANTI_SLOP_GUARDRAILS.md) | Minimal final diff |
| 7. ADR | Record the decision and rationale | [architecture decisions](../architecture/decisions/) | ADR document |

### Golden Rule for Refactoring
```
Never refactor and change behavior in the same commit.
```

---

## Playbook 5: Build AI Agent / LLM App (2-5 days)

**Scope:** Design and ship a production-grade AI-powered feature

### Prerequisites
- Clear use case with measurable success criteria
- Model provider access (API key, quotas)
- Budget/cost constraints defined

### Steps

| Step | Goal | Rules to Apply | Output |
|------|------|---------------|--------|
| 1. Define KPIs | Set quality, latency, cost thresholds | [cognitive_protocols](../core/cognitive_protocols.md) | Success criteria doc |
| 2. Select Model | Choose model based on task fit | [AI_MODEL_SELECTION](../core/AI_MODEL_SELECTION.md) | Model decision with rationale |
| 3. Design Prompts | Create and test prompt templates | [prompt_patterns](prompt_patterns.md) | Tested prompt set |
| 4. Build Pipeline | Implement retrieval/processing/output | [MASTER_RULES](../core/MASTER_RULES.md) | Working pipeline |
| 5. Add Guardrails | Input validation, output filtering | [SECURITY_GUARDRAILS](../operations/SECURITY_GUARDRAILS.md) | Safety layer |
| 6. Observability | Logging, tracing, cost tracking | [OBSERVABILITY](../operations/OBSERVABILITY.md) | Monitoring dashboard |
| 7. Evaluate | Run evals against KPIs | [testing_strategy](../quality/testing_strategy.md) | Eval report |
| 8. Iterate | Improve weak points based on data | [agent_loop](agent_loop.md) | Improved metrics |

---

## Playbook 6: New Project Bootstrap (1-2 hours)

**Scope:** Set up a new project with all AI coding rules configured

### Steps

| Step | Goal | Output |
|------|------|--------|
| 1. Init repo | `git init`, choose stack | Repository with package manager |
| 2. Configure AI rules | Copy relevant rule files | `.cursor/`, `.claude/`, `.github/` configs |
| 3. Add CI | Lint + typecheck + test pipeline | CI config file |
| 4. Add pre-commit hooks | Enforce quality locally | Git hooks installed |
| 5. Create MEMORY_BANK | Initialize project context | Filled `MEMORY_BANK.md` |
| 6. First test | Write one passing test | Green test proves setup works |
| 7. First commit | Conventional commit message | Clean initial commit |

---

## Choosing a Playbook

| Situation | Playbook |
|-----------|----------|
| "Add feature X" | 1 — Ship a New Feature |
| "Users report bug Y" | 2 — Debug Production Issue |
| "Is our app secure?" | 3 — Security Audit Sprint |
| "Code is unmaintainable" | 4 — Architecture Refactor |
| "Build an AI feature" | 5 — Build AI Agent / LLM App |
| "Starting from scratch" | 6 — New Project Bootstrap |

## Related Docs
- [Agent Loop](agent_loop.md) — the inner execution loop within each playbook step
- [Spec-Driven Development](SPEC_DRIVEN_DEVELOPMENT.md) — formal proposal process for large changes
- [TASK_LIST](TASK_LIST.md) — track progress across playbook steps
