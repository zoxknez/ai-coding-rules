# Pre-Deployment Verification Workflow

> **Standard Operating Procedure for deployment preparation**
>
> Run this workflow before any deployment to staging or production.

---

## Prerequisites

- All feature branches merged to main
- No pending PRs marked as blockers
- CHANGELOG.md updated with release notes

---

## Step 1: Verify Clean Working State

```bash
git status
# Expect: "nothing to commit, working tree clean"
```

If uncommitted changes exist:
- Review and commit meaningful changes
- Stash or discard experimental changes

---

## Step 2: Run Full Test Suite

```bash
npm run test:all
# OR
cargo test --all-features
# OR
python -m pytest --cov
```

**Acceptance Criteria:**
- All tests pass
- Coverage meets minimum threshold (80%+)
- No flaky tests

If tests fail:
- **STOP** the deployment
- Fix failing tests
- Restart workflow

---

## Step 3: Type Check

```bash
npm run typecheck
# OR
mypy .
# OR
cargo clippy
```

**Acceptance Criteria:**
- Zero type errors
- Zero clippy warnings (Rust)

---

## Step 4: Lint Check

```bash
npm run lint
# OR
ruff check .
# OR
golangci-lint run
```

**Acceptance Criteria:**
- Zero lint errors
- Zero new warnings

---

## Step 5: Security Scan

```bash
npm audit --audit-level=high
# AND
semgrep --config auto
# AND
detect-secrets scan
```

**Acceptance Criteria:**
- No high/critical vulnerabilities
- No secrets detected
- No OWASP Top 10 violations

If security issues found:
- Document in `docs/security/known-issues.md`
- Create fix tickets
- Assess deployment risk with team

---

## Step 6: Build Verification

```bash
npm run build
# Verify: Exit code 0, no errors
```

**Acceptance Criteria:**
- Build completes without errors
- Bundle size within limits
- No build warnings

---

## Step 7: CHANGELOG Verification

Review `CHANGELOG.md`:

- [ ] Version number is correct
- [ ] All changes are documented
- [ ] Breaking changes are highlighted
- [ ] Migration notes included if needed

---

## Step 8: Create Release Artifact

```bash
# Generate deployment artifact
git log --oneline -20 > DEPLOYMENT_LOG.md
echo "Deployed at: $(date)" >> DEPLOYMENT_LOG.md
```

---

## Step 9: Final Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Tests passing | ⬜ | |
| Types clean | ⬜ | |
| Lint clean | ⬜ | |
| Security scan | ⬜ | |
| Build success | ⬜ | |
| CHANGELOG updated | ⬜ | |
| Team notified | ⬜ | |

---

## Proceed to Deployment

If all checks pass:

```bash
# Tag the release
git tag -a v{VERSION} -m "Release v{VERSION}"
git push origin v{VERSION}

# Deploy (environment-specific)
# npm run deploy:staging
# npm run deploy:production
```

---

## Rollback Procedure

If deployment fails:

```bash
# Revert to previous tag
git checkout v{PREVIOUS_VERSION}

# Redeploy previous version
# Document incident in docs/operations/incidents/
```

---

*This workflow ensures consistent, safe deployments.*
