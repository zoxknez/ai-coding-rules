---
description: "USE WHEN: working on TypeScript/React frontend."
globs: ["**/*.ts","**/*.tsx","src/**/*.ts","src/**/*.tsx","app/**/*.tsx","components/**/*.tsx"]
alwaysApply: false
priority: 40
---

# Frontend (TypeScript/React)

## Type Safety
- Ban `any` — use `unknown` with type guards if needed.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Use strict TypeScript configuration.

## React Style
- Functional components + hooks only — no class components.
- Avoid unnecessary state; prefer reducer/context for complex state.
- Handle all UI states: loading, empty, error, success.

## Exports
- Prefer named exports over default exports.
- One component per file for main components.

## Performance
- Avoid unnecessary re-renders; memoize only when justified.
- Use dynamic imports for heavy components.
- Prevent N+1 fetches in UI loops.

## Accessibility (A11y)
- Buttons must be `<button>` elements.
- Inputs must have associated labels.
- Use `aria-label` for icon-only buttons.
- Ensure keyboard navigation for menus/dialogs.

---

## Next.js 15 App Router (Optional)

> Apply when working with Next.js 15+ App Router architecture.

### Component Strategy

| Type | When to Use | Directive |
|------|-------------|-----------|
| Server Component | Default for all components | None needed |
| Client Component | Event handlers, hooks, browser APIs | `'use client'` at top |

**Rule:** Start with Server Components. Add `'use client'` only when you need:
- `useState`, `useEffect`, or other hooks
- Event handlers (`onClick`, `onChange`, etc.)
- Browser-only APIs (`window`, `localStorage`, etc.)

### Data Fetching Patterns

#### Parallel Fetching (Avoid Waterfalls)
```typescript
// ❌ BAD: Sequential (waterfall) — slow
const user = await getUser();
const posts = await getPosts();
const comments = await getComments();

// ✅ GOOD: Parallel — fast
const [user, posts, comments] = await Promise.all([
  getUser(),
  getPosts(),
  getComments()
]);
```

#### Server Actions for Mutations
```typescript
// ✅ Preferred: Server Action
async function createPost(formData: FormData) {
  'use server';
  
  const title = formData.get('title');
  // Validation, DB insert, etc.
  revalidatePath('/posts');
}

// Usage in component
<form action={createPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

### Caching & Revalidation
```typescript
// Time-based revalidation (ISR)
fetch(url, { next: { revalidate: 60 } });

// On-demand revalidation
import { revalidatePath, revalidateTag } from 'next/cache';
revalidatePath('/posts');
revalidateTag('posts');

// No cache (SSR)
fetch(url, { cache: 'no-store' });
```

### Asset Optimization
- Use `next/image` for all images — automatic optimization
- Use `next/font` for fonts — no layout shift
- Use `next/link` for navigation — automatic prefetching

### Migration from Pages Router

| Pages Router | App Router Equivalent |
|--------------|----------------------|
| `getServerSideProps` | Server Component with async fetch |
| `getStaticProps` | Server Component + `generateStaticParams` |
| `getStaticPaths` | `generateStaticParams` |
| `useRouter` (pages) | `useRouter` from `next/navigation` |
| `_app.tsx` | `layout.tsx` |
| `_document.tsx` | `layout.tsx` (html/body tags) |
