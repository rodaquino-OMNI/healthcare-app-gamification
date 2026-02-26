# AUSTA Mobile App — Security Guide

> Version: 1.0 | Last updated: 2026-02-25
> Audience: Mobile engineers, security reviewers, compliance team

Gaps are called out explicitly — this is not a marketing document.

---

## 1. Secure Storage

### 1.1 Current Implementation (AsyncStorage)

Auth tokens are persisted via `@react-native-async-storage/async-storage`. On Android this is
plaintext SQLite; on iOS it uses NSUserDefaults-backed files.

**Gap — CRITICAL**: Neither storage backend is encrypted. Root/jailbreak access exposes raw
token bytes. See `src/web/mobile/package.json` for the installed dependency.

### 1.2 MMKV Encrypted Storage (Recommended Migration)

`react-native-mmkv` v2.10.1 is installed but not used for tokens. Migrate with a keystore-derived
key — never hardcode the encryption key:

```ts
import { MMKV } from 'react-native-mmkv';
// NOT yet implemented — recommended migration target
const secureStorage = new MMKV({
  id: 'austa-secure',
  encryptionKey: '<key-from-device-keystore>',
});
secureStorage.set('auth.accessToken', token);
```

### 1.3 Sensitive Token Storage

| Data Type | Current Storage | Encrypted | Recommended |
|---|---|---|---|
| JWT access token | AsyncStorage | No | MMKV + keystore key |
| JWT refresh token | AsyncStorage | No | MMKV + keystore key |
| Biometric key | Not persisted | N/A | react-native-keychain |
| User preferences | AsyncStorage | No | AsyncStorage (acceptable) |

**Gap**: `expo-secure-store` and `react-native-keychain` are not installed. One must be added
before launch for hardware-backed credential storage.

---

## 2. Authentication Security

### 2.1 Biometric Authentication

`react-native-biometrics` v2.1.4 is installed and declared as an Expo plugin in
`src/web/mobile/app.json`. Permissions configured:
- **Android**: `USE_BIOMETRIC`, `USE_FINGERPRINT`
- **iOS**: `NSFaceIDUsageDescription` populated

UI scaffolding exists in `src/web/mobile/src/screens/profile/ProfileBiometricSetup.tsx` and
`src/web/mobile/src/screens/settings/BiometricPrefs.tsx`.

**Gap — HIGH**: Both screens contain `TODO` placeholders — native biometric API calls are not
implemented. No key-pair is generated and no biometric-gated token exchange occurs. Remediation:
implement `ReactNativeBiometrics.createKeys()` and `.createSignature()` with server-side
challenge verification.

### 2.2 JWT Token Lifecycle

- `jwt-decode` v3.1.2 for client-side claim extraction only (server verifies signatures).
- JWT expiration is configurable via backend environment variables.
- Refresh token rotation is implemented at the backend; mobile stores the new refresh token on
  each silent renewal.

### 2.3 Account Lockout

Backend enforces account lockout after repeated failures. Password hashing uses bcrypt cost
factor 10 (`src/backend/shared/src/encryption/encryption.service.ts`).

---

## 3. Network Security

### 3.1 SSL Certificate Pinning

File: `src/web/mobile/src/api/ssl-pinning.ts` | Tests: `src/web/mobile/src/api/__tests__/ssl-pinning.spec.ts` (7 cases)

SHA-256 SPKI hash pinning for three domains (2 pins each for rotation):

| Domain | includeSubdomains |
|---|---|
| `api.austa.com.br` | Yes |
| `auth.austa.com.br` | No |
| `cdn.austa.com.br` | Yes |

The Axios interceptor in `src/web/mobile/src/api/client.ts` sets `X-Expected-Pin` for
server-side validation (header-signaling pattern).

**Gap — HIGH**: No native TLS interception (e.g., `react-native-ssl-pinning`). A MitM attacker
can strip or replace the header and bypass the check entirely. True pinning requires intercepting
the TLS handshake at the native layer.

**Gap**: Pin values in `ssl-pinning.ts` are placeholders. Generate before production:

```bash
openssl s_client -connect api.austa.com.br:443 \
  | openssl x509 -pubkey -noout \
  | openssl pkey -pubin -outform der \
  | openssl dgst -sha256 -binary \
  | openssl enc -base64
```

Repeat for all three domains. Backup pins should reference the next CA cert or a spare keypair.

### 3.2 SSRF and CSRF Protection

Implemented in `src/web/mobile/src/api/client.ts`:
- **SSRF**: Domain allowlist + private IP blocking (10.x, 172.16-31.x, 192.168.x, 127.x, ::1),
  HTTPS-only enforcement.
- **CSRF**: `X-CSRF-Token` header on every mutating request.
- **Request identification**: `X-Requested-With: XMLHttpRequest` on all requests.

### 3.3 App Transport Security (iOS)

Configured in `src/web/mobile/app.json`:
- ATS **active** — `NSAllowsArbitraryLoads` not set.
- `ITSAppUsesNonExemptEncryption: false` (OS-provided TLS only).
- Privacy Manifest: `HealthData`, `EmailAddress`, `Name` declared as collected, linked to user,
  not used for tracking.

### 3.4 Network Security Config (Android)

**Gap — MEDIUM**: No `network_security_config.xml`. Android API 28+ default blocks cleartext
(acceptable), but a custom config is required to: declare OS-level certificate pins, exclude
user-installed CA certificates, and serve as prerequisite for native pinning.

```xml
<!-- Recommended: create at android/app/src/main/res/xml/network_security_config.xml -->
<network-security-config>
  <base-config cleartextTrafficPermitted="false">
    <trust-anchors><certificates src="system" /></trust-anchors>
  </base-config>
  <domain-config>
    <domain includeSubdomains="true">austa.com.br</domain>
    <pin-set>
      <pin digest="SHA-256">PLACEHOLDER_PRIMARY_PIN==</pin>
      <pin digest="SHA-256">PLACEHOLDER_BACKUP_PIN==</pin>
    </pin-set>
  </domain-config>
</network-security-config>
```

---

## 4. OWASP MASVS L2 Compliance Checklist

| MASVS Control | Requirement | Status | Implementation / Gap |
|---|---|---|---|
| MASVS-STORAGE-1 | Sensitive data not in plaintext | **Gap** | Tokens in unencrypted AsyncStorage |
| MASVS-STORAGE-2 | No PHI in logs or backups | Partial | Sentry/Crashlytics present; PHI scrubbing not verified |
| MASVS-CRYPTO-1 | AES-256-GCM at rest | Implemented | `src/backend/shared/src/encryption/encryption.service.ts` |
| MASVS-CRYPTO-2 | Cryptographically secure RNG | Implemented | `crypto.randomBytes` for IV generation |
| MASVS-AUTH-1 | Password policy enforced | Implemented | bcrypt cost 10, configurable JWT expiry |
| MASVS-AUTH-2 | Biometric authentication | **Gap** | Scaffolded — native calls not implemented |
| MASVS-AUTH-3 | Session invalidation on logout | Partial | Server-side revocation done; client-side wipe not verified |
| MASVS-NETWORK-1 | TLS 1.2+ enforced | Implemented | iOS ATS active; Android target SDK 34 |
| MASVS-NETWORK-2 | Certificate pinning | **Gap** | Header-signaling only; no native TLS interception |
| MASVS-NETWORK-3 | No sensitive data in URLs | Implemented | Auth tokens in Authorization header only |
| MASVS-PLATFORM-1 | IPC restricted | Implemented | No exported activities beyond defaults |
| MASVS-PLATFORM-2 | WebView hardened | Partial | No WebViews identified; verify if added |
| MASVS-CODE-1 | Code obfuscation (Android) | **Gap** | ProGuard/R8 not configured |
| MASVS-CODE-2 | Debug disabled in release | Partial | EAS production uses AAB; `android:debuggable` not verified |
| MASVS-RESILIENCE-1 | Root/jailbreak detection | Gap | react-native-device-info installed; detection not implemented |
| MASVS-RESILIENCE-2 | Anti-tampering | Gap | No integrity checks; EAS code signing only |

**Summary**: 5 implemented, 5 partial, 6 gaps.
Priority closures before launch: MASVS-STORAGE-1, MASVS-AUTH-2, MASVS-NETWORK-2, MASVS-CODE-1.

---

## 5. PHI Access Logging

### 5.1 @PhiAccess() Decorator

File: `src/backend/shared/src/audit/phi-access.decorator.ts`

```ts
@Get(':id')
@PhiAccess('HealthMetric')
async getMetric(@Param('id') id: string) { ... }
```

`@PhiAccess(resourceType)` stores metadata via `SetMetadata('phi_access', resourceType)`.
The AuditInterceptor reads this to decide whether PHI-level logging applies.

### 5.2 Audit Interceptor

File: `src/backend/shared/src/audit/audit.interceptor.ts`

On each request: extracts `userId` from JWT, maps HTTP method to `AuditAction`
(GET→READ, POST/PUT/PATCH→WRITE, DELETE→DELETE), captures `resourceId`, `ip`, `userAgent`.
PHI-decorated endpoints trigger `auditService.logPHIAccess()` with `phiAccess: true`.

### 5.3 PHI Encryption at Rest

File: `src/backend/shared/src/encryption/encryption.service.ts`
Middleware: `src/backend/shared/src/encryption/prisma-encryption.middleware.ts`

AES-256-GCM, random 16-byte IV per record, key from `crypto.scryptSync(ENCRYPTION_KEY, 'austa-phi-salt', 32)`.
Wire format: `iv:authTag:ciphertext` (hex). Auto-encrypted Prisma fields:

| Model | Fields |
|---|---|
| User | `cpf`, `phone`, `email` |
| HealthMetric | `value`, `notes` |
| HealthGoal | `targetValue`, `currentValue` |
| Claim | `procedureCode`, `amount` |
| Medication | `name`, `notes` |
| Document | `filename` |
| Appointment | `notes` |
| Notification | `body` |
| DeviceConnection | `authToken`, `refreshToken` |

### 5.4 Audit Trail for LGPD

File: `src/backend/shared/src/audit/audit.service.ts`
DTO: `src/backend/shared/src/audit/dto/audit-log.dto.ts`

`AuditAction` enum: `READ`, `WRITE`, `DELETE`, `LOGIN`, `LOGOUT`, `EXPORT`.
`logPHIAccess()` persists to `auditLog` via fire-and-forget (non-blocking). Add alerting on
insertion errors before production — silent failures break LGPD audit trail requirements.

LGPD consent toggles and data deletion UI exist in
`src/web/mobile/src/screens/home/SettingsPrivacy.tsx`.

**Gap**: All controls have `TODO: connect to API` comments. Backend DSR endpoints exist (B2)
but the mobile app has not wired up the calls.

---

## 6. Release Hardening

### 6.1 ProGuard/R8 for Android

**Gap — HIGH**: No `proguard-rules.pro` and `minifyEnabled` is not set. Class/method names are
readable in the APK, dead library code ships, and reverse engineering is significantly easier.

```pro
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class br.com.austa.** { *; }
-keep class expo.modules.** { *; }
```

Enable in `android/app/build.gradle`:
```gradle
buildTypes {
  release {
    minifyEnabled true
    shrinkResources true
    proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
  }
}
```

### 6.2 Hermes Engine

React Native 0.73+ activates Hermes by default. Hermes compiles JS to bytecode (HBC) at build
time — modest obfuscation, faster startup. No explicit override was found in
`src/web/mobile/package.json` so default activation is assumed. Hermes does **not** replace
ProGuard/R8 for native code.

### 6.3 EAS Build Profiles

File: `src/web/mobile/eas.json`

| Profile | Output | Distribution |
|---|---|---|
| `development` | APK (debug) | Internal |
| `preview` | APK | Internal |
| `production` | AAB | Store |

Before each production release verify:
- `android:debuggable="false"` in merged `AndroidManifest.xml`
- No debug flavors in the production AAB
- Sentry source maps uploaded (DSN must come from environment, not hardcoded)
- `ITSAppUsesNonExemptEncryption` declaration matches actual crypto usage

---

*For questions, contact the mobile security working group.*
