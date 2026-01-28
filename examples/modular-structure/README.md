# Modular Rules Example Structure

This folder demonstrates how to organize rules **per-folder** for minimal token usage.

## Structure

```
examples/modular-structure/
├── README.md                    # This file
├── .cursorrules                 # Root: minimal global rules (~300 tokens)
├── src/
│   ├── components/
│   │   └── .cursorrules         # React-specific rules (~200 tokens)
│   ├── server/
│   │   └── .cursorrules         # Backend-specific rules (~200 tokens)
│   ├── database/
│   │   └── .cursorrules         # DB-specific rules (~200 tokens)
│   └── auth/
│       └── .cursorrules         # Security-specific rules (~250 tokens)
└── tests/
    └── .cursorrules             # Testing-specific rules (~200 tokens)
```

## How It Works

1. **Cursor/Copilot loads rules hierarchically**
2. Child folders inherit parent rules
3. Child rules are **additive**, not duplicative
4. Total tokens = sum of path from root to current folder

## Example Token Calculation

Working in `src/components/Button.tsx`:
```
Root .cursorrules:           300 tokens
+ src/components/.cursorrules: 200 tokens
= Total:                      500 tokens
```

Working in `src/database/schema.prisma`:
```
Root .cursorrules:           300 tokens
+ src/database/.cursorrules:   200 tokens
= Total:                      500 tokens
```

## Key Benefits

- **Isolation**: React rules don't pollute backend work
- **Efficiency**: Only relevant rules loaded
- **Maintainability**: Rules live near the code they govern
- **Scalability**: Add new folders without bloating others
