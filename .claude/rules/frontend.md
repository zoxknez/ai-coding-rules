---
paths:
  - "**/*.tsx"
  - "**/*.jsx"
  - "**/components/**"
---

# Frontend Rules

## Component Structure
- One component per file
- Use named exports for components
- Colocate styles, tests, and types

## React Patterns
- Prefer functional components with hooks
- Lift state only when necessary
- Use React.memo() for expensive renders
- Prefer composition over inheritance

## TypeScript
- Explicit return types on exported functions
- Use `interface` for objects, `type` for unions
- Avoid `any` — use `unknown` if type is unclear

## Styling
- Use CSS Modules or Tailwind
- Avoid inline styles except for dynamic values
- Mobile-first responsive design

## Performance
- Lazy load routes and heavy components
- Optimize images (next/image, srcset)
- Avoid unnecessary re-renders
