# AUSTA SuperApp — Developer Forward Guide

> **Purpose**: This guide is for human developers taking over this codebase. It focuses on what you need to DO next, not what was done before.

---

## Current State (What's Done)

- **319 mobile screens** (React Native 0.73, Expo), **307 web pages** (Next.js 14)
- **10 navigators**, 6 v2.0 health modules (70 mobile + 70 web screens)
- **29 Prisma models**, 9 enums, 7 NestJS microservices, 7 Dockerfiles
- **100% i18n** (en-US + pt-BR), dark mode complete, 0 hardcoded hex colors
- **57 design system components**, 147 test files
- **LGPD compliance** (consent, DSR, PHI encryption)
- **CI/CD**: 10 GitHub Actions workflows, EAS build profiles, K8s manifests

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
cd src/backend && docker-compose up -d
# Then start NestJS in watch mode:
yarn start:dev
```

---

## P0 — Launch Blocking (Human Action Required)

These items cannot be completed by AI tooling alone. They require external accounts, legal review, or infrastructure provisioning.

### 1. API Layer — Stub Replacement (~150 implementations)

> **Update (2026-02-28)**: The `auth` module is now largely complete — `login()`, `logout()`,
> `changePassword()`, `enable2FA()`, `disable2FA()`, `configure2FA()`, `deleteAccount()`,
> `getProfile()`, and OAuth social auth (web + mobile) are all wired to real API endpoints.
> `care.ts` (79 exports) and `health.ts` (127 exports) have comprehensive API layers. The
> remaining stubs are concentrated in profile setup, settings, and health/medication screens.

Currently ~23 stub functions serve 367 screens. Each returns hardcoded or empty data.

**Files to work on:**
```
src/web/mobile/src/api/
├── auth.ts       # Authentication flows
├── care.ts       # Care journey (68 screens, only 3 real functions)
├── health.ts     # Health journey (87 screens, only 2 real functions)
└── client.ts     # Axios/GraphQL client config
```

**Approach:** Work module by module. For each module:
1. Identify all screens that call a stub (grep for `// TODO: implement` or `return []`)
2. Map the call to the corresponding Prisma model in `src/backend/`
3. Implement the NestJS resolver/controller endpoint
4. Wire the frontend API function to the real endpoint

**Priority order:** ~~`auth`~~ (✅ done) → `health` → `care` → `plan` → `wellness` → `gamification`

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
| RDS (PostgreSQL 15) | Primary database — must match Prisma schema |
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

### 1. Mock Data Replacement (233 screens)

Most screens display placeholder data like `"John Doe"`, `"2024-01-01"`, or empty arrays. Replace by module batch:

| Module | Screens | Navigator |
|--------|---------|-----------|
| Health | 87 | HealthNavigator |
| Care | 68 | CareNavigator |
| Wellness | 15 | WellnessNavigator |
| Plan | 10 | PlanNavigator |
| Settings | 33 | SettingsNavigator |
| Home | ~15 | HomeNavigator |

Search for mock data: `grep -r "John Doe\|placeholder\|TODO: replace" src/web/mobile/src/screens/`

---

### 2. Test Coverage

Current coverage is low. Target before launch:

| Package | Current | Target |
|---------|---------|--------|
| Mobile | ~16% | 60% |
| Web | ~10% | 40% |
| Backend | ~45% | 70% |

147 test files already exist as templates. To run tests:

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

### 3. TypeScript Strict Mode (Incremental)

The mobile app currently has `noImplicitAny: false` in `tsconfig.json` due to ~3700 existing errors (see Known Technical Issues). Enable strict mode per module:

1. Fix `design-system` build first (see Known Technical Issues #2)
2. Enable `noImplicitAny: true` in one module at a time
3. Run `yarn tsc --noEmit` to surface errors
4. Fix before moving to next module

Recommended order: `shared` → `auth` → `home` → `health` → others

---

### 4. TODO/FIXME Audit

> **Update (2026-02-28)**: 11 critical Tier 1 TODOs resolved (logout, 2FA, password, account
> deletion, privacy, data export, OAuth). ~65 TODOs remain (down from 78). See
> `docs/todo-triage-report.md` for the full updated inventory.

```bash
# Find all TODOs
grep -rn "TODO\|FIXME\|HACK\|XXX" src/ --include="*.ts" --include="*.tsx" | wc -l
# Currently ~58+ items

# See them organized by file
grep -rn "TODO\|FIXME" src/ --include="*.ts" --include="*.tsx"
```

Prioritize TODOs in: auth flows, API connections, navigation edge cases.

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

### 1. TypeScript Compilation (~3700 errors in mobile)

The mobile app compiles despite these errors because `noImplicitAny: false` is set. The errors do not block development but should be resolved before enabling strict mode.

**Root causes:**

| Cause | Fix |
|-------|-----|
| Design system build broken (ESM/CJS conflict in `rollup.config.js`) | See issue #2 below |
| `react-native@0.73` types not resolving | Remove `@types/react-native`, add `moduleResolution: "bundler"` to tsconfig |
| Missing shared types (`care.types.ts`, `notification.types.ts`) | Create in `src/web/shared/src/types/` |

**Do not panic.** The app runs. Fix incrementally.

---

### 2. Design System Build Broken

**File:** `src/web/design-system/rollup.config.js`

**Symptom:** Build fails on Node 22 with ESM/CJS interop error.

**Fix option A** (quick): Add `"type": "module"` to `src/web/design-system/package.json`

**Fix option B** (recommended): Migrate to Vite:
```bash
cd src/web/design-system
yarn add -D vite @vitejs/plugin-react
# Replace rollup.config.js with vite.config.ts
```

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

All major decisions are documented in `docs/ADRs/`:

| ADR | Title |
|-----|-------|
| ADR-001 | Monorepo structure with Yarn workspaces |
| ADR-002 | NestJS microservices with GraphQL federation |
| ADR-003 | Prisma as sole ORM (no TypeORM) |
| ADR-004 | LGPD compliance architecture |
| ADR-005 | v2.0 module design rules (13 mandatory rules) |

**Read ADR-005 before adding any new module.** It defines screen length limits, testID requirements, accessibility rules, i18n structure, and more.

---

### Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Mobile | React Native 0.73, Expo SDK 50 |
| Web | Next.js 14, React 18 |
| Design System | Custom components, StyleSheet tokens |
| State (async) | TanStack Query v5 |
| State (GraphQL) | Apollo Client 3 |
| Backend framework | NestJS 10 |
| ORM | Prisma 5.10 (no TypeORM) |
| Database | PostgreSQL 15 |
| Cache | Redis 7 |
| Auth | JWT + refresh tokens, LGPD consent |
| CI/CD | GitHub Actions (10 workflows) |
| Build | EAS Build (iOS + Android) |
| Container | Docker + Kubernetes (EKS) |

---

### Monorepo Structure

```
src/
├── web/
│   ├── mobile/          # React Native app (319 screens)
│   │   ├── src/
│   │   │   ├── api/         # API client functions (stub → real)
│   │   │   ├── navigation/  # 10 navigator files
│   │   │   ├── screens/     # Organized by journey
│   │   │   ├── i18n/        # en-US.ts + pt-BR.ts
│   │   │   └── constants/   # routes.ts (all ROUTES.*)
│   │   └── .maestro/        # E2E test flows (7 flows)
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
    └── docker-compose.*  # Local dev environments
```

---

### Navigation Map

| Navigator | File | Screen Count |
|-----------|------|-------------|
| RootNavigator | `navigation/RootNavigator.tsx` | Entry point |
| MainNavigator | `navigation/MainNavigator.tsx` | Tab container |
| HealthNavigator | `navigation/HealthNavigator.tsx` | 87 screens |
| CareNavigator | `navigation/CareNavigator.tsx` | 68 screens |
| WellnessNavigator | `navigation/WellnessNavigator.tsx` | 15 screens |
| PlanNavigator | `navigation/PlanNavigator.tsx` | 10 screens |
| SettingsNavigator | `navigation/SettingsNavigator.tsx` | 33 screens |
| AuthNavigator | `navigation/AuthNavigator.tsx` | 6 screens |
| HomeNavigator | `navigation/HomeNavigator.tsx` | ~15 screens |
| GamificationNavigator | `navigation/GamificationNavigator.tsx` | ~10 screens |

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
- **CI/CD questions**: `.github/workflows/` — 10 workflow files, each is self-documented

---

*Last updated: 2026-02-28*
