---
applyTo: "{prisma/**,drizzle/**,migrations/**,**/*.sql}"
---

Follow MASTER_RULES.md.

DB rules:
- Schema changes require migrations.
- Avoid SELECT * when returning subsets.
- Add indexes only for real query patterns.
- Use explicit transactions where needed.
- Document rollback/compat when altering existing columns.
