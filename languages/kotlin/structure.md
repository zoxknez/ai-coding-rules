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

## Notes

- Gradle Kotlin/JVM projects commonly follow the Maven src/main and src/test layout.

## Sources

- Maven standard directory layout. https://maven.apache.org/guides/introduction/introduction-to-the-standard-directory-layout.html
