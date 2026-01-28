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
- **v4.4.0:** Repository reorganization:
  - Moved 33 files from root to organized `docs/` structure
  - Created 6 category folders: core, stacks, workflows, operations, quality, optimization
  - Added README.md to each folder with contents and usage
  - Root now contains only platform configs and meta files
- **v4.3.0:** Added Skills System, Universal Rule Format, and STRICT Mode:
  - Skills System: `.claude/skills/` with code-review, security-audit, refactor-plan, rigor-audit
  - Universal Rule Format: `UNIVERSAL_RULE_FORMAT.md` for cross-platform rules (RDL spec)
  - STRICT Mode: `STRICT_MODE.md` with non-negotiable enforcement rules
  - Testable Rules: `examples/rule-tests/` with security and quality test cases
  - Inspired by mamut-lab and aicodingrules.org
- **v4.2.0:** Added comprehensive multi-platform AI assistant support:
  - GitHub Copilot: Terminal warning, testing/security/python/docs instructions
  - Claude Code: Expanded CLAUDE.md, added .claude/rules/ with 5 modular rules
  - Windsurf: Created .windsurf/ structure with memory, cascade-config, and rules
  - Cursor: Added 4 new rules (git-workflow, refactoring, error-handling, api-design)
  - Created AI_ASSISTANTS.md integration guide
- **v4.1.0:** Added token optimization guides (TOKEN_OPTIMIZATION.md, RULE_SELECTION.md, RULE_INDEX.md)
- Removed website folder to focus repository on vibe coding rules only.
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
