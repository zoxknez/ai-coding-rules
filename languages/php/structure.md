# PHP Structure

> Laravel-style layout with explicit layers.

## Canonical Layout

```text
project/
├─ composer.json
├─ README.md
├─ .env.example
├─ app/
│  ├─ Http/
│  │  ├─ Controllers/
│  │  └─ Middleware/
│  ├─ Models/
│  ├─ Domain/
│  ├─ Application/
│  ├─ Infrastructure/
│  └─ Support/
├─ routes/
├─ config/
├─ database/
├─ tests/
└─ public/
```

## Notes

- Domain and application folders inside app are optional conventions layered on top of Laravel defaults.

## Sources

- Laravel directory structure. https://laravel.com/docs/11.x/structure
