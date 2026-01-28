---
description: "USE WHEN: refactoring existing code"
globs: []
alwaysApply: false
priority: 72
---

# Refactoring Rules

## Pre-Refactor Checklist
- [ ] Tests exist for current behavior
- [ ] All tests are passing
- [ ] You understand the code's purpose
- [ ] Changes are approved (if >200 LOC)

## Principles
- Make it work → Make it right → Make it fast
- One refactor type per commit
- Keep behavior unchanged (unless fixing bugs)
- Run tests after each step

## Common Refactors
1. **Extract Function** - Split large functions
2. **Rename** - Clarify intent
3. **Extract Variable** - Explain complex expressions
4. **Inline** - Remove unnecessary indirection
5. **Move** - Better file organization

## Anti-Patterns to Fix
- Magic numbers → Named constants
- Nested conditionals → Early returns
- Long functions → Extract helpers
- Duplicate code → DRY it up
- God objects → Single responsibility

## When NOT to Refactor
- Under time pressure (unless blocking)
- Without tests
- Without understanding the code
- When it's "good enough"
