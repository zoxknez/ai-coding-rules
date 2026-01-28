# Frontend Stack Guidelines (React/Next.js/TypeScript) (v2)

## Primary goals
- Correct UX flows (loading/empty/error)
- Predictable state
- Accessibility baseline
- Performance-aware rendering
- Minimal diff and consistent styling

## Next.js specifics
- Prefer **Server Components** by default; use `"use client"` only when needed.
- Avoid moving large logic into client components without reason.
- Data fetching: respect existing patterns (server actions, route handlers, react-query, SWR).
- Caching/revalidation: do not guess — follow repo conventions.

## Components & UI
- Reuse existing components and design tokens.
- Keep components small; extract only when reused.
- Always handle:
  - loading state
  - empty state
  - error state
- Accessibility:
  - buttons must be buttons
  - inputs must have labels
  - aria-label for icon-only buttons
  - keyboard navigation for menus/dialogs

## State management
- Prefer local state first.
- Introduce global state only if:
  - state is shared across distant branches, or
  - persistence/sync requirements exist.
- Avoid new state libraries without explicit approval.

## Data handling
- Validate and sanitize user inputs.
- Avoid XSS: never dangerouslySetInnerHTML unless unavoidable and sanitized.

## Performance
- Avoid unnecessary re-renders:
  - memoize expensive computations
  - avoid inline object/array creation in hot paths
- Use dynamic imports for heavy components when needed.
- Prevent N+1 fetches in UI loops.

## Testing
- Component tests for critical UI logic.
- E2E tests for core flows if repo uses Playwright/Cypress.

## “Do not” list
- Don’t redesign UI unless asked.
- Don’t rename component folders, routes, or styling conventions.
- Don’t introduce new UI libraries without approval.
