# Memory Bank

> Single source of truth for long‑term context.

## Product Vision
- 

## Architecture Decisions
- 

## Conventions & Constraints
- 

## Known Risks
- 

## Open Questions
- 

## Recent Changes
- Added modular Cursor rules under `.cursor/rules/*.mdc` with global, output, security, testing, context, MCP, and stack-specific guidance.
- Created canonical prompt source at `prompts/vibe-coding-instructions.md` and synced platform instruction files.
- Added templates: `AGENTS.md`, `TASK_LIST.md`, and initialized `MEMORY_BANK.md`.
- Added sync scripts to keep platform instruction files aligned with the canonical prompt source.
- Added GitHub Action to enforce instruction sync in CI.
- Added README badge for sync check workflow.
- Added CI Status section to README with sync workflow link.
- Added CONTRIBUTING guidance and PR checklist item for canonical instruction sync.
- Added optional git hook for pre-commit sync enforcement and install scripts.
- Added .gitattributes to enforce LF for shell scripts and git hooks.
- Added GitHub path-scoped instruction files under `.github/instructions/` and `.github/copilot-instructions.md`.
- Added SECURITY_PRIVACY_BASELINE.md and ANTI_SLOP_GUARDRAILS.md.
- Updated sync scripts to include `.github/copilot-instructions.md`.
- Added MONOREPO_RULES.md as unified single source of truth document.
- Added LANGUAGE_POLICY.md and documented English-only requirement in CONTRIBUTING and README.
- Sanitized website environment file to remove real credentials before GitHub push.
