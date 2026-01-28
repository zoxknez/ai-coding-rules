# Kotlin Structure

> JVM layout with explicit layers.

## Canonical Layout

```text
project/
├─ build.gradle.kts
├─ settings.gradle.kts
├─ README.md
├─ src/
│  ├─ main/
│  │  ├─ kotlin/com/example/app/
│  │  │  ├─ Application.kt
│  │  │  ├─ config/
│  │  │  ├─ domain/
│  │  │  ├─ application/
│  │  │  ├─ infrastructure/
│  │  │  └─ api/
│  │  └─ resources/
│  └─ test/
│     ├─ kotlin/
│     └─ resources/
```
