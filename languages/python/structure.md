# Python Structure

> src layout with domain, application, and infrastructure.

## Canonical Layout

```text
project/
├─ pyproject.toml
├─ README.md
├─ .env.example
├─ src/
│  └─ project_name/
│     ├─ __init__.py
│     ├─ __main__.py
│     ├─ config.py
│     ├─ domain/
│     ├─ application/
│     ├─ infrastructure/
│     ├─ api/
│     └─ shared/
├─ tests/
│  ├─ unit/
│  └─ integration/
└─ scripts/
```
