# Observability & Performance Guide (v1)

> You can't improve what you can't measure. Every AI-generated service must be observable from day one.

---

## The Three Pillars

| Pillar | Purpose | Tools |
|--------|---------|-------|
| **Logs** | What happened (discrete events) | Pino, Winston, structlog, slog |
| **Metrics** | How much / how often (aggregated numbers) | Prometheus, DataDog, CloudWatch |
| **Traces** | Where time was spent (request lifecycle) | OpenTelemetry, Jaeger, Zipkin |

## Structured Logging Rules

### Always Include
```json
{
  "timestamp": "2026-02-13T10:30:00Z",
  "level": "error",
  "message": "Payment processing failed",
  "correlationId": "req-abc-123",
  "userId": "usr-456",
  "service": "billing",
  "duration_ms": 342,
  "error": {
    "code": "STRIPE_DECLINED",
    "message": "Card declined"
  }
}
```

### Never Log
- ❌ Passwords, tokens, API keys, secrets
- ❌ Full credit card numbers or SSNs
- ❌ PII without explicit consent and masking
- ❌ Request/response bodies in production (use debug level only)
- ❌ Stack traces to end users (log internally, return generic error)

### Log Levels

| Level | When | Example |
|-------|------|---------|
| `error` | Something broke, needs attention | DB connection failed |
| `warn` | Degraded but functional | Rate limit approaching |
| `info` | Business events, lifecycle | User registered, order placed |
| `debug` | Developer troubleshooting | Query params, cache hit/miss |

### Correlation IDs
```
Every inbound request → generate correlation ID → propagate through all downstream calls
```
- Use header: `X-Correlation-ID` or `X-Request-ID`
- Include in all log entries for that request
- Pass to downstream services and external API calls

## Metrics Strategy

### Four Golden Signals (Google SRE)

| Signal | Metric | Alert Threshold |
|--------|--------|----------------|
| **Latency** | p50, p95, p99 response time | p99 > 2x baseline |
| **Traffic** | Requests per second | Sudden drop > 50% |
| **Errors** | 5xx rate, error ratio | > 1% of traffic |
| **Saturation** | CPU, memory, disk, connections | > 80% capacity |

### Business Metrics to Track
- Signups, conversions, revenue events
- Feature usage (which features, how often)
- User journey completion rates
- API endpoint usage distribution

### Metric Types

| Type | Use For | Example |
|------|---------|---------|
| Counter | Cumulative totals | `http_requests_total` |
| Gauge | Current value | `active_connections` |
| Histogram | Distribution of values | `request_duration_seconds` |

## Distributed Tracing

### Instrument These
- HTTP server entry points (automatic with OTEL middleware)
- Database queries (query type, table, duration)
- External API calls (service, endpoint, duration, status)
- Cache operations (hit/miss, key pattern, duration)
- Queue operations (publish, consume, processing time)
- File I/O operations (path, operation, size)

### Span Attributes
```
service.name       = "billing-service"
http.method        = "POST"
http.url           = "/api/v1/payments"
http.status_code   = 201
db.system          = "postgresql"
db.statement       = "SELECT ... FROM orders WHERE ..."
db.operation       = "SELECT"
```

### OpenTelemetry Setup Pattern
```typescript
// Initialize ONCE at application startup, before any imports
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

const sdk = new NodeSDK({
  serviceName: process.env.SERVICE_NAME,
  autoInstrumentations: getNodeAutoInstrumentations(),
});
sdk.start();
```

## Performance Budgets

### Frontend
| Metric | Budget | Tool |
|--------|--------|------|
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| INP (Interaction to Next Paint) | < 200ms | Web Vitals |
| CLS (Cumulative Layout Shift) | < 0.1 | Lighthouse |
| Bundle size (initial JS) | < 200KB gzipped | Bundleanalyzer |
| Time to Interactive | < 3.5s | Lighthouse |

### Backend
| Metric | Budget | Tool |
|--------|--------|------|
| API response (p95) | < 200ms | APM |
| Database query (p95) | < 50ms | Query analyzer |
| Cold start (serverless) | < 1s | CloudWatch |
| Memory per request | < 50MB | APM |

## Alerting Rules

### Alert on Symptoms, Not Causes
```
✅ "Error rate > 5% for 5 minutes"         → user impact
❌ "CPU > 80%"                              → cause (may not impact users)
```

### Severity Levels

| Level | Response Time | Example |
|-------|--------------|---------|
| P0 — Critical | 15 min | Service fully down, data loss |
| P1 — High | 1 hour | Major feature broken, >10% errors |
| P2 — Medium | Business hours | Degraded performance, non-critical |
| P3 — Low | Next sprint | Minor anomaly, cosmetic |

### Runbook Template
```markdown
## Alert: [name]
**Severity:** P[0-3]
**Service:** [service name]
**Symptom:** [what users experience]
**Likely Causes:** [ranked list]
**Verification Steps:** [commands to run]
**Remediation:** [fix steps]
**Escalation:** [who to contact]
```

## Health Check Pattern

```typescript
// ✅ Deep health check — verifies all dependencies
app.get('/health', async (req, res) => {
  const checks = {
    database: await checkDB(),
    cache: await checkRedis(),
    queue: await checkQueue(),
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'healthy' : 'degraded',
    checks,
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
  });
});
```

## AI-Generated Code Performance Rules

1. **No N+1 queries** — AI frequently generates loops with individual DB calls
2. **No unbounded queries** — always include `LIMIT`, pagination
3. **No synchronous I/O in hot paths** — use async/await consistently
4. **No memory leaks** — close connections, clear intervals, unsubscribe listeners
5. **No missing indexes** — every `WHERE`/`JOIN` field should be indexed
6. **No premature optimization** — measure first, optimize second

## Related Docs
- [tool_integration](tool_integration.md) — integration with lint/test/build tools
- [incident_response](incident_response.md) — what to do when alerts fire
- [SECURITY_GUARDRAILS](SECURITY_GUARDRAILS.md) — never log secrets
