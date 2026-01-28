# Contributing to AI Coding Rules

First off, thank you for considering contributing! 🎉

This project exists because of people like you who want to make AI-assisted coding better for everyone.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Enhancements](#suggesting-enhancements)
- [Pull Requests](#pull-requests)
- [Style Guide](#style-guide)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to a welcoming, inclusive environment. Please be respectful and constructive in all interactions.

---

## How Can I Contribute?

### 🐛 Reporting Bugs

Found a typo, broken link, or incorrect information?

1. **Check existing issues** — maybe it's already reported
2. **Open a new issue** with:
   - Clear title
   - Description of the problem
   - Which file(s) affected
   - Suggested fix (if you have one)

### 💡 Suggesting Enhancements

Have an idea for a new rule, pattern, or improvement?

1. **Open an issue** with `[Enhancement]` in the title
2. Describe:
   - The problem you're solving
   - Your proposed solution
   - Real-world example where it helped

### 🔧 Adding Stack Guides

Want to add a guide for a new technology stack?

We're looking for:
- Go
- Java / Spring
- C# / .NET
- Swift / iOS
- Kotlin / Android
- PHP / Laravel
- Ruby / Rails
- And more!

Use `stack_frontend.md` as a template.

### 🌍 Translations

Help make this accessible in more languages:
- Create a `/translations` folder if it doesn't exist
- Add your translation as `README.{lang}.md`
- Keep formatting consistent

---

## Pull Requests

### Process

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a branch: `git checkout -b feature/my-improvement`
4. **Make** your changes
5. **Commit** with a clear message: `git commit -m 'Add X rule for Y situation'`
6. **Push** to your fork: `git push origin feature/my-improvement`
7. **Open** a Pull Request

### PR Checklist

- [ ] I've read the contributing guidelines
- [ ] My changes are practical and battle-tested
- [ ] I've included concrete examples
- [ ] Formatting is consistent with existing docs
- [ ] I've tested any links I added
- [ ] If I edited instruction files, I synced from `prompts/vibe-coding-instructions.md`

### What Makes a Good PR

✅ **Good:**
- Specific, focused changes
- Clear explanation of why
- Real-world examples
- Consistent formatting

❌ **Avoid:**
- Massive rewrites without discussion
- Purely theoretical rules (not tested)
- Breaking existing formatting
- Adding complexity without clear benefit
- Editing platform instruction files directly without syncing from the canonical prompt

---

## Canonical Instructions (Single Source of Truth)

All platform instruction files are generated from:

- `prompts/vibe-coding-instructions.md`

If you change instructions, update the canonical file and run the sync script:

- Windows (PowerShell): `scripts/sync_instructions.ps1`
- macOS/Linux (Bash): `scripts/sync_instructions.sh`

### Optional: Pre-Commit Guard

Install repo-local git hooks to prevent commits when instructions are out of sync:

- Windows (PowerShell): `scripts/install_git_hooks.ps1`
- macOS/Linux (Bash): `scripts/install_git_hooks.sh`

---

## Style Guide

### Markdown Formatting

```markdown
# H1 for document title only
## H2 for major sections
### H3 for subsections

- Use bullet lists for items
- Keep lines under 100 characters when possible

| Tables | For | Structured |
|--------|-----|-----------|
| Data   | Like | This |

`inline code` for commands, file names, etc.

```language
code blocks for longer examples
```
```

### Writing Style

- **Be concise** — every word should earn its place
- **Be practical** — prefer "do this" over "consider doing"
- **Use examples** — show, don't just tell
- **Be specific** — "~200 LOC" is better than "keep it small"
- **English only** — all docs and rules must be written in English

### Emoji Usage

We use emojis sparingly for visual scanning:
- 🔴 Critical / Must do
- 🟡 Important / Should do
- 🟢 Good to have
- 🔵 Info / Reference
- ⚪ Optional
- ⭐ Highlight
- ⚠️ Warning
- ❌ Don't do
- ✅ Do this

---

## Questions?

Open an issue with `[Question]` in the title. We're happy to help!

---

## Recognition

Contributors will be recognized in the README. Thank you for making AI coding better for everyone! 🙏
