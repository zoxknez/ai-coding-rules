# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
