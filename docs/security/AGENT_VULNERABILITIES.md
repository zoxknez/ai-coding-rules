# 🎯 Agent-Induced Vulnerabilities Guide

> **Security vulnerabilities commonly introduced by AI coding assistants**
>
> This document catalogs the specific vulnerability patterns that LLM-based agents
> tend to generate, with root cause analysis and mandatory mitigations.

---

## Executive Summary

AI agents prioritize **syntactic fluency over semantic security**. They favor:
- Deprecated patterns (heavily represented in training data)
- Insecure defaults (path of least resistance)
- Convenience over safety (brevity optimization)

This guide documents the causal links between agent behavior and security flaws.

---

## Vulnerability Classification

| Severity | Definition | Response |
|----------|------------|----------|
| 🔴 Critical | Remote code execution, data breach | Immediate block, security review |
| 🟠 High | Authentication bypass, injection | Block commit, require fix |
| 🟡 Medium | Information disclosure, DoS | Flag for review |
| 🟢 Low | Best practice violation | Suggest improvement |

---

## Python Vulnerabilities

### PY-001: Insecure Deserialization (pickle)

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical |
| **CWE** | CWE-502 |
| **OWASP** | A8:2021 - Software and Data Integrity Failures |

**Why Agents Generate This:**
- `pickle` is ubiquitous in older tutorials and StackOverflow
- Single-line API: `pickle.loads(data)` vs multi-step JSON parsing
- ML model serialization examples heavily use pickle

**Vulnerable Pattern:**
```python
import pickle

# Agent generates this for "save user session"
def load_session(session_data: bytes):
    return pickle.loads(session_data)  # 🔴 RCE
```

**Exploit Mechanism:**
```python
import pickle
import os

class Exploit:
    def __reduce__(self):
        return (os.system, ('rm -rf /',))

payload = pickle.dumps(Exploit())
# Send payload as session_data → Server executes rm -rf /
```

**Mitigation:**
```python
# ✅ Use JSON for structured data
import json
session = json.loads(session_data)

# ✅ Use msgpack for binary efficiency
import msgpack
session = msgpack.unpackb(session_data, raw=False)

# ✅ For ML models, use safetensors or ONNX
from safetensors import safe_open
```

**Detection:**
```yaml
# semgrep rule
rules:
  - id: python-pickle-usage
    pattern: pickle.$METHOD(...)
    message: "pickle is unsafe for untrusted data"
    severity: ERROR
```

---

### PY-002: SQL Injection via f-strings

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical |
| **CWE** | CWE-89 |
| **OWASP** | A3:2021 - Injection |

**Why Agents Generate This:**
- f-strings are the modern Python string format
- Agents optimize for readability
- ORM escape hatches encourage raw SQL

**Vulnerable Pattern:**
```python
# Agent generates this for "complex report query"
def get_user_orders(user_id: str):
    query = f"SELECT * FROM orders WHERE user_id = '{user_id}'"
    return db.execute(query)  # 🔴 SQL Injection
```

**Mitigation:**
```python
# ✅ Parameterized query
def get_user_orders(user_id: str):
    query = "SELECT * FROM orders WHERE user_id = %s"
    return db.execute(query, (user_id,))

# ✅ ORM method
def get_user_orders(user_id: str):
    return Order.query.filter_by(user_id=user_id).all()
```

---

### PY-003: Path Traversal

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **CWE** | CWE-22 |
| **OWASP** | A1:2021 - Broken Access Control |

**Vulnerable Pattern:**
```python
# Agent generates for "download file by name"
def download_file(filename: str):
    path = f"./uploads/{filename}"
    return open(path, 'rb').read()  # 🟠 Path traversal
```

**Attack:** `filename = "../../../etc/passwd"`

**Mitigation:**
```python
import os
from pathlib import Path

UPLOAD_DIR = Path("./uploads").resolve()

def download_file(filename: str):
    # Resolve and validate
    file_path = (UPLOAD_DIR / filename).resolve()
    
    # Ensure path is within allowed directory
    if not file_path.is_relative_to(UPLOAD_DIR):
        raise ValueError("Invalid path")
    
    if not file_path.exists():
        raise FileNotFoundError()
    
    return file_path.read_bytes()
```

---

## JavaScript/TypeScript Vulnerabilities

### JS-001: XSS via dangerouslySetInnerHTML

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **CWE** | CWE-79 |
| **OWASP** | A3:2021 - Injection |

**Why Agents Generate This:**
- React's default escaping blocks HTML rendering
- Markdown/rich text requires HTML injection
- `dangerouslySetInnerHTML` is the documented escape hatch

**Vulnerable Pattern:**
```tsx
// Agent generates for "render markdown content"
function BlogPost({ content }: { content: string }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: content }} />
    );  // 🟠 XSS
}
```

**Mitigation:**
```tsx
import DOMPurify from 'dompurify';

// ✅ Create SafeHTML component
function SafeHTML({ html }: { html: string }) {
    const clean = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'li'],
        ALLOWED_ATTR: ['href']
    });
    
    return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// ✅ For Markdown, use a safe renderer
import ReactMarkdown from 'react-markdown';

function BlogPost({ content }: { content: string }) {
    return <ReactMarkdown>{content}</ReactMarkdown>;
}
```

---

### JS-002: SSR Serialization Injection

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **CWE** | CWE-79 |
| **OWASP** | A3:2021 - Injection |

**Why Agents Generate This:**
- Custom SSR/Islands architectures need hydration
- `JSON.stringify` seems safe for JSON
- Training data includes naive implementations

**Vulnerable Pattern:**
```tsx
// Agent generates for "pass server state to client"
function renderPage(data: object) {
    return `
        <html>
            <body>
                <div id="root"></div>
                <script>
                    window.__DATA__ = ${JSON.stringify(data)};
                </script>
            </body>
        </html>
    `;
}
```

**Attack:** If `data` contains `</script><script>alert(1)</script>`, the browser parses it as HTML, executing the injected script.

**Mitigation:**
```tsx
// ✅ Use proper escaping
import serialize from 'serialize-javascript';

function renderPage(data: object) {
    return `
        <script>
            window.__DATA__ = ${serialize(data, { isJSON: true })};
        </script>
    `;
}

// ✅ Better: Use framework mechanisms
// Next.js: getServerSideProps
// Remix: loader functions
// These handle escaping automatically
```

---

### JS-003: Prototype Pollution

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **CWE** | CWE-1321 |
| **OWASP** | A3:2021 - Injection |

**Vulnerable Pattern:**
```typescript
// Agent generates for "merge user preferences"
function mergeDeep(target: any, source: any) {
    for (const key in source) {
        if (source[key] instanceof Object) {
            target[key] = mergeDeep(target[key] || {}, source[key]);
        } else {
            target[key] = source[key];  // 🟠 Pollution
        }
    }
    return target;
}
```

**Attack:**
```json
{
    "__proto__": {
        "isAdmin": true
    }
}
```

**Mitigation:**
```typescript
// ✅ Use Object.hasOwn and filter dangerous keys
function mergeDeep(target: object, source: object): object {
    const DANGEROUS_KEYS = ['__proto__', 'constructor', 'prototype'];
    
    for (const key of Object.keys(source)) {
        if (DANGEROUS_KEYS.includes(key)) continue;
        if (!Object.hasOwn(source, key)) continue;
        
        // ... merge logic
    }
    return target;
}

// ✅ Better: Use established library
import { merge } from 'lodash'; // Patched against pollution
import { deepmerge } from 'deepmerge';
```

---

## Go Vulnerabilities

### GO-001: Nil Pointer Panic (DoS)

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **CWE** | CWE-476 |
| **OWASP** | A5:2021 - Security Misconfiguration |

**Why Agents Generate This:**
- Agents assume "happy path"
- Go lacks Option types
- Nil checks are verbose

**Vulnerable Pattern:**
```go
// Agent generates for "get user city"
func GetUserCity(user *User) string {
    return user.Address.City  // 🟡 Panic if nil
}
```

**Mitigation:**
```go
// ✅ Explicit nil checks
func GetUserCity(user *User) string {
    if user == nil || user.Address == nil {
        return ""
    }
    return user.Address.City
}

// ✅ Nil-safe accessor pattern
func (u *User) GetAddressCity() string {
    if u == nil || u.Address == nil {
        return ""
    }
    return u.Address.City
}
```

---

### GO-002: Goroutine Leak

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **CWE** | CWE-400 |
| **OWASP** | A5:2021 - Security Misconfiguration |

**Vulnerable Pattern:**
```go
// Agent generates for "background processing"
func ProcessItems(items []Item) {
    for _, item := range items {
        go func(i Item) {
            for {
                process(i)  // 🟡 Never terminates
            }
        }(item)
    }
}
```

**Mitigation:**
```go
func ProcessItems(ctx context.Context, items []Item) {
    var wg sync.WaitGroup
    
    for _, item := range items {
        wg.Add(1)
        go func(i Item) {
            defer wg.Done()
            for {
                select {
                case <-ctx.Done():
                    return  // Clean exit
                default:
                    process(i)
                }
            }
        }(item)
    }
    
    wg.Wait()
}
```

---

## Rust Vulnerabilities

### RS-001: Unsafe Block Escape

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical |
| **CWE** | CWE-119 |
| **OWASP** | A6:2021 - Vulnerable Components |

**Why Agents Generate This:**
- Borrow checker frustration
- Agents seek "working" code
- `unsafe` bypasses all checks

**Vulnerable Pattern:**
```rust
// Agent generates when stuck on lifetimes
fn get_reference<'a>() -> &'a str {
    let s = String::from("hello");
    unsafe {
        // 🔴 Use-after-free
        std::mem::transmute::<&str, &'a str>(s.as_str())
    }
}
```

**Mitigation:**
- Agents MUST NOT use `unsafe` without explicit approval
- Use `cargo-geiger` to detect unsafe blocks
- Review all unsafe code manually

---

## C# Vulnerabilities

### CS-001: Captive Dependency

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **CWE** | CWE-404 |
| **OWASP** | A5:2021 - Security Misconfiguration |

**Vulnerable Pattern:**
```csharp
// Agent defaults to Singleton for "manager" classes
services.AddSingleton<OrderManager>();
services.AddScoped<AppDbContext>();

public class OrderManager {
    private readonly AppDbContext _context;  // 🟡 Captured!
    
    public OrderManager(AppDbContext context) {
        _context = context;
    }
}
```

**Mitigation:**
```csharp
// ✅ Match lifetimes
services.AddScoped<OrderManager>();

// ✅ Or use scope factory in Singletons
public class OrderManager {
    private readonly IServiceScopeFactory _factory;
    
    public async Task<Order> GetOrder(int id) {
        using var scope = _factory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        return await context.Orders.FindAsync(id);
    }
}
```

---

## Mobile Vulnerabilities

### MOB-001: iOS UserDefaults for Secrets

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical |
| **CWE** | CWE-312 |
| **OWASP Mobile** | M2 - Insecure Data Storage |

**Vulnerable Pattern:**
```swift
// Agent's one-liner for "store token"
UserDefaults.standard.set(authToken, forKey: "token")  // 🔴 Unencrypted
```

**Mitigation:** See [stack_mobile.md](../stacks/stack_mobile.md#-critical-keychain-vs-userdefaults)

---

### MOB-002: Android WebView RCE

| Field | Value |
|-------|-------|
| **Severity** | 🔴 Critical |
| **CWE** | CWE-94 |
| **OWASP Mobile** | M7 - Client Code Quality |

**Vulnerable Pattern:**
```kotlin
// Agent enables JS bridge without understanding risks
webView.addJavascriptInterface(NativeInterface(), "Android")
webView.loadUrl(untrustedUrl)  // 🔴 RCE
```

**Mitigation:** See [stack_mobile.md](../stacks/stack_mobile.md#-critical-webview-javascript-interface-rce)

---

## Detection Rules

### Semgrep Configuration

```yaml
# .semgrep.yml
rules:
  # Python
  - id: python-pickle
    patterns:
      - pattern: pickle.$METHOD(...)
    message: "pickle usage detected - use JSON or msgpack"
    severity: ERROR
    
  - id: python-sql-fstring
    patterns:
      - pattern: $DB.execute(f"...")
    message: "SQL injection via f-string"
    severity: ERROR
    
  # JavaScript
  - id: js-dangerous-innerhtml
    patterns:
      - pattern: dangerouslySetInnerHTML={{ __html: $VAR }}
    message: "Use SafeHTML component instead"
    severity: WARNING
    
  # Rust
  - id: rust-unsafe-block
    patterns:
      - pattern: unsafe { ... }
    message: "unsafe block requires manual review"
    severity: WARNING
```

### Pre-commit Configuration

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/returntocorp/semgrep
    rev: v1.0.0
    hooks:
      - id: semgrep
        args: ['--config', '.semgrep.yml', '--error']
        
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

---

## Agent Instructions

Include in all platform rule files:

```markdown
## Security Vulnerability Prevention

Before generating code, check for these patterns:

1. NEVER use pickle/marshal for deserialization
2. NEVER use f-strings/string interpolation in SQL
3. NEVER use dangerouslySetInnerHTML without sanitization
4. NEVER use unsafe blocks in Rust without approval
5. NEVER store secrets in UserDefaults (iOS) or SharedPreferences (Android)
6. NEVER use addJavascriptInterface with untrusted WebView content

If you find yourself generating any of these patterns:
1. STOP
2. Use the safe alternative from the vulnerability guide
3. Document why the safe alternative was chosen
```

---

*Version: 1.0.0*
*Last Updated: 2026-01-28*
