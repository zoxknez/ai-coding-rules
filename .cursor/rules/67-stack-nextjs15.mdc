---
description: "USE WHEN: working with Next.js 15 App Router, React Server Components, or Server Actions."
globs: ["**/app/**","**/(routes)/**","**/layout.tsx","**/page.tsx","**/loading.tsx","**/error.tsx"]
alwaysApply: false
priority: 45
---

# Next.js 15 App Router Rules

> This module covers Next.js 15+ with App Router. For Pages Router, use general React rules.

## Component Strategy

### Server vs Client Components

| Type | Default | Directive | Use When |
|------|---------|-----------|----------|
| Server Component | ✅ Yes | None needed | Data fetching, no interactivity |
| Client Component | No | `'use client'` | Hooks, events, browser APIs |

### Decision Tree

```
Does this component need...
├── useState/useEffect/useContext? → Client Component
├── onClick/onChange/onSubmit? → Client Component  
├── window/document/localStorage? → Client Component
├── Only data fetching? → Server Component ✅
└── Only rendering props? → Server Component ✅
```

### Placement Rules

```typescript
// ✅ Server Component (default)
// No directive needed
async function UserProfile({ userId }: { userId: string }) {
  const user = await getUser(userId); // Direct DB/API call
  return <div>{user.name}</div>;
}

// ✅ Client Component (when needed)
'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

---

## Data Fetching

### Parallel Fetching (CRITICAL)

```typescript
// ❌ BAD: Waterfall — each awaits the previous
async function Page() {
  const user = await getUser();       // 100ms
  const posts = await getPosts();     // 100ms
  const comments = await getComments(); // 100ms
  // Total: 300ms
}

// ✅ GOOD: Parallel — all run simultaneously
async function Page() {
  const [user, posts, comments] = await Promise.all([
    getUser(),      // 100ms
    getPosts(),     // 100ms  
    getComments()   // 100ms
  ]);
  // Total: ~100ms
}
```

### Streaming with Suspense

```typescript
import { Suspense } from 'react';

async function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      {/* Instantly visible */}
      
      <Suspense fallback={<LoadingSkeleton />}>
        <SlowComponent />
        {/* Streams in when ready */}
      </Suspense>
    </div>
  );
}
```

---

## Server Actions

### Form Mutations

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createPost(formData: FormData) {
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  // Validation
  if (!title || title.length < 3) {
    return { error: 'Title must be at least 3 characters' };
  }
  
  // Database operation
  await db.insert(posts).values({ title, content });
  
  // Revalidate and redirect
  revalidatePath('/posts');
  redirect('/posts');
}
```

### Using in Components

```typescript
// ✅ Form with Server Action
import { createPost } from './actions';

function CreatePostForm() {
  return (
    <form action={createPost}>
      <input name="title" required minLength={3} />
      <textarea name="content" required />
      <button type="submit">Create Post</button>
    </form>
  );
}
```

### With useFormState (Client Feedback)

```typescript
'use client';

import { useFormState } from 'react-dom';
import { createPost } from './actions';

function CreatePostForm() {
  const [state, formAction] = useFormState(createPost, null);
  
  return (
    <form action={formAction}>
      <input name="title" />
      {state?.error && <p className="text-red-500">{state.error}</p>}
      <button type="submit">Create</button>
    </form>
  );
}
```

---

## Caching & Revalidation

### Cache Options

```typescript
// Default: Cached indefinitely (like getStaticProps)
fetch(url);

// Time-based revalidation (ISR)
fetch(url, { next: { revalidate: 60 } }); // Refresh every 60s

// No cache (like getServerSideProps)
fetch(url, { cache: 'no-store' });

// Tagged cache (for manual revalidation)
fetch(url, { next: { tags: ['posts'] } });
```

### Manual Revalidation

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';

// Revalidate specific path
revalidatePath('/posts');

// Revalidate by tag
revalidateTag('posts');

// Revalidate layout and all child pages
revalidatePath('/dashboard', 'layout');
```

---

## File Conventions

### Special Files

| File | Purpose |
|------|---------|
| `page.tsx` | Route UI |
| `layout.tsx` | Shared layout (persists across navigations) |
| `loading.tsx` | Loading UI (automatic Suspense boundary) |
| `error.tsx` | Error UI (automatic Error boundary) |
| `not-found.tsx` | 404 UI |
| `route.ts` | API endpoint |

### Route Groups

```
app/
├── (marketing)/     # Group: doesn't affect URL
│   ├── about/
│   └── contact/
├── (dashboard)/     # Group: different layout
│   ├── settings/
│   └── profile/
└── layout.tsx       # Root layout
```

### Dynamic Routes

```
app/
├── posts/
│   ├── [slug]/           # Dynamic: /posts/my-post
│   │   └── page.tsx
│   ├── [...slug]/        # Catch-all: /posts/a/b/c
│   │   └── page.tsx
│   └── [[...slug]]/      # Optional catch-all: /posts or /posts/a/b
│       └── page.tsx
```

---

## Asset Optimization

### Images

```typescript
import Image from 'next/image';

// ✅ Always use next/image
<Image 
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  priority // For above-the-fold images
/>

// Remote images (requires config)
<Image 
  src="https://example.com/image.jpg"
  alt="Remote image"
  width={400}
  height={300}
/>
```

### Fonts

```typescript
// app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Prevent layout shift
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

---

## Metadata

### Static Metadata

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | My App',
  description: 'Welcome to my application',
  openGraph: {
    title: 'Home | My App',
    description: 'Welcome to my application',
    images: ['/og-image.jpg'],
  },
};
```

### Dynamic Metadata

```typescript
// app/posts/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
  };
}
```

---

## Migration from Pages Router

| Pages Router | App Router |
|--------------|------------|
| `pages/index.tsx` | `app/page.tsx` |
| `pages/posts/[id].tsx` | `app/posts/[id]/page.tsx` |
| `getServerSideProps` | Server Component + fetch |
| `getStaticProps` | Server Component + fetch |
| `getStaticPaths` | `generateStaticParams` |
| `useRouter` (pages) | `useRouter` from `next/navigation` |
| `_app.tsx` | `app/layout.tsx` |
| `_document.tsx` | `app/layout.tsx` (html/body) |

### Navigation

```typescript
// ✅ App Router navigation
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

function MyComponent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Navigate
  router.push('/dashboard');
  router.replace('/login');
  router.back();
  
  // Read current state
  console.log(pathname); // '/posts/123'
  console.log(searchParams.get('q')); // 'search term'
}
```
