---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

Follow MASTER_RULES.md.

Frontend rules:
- No new UI libraries without approval.
- Avoid new state managers unless required by scope.
- Always handle loading, empty, and error states.
- A11y minimums: button type, aria-label where needed, focus states.
- Do not restyle UI unless the task asks.
- Prefer minimal diff and reuse existing files.
