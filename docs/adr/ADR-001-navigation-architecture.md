# ADR-001: Navigation Architecture

## Status

Accepted

## Date

2026-02-23

## Context

AUSTA is a healthcare super-app serving the Brazilian market with four primary journeys: Health (green), Care (orange), Plan (blue), and Gamification (purple). The mobile application has grown to 271+ screens across 8 navigators, with the CareNavigator alone managing 68 screens (symptom checker, doctor search, telemedicine, post-visit flows). The web application mirrors this with 372+ routes including Next.js page paths.

Key pressures driving this decision:

- **Scale**: 264 mobile screens and 252 web pages require predictable route management.
- **Team autonomy**: Multiple squads work on different journeys concurrently.
- **Type safety**: Navigation parameter mismatches cause runtime crashes that are difficult to reproduce.
- **Deep linking**: Push notifications and external links must resolve to specific screens with parameters.
- **Cross-platform parity**: Mobile (React Navigation) and web (Next.js) must share route identity.

## Decision

We adopt **React Navigation v6** with a domain-aligned, type-safe navigator hierarchy:

1. **8 domain navigators** — Auth (20 screens), Home (19), Care (68), Health (47), Plan (8), Settings (33), Gamification (7), and a Root navigator that gates Auth vs. Main.
2. **Typed ParamList per navigator** — Each navigator has a corresponding TypeScript ParamList in `src/web/mobile/src/navigation/types.ts` (e.g., `CareStackParamList`, `HealthStackParamList`). All screen params are explicitly typed; screens with no params use `undefined`.
3. **Centralized route constants** — `src/web/mobile/src/constants/routes.ts` (mobile) and `src/web/shared/constants/routes.ts` (shared) define all route names as `const` objects grouped by journey. Legacy route objects are re-exported with `@deprecated` annotations.
4. **Composite navigation props** — Cross-navigator navigation uses `CompositeNavigationProp` to maintain type safety when a Home tab screen needs to navigate into Care.
5. **Bottom tab as entry point** — `MainTabParamList` uses `NavigatorScreenParams<T>` for each journey, enabling tab-to-stack nesting with full type inference.
6. **Route naming convention** — All routes follow `{Journey}{Feature}` pattern (e.g., `CareSymptomChecker`, `HealthMedicationAdd`) to prevent collisions across navigators.

## Consequences

### Positive

- **Compile-time route safety**: Passing `{ doctorId: number }` where `{ doctorId: string }` is expected fails at compile time, not at runtime in production.
- **Domain isolation**: A breaking change in CareNavigator does not affect Health or Plan navigators, enabling independent squad releases.
- **Deep linking parity**: Route constants shared between mobile and web ensure notification payloads resolve correctly on both platforms.
- **Onboarding clarity**: New developers navigate the codebase by journey domain, matching business language.

### Negative

- **ParamList maintenance**: Adding a new screen requires updating the ParamList type, the route constant, and the navigator registration (3 touch points).
- **Large CareNavigator**: 68 screens in a single navigator increases bundle size; may need lazy loading via `React.lazy` or sub-navigators in the future.
- **Legacy route coexistence**: Deprecated `MOBILE_CARE_ROUTES` / `MOBILE_HEALTH_ROUTES` objects remain for backward compatibility, adding cognitive load until fully removed.

## References

- `src/web/mobile/src/navigation/types.ts` — 9 ParamList types, 368 lines
- `src/web/mobile/src/constants/routes.ts` — Mobile route constants, 271 entries
- `src/web/shared/constants/routes.ts` — Shared route constants with web paths, 405 lines
- [React Navigation TypeScript guide](https://reactnavigation.org/docs/typescript/)
