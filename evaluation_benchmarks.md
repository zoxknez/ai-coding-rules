# Evaluation & Benchmarks for AI Coding Assistants (v2)

## What to measure
- Correctness (test pass rate)
- Diff size (lines/files changed)
- Time to first working solution
- Regression rate post-merge
- Overengineering score (new files/deps/abstractions)

## Simple scoring model (0–100)
- 40: tests pass + correct behavior
- 20: minimal diff
- 15: simplicity (no unnecessary abstractions)
- 15: security & validation
- 10: clarity (summary + verify steps)

## Dataset ideas (your repo)
- 10 real bugs with repro steps
- 10 feature tasks with acceptance criteria
- 5 performance fixes
- 5 refactor tasks (scoped)

## How to iterate
- When model fails, update:
  - prompts
  - project profile
  - lint/test coverage
