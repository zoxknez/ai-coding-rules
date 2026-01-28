# Mobile Stack Guidelines (iOS & Android) (v1)

> **Security-first patterns for mobile agentic development**
>
> Mobile apps run on hostile devices. Agents must prioritize secure storage and intent handling.

---

## iOS (Swift)

### Project Structure

```
App/
├── App.swift               # Entry point
├── Features/
│   ├── Auth/
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Services/
│   └── Dashboard/
├── Core/
│   ├── Networking/
│   ├── Storage/
│   └── Security/
├── Shared/
│   ├── Components/
│   └── Extensions/
└── Resources/
```

---

### 🔴 CRITICAL: Keychain vs. UserDefaults

**The #1 mobile security vulnerability agents create:**

```swift
// ❌ WRONG: Sensitive data in UserDefaults
// UserDefaults is an UNENCRYPTED plist file
// Trivially readable on jailbroken devices or via backups
UserDefaults.standard.set(authToken, forKey: "auth_token")
UserDefaults.standard.set(userId, forKey: "user_id")
UserDefaults.standard.set(creditCard, forKey: "card_number")  // ❌ CRITICAL
```

**Why agents do this:** Writing to UserDefaults is one line. Keychain requires complex C-API calls.

```swift
// ✅ CORRECT: Use Keychain for sensitive data
import Security

class KeychainService {
    static func save(key: String, data: Data) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]
        
        SecItemDelete(query as CFDictionary)  // Remove existing
        let status = SecItemAdd(query as CFDictionary, nil)
        return status == errSecSuccess
    }
    
    static func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        return status == errSecSuccess ? result as? Data : nil
    }
    
    static func delete(key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]
        return SecItemDelete(query as CFDictionary) == errSecSuccess
    }
}

// Usage
if let tokenData = authToken.data(using: .utf8) {
    KeychainService.save(key: "auth_token", data: tokenData)
}
```

### Keychain Wrapper Libraries

For production, use established wrappers:

```swift
// KeychainAccess library
import KeychainAccess

let keychain = Keychain(service: "com.yourapp.credentials")
    .accessibility(.whenUnlockedThisDeviceOnly)

// Store
try keychain.set(authToken, key: "auth_token")

// Retrieve
let token = try keychain.get("auth_token")
```

---

### Network Security

```swift
// ✅ REQUIRED: Certificate pinning
class NetworkManager: NSObject, URLSessionDelegate {
    func urlSession(
        _ session: URLSession,
        didReceive challenge: URLAuthenticationChallenge,
        completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void
    ) {
        guard let serverTrust = challenge.protectionSpace.serverTrust,
              let certificate = SecTrustGetCertificateAtIndex(serverTrust, 0) else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        
        // Compare with pinned certificate
        let serverCertData = SecCertificateCopyData(certificate) as Data
        if serverCertData == pinnedCertificateData {
            completionHandler(.useCredential, URLCredential(trust: serverTrust))
        } else {
            completionHandler(.cancelAuthenticationChallenge, nil)
        }
    }
}
```

### SwiftLint Configuration

```yaml
# .swiftlint.yml
disabled_rules:
  - line_length

opt_in_rules:
  - force_unwrapping  # Prevent !
  - implicitly_unwrapped_optional

custom_rules:
  user_defaults_sensitive:
    name: "UserDefaults Sensitive Data"
    regex: 'UserDefaults.*\.(set|string|data).*(?:token|password|secret|key|auth)'
    message: "Use Keychain for sensitive data, not UserDefaults"
    severity: error
```

---

## Android (Kotlin)

### Project Structure

```
app/src/main/
├── java/com/yourapp/
│   ├── di/                 # Dependency injection
│   ├── data/
│   │   ├── local/          # Room, SharedPreferences
│   │   ├── remote/         # Retrofit, API
│   │   └── repository/
│   ├── domain/
│   │   ├── model/
│   │   └── usecase/
│   └── presentation/
│       ├── ui/
│       └── viewmodel/
└── res/
```

---

### 🔴 CRITICAL: Intent Hijacking

**Implicit intents can be intercepted by malicious apps:**

```kotlin
// ❌ WRONG: Implicit intent with sensitive data
val intent = Intent("com.app.ACTION_VIEW")
intent.putExtra("user_token", authToken)  // ❌ Any app can receive this!
startActivity(intent)

// ❌ WRONG: Implicit intent for file sharing
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "application/pdf"
    putExtra(Intent.EXTRA_STREAM, sensitiveFileUri)
}
startActivity(intent)  // Any app can claim this intent
```

```kotlin
// ✅ CORRECT: Explicit intent with package restriction
val intent = Intent("com.app.ACTION_VIEW").apply {
    setPackage("com.yourapp.trustedapp")  // Restrict to specific app
    putExtra("user_token", authToken)
}
startActivity(intent)

// ✅ CORRECT: Use FileProvider for secure file sharing
val intent = Intent(Intent.ACTION_SEND).apply {
    type = "application/pdf"
    putExtra(Intent.EXTRA_STREAM, FileProvider.getUriForFile(
        context,
        "${context.packageName}.fileprovider",
        file
    ))
    flags = Intent.FLAG_GRANT_READ_URI_PERMISSION
    setPackage("com.trustedapp.receiver")
}
startActivity(intent)
```

---

### 🔴 CRITICAL: WebView JavaScript Interface (RCE)

**The most dangerous API agents use without understanding:**

```kotlin
// ❌ EXTREMELY DANGEROUS: JavaScript bridge
webView.settings.javaScriptEnabled = true
webView.addJavascriptInterface(object {
    @JavascriptInterface
    fun getAuthToken(): String = authToken  // ❌ Any JS can call this!
    
    @JavascriptInterface
    fun executeCommand(cmd: String) {  // ❌ RCE if WebView loads attacker content
        Runtime.getRuntime().exec(cmd)
    }
}, "Android")

// Then loading untrusted content:
webView.loadUrl(untrustedUrl)  // Game over
```

**Attack:** Attacker injects JS that calls `Android.getAuthToken()` or worse.

```kotlin
// ✅ SAFE: Only for strictly controlled local content
class SafeWebInterface(private val callback: (String) -> Unit) {
    @JavascriptInterface
    fun onMessage(message: String) {
        // Only accept specific message types
        if (message.startsWith("navigation:")) {
            callback(message)
        }
    }
}

// Only load trusted local content
webView.loadUrl("file:///android_asset/app.html")
webView.addJavascriptInterface(SafeWebInterface { msg ->
    // Handle in controlled way
}, "SafeBridge")

// ✅ BETTER: Use postMessage API instead
webView.evaluateJavascript("window.postMessage('$safeData', '*')") { }
```

---

### Secure Storage

```kotlin
// ✅ CORRECT: EncryptedSharedPreferences for sensitive data
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val securePrefs = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

// Store securely
securePrefs.edit().putString("auth_token", token).apply()

// Retrieve
val token = securePrefs.getString("auth_token", null)
```

### Network Security Config

```xml
<!-- res/xml/network_security_config.xml -->
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <!-- Disable cleartext traffic -->
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- Certificate pinning for your API -->
    <domain-config>
        <domain includeSubdomains="true">api.yourapp.com</domain>
        <pin-set>
            <pin digest="SHA-256">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=</pin>
            <!-- Backup pin -->
            <pin digest="SHA-256">BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB=</pin>
        </pin-set>
    </domain-config>
</network-security-config>
```

---

## Cross-Platform Security Checklist

| Check | iOS | Android |
|-------|-----|---------|
| Sensitive data storage | Keychain | EncryptedSharedPreferences |
| Token storage | Keychain | Android Keystore |
| Network pinning | URLSession delegate | network_security_config.xml |
| Biometric auth | LocalAuthentication | BiometricPrompt |
| Deep links | Universal Links | App Links with verification |
| IPC | App Groups (limited) | Explicit intents only |

---

## Agent Instructions

```markdown
When generating mobile code:

iOS:
1. NEVER store sensitive data in UserDefaults
2. ALWAYS use Keychain for tokens/credentials
3. Use Keychain Accessibility appropriately
4. Implement certificate pinning for API calls

Android:
1. NEVER use addJavascriptInterface with untrusted content
2. ALWAYS use explicit intents with setPackage()
3. Use EncryptedSharedPreferences for sensitive data
4. Configure network_security_config.xml
5. Use FileProvider for file sharing
```

---

*Version: 1.0.0*
