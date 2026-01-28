# C Structure

> Explicit include and src boundaries.

## Canonical Layout

```text
project-root/
├── include/
│   └── project/
│       └── api.h
├── src/
│   ├── main.c
│   └── lib.c
├── tests/
│   └── test_lib.c
├── build/
├── CMakeLists.txt
└── Makefile
```

## Agent Workflow

1. Define public APIs in include/project.
2. Implement logic in src/.
3. Add tests in tests/.
4. Keep build outputs in build/.

## Boundary Rules

- Public headers must not include private headers.
- No logic in headers beyond inline helpers.
- Tests must not depend on build outputs.
