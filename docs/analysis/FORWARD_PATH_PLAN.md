# AUSTA SuperApp — Forward Path Plan

**Date:** 2026-02-19  
**Author:** Deep Think Analysis (GitHub Copilot)  
**Input:** 5-Dimension Analysis + Security Audit + Build Scorecard (all committed)  
**Current state:** `main` is 5 commits ahead of `origin/main`. No CI blocking. Working tree clean.

---

## The Honest Assessment

The AUSTA SuperApp is a **well-architected, 60–70% complete platform** that was machine-generated (Blitzy AI) to a solid structural skeleton. The specification quality is exceptional (18 docs, 15,276 lines). The implementation quality is uneven — backend services range from solid (gamification-engine, health-service) to broken (notification-service has a TODO where its controller import should be). The project is **not production-deployable today** due to 4 concrete blockers.

**Overall score: 3.1 / 5.0**  
**Post-security-fix score: ~3.5 / 5.0**

---

## The 4 Hard Blockers (must fix before any production traffic)

| # | Blocker | Evidence | Fix size |
|---|---------|----------|----------|
| B1 | `notifications.module.ts` imports `NotificationsController` but the variable is not in scope (commented-out import = runtime crash at boot) | `src/backend/notification-service/src/notifications/notifications.module.ts:3` | 2h |
| B2 | `gamification-service/src/` contains only a `leaderboard/` subfolder — the service listed in docker-compose is a hollow stub | `src/backend/gamification-service/src/` | — (consolidate with engine, see Phase 2) |
| B3 | WebSocket gateway `cors: { origin: '*' }` — any browser can connect to real-time notification stream | `src/backend/notification-service/src/websockets/websockets.gateway.ts:31` | 30min |
| B4 | LGPD consent: only 8 code references, no consent-management module, no data-subject request (DSR) flows — violates Lei 13.709 Art. 7-8 | `grep -rn consent src/ → 8 matches` | 80h |

---

## Phase Map (6 Phases, ~6 months to production)

```
NOW ──► Phase 1 ──► Phase 2 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 6 ──► PROD
        (2 weeks)   (4 weeks)   (4 weeks)   (6 weeks)   (4 weeks)   (2 weeks)
        Make it     Consolidate  Test it     Feature-    Mobile      Launch
        boot & run  the arch     properly    complete    parity      hardening
```

---

## Phase 1 — Make It Boot & Run Correctly  _(~2 weeks, 1–2 engineers)_

**Goal:** Every service starts, docker-compose up works end-to-end, no crash-on-boot.

### 1.1 Fix notification-service controller gap _(2h)_
```
src/backend/notification-service/src/notifications/notifications.module.ts
```
- Create `notifications.controller.ts` (CRUD routes for notifications)
- Uncomment the import in `notifications.module.ts`
- Register it in the `controllers:[]` array (currently references undefined symbol)

### 1.2 Fix WebSocket CORS _(30min)_
```
src/backend/notification-service/src/websockets/websockets.gateway.ts:31
```
- Change `origin: '*'` → `origin: process.env.ALLOWED_ORIGINS?.split(',') ?? ['https://app.austa.com.br']`
- Add `ALLOWED_ORIGINS` to `.env.example`

### 1.3 Wire AuditInterceptor into service modules _(3h)_
The `AuditInterceptor` was created by SWARM-C but never imported into any `AppModule`. Add it as a global interceptor in:
- `api-gateway/src/app.module.ts`
- `auth-service/src/app.module.ts`
- `health-service/src/app.module.ts`
- `care-service/src/app.module.ts`
- `plan-service/src/app.module.ts`

### 1.4 Run Prisma migration for AuditLog model _(1h)_
```bash
cd src/backend/shared
npx prisma migrate dev --name add_audit_log
```
The `AuditLog` Prisma model was added to `schema.prisma` by SWARM-C but no migration has been generated.

### 1.5 Replace hardcoded `recordId` in mobile _(1h)_
```
src/web/mobile/src/screens/health/AddMetric.tsx:59
src/web/mobile/src/api/client.ts:13
```
Pull `userId` from auth context instead of hardcoded value.

### 1.6 Install upgraded dependencies _(1h)_
```bash
# Run in each package root — lockfiles are stale
cd src/backend && npm install
cd src/web && npm install
```

**Exit criteria for Phase 1:** `docker-compose up` → all 7 services green, no crash logs, WebSocket connects from allowed origins only.

---

## Phase 2 — Consolidate the Architecture  _(~4 weeks, 2 engineers)_

**Goal:** Eliminate the dual ORM, consolidate the duplicate gamification service, add OpenAPI everywhere.

### 2.1 ORM Consolidation: Migrate TypeORM → Prisma _(~40h, highest ROI architectural change)_

**Affected services (TypeORM today):**
| Service | TypeORM Files | Migration Effort |
|---------|--------------|-----------------|
| `notification-service` | 4 entities (Notification, GamificationNotification, NotificationPreference, NotificationTemplate) | 8h |
| `plan-service` | 4 entities (Plan, Benefit, Coverage, Claim, Document) | 10h |
| `care-service` | 2 entities (Medication, TreatmentPlan) | 4h |
| `health-service` | 2 entities (HealthGoal, DeviceConnection) | 4h |

**Migration pattern per service:**
1. Write `prisma/schema.prisma` for the service (already done for gamification-engine, care-service, auth-service, plan-service partially)
2. Remove `TypeOrmModule.forFeature([])` from module imports
3. Replace `@InjectRepository` + `Repository<T>` patterns with `PrismaService` injection
4. Replace `find({ where: {} })` queries with `prisma.model.findMany({ where: {} })`
5. Run `prisma migrate dev`

**Recommended Prisma version:** stick with what gamification-engine uses. Check: `cat src/backend/gamification-engine/package.json | grep prisma`

### 2.2 Consolidate gamification-service into gamification-engine _(8h)_

`src/backend/gamification-service/` is a stub with only `leaderboard/` in `src/`. The `gamification-engine/` is the real, complete implementation (achievements, quests, rewards, rules, events, profiles, config, leaderboard).

**Action:**
1. Verify `gamification-service/src/leaderboard/` contains anything not already in `gamification-engine/src/leaderboard/`
2. If no unique code: delete `src/backend/gamification-service/` and remove from `docker-compose.yml` + K8s manifests
3. If unique code: merge into `gamification-engine/src/leaderboard/`
4. Update all internal service references to point to `gamification-engine`

### 2.3 Add Swagger/OpenAPI to all services _(12h)_

Only `plan-service` and `care-service` have Swagger today. Standardize:
```typescript
// In every service's main.ts (copy the plan-service pattern):
const config = new DocumentBuilder()
  .setTitle('AUSTA [Service Name] API')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/docs', app, document);
```
Add `@ApiTags`, `@ApiOperation`, `@ApiResponse` to all controllers. This unblocks the frontend team.

### 2.4 Centralize exception handling _(6h)_

Currently 9 `@Catch`/`ExceptionFilter` references but most error handling is inline `try/catch`. Create a shared `GlobalExceptionFilter` in `src/backend/shared/src/exceptions/` and register it as `APP_FILTER` in each service's `AppModule`.

**Exit criteria for Phase 2:** `docker-compose up` + OpenAPI docs accessible at `/api/docs` for all 7 services. Zero TypeORM imports in source (migration complete). Single gamification service.

---

## Phase 3 — Test It Properly  _(~4 weeks, 2 engineers)_

**Goal:** Raise test coverage from 7.2% to 40%+. Current: 15 backend test files / 255 source files = 5.9%.

**The testing gap is the single biggest quality risk.** With 0 unit tests for auth-service, care-service, plan-service, api-gateway, and shared — regressions are invisible.

### 3.1 Priority order for unit tests

Write unit tests in this order (highest risk first):

| Service | Target files | Why first |
|---------|-------------|-----------|
| `auth-service` | `auth.service.ts`, `users.service.ts`, `mfa.service.ts` | Authentication logic — critical path |
| `api-gateway` | `auth.middleware.ts`, `app.module.ts` | Entry point to all services |
| `shared/src/encryption` | `encryption.service.ts` | New PHI crypto — must be tested |
| `shared/src/audit` | `audit.service.ts`, `audit.interceptor.ts` | New HIPAA compliance code |
| `care-service` | `appointments.service.ts`, `telemedicine.service.ts` | Clinical logic |
| `plan-service` | `claims.service.ts`, `plans.service.ts` | Financial logic |
| `health-service` | `insights.service.ts`, `wearables.service.ts` | ML data pipeline |

### 3.2 Target: 138 new test files

The gap to 40%: `255 source × 0.40 = 102 needed tests`. We have 15. Need 87 more unit test files + 20 integration test files = 107 total new files. Rough breakdown:
- 55 service unit tests (mock Prisma with `prisma.mock.ts`)
- 20 controller unit tests (NestJS `Test.createTestingModule`)
- 12 guard/interceptor unit tests
- 20 frontend component tests (React Testing Library)

### 3.3 Fix `type: any` debt _(ongoing, 235 usages)_

The 235 `any` usages (65 in shared alone, 37 in api-gateway) are a test-time quality risk. As you write tests, replace `any` with proper interfaces. Target: shared module drops from 65 → 0 by Phase 3 end.

### 3.4 Frontend test gap

35 test files / 380 source files = 9.2%. The design-system components have 35 tests but mobile has **0 test files**. Add React Native Testing Library tests for all screens (10 screens across 5 directories).

**Exit criteria for Phase 3:** `jest --coverage` shows ≥40% line coverage across backend. Mobile has ≥20 test files. All `shared/src/encryption` and `shared/src/audit` at ≥80% coverage.

---

## Phase 4 — Feature Completeness  _(~6 weeks, 2–3 engineers)_

**Goal:** Close the gap between spec and implementation. Three major features are documented but unimplemented.

### 4.1 LGPD Consent Management _(80h — HIGHEST PRIORITY in this phase)_

**Why this blocks launch:** Lei Geral de Proteção de Dados (LGPD) Art. 7-8 requires explicit, granular, revocable consent before processing any personal data. ANPD can fine up to R$50M. The app processes health data (special category under Art. 11) — even stricter.

**What to build:**
```
src/backend/shared/src/consent/
├── consent.service.ts        # create, revoke, check consent
├── consent.module.ts
├── consent.guard.ts          # @RequiresConsent('health-data') decorator
├── dto/
│   ├── create-consent.dto.ts
│   └── consent-purpose.enum.ts  # HEALTH_DATA, MARKETING, ANALYTICS, RESEARCH
└── index.ts
```

**Data model (add to shared prisma schema):**
```prisma
model ConsentRecord {
  id          String   @id @default(cuid())
  userId      String
  purpose     String   // HEALTH_DATA | MARKETING | ANALYTICS | RESEARCH
  granted     Boolean
  grantedAt   DateTime?
  revokedAt   DateTime?
  ipAddress   String?
  version     String   // consent text version for auditability
  createdAt   DateTime @default(now())
}
```

**DSR (Data Subject Request) flows:**
- Right to access: `GET /privacy/my-data` — export all user data as JSON
- Right to deletion: `DELETE /privacy/my-data` — hard delete + audit log
- Right to portability: `GET /privacy/export` — FHIR R4 bundle format

### 4.2 Fix FHIR IDOR in health-service _(8h)_

```
src/backend/health-service/src/insights/insights.service.ts
src/backend/health-service/src/integrations/fhir/fhir.service.ts
```

FHIR endpoint takes `resourceId` as a path parameter but does not verify the resource belongs to the requesting user. Add ownership guard:
```typescript
// In FhirService.getResource():
const resource = await this.fhirClient.read({ resourceType, id });
if (resource.subject?.reference !== `Patient/${requestingUserId}`) {
  throw new ForbiddenException('Resource does not belong to requesting user');
}
```

### 4.3 Notification Controller _(built in Phase 1)_ + Channel routing _(12h)_

After Phase 1 creates the controller, Phase 4 completes the notification routing logic:
- `channels/` has push, email, SMS channel implementations — verify they are wired to the controller
- Add idempotency keys to prevent duplicate notifications
- Add notification preferences enforcement (user has opted out of email → skip email channel)

### 4.4 Mobile i18n parity _(8h)_

Both `src/web/web/src/i18n/` and `src/web/mobile/src/i18n/` have `pt-BR.ts` and `en-US.ts`. Do a key-by-key diff — mobile is likely missing keys added to web after initial generation.
```bash
# Quick gap check
diff <(node -e "console.log(Object.keys(require('./src/web/web/src/i18n/pt-BR.ts').default).sort().join('\n'))") \
     <(node -e "console.log(Object.keys(require('./src/web/mobile/src/i18n/pt-BR.ts').default).sort().join('\n'))")
```

### 4.5 Social Login (optional P2) _(20h)_

Documented in spec, not implemented. Add OAuth2 providers (Google, Apple — required for App Store) to auth-service:
- NestJS Passport strategy for Google (`passport-google-oauth20`)
- Apple Sign-In (`apple-signin-auth`)
- Link social account to existing email account if email matches

**Exit criteria for Phase 4:** LGPD consent screen appears on first launch. DSR endpoints return valid responses. Notification controller responds to CRUD. FHIR resources are ownership-validated.

---

## Phase 5 — Mobile Parity & Performance  _(~4 weeks, 1–2 engineers)_

**Goal:** Mobile app reaches feature parity with web, passes App Store submission requirements.

### 5.1 Mobile test coverage from 0 → 20+ tests _(from Phase 3 carryover)_

### 5.2 Apple Sign-In _(required for App Store)_
Apple mandates Sign In with Apple if any social login is present. This must be done before App Store submission.

### 5.3 Deep link / Universal link setup
React Navigation deep linking config for health metrics, appointment, and gamification screens.

### 5.4 Push notification integration
The `notification-service` has push channel code but the mobile app has no `expo-notifications` or `react-native-push-notification` setup. Wire up FCM (Android) and APNs (iOS).

### 5.5 Offline support for critical paths
Health metric entry, medication reminders — these must work offline and sync. Add `react-query` with offline persistence or WatermelonDB for local storage.

**Exit criteria for Phase 5:** React Native app passes local TestFlight build. Sign in with Apple works. Push notifications received.

---

## Phase 6 — Launch Hardening  _(~2 weeks, all hands)_

### 6.1 Performance baseline
- Add `clinic.js` or `k6` load test against docker-compose
- Target: api-gateway P99 < 200ms at 100 RPS

### 6.2 Secrets rotation
- Rotate `JWT_SECRET` (it was hardcoded in git history — the fix throws on missing, but old value is in git log)
- Generate fresh `ENCRYPTION_KEY` for production
- Use AWS Secrets Manager or Azure Key Vault — do not use `.env` files in production

### 6.3 Database migration strategy
- Run `prisma migrate deploy` (not `dev`) in production
- Set up pg_dump backup before first migration
- Review `src/backend/shared/prisma/migrations/migration_lock.toml` — currently empty (no migrations generated yet)

### 6.4 Observability
Prometheus is configured (`src/backend/prometheus.yml`), Grafana not yet. Add:
- Request rate / error rate / latency dashboards per service
- Kafka consumer lag alerting
- Prisma slow query logging

### 6.5 Penetration test
Before launch, run OWASP ZAP against staging. Focus: JWT, WebSocket auth, FHIR endpoints, file upload in documents.

**Exit criteria for Phase 6:** All 4 hard blockers resolved. Pen test complete with no Critical/High open. LGPD DPO sign-off. Load test passing at target RPS.

---

## Where to Begin RIGHT NOW

The answer is clear from the blocker analysis:

### Day 1 (Today) — 3 tasks, ~6 hours total

**Task 1 (2h): Fix the notification-service crash**
```
src/backend/notification-service/src/notifications/notifications.module.ts
```
Create `notifications.controller.ts`, uncomment the import. This is blocking ALL local development with docker-compose.

**Task 2 (30min): Fix WebSocket CORS wildcard**
```
src/backend/notification-service/src/websockets/websockets.gateway.ts:31
```
`origin: '*'` → env-var-driven allowlist.

**Task 3 (3h): Wire AuditInterceptor into AppModules**
The HIPAA audit trail exists on disk but is completely inert — not registered in any module. 5 services need it added.

### Day 2 — Run Prisma migration + lockfile regeneration
```bash
cd src/backend/shared && npx prisma migrate dev --name add_audit_log
cd src/backend && npm install   # regenerate lockfiles for upgraded deps
```

### Week 1–2 — Phase 1 completion
Complete all remaining Phase 1 items in the order listed above.

### Month 1 — Phase 2 (ORM consolidation)
The ORM dual-usage is the dominant architectural debt. Every day it stays split is a day TypeORM and Prisma schemas can drift from each other. Start with `notification-service` (smallest, most isolated).

---

## Effort Estimation Summary

| Phase | Duration | Engineer-weeks | Primary risk |
|-------|----------|---------------|--------------|
| Phase 1 — Boot & Run | 2 weeks | 2–3 ew | Notification module crash |
| Phase 2 — Architecture | 4 weeks | 8 ew | ORM migration data loss |
| Phase 3 — Testing | 4 weeks | 8 ew | Low ROI if rushed |
| Phase 4 — Features | 6 weeks | 12–18 ew | LGPD legal exposure |
| Phase 5 — Mobile | 4 weeks | 6–8 ew | App Store review time |
| Phase 6 — Launch | 2 weeks | 4 ew | Pen test findings |
| **Total** | **~22 weeks** | **40–45 ew** | |

With 2 engineers: ~5.5 months to production.  
With 4 engineers: ~3 months to production (Phases 1–3 overlap possible after Phase 1 exits).

---

## Tech Debt Backlog (Post-Launch)

These are real but not launch-blocking:

1. **Blockchain data integrity** — documented in spec (`FUNCTIONAL_REQUIREMENTS.md:19`), 0 implementation. Consider Hyperledger Fabric or a simpler approach (Merkle audit log) given HIPAA constraints on public chains.
2. **WebRTC E2E encryption for telemedicine** — telemedicine service exists, no WebRTC signaling server.
3. **ML-based anomaly detection** — health-service has `insights.service.ts` calling `fhirService` but no actual ML model inference.
4. **ADRs for major decisions** — only 1 ADR (013) exists; add ADRs for ORM choice, auth pattern, gamification event bus, FHIR integration strategy.
5. **Monorepo lockfile strategy** — `yarn.lock` exists at `src/backend/` and `src/web/` but the root uses npm (`package.json` with workspaces). Standardize on one package manager.

---

## Decision Required Now

**Single most important question:** Is the team migrating away from TypeORM in Phase 2, or accepting the dual-ORM as permanent?

- **Consolidate → Prisma** (recommended): ~40h upfront, pays off in 2 months, enables consistent Prisma middleware for encryption/audit across all services
- **Keep TypeORM in some services**: technical debt compounds, EncryptionService Prisma middleware won't cover TypeORM entities (PHI in TypeORM entities stays unencrypted)

This decision gates Phase 2 scope and should be made before Phase 1 exits.
