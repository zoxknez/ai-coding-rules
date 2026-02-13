# 🏛️ Architecture

> Architecture decision records, API design patterns, and caching strategies.

## Files

| File | Purpose |
|------|---------|
| [API_DESIGN_PATTERNS.md](API_DESIGN_PATTERNS.md) | REST, GraphQL, gRPC conventions |
| [CACHING_STRATEGIES.md](CACHING_STRATEGIES.md) | Cache layers, invalidation, stampede prevention |
| [decisions/](decisions/) | Architecture Decision Records (ADRs) |

## Quick Reference

### API Design
- RESTful URL structure, HTTP status codes, error envelopes
- Pagination (offset, cursor, keyset), filtering, sorting
- Versioning, authentication, rate limiting
- GraphQL and gRPC patterns

### Caching
- 4 cache layers: In-Memory → Redis → HTTP/CDN → DB Query
- Cache key design and invalidation strategies
- Cache stampede prevention and negative caching

### ADRs
Use Architecture Decision Records for significant choices:
- Technology selections
- Pattern choices
- Security decisions

See [decisions/ADR_TEMPLATE_AND_EXAMPLES.md](decisions/ADR_TEMPLATE_AND_EXAMPLES.md) for template.
