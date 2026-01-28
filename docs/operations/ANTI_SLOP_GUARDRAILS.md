# Anti‑Slop Guardrails

## Default Limits
- Max 3 files per iteration
- Max 200 LOC net change
- 0 new dependencies without approval

## If limits are exceeded
- Split into smaller iterations
- Explain why the larger change is necessary

## Cleanup Required (within scope)
- Remove unused imports/vars
- Remove dead code you introduced
- Confirm output follows task spec
