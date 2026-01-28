# Context Management for AI Agents (v3)

## What AI Must Receive to Be Accurate
- Relevant files (or at least paths + key sections)
- Expected behavior (success criteria)
- Scope restrictions (what not to touch)
- Repository conventions (lint, format, patterns)

## How to "Pack Context"
Instead of entire repo, send:
- Entry file + 1–2 dependencies
- Types/DTO/contracts
- Failing test output / stack trace
- Schema definitions if DB-related

## The Golden Rule
If AI can't see the code, it can't know the truth → it should ask or propose minimal plan.

## Common Errors Due to Poor Context
- Hallucinated file paths
- Wrong assumption about auth
- Wrong assumption about DB schema
- Overly generic solution (framework introduction)
- Missing edge cases

## Mini-Checklist Before Task
- [ ] I provided file paths
- [ ] I provided expected result
- [ ] I provided constraints (minimal diff, no deps)
- [ ] I provided commands for test/lint
- [ ] I specified what NOT to change

## Context Size Guidelines
| Context Type | Recommended Size |
|--------------|------------------|
| Single file fix | 1 file + types |
| Feature addition | Entry + 2-3 related files |
| Refactor | All affected files + tests |
| Bug fix | Repro steps + stack trace + relevant code |

## Anti-Hallucination Tips
1. Always provide exact file paths
2. Include type definitions
3. Show existing patterns to follow
4. Specify forbidden patterns explicitly
