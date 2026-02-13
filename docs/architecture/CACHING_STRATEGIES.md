# Caching Strategies (v1)

> **Cache intelligently, invalidate correctly**
>
> Caching is the most powerful performance tool — and the most common source of
> stale-data bugs. Agents must follow strict invalidation rules and never guess cache TTLs.

---

## Cache Decision Framework

### When to Cache

| Signal | Cache? | Notes |
|--------|--------|-------|
| Read >> Write ratio | Yes | Blog posts, product catalogs |
| Expensive computation | Yes | Aggregations, reports |
| External API calls | Yes | Third-party rate limits |
| Stable reference data | Yes | Countries, currencies, configs |
| Frequently changing data | Depends | Short TTL or event-driven invalidation |
| User-specific sensitive data | Caution | Never in shared caches without isolation |
| Financial transactions | No | Always read from source of truth |

### When NOT to Cache

- Data that changes on every request (nonces, CSRF tokens).
- Data where staleness causes financial or safety harm.
- Data you cannot reliably invalidate.
- When the un-cached path is already fast enough.

---

## Cache Layers

### Layer 1: Application-Level (In-Memory)

```python
# Python — functools.lru_cache for pure functions
from functools import lru_cache

@lru_cache(maxsize=256)
def get_exchange_rate(currency: str) -> float:
    return fetch_from_api(currency)

# Manual invalidation
get_exchange_rate.cache_clear()  # Clear all
```

```typescript
// TypeScript — simple Map-based cache with TTL
class MemoryCache<T> {
  private cache = new Map<string, { value: T; expiresAt: number }>();

  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}
```

**When to use:** Single-instance apps, hot-path lookups, config data.
**Limitation:** Not shared across instances; lost on restart.

### Layer 2: Distributed Cache (Redis)

```python
# Python — Redis with structured keys and TTL
import redis.asyncio as redis
import json

class RedisCache:
    def __init__(self, client: redis.Redis, prefix: str = "cache"):
        self.client = client
        self.prefix = prefix

    def _key(self, key: str) -> str:
        return f"{self.prefix}:{key}"

    async def get(self, key: str) -> dict | None:
        data = await self.client.get(self._key(key))
        return json.loads(data) if data else None

    async def set(self, key: str, value: dict, ttl_seconds: int = 300) -> None:
        await self.client.setex(
            self._key(key),
            ttl_seconds,
            json.dumps(value),
        )

    async def invalidate(self, key: str) -> None:
        await self.client.delete(self._key(key))

    async def invalidate_pattern(self, pattern: str) -> None:
        """Use sparingly — KEYS/SCAN can be expensive."""
        async for key in self.client.scan_iter(f"{self.prefix}:{pattern}"):
            await self.client.delete(key)
```

**When to use:** Multi-instance apps, session storage, rate limiting, shared state.

### Layer 3: HTTP Caching (CDN / Browser)

```
# Immutable assets (hashed filenames)
Cache-Control: public, max-age=31536000, immutable

# API responses (short cache, revalidate)
Cache-Control: public, max-age=60, stale-while-revalidate=30

# Private user data
Cache-Control: private, no-cache

# Never cache
Cache-Control: no-store

# With ETag for conditional requests
ETag: "abc123"
# Client sends: If-None-Match: "abc123"
# Server returns: 304 Not Modified (if unchanged)
```

### Layer 4: Database Query Cache

```sql
-- Materialized views for expensive aggregations
CREATE MATERIALIZED VIEW daily_sales AS
SELECT date_trunc('day', created_at) AS day,
       SUM(amount) AS total,
       COUNT(*) AS order_count
FROM orders
GROUP BY 1;

-- Refresh on schedule or trigger
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_sales;
```

---

## Cache Key Design

### Rules

1. Keys MUST be deterministic — same input always produces same key.
2. Keys MUST include all parameters that affect the result.
3. Keys MUST be namespaced to avoid collisions.
4. Keys SHOULD be human-readable for debugging.

### Patterns

```
# Good key patterns
cache:users:usr_123                     # Single resource
cache:users:list:page=1:size=20:sort=name  # Parameterized list
cache:products:category=electronics:v2  # Versioned
cache:exchange:USD:EUR:2025-01-15       # Date-scoped

# Bad key patterns
cache:123                               # No namespace
user_data                               # No specificity
cache:users:all                         # Unbounded
```

### Key Generation

```python
import hashlib

def cache_key(prefix: str, **params) -> str:
    """Generate deterministic cache key from parameters."""
    sorted_params = ":".join(f"{k}={v}" for k, v in sorted(params.items()))
    return f"cache:{prefix}:{sorted_params}"

# Usage
key = cache_key("users", page=1, size=20, role="admin")
# => "cache:users:page=1:role=admin:size=20"

# For complex queries, hash the parameters
def cache_key_hashed(prefix: str, query: str) -> str:
    query_hash = hashlib.sha256(query.encode()).hexdigest()[:12]
    return f"cache:{prefix}:{query_hash}"
```

---

## Cache Invalidation

> "There are only two hard things in Computer Science: cache invalidation
> and naming things." — Phil Karlton

### Strategy 1: TTL-Based (Time to Live)

```python
# Set TTL based on data volatility
TTL_CONFIG = {
    "exchange_rates": 300,      # 5 min — changes frequently
    "product_catalog": 3600,    # 1 hour — changes occasionally
    "country_list": 86400,      # 24 hours — rarely changes
    "feature_flags": 60,        # 1 min — needs fast propagation
}
```

**Best for:** Data where short-lived staleness is acceptable.
**Risk:** Stale data during TTL window.

### Strategy 2: Write-Through

```python
async def update_user(user_id: str, data: UpdateUserRequest) -> User:
    # 1. Update database
    user = await db.users.update(user_id, data)

    # 2. Update cache immediately
    await cache.set(f"users:{user_id}", user.dict(), ttl=3600)

    return user
```

**Best for:** Read-heavy data that must be fresh after writes.
**Risk:** Cache and DB can diverge on failures.

### Strategy 3: Write-Behind (Async)

```python
async def update_user(user_id: str, data: UpdateUserRequest) -> User:
    # 1. Update cache immediately (fast response)
    await cache.set(f"users:{user_id}", data.dict(), ttl=3600)

    # 2. Queue DB write for async processing
    await queue.publish("user.updated", {"id": user_id, "data": data.dict()})

    return data
```

**Best for:** Write-heavy workloads where eventual consistency is OK.
**Risk:** Data loss if cache fails before DB write.

### Strategy 4: Event-Driven Invalidation

```python
# Publisher: invalidate on mutation
async def update_product(product_id: str, data: dict) -> Product:
    product = await db.products.update(product_id, data)
    await event_bus.publish("product.updated", {"id": product_id})
    return product

# Subscriber: listen and invalidate
@event_handler("product.updated")
async def on_product_updated(event: dict):
    await cache.invalidate(f"products:{event['id']}")
    await cache.invalidate_pattern(f"products:list:*")  # List caches too
```

**Best for:** Microservices, cross-service cache invalidation.

---

## Cache-Aside Pattern (Lazy Loading)

The most common caching pattern:

```python
async def get_user(user_id: str) -> User:
    # 1. Check cache
    cached = await cache.get(f"users:{user_id}")
    if cached:
        return User(**cached)

    # 2. Cache miss — fetch from DB
    user = await db.users.get(user_id)
    if user is None:
        raise NotFoundError("User", user_id)

    # 3. Populate cache
    await cache.set(f"users:{user_id}", user.dict(), ttl=3600)

    return user
```

### Cache Stampede Prevention

When cache expires and many requests hit simultaneously:

```python
import asyncio

# Solution: Distributed lock
async def get_user_safe(user_id: str) -> User:
    cached = await cache.get(f"users:{user_id}")
    if cached:
        return User(**cached)

    # Acquire lock to prevent stampede
    lock_key = f"lock:users:{user_id}"
    if await cache.client.set(lock_key, "1", ex=10, nx=True):
        try:
            user = await db.users.get(user_id)
            await cache.set(f"users:{user_id}", user.dict(), ttl=3600)
            return user
        finally:
            await cache.invalidate(lock_key)
    else:
        # Another request is rebuilding — wait and retry
        await asyncio.sleep(0.1)
        return await get_user_safe(user_id)
```

---

## Negative Caching

Cache "not found" results to prevent repeated DB lookups:

```python
NEGATIVE_CACHE_TTL = 60  # Short TTL for negative results

async def get_user(user_id: str) -> User | None:
    cached = await cache.get(f"users:{user_id}")
    if cached == "__NOT_FOUND__":
        return None
    if cached:
        return User(**cached)

    user = await db.users.get(user_id)
    if user is None:
        await cache.set(f"users:{user_id}", "__NOT_FOUND__", ttl=NEGATIVE_CACHE_TTL)
        return None

    await cache.set(f"users:{user_id}", user.dict(), ttl=3600)
    return user
```

---

## Monitoring & Observability

### Key Metrics

| Metric | Target | Alert |
|--------|--------|-------|
| Hit rate | > 90% | < 70% |
| Miss rate | < 10% | > 30% |
| Eviction rate | Low | Sudden spike |
| Latency (p99) | < 5ms | > 50ms |
| Memory usage | < 80% capacity | > 90% |

### Logging

```python
import logging

logger = logging.getLogger("cache")

async def get_cached(key: str) -> dict | None:
    result = await cache.get(key)
    if result:
        logger.debug("cache.hit", extra={"key": key})
    else:
        logger.debug("cache.miss", extra={"key": key})
    return result
```

---

## Agent Instructions

```markdown
When implementing caching:

1. ALWAYS define TTL — never cache without expiration
2. ALWAYS invalidate on writes (write-through or event-driven)
3. ALWAYS namespace cache keys to prevent collisions
4. ALWAYS handle cache failures gracefully (fall through to source)
5. NEVER cache sensitive data in shared/unencrypted caches
6. NEVER use KEYS command in Redis production (use SCAN)
7. NEVER assume cached data is current — treat as optimization only
8. Consider cache stampede prevention for high-traffic keys
9. Monitor hit rates and alert on anomalies
```

---

*Version: 1.0.0*
