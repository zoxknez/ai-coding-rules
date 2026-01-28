---
title: "Three-Phase Development Pattern"
description: "Write naive correct first, add tests to lock behavior, then optimize. Never skip phases."
category: "core"
complexity: "medium"
impact: "critical"
tags: ["karpathy", "correctness", "testing", "optimization"]
relatedRules: ["golden-rule", "test-first-loop"]
pubDate: 2026-01-27
---

## The Pattern

> *"Write the naive algorithm that is very likely correct first, then ask it to optimize while preserving correctness."*  
> — Andrej Karpathy

---

## Phase 1: NAIVE CORRECT

**Goal:** Simplest solution that passes all tests.

```typescript
// Example: Find duplicates in array
function findDuplicates(arr: number[]): number[] {
  const duplicates: number[] = [];
  
  // O(n²) - naive but obviously correct
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j] && !duplicates.includes(arr[i])) {
        duplicates.push(arr[i]);
      }
    }
  }
  
  return duplicates;
}
```

**Rules:**
- Don't optimize
- Don't abstract
- Don't add layers
- **Just correctness**

---

## Phase 2: ADD TESTS

**Goal:** Lock in behavior before optimizing.

```typescript
describe('findDuplicates', () => {
  it('finds duplicates in simple array', () => {
    expect(findDuplicates([1, 2, 3, 2, 4, 1])).toEqual([2, 1]);
  });
  
  it('returns empty for unique array', () => {
    expect(findDuplicates([1, 2, 3])).toEqual([]);
  });
  
  it('handles empty array', () => {
    expect(findDuplicates([])).toEqual([]);
  });
  
  it('handles all duplicates', () => {
    expect(findDuplicates([5, 5, 5])).toEqual([5]);
  });
});
```

**Why this matters:**
- Tests = safety net for Phase 3
- Tests document expected behavior
- Tests catch regression bugs

---

## Phase 3: OPTIMIZE (If Needed)

**Goal:** Improve performance while keeping tests green.

```typescript
function findDuplicates(arr: number[]): number[] {
  const seen = new Set<number>();
  const duplicates = new Set<number>();
  
  // O(n) - optimized with Set
  for (const num of arr) {
    if (seen.has(num)) {
      duplicates.add(num);
    } else {
      seen.add(num);
    }
  }
  
  return Array.from(duplicates);
}
```

**Rules:**
- ✅ Tests must stay green
- ✅ Measure before optimizing (no premature optimization)
- ✅ Document complexity change (O(n²) → O(n))

---

## Anti-Patterns

### ❌ Skipping Phase 1
```
"Let's use a hashmap for O(1) lookup..."
```
**Problem:** Optimization before correctness = bugs in production.

### ❌ Skipping Phase 2
```
"It's obviously correct, no need for tests."
```
**Problem:** How do you know Phase 3 didn't break something?

### ❌ Optimizing Everything
```
"This function runs once on startup, but let me optimize it to O(log n)..."
```
**Problem:** Wasted effort. Optimize hot paths only.

---

## When to Skip Phase 3

- **Low traffic:** Function runs < 10x/sec
- **Small data:** Input size < 100 items
- **Not critical path:** User doesn't wait for this
- **Premature optimization:** No measured bottleneck

**Karpathy's rule:** *"If it's not broken (slow), don't fix it."*

---

## Real-World Example

**Task:** Add CSV export to dashboard.

### Phase 1: Naive
```typescript
function exportCSV(data: User[]): string {
  let csv = 'Name,Email,Role\n';
  
  for (const user of data) {
    csv += `${user.name},${user.email},${user.role}\n`;
  }
  
  return csv;
}
```

### Phase 2: Tests
```typescript
it('exports valid CSV format', () => {
  const users = [
    { name: 'Alice', email: 'alice@ex.com', role: 'admin' },
    { name: 'Bob', email: 'bob@ex.com', role: 'user' },
  ];
  
  expect(exportCSV(users)).toBe(
    'Name,Email,Role\nAlice,alice@ex.com,admin\nBob,bob@ex.com,user\n'
  );
});

it('escapes commas in values', () => {
  const users = [{ name: 'Smith, John', email: 'j@ex.com', role: 'user' }];
  expect(exportCSV(users)).toContain('"Smith, John"');
});
```

### Phase 3: Optimize (Only if slow)
```typescript
function exportCSV(data: User[]): string {
  const rows = ['Name,Email,Role'];
  
  // Use array.join() instead of string concatenation
  for (const user of data) {
    const name = user.name.includes(',') ? `"${user.name}"` : user.name;
    rows.push(`${name},${user.email},${user.role}`);
  }
  
  return rows.join('\n') + '\n';
}
```

**Decision:** Optimize only if exporting > 10k rows takes > 2 seconds.

---

## Summary

```
Phase 1: NAIVE CORRECT     → O(n²) is fine if it works
Phase 2: ADD TESTS         → Lock behavior before changing code
Phase 3: OPTIMIZE          → Only if measured bottleneck, tests stay green
```

**Never skip Phase 1 or 2.**

---

## Related Rules

- [Golden Rule](/rules/golden-rule) - Declarative prompts for AI iteration
- [Test-First Loop](/rules/test-first-loop) - Red → Green → Refactor
- [Complexity Budget](/rules/complexity-budget) - Default to simplest solution
