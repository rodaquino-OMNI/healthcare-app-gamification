# ADR-003: Error Handling Strategy

## Status

Accepted

## Date

2026-02-23

## Context

AUSTA handles sensitive health data for Brazilian patients. An unhandled crash while a user reviews lab results or manages medication schedules erodes trust in ways that are difficult to recover. The app spans 264 mobile screens across 8 navigators, and errors in one journey (e.g., a telemedicine WebRTC failure in Care) must not cascade into unrelated journeys (e.g., Health medication tracking).

Requirements:

- Consistent error UX across all screens without per-screen error handling code.
- Crash isolation between navigators so a single failure does not render the entire app unusable.
- Centralized crash reporting for proactive monitoring.
- Graceful degradation during network outages (common in rural Brazilian healthcare settings).

## Decision

We implement a **3-tier error handling architecture**:

### Tier 1: ErrorBoundary (React Component)

- `src/web/mobile/src/components/shared/ErrorBoundary.tsx` wraps each navigator in the component tree.
- Uses `getDerivedStateFromError` to catch rendering errors and display a fallback UI.
- Supports custom `fallback` prop for journey-specific recovery screens.
- `componentDidCatch` logs errors to the monitoring pipeline.
- A retry mechanism (`handleRetry`) resets the boundary state, allowing re-render without full app restart.

### Tier 2: ErrorState (UI Component)

- `src/web/mobile/src/components/shared/ErrorState.tsx` provides a consistent error display.
- Journey-aware theming: uses Health (green), Care (orange), or Plan (blue) accent colors based on context.
- Displays configurable icon, title, message, and optional retry button.
- Includes `accessibilityRole="alert"` for screen reader announcement.
- All strings support i18n for pt-BR and en-US.

### Tier 3: Sentry (Crash Reporting)

- Kubernetes-deployed Sentry configuration in `infrastructure/monitoring/sentry.yml`.
- 10% trace sampling rate to balance cost and observability.
- Stack traces attached to all error events.
- Secrets (DSN, auth token) injected via ExternalSecrets Operator from AWS Secrets Manager.
- User context anonymized per LGPD requirements before transmission.

### API Error Handling

- REST client (`api/client.ts`) response interceptor classifies errors by HTTP status (401 = auth, 403 = authorization, network = offline).
- Network connectivity checked via `NetInfo` before every request; offline errors trigger a dedicated offline indicator.
- API errors are mapped to user-friendly i18n messages at the hooks layer, not in screen components.

## Consequences

### Positive

- **Crash isolation**: An error in CareNavigator (68 screens) does not affect HealthNavigator (47 screens). Users can continue using unaffected journeys.
- **Consistent UX**: Every error screen follows the same visual pattern (icon + title + message + retry), building user confidence in the app's reliability.
- **Proactive monitoring**: Sentry integration enables the team to identify and fix crashes before users report them.
- **Accessibility**: Error states are announced by screen readers, meeting WCAG 2.1 AA requirements.

### Negative

- **ErrorBoundary limitations**: Only catches rendering errors; async errors in event handlers require try/catch at the call site.
- **Retry is coarse-grained**: The boundary retry resets the entire navigator subtree, which may lose in-progress form state.
- **Sentry cost**: 10% trace sampling on 7 backend services generates non-trivial event volume at scale.

## References

- `src/web/mobile/src/components/shared/ErrorBoundary.tsx` — React error boundary, 77 lines
- `src/web/mobile/src/components/shared/ErrorState.tsx` — Error display component, 105 lines
- `src/web/mobile/src/api/client.ts` — API error interceptors
- `infrastructure/monitoring/sentry.yml` — Sentry K8s configuration, 116 lines
