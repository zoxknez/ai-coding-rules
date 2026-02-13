# Testing Strategy for AI-Assisted Development (v1)

> Tests are the contract between intent and implementation. AI can write code fast — tests prove it wrote the *right* code.

---

## Golden Rule

**Every AI-generated change MUST include verification.** No exceptions.

## Testing Pyramid

| Layer | Ratio | Purpose | Speed |
|-------|-------|---------|-------|
| Unit | 70% | Pure logic, transformations, edge cases | ms |
| Integration | 20% | Module boundaries, API contracts, DB queries | seconds |
| E2E | 10% | Critical user journeys only | minutes |

## Test-First Protocol (for AI agents)

```
1. Write a failing test that captures the requirement
2. Implement the minimum code to make it pass
3. Refactor while keeping tests green
4. Add edge case tests (null, empty, boundary, concurrent)
```

## What to Test

### Always Test
- Business logic and domain rules
- Input validation and sanitization
- Error handling paths
- Authentication and authorization boundaries
- Data transformations and mappings
- State transitions
- API request/response contracts

### Never Test
- Framework internals (React renders, Express routing)
- Third-party library behavior
- Getter/setter boilerplate
- Constants and configuration values
- Generated code (Prisma client, GraphQL types)

## Test Quality Criteria

| Criterion | Requirement |
|-----------|-------------|
| Deterministic | Same input → same result, no flaky tests |
| Independent | No test depends on another test's state |
| Fast | Unit tests < 5ms each, full suite < 60s |
| Readable | Test name describes behavior, not implementation |
| Minimal | One assertion per concept (not per test) |

## Naming Convention

```
[unit under test]_[scenario]_[expected result]

✅ calculateTax_negativeIncome_returnsZero
✅ login_invalidPassword_returns401
✅ parseCSV_emptyFile_returnsEmptyArray
❌ test1, testCalculation, shouldWork
```

## Framework Recommendations by Stack

| Stack | Unit | Integration | E2E |
|-------|------|-------------|-----|
| TypeScript/JS | Vitest / Jest | Supertest / MSW | Playwright |
| Python | pytest | pytest + httpx | Playwright |
| Go | testing + testify | httptest | Playwright |
| Rust | cargo test | reqwest | Playwright |
| .NET | xUnit / NUnit | WebApplicationFactory | Playwright |
| Java/Kotlin | JUnit 5 | MockMvc / TestContainers | Playwright |

## Mocking Strategy

### Prefer (in order)
1. **Real implementations** — use actual code when feasible
2. **Fakes** — in-memory implementations (e.g., in-memory DB)
3. **Stubs** — predetermined responses
4. **Mocks** — behavior verification (use sparingly)

### Anti-Patterns
- ❌ Mocking everything (tests prove nothing)
- ❌ Mocking what you don't own (wrap it, then mock wrapper)
- ❌ Testing mock behavior instead of real behavior
- ❌ Snapshot tests for logic (use for UI regression only)

## Test Data Management

```
Rule: Test data is code. Treat it with the same rigor.
```

| Pattern | When |
|---------|------|
| Factories/Builders | Complex objects with many variations |
| Fixtures | Stable reference data (countries, currencies) |
| Inline | Simple, self-documenting test cases |
| Seeded DB | Integration tests requiring relational data |

### Sensitive Data Rules
- ❌ Never use real user data in tests
- ❌ Never hardcode API keys or tokens
- ✅ Use `faker` or factory functions
- ✅ Use environment-specific test credentials

## Coverage Guidelines

| Target | Minimum | Ideal |
|--------|---------|-------|
| Business logic | 90% | 95%+ |
| API endpoints | 80% | 90% |
| Utility functions | 95% | 100% |
| UI components | 60% | 80% |
| Overall project | 75% | 85% |

**Coverage is a signal, not a goal.** 100% coverage with bad assertions is worse than 70% with meaningful tests.

## AI-Specific Testing Rules

1. **Verify AI output** — always run tests after AI generates code
2. **Don't trust AI test quality** — review assertions critically; AI tends to write tests that pass but don't actually verify behavior
3. **Watch for tautological tests** — AI often asserts `expect(result).toBe(result)` patterns
4. **Boundary testing** — AI forgets edge cases; explicitly ask for: null, undefined, empty string, 0, negative, MAX_INT, concurrent access
5. **Regression tests** — after fixing a bug, always add a test that reproduces the original failure

## Integration Test Patterns

### API Tests
```typescript
// ✅ Test the contract, not the implementation
it('POST /users returns 201 with valid body', async () => {
  const res = await request(app)
    .post('/users')
    .send({ email: 'test@example.com', name: 'Test' });
  
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('id');
  expect(res.body.email).toBe('test@example.com');
});
```

### Database Tests
```
- Use transactions that rollback after each test
- Use TestContainers for realistic DB behavior
- Never run tests against production databases
- Seed only what each test needs
```

## E2E Test Strategy

### Test Only Critical Paths
1. User registration → onboarding → first action
2. Core business flow (checkout, submission, etc.)
3. Authentication → authorization → protected resource
4. Error recovery (payment failure → retry → success)

### E2E Anti-Flakiness Rules
- Use `data-testid` attributes, never CSS selectors
- Wait for elements explicitly, never `sleep()`
- Isolate test data per run
- Run in CI with consistent viewport/browser version
- Record video on failure for debugging

## Pre-Commit Test Checklist

```
□ All existing tests still pass
□ New code has corresponding tests
□ Edge cases are covered (null, empty, boundary)
□ No flaky tests introduced
□ Test names describe behavior
□ No secrets or real data in tests
□ Coverage did not decrease
```

## Related Docs
- [Code Review Rubric](code_review_rubric.md) — testing is a scoring category
- [Quality Control](quality_control.md) — quality gates include tests
- [Agent Loop](../workflows/agent_loop.md) — verify step requires tests
