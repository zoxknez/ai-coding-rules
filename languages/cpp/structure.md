# C++ Structure

> Modern C++ with include and src boundaries.

## Canonical Layout

```text
project-root/
├── include/
│   └── project/
│       └── api.hpp
├── src/
│   ├── main.cpp
│   └── lib.cpp
├── tests/
│   └── test_lib.cpp
├── build/
├── CMakeLists.txt
└── tools/
```

## Agent Workflow

1. Define public interfaces in include/project.
2. Implement logic in src/.
3. Write tests in tests/.
4. Keep build output in build/.

## Boundary Rules

- Headers must not include private implementation details.
- Prefer composition over inheritance by default.
- No global mutable state.
