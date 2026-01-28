# 🏛️ Project Constitution

> **The Supreme Law for AI Agents**
>
> This document defines the non-negotiable boundaries within which AI agents operate.
> Every agent instruction file MUST reference this constitution.
> Violations halt code generation immediately.

---

## Preamble

In the era of Agentic Development, where AI handles implementation details while humans govern intent, the primary risk is not incorrect syntax—it is architectural drift and security erosion.

This Constitution establishes rigid boundaries for the fluid intelligence of AI to safely operate within.

---

## Article I: Security First

### §1.1 The Security Hierarchy

```
SECURITY > CORRECTNESS > PERFORMANCE > BREVITY
```

No optimization justifies a security regression.

### §1.2 Absolute Prohibitions

| Category | Prohibition | Consequence |
|----------|-------------|-------------|
| **Secrets** | No secrets in code, logs, or commits | Immediate rejection |
| **Serialization** | No `pickle`, `eval()`, `exec()` | Immediate rejection |
| **Raw SQL** | No string interpolation in queries | Immediate rejection |
| **Unsafe Blocks** | No `unsafe` (Rust), `dangerouslySetInnerHTML` (React) without explicit approval | Request review |
| **Wildcards** | No `*` permissions in IAM/RBAC | Immediate rejection |

### §1.3 Trust Boundaries

```
NEVER trust:
- User input (validate everything)
- External APIs (verify responses)
- Serialized data (sanitize before use)
- Environment variables (validate format)

ALWAYS verify:
- Authentication before authorization
- Authorization before data access
- Data ownership before mutation
```

---

## Article II: Explicit Intent

### §2.1 Architecture Decision Records

Before implementing any feature that:
- Introduces new dependencies
- Changes authentication/authorization flow
- Modifies database schema
- Alters public API contracts
- Affects more than 3 files

**An ADR MUST exist in `docs/architecture/decisions/`**

### §2.2 No Magic

```
❌ No implicit type conversions
❌ No `any` types (TypeScript)
❌ No wildcard imports
❌ No undocumented side effects
❌ No hidden state mutations
```

### §2.3 Documentation as Code

- README must be updated with code changes
- API changes require OpenAPI/Swagger updates
- Breaking changes require migration guides
- All public functions require JSDoc/docstrings

---

## Article III: Minimal Footprint

### §3.1 The YAGNI Principle

```
Do NOT implement:
- Features not explicitly requested
- "Future-proofing" abstractions
- Unused code paths
- Speculative optimizations
```

### §3.2 Dependency Discipline

Before adding ANY new dependency:

1. **Justify**: Why can't we use existing code?
2. **Evaluate**: Check bundle size, maintenance status, security advisories
3. **Document**: Add to ADR with rationale
4. **Approve**: Requires explicit human approval

### §3.3 File Size Limits

| Metric | Threshold | Action |
|--------|-----------|--------|
| File length | >300 lines | Split into modules |
| Function length | >50 lines | Extract helpers |
| Nesting depth | >3 levels | Refactor with early returns |
| Cyclomatic complexity | >10 | Decompose logic |

---

## Article IV: Verification Loops

### §4.1 Test-First Development

```
1. Write failing test
2. Implement minimum code to pass
3. Refactor
4. Verify all tests pass
5. NEVER skip step 1
```

### §4.2 Pre-Commit Gates

All commits MUST pass:

| Gate | Tool | Blocks |
|------|------|--------|
| Secrets | `detect-secrets` | Any hardcoded credentials |
| Security | `bandit`/`semgrep` | Known vulnerability patterns |
| Types | `tsc`/`mypy` | Type errors |
| Lint | `eslint`/`ruff` | Code style violations |
| Format | `prettier`/`black` | Formatting issues |

### §4.3 Build Verification

```
Before pushing:
1. All tests pass locally
2. Type check passes
3. Lint check passes
4. Build succeeds
5. No new warnings introduced
```

---

## Article V: Language-Specific Mandates

### §5.1 Python

```python
# ✅ REQUIRED
- Type hints on all public functions
- Pydantic models for API schemas
- `with` statements for resources
- Virtual environments always

# ❌ PROHIBITED
- pickle (use JSON/msgpack)
- eval() / exec()
- f-strings in SQL queries
- bare except: clauses
```

### §5.2 TypeScript/JavaScript

```typescript
// ✅ REQUIRED
- Strict mode enabled
- Explicit return types on functions
- Zod/Yup validation on user input
- Error boundaries in React

// ❌ PROHIBITED
- any type
- dangerouslySetInnerHTML (without SafeHTML wrapper)
- eval() / new Function()
- Prop spreading ({...props}) to DOM
```

### §5.3 Go

```go
// ✅ REQUIRED
- All errors must be handled (no _ = err)
- Context propagation for cancellation
- Nil checks before pointer access
- Timeouts on all network calls

// ❌ PROHIBITED
- panic() in library code
- Global mutable state
- Goroutines without context cancellation
```

### §5.4 Rust

```rust
// ✅ REQUIRED
- Result<T, E> for fallible operations
- #[must_use] on functions returning values
- Documentation on public items
- Clippy compliance

// ❌ PROHIBITED
- unsafe blocks (without explicit approval)
- unwrap() in production paths
- panic!() in library code
```

### §5.5 C# / .NET

```csharp
// ✅ REQUIRED
- DTOs for API boundaries (no entity binding)
- IAsyncDisposable for resources
- Nullable reference types enabled
- Dependency injection (no service locator)

// ❌ PROHIBITED
- Singleton services with scoped dependencies
- XmlDocument without XmlResolver = null
- String interpolation in SQL
```

---

## Article VI: Data Governance

### §6.1 Database Operations

```
✅ ALWAYS:
- Use parameterized queries
- Validate tenant isolation
- Implement soft deletes for audit
- Use transactions for multi-step operations

❌ NEVER:
- Trust client-provided IDs
- Expose internal IDs in URLs
- Delete without confirmation
- Modify schema without migration
```

### §6.2 API Design

```
✅ ALWAYS:
- Version all APIs (/v1/, /v2/)
- Return consistent error envelopes
- Implement rate limiting
- Log all mutations

❌ NEVER:
- Expose stack traces in production
- Return more data than requested
- Accept unbounded list queries
- Skip authentication on any endpoint
```

---

## Article VII: Incident Response

### §7.1 When Things Break

If an agent-generated change causes:
- Test failures
- Security scan alerts
- Build failures
- Runtime errors

**IMMEDIATELY:**

1. **STOP** further changes
2. **REVERT** to last known good state
3. **DOCUMENT** what went wrong
4. **ANALYZE** root cause
5. **PREVENT** with new guardrails

### §7.2 Escalation Triggers

The following REQUIRE human review before proceeding:

- Any change to authentication/authorization
- Database migrations
- Environment configuration changes
- Dependency updates with breaking changes
- Changes to CI/CD pipelines
- Any file over 200 lines of changes

---

## Article VIII: Enforcement

### §8.1 Constitutional Hierarchy

```
1. This Constitution (immutable)
2. ADRs (append-only)
3. Platform rules (.cursor, .antigravity, .github)
4. Stack-specific guidelines
5. Team conventions
```

Lower levels CANNOT contradict higher levels.

### §8.2 Amendment Process

This Constitution may only be amended by:

1. Proposing ADR with rationale
2. Team review and approval
3. Updating all platform rule files
4. Notifying all agents of changes

---

## Appendix: Quick Reference

### The Five Commandments

```
1. Security before convenience
2. Explicit over implicit
3. Minimal over comprehensive
4. Tested over trusted
5. Documented over assumed
```

### The Stop Signs

```
🛑 STOP and ask if:
- Changing auth/security
- Modifying database schema
- Adding new dependencies
- Touching more than 5 files
- Removing tests
- Bypassing linters
```

### The Green Flags

```
✅ PROCEED if:
- Tests exist and pass
- Types are complete
- No security warnings
- Change is scoped
- Documentation updated
```

---

*This Constitution was established for the governance of AI agents in the Agentic Development Era.*
*Version: 1.0.0 | Effective: v4.6.0*
