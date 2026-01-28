---
applyTo: "**/*.py"
---

Follow MASTER_RULES.md.

Python rules:
- Use type hints for function signatures.
- Prefer dataclasses or Pydantic for data structures.
- Use `with` statements for resource management.
- Prefer list/dict/set comprehensions over loops when readable.
- Use `pathlib.Path` over `os.path`.
- Prefer `f-strings` over `.format()` or `%`.
- Handle exceptions specifically (avoid bare `except:`).
- Use virtual environments (venv, poetry, uv).
- Follow PEP 8 naming: snake_case for functions/variables, PascalCase for classes.
- Use `logging` module, not `print()` for production code.
- Prefer `asyncio` for I/O-bound concurrency.
