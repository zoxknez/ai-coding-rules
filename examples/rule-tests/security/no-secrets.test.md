# Rule Test: No Hardcoded Secrets

## Rule Reference
- **ID:** `security-no-secrets`
- **Category:** Security
- **Severity:** Critical
- **STRICT:** Yes (cannot be overridden)

## Test Cases

### ❌ FAIL: Hardcoded API key in constant

**Input:**
```typescript
const API_KEY = "sk-abc123def456ghi789";
```

**Expected:** FAIL
**Violation:** Hardcoded secret in source code
**Fix:** 
```typescript
const API_KEY = process.env.API_KEY;
```

---

### ❌ FAIL: Hardcoded password in config object

**Input:**
```typescript
const dbConfig = {
  host: "localhost",
  user: "admin",
  password: "SuperSecret123!"
};
```

**Expected:** FAIL
**Violation:** Hardcoded password in configuration
**Fix:**
```typescript
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
};
```

---

### ❌ FAIL: JWT secret in code

**Input:**
```typescript
const token = jwt.sign(payload, "my-super-secret-jwt-key");
```

**Expected:** FAIL
**Violation:** Hardcoded JWT secret
**Fix:**
```typescript
const token = jwt.sign(payload, process.env.JWT_SECRET);
```

---

### ❌ FAIL: AWS credentials inline

**Input:**
```python
import boto3

client = boto3.client(
    's3',
    aws_access_key_id='AKIAIOSFODNN7EXAMPLE',
    aws_secret_access_key='wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY'
)
```

**Expected:** FAIL
**Violation:** AWS credentials hardcoded
**Fix:**
```python
import boto3

# Uses credentials from environment or ~/.aws/credentials
client = boto3.client('s3')
```

---

### ❌ FAIL: Connection string with password

**Input:**
```typescript
const connectionString = "postgresql://user:password123@localhost:5432/mydb";
```

**Expected:** FAIL
**Violation:** Password in connection string
**Fix:**
```typescript
const connectionString = process.env.DATABASE_URL;
```

---

### ✅ PASS: Environment variable usage

**Input:**
```typescript
const API_KEY = process.env.API_KEY;
const DB_PASSWORD = process.env.DB_PASSWORD;
```

**Expected:** PASS
**Why:** Secrets are loaded from environment variables

---

### ✅ PASS: Example/placeholder values in documentation

**Input:**
```typescript
// Example configuration (use your own values):
// const API_KEY = "your-api-key-here";

const API_KEY = process.env.API_KEY;
```

**Expected:** PASS
**Why:** Placeholder in comment is acceptable for documentation

---

### ✅ PASS: Test fixtures with fake data

**Input:**
```typescript
// __tests__/auth.test.ts
const mockToken = "test-token-not-real";
const mockUser = { id: 1, password: "hashed-value" };
```

**Expected:** PASS
**Why:** Test fixtures with obviously fake data are acceptable

---

### ✅ PASS: Schema definitions

**Input:**
```typescript
const userSchema = z.object({
  password: z.string().min(8),
  apiKey: z.string().optional()
});
```

**Expected:** PASS
**Why:** Schema definition, not actual secret values

---

## Edge Cases

### ⚠️ REVIEW: Base64 encoded secrets

**Input:**
```typescript
const encoded = "c2stYWJjMTIzZGVmNDU2Z2hpNzg5"; // base64 of "sk-abc123..."
```

**Expected:** FAIL (on decode) or REVIEW
**Why:** Base64 encoding doesn't hide secrets
**Note:** Some tools may not catch this automatically

---

### ⚠️ REVIEW: Secrets in URLs

**Input:**
```typescript
const webhookUrl = "https://api.example.com/webhook?token=abc123";
```

**Expected:** REVIEW
**Why:** Token in URL should be moved to header or environment

---

## Detection Patterns

Rules should detect these patterns:
- API key prefixes: `sk-`, `pk-`, `api_`, `key_`
- AWS patterns: `AKIA...`, `aws_secret_access_key`
- High entropy strings (likely secrets)
- Common variable names: `password`, `secret`, `token`, `apiKey`, `api_key`
- Connection strings with credentials

## False Positive Handling

Not all matches are violations:
- Documentation examples with placeholder text
- Test files with fake/mock data
- Schema/type definitions
- Variable names without values
- Comments explaining what to do
