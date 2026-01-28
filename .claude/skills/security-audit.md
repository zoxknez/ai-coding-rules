# Skill: Security Audit

> Comprehensive security vulnerability scanning based on OWASP Top 10.

## When to Use

- Before production deployment
- After adding authentication/authorization
- When handling user input
- When integrating external APIs
- During security review cycles

## What It Checks

| Category | Vulnerabilities |
|----------|-----------------|
| **A01 Broken Access Control** | Missing auth, IDOR, privilege escalation |
| **A02 Cryptographic Failures** | Weak encryption, exposed secrets, insecure storage |
| **A03 Injection** | SQL, NoSQL, OS command, LDAP injection |
| **A04 Insecure Design** | Missing threat modeling, insecure patterns |
| **A05 Security Misconfiguration** | Default creds, verbose errors, missing headers |
| **A06 Vulnerable Components** | Outdated deps, known CVEs |
| **A07 Auth Failures** | Weak passwords, missing MFA, session issues |
| **A08 Data Integrity** | Insecure deserialization, missing validation |
| **A09 Logging Failures** | Missing audit logs, log injection |
| **A10 SSRF** | Unvalidated redirects, internal resource access |

## Output Format

```markdown
## Security Audit Report

**Scope:** `{files_or_directory}`
**Auditor:** Claude (AI)
**Date:** {date}
**Standard:** OWASP Top 10 (2021)

### Executive Summary
- **Risk Level:** {CRITICAL | HIGH | MEDIUM | LOW}
- **Vulnerabilities Found:** {count}
- **Immediate Action Required:** {yes|no}

### Vulnerability Matrix

| ID | Category | Severity | Location | Status |
|----|----------|----------|----------|--------|
| V001 | {OWASP category} | {CRITICAL|HIGH|MEDIUM|LOW} | `{file}:{line}` | {OPEN|FIXED} |

### Detailed Findings

#### V001: {Title}
- **Category:** {OWASP category}
- **Severity:** {CRITICAL|HIGH|MEDIUM|LOW}
- **CVSS Score:** {0.0-10.0}
- **Location:** `{file}:{line}`
- **Description:** {what the vulnerability is}
- **Impact:** {what could happen if exploited}
- **Proof of Concept:**
  ```
  {example attack vector}
  ```
- **Remediation:**
  ```{language}
  {fixed code}
  ```
- **References:** {CWE, OWASP links}

### Security Headers Check
| Header | Status | Recommendation |
|--------|--------|----------------|
| Content-Security-Policy | {✅|❌} | {recommendation} |
| X-Frame-Options | {✅|❌} | {recommendation} |
| X-Content-Type-Options | {✅|❌} | {recommendation} |
| Strict-Transport-Security | {✅|❌} | {recommendation} |

### Secrets Scan
| Type | Found | Location | Action |
|------|-------|----------|--------|
| API Keys | {count} | {locations} | {action} |
| Passwords | {count} | {locations} | {action} |
| Tokens | {count} | {locations} | {action} |

### Dependency Vulnerabilities
| Package | Version | CVE | Severity | Fixed In |
|---------|---------|-----|----------|----------|
| {name} | {version} | {CVE-ID} | {severity} | {fixed_version} |

### Remediation Priority
1. 🔴 **Immediate:** {list of critical fixes}
2. 🟠 **This Sprint:** {list of high fixes}
3. 🟡 **Backlog:** {list of medium/low fixes}

### Compliance Notes
{Notes on GDPR, SOC2, HIPAA implications if relevant}
```

## STRICT Mode Rules

These are **non-negotiable** and will fail the audit:

1. **NEVER** pass audit with hardcoded secrets in code
2. **NEVER** pass audit with SQL injection vulnerabilities
3. **NEVER** pass audit without authentication on protected routes
4. **NEVER** pass audit with known CVEs in dependencies (CRITICAL/HIGH)
5. **ALWAYS** require HTTPS for production
6. **ALWAYS** require input validation on user data
7. **ALWAYS** require parameterized queries for database access

## Severity Scoring

| Severity | CVSS Range | Response Time | Examples |
|----------|------------|---------------|----------|
| CRITICAL | 9.0-10.0 | Immediate | RCE, Auth bypass, Data breach |
| HIGH | 7.0-8.9 | 24 hours | SQL injection, XSS stored |
| MEDIUM | 4.0-6.9 | 1 week | CSRF, Info disclosure |
| LOW | 0.1-3.9 | Next release | Minor info leak |

## Example

**Input:** "Security audit for the auth module"

**Output:**

```markdown
## Security Audit Report

**Scope:** `src/auth/**`
**Auditor:** Claude (AI)
**Date:** 2026-01-28
**Standard:** OWASP Top 10 (2021)

### Executive Summary
- **Risk Level:** HIGH
- **Vulnerabilities Found:** 4
- **Immediate Action Required:** yes

### Vulnerability Matrix

| ID | Category | Severity | Location | Status |
|----|----------|----------|----------|--------|
| V001 | A03 Injection | CRITICAL | `auth/login.ts:15` | OPEN |
| V002 | A02 Crypto Failures | HIGH | `auth/jwt.ts:8` | OPEN |
| V003 | A07 Auth Failures | MEDIUM | `auth/session.ts:23` | OPEN |
| V004 | A05 Misconfig | LOW | `auth/config.ts:5` | OPEN |

### Remediation Priority
1. 🔴 **Immediate:** Fix SQL injection in login.ts
2. 🔴 **Immediate:** Move JWT secret to environment variable
3. 🟠 **This Sprint:** Add session expiration
4. 🟡 **Backlog:** Remove verbose error messages
```

## Invocation

```
/skill:security-audit [scope] [--owasp] [--deps] [--secrets]
```

Options:
- `--owasp` - Full OWASP Top 10 analysis
- `--deps` - Include dependency vulnerability scan
- `--secrets` - Include secrets scanning
- `--compliance=SOC2` - Include compliance notes
