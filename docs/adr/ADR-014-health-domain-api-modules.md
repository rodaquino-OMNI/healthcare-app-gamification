# ADR-014: Health Domain API Modules

**Status:** Accepted
**Date:** 2026-03-23
**Decision Makers:** Architecture team
**Supersedes:** None
**Related:** ADR-013 (Agent Guide)

## Context

The Figma-to-Code evaluation report (2026-03-23) identified that 62 frontend screens across 5 health domains (Sleep 12, Activity 10, Nutrition 10, Cycle 15, Wellness Companion 15) have no corresponding backend API. The existing `HealthService` provides a generic `getHealthMetrics()` method with type filtering via the `MetricType` enum, and the web hooks (`useSleep`, `useActivity`, `useNutrition`, `useCycle`) call this through GraphQL. However, domain-specific operations (log sleep quality, set activity goals, track meal macros, predict cycles, chat with AI companion) require dedicated REST controllers.

Three routing/security bugs were also found and fixed in Phase 1:
- `ProvidersController`: Missing `@UseGuards(JwtAuthGuard, RolesGuard)` (FIXED)
- `FhirController`: Double `/api` prefix (FIXED)
- `ConsentController`: Double `/api` prefix (FIXED)

## Decision

### 1. Create 5 dedicated NestJS modules inside `src/backend/health-service/src/`

Each module follows the established pattern from `HealthModule`:
- Controller with `@UseGuards(JwtAuthGuard, RolesGuard)`, `@UseFilters(AllExceptionsFilter)`
- `@UseGuards(ConsentGuard)` + `@RequireConsent(ConsentType.HEALTH_DATA_SHARING)` on mutation endpoints
- `@PhiAccess('{Entity}')` for audit logging
- `ValidationPipe` on all `@Body()` parameters
- class-validator DTOs with `@IsNotEmpty`, `@IsNumber`, `@IsString`, `@IsEnum`, `@IsOptional`

### 2. Reuse existing HealthMetric model for Sleep and Activity

`MetricType` enum already includes `SLEEP`, `ACTIVITY`, `STEPS`, `CALORIES`, `DISTANCE`, `FLOORS`. Sleep and Activity services delegate to `HealthMetricsService` for core CRUD and add domain-specific endpoints (trends, goals, quality scores, device sync) on top.

### 3. Create new Prisma models for Nutrition and Cycle

These domains have structured data that doesn't fit the generic `HealthMetric` key-value model:
- `NutritionLog`: mealType, foods (JSON array), calories, macros, date
- `CycleRecord`: startDate, endDate, cycleLength, periodLength, symptoms (JSON), flow intensity

### 4. Add WebSocket gateway for Wellness Companion chat

The AI companion chat requires real-time bidirectional communication. Use `@nestjs/websockets` with `@WebSocketGateway()`. REST endpoints handle non-real-time features (mood check-in, journal, challenges, streaks, goals).

### 5. Keep frontend hooks unchanged

The web hooks already work through the GraphQL `getHealthMetrics` type filter. The new REST controllers serve the mobile screens that need domain-specific operations. No frontend changes needed.

## Module Structure

```
src/backend/health-service/src/
  sleep/
    sleep.controller.ts      # GET /sleep, GET /sleep/:id, POST /sleep, PUT /sleep/:id, GET /sleep/trends, GET /sleep/goals
    sleep.service.ts          # Delegates to HealthMetricsService for MetricType.SLEEP, adds quality/trends
    sleep.module.ts
    dto/create-sleep-record.dto.ts
    dto/update-sleep-record.dto.ts
    dto/filter-sleep.dto.ts
    sleep.controller.spec.ts
    sleep.service.spec.ts
  activity/
    (same structure)          # GET /activity, POST /activity, GET /activity/summary, GET /activity/goals
  nutrition/
    (same structure)          # GET /nutrition, POST /nutrition, GET /nutrition/daily-summary, GET /nutrition/goals
  cycle/
    (same structure)          # GET /cycle, POST /cycle, GET /cycle/predictions, GET /cycle/history
  wellness/
    wellness.controller.ts    # REST: mood, tips, journal, challenges, streaks, goals, insights
    wellness.gateway.ts       # WebSocket: chat:message, chat:reply, chat:quickReply, chat:typing
    wellness.service.ts
    wellness.module.ts
    dto/create-mood-checkin.dto.ts
    dto/create-journal-entry.dto.ts
    dto/filter-wellness.dto.ts
    wellness.controller.spec.ts
    wellness.gateway.spec.ts
    wellness.service.spec.ts
```

## Consequences

### Positive
- Each health domain gets dedicated CRUD + domain logic endpoints
- Mobile screens can call REST directly for domain-specific operations
- GraphQL queries continue working through existing type filter
- Follows established patterns (guards, filters, consent, PHI audit)
- Each module is independently deployable and testable

### Negative
- 42+ new files across 5 modules
- Two Prisma models need migration (`NutritionLog`, `CycleRecord`)
- WebSocket adds infrastructure complexity (Wellness Companion)

### Risks
- Prisma migration must be coordinated across environments
- WebSocket gateway needs load balancer configuration for production
- New controllers must NOT conflict with existing `/health` route prefix

## Verification

- `tsc --noEmit` passes across health-service
- `npm test` passes with 40+ new specs (4 per controller + 4 per service)
- `npx prisma validate` passes with new models
- `grep -r "Controller('api/" src/backend/` returns 0 matches
- All controllers have `@UseGuards(JwtAuthGuard, RolesGuard)` at class level
- All files under 500 lines
- Frontend hooks endpoint paths still work (no breaking changes)
