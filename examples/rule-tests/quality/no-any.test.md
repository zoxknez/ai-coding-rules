# Rule Test: No TypeScript Any

## Rule Reference
- **ID:** `quality-no-any`
- **Category:** Quality
- **Severity:** Medium
- **STRICT:** No (can be overridden with justification)

## Test Cases

### ❌ FAIL: Untyped any parameter

**Input:**
```typescript
function processData(data: any) {
  return data.value;
}
```

**Expected:** FAIL
**Violation:** Untyped `any` removes type safety
**Fix:**
```typescript
interface DataInput {
  value: string;
}

function processData(data: DataInput) {
  return data.value;
}
```

---

### ❌ FAIL: Any in array

**Input:**
```typescript
const items: any[] = [];
items.push({ name: 'test' });
console.log(items[0].nonexistent); // No error, but runtime crash
```

**Expected:** FAIL
**Violation:** Array of any loses all type checking
**Fix:**
```typescript
interface Item {
  name: string;
}

const items: Item[] = [];
items.push({ name: 'test' });
// items[0].nonexistent would now be a compile error
```

---

### ❌ FAIL: Any return type

**Input:**
```typescript
async function fetchUser(id: string): Promise<any> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

**Expected:** FAIL
**Violation:** Return type should be explicit
**Fix:**
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  return response.json() as User;
}
```

---

### ❌ FAIL: Implicit any in catch

**Input:**
```typescript
try {
  doSomething();
} catch (error) {  // error is 'any' in older TS
  console.log(error.message);
}
```

**Expected:** FAIL (with useUnknownInCatchVariables: false)
**Violation:** Catch variable should be typed
**Fix:**
```typescript
try {
  doSomething();
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message);
  }
}
```

---

### ✅ PASS: Justified any with comment

**Input:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// Reason: External library returns untyped data, will be validated below
function processExternalData(data: any): ValidatedData {
  const validated = schema.parse(data); // Runtime validation
  return validated;
}
```

**Expected:** PASS
**Why:** Any is justified and immediately validated

---

### ✅ PASS: Unknown instead of any

**Input:**
```typescript
function processUnknownData(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return String((data as { value: unknown }).value);
  }
  throw new Error('Invalid data');
}
```

**Expected:** PASS
**Why:** Uses `unknown` with proper type narrowing

---

### ✅ PASS: Generic type instead of any

**Input:**
```typescript
function identity<T>(value: T): T {
  return value;
}

const result = identity({ name: 'test' });
// result is typed as { name: string }
```

**Expected:** PASS
**Why:** Generics preserve type information

---

### ✅ PASS: Type assertion with validation

**Input:**
```typescript
interface ApiResponse {
  data: User[];
  meta: { total: number };
}

async function fetchUsers(): Promise<ApiResponse> {
  const response = await fetch('/api/users');
  const json = await response.json();
  
  // Validate at runtime
  if (!Array.isArray(json.data)) {
    throw new Error('Invalid response');
  }
  
  return json as ApiResponse;
}
```

**Expected:** PASS
**Why:** Type assertion after validation is acceptable

---

### ✅ PASS: Record type for dynamic keys

**Input:**
```typescript
const config: Record<string, string> = {
  apiUrl: 'https://api.example.com',
  timeout: '5000'
};
```

**Expected:** PASS
**Why:** Record is better than `{ [key: string]: any }`

---

## When Any is Acceptable

| Scenario | Alternative | If Must Use |
|----------|-------------|-------------|
| External API | Define types or use codegen | Validate immediately |
| JSON.parse | Use zod/yup for validation | Type assertion after validation |
| Dynamic object | Record<string, T> | Document why |
| Migration | Add TODO to fix | Time-boxed exception |
| Tests | Mock types | Usually fine in tests |

## Alternatives to Any

| Instead of | Use |
|------------|-----|
| `any` | `unknown` + type guards |
| `any[]` | `T[]` with generic |
| `{ [key: string]: any }` | `Record<string, T>` |
| `Function` | `(...args: unknown[]) => unknown` |
| Untyped JSON | Zod schema validation |

## TSConfig Settings

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "useUnknownInCatchVariables": true
  }
}
```

## ESLint Rules

```json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unsafe-argument": "error",
    "@typescript-eslint/no-unsafe-assignment": "error",
    "@typescript-eslint/no-unsafe-member-access": "error",
    "@typescript-eslint/no-unsafe-return": "error"
  }
}
```
