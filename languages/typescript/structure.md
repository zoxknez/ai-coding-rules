# TypeScript Structure

> Backend and full-stack layout with explicit layers.

## Canonical Layout

```text
project/
├─ package.json
├─ tsconfig.json
├─ README.md
├─ .env.example
├─ src/
│  ├─ index.ts
│  ├─ config/
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  ├─ api/
│  │  ├─ routes/
│  │  ├─ controllers/
│  │  └─ dto/
│  └─ shared/
├─ tests/
└─ scripts/
```

## Notes

- Layer folders under src are a team convention and can be reorganized per framework.

## Sources

- npm package.json reference (root metadata and entry points). https://docs.npmjs.com/cli/v10/configuring-npm/package-json
