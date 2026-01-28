# Deep Analysis: "Claude Code" Notes & Blueprint for Smarter AI Coding Assistants (v3)

Based on Karpathy's observations (January 2026) and production experience.

---

## The Phase Shift

Work is transitioning from **manual typing** to **describing goals in natural language**, while AI performs large "code actions."

The main benefit is speed AND scope expansion — tasks that weren't worth doing before are now viable.

---

## New Failure Modes (More Important Than Syntax)

1. **Wrong Assumptions**: AI concludes on your behalf and continues without verification.

2. **Subtle Conceptual Errors**: Works "on the surface" but violates edge cases, auth, transactions, cache, idempotency.

3. **Poor Confusion Management**: Doesn't ask, doesn't highlight contradictions, doesn't offer tradeoffs.

4. **Overengineering**: Too many abstractions, layers, files without real need.

5. **Side Effects**: Changes/removes comments and code outside scope.

6. **Doesn't Clean Up**: Dead code, unused imports, duplicates.

---

## What AI Does Exceptionally Well

- **Tenacity**: Can iterate until success criteria are met.
- **Test Loop**: Test-first → implement → fix until tests pass.
- **Declarative Goals**: Works best when given "what is success" rather than "exactly what to click and type."

---

## Highest ROI Rules (Summary)

1. Assumptions ledger + 1–3 questions before code when unclear
2. Minimal diff + no drive-by refactors
3. Complexity budget (anti-bloat)
4. Plan → Patch → Verify → Explain
5. Naive correct first, then optimize while preserving correctness

---

## Stack Structure for Working with AI

```
1. GLOBAL RULES (always)
   ↓
2. PROJECT PROFILE (repo truths: conventions, folders, restrictions)
   ↓
3. TASK SPEC (goal, success criteria, scope, constraints)
   ↓
4. OUTPUT CONTRACT (plan/diff/verification/risks)
```

---

## Organizational Implications

### Code Review
- Becomes "first line of defense" against AI slop
- Requires stricter discipline for AI-assisted PRs
- Focus on scope, correctness, security

### Team Roles
- **Senior value increases** in architecture and decision-making
- **Juniors progress faster** with AI assistance
- **Biggest advantage** goes to those who can articulate clear success criteria

### Process Changes
- Smaller PRs, faster review cycles
- Feature flags for risky changes
- "Prompt cookbook" for team knowledge sharing
- "Mistake log" for repeated AI failure patterns

---

## Leverage Patterns That Work

### 1. Test-First Loop
```
1. Write failing test
2. Implement until green
3. Refactor, tests stay green
```

### 2. Declarative Goals
```
Goal: X works
Success criteria: [list]
Loop until met
```

### 3. Naive → Correct → Optimize
```
1. Simplest correct solution
2. Add tests
3. Optimize (tests must stay green)
```

### 4. Bounded Iteration
```
Max 5 iterations
If still failing, escalate
```

---

## Key Metrics to Track

| Metric | Target | Red Flag |
|--------|--------|----------|
| Iterations to success | <5 | >10 |
| Files changed per task | <3 | >5 |
| LOC per change | <200 | >400 |
| Regressions post-merge | 0 | Any |
| New dependencies | 0 | Any without approval |

---

## Arhitektura i optimizacija sistema pravila (premium dodatak)

### Executive Summary (za 90 sekundi)
Savršen sistem pravila nije „fajl sa savetima“, već **dinamički operativni sloj** za AI agente. Optimalna forma je modularna, uslovno aktivirana i duboko usklađena sa tehnološkim stekom, bezbednošću i procesima tima. Rezultat je: manje šuma u kontekstu, veća preciznost i stabilniji output.

### A) Evolucija: monolitna → modularna pravila
- Migracija sa legacy `.cursorrules` na `.cursor/rules/*.mdc`.
- Uslovna aktivacija preko `globs` smanjuje kontekstni „noise“ i povećava tačnost.
- Frontmatter metapodaci omogućavaju automatizovanu selekciju pravila po domenu.

**Preporuka:** kompletan prelazak na `.mdc` i mapiranje pravila na realne putanje/folder logiku.

### B) Inženjering metapodataka (pravila koja „pogađaju“ kontekst)
**Gold standard za `description`:** kratko, aktivno, sa prefiksom **USE WHEN**.
Primeri:
- **USE WHEN:** kreiraš/menjaš React UI komponente.
- **USE WHEN:** dodaješ DB migracije ili menjaš šemu.
- **USE WHEN:** pišeš testove ili refaktorišeš kritične module.

**Zašto radi:** Agent odlučuje koje pravilo da aktivira, pa opis mora biti kognitivni „okidač“.

### C) Tehnološki specifična pravila (preciznost, ne generičnost)
**Python / FastAPI**
- Obavezni Pydantic v2 modeli (bez „sirovih“ dict-ova).
- `async def` za I/O operacije + preferenca `asyncpg` u DB sloju.

**TypeScript / React**
- Zabraniti `any`; preferirati `interface` gde je prikladno.
- Isključivo funkcionalne komponente + hooks.
- Preferirati named exports; jasne konvencije imenovanja direktorijuma.

**Ruby / DragonRuby**
- Ruby Style Guide kao baseline.
- Idiomatske konstrukcije (`unless`, `||=`, `&.`).
- Snake_case fajlovi/metode, CamelCase klase/module.

### D) MCP kao dinamički kontekst (AI „sense layer“)
Pravila moraju eksplicitno reći **kada** i **kako** se koriste MCP serveri.
Primer: „Pre implementacije nove funkcionalnosti, preuzmi zahtev iz Jira i proveri aktivne PR-ove preko GitHub MCP.”

### E) Optimizacija po modelu
- **Claude 3.5 Sonnet:** detaljnije instrukcije, viši nivo „reasoning“ strukture.
- **GPT-4o:** konciznije instrukcije, fokus na performanse i few-shot primere.

### F) Smanjenje halucinacija i korektnost
- Nema preambule, nema „učtivih“ viškova.
- Ako postoji neizvesnost: agent traži potvrdu pre implementacije.
- Zabranjeni „drive‑by refactor“-i.

### G) TDD + Guard Clauses (stil koji smanjuje greške)
- Test-first kao standardni tok.
- Guard clauses i early returns radi smanjenja nesting-a.

$$\text{Efikasnost} = \frac{\text{Broj asinhronih poziva}}{\text{Ukupan broj mrežnih poziva}} \times 100$$

### H) Bezbednost i privatnost (obavezni stub)
- Zabranjeno hardkodiranje tajni; koristiti env varijable/secret manager.
- Zabranjeno logovanje PII.
- Validacija inputa obavezna (Zod / Pydantic).

### I) „Memory Bank“ i dugoročni kontekst
- Uvesti `MEMORY_BANK.md` i/ili `AGENTS.md` kao jedinstveni izvor istine.
- Nakon svake završene promene: ažurirati odluke i naučene lekcije.

### J) Standardizacija među alatima (kanonski izvor istine)
- Jedan kanonski fajl (npr. `prompts/vibe-coding-instructions.md`).
- Sinhronizacija prema `.cursorrules`, `CLAUDE.md`, `.clinerules`, `.windsurfrules`.

### K) Upravljački model + CI integracije
- Definisati „Rule Steward“ za review/validaciju.
- Pravila postaju deo CI-a: lint/format/test pipeline blokira odstupanja.

---

### Premium šablon za `.mdc` pravilo
```
---
description: "USE WHEN: ..."
globs: ["path/pattern/**"]
alwaysApply: false
priority: 50
---

# Rule Title

## Do
- ...

## Don't
- ...

## Examples
- ✅ ...
- ❌ ...
```

### Premium kontrolna lista pre commita
1. Da li su aktivirana samo relevantna pravila?
2. Da li postoji test koji potvrđuje novu logiku?
3. Da li su izbegnute nebitne promene (minimal diff)?
4. Da li su svi eksterni ulazi validirani?
5. Da li su tajne/PII zaštićeni?

### Premium roadmap (4 iteracije)
1. **Migracija na `.mdc`** + mapiranje `globs`.
2. **Tehnološki specifična pravila** (Python/TS/Ruby).
3. **MCP integracije** + zaštitne politike.
4. **CI enforcement** + rule governance.

---

## Conclusion

AI is a powerful multiplier, but requires strict rules:
- Minimal diff
- Explicit assumptions
- Tests
- Quality gates

**The winning formula:**
- AI handles: stamina + implementation
- Human handles: goal + review + architecture

---

*"The intelligence part is ahead of integrations and workflows. 2026 is metabolizing the new capability."* — Karpathy
