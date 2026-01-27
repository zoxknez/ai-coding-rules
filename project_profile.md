# Project Profile Setup for AI Agents (v2)

**Purpose:** This file is the “source of truth” for how an AI agent should behave inside *your specific repository*.

> Fill in the sections. The more precise you are, the fewer wrong assumptions the model will make.

## 1) Tech Stack Overview

- **Frontend:** (e.g., Next.js 14/15, React 18/19, Vue/Nuxt, Tailwind, shadcn/ui)
- **Backend:** (e.g., Node/Nitro/Nest, Laravel, FastAPI)
- **Database:** (e.g., Postgres + Prisma/Drizzle, MySQL, Redis)
- **Auth:** (e.g., NextAuth, custom JWT, Supabase auth)
- **Infra:** (e.g., Vercel, Docker, Neon, Cloudflare)
- **Package manager:** (pnpm/npm/yarn)
- **CI:** (GitHub Actions, etc.)

## 2) Repo Map (what lives where)

- `src/` → …
- `app/` → …
- `components/` → …
- `lib/` → …
- `server/` → …
- `tests/` → …

## 3) Architectural boundaries (VERY important)

- Which layers are allowed to import which?
  - Example:
    - `components/` may import `lib/`, but not `server/`
    - `server/` may import `db/`, but not UI
- What is the preferred pattern?
  - (e.g., “thin controllers + services”, “server actions”, “hexagonal”, “DDD”)

## 4) Code style & standards

- **TypeScript strictness:** (strict true/false, important rules)
- **Formatting:** (prettier config, line length)
- **Linting:** (eslint rules that matter)
- **Conventions:** 
  - file naming (kebab/camel/pascal)
  - component naming
  - hooks naming
  - API naming

## 5) How to run / verify

### Local dev
- `pnpm dev` (or equivalent)
- DB setup steps

### Checks
- Lint: `…`
- Typecheck: `…`
- Tests: `…`
- E2E: `…`

## 6) Security & privacy rules (non-negotiable)

- Never log secrets or tokens.
- Never hard-code API keys.
- Always use env vars and document required ones.
- Mask PII in logs.
- For auth/roles, **never assume** permissions—always confirm.

## 7) Domain glossary

Define domain terms so the model doesn't guess incorrectly:
- “Route” means …
- “Tenant” means …
- “Receipt” means …

## 8) Agent constraints (repo-specific)

- Files/folders the agent **must not** touch: …
- Max new files per task: …
- Preferred libraries to use: …
- Forbidden libraries/patterns: …

## 9) Example “good” task output (reference)

- Plan: …
- Patch: …
- Verify: …
- Notes: …

---

## Minimal starter profile (copy/paste)

```txt
- Stack: Next.js + TS + Tailwind + (Prisma/Drizzle) + Postgres
- Conventions: strict TS, no `any`, no new deps without approval
- Verify: pnpm lint && pnpm typecheck && pnpm test
- Rule: minimal diff; do not touch unrelated files
```
