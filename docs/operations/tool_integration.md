# Tool Integration Playbook (v2)

## Ideal toolchain loop
1) Generate patch
2) Run: lint → typecheck → unit tests
3) If fail: read output → minimal fix → repeat
4) Only then: refactor/opt

## What to automate
- Format on save
- Pre-commit hooks
- CI gates
- PR templates with success criteria + verification

## “When to use what”
- Linter: style + common bugs
- Typechecker: contract safety
- Unit tests: behavior correctness
- E2E: user flows
- Static analysis: security + complexity
