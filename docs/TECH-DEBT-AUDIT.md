# Technical Debt Audit — AUSTA Healthcare SuperApp

> **Audit date**: 2026-03-22
> **Scope**: Full monorepo (`src/backend/*`, `src/web/*`, root config)
> **Verification**: All claims forensically verified against source files

---

## Repo Topology

```
root/
├── src/backend/
│   ├── api-gateway        # NestJS, GraphQL gateway
│   ├── auth-service       # NestJS, JWT + MFA
│   ├── care-service       # NestJS, appointments + telemedicine + providers
│   ├── gamification-engine # NestJS, achievements + quests + rewards
│   ├── health-service     # NestJS, metrics + devices + FHIR + wearables
│   ├── notification-service # NestJS, email + SMS + push + in-app
│   ├── plan-service       # NestJS, insurance plans + claims + payments
│   └── shared             # Cross-cutting: DB, Kafka, Redis, logging, encryption, audit, consent, privacy
├── src/web/
│   ├── design-system      # Component library
│   ├── mobile             # React Native app
│   ├── shared             # Frontend shared utils
│   └── web                # Next.js 15 web app
├── infrastructure/        # Terraform, K8s, monitoring, nginx, docker-compose.production.yml
└── infra/                 # Abandoned — only nginx/ (duplicate of infrastructure/nginx/)
```

---

## Debt Registry

Each item has: `id`, `category`, `severity`, `priority_score`, `files`, `description`, `fix`.

Priority formula: `(impact + risk) × (6 - effort)` where impact, risk, effort are 1–5.

### CRITICAL

#### TD-001: Binary artifacts committed to Git
- **Category**: dependency
- **Impact**: 4 | **Risk**: 5 | **Effort**: 1 | **Score**: 45
- **Files**: `next-swc-darwin-arm64-15.5.12.tgz` (41 MB), `ruvector.db` (1.6 MB), `vectors.db` (4.1 MB)
- **Description**: Platform-specific binary and SQLite database files are tracked by git. Not in `.gitignore`. Bloats every clone by ~47 MB.
- **Fix**: Add `*.tgz`, `*.db` to `.gitignore`. Run `git filter-repo --path next-swc-darwin-arm64-15.5.12.tgz --path ruvector.db --path vectors.db --invert-paths` to purge history.

#### TD-002: health-service unit test coverage at 15.28%
- **Category**: test
- **Impact**: 5 | **Risk**: 5 | **Effort**: 3 | **Score**: 30
- **Files**: `src/backend/health-service/src/**/*.ts`
- **Coverage baseline**: `src/backend/coverage-baseline/health-service/coverage-summary.json`
- **Verified metrics**: 135/883 lines (15.28%), 7/72 branches (9.72%), 14 test files for 51 source files
- **Zero-coverage modules**: `devices/devices.controller.ts`, `devices/devices.service.ts`, `integrations/fhir/*`, `integrations/wearables/adapters/*`
- **Fix**: Add ~40 unit tests targeting devices CRUD, FHIR client methods, wearable adapter data transforms, and health record validation. Target 70% line, 50% branch.

#### TD-003: 89 dependency resolutions in root package.json
- **Category**: dependency
- **Impact**: 4 | **Risk**: 5 | **Effort**: 4 | **Score**: 18
- **Files**: `package.json` (resolutions object)
- **Description**: Mix of security patches (follow-redirects, minimist), compatibility hacks (50+ Babel transforms), and version pins. Creates hidden version conflicts and blocks clean upgrades.
- **Fix**: Audit each resolution. Remove those satisfied by current dependency versions. Target <30 resolutions.

#### TD-004: Cross-service imports violate bounded contexts
- **Category**: architecture
- **Impact**: 4 | **Risk**: 5 | **Effort**: 3 | **Score**: 27
- **Files**: `src/backend/care-service/src/providers/providers.controller.ts` lines 18–21
- **Violation**: `import { CurrentUser } from '../../../auth-service/src/auth/decorators/current-user.decorator'` and `import { Roles } from '../../../auth-service/src/auth/decorators/roles.decorator'`
- **Fix**: Move `@CurrentUser` and `@Roles` decorators to `src/backend/shared/src/guards/` or create `@austa/auth-contracts` package. Update care-service imports.

### HIGH

#### TD-005: care-service unit test coverage at 47.74%
- **Category**: test
- **Impact**: 4 | **Risk**: 5 | **Effort**: 3 | **Score**: 27
- **Files**: `src/backend/care-service/src/**/*.ts`
- **Coverage baseline**: `src/backend/coverage-baseline/care-service/coverage-summary.json`
- **Verified metrics**: 350/733 lines (47.74%), 64.72% branches
- **Zero-coverage modules**: `appointments/appointments.controller.ts` (6 functions), `appointments/appointments.service.ts` (15 functions, 189 lines)
- **Note**: `appointments.service.spec.ts` exists (319 lines, proper mocks) but coverage baseline still shows 0% for appointments — likely instrumentation or path-mapping issue.
- **Fix**: Debug coverage instrumentation. Add tests for medications, treatment plans, telemedicine sessions. Target 70% line.

#### TD-006: React version conflict
- **Category**: dependency
- **Impact**: 4 | **Risk**: 5 | **Effort**: 2 | **Score**: 36
- **Files**: root `package.json` resolutions vs `src/web/web/package.json`
- **Description**: Root resolves react to one version while the Next.js web workspace declares a different version. This causes runtime mismatches in hooks and context.
- **Fix**: Align all workspaces to a single React version. Test build across web and mobile.

#### TD-007: Shared package is a monolith (19 modules, 92 files)
- **Category**: architecture
- **Impact**: 4 | **Risk**: 4 | **Effort**: 4 | **Score**: 16
- **Files**: `src/backend/shared/src/` — 19 top-level directories
- **Modules**: audit, config, consent, constants, database, dto, encryption, exceptions, guards, interfaces, kafka, logging, middleware, pipes, privacy, redis, tracing, utils, filters
- **Problem**: Domain logic (consent, privacy, audit) mixed with infrastructure (redis, kafka, database). Every service depends on shared, making it a deployment bottleneck.
- **Fix**: Extract `consent/`, `privacy/`, `audit/` into `@austa/compliance`. Keep only infrastructure utils in shared.

#### TD-008: Branch coverage 9–40% across all backend services
- **Category**: test
- **Impact**: 4 | **Risk**: 4 | **Effort**: 3 | **Score**: 24
- **Verified metrics per service**:
  - health-service: 9.72% branches
  - notification-service: 31.95% branches
  - api-gateway: 37.55% branches
  - auth-service: 37.33% branches
  - plan-service: 37.87% branches
  - gamification-engine: 38.92% branches
  - shared: 62.39% branches
  - care-service: 64.72% branches
- **Fix**: Add error-path and edge-case tests. Enforce minimum 50% branch coverage in CI.

#### TD-009: Duplicate infra directories
- **Category**: infrastructure
- **Impact**: 3 | **Risk**: 3 | **Effort**: 1 | **Score**: 30
- **Files**: `/infra/` (only nginx/), `/infrastructure/` (Terraform, K8s, monitoring, nginx, docker-compose)
- **Fix**: Delete `/infra/`. Consolidate into `/infrastructure/`.

#### TD-010: appointments.service.ts is 1,004 lines
- **Category**: code
- **Impact**: 4 | **Risk**: 3 | **Effort**: 3 | **Score**: 21
- **File**: `src/backend/care-service/src/appointments/appointments.service.ts`
- **Verified**: 1,004 lines, 15 functions
- **Fix**: Extract into `appointments-scheduling.service.ts`, `appointments-validation.service.ts`, `appointments-notification.service.ts`.

#### TD-011: 5 Docker Compose files scattered
- **Category**: infrastructure
- **Impact**: 3 | **Risk**: 3 | **Effort**: 2 | **Score**: 24
- **Files**:
  - `src/backend/docker-compose.yml`
  - `src/backend/docker-compose.staging.yml`
  - `src/backend/docker-compose.scale.yml`
  - `infrastructure/docker-compose.production.yml`
  - `src/backend/gamification-engine/docker-compose.local.yml`
- **Fix**: Move all to `infrastructure/docker/` with consistent naming: `docker-compose.{dev,staging,production,scale,local}.yml`.

#### TD-012: 838 `any` type usages
- **Category**: code
- **Impact**: 3 | **Risk**: 3 | **Effort**: 3 | **Score**: 18
- **Verified**: 838 instances of `: any`, `:any`, or `as any` in `src/` (excluding node_modules, dist, .next)
- **Worst files**: `rules.service.ts` (22), `redis.service.ts` (16), `claims.service.ts` (16), `notifications.service.ts` (14)
- **Fix**: Add `@typescript-eslint/no-explicit-any: warn` to ESLint. Fix top offenders first. Target <200.

#### TD-013: No operational runbooks
- **Category**: documentation
- **Impact**: 3 | **Risk**: 4 | **Effort**: 3 | **Score**: 21
- **Description**: 12 GitHub Actions workflows exist but no companion docs for deployment, rollback, incident response, database migration, or monitoring alert triage.
- **Fix**: Create `docs/runbooks/` with: `deployment.md`, `rollback.md`, `incident-response.md`, `database-migration.md`, `monitoring-alerts.md`.

### MEDIUM

#### TD-014: Axios version conflict across workspaces
- **Category**: dependency
- **Impact**: 3 | **Risk**: 4 | **Effort**: 2 | **Score**: 28
- **Description**: Different workspace package.json files declare different axios versions. Root resolution pins 1.13.6 but not all workspaces align.
- **Fix**: Align all workspaces to root resolution version.

#### TD-015: No browser-level E2E tests
- **Category**: test
- **Impact**: 2 | **Risk**: 3 | **Effort**: 3 | **Score**: 15
- **Description**: Backend E2E is solid (14 spec files, 65 test cases via NestJS TestingModule + supertest, all substantive). But no Playwright/Cypress for frontend user flows.
- **Note**: Backend E2E covers: auth (login, register, refresh, users CRUD), appointments (CRUD + permissions), telemedicine (sessions + auth), health metrics (creation, updates, validation), devices (connect, retrieve), notifications (send, validate, journey templates), claims (lifecycle + Kafka events), plans (CRUD + access control + coverage + benefits), achievements, gamification events. Plus `claims.integration.spec.ts` (7 tests) and `payment.integration.spec.ts` (5 tests).
- **Fix**: Add Playwright for 5 critical frontend flows: login, appointment booking, health metric entry, claims submission, gamification rewards.

#### TD-016: React Native packages outdated by 3+ versions
- **Category**: dependency
- **Impact**: 3 | **Risk**: 4 | **Effort**: 3 | **Score**: 21
- **Description**: Navigation v6 (v7 available), Reanimated 3.4 (3.17 available), Gesture Handler 2.12 (2.25 available).
- **Fix**: Upgrade navigation to v7, reanimated to latest 3.x, gesture-handler to latest 2.x. Test on iOS + Android.

#### TD-017: Nested web/web/ contains build artifacts
- **Category**: code
- **Impact**: 3 | **Risk**: 2 | **Effort**: 1 | **Score**: 25
- **Files**: `src/web/web/node_modules/`, `src/web/web/.next/`
- **Description**: Turbo workspace pattern is intentional but inner directory contains its own node_modules, .next build output, and a duplicate `middleware.ts`.
- **Fix**: Ensure `.next/` and inner `node_modules/` are in `.gitignore`. Remove duplicate `middleware.ts` from `src/web/`.

#### TD-018: Large adapter files
- **Category**: code
- **Impact**: 3 | **Risk**: 3 | **Effort**: 3 | **Score**: 18
- **Files**: `src/backend/health-service/src/integrations/wearables/adapters/googlefit.adapter.ts` (787 lines), FHIR adapter (502 lines)
- **Fix**: Split GoogleFit adapter by data type (activity, sleep, vitals). Split FHIR adapter by resource type.

#### TD-019: No service API facade interfaces
- **Category**: architecture
- **Impact**: 3 | **Risk**: 4 | **Effort**: 4 | **Score**: 14
- **Description**: Services communicate via shared utilities and Kafka events but no explicit public API contracts. Internal refactors risk silent consumer breakage.
- **Fix**: Create `@austa/care-contracts`, `@austa/health-contracts` TypeScript interface packages.

#### TD-020: Missing dependency management docs
- **Category**: documentation
- **Impact**: 3 | **Risk**: 3 | **Effort**: 2 | **Score**: 24
- **Description**: Renovate config (325 lines) exists but no developer-facing doc explaining resolution strategy or conflict handling.
- **Fix**: Create `docs/dependency-management.md`.

#### TD-021: Inconsistent state management in web frontend
- **Category**: architecture
- **Impact**: 3 | **Risk**: 2 | **Effort**: 2 | **Score**: 20
- **Description**: React Context + React Query + React Hook Form used without documented guidelines. Potential prop drilling for UI state.
- **Fix**: Document state management strategy in `docs/frontend-patterns.md`.

#### TD-022: SSL pinning placeholder certs
- **Category**: code
- **Impact**: 2 | **Risk**: 5 | **Effort**: 2 | **Score**: 28
- **Description**: TODO markers in `ssl-pinning.ts` and `plans.e2e-spec.ts` reference placeholder SPKI hashes.
- **Fix**: Replace with real production certificate hashes.

#### TD-023: Privacy and consent logic in shared
- **Category**: architecture
- **Impact**: 3 | **Risk**: 3 | **Effort**: 4 | **Score**: 12
- **Files**: `src/backend/shared/src/consent/` (11 files), `src/backend/shared/src/privacy/` (9 files)
- **Fix**: Move to `@austa/compliance` package owned by a dedicated compliance domain.

#### TD-024: Prisma 7 migration TODO
- **Category**: dependency
- **Impact**: 2 | **Risk**: 4 | **Effort**: 3 | **Score**: 18
- **Description**: Encryption middleware has TODO for Prisma 7 migration.
- **Fix**: Complete Prisma 7 migration and remove TODO.

#### TD-025: Mobile screens over 500 lines (6 files)
- **Category**: code
- **Impact**: 2 | **Risk**: 2 | **Effort**: 3 | **Score**: 12
- **Fix**: Extract sub-components from oversized screen files.

#### TD-026: No infrastructure architecture README
- **Category**: documentation
- **Impact**: 3 | **Risk**: 2 | **Effort**: 2 | **Score**: 20
- **Fix**: Create `infrastructure/README.md` documenting Terraform modules, K8s manifests, monitoring stack.

#### TD-027: Recursive Babel plugin overrides
- **Category**: dependency
- **Impact**: 2 | **Risk**: 3 | **Effort**: 3 | **Score**: 15
- **Description**: 50+ Babel transform resolutions in root package.json duplicated across backend and web.
- **Fix**: Consolidate to root only. Remove workspace-level duplicates.

### LOW

#### TD-028: redis.service.ts (16 `any`, 634 lines)
- **Category**: code
- **Impact**: 3 | **Risk**: 2 | **Effort**: 3 | **Score**: 15
- **File**: `src/backend/shared/src/redis/redis.service.ts`
- **Fix**: Add typed generics for cache operations. Split into connection and operations modules.

#### TD-029: 37 console.log statements
- **Category**: code
- **Impact**: 1 | **Risk**: 2 | **Effort**: 1 | **Score**: 15
- **Verified**: 37 instances in TypeScript source (most in seed files, Storybook stories)
- **Fix**: Replace with structured logger. Keep in seed files.

#### TD-030: 12 TODO/FIXME markers
- **Category**: code
- **Impact**: 2 | **Risk**: 2 | **Effort**: 2 | **Score**: 16
- **Verified**: 12 instances in TypeScript source
- **Fix**: Triage each. Resolve or convert to tracked issues.

#### TD-031: 8 .bak backup files
- **Category**: code
- **Impact**: 1 | **Risk**: 1 | **Effort**: 1 | **Score**: 10
- **Fix**: Delete all `.bak` files. Add `*.bak` to `.gitignore`.

#### TD-032: .DS_Store files committed
- **Category**: code
- **Impact**: 1 | **Risk**: 1 | **Effort**: 1 | **Score**: 10
- **Fix**: Remove and add `.DS_Store` to `.gitignore`.

#### TD-033: Legacy docs/original documentation/ folder
- **Category**: documentation
- **Impact**: 1 | **Risk**: 1 | **Effort**: 1 | **Score**: 10
- **Fix**: Archive or delete.

#### TD-034: TypeScript pinned at 5.3.3
- **Category**: dependency
- **Impact**: 2 | **Risk**: 2 | **Effort**: 4 | **Score**: 8
- **Fix**: Plan upgrade path to 5.5+ after dependency alignment.

#### TD-035: Duplicate middleware.ts
- **Category**: code
- **Impact**: 2 | **Risk**: 2 | **Effort**: 1 | **Score**: 20
- **Files**: `src/web/middleware.ts`, `src/web/web/middleware.ts`
- **Fix**: Delete the outer `src/web/middleware.ts`. The Next.js app at `src/web/web/` is the source of truth.

#### TD-036: Error handling swallows errors (~20 catch blocks)
- **Category**: code
- **Impact**: 2 | **Risk**: 3 | **Effort**: 3 | **Score**: 15
- **Fix**: Add structured logging to empty catch blocks. Re-throw where appropriate.

---

## Test Coverage Summary

| Service | Unit Tests | E2E Tests | Line % | Branch % | Status |
|---|---|---|---|---|---|
| health-service | 14 | 2 (health, devices) | 15.28 | 9.72 | CRITICAL |
| care-service | 13 | 2 (appointments, telemedicine) | 47.74 | 64.72 | HIGH |
| shared | 22 | 0 | 64.18 | 62.39 | MEDIUM |
| notification-service | 11 | 1 (notifications) | 70.83 | 31.95 | MEDIUM |
| plan-service | 19 | 2 (claims, plans) + 2 integration | 78.54 | 37.87 | MEDIUM |
| api-gateway | 17 | 1 (app) | 79.61 | 37.55 | MEDIUM |
| auth-service | 20 | 2 (auth, users) | 80.72 | 37.33 | MEDIUM |
| gamification-engine | 19 | 2 (events, achievements) | 85.77 | 38.92 | OK |
| **Backend total** | **135** | **14 files, 65 cases** | **62.22 avg** | **35.18 avg** | |
| Web frontend | 692 files | 0 browser-level | — | — | |

---

## Remediation Phases

### Phase 1 — Week 1–2: Critical fixes

| Action | Target Files | Effort |
|---|---|---|
| Purge binaries from git | `.gitignore`, `git filter-repo` | 1 day |
| Fix React version conflict | root `package.json`, `src/web/web/package.json` | 1–2 days |
| Replace SSL placeholder certs | `ssl-pinning.ts`, `plans.e2e-spec.ts` | 1 day |
| Delete `/infra/` directory | `/infra/` | 30 min |
| Extract auth decorators to shared | `src/backend/shared/src/guards/`, `src/backend/care-service/src/providers/` | 2 days |

### Phase 2 — Week 3–6: Test coverage sprint

| Action | Target | Effort |
|---|---|---|
| health-service 15% → 70% | Add ~40 tests: devices, FHIR, wearables, health records | 2 weeks |
| care-service 48% → 70% | Fix instrumentation, add medication + treatment tests | 1 week |
| Add Playwright for frontend E2E | 5 flows: login, booking, health, claims, rewards | 2 weeks |
| Raise branch coverage to 50%+ | Error-path and edge-case tests across all services | ongoing |

### Phase 3 — Week 7–10: Architecture and dependency cleanup

| Action | Target | Effort |
|---|---|---|
| Split shared package | Extract consent, privacy, audit → `@austa/compliance` | 2 weeks |
| Define service API contracts | Create `@austa/*-contracts` interface packages | 1 week |
| Reduce resolutions to <30 | Audit all 89 resolutions | 1 week |
| Update React Native ecosystem | Navigation v7, Reanimated 3.17, Gesture Handler 2.25 | 1 week |
| Split large files (>500 lines) | appointments.service.ts, googlefit.adapter.ts, redis.service.ts | 1 week |

### Phase 4 — Week 11–14: Polish and prevention

| Action | Target | Effort |
|---|---|---|
| Write operational runbooks | `docs/runbooks/` | 1 week |
| Consolidate Docker Compose | `infrastructure/docker/` | 2 days |
| Reduce `any` count to <200 | ESLint rule + fix top offenders | 1 week |
| Add pre-commit quality gates | File size, coverage, `any` budgets | 2 days |
| Write dependency management guide | `docs/dependency-management.md` | 1 day |
| Clean up .bak, .DS_Store, TODOs | Misc cleanup | 2 days |
