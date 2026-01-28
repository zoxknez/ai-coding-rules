# 💰 Optimization

> Reduce token costs and improve AI performance.

## Files

| File | Purpose |
|------|---------|
| [TOKEN_OPTIMIZATION.md](TOKEN_OPTIMIZATION.md) | Cost reduction guide |
| [RULE_SELECTION.md](RULE_SELECTION.md) | Which rules to load |
| [RULE_INDEX.md](RULE_INDEX.md) | Lightweight lookup index |

## The Problem

Monolithic rules files can cost **$50+/day** for heavy users due to token consumption.

## The Solution

| Approach | Token Cost | Savings |
|----------|------------|---------|
| Full MASTER_RULES | ~8,000 | 0% |
| Core only | ~500 | 94% |
| Core + 1 stack | ~1,000 | 88% |
| Core + 2 stacks | ~1,500 | 81% |

## Strategies

### 1. Modular Loading
Load only what you need:
```
Core rules (~500 tokens)
+ Stack guide (~500 tokens)
= Total: ~1,000 tokens
```

### 2. Prompt Caching
- Cache stable rules at prompt start
- Cached reads cost 10% of normal
- Use `cache_control` breakpoints

### 3. RAG-Style Index
Use `RULE_INDEX.md` (~200 tokens) as lookup:
- AI fetches specific rules on-demand
- Dramatically reduces base context

### 4. Per-Folder Rules
Put `.cursorrules` in each directory:
```
src/
├── .cursorrules     # Frontend rules
├── api/
│   └── .cursorrules # API rules
└── db/
    └── .cursorrules # DB rules
```

## Quick Wins

| Change | Impact |
|--------|--------|
| Remove unused stack guides | -500 tokens each |
| Use RULE_INDEX | -7,800 tokens |
| Enable prompt caching | -90% repeat cost |
| Split by task type | -60% average |
