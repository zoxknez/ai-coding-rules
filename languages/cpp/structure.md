# C++ Structure

> CMake layout with include and src boundaries.

## Canonical Layout

```text
project/
├─ CMakeLists.txt
├─ README.md
├─ include/
│  └─ project_name/
├─ src/
├─ tests/
├─ examples/
└─ scripts/
```

## Notes

- include and src are common conventions, but C++ projects can use other layouts.
- Keep build outputs out of the source tree.

## Sources

- CMake tutorial (project configuration and build workflow). https://cmake.org/cmake/help/latest/guide/tutorial/index.html
