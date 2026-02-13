# AI Model Selection Guide (v1)

> Choose the right model for the task, not the most expensive one.

---

## Decision Matrix

| Factor | Weight | Question |
|--------|--------|----------|
| Task complexity | High | Does it require multi-step reasoning, large context, or nuance? |
| Speed requirement | Medium | Real-time (<2s) or batch (minutes OK)? |
| Cost sensitivity | Medium | High-volume (cost matters) or low-volume (quality matters)? |
| Context window | High | How much code/context needs to fit? |
| Output format | Low | Structured (JSON) or free-form? |
| Privacy | High | Can data leave your infrastructure? |

## Model Tier Guide

### Tier 1 — Frontier Models (Complex Tasks)
**Use for:** Architecture decisions, complex debugging, security audits, multi-file refactoring, code review

| Model | Strengths | Context | Best For |
|-------|-----------|---------|----------|
| Claude Opus/Sonnet | Nuance, safety, long context, instruction following | 200K | Complex reasoning, code review |
| GPT-4o | Broad knowledge, multimodal, tool use | 128K | General coding, API design |
| Gemini 2.5 Pro | Long context, multimodal, code understanding | 1M+ | Large codebase analysis |

### Tier 2 — Fast Models (Routine Tasks)
**Use for:** Code completion, formatting, simple generation, boilerplate, translations

| Model | Strengths | Context | Best For |
|-------|-----------|---------|----------|
| Claude Haiku | Speed, cost, good quality for size | 200K | Autocomplete, quick tasks |
| GPT-4o-mini | Fast, cheap, good enough for many tasks | 128K | Bulk processing |
| Gemini Flash | Very fast, multimodal | 1M+ | High-volume, simple tasks |

### Tier 3 — Specialized / Local Models
**Use for:** Privacy-critical tasks, offline work, specialized domains

| Model | Strengths | Best For |
|-------|-----------|----------|
| Codestral/DeepSeek | Code-focused, open weights | Code completion, private codebases |
| Qwen 2.5 Coder | Code-focused, multilingual | Local development |
| Llama 3 | General purpose, local inference | Air-gapped environments |

## Task → Model Mapping

| Task | Recommended Tier | Why |
|------|-----------------|-----|
| Code autocomplete | Tier 2 | Speed > depth |
| Bug fix (simple) | Tier 2 | Well-scoped, routine |
| Bug fix (complex, multi-file) | Tier 1 | Needs reasoning chains |
| Architecture design | Tier 1 | Nuance, tradeoff analysis |
| Code review | Tier 1 | Needs to understand intent |
| Test generation | Tier 2 | Formulaic, fast |
| Security audit | Tier 1 | Critical, needs deep understanding |
| Documentation | Tier 2 | Routine writing |
| Refactoring | Tier 1 | Multi-file context, preserve behavior |
| Data transformation | Tier 2 | Mechanical, well-defined |
| Prompt engineering | Tier 1 | Meta-reasoning |
| Private/regulated code | Tier 3 | Data cannot leave premises |

## Cost Optimization Strategies

### 1. Prompt Caching
```
Put stable content (system prompt, rules, context) first.
Put variable content (user query, specific code) last.
Cache hit savings: 80-90% on input tokens.
```

### 2. Tiered Routing
```
User request → Classifier (Tier 2, cheap)
  → Simple task → Route to Tier 2
  → Complex task → Route to Tier 1
```

### 3. Context Window Management
- Strip comments and whitespace before sending to AI
- Send only relevant files, not entire codebase
- Use file summaries for context, full files for the target
- See [TOKEN_OPTIMIZATION](../optimization/TOKEN_OPTIMIZATION.md)

### 4. Batch Where Possible
- Collect multiple small tasks and send as one request
- Use structured output to get multiple answers in one call

## Model-Specific Quirks

### Claude (Anthropic)
- Excels at following complex instructions precisely
- Best for safety-critical and nuanced tasks
- Tends to be thorough (sometimes too verbose)
- Use XML tags for structured prompts
- Leverage prompt caching for repeated context

### GPT-4 (OpenAI)
- Strong at tool/function calling
- Good at JSON mode for structured output
- Can be overly confident (verify claims)
- System message is heavily weighted

### Gemini (Google)
- Unmatched context window (1M+ tokens)
- Good for large codebase analysis
- Multimodal (can analyze screenshots, diagrams)
- May need more specific prompting for coding tasks

## When NOT to Use AI

| Situation | Why | Alternative |
|-----------|-----|-------------|
| Cryptographic implementation | Too risky, subtle bugs | Use vetted libraries |
| Production secrets/config | Data exposure risk | Manual, vault-managed |
| Legal/compliance text | Liability, accuracy critical | Lawyer review |
| High-frequency hot path code | AI adds latency | Manual optimization |
| Undocumented legacy system | AI will hallucinate | Read code manually first |

## Evaluation Framework

### Before Choosing a Model, Test With:
1. **Representative task sample** — 10-20 real tasks from your workflow
2. **Blind comparison** — compare outputs without knowing which model generated them
3. **Edge case battery** — test with tricky inputs, ambiguous requirements
4. **Cost projection** — estimate monthly cost at expected volume
5. **Latency measurement** — time from request to complete response

### Key Metrics
| Metric | Target |
|--------|--------|
| Task completion accuracy | > 85% (Tier 1), > 70% (Tier 2) |
| First-attempt success rate | > 60% |
| Time to complete (vs manual) | < 50% of manual time |
| Cost per task | Defined per team budget |

## Related Docs
- [TOKEN_OPTIMIZATION](../optimization/TOKEN_OPTIMIZATION.md) — reduce costs
- [ai_model_contract](../core/ai_model_contract.md) — behavioral contract with AI
- [cognitive_protocols](../core/cognitive_protocols.md) — how AI should think
- [RULE_SELECTION](../optimization/RULE_SELECTION.md) — which rules to load per context
