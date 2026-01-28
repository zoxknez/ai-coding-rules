# C# / .NET Stack Guidelines (v1)

> **Enterprise patterns for agentic development**
>
> .NET's rich ecosystem requires careful guardrails for DI, serialization, and API design.

---

## Project Structure

Follow Clean Architecture with DDD:

```
src/
├── Domain/                 # Pure business logic
│   ├── Entities/
│   ├── ValueObjects/
│   ├── Enums/
│   └── Exceptions/
├── Application/            # Use cases & interfaces
│   ├── Interfaces/
│   ├── DTOs/
│   ├── Services/
│   └── Validators/
├── Infrastructure/         # External concerns
│   ├── Persistence/
│   ├── ExternalServices/
│   └── Identity/
└── WebApi/                 # Presentation
    ├── Controllers/
    ├── Middleware/
    └── Filters/
```

### Dependency Rules

```
WebApi → Application → Domain
Infrastructure → Application
Domain → NOTHING (pure, no dependencies)
```

---

## Dependency Injection

### ❌ Captive Dependency (CRITICAL)

This is the #1 bug agents introduce in .NET code:

```csharp
// ❌ WRONG: Singleton capturing Scoped dependency
services.AddSingleton<UserManager>();  // Lives forever
services.AddScoped<DbContext>();       // Lives per request

public class UserManager
{
    private readonly DbContext _context;  // ❌ Captured!
    
    public UserManager(DbContext context)
    {
        _context = context;  // This DbContext is now immortal
    }
}
```

**Consequences:**
- Database connections exhaust
- Stale data returned
- Memory leaks

### ✅ Correct Pattern

```csharp
// Option 1: Match lifetimes
services.AddScoped<UserManager>();
services.AddScoped<DbContext>();

// Option 2: Use IServiceScopeFactory for Singletons
public class BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    
    public async Task DoWork()
    {
        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DbContext>();
        // Use context within scope
    }
}
```

### DI Lifetime Rules

| Service Type | Default Lifetime | Notes |
|--------------|------------------|-------|
| DbContext | Scoped | Per-request lifecycle |
| Repositories | Scoped | Matches DbContext |
| Business Services | Scoped | Safe default |
| HttpClient | Singleton | Via IHttpClientFactory |
| Configuration | Singleton | Read-only data |
| Loggers | Singleton | Thread-safe |

---

## API Design

### Mass Assignment (Overposting) Prevention

```csharp
// ❌ WRONG: Domain entity in controller
[HttpPost]
public ActionResult Create([FromBody] User user)
{
    // Attacker sends: {"IsAdmin": true, "Email": "attacker@evil.com"}
    _context.Users.Add(user);  // IsAdmin is now true!
}

// ✅ CORRECT: Use DTOs
public record CreateUserDto(string Email, string Password);

[HttpPost]
public ActionResult Create([FromBody] CreateUserDto dto)
{
    var user = new User
    {
        Email = dto.Email,
        PasswordHash = _hasher.Hash(dto.Password),
        IsAdmin = false,  // Explicitly set
        CreatedAt = DateTime.UtcNow
    };
    _context.Users.Add(user);
}
```

### Input Validation

```csharp
// Use FluentValidation
public class CreateUserDtoValidator : AbstractValidator<CreateUserDto>
{
    public CreateUserDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress()
            .MaximumLength(255);
            
        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8)
            .Matches("[A-Z]").WithMessage("Must contain uppercase")
            .Matches("[0-9]").WithMessage("Must contain digit");
    }
}
```

### Error Responses

```csharp
// Consistent error envelope
public record ApiError(string Code, string Message, object? Details = null);

public record ApiResponse<T>(T? Data, ApiError? Error);

// In controller
[HttpGet("{id}")]
public ActionResult<ApiResponse<UserDto>> Get(int id)
{
    var user = _service.GetById(id);
    
    if (user is null)
        return NotFound(new ApiResponse<UserDto>(
            null, 
            new ApiError("USER_NOT_FOUND", $"User {id} not found")));
    
    return Ok(new ApiResponse<UserDto>(user.ToDto(), null));
}
```

---

## XML Parsing (XXE Prevention)

### ❌ Vulnerable Code

```csharp
// XmlDocument with default settings is vulnerable
var doc = new XmlDocument();
doc.LoadXml(untrustedXml);  // ❌ XXE possible
```

### ✅ Safe Code

```csharp
// Option 1: Disable DTD processing
var doc = new XmlDocument();
doc.XmlResolver = null;  // Disable external entities
doc.LoadXml(untrustedXml);

// Option 2: Use XDocument (safe by default)
var doc = XDocument.Parse(untrustedXml);

// Option 3: XmlReader with secure settings
var settings = new XmlReaderSettings
{
    DtdProcessing = DtdProcessing.Prohibit,
    XmlResolver = null
};
using var reader = XmlReader.Create(stream, settings);
```

---

## Async/Await Patterns

### ✅ Required Patterns

```csharp
// Always use async all the way
public async Task<User> GetUserAsync(int id)
{
    return await _context.Users
        .AsNoTracking()
        .FirstOrDefaultAsync(u => u.Id == id);
}

// Always use CancellationToken
public async Task<List<User>> GetUsersAsync(CancellationToken ct)
{
    return await _context.Users
        .ToListAsync(ct);
}

// Use ConfigureAwait(false) in libraries
public async Task<string> FetchDataAsync()
{
    var response = await _client.GetAsync(url).ConfigureAwait(false);
    return await response.Content.ReadAsStringAsync().ConfigureAwait(false);
}
```

### ❌ Antipatterns

```csharp
// Never block on async
var result = GetUserAsync(id).Result;  // ❌ Deadlock risk

// Never use async void (except event handlers)
public async void ProcessData()  // ❌ Exceptions lost
```

---

## Entity Framework

### Query Optimization

```csharp
// Use AsNoTracking for read-only queries
var users = await _context.Users
    .AsNoTracking()
    .Where(u => u.IsActive)
    .ToListAsync();

// Use projections to reduce data transfer
var userNames = await _context.Users
    .Select(u => new { u.Id, u.Name })
    .ToListAsync();

// Avoid N+1 with Include
var orders = await _context.Orders
    .Include(o => o.Items)
    .Include(o => o.Customer)
    .ToListAsync();
```

### Migrations

```csharp
// Always review generated migrations
// Never auto-apply in production

// Use transactions for data migrations
migrationBuilder.Sql(@"
    UPDATE Users SET Status = 'Active' WHERE Status IS NULL;
", suppressTransaction: false);
```

---

## Tooling

### Roslyn Analyzers

```xml
<!-- In .csproj -->
<ItemGroup>
    <PackageReference Include="Microsoft.CodeAnalysis.NetAnalyzers" Version="8.0.0" />
    <PackageReference Include="SecurityCodeScan.VS2019" Version="5.6.7" />
    <PackageReference Include="Meziantou.Analyzer" Version="2.0.0" />
</ItemGroup>
```

### EditorConfig

```ini
# .editorconfig
[*.cs]
# Nullable reference types
dotnet_diagnostic.CS8600.severity = error
dotnet_diagnostic.CS8602.severity = error
dotnet_diagnostic.CS8603.severity = error

# Async best practices
dotnet_diagnostic.CA2007.severity = warning  # ConfigureAwait
dotnet_diagnostic.CA2008.severity = error    # Task.Run without TaskScheduler
```

---

## Agent Instructions

```markdown
When generating C# code:

1. ALWAYS use DTOs at API boundaries, never bind to entities
2. ALWAYS match DI lifetimes (Scoped for DbContext)
3. ALWAYS use XmlResolver = null for XML parsing
4. ALWAYS use async/await with CancellationToken
5. NEVER use .Result or .Wait() on Tasks
6. NEVER expose domain entities in APIs
7. Use FluentValidation for input validation
```

---

*Version: 1.0.0*
