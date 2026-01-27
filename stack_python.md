# Python Stack Guidelines (Scripts, APIs, Data Science) (v2)

## Structure
- Keep I/O at the edges, logic in pure functions.
- Small modules; avoid “one giant script”.

## Typing & quality
- Use type hints for public functions.
- Prefer `ruff`/`black` for formatting/linting.
- Use `pytest` for tests.

## Data handling
- Validate external inputs (files, env, network).
- Prefer deterministic behavior: fixed seeds when needed.

## Performance
- First write the correct naive version.
- Optimize only after correctness:
  - vectorize with numpy/pandas when appropriate
  - avoid premature micro-optimizations

## Async/concurrency
- Use `asyncio` only if the project already does.
- For parallel CPU work, consider multiprocessing (carefully).

## Packaging
- Use virtual environments.
- Pin versions (`requirements.txt`, `poetry.lock`).
- Avoid global installs.

## Security
- Never commit secrets.
- Validate file paths / user inputs to avoid injection.
