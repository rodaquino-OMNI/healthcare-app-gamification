# 🔍 Comprehensive Dependency & Security Analysis — AUSTA SuperApp

**Date:** 2026-03-09
**Sources:** Renovate Dashboard (#87) · Dependabot Alerts · CodeQL Code Scanning
**Branch:** `main`

---

## Executive Summary

The AUSTA SuperApp monorepo has **6 open security issues** that need attention:

| Source | Severity | Count | Status |
|--------|----------|-------|--------|
| Dependabot | 🔴 Critical | 1 | Open — `next` in `src/web/yarn.lock` |
| Dependabot | 🟠 High | 2 | Open — `next` in `src/web/yarn.lock` |
| Dependabot | 🟡 Medium | 2 | Open — `next` + `esbuild` |
| CodeQL | 🟠 High | 1 | Open — XSS in photo-upload.tsx |
| Renovate | ⚠️ Blocker | 1 | `zod` override conflict blocks ALL Renovate PRs |

**Root cause for Renovate failures:** A `zod` resolution override (`3.25.76`) in `src/web/package.json` conflicts with Renovate's artifact updates, causing `npm error code EOVERRIDE` on every PR. This is the #1 issue to fix.

---

## 1. BLOCKER — Zod Override Conflict (Blocks All Renovate PRs)

### Problem

Every Renovate PR fails artifact update with:
```
npm error code EOVERRIDE
Override for zod@^3.25.76 conflicts with direct dependency
```

This occurs because `src/web/package.json` has:
- **Direct dependency:** `"zod": "3.25.76"` (pinned, no caret)
- **Override:** `"zod": "3.25.76"` (pinned)
- **Resolution:** `"zod": "3.25.76"` (pinned)

When Renovate updates _any_ package that has a transitive `zod` dependency with a range like `^3.x`, npm's override engine sees the pinned `3.25.76` as conflicting with the `^3.25.76` range in sub-packages.

### Fix (Safe — no behavior change)

Align the `overrides` and `resolutions` to use the **caret range** `^3.25.76` instead of the pinned `3.25.76`, or better — change the direct dependency to also use `^3.25.76`. Since all sub-packages already declare `"zod": "^3.25.76"`, this just removes the artificial constraint.

**Files to change:**
- `src/web/package.json` — `dependencies.zod`: `"3.25.76"` → `"^3.25.76"`
- `src/web/package.json` — `overrides.zod`: `"3.25.76"` → `"^3.25.76"`
- `src/web/package.json` — `resolutions.zod`: `"3.25.76"` → `"^3.25.76"`
- `package.json` (root) — `resolutions.zod`: `"3.25.76"` → `"^3.25.76"`

**Risk:** ✅ Zero — zod follows semver; `^3.25.76` allows only `3.x` patches.

---

## 2. CRITICAL — Stale `src/web/yarn.lock` (4 Open Dependabot Alerts)

### Problem

The `src/web/yarn.lock` locks `next@15.4.7` but `package.json` specifies `15.4.11`. The lockfile was never regenerated after the version bump, so the **actual installed version remains 15.4.7**, which is vulnerable to:

| CVE | Severity | Impact | Fixed in |
|-----|----------|--------|----------|
| CVE-2025-55182 | 🔴 **Critical (10.0)** | RCE via React Flight protocol | 15.4.8 |
| CVE-2025-55184 | 🟠 High | DoS via Server Components deserialization | 15.4.8 |
| CVE-2025-55183 | 🟡 Medium (5.3) | Server Actions source code exposure | 15.4.8 |
| CVE-2026-23864 | 🟠 High | DoS via crafted HTTP to App Router | 15.4.11 |

**The `package.json` already points to `15.4.11`** — the fix is just regenerating the lockfile.

### Fix

```bash
cd src/web && yarn install --force
```

Then verify `yarn.lock` resolves `next@15.4.11` and commit.

**Risk:** ✅ Minimal — same version already declared in package.json; the lockfile just needs to catch up.

---

## 3. HIGH — CodeQL Alert #5: XSS via DOM Text Reinterpretation

### Problem

**File:** `src/web/web/src/pages/care/symptom-checker/photo-upload.tsx`
**Line:** 114 (`src={src}`)
**Rule:** `js/xss-through-dom` (CWE-79, CWE-116)

CodeQL flags that the `src` attribute of the `<img>` tag receives a value from `URL.createObjectURL(file)`. While `createObjectURL` returns a `blob:` URL (which is inherently safe for `<img src>`), the CodeQL analysis follows the data flow from the user-controlled `File` object through `previews` state to the DOM. The concern is that if the code pattern were ever changed (e.g., reading file content as text and injecting it), it could become exploitable.

**Current risk assessment:** The actual runtime value is always a `blob:` URL — **no real XSS vector exists today**. However, the pattern should be hardened to satisfy static analysis and prevent future regressions.

### Fix

Add an explicit validation that the preview URL is a safe blob URL before rendering:

```tsx
// Before the img tag, add a sanitization guard:
const isSafeSrc = (url: string): boolean =>
    url.startsWith('blob:') || url.startsWith('data:image/');

// In the render:
{previews.filter(isSafeSrc).map((src, index) => (
    // ... existing img tag
))}
```

Or use a Content Security Policy (CSP) directive to restrict `img-src` to `blob:` and `self`.

**Risk:** ✅ Zero — purely additive validation.

---

## 4. MEDIUM — esbuild Vulnerability (Dev-Only)

### Problem

**Dependabot Alert #464/#465:** `esbuild` enables any website to send requests to the development server.
- **Package:** `esbuild`
- **Patched in:** `0.25.0`
- **Lockfile state:** `esbuild@^0.21.3` resolves to `0.21.5` (vulnerable), but the wider range already resolves to `0.25.12` (patched).

This is a **development-only** vulnerability — esbuild's dev server is only exposed during local development and not in production builds.

### Fix

The `src/web/package.json` `resolutions` already includes `"esbuild": "0.25.0"`. The lockfile regeneration from Step 2 should also pick up the correct esbuild version. Verify after lockfile regen that `esbuild@0.21.5` is no longer present.

**Risk:** ✅ Zero — dev-only dependency.

---

## 5. Renovate Dashboard — PR Triage

### Already Handled (Closed)

| PR | Decision | Reason |
|----|----------|--------|
| #92 — Next.js → v16 [SECURITY] | ✅ Closed | Already patched at 15.4.11; v16 is a breaking major |
| #84 — webpack → 5.104.1 [SECURITY] | ✅ Closed | Superseded by #88 consolidated fix |
| #93 — actions/checkout → v6 | ✅ Merged | Safe GHA update |
| #94 — cp-kafka → v8 | ✅ Closed | Deferred to infra sprint |
| #95 — @apollo/client → v4 | ✅ Closed | Deferred to frontend sprint |

### Remaining Issue — `renovate-runner.yml` still on checkout v4

```yaml
# .github/workflows/renovate-runner.yml line 30
uses: actions/checkout@v4  # Should be @v6
```

All other workflows are already on `@v6`. This is a simple fix.

---

## 6. Deprecated Packages (Renovate Dashboard Warning)

| Package | Status | Replacement |
|---------|--------|-------------|
| `@testing-library/jest-native` | Deprecated | Use `@testing-library/react-native` (already installed) |
| `agora-rtc-sdk` | Deprecated | Use `agora-rtc-sdk-ng` (already installed alongside) |
| `lodash.get` | Deprecated | Use `lodash/get` or optional chaining (`?.`) |
| `sudo-prompt` | Deprecated | Already overridden to `sudo-block` in overrides |

**Priority:** Low — these are functional but should be migrated in a cleanup sprint.

---

## 7. Pending/Rate-Limited Renovate Updates (Awaiting Schedule)

### Security Patches Group (Awaiting Schedule)

This is a large grouped PR with ~40+ packages. Key entries:

| Package | Type | Notes |
|---------|------|-------|
| `express`, `body-parser`, `cookie` | Security patch | Backend HTTP stack |
| `fastify`, `hono`, `@hono/node-server` | Security patch | Backend API frameworks |
| `fast-xml-parser`, `node-forge` | Security patch | Crypto/parsing |
| `postcss`, `webpack`, `rollup` | Security patch | Build tooling |
| `react-router-dom`, `formik`, `i18next` | Security patch | Frontend libs |
| Docker: `confluentinc/cp-kafka`, `confluentinc/cp-zookeeper` | Patch | Infra images |

Once the zod blocker is resolved, this PR will be created automatically on schedule.

### Rate-Limited Major Bumps

These are all **major version bumps** — each needs its own migration plan:

| Package | Current → Target | Effort | Priority |
|---------|-----------------|--------|----------|
| `@apollo/server` → v5 | v4 → v5 | 🟡 Medium | Defer |
| `@apollo/client` → v4 | v3 → v4 | 🔴 High | Defer (GraphQL layer rewrite) |
| `@nestjs/axios` → v4 | v3 → v4 | 🟢 Low | Next backend sprint |
| `@nestjs/config` → v4 | v3 → v4 | 🟢 Low | Next backend sprint |
| `@nestjs/event-emitter` → v3 | v2 → v3 | 🟢 Low | Next backend sprint |
| `@nestjs/schedule` → v6 | v4 → v6 | 🟡 Medium | Next backend sprint |
| `@nestjs/throttler` → v6 | v5 → v6 | 🟡 Medium | Next backend sprint |
| `@hookform/resolvers` → v5 | v3 → v5 | 🟡 Medium | Defer |
| `@faker-js/faker` → v10 | v8 → v10 | 🟢 Low (dev) | Anytime |
| `@datadog/browser-rum` → v6 | v5 → v6 | 🟡 Medium | Observability sprint |
| `@expo/vector-icons` → v15 | v14 → v15 | 🟡 Medium | Mobile sprint |
| `@react-native-async-storage` → v3 | v1 → v3 | 🟡 Medium | Mobile sprint |
| `@react-native-community/netinfo` → v12 | v11 → v12 | 🟢 Low | Mobile sprint |

### Pending Status Checks

| Item | Current → Target | Notes |
|------|-----------------|-------|
| `@rollup/plugin-babel` → v7 | v6 → v7 | Build tooling |
| `@rollup/plugin-terser` → v1 | v0 → v1 | Build tooling |
| `docker/build-push-action` → v7 | v6 → v7 | CI/CD |
| `docker/login-action` → v4 | v3 → v4 | CI/CD |
| `docker/setup-buildx-action` → v4 | v3 → v4 | CI/CD |
| Terraform AWS → v6 | v5 → v6 | ⚠️ Major infra — needs careful planning |

### Lookup Failure

Renovate cannot resolve `com.facebook.react:react-native-gradle-plugin` from `src/web/mobile/android/build.gradle`. This is expected — the React Native Gradle plugin is distributed via the RN repo, not Maven Central. Add to `ignoreDeps` in `renovate.json`.

---

## 8. Terraform Provider Version Inconsistency

Current state across modules:

| Module | AWS Provider Version |
|--------|---------------------|
| `providers.tf` (root) | `~> 5.0` |
| `modules/eks/main.tf` | `~> 5.0` |
| `modules/rds/main.tf` | `~> 4.0` ⚠️ |
| `modules/network/main.tf` | `>= 5.0.0` |
| `environments/production` | `~> 4.0` ⚠️ |
| `environments/staging` | `~> 4.0` ⚠️ |

The `rds`, `production`, and `staging` modules still reference AWS provider `~> 4.0` while root and EKS use `~> 5.0`. Renovate's pending "Terraform aws to v6" would be a second major jump for these modules. **Standardize on `~> 5.0` first before considering v6.**

---

## Prioritized Action Plan

### 🔴 Phase 1 — Immediate (Today)

These are safe, non-breaking fixes:

| # | Action | Risk | Impact |
|---|--------|------|--------|
| 1 | **Fix zod override conflict** — change pinned `3.25.76` to `^3.25.76` in overrides/resolutions | Zero | Unblocks ALL Renovate PRs |
| 2 | **Regenerate `src/web/yarn.lock`** — `cd src/web && yarn install --force` | Minimal | Resolves 4 Dependabot alerts (1 Critical, 2 High, 1 Medium) |
| 3 | **Fix CodeQL alert #5** — add `blob:` URL validation in photo-upload.tsx | Zero | Closes CodeQL high-severity alert |
| 4 | **Update `renovate-runner.yml`** — `actions/checkout@v4` → `@v6` | Zero | Consistency with all other workflows |
| 5 | **Add `react-native-gradle-plugin` to `ignoreDeps`** in renovate.json | Zero | Eliminates Renovate lookup failure warning |

### 🟡 Phase 2 — This Week (After Phase 1)

| # | Action | Risk | Impact |
|---|--------|------|--------|
| 6 | Let Renovate create the **security patches group PR** (will auto-create once zod blocker is fixed) | Low | Patches ~40 packages |
| 7 | Merge pending **Docker action updates** (build-push v7, login v4, buildx v4) | Low | CI/CD modernization |
| 8 | Merge pending **Rollup plugin updates** | Low | Build tooling |
| 9 | Remove `@testing-library/jest-native` — migrate to `@testing-library/react-native` | Low | Removes deprecated dep |

### 🟢 Phase 3 — Next Sprint (Planned)

| # | Action | Risk | Impact |
|---|--------|------|--------|
| 10 | **NestJS ecosystem upgrades** — @nestjs/axios v4, config v4, event-emitter v3, schedule v6, throttler v6 | Medium | Backend modernization |
| 11 | **Standardize Terraform AWS provider** to `~> 5.0` across all modules | Medium | Infra consistency |
| 12 | Replace `lodash.get` with native optional chaining | Low | Remove deprecated package |
| 13 | Plan `agora-rtc-sdk` → `agora-rtc-sdk-ng` full migration | Medium | Remove deprecated SDK |

### 🔵 Phase 4 — Future (Dedicated Sprints)

| # | Action | Risk | Impact |
|---|--------|------|--------|
| 14 | **@apollo/client v3 → v4** migration | High | Full GraphQL layer rewrite |
| 15 | **Next.js 15 → 16** migration | High | Major framework upgrade |
| 16 | **Kafka cp-kafka 7.x → 8.x** | High | Infra protocol changes |
| 17 | **Terraform AWS v5 → v6** | High | Major infra provider upgrade |
| 18 | **@datadog/browser-rum v5 → v6** | Medium | Observability |

---

## Renovate Configuration Improvements

Current `renovate.json` is well-structured. Recommended additions:

1. **Add `react-native-gradle-plugin` to `ignoreDeps`** to suppress lookup failure
2. **Consider adding `reviewersFromCodeOwners: true`** to auto-assign reviewers from CODEOWNERS
3. **Add `"matchPackageNames": ["zod"]` to Group 2** (patch auto-merge) since zod follows semver strictly
4. The `prConcurrentLimit: 5` is appropriate for the monorepo size

---

## Summary

The **single most impactful action** is fixing the zod override conflict — it will unblock Renovate's entire pipeline and allow the security patches group PR to be created automatically. Combined with the lockfile regeneration, this resolves 4 out of 5 Dependabot alerts immediately. The CodeQL XSS fix is a targeted 5-line change. All three can be done safely today with zero disruption to the platform.
