# 🔌 Model Context Protocol (MCP) Servers

> **Supercharge AI Assistants with Real-Time Context**
>
> Instead of describing your database schema, connect the AI directly via MCP.
> The AI sees real-time data, schemas, and can take actions on your behalf.

---

## 🎯 What is MCP?

MCP (Model Context Protocol) is an open-source standard for connecting AI applications to external systems.

**Think of it as USB-C for AI:**
- USB-C connects devices → MCP connects AI to data sources
- Standardized protocol → works across Claude, Cursor, Windsurf, etc.
- Real-time access → AI sees actual data, not stale documentation

---

## ⭐ Recommended MCP Servers

### 🗃️ Databases

| Server | Purpose | Install |
|--------|---------|---------|
| **[PostgreSQL MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/postgres)** | Query PostgreSQL, view schema | `npx @modelcontextprotocol/server-postgres` |
| **[Supabase MCP](https://cursor.directory/mcp/supabase)** | Supabase operations | Built-in support |
| **[SQLite MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite)** | Local SQLite databases | `npx @modelcontextprotocol/server-sqlite` |
| **[Prisma MCP](https://cursor.directory/mcp/prisma)** | Prisma schema awareness | Community server |

**Benefits:**
- AI sees actual table schemas
- Can query data to understand patterns
- Generates accurate migrations
- Catches foreign key issues before you do

### 🔍 Search & Knowledge

| Server | Purpose | Install |
|--------|---------|---------|
| **[Brave Search MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search)** | Web search | `npx @modelcontextprotocol/server-brave-search` |
| **[Mantic MCP](https://cursor.directory/mcp/mantic)** | Fast local codebase search | `npx mantic.sh@latest server` |
| **[Memory MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)** | Persistent knowledge graph | `npx @modelcontextprotocol/server-memory` |

**Benefits:**
- AI can research before implementing
- Finds relevant docs and examples
- Remembers context across sessions

### 📁 File Systems & Git

| Server | Purpose | Install |
|--------|---------|---------|
| **[GitHub MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/github)** | Issues, PRs, code search | `npx @modelcontextprotocol/server-github` |
| **[Filesystem MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem)** | File operations | `npx @modelcontextprotocol/server-filesystem` |
| **[Git MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/git)** | Git operations | `npx @modelcontextprotocol/server-git` |

**Benefits:**
- AI understands project history
- Can create/manage issues
- Reads related PRs for context

### 🌐 APIs & Services

| Server | Purpose | Install |
|--------|---------|---------|
| **[Postman MCP](https://cursor.directory/mcp/postman-mcp-server)** | API testing & collections | Postman integration |
| **[Slack MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/slack)** | Team communication | `npx @modelcontextprotocol/server-slack` |
| **[Google Maps MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps)** | Geolocation | `npx @modelcontextprotocol/server-google-maps` |

### 🧪 Development Tools

| Server | Purpose | Install |
|--------|---------|---------|
| **[Puppeteer MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer)** | Browser automation | `npx @modelcontextprotocol/server-puppeteer` |
| **[Sentry MCP](https://cursor.directory/mcp/sentry)** | Error monitoring | Sentry integration |
| **[Docker MCP](https://cursor.directory/mcp/docker)** | Container management | Community server |

---

## 📦 Installation

### Cursor Configuration

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/database"
      ]
    },
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src"
      ]
    }
  }
}
```

### Claude Desktop Configuration

Add to `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://user:password@localhost:5432/database"
      ]
    }
  }
}
```

---

## 🎯 Use Cases by Stack

### Full-Stack Next.js + Supabase

```json
{
  "mcpServers": {
    "supabase": { /* Supabase connection */ },
    "github": { /* PR and issue tracking */ },
    "brave-search": { /* Research docs */ }
  }
}
```

**AI Capabilities:**
- Sees real Supabase schema
- Generates accurate RLS policies
- Creates type-safe queries
- Links changes to GitHub issues

### Python + PostgreSQL

```json
{
  "mcpServers": {
    "postgres": { /* Direct DB access */ },
    "filesystem": { /* Project files */ },
    "memory": { /* Session context */ }
  }
}
```

**AI Capabilities:**
- Queries actual data for examples
- Generates accurate SQLAlchemy models
- Remembers project conventions

### Microservices Architecture

```json
{
  "mcpServers": {
    "docker": { /* Container awareness */ },
    "postgres": { /* Service databases */ },
    "slack": { /* Team notifications */ }
  }
}
```

---

## ⚠️ Security Considerations

### What to Connect

| Data Type | Recommendation |
|-----------|----------------|
| **Development DB** | ✅ Safe to connect |
| **Staging DB** | ⚠️ Anonymize PII first |
| **Production DB** | ❌ Use read-only replica |
| **API keys** | ⚠️ Use env vars, not hardcoded |
| **Customer data** | ❌ Never expose directly |

### Read-Only Connections

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "postgresql://readonly_user:pass@localhost:5432/db"
      ]
    }
  }
}
```

### Scoped Access

```json
{
  "mcpServers": {
    "filesystem": {
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "./src",  // Only src folder
        "--readonly"
      ]
    }
  }
}
```

---

## 🔧 Custom MCP Servers

Build project-specific MCP servers for:

1. **Internal APIs** — Expose internal service schemas
2. **Domain Knowledge** — Product requirements, business rules
3. **Deployment Tools** — Custom CI/CD integrations
4. **Monitoring** — Metrics, logs, alerts

**Template:**
```typescript
// mcp-server/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: 'my-project-mcp',
  version: '1.0.0',
}, {
  capabilities: {
    tools: {},
    resources: {},
  }
});

// Add tools and resources...

const transport = new StdioServerTransport();
await server.connect(transport);
```

---

## 📚 Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [MCP Servers List](https://github.com/modelcontextprotocol/servers)
- [Cursor MCP Directory](https://cursor.directory/mcp)
- [Building MCP Servers](https://modelcontextprotocol.io/docs/develop/build-server)
- [Anthropic MCP Announcement](https://www.anthropic.com/news/model-context-protocol)

---

## 📋 Quick Setup Checklist

- [ ] Install MCP servers for your stack
- [ ] Configure `.cursor/mcp.json` or Claude Desktop config
- [ ] Test connection with simple query
- [ ] Use read-only credentials for databases
- [ ] Don't expose production data directly
- [ ] Document connected services in README
