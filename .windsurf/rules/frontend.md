# Windsurf Rules - Frontend

> Apply when working with React/Vue/Svelte components.

## Component Structure

- One component per file
- Use named exports
- Colocate styles, tests, and types

## React Patterns

- Prefer functional components with hooks
- Use React.memo() for expensive renders
- Prefer composition over inheritance

## TypeScript

- Explicit return types on exports
- Use `interface` for objects, `type` for unions
- Avoid `any` — use `unknown` if unclear

## Performance

- Lazy load routes and heavy components
- Optimize images
- Avoid unnecessary re-renders
