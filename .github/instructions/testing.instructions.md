---
applyTo: "**/*.{test,spec}.{ts,tsx,js,jsx}"
---

Follow MASTER_RULES.md.

Testing rules:
- Use AAA pattern: Arrange → Act → Assert.
- One assertion concept per test (multiple related expects OK).
- Test behavior, not implementation details.
- Mock external dependencies (APIs, DB), not internal modules.
- Use descriptive test names: "should [action] when [condition]".
- Prefer integration tests for critical paths.
- Aim for >80% coverage on business logic, skip trivial getters/setters.
- Clean up test data in afterEach/afterAll hooks.
