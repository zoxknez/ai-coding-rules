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

## Notes

- include and src are common conventions, but C projects can use other layouts.
- build is intended for out-of-source builds.

## Sources

- CMake tutorial (out-of-source builds and CMakeLists.txt usage). https://cmake.org/cmake/help/latest/guide/tutorial/index.html

## Agent Workflow

1. Define public APIs in include/project.
2. Implement logic in src/.
3. Add tests in tests/.
4. Keep build outputs in build/.

## Boundary Rules

- Public headers must not include private headers.
- No logic in headers beyond inline helpers.
- Tests must not depend on build outputs.
