# ADR-002: API Contract Strategy

## Status

Accepted

## Date

2026-02-23

## Context

The AUSTA mobile app must function during development before backend services are fully operational. Historically, 90+ `MOCK_` constants were hardcoded directly in screen files, creating tight coupling between UI components and test data. As the backend matures (7 NestJS services behind an API gateway), the app needs a seamless transition from mock to real data without modifying screen-level code.

Additional concerns:

- **Dual protocol**: Some domains (Plan) use both GraphQL and REST, while others (Care) are REST-only and Health is GraphQL-only.
- **Security**: The REST client must prevent SSRF attacks (CVE-2023-45857, CVE-2024-28849) and CSRF vulnerabilities.
- **Offline resilience**: Healthcare users in areas with poor connectivity need graceful degradation.

## Decision

We implement a **dual-client architecture with environment-based mock switching**:

1. **Two API clients** — `graphQLClient` (Apollo Client 3.x with `cache-and-network` policy) and `restClient` (Axios with security interceptors). Both exported from `src/web/mobile/src/api/client.ts`.

2. **Mock toggle via environment** — `src/web/mobile/src/api/config.ts` exports `API_CONFIG.useMocks`, driven by `EXPO_PUBLIC_USE_MOCKS`. Default is `true` (safe for development). Set to `'false'` to activate real backends.

3. **Centralized mock data** — All mocks live in `src/web/mobile/src/api/mocks/` with one file per domain (`care.mocks.ts`, `health.mocks.ts`, `plan.mocks.ts`, `gamification.mocks.ts`). Screens never import mocks directly.

4. **Domain API modules** — One file per journey (`api/care.ts`, `api/health.ts`, `api/plan.ts`) encapsulates the mock-or-real decision. Each exports typed functions that check `API_CONFIG.useMocks` internally.

5. **SSRF prevention** — The REST client validates every request URL against an allowlist of domains (`api.austa.com.br`, `cdn.austa.com.br`, `auth.austa.com.br`, `storage.googleapis.com`). Private IP ranges and localhost are blocked. Absolute URLs are normalized to relative paths to force baseURL usage.

6. **CSRF protection** — Every REST request includes a generated `X-CSRF-Token` header and `X-Requested-With: XMLHttpRequest` via Axios interceptors.

7. **Network-aware requests** — The request interceptor checks `NetInfo.isConnected` before every call, throwing a descriptive error for offline scenarios.

## Consequences

### Positive

- **Zero screen changes for backend cutover**: Flipping `EXPO_PUBLIC_USE_MOCKS=false` activates real APIs across all 264 screens without code modifications.
- **Centralized mock ownership**: Mock data duplication drops from 90+ inline constants to 4 domain mock files.
- **Security by default**: SSRF and CSRF protections are enforced at the client level, not per-request.
- **Type alignment**: API module return types serve as the contract between frontend and backend teams.

### Negative

- **Dual-client complexity**: Developers must understand when to use GraphQL vs. REST for each domain.
- **Mock drift risk**: Mock data may diverge from real API responses over time; requires periodic validation.
- **Environment coupling**: `EXPO_PUBLIC_USE_MOCKS` must be correctly set per environment (development, preview, production).

## References

- `src/web/mobile/src/api/client.ts` — Dual client with SSRF/CSRF protections, 193 lines
- `src/web/mobile/src/api/config.ts` — Environment-based mock toggle
- `src/web/mobile/src/api/mocks/` — Centralized mock data directory
- `src/web/mobile/src/api/plan.ts` — Example domain module (GraphQL + REST, 181 lines)
