# Rule Test: Auth Required on Protected Routes

## Rule Reference
- **ID:** `security-auth-required`
- **Category:** Security
- **Severity:** Critical
- **STRICT:** Yes (cannot be overridden)

## Test Cases

### ❌ FAIL: No auth check on data endpoint

**Input:**
```typescript
// GET /api/users/:id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  return Response.json(user);
}
```

**Expected:** FAIL
**Violation:** Accessing user data without authentication
**Fix:**
```typescript
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await db.user.findUnique({ where: { id: params.id } });
  return Response.json(user);
}
```

---

### ❌ FAIL: Missing authorization (can access other users' data)

**Input:**
```typescript
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ❌ No check if user can access this resource
  const user = await db.user.findUnique({ where: { id: params.id } });
  return Response.json(user);
}
```

**Expected:** FAIL
**Violation:** Authentication present, but no authorization check
**Fix:**
```typescript
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Only allow users to access their own data (or admins)
  if (session.userId !== params.id && !session.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  const user = await db.user.findUnique({ where: { id: params.id } });
  return Response.json(user);
}
```

---

### ❌ FAIL: Delete without ownership check

**Input:**
```typescript
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await db.post.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}
```

**Expected:** FAIL
**Violation:** Delete operation without auth or ownership check
**Fix:**
```typescript
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post || post.authorId !== session.userId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  await db.post.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}
```

---

### ❌ FAIL: Admin route without role check

**Input:**
```typescript
// POST /api/admin/users
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // ❌ No admin role check
  const body = await req.json();
  const user = await db.user.create({ data: body });
  return Response.json(user);
}
```

**Expected:** FAIL
**Violation:** Admin endpoint without role verification
**Fix:**
```typescript
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  if (!session.isAdmin) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  const body = await req.json();
  const user = await db.user.create({ data: body });
  return Response.json(user);
}
```

---

### ✅ PASS: Public endpoint (no auth needed)

**Input:**
```typescript
// GET /api/health
export async function GET() {
  return Response.json({ status: 'ok' });
}
```

**Expected:** PASS
**Why:** Health check is intentionally public

---

### ✅ PASS: Public product listing

**Input:**
```typescript
// GET /api/products (public catalog)
export async function GET(req: Request) {
  const products = await db.product.findMany({
    where: { published: true }
  });
  return Response.json(products);
}
```

**Expected:** PASS
**Why:** Public catalog is intentionally accessible

---

### ✅ PASS: Proper auth middleware

**Input:**
```typescript
// middleware.ts
export async function middleware(req: NextRequest) {
  const protectedPaths = ['/api/users', '/api/admin', '/api/orders'];
  
  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    const session = await getSession(req);
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }
  
  return NextResponse.next();
}
```

**Expected:** PASS
**Why:** Middleware handles auth for protected paths

---

### ✅ PASS: Full auth + authz check

**Input:**
```typescript
export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Authentication
  const session = await getSession(req);
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Authorization
  const canAccess = await checkPermission(session.userId, 'orders', params.id, 'read');
  if (!canAccess) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  const order = await db.order.findUnique({ where: { id: params.id } });
  return Response.json(order);
}
```

**Expected:** PASS
**Why:** Both authentication and authorization properly implemented

---

## Protected Route Patterns

### Routes That MUST Have Auth

| Pattern | Reason |
|---------|--------|
| `/api/users/*` | User data |
| `/api/admin/*` | Admin functions |
| `/api/orders/*` | Order data |
| `/api/*/private/*` | Explicitly private |
| `POST/PUT/DELETE` on most resources | Mutations |

### Routes That MAY Be Public

| Pattern | Reason |
|---------|--------|
| `/api/health` | Health checks |
| `/api/products` (GET) | Public catalog |
| `/api/auth/login` | Login endpoint |
| `/api/auth/register` | Registration |
| `/api/public/*` | Explicitly public |

## Auth vs Authz

| Check | What It Verifies |
|-------|------------------|
| **Authentication** (401) | "Who are you?" - Valid session/token |
| **Authorization** (403) | "Can you do this?" - Permission to access resource |

Both are required for protected resources:
1. ✅ Authenticated (has valid session)
2. ✅ Authorized (has permission for this specific resource)
