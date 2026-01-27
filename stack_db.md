# Database Stack Guidelines (SQL/ORM) (v2)

## Core principles
- Schema changes must be safe, reversible, and ideally zero-downtime.
- Prefer explicit constraints for data integrity.

## Migration safety (expand/contract)
1) **Expand**: add new columns/tables in a backward-compatible way
2) **Backfill**: migrate data gradually if needed
3) **Switch**: update application to use new schema
4) **Contract**: remove old columns only after verified

## Transactions
- Use transactions for multi-step changes.
- Be aware of locks; avoid long-running transactions.

## Indexes
- Add indexes only for real query patterns.
- Verify cardinality and expected benefit.

## ORMs (Prisma/Drizzle/etc.)
- Avoid `SELECT *` in APIs; select only needed fields.
- Beware of implicit joins or N+1 patterns.
- Keep migration files reviewed and readable.

## Data integrity
- Use:
  - PK/FK
  - UNIQUE
  - CHECK constraints
- Handle cascade deletes deliberately.

## Operational concerns
- Backups & restore plan (document where it exists).
- Sensitive data: encryption/masking where required.

## Verification checklist
- [ ] Migration runs cleanly
- [ ] App works with old + new schema (if required)
- [ ] Indexes do not degrade writes significantly
- [ ] Queries are explainable (EXPLAIN) for critical paths
