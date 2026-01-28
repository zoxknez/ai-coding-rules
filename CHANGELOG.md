# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [4.8.1] - 2026-01-28

### Changed — Source Citations for Language Structures

- Added authoritative sources to language structure blueprints.
- Clarified where layouts are conventions layered on top of official defaults.
- Cleaned duplicate header in Go structure.

### Sources Verified

- Each language structure and security blueprint now includes authoritative external sources.

#### Updated Files

- languages/nextjs/structure.md
- languages/javascript/structure.md
- languages/typescript/structure.md
- languages/go/structure.md
- languages/rust/structure.md
- languages/java/structure.md
- languages/kotlin/structure.md
- languages/php/structure.md
- languages/ruby/structure.md
- languages/dart/structure.md
- languages/c/structure.md
- languages/cpp/structure.md
- languages/python/structure.md
- languages/dotnet/structure.md
- languages/swift/structure.md
- languages/*/README.md
- languages/*/security.md
- languages/README.md
- docs/README.md
- README.md

## [4.8.0] - 2026-01-28

### Changed — Language Structure Blueprints 2026

**Problem Addressed:** Align language folders to the 2026 AI-first structure patterns.

#### Updated Structures

- Python: src layout with domain, application, infrastructure, api, and shared.
- JavaScript: layered Node.js structure with domain and application.
- TypeScript: layered backend and full-stack structure.
- Go: cmd + internal with explicit layers and api handlers.
- Rust: Cargo layout with domain, application, infrastructure, and api.
- Java: Maven layout with config, domain, application, infrastructure, and api.
- .NET: Clean Architecture solution layout with separate projects.
- PHP: Laravel-style layered layout.
- Swift: SPM layout with App, Domain, Application, Infrastructure, Shared.
- Kotlin: Gradle JVM layout with layers.
- Ruby: Gem layout with lib and spec.
- C++: CMake layout with include, src, tests, examples, scripts.

#### Added

- Next.js folder blueprint for App Router 2026.

#### Documentation Updates

- Updated [languages/README.md](languages/README.md) index.
- Updated [docs/README.md](docs/README.md) language links.
- Updated [README.md](README.md) repository structure list.

## [4.7.0] - 2026-01-28

### Added — Language Folder Blueprints

**Problem Addressed:** Every language needs a canonical folder blueprint to reduce context ambiguity for agentic development.

**Sources Consulted:**
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout)
- [Next.js App Router Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Rust Cargo Workspaces](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html)
- [Apple Keychain Services](https://developer.apple.com/documentation/security/keychain-services)

#### New Language Folders (NEW)

- **`languages/README.md`** — Index and contract for language blueprints
- **`languages/python/`** — Interface-first layout with schemas and services
- **`languages/typescript/`** — Feature-sliced layout for Next.js and React
- **`languages/javascript/`** — Modular API structure with schemas and services
- **`languages/go/`** — Standard Go layout with internal boundary
- **`languages/rust/`** — Cargo workspace layout with crate boundaries
- **`languages/dotnet/`** — Clean Architecture layout for .NET 8+
- **`languages/java/`** — Layered packages for JVM services
- **`languages/kotlin/`** — Android Clean Architecture with feature modules
- **`languages/swift/`** — iOS feature modularization with ViewModels
- **`languages/php/`** — Laravel-style layering with DTO boundaries
- **`languages/ruby/`** — Rails-style services and policy boundaries
- **`languages/dart/`** — Flutter feature modules with clean boundaries
- **`languages/c/`** — C layout with include and src boundaries
- **`languages/cpp/`** — C++ layout with modern RAII boundaries

#### Documentation Updates

- Updated [docs/README.md](docs/README.md) with language links and index.
- Updated [README.md](README.md) repository structure to include languages/.

## [4.6.0] - 2026-01-28

### Added — Agentic Development Governance Framework

**Problem Addressed:** Comprehensive architectural governance for the era of agentic development ("vibe coding"), where AI agents handle implementation while humans govern intent and architecture.

**Analysis Source:** "Architectural Governance and Security Posture in the Era of Agentic Development" - comprehensive analysis of optimal repository structures, security guardrails, and language-specific vulnerability mitigations.

#### Project Constitution (NEW)
- **`docs/core/CONSTITUTION.md`** — Supreme governance document for all AI agents
  - Article I: Security First (hierarchy, prohibitions, trust boundaries)
  - Article II: Explicit Intent (ADRs required, no magic, docs as code)
  - Article III: Minimal Footprint (YAGNI, dependency discipline, size limits)
  - Article IV: Verification Loops (test-first, pre-commit, build gates)
  - Article V: Language-Specific Mandates (Python, TS, Go, Rust, C#)
  - Article VI: Data Governance (database ops, API design)
  - Article VII: Incident Response (stop triggers, escalation)
  - Article VIII: Enforcement (hierarchy, amendment process)

#### Architecture Decision Records (NEW)
- **`docs/architecture/decisions/`** — ADR system for architectural context
  - `README.md` — ADR index and workflow
  - `template.md` — Standard ADR format with agent instructions section
  - `0001-record-architecture-decisions.md` — Initial ADR establishing the system

#### Google Antigravity Platform Support (NEW)
- **`.antigravity/rules.md`** — Project constitution for Antigravity agents
  - Architecture overview with dependency rules
  - Security mandates and prohibited patterns
  - Agent workflow guidelines
  - Review policy (auto-proceed, request review, require approval)
  - Terminal policies
- **`.antigravity/allowlist.json`** — Terminal command security policy
  - Allowed commands by category (build, test, lint, git)
  - Denied dangerous commands (rm -rf, sudo, env exposure)
  - Escalation requirements
- **`.antigravity/workflows/`** — Standard Operating Procedures
  - `deployment-prep.md` — Pre-deployment verification workflow
  - `code-review.md` — Agent-assisted code review procedure

#### New Stack Guidelines
- **`docs/stacks/stack_go.md`** — Go patterns and vulnerabilities
  - Standard project layout with internal/ boundary
  - Error handling requirements
  - Nil safety patterns
  - Concurrency discipline (context, WaitGroups)
  - HTTP handler patterns
- **`docs/stacks/stack_csharp.md`** — C#/.NET 8+ patterns
  - Clean Architecture + DDD structure
  - Captive dependency prevention (DI lifetimes)
  - Mass assignment (overposting) prevention
  - XXE prevention in XML parsing
  - Async/await patterns
- **`docs/stacks/stack_mobile.md`** — iOS and Android security
  - iOS: Keychain vs UserDefaults (CRITICAL)
  - iOS: Certificate pinning, SwiftLint configuration
  - Android: Intent hijacking prevention
  - Android: WebView JavaScript interface RCE prevention
  - Android: EncryptedSharedPreferences, network security config

#### Security Documentation
- **`docs/security/AGENT_VULNERABILITIES.md`** — Catalog of agent-induced vulnerabilities
  - Root cause analysis (why agents generate these)
  - Python: pickle (RCE), SQL injection, path traversal
  - JavaScript: XSS, SSR injection, prototype pollution
  - Go: Nil panics (DoS), goroutine leaks
  - Rust: unsafe block escape
  - C#: Captive dependencies
  - Mobile: UserDefaults secrets, WebView RCE
  - Detection rules (semgrep, pre-commit)
- **`docs/security/CLOUD_IAC_SECURITY.md`** — Infrastructure as Code security
  - CDE metadata service risks
  - Terraform: wildcard IAM, hardcoded secrets, public S3, encryption
  - Docker: root user, latest tag, secrets in build, exposed ports
  - Kubernetes: privileged containers, secrets in ConfigMaps
  - IaC scanning tools (tfsec, checkov, hadolint, trivy)

#### Governance Automation
- **`docs/operations/GOVERNANCE_AUTOMATION.md`** — Automated verification framework
  - Verification hierarchy (agent → pre-commit → CI → human)
  - Complete pre-commit configuration (20+ hooks)
  - Custom semgrep rules for agent patterns
  - GitHub Actions security workflows
  - Language-specific verification commands
  - Tool configuration files (ESLint, Ruff, etc.)
- **`examples/config/README.md`** — Ready-to-use configuration templates
  - EditorConfig, gitignore additions, VS Code settings
  - Implementation checklist

### Changed
- Updated repository structure with new directories:
  - `docs/architecture/decisions/` — ADR storage
  - `docs/security/` — Security documentation
  - `.antigravity/` — Antigravity platform config
  - `examples/config/` — Configuration templates

### File Summary
New files created: 18
- `.antigravity/rules.md`
- `.antigravity/allowlist.json`
- `.antigravity/workflows/deployment-prep.md`
- `.antigravity/workflows/code-review.md`
- `docs/core/CONSTITUTION.md`
- `docs/architecture/decisions/README.md`
- `docs/architecture/decisions/template.md`
- `docs/architecture/decisions/0001-record-architecture-decisions.md`
- `docs/stacks/stack_go.md`
- `docs/stacks/stack_csharp.md`
- `docs/stacks/stack_mobile.md`
- `docs/security/AGENT_VULNERABILITIES.md`
- `docs/security/CLOUD_IAC_SECURITY.md`
- `docs/operations/GOVERNANCE_AUTOMATION.md`
- `examples/config/README.md`

---

## [4.5.0] - 2026-01-28

### Added — Professional Vibe Coding Practices

**Problem Addressed:** Need for granular MDC rules, context hygiene, refactoring methodology, enhanced security, MCP integration, and spec-driven development workflow.

**Inspired By:**
- [Cursor v0.45+ MDC format](https://cursor.directory/) — Reactive rules with glob patterns
- [Martin Fowler's Refactoring](https://refactoring.com/) — Systematic refactoring techniques
- [OWASP Developer Guide](https://owasp.org/www-project-developer-guide/) — Security best practices
- [Model Context Protocol](https://modelcontextprotocol.io/) — AI-to-data connections
- [Devin.cursorrules](https://github.com/grapeot/devin.cursorrules) — Agentic AI patterns
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules) — 37k+ stars community patterns

**Granular MDC Rules (NEW):**
Added context-specific reactive rules in `.cursor/rules/`:
- **`90-ui-components.mdc`** — React/Vue/Svelte component patterns with accessibility
- **`91-api-routes.mdc`** — API validation, auth, rate limiting patterns
- **`92-database.mdc`** — Prisma/Drizzle/SQL patterns with tenant isolation
- **`93-state-management.mdc`** — Zustand/Redux patterns with selector pattern

Each rule auto-activates via glob patterns (e.g., `**/components/**/*.tsx`).

**Context Hygiene (NEW):**
- **`templates/task_on_hand.md`** — Short-term memory to combat "context rot"
  - Updated after every successful step
  - Read before starting new tasks
  - Tracks assumptions, blockers, and checkpoints
  - Context refresh prompt for new conversations

**R.E.F.A.C.T. Methodology (NEW):**
- **`docs/quality/REFACT_METHODOLOGY.md`** — Anti-slop framework
  - **R**ecognise — Identify code smells (>300 lines, deep nesting)
  - **E**xtract — Extract functions/modules
  - **F**ormat — Consistent naming and style
  - **A**ddress Edge Cases — Handle all failure modes
  - **C**onfirm — Tests pass, no regressions
  - **T**une — Optimize only when measured

**Security Guardrails (NEW):**
- **`docs/operations/SECURITY_GUARDRAILS.md`** — Explicit security bans
  - `.env` file protection — Never modify or display
  - Mock data restrictions — Test only, never production
  - Trust boundaries — Validate all external input
  - OWASP Top 10 patterns with code examples
  - Authentication and API security requirements

**MCP Server Recommendations (NEW):**
- **`docs/core/MCP_SERVERS.md`** — Model Context Protocol integration
  - Database servers (PostgreSQL, Supabase, SQLite)
  - Search servers (Brave Search, Mantic, Memory)
  - Development tools (GitHub, Filesystem, Puppeteer)
  - Configuration examples for Cursor and Claude Desktop
  - Security considerations for production data

**Spec-Driven Development (NEW):**
- **`docs/workflows/SPEC_DRIVEN_DEVELOPMENT.md`** — OpenSpec workflow
  - Three phases: Proposal → Apply → Archive
  - No code without approved proposal (>10 LOC)
  - Prevents scope creep and wrong implementations
  - Full audit trail and documentation
- **`templates/proposal.md`** — Feature proposal template
  - Goal, success criteria, scope
  - Technical approach, alternatives
  - Risks, testing plan, rollback

**Quick Checklist (NEW):**
- **`docs/quality/QUICK_CHECKLIST.md`** — One-page verification
  - Code quality thresholds (300 lines file, 50 lines function)
  - TDD flow reminder
  - Placeholder syntax for portability
  - Context rot detection and recovery
  - Session stats to track

**Updated Structure:**
```
.cursor/rules/
├── 90-ui-components.mdc      # NEW
├── 91-api-routes.mdc         # NEW
├── 92-database.mdc           # NEW
└── 93-state-management.mdc   # NEW

templates/
├── task_on_hand.md           # NEW
└── proposal.md               # NEW

docs/
├── core/MCP_SERVERS.md       # NEW
├── quality/REFACT_METHODOLOGY.md    # NEW
├── quality/QUICK_CHECKLIST.md       # NEW
├── operations/SECURITY_GUARDRAILS.md # NEW
└── workflows/SPEC_DRIVEN_DEVELOPMENT.md # NEW
```

---

## [4.4.0] - 2025-01-28

### Changed — Repository Reorganization

**Problem Addressed:** Root directory had 40+ files making navigation difficult.

**New Structure:**
Reorganized documentation into `docs/` with logical categories:

```
docs/
├── core/           # 🎯 Essential rules (MASTER_RULES, global_rules, STRICT_MODE)
├── stacks/         # 🔵 Technology guides (frontend, backend, db, python, rust)
├── workflows/      # 🟡 Agent patterns (task_template, agent_loop, MEMORY_BANK)
├── operations/     # ⚪ Security & ops (security_privacy, incident_response)
├── quality/        # 🟢 Reviews (quality_control, code_review_rubric)
└── optimization/   # 💰 Token costs (TOKEN_OPTIMIZATION, RULE_INDEX)
```

**Files Moved:**
- 7 files → `docs/core/`
- 5 files → `docs/stacks/`
- 7 files → `docs/workflows/`
- 7 files → `docs/operations/`
- 4 files → `docs/quality/`
- 3 files → `docs/optimization/`

**Added:**
- `docs/README.md` — Documentation index with quick links
- README.md for each subfolder with contents and usage

**Root Directory Now Contains:**
- Platform configs only (CLAUDE.md, cursor-rules.md, etc.)
- Meta files (README, CHANGELOG, CONTRIBUTING, LICENSE)
- Platform-specific folders (.cursor/, .claude/, .github/, .windsurf/)

---

## [4.3.0] - 2025-01-28

### Added — Skills System, Universal Rule Format & STRICT Mode

**Problem Addressed:** Need for structured output templates (skills), cross-platform rule standardization, and non-negotiable rule enforcement.

**Inspired By:**
- [mamut-lab](https://github.com/orange-dot/mamut-lab) — Claude skills system with structured outputs
- [aicodingrules.org](https://aicodingrules.org/) — Proposed universal AI coding rules standard

**Skills System (NEW):**
Based on mamut-lab patterns, created `.claude/skills/` with structured output templates:
- **`code-review.md`** — Structured code review with severity ratings
- **`security-audit.md`** — OWASP Top 10 security scanning
- **`refactor-plan.md`** — Strategic refactoring with risk assessment
- **`rigor-audit.md`** — Combined quality audit (code, security, types, tests, docs, perf)
- **`README.md`** — Skills overview and usage guide

Each skill includes:
- When to Use triggers
- What It Checks tables
- Output Format templates (copy-paste ready)
- STRICT Mode Rules (non-negotiable)
- Example input/output

**Universal Rule Format (NEW):**
- **`UNIVERSAL_RULE_FORMAT.md`** — Cross-platform rule specification inspired by aicodingrules.org
- RDL (Rule Definition Language) schema with YAML + Markdown
- Platform mapping: Cursor (.mdc) ↔ Copilot (.instructions.md) ↔ Claude (.md) ↔ Windsurf
- Sync script template for auto-generating platform files
- Rule categories: Security (STRICT), Quality, Style

**STRICT Mode Enforcement (NEW):**
- **`STRICT_MODE.md`** — Non-negotiable rules that cannot be bypassed
- Security rules: No secrets, SQL injection prevention, auth required
- Type safety rules: strict: true, no untyped any
- Data integrity rules: No silent failures, idempotent operations
- Enforcement matrix across contexts (review, audit, CI, vibe mode)

**Testable Rules (NEW):**
Created `examples/rule-tests/` with verification test cases:
- **`security/no-secrets.test.md`** — 10+ test cases for secret detection
- **`security/sql-injection.test.md`** — SQL injection patterns and safe alternatives
- **`security/auth-required.test.md`** — Auth/authz test scenarios
- **`quality/no-any.test.md`** — TypeScript any usage tests
- **`quality/error-handling.test.md`** — Error handling patterns

Each test file includes:
- Rule reference metadata
- ❌ FAIL cases with violations and fixes
- ✅ PASS cases with explanations
- Edge cases and detection patterns

---

## [4.2.0] - 2025-01-28

### Added — Multi-Platform AI Assistant Support

**Problem Addressed:** Repository only had comprehensive Cursor support; other platforms (Copilot, Claude Code, Windsurf) needed full integration.

**GitHub Copilot Enhancements:**
- **Updated `.github/copilot-instructions.md`** with terminal command warning (critical bug)
- **New `.github/instructions/testing.instructions.md`** — Testing rules with AAA pattern
- **New `.github/instructions/security.instructions.md`** — Security-critical code rules
- **New `.github/instructions/python.instructions.md`** — Python best practices
- **New `.github/instructions/docs.instructions.md`** — Documentation standards

**Claude Code Enhancements:**
- **Expanded `CLAUDE.md`** with modular rules reference and permissions config
- **New `.claude/rules/`** directory with path-specific rules:
  - `security.md` — Security-critical patterns
  - `frontend.md` — React/component rules
  - `backend.md` — API/server patterns
  - `testing.md` — Test conventions
  - `database.md` — SQL/ORM patterns

**Windsurf Integration (NEW):**
- **New `.windsurf/memory.md`** — Main memory file for Cascade
- **New `.windsurf/cascade-config.md`** — Tips and shortcuts
- **New `.windsurf/rules/`** — Modular rule files
- **New `.codeiumignore`** — Exclude sensitive/large files from AI

**Cursor Expansion:**
- **New `.cursor/rules/71-git-workflow.mdc`** — Git conventions and commit messages
- **New `.cursor/rules/72-refactoring.mdc`** — Refactoring guidelines
- **New `.cursor/rules/73-error-handling.mdc`** — Error handling patterns
- **New `.cursor/rules/74-api-design.mdc`** — RESTful API design rules

**Documentation:**
- **New `AI_ASSISTANTS.md`** — Comprehensive integration guide for all platforms

**Known Issues Documented:**
- ⚠️ GitHub Copilot terminal command execution bug (runs commands in occupied terminals)

---

## [4.1.0] - 2025-01-28

### Added — Token Optimization & Modular Architecture

**Problem Addressed:** Community feedback that monolithic rules files cost $50+/day and cause context window overflow.

**New Files:**
- **TOKEN_OPTIMIZATION.md** — Comprehensive guide to reducing AI costs by 60-90%
- **RULE_SELECTION.md** — Flowchart for choosing which rules to load per task
- **RULE_INDEX.md** — Lightweight RAG-friendly lookup table (~200 tokens)
- **examples/modular-structure/** — Complete example of per-folder rule organization

**Key Improvements:**
- Modular loading patterns (Cursor .mdc, per-folder .cursorrules)
- Prompt caching integration (Anthropic best practices)
- Token budget guidelines per task type
- Anti-patterns to avoid
- Cost comparison tables (before/after)

**README Updates:**
- Added Token Optimization section
- Updated Repository Structure with new files
- Added links to new documentation

**Based On:**
- [Anthropic Prompt Caching Documentation](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching)
- [awesome-cursorrules patterns](https://github.com/PatrickJS/awesome-cursorrules)
- Community feedback on token costs

---

## [4.0.0] - 2026-01-27

### Added — Vibe Coding & AI-Native Enhancement

**New Files:**
- **CLAUDE.md** — Claude Code project memory file (auto-loaded at session start)
- **ANALYSIS_REPORT.md** — Comprehensive enhancement blueprint v2.0
- **.cursor/rules/65-stack-supabase.mdc** — Supabase RLS patterns, Auth, Edge Functions
- **.cursor/rules/66-stack-shadcn.mdc** — Shadcn UI, cn() helper, Lucide icons, Sonner
- **.cursor/rules/67-stack-nextjs15.mdc** — Next.js 15 App Router comprehensive guide
- **.cursor/rules/80-vibe-coding.mdc** — Vibe Coding Protocol for rapid prototyping

**Extended Files:**
- **MASTER_RULES.md** — Added Vibe Coding Protocol + Critical Partner Mindset sections
- **cognitive_protocols.md** — Added enhanced Critical Partner section with System-2 thinking
- **.cursor/rules/60-stack-frontend.mdc** — Next.js 15 App Router (RSC, Server Actions)
- **.cursor/rules/63-stack-db.mdc** — Supabase RLS function caching (17x speedup)

### Core Enhancements

**Supabase RLS Patterns:**
- Function caching: `(SELECT auth.uid())` vs `auth.uid()` — O(N+f(C)) vs O(N×f(C))
- Join optimization for multi-table policies
- Null guard patterns for unauthenticated access
- Indexing requirements for RLS predicates

**Next.js 15 App Router:**
- Server Component default strategy
- Parallel fetching with `Promise.all()`
- Server Actions for mutations
- Metadata generation patterns
- Migration guide from Pages Router

**Vibe Coding Protocol:**
- Speed > perfection philosophy for prototyping
- Reroll strategy (3 attempts before manual fix)
- Commit checkpoints every 15-30 min
- Context preservation patterns
- Guardrails and exit criteria

**Critical Partner Mindset:**
- Anti-sycophancy checklist
- System-2 Analysis template
- Contradiction detection format
- Trade-off analysis tables

### Changed
- Updated COMPANION DOCS table in MASTER_RULES.md
- Enhanced Active Learning Protocol in cognitive_protocols.md
- All new content in English per language policy

---

## [3.0.0] - 2026-01-27

### Added
- **MASTER_RULES.md** — All-in-one document combining core rules
- **cognitive_protocols.md** — Confusion management, pushback, tradeoffs
- **loop_strategies.md** — AI stamina leverage patterns
- **Platform-specific files:**
  - `copilot-instructions.md` for GitHub Copilot
  - `cursor-rules.md` for Cursor
  - `claude-instructions.md` for Claude Projects
- **The Golden Rule** section (Karpathy's declarative insight)
- **Three-Phase Pattern** (Naive → Correct → Optimize)
- **Pushback Protocol** for anti-sycophancy
- **Contradiction Detection Protocol**
- **Stop conditions** and escalation triggers

### Changed
- All documents translated to English
- Upgraded from v2 to v3 across all files
- Enhanced `global_rules.md` with Golden Rule
- Enhanced `ai_model_contract.md` with Pushback Protocol
- Enhanced `agent_loop.md` with declarative leverage
- Reorganized README for GitHub repository format
- Improved code review rubric with scoring system

### Improved
- Clearer anti-bloat guardrails
- Better metrics and targets
- More concrete examples throughout
- Platform-ready copy-paste files

---

## [2.0.0] - 2026-01-27

### Added
- Initial v2 release based on Karpathy's Claude Code observations
- Core documents:
  - `global_rules.md`
  - `ai_model_contract.md`
  - `project_profile.md`
  - `task_template.md`
  - `agent_loop.md`
  - `quality_control.md`
- Stack guides:
  - `stack_frontend.md`
  - `stack_backend.md`
  - `stack_db.md`
  - `stack_python.md`
  - `stack_rust.md`
- Supporting documents:
  - `code_review_rubric.md`
  - `context_management.md`
  - `prompt_patterns.md`
  - `security_privacy.md`
  - `tool_integration.md`
  - `team_workflows.md`
  - `incident_response.md`
  - `evaluation_benchmarks.md`
  - `report.md`

---

## [1.0.0] - Initial

### Added
- Basic rules for AI coding assistants
- Simple prompt templates
- Initial stack guidelines
