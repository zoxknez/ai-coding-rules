# JavaScript Structure

> Node.js layout with domain and application layers.

## Canonical Layout

```text
project/
├─ package.json
├─ README.md
├─ .env.example
├─ src/
│  ├─ index.js
│  ├─ config/
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  ├─ api/
│  │  ├─ routes/
│  │  └─ controllers/
│  └─ shared/
├─ tests/
└─ scripts/
```

## Notes

- Layer folders under src are a team convention and can be reorganized per framework.

## Sources

- npm package.json reference (root metadata and entry points). https://docs.npmjs.com/cli/v10/configuring-npm/package-json
