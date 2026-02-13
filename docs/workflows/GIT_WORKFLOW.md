# Git Workflow & Branching Strategy (v1)

> **Consistent Git practices for AI-assisted teams**
>
> When AI agents generate code, clean Git hygiene becomes critical — atomic commits,
> clear messages, and disciplined branching prevent chaos in AI-augmented workflows.

---

## Branching Strategy

### Trunk-Based Development (Recommended)

```
main ──●──●──●──●──●──●──●──●──●──    (always deployable)
        \      /  \       /
         feat-A    feat-B             (short-lived branches)
```

- `main` is always deployable.
- Feature branches live **< 2 days** (ideally < 1 day).
- Merge via **squash merge** or **rebase + merge**.
- Use **feature flags** for incomplete work on main.

### GitHub Flow (Simple)

```
main ──●──●──●──●──●──●──●──
        \      /
         feature/add-auth     (PR required)
```

- One long-lived branch: `main`.
- All work in feature branches.
- Pull Request required for every merge.
- Deploy from `main` after merge.

### Git Flow (Complex / Release-Driven)

```
main ──●─────────────●─────────●──    (tagged releases)
        \           / \       /
develop ──●──●──●──●───●──●──●──      (integration)
            \    /       \  /
             feat-A      feat-B       (feature branches)
```

Use only when: release trains, multiple versions in production, compliance requirements.

---

## Branch Naming

### Convention

```
<type>/<ticket>-<short-description>

# Examples
feature/AUTH-123-add-oauth-login
fix/BUG-456-null-pointer-user-list
chore/INFRA-789-upgrade-node-20
refactor/TECH-012-extract-user-service
docs/DOC-345-api-documentation
hotfix/PROD-678-fix-payment-timeout
```

### Rules

- **Lowercase with hyphens** — no spaces, underscores, or camelCase.
- **Include ticket ID** when available.
- **Keep description under 5 words**.
- **Delete branches after merge** — stale branches create confusion.

---

## Commit Messages

### Conventional Commits (Recommended)

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

| Type | Purpose | Example |
|------|---------|---------|
| `feat` | New feature | `feat(auth): add OAuth2 login` |
| `fix` | Bug fix | `fix(api): handle null user response` |
| `docs` | Documentation | `docs(readme): update setup instructions` |
| `style` | Formatting only | `style: fix indentation in user service` |
| `refactor` | Code restructure | `refactor(db): extract query builder` |
| `perf` | Performance | `perf(api): add Redis caching for users` |
| `test` | Tests | `test(auth): add login edge cases` |
| `chore` | Maintenance | `chore(deps): upgrade fastapi to 0.100` |
| `ci` | CI/CD changes | `ci: add security scanning step` |
| `build` | Build system | `build: switch to pnpm` |
| `revert` | Revert commit | `revert: feat(auth): add OAuth2 login` |

### Rules

1. **Subject line < 72 characters.**
2. **Use imperative mood** — "add feature" not "added feature".
3. **No period at the end of subject.**
4. **Body explains WHY, not WHAT** (the diff shows what).
5. **Reference issues** — `Closes #123`, `Fixes BUG-456`.
6. **Breaking changes** — add `BREAKING CHANGE:` footer or `!` after type.

### Examples

```
feat(api)!: change user endpoint response format

Migrate from flat response to envelope format for consistency
with the rest of the API.

BREAKING CHANGE: GET /users now returns { data: [...], pagination: {...} }
instead of a bare array.

Closes #234
```

```
fix(auth): prevent timing attack on password comparison

Replace string comparison with constant-time comparison
to prevent timing-based password leaks.

Security: CWE-208
```

---

## AI-Specific Git Rules

### Agent Commit Discipline

1. **One logical change per commit** — agents tend to make sweeping changes;
   break into focused commits.
2. **Never commit generated boilerplate in the same commit as logic** —
   separate scaffolding from implementation.
3. **AI-assisted commits get extra review scrutiny** — mark them:
   ```
   feat(auth): add JWT validation

   Co-authored-by: AI Assistant <ai@example.com>
   ```
4. **Review diffs, not just test results** — AI code that passes tests
   may still contain unnecessary complexity.

### Diff Budget

- **Feature PRs**: < 400 lines changed (excluding generated files).
- **Refactoring PRs**: < 200 lines changed.
- **Bug fix PRs**: < 100 lines changed.
- If a PR exceeds the budget, split it into smaller PRs.

---

## Pull Request Template

```markdown
## Summary
<!-- What does this PR do? One sentence. -->

## Type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation
- [ ] Chore

## Changes
<!-- Bullet list of what changed and why -->

## Testing
<!-- How was this tested? -->
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing performed

## Verification Commands
```bash
# Commands reviewer can run to verify
npm test
npm run lint
```

## Screenshots
<!-- If UI changes, before/after screenshots -->

## Risks & Rollback
<!-- What could go wrong? How to rollback? -->

## Checklist
- [ ] Code follows project conventions
- [ ] No hardcoded secrets or credentials
- [ ] Error handling is complete
- [ ] Breaking changes documented
- [ ] Reviewer assigned
```

---

## Merge Strategies

### Squash Merge (Recommended for Feature Branches)

```bash
# Combines all commits into one clean commit
git merge --squash feature/add-auth
```

- Clean linear history on main.
- Messy WIP commits disappear.
- Each merge = one logical unit.

### Rebase + Merge (For Clean History)

```bash
# Replay commits on top of main
git rebase main
git merge --ff-only feature/add-auth
```

- Preserves individual commits.
- Requires clean, atomic commits.
- Never rebase shared/public branches.

### Merge Commit (For Audit Trail)

```bash
# Creates explicit merge commit
git merge --no-ff feature/add-auth
```

- Preserves branch topology.
- Good for compliance / audit requirements.

---

## Pre-Commit Hooks

### Essential Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=500']
      - id: no-commit-to-branch
        args: ['--branch', 'main']
      - id: detect-private-key

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.0
    hooks:
      - id: gitleaks  # Prevent secret commits
```

### Project-Specific Hooks

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run linter
npm run lint --quiet || exit 1

# Run type checker
npm run typecheck || exit 1

# Run fast unit tests
npm test -- --bail --silent || exit 1

echo "Pre-commit checks passed"
```

---

## .gitignore Best Practices

```gitignore
# Dependencies
node_modules/
vendor/
__pycache__/
.venv/

# Build outputs
dist/
build/
*.o
*.pyc

# Environment & secrets
.env
.env.local
*.pem
*.key

# IDE
.idea/
.vscode/settings.json
*.swp

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Coverage & test artifacts
coverage/
.nyc_output/
htmlcov/
```

### Rules

- NEVER commit `.env` files, secrets, or credentials.
- ALWAYS commit lock files (`package-lock.json`, `Cargo.lock`, `poetry.lock`).
- NEVER commit build artifacts unless they are the deliverable.
- Review `.gitignore` when adding new tools or frameworks.

---

## Git Hygiene Commands

```bash
# Clean up stale remote branches
git fetch --prune

# Delete merged local branches
git branch --merged main | grep -v main | xargs git branch -d

# Interactive rebase to clean commits before PR
git rebase -i main

# Amend last commit (before push)
git commit --amend

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Find which commit introduced a bug
git bisect start
git bisect bad HEAD
git bisect good v1.0.0
```

---

## Agent Instructions

```markdown
When working with Git:

1. ALWAYS use Conventional Commits format
2. ALWAYS make atomic commits (one logical change each)
3. ALWAYS keep PRs under diff budget (400 lines max)
4. NEVER commit directly to main
5. NEVER commit secrets, credentials, or .env files
6. NEVER force-push to shared branches
7. Delete feature branches after merge
8. Reference ticket/issue IDs in commit messages
```

---

*Version: 1.0.0*
