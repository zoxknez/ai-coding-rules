# TypeScript Structure

> Feature-based colocation for app router projects.

## Canonical Layout

```text
project-root/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── api/
│   │       └── health/route.ts
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   ├── actions.ts
│   │   │   └── index.ts
│   │   └── billing/
│   ├── components/
│   │   └── ui/
│   └── lib/
│       ├── db.ts
│       └── utils.ts
└── tests/
```

## Agent Workflow

1. Define Zod schemas in features/*/types.
2. Implement server actions in features/*/actions.ts.
3. Expose public API via features/*/index.ts.
4. Keep route files in app/ thin.

## Boundary Rules

- app/ must not contain business logic.
- features/* is the only place for domain logic.
- components/ui contains dumb primitives only.
