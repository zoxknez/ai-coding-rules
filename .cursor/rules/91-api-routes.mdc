---
description: Rules for API route/endpoint development
globs: ["**/api/**/*.{ts,js}", "**/routes/**/*.{ts,js}", "**/*.controller.{ts,js}"]
alwaysApply: false
---

# 🔌 API Routes Rules

> Auto-activated for files in `/api/` or `/routes/` directories.

## Route Structure

```
api/
├── users/
│   ├── route.ts          # Next.js App Router
│   ├── [id]/route.ts     # Dynamic route
│   └── schema.ts         # Zod validation
├── middleware.ts         # Auth, rate limiting
└── types.ts              # Shared types
```

## Rules

### 1. Input Validation (STRICT)
```typescript
// ✅ ALWAYS validate all inputs
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  age: z.number().int().positive().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = CreateUserSchema.safeParse(body);
  
  if (!result.success) {
    return Response.json({ error: result.error.flatten() }, { status: 400 });
  }
  
  // Use result.data (validated)
}
```

### 2. Error Handling (STRICT)
```typescript
// ✅ Consistent error envelope
interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// ✅ Proper status codes
// 200 - Success
// 201 - Created
// 400 - Bad Request (validation failed)
// 401 - Unauthorized
// 403 - Forbidden
// 404 - Not Found
// 500 - Internal Server Error
```

### 3. Authentication (STRICT)
```typescript
// ✅ ALWAYS check auth before processing
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return Response.json({ error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }
  
  // Check authorization (permissions)
  if (!hasPermission(session.user, 'users:read')) {
    return Response.json({ error: { code: 'FORBIDDEN' } }, { status: 403 });
  }
  
  // Process request...
}
```

### 4. Rate Limiting
```typescript
// ✅ Apply rate limiting for public endpoints
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export async function POST(request: Request) {
  try {
    await limiter.check(5, 'API_ROUTE_NAME'); // 5 requests per minute
  } catch {
    return Response.json({ error: { code: 'RATE_LIMITED' } }, { status: 429 });
  }
}
```

## Forbidden Patterns

```typescript
// ❌ NEVER: No validation
export async function POST(req: Request) {
  const body = await req.json();
  await db.user.create({ data: body }); // SQL injection risk!
}

// ❌ NEVER: Expose stack traces
catch (error) {
  return Response.json({ error: error.message }); // Info leak!
}

// ❌ NEVER: No auth check
export async function DELETE(req: Request) {
  await db.user.delete({ where: { id } }); // Anyone can delete!
}
```

## Required Headers

```typescript
// ✅ Security headers
const headers = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};
```
