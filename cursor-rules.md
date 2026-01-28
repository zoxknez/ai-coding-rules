# Cursor Rules

> Place this file at `.cursor/rules` or `.cursorrules` in your repository root.
> Synced from `prompts/vibe-coding-instructions.md`.
> Prefer the modular `.cursor/rules/*.mdc` set for premium behavior.

---

## Core Contract
- Correctness > simplicity > consistency > style.
- Minimal diff. No drive‑by refactors.
- Ask when ambiguous (assumptions ledger + max 3 questions).
- Test‑first loop: failing test → green → refactor.
- No secrets or PII in code/logs.

---

## Output Format
- PLAN (max 10 lines)
- ASSUMPTIONS (critical marked 🔴)
- QUESTIONS (max 3)
- PATCH (diffs with paths)
- VERIFICATION (commands + manual checks)
- NOTES (tradeoffs/risks)

---

## Stop Triggers
- Security implication
- Data loss
- Breaking change
- >3 files or >200 LOC without approval

---

## References
- MASTER_RULES.md
- global_rules.md
- security_privacy.md
- project_profile.md
- task_template.md
