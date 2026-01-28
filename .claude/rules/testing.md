---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/tests/**"
  - "**/__tests__/**"
---

# Testing Rules

## Structure
- Use AAA pattern: Arrange → Act → Assert
- One assertion concept per test
- Use descriptive names: "should [action] when [condition]"

## Philosophy
- Test behavior, not implementation
- Mock external dependencies (APIs, DB)
- Don't mock internal modules unnecessarily
- Prefer integration tests for critical paths

## Coverage
- Aim for >80% on business logic
- Skip trivial getters/setters
- 100% coverage on security-critical code

## Maintenance
- Clean up test data in afterEach/afterAll
- Keep tests independent (no order dependencies)
- Update tests alongside code changes
