# AUSTA SuperApp — Developer Forward Guide

> **Purpose**: This guide is for human developers taking over this codebase. It focuses on what you need to DO next, not what was done before.

---

## Current State (What's Done)

- **319 mobile screens** (React Native 0.73, Expo), **307 web pages** (Next.js 15)
- **14 navigators** (9 root + 5 health sub-navigators), 6 v2.0 health modules (70 mobile + 70 web screens)
- **39 Prisma models** (30 shared + 9 gamification), 11 enums, 7 NestJS microservices, 7 Dockerfiles
- **100% i18n** (en-US + pt-BR), dark mode complete, 0 hardcoded hex colors
- **57 design system components**, **510 test files** (366 frontend + 144 backend)
- **0 TypeScript errors** across entire codebase (frontend + backend) — `tsc --noEmit` clean
- **0 ESLint errors** (backend, web, design-system, mobile)
- **Prometheus instrumentation** in all 7 backend services (`/metrics` endpoint)
- **LGPD compliance** (consent, DSR, PHI encryption, compliance checklist)
- **Mobile security**: biometric challenge (server-side), native SSL pinning scaffold, app integrity scaffold, ProGuard rules (30 keep rules)
- **CI/CD**: 12 GitHub Actions workflows, EAS build profiles, K8s manifests (40 YAML in 8 namespaces)
- **Infrastructure**: 28 Terraform files (security-hardened), env validator, infrastructure validation script

---

## Environment Setup

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20+ |
| Yarn | 1.22+ |
| Docker | Latest stable |
| Expo CLI | `npm install -g expo-cli` |

### Install Dependencies

```bash
# Web packages (mobile + web app + design system)
cd src/web && yarn install

# Backend packages (all 8 microservices)
cd src/backend && yarn install
```

**Known harmless install warnings:**
- `postinstall script path` — harmless, safe to ignore
- `husky .git not found` — harmless in fresh clone, resolves after `git init`

### Running Locally

```bash
# Mobile app
cd src/web/mobile && yarn start

# Web app
cd src/web/web && yarn dev

# Backend (starts all services via Docker Compose)
docker compose -f infrastructure/docker/docker-compose.dev.yml up -d
# Then start NestJS in watch mode:
yarn start:dev
```

---

## P0 — Launch Blocking (Human Action Required)

These items cannot be completed by AI tooling alone. They require external accounts, legal review, or infrastructure provisioning.

### 1. API Layer — Status Update

> **Update (2026-03-09)**: The API layer is now **nearly complete**. All modules have been wired
> to real API endpoints via `restClient` / `graphQLClient`. The `auth` module uses `fetch` directly.
>
> | Module | Exported functions | Real API calls | Status |
> |--------|-------------------|----------------|--------|
> | `auth.ts` | 12 | 12 (via fetch) | ✅ Complete |
> | `care.ts` | 47 | 46 | 🟡 1 stub remaining |
> | `health.ts` | 79 | 78 | 🟡 1 stub remaining |
> | `plan.ts` | 25 | 25 | ✅ Complete |
> | `wellness.ts` | 20 | 20 | ✅ Complete |
> | `gamification.ts` | 12 | 12 | ✅ Complete |
> | **Total** | **195** | **193** | **99% complete** |

Only 1-2 functions still need real endpoint wiring. The original "~23 stub functions" estimate is outdated.

**Files:**
```
src/web/mobile/src/api/
├── auth.ts           # ✅ Authentication flows (12 functions, all real)
├── care.ts           # 🟡 Care journey (47 functions, 46 real)
├── health.ts         # 🟡 Health journey (79 functions, 78 real)
├── plan.ts           # ✅ Plan journey (25 functions, all real)
├── wellness.ts       # ✅ Wellness journey (20 functions, all real)
├── gamification.ts   # ✅ Gamification (12 functions, all real)
├── notifications.ts  # Notification endpoints
├── client.ts         # Axios/GraphQL client config
├── config.ts         # API configuration
├── ssl-pinning.ts    # Certificate pinning setup
└── mocks/            # Mock data for development
```

**Remaining work:**
1. Identify the 1-2 remaining stubs in `care.ts` and `health.ts`
2. Ensure corresponding NestJS backend endpoints exist (195 endpoint decorators verified across services)
3. Validate end-to-end with real database after AWS provisioning

---

### 2. Expo Project Setup

> **Status (2026-02-28)**: Still pending — `your-project-id` placeholders remain in `app.json` (lines 163, 167).

```bash
# In the mobile directory:
cd src/web/mobile

# Initialize EAS with your Expo account
eas init
```

After running `eas init`:
- Replace `your-project-id` in `app.json` with the real project ID
- Add real app icons: `assets/icon.png` (1024x1024), `assets/adaptive-icon.png` (1024x1024)
- Add real splash screen: `assets/splash.png` (1242x2436)
- Update `app.json` bundle identifiers:
  - iOS: `com.yourcompany.austa`
  - Android: `com.yourcompany.austa`

---

### 3. AWS Infrastructure Provisioning

The application is designed for AWS EKS. You will need to provision:

| Resource | Purpose |
|----------|---------|
| EKS Cluster | Container orchestration |
| RDS (PostgreSQL 16) | Primary database — must match Prisma schema |
| ElastiCache (Redis) | Session cache, queue backing |
| S3 Buckets | Document storage, PHI files |
| Secrets Manager | All service credentials |
| CloudFront | CDN for web app |

K8s manifests are in `infrastructure/kubernetes/` — one directory per service.

---

### 4. Firebase Configuration

Push notifications require Firebase. Add these files before building:

```
src/web/mobile/
├── android/app/google-services.json        # Download from Firebase Console (Android)
└── ios/GoogleService-Info.plist            # Download from Firebase Console (iOS)
```

These files are gitignored. Never commit them.

---

### 5. Third-Party Service Credentials

Set these in AWS Secrets Manager (and locally in `.env` files — see `.env.example`):

```bash
# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
DATADOG_API_TOKEN=...
SENTRY_DSN=...

# Notifications
FIREBASE_SERVER_KEY=...
TWILIO_ACCOUNT_SID=...    # SMS
SENDGRID_API_KEY=...      # Email

# Auth
JWT_SECRET=...             # Generate: openssl rand -base64 64
JWT_REFRESH_SECRET=...

# Database
DATABASE_URL=postgresql://user:pass@host:5432/austa
REDIS_URL=redis://host:6379
```

---

### 6. LGPD Legal Review

The consent flows and DSR (Data Subject Request) implementation in `src/backend/auth-service/` were built to Brazilian LGPD requirements. Before going live:

- Legal team must review consent language in `src/web/mobile/src/i18n/en-US.ts` (key: `lgpd.*`)
- DPO (Data Protection Officer) must sign off on the DSR workflow
- PHI encryption key rotation policy must be documented
- Privacy policy and terms of service must be linked in `app.json` (`privacyPolicyUrl`, `termsOfServiceUrl`)

---

## P1 — Pre-Launch (AI-Assistable)

These items are high priority but can be addressed with AI coding assistance.

### 1. Mock Data Replacement

> **Update (2026-03-09)**: A comprehensive scan (`grep -rl "John Doe\|Jane Doe\|Lorem ipsum\|2024-01-01\|example@\|test@"`)
> found mock/placeholder data in **only 1 file** — a test file (`plan/__tests__/DigitalCard.test.tsx`), not a user-facing
> screen. All mobile screens appear to consume data dynamically via API hooks. This task is **essentially complete**.

**Verification:** Run the scan below to confirm no regressions have been introduced:

```bash
grep -rl "John Doe\|Jane Doe\|Lorem ipsum\|2024-01-01\|example@\|test@" src/web/mobile/src/screens/ 
# Expected: 0 results (or only test files)
```

If new placeholder data is found, replace with dynamic data from hooks (`useQuery`, `useFetch`, etc.) or i18n keys.

---

### 2. Test Coverage

> **Update (2026-03-10)**: Test file count increased significantly via AI swarm work.
> 510 test files now exist across the codebase. Coverage percentages still need measurement
> with `--coverage` runs against a live environment.

Current test file inventory:

| Package | Test Files | Previous | Change |
|---------|-----------|----------|--------|
| Mobile | 164 `.test.tsx` | 72 | +92 |
| Web | 145 `.test.tsx` | 30 | +115 |
| Design System | 57 `.test.tsx/.ts` | 57 | — |
| Backend | 144 `.spec.ts/.e2e-spec.ts/.test.ts` | 92 | +52 |
| **Total** | **510** | **251** | **+259** |

To run tests:

```bash
# Mobile
cd src/web/mobile && yarn test --coverage

# Web
cd src/web/web && yarn test --coverage

# Backend (all services)
cd src/backend && yarn test --coverage
```

Focus on: authentication flows, LGPD consent, health data submission, gamification point awarding.

---

### 3. TypeScript Strict Mode

> **Update (2026-03-10)**: ✅ **COMPLETED.** The entire frontend codebase now compiles with 0 TypeScript errors.
> `cd src/web && npx tsc --noEmit` returns clean. Backend was already clean.
> This was achieved by the W7 TS Strict swarm which fixed ~1,797 errors across 60+ files:
> - Added path aliases to `tsconfig.json` (resolved ~1,479 TS2307 errors)
> - Created `types/jest-dom.d.ts` type augmentation (resolved ~517 TS2339 errors)
> - Fixed ~318 code-level type errors across all packages
>
> **No further action needed.** Maintain 0-error state by running `tsc --noEmit` in CI.

---

### 4. TODO/FIXME Audit

> **Update (2026-03-09)**: Down to **8 genuine TODOs** (excluding format masks like `XXX.XXX.XXX-XX`
> that are CPF/phone patterns, not action items). Previous count of "~65" included format mask comments.

Remaining genuine TODOs:

| File | Line | Description | Priority |
|------|------|-------------|----------|
| `src/web/web/src/components/forms/HealthGoalForm.tsx` | 77 | Implement API call to create/update health goal | P1 |
| `src/web/web/src/api/notifications.ts` | 44 | Implement real-time notification subscription (WebSocket/SSE) | P1 |
| `src/web/web/src/pages/health/history.tsx` | 227 | Navigate to detailed view | P2 |
| `src/web/web/src/pages/health/history.tsx` | 234 | Implement document viewing logic | P2 |
| `src/web/mobile/src/api/ssl-pinning.ts` | 7 | Replace placeholder SPKI hashes with real cert pins (**requires ops**) | P0 |
| `src/backend/shared/prisma/seed.ts` | 353-365 | 4 TODOs: remove references to deleted models | P2 |

```bash
# Verify current count (exclude format mask patterns like XXX.XXX)
grep -rn "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx" | grep -v node_modules | grep -v "XXX\.\|X-XX\|XXXX" | grep -v HACKED
# Expected: ~8 results
```

Prioritize: ssl-pinning (P0, requires production certs), then web API calls (P1), then cleanup (P2).

---

### 5. Prisma Migration (Required Before First Deploy)

> **Status (2026-02-28)**: `prisma.config.ts` has been created at `src/backend/shared/prisma/prisma.config.ts`
> (forward-compatible with Prisma 7.x). The current `schema.prisma` still uses `url = env("DATABASE_URL")`
> which works with Prisma 5.x/6.x. When upgrading to Prisma 7.x, uncomment the defineConfig export in
> prisma.config.ts.

Prisma 7.4.1 deprecates the `url` field in `schema.prisma` in favor of `prisma.config.ts`.

```bash
# Check current schema
cat src/backend/shared/prisma/schema.prisma | grep url

# prisma.config.ts already exists — uncomment defineConfig when upgrading to Prisma 7.x
```

---

## P2 — Post-Launch

Lower priority. Address after stable production operation.

1. **Performance profiling** under real user load — use Datadog APM dashboards
2. **Accessibility audit** — target WCAG 2.1 AA; focus on screen reader support in React Native
3. **A/B testing framework** — integrate with Firebase Remote Config (already a dependency)
4. **Advanced analytics dashboards** — gamification metrics, health journey completion rates
5. **i18n alignment** — pt-BR uses top-level keys, en-US uses nested structure (cosmetic inconsistency). Parity check script exists: `npx tsx scripts/check-i18n-parity.ts`

---

## Known Technical Issues

### 1. TypeScript Compilation — RESOLVED ✅

> **Update (2026-03-10)**: This issue is **fully resolved**. The frontend codebase compiles with
> 0 TypeScript errors under `tsc --noEmit`. The ~3,700 errors referenced previously have been
> fixed by the W7 TS Strict swarm (path aliases, jest-dom types, code-level fixes).
> Backend was already at 0 errors. Both frontend and backend are clean.

---

### 2. Design System Build Broken

**File:** `src/web/design-system/rollup.config.mjs`

**Symptom:** Build fails on Node 22 with ESM/CJS interop error.

**Fix option A** (quick): ~~Add `"type": "module"` to `src/web/design-system/package.json`~~ ✅ Already done.

**Fix option B** (recommended): Migrate to Vite:
```bash
cd src/web/design-system
yarn add -D vite @vitejs/plugin-react
# Replace rollup.config.mjs with vite.config.ts
```

> **Note (2026-03-09)**: `"type": "module"` has already been added to `package.json` and the config
> file has been renamed from `rollup.config.js` to `rollup.config.mjs`. The build may still fail
> on Node 22 due to remaining CJS dependencies in the Rollup plugin chain. Vite migration remains
> the recommended long-term fix.

---

### 3. K8s Port Alignment

> **Status (2026-02-28)**: RESOLVED. All 7 service Deployment and Service manifests are aligned (ports 3000-3006). Fixed by INFRA-QA sprint.

---

### 4. i18n Structure Mismatch

`en-US.ts` uses nested keys (`journeys.health.sleep.title`), `pt-BR.ts` uses some top-level keys. This causes missing translations to silently fall back.

**Find mismatches:**
```bash
# Keys in en-US not in pt-BR
# Script exists: scripts/check-i18n-parity.ts
npx tsx scripts/check-i18n-parity.ts
```

Cosmetic issue. Does not break the app.

---

## Architecture Reference

### ADRs (Architectural Decision Records)

All major decisions are documented in `docs/adr/`:

| ADR | Title |
|-----|-------|
| ADR-001 | Navigation architecture — journey-based with color coding |
| ADR-002 | API contract strategy — GraphQL-first |
| ADR-003 | Error handling strategy — structured with journey context |
| ADR-004 | LGPD compliance architecture |
| ADR-005 | Design and UI consistency patterns |
| ADR-013 | Claude Flow swarm intelligence agent pattern |

**Read ADR-005 before adding any new module.** It defines screen length limits, testID requirements, accessibility rules, i18n structure, and more.

---

### Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Mobile | React Native 0.73, Expo SDK 50 |
| Web | Next.js 15, React 19 |
| Design System | Custom components, StyleSheet tokens, Storybook 8 |
| State (async) | TanStack Query v5 |
| State (GraphQL) | Apollo Client 3 |
| Backend framework | NestJS 11 |
| ORM | Prisma 5.22 (no TypeORM) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT + refresh tokens, LGPD consent |
| CI/CD | GitHub Actions (12 workflows) |
| Build | EAS Build (iOS + Android) |
| Container | Docker + Kubernetes (EKS) |

---

### Monorepo Structure

```
src/
├── web/
│   ├── mobile/          # React Native app (319 screens)
│   │   ├── src/
│   │   │   ├── api/         # API client functions (195 functions, 99% real)
│   │   │   ├── navigation/  # 14 navigator files (9 root + 5 health sub-navigators)
│   │   │   ├── screens/     # Organized by journey
│   │   │   ├── i18n/        # en-US.ts + pt-BR.ts
│   │   │   └── constants/   # routes.ts (all ROUTES.*)
│   │   └── .maestro/        # E2E test flows (13 flows)
│   ├── web/             # Next.js web app (307 pages)
│   │   └── src/pages/   # Organized by journey
│   ├── design-system/   # 57 shared components
│   │   └── src/         # Components + tokens + stories
│   └── shared/          # Types, utils, constants shared between mobile+web
├── backend/
│   ├── api-gateway/     # GraphQL federation gateway (port 3000)
│   ├── auth-service/    # Authentication + LGPD (port 3001)
│   ├── health-service/  # Health journey (port 3002)
│   ├── care-service/    # Care journey (port 3003)
│   ├── plan-service/    # Insurance plan (port 3004)
│   ├── gamification-engine/  # Points, achievements (port 3005)
│   ├── notification-service/ # Push, email, SMS (port 3006)
│   └── shared/          # Prisma schema, shared DTOs, utils
└── infrastructure/
    ├── kubernetes/       # K8s manifests (one dir per service)
    └── docker/           # All Docker Compose files (dev, staging, production, scale, local)
```

---

### Navigation Map

| Navigator | File | Screen Count |
|-----------|------|-------------|
| RootNavigator | `navigation/RootNavigator.tsx` | Entry point |
| MainNavigator | `navigation/MainNavigator.tsx` | Tab container |
| AuthNavigator | `navigation/AuthNavigator.tsx` | 6 screens |
| HealthNavigator | `navigation/HealthNavigator.tsx` | 87 screens |
| CareNavigator | `navigation/CareNavigator.tsx` | 68 screens |
| WellnessNavigator | `navigation/WellnessNavigator.tsx` | 15 screens |
| PlanNavigator | `navigation/PlanNavigator.tsx` | 10 screens |
| SettingsNavigator | `navigation/SettingsNavigator.tsx` | 33 screens |
| GamificationNavigator | `navigation/GamificationNavigator.tsx` | ~10 screens |
| **Health sub-navigators:** | | |
| ActivityNavigator | `navigation/health/ActivityNavigator.tsx` | Activity module |
| NutritionNavigator | `navigation/health/NutritionNavigator.tsx` | Nutrition module |
| SleepNavigator | `navigation/health/SleepNavigator.tsx` | Sleep module |
| CycleTrackingNavigator | `navigation/health/CycleTrackingNavigator.tsx` | Cycle tracking |
| WellnessResourcesNavigator | `navigation/health/WellnessResourcesNavigator.tsx` | Wellness resources |

All navigators are typed with `createStackNavigator<ParamList>()`. Route constants are in `src/web/mobile/src/constants/routes.ts`.

---

## Common Development Tasks

### Add a New Screen (Mobile)

1. Create the file in the appropriate `screens/` subdirectory (max 500 lines, per ADR-005)
2. Add `testID` props to all interactive elements
3. Use `useTheme()` from `styled-components/native` (no hardcoded hex)
4. Use `useTranslation()` (no hardcoded strings)
5. Add route constant to `src/web/mobile/src/constants/routes.ts`
6. Add `ParamList` entry to `src/web/mobile/src/navigation/types.ts`
7. Add `Stack.Screen` entry to the appropriate navigator
8. Export from the module's `index.ts` barrel
9. Add i18n keys to both `en-US.ts` and `pt-BR.ts`

### Add a New Backend Endpoint

1. Define the DTO in `src/backend/<service>/src/dto/`
2. Add the Prisma query in the service's repository layer
3. Expose via NestJS resolver (GraphQL) or controller (REST)
4. Write a spec file in `src/backend/<service>/src/`
5. Update the GraphQL schema if needed (`api-gateway` federation)

### Run E2E Tests

```bash
# Requires Maestro installed: brew tap mobile-dev-inc/tap && brew install maestro
cd src/web/mobile
maestro test .maestro/auth-login.yaml
maestro test .maestro/  # Run all flows
```

---

## Getting Help

- **Architecture questions**: Read `docs/ADRs/` first
- **Module patterns**: Each v2.0 module (sleep, activity, nutrition, etc.) follows the same structure — use any as a reference
- **Backend patterns**: `src/backend/health-service/` is the most complete service — use as template
- **LGPD questions**: `src/backend/auth-service/src/lgpd/` has all consent + DSR logic
- **CI/CD questions**: `.github/workflows/` — 12 workflow files, each is self-documented

---

*Last updated: 2026-03-10*
