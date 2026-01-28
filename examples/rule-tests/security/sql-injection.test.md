# Rule Test: No SQL Injection

## Rule Reference
- **ID:** `security-sql-injection`
- **Category:** Security
- **Severity:** Critical
- **STRICT:** Yes (cannot be overridden)

## Test Cases

### ❌ FAIL: String concatenation in query

**Input:**
```typescript
const user = await db.query(
  `SELECT * FROM users WHERE id = ${userId}`
);
```

**Expected:** FAIL
**Violation:** SQL injection via string interpolation
**Fix:**
```typescript
const user = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

---

### ❌ FAIL: Template literal with user input

**Input:**
```typescript
const email = req.body.email;
const result = await db.query(
  `SELECT * FROM users WHERE email = '${email}'`
);
```

**Expected:** FAIL
**Violation:** User input directly in SQL query
**Fix:**
```typescript
const email = req.body.email;
const result = await db.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);
```

---

### ❌ FAIL: Dynamic table name without validation

**Input:**
```typescript
const table = req.params.table;
const results = await db.query(`SELECT * FROM ${table}`);
```

**Expected:** FAIL
**Violation:** Unvalidated dynamic table name
**Fix:**
```typescript
const allowedTables = ['users', 'products', 'orders'];
const table = req.params.table;

if (!allowedTables.includes(table)) {
  throw new Error('Invalid table name');
}

const results = await db.query(`SELECT * FROM ${table}`);
```

---

### ❌ FAIL: Python f-string in SQL

**Input:**
```python
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")
```

**Expected:** FAIL
**Violation:** f-string with user input in SQL
**Fix:**
```python
cursor.execute("SELECT * FROM users WHERE name = %s", (name,))
```

---

### ❌ FAIL: String format in query

**Input:**
```python
query = "SELECT * FROM users WHERE id = %s" % user_id
cursor.execute(query)
```

**Expected:** FAIL
**Violation:** String formatting before execute
**Fix:**
```python
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
```

---

### ✅ PASS: Parameterized query (PostgreSQL style)

**Input:**
```typescript
const user = await db.query(
  'SELECT * FROM users WHERE id = $1 AND status = $2',
  [userId, status]
);
```

**Expected:** PASS
**Why:** Uses parameterized query with placeholders

---

### ✅ PASS: Prepared statement

**Input:**
```typescript
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(userId);
```

**Expected:** PASS
**Why:** Uses prepared statement

---

### ✅ PASS: ORM query builder

**Input:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

**Expected:** PASS
**Why:** ORM handles parameterization automatically

---

### ✅ PASS: ORM with Drizzle

**Input:**
```typescript
const users = await db
  .select()
  .from(usersTable)
  .where(eq(usersTable.id, userId));
```

**Expected:** PASS
**Why:** Type-safe query builder handles escaping

---

### ✅ PASS: Static query (no user input)

**Input:**
```typescript
const count = await db.query('SELECT COUNT(*) FROM users');
```

**Expected:** PASS
**Why:** No user input in query

---

## Edge Cases

### ⚠️ REVIEW: LIKE with user input

**Input:**
```typescript
const results = await db.query(
  'SELECT * FROM users WHERE name LIKE $1',
  [`%${searchTerm}%`]
);
```

**Expected:** PASS (but REVIEW for wildcard injection)
**Why:** Parameterized, but % in user input could affect performance
**Recommendation:** Escape `%` and `_` in searchTerm

---

### ⚠️ REVIEW: ORDER BY with user input

**Input:**
```typescript
const order = req.query.order; // 'asc' or 'desc'
const results = await db.query(
  `SELECT * FROM users ORDER BY name ${order}`
);
```

**Expected:** REVIEW
**Why:** ORDER BY can't be parameterized, needs validation
**Fix:**
```typescript
const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
const results = await db.query(
  `SELECT * FROM users ORDER BY name ${order}`
);
```

---

### ⚠️ REVIEW: IN clause

**Input:**
```typescript
const ids = [1, 2, 3];
const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
const results = await db.query(
  `SELECT * FROM users WHERE id IN (${placeholders})`,
  ids
);
```

**Expected:** PASS
**Why:** Dynamic placeholders but values are still parameterized

---

## Injection Payloads to Catch

These should all be caught:
```
' OR '1'='1
'; DROP TABLE users; --
' UNION SELECT password FROM users --
1; DELETE FROM users WHERE 1=1; --
```

## ORM/Query Builder Coverage

| Library | Safe Pattern |
|---------|--------------|
| Prisma | `prisma.model.findMany({ where: {} })` |
| Drizzle | `db.select().from(table).where()` |
| Knex | `knex('table').where('id', id)` |
| TypeORM | `repo.findOne({ where: { id } })` |
| Sequelize | `Model.findAll({ where: { id } })` |
| pg | `client.query('...', [params])` |
| mysql2 | `connection.execute('...', [params])` |
