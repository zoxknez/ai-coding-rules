# 🔄 R.E.F.A.C.T. Methodology

> **Anti-Slop Framework for AI-Assisted Refactoring**
> 
> AI often writes "slop" — code that works but is unreadable, unmaintainable, or inefficient.
> This methodology forces structured refactoring that produces clean, production-ready code.

---

## The Acronym

| Phase | Name | Description |
|-------|------|-------------|
| **R** | Recognise | Identify code smells and refactoring opportunities |
| **E** | Extract | Extract functions, classes, or modules |
| **F** | Format | Apply consistent formatting and naming |
| **A** | Address Edge Cases | Handle all error conditions |
| **C** | Confirm | Verify tests pass and behavior unchanged |
| **T** | Tune | Optimize performance if needed |

---

## Phase Details

### 1. 🔍 Recognise

**Trigger:** Before adding new features, check existing code.

#### Code Smells to Detect

| Smell | Threshold | Action |
|-------|-----------|--------|
| **Long File** | >300 lines | Split into modules |
| **Long Function** | >50 lines | Extract functions |
| **Deep Nesting** | >3 levels | Early returns, extract |
| **God Class** | >10 methods | Split responsibilities |
| **Duplicate Code** | >10 lines | Extract shared function |
| **Magic Numbers** | Any | Create named constants |
| **Long Parameter List** | >4 params | Use options object |

#### Recognition Prompt

```markdown
Before implementing [FEATURE], analyze the target file(s) for:
- [ ] Files >300 lines
- [ ] Functions >50 lines
- [ ] Nesting >3 levels deep
- [ ] Duplicated code blocks
- [ ] Missing error handling
- [ ] Untested code paths

If any issues found, propose refactoring BEFORE adding new code.
```

---

### 2. ✂️ Extract

**Principle:** Separation of concerns. One function = one job.

#### Extraction Patterns

```typescript
// ❌ BEFORE: Monolithic function
async function handleSubmit(data: FormData) {
  // 1. Validate (10 lines)
  // 2. Transform (15 lines)
  // 3. API call (20 lines)
  // 4. Update state (10 lines)
  // 5. Navigate (5 lines)
}

// ✅ AFTER: Extracted functions
async function handleSubmit(data: FormData) {
  const validated = validateFormData(data);
  const payload = transformToApiPayload(validated);
  const result = await submitToApi(payload);
  updateStateWithResult(result);
  navigateToSuccess();
}

// Each extracted function is:
// - Single responsibility
// - Testable in isolation
// - Reusable
```

#### Extraction Rules

1. **Extract when:**
   - Code block has a clear single purpose
   - Same code appears 2+ times
   - Function exceeds 50 lines
   - Nesting exceeds 3 levels

2. **Naming convention:**
   - Verb + Noun: `validateUser`, `calculateTotal`, `formatDate`
   - Boolean: `isValid`, `hasPermission`, `canEdit`
   - Handlers: `handleClick`, `onSubmit`, `processOrder`

---

### 3. 🎨 Format

**Goal:** Consistent, readable code that matches the codebase.

#### Formatting Checklist

- [ ] Run Prettier/ESLint auto-fix
- [ ] Consistent naming (camelCase functions, PascalCase components)
- [ ] Logical ordering of imports (external → internal → types)
- [ ] Consistent spacing and indentation
- [ ] Remove commented-out code
- [ ] Add JSDoc for public APIs

#### Naming Conventions

```typescript
// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = 'https://api.example.com';

// Functions: camelCase with verb
function getUserById(id: string) { }
function calculateTotalPrice(items: Item[]) { }

// Classes/Components: PascalCase
class UserService { }
function UserProfile() { }

// Interfaces/Types: PascalCase with 'I' prefix optional
interface User { }
type UserRole = 'admin' | 'user';

// Private: underscore prefix (optional)
private _internalState = {};
```

---

### 4. 🛡️ Address Edge Cases

**Principle:** Production code handles ALL failure modes.

#### Required Edge Cases

```typescript
// ✅ COMPLETE error handling
async function fetchUser(id: string): Promise<User> {
  // 1. Input validation
  if (!id || typeof id !== 'string') {
    throw new InvalidInputError('User ID is required');
  }
  
  // 2. API call with error handling
  try {
    const response = await api.get(`/users/${id}`);
    
    // 3. Response validation
    if (!response.ok) {
      if (response.status === 404) {
        throw new NotFoundError(`User ${id} not found`);
      }
      throw new ApiError(`Failed to fetch user: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 4. Data validation
    const parsed = UserSchema.safeParse(data);
    if (!parsed.success) {
      throw new ValidationError('Invalid user data', parsed.error);
    }
    
    return parsed.data;
    
  } catch (error) {
    // 5. Network error handling
    if (error instanceof TypeError) {
      throw new NetworkError('Network request failed');
    }
    throw error;
  }
}
```

#### Edge Case Checklist

| Category | Cases to Handle |
|----------|-----------------|
| **Input** | null, undefined, empty string, wrong type, too long |
| **Network** | Timeout, offline, 500 errors, rate limiting |
| **Auth** | Expired token, insufficient permissions, invalid session |
| **Data** | Empty array, missing fields, invalid format |
| **State** | Loading, error, success, empty |

---

### 5. ✅ Confirm

**Principle:** Tests must pass. Behavior must be unchanged.

#### Confirmation Steps

```bash
# 1. Run existing tests
npm test

# 2. Check for regressions
npm run test:coverage

# 3. Type check
npm run typecheck

# 4. Lint
npm run lint

# 5. Build
npm run build
```

#### Confirmation Checklist

- [ ] All existing tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Coverage not decreased
- [ ] Manual smoke test passes
- [ ] No console errors/warnings

---

### 6. ⚡ Tune

**Principle:** Optimize ONLY when needed. Premature optimization is evil.

#### When to Tune

1. **Measure first:**
   ```typescript
   console.time('operation');
   // ... operation
   console.timeEnd('operation');
   ```

2. **Profile before optimizing:**
   - React DevTools Profiler
   - Chrome Performance tab
   - Lighthouse scores

3. **Optimize if:**
   - Operation takes >100ms
   - Component re-renders >10x/second
   - Bundle size impact >50KB

#### Common Optimizations

```typescript
// 1. Memoization
const expensiveResult = useMemo(() => 
  computeExpensive(data), [data]
);

// 2. Lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 3. Debouncing
const debouncedSearch = useDebouncedCallback(
  (query) => search(query), 
  300
);

// 4. Virtual lists
<VirtualList items={items} itemHeight={50} />
```

---

## Complete R.E.F.A.C.T. Prompt

```markdown
Before adding [NEW FEATURE], apply R.E.F.A.C.T.:

**R - Recognise:**
Scan target files for code smells (>300 lines, deep nesting, duplication).

**E - Extract:**
If smells found, extract functions/modules before proceeding.

**F - Format:**
Ensure consistent naming, ordering, and style.

**A - Address Edge Cases:**
Add error handling for: null input, network failure, invalid data.

**C - Confirm:**
All tests must pass. No TypeScript errors. No regressions.

**T - Tune:**
Only if measured performance issue exists.

Output:
1. Refactoring plan (if needed)
2. Implementation
3. Tests
4. Verification commands
```

---

## Integration with AI Assistants

### Rule for Cursor/Claude

```
After every successful implementation, check:
- [ ] Is any file >300 lines? → Propose split
- [ ] Is any function >50 lines? → Propose extraction
- [ ] Is there duplicated code? → Propose DRY

If yes to any, ask: "Should I refactor before continuing?"
```

### Auto-Trigger Threshold

| Metric | Threshold | Action |
|--------|-----------|--------|
| File lines | >300 | MUST propose refactor |
| Function lines | >50 | MUST propose extraction |
| Nesting depth | >4 | MUST propose flattening |
| Duplication | >15 lines | SHOULD propose DRY |

---

## References

- [Martin Fowler - Refactoring](https://refactoring.com/)
- [Refactoring Guru - Code Smells](https://refactoring.guru/refactoring/smells)
- [Clean Code by Robert C. Martin](https://www.oreilly.com/library/view/clean-code/9780136083238/)
