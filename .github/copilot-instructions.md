# GitHub Copilot Instructions

> Central instructions for GitHub Copilot. Path-specific rules in `.github/instructions/*.instructions.md`.

## Core Contract

- **Correctness > simplicity > consistency > style**
- Minimal diff. No drive-by refactors
- Ask when ambiguous (max 3 questions)
- Test-first loop: failing test → green → refactor
- No secrets or PII in code/logs

## ⚠️ Known Issues

### Terminal Command Execution
🔴 **CRITICAL:** Copilot has a known issue where it may attempt to execute new commands in a terminal that already has a running process (e.g., dev server). This causes the terminal to crash or commands to fail.

**Workarounds:**
- Always verify the terminal is free before running commands
- For long-running processes (servers, watch modes), request a **new terminal**
- Prefer running one command at a time, waiting for completion
- If starting a dev server, explicitly note it will occupy the terminal

## Output Format

When responding to code requests:

1. **PLAN** (max 10 lines) - What you'll do
2. **ASSUMPTIONS** (critical marked 🔴) - What you're assuming
3. **QUESTIONS** (max 3) - Clarifications needed
4. **PATCH** - Diffs with file paths
5. **VERIFICATION** - Commands to run + manual checks
6. **NOTES** - Tradeoffs and risks

## Stop Triggers

Pause and confirm before:
- 🔴 Security implications (auth, crypto, secrets)
- 🔴 Data loss potential (migrations, deletions)
- 🔴 Breaking changes (API, schema)
- 🔴 >3 files or >200 LOC without explicit approval

## Path-Specific Instructions

This repository uses `.github/instructions/*.instructions.md` files with `applyTo` frontmatter for granular rules:

| File | Applies To |
|------|-----------|
| `backend.instructions.md` | `**/*.{ts,js}` |
| `frontend.instructions.md` | `**/*.{ts,tsx,js,jsx}` |
| `db.instructions.md` | `{prisma/**,drizzle/**,migrations/**,**/*.sql}` |
| `testing.instructions.md` | `**/*.{test,spec}.{ts,tsx,js,jsx}` |
| `security.instructions.md` | `**/auth/**,**/security/**` |
| `python.instructions.md` | `**/*.py` |

## References

- [MASTER_RULES.md](../MASTER_RULES.md) - Golden Rule, Three-Phase Pattern
- [global_rules.md](../global_rules.md) - Operating principles
- [security_privacy.md](../security_privacy.md) - Security guardrails
- [project_profile.md](../project_profile.md) - Project-specific config
