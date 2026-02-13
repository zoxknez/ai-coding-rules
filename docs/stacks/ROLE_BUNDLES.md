# Role-Based Rule Bundles (v1)

> Don't load all rules for every task. Pick the bundle for your role and goal. Stay lean, stay focused.

---

## How Bundles Work

1. Every role has a **core bundle** (always loaded)
2. Add **domain bundles** based on the task
3. Max recommended: **5-8 documents** per session (to stay within context limits)

---

## Core Bundle (Every Role)

Always load these regardless of task:

| Document | Why |
|----------|-----|
| [MASTER_RULES](../core/MASTER_RULES.md) | Golden Rule, output format, behavioral contract |
| [global_rules](../core/global_rules.md) | Universal coding rules |
| [agent_loop](../workflows/agent_loop.md) | Execution loop |
| [STRICT_MODE](../core/STRICT_MODE.md) | Non-negotiable security rules |

---

## Role Bundles

### Frontend Developer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [stack_frontend](../stacks/stack_frontend.md) | React/Next.js patterns |
| [ACCESSIBILITY](../quality/ACCESSIBILITY.md) | A11Y compliance |
| [testing_strategy](../quality/testing_strategy.md) | Testing pyramid |

**Optional by task:**
- Building forms → [ERROR_HANDLING](../operations/ERROR_HANDLING.md)
- Performance work → [OBSERVABILITY](../operations/OBSERVABILITY.md)
- Security review → [AGENT_VULNERABILITIES](../security/AGENT_VULNERABILITIES.md)

---

### Backend Developer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [stack_backend](../stacks/stack_backend.md) | API patterns, validation |
| [ERROR_HANDLING](../operations/ERROR_HANDLING.md) | Error classification + patterns |
| [OBSERVABILITY](../operations/OBSERVABILITY.md) | Logging, metrics, tracing |

**Optional by task:**
- Database work → [stack_db](../stacks/stack_db.md)
- Auth/payments → [SECURITY_GUARDRAILS](../operations/SECURITY_GUARDRAILS.md)
- Deployment → [CI_CD_PIPELINE](../operations/CI_CD_PIPELINE.md)

---

### Full-Stack Developer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [stack_frontend](../stacks/stack_frontend.md) | Frontend patterns |
| [stack_backend](../stacks/stack_backend.md) | Backend patterns |
| [testing_strategy](../quality/testing_strategy.md) | Testing strategy |
| [ERROR_HANDLING](../operations/ERROR_HANDLING.md) | End-to-end error handling |

---

### Security Engineer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [SECURITY_GUARDRAILS](../operations/SECURITY_GUARDRAILS.md) | Security baselines |
| [AGENT_VULNERABILITIES](../security/AGENT_VULNERABILITIES.md) | AI-specific vulns |
| [CLOUD_IAC_SECURITY](../security/CLOUD_IAC_SECURITY.md) | Infrastructure security |
| [SECURITY_PRIVACY_BASELINE](../operations/SECURITY_PRIVACY_BASELINE.md) | Privacy baseline |

**Workflow:** [Security Audit Sprint](../workflows/WORKFLOW_PLAYBOOKS.md)

---

### DevOps / Platform Engineer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [CI_CD_PIPELINE](../operations/CI_CD_PIPELINE.md) | Pipeline design |
| [CLOUD_IAC_SECURITY](../security/CLOUD_IAC_SECURITY.md) | IaC security |
| [OBSERVABILITY](../operations/OBSERVABILITY.md) | Monitoring stack |
| [GOVERNANCE_AUTOMATION](../operations/GOVERNANCE_AUTOMATION.md) | Automated policy |

---

### Tech Lead / Architect

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [CONSTITUTION](../core/CONSTITUTION.md) | System governance |
| [cognitive_protocols](../core/cognitive_protocols.md) | Decision framework |
| [code_review_rubric](../quality/code_review_rubric.md) | Review scoring |
| [AI_MODEL_SELECTION](../core/AI_MODEL_SELECTION.md) | Model choices |
| [MULTI_AGENT](../workflows/MULTI_AGENT.md) | Multi-agent orchestration |

---

### QA / Test Engineer

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [testing_strategy](../quality/testing_strategy.md) | Testing pyramid + strategy |
| [DEBUGGING_PROTOCOL](../workflows/DEBUGGING_PROTOCOL.md) | Systematic debugging |
| [quality_control](../quality/quality_control.md) | Quality gates |
| [code_review_rubric](../quality/code_review_rubric.md) | Review criteria |

---

### New Project / Greenfield

**Add to Core:**
| Document | Purpose |
|----------|---------|
| [WORKFLOW_PLAYBOOKS](../workflows/WORKFLOW_PLAYBOOKS.md) | Playbook 6: Bootstrap |
| [CI_CD_PIPELINE](../operations/CI_CD_PIPELINE.md) | Set up CI from day 1 |
| [MEMORY_BANK](../workflows/MEMORY_BANK.md) | Initialize project context |
| Stack-specific guide | Choose based on tech decision |

---

## Quick Reference: Task → Bundle

| Task | Load These (beyond Core) |
|------|--------------------------|
| "Build a feature" | Stack guide + testing_strategy |
| "Fix a bug" | DEBUGGING_PROTOCOL + testing_strategy |
| "Security audit" | SECURITY_GUARDRAILS + AGENT_VULNERABILITIES |
| "Set up CI/CD" | CI_CD_PIPELINE + GOVERNANCE_AUTOMATION |
| "Review PR" | code_review_rubric + ANTI_SLOP_GUARDRAILS |
| "Deploy to prod" | CI_CD_PIPELINE + OBSERVABILITY |
| "Refactor code" | REFACT_METHODOLOGY + testing_strategy |
| "Write tests" | testing_strategy + ERROR_HANDLING |
| "New project" | WORKFLOW_PLAYBOOKS + CI_CD_PIPELINE + Stack guide |
| "Design architecture" | cognitive_protocols + AI_MODEL_SELECTION |

---

## Token Budget Guide

| Bundle Size | Recommended For | Est. Tokens |
|-------------|----------------|-------------|
| Core only (4 docs) | Quick fixes, autocomplete | ~3K |
| Core + 2-3 docs | Standard feature work | ~5-8K |
| Core + 5-6 docs | Complex multi-domain work | ~10-15K |
| Full load (all docs) | Never recommended | ~50K+ |

**Rule:** If you're loading > 8 documents, you're probably trying to do too many things in one session. Split the work.

## Related Docs
- [RULE_SELECTION](../optimization/RULE_SELECTION.md) — detailed selection flowchart
- [TOKEN_OPTIMIZATION](../optimization/TOKEN_OPTIMIZATION.md) — minimize context cost
- [RULE_INDEX](../optimization/RULE_INDEX.md) — complete rule inventory
