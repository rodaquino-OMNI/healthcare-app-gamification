# Prompt for Claude Code / Claude in VS Code

Copy everything below the line and paste it as your first message to Claude Code or Claude in VS Code.

---

## Task: Launch the AUSTA Healthcare SuperApp in the iOS Simulator

I need you to get this React Native / Expo mobile app running in the iOS Simulator on my Mac. Do everything for me — install deps, fix errors, build, and launch. I want to see the app running with realistic demo data so I can navigate through screens and show it to someone. Minimize manual steps for me.

### Project Context

This is the **AUSTA Healthcare SuperApp** — a healthcare platform with gamification. It's a monorepo structured like this:

```
/                          ← root (yarn workspaces)
├── src/web/               ← frontend workspace root (yarn workspaces: design-system, shared, mobile, web)
│   ├── mobile/            ← React Native / Expo app (THIS IS WHAT WE'RE LAUNCHING)
│   │   ├── App.tsx        ← Entry point (loads fonts, providers, RootNavigator)
│   │   ├── app.json       ← Expo config (bundle ID: br.com.austa.superapp)
│   │   ├── eas.json       ← EAS build profiles
│   │   ├── babel.config.js
│   │   ├── metro.config.js ← Monorepo-aware, path aliases, watches shared + design-system
│   │   ├── package.json   ← React Native 0.73, Expo ~52, React Navigation 6.x
│   │   └── src/
│   │       ├── screens/    ← 465 screens (auth, care, health, plan, gamification, wellness, etc.)
│   │       ├── navigation/ ← RootNavigator → AuthNavigator (if !authenticated) or MainNavigator (bottom tabs)
│   │       ├── api/        ← Apollo Client (GraphQL) + Axios (REST)
│   │       │   ├── client.ts    ← API base URL defaults to https://api.austa.com.br (NOT running)
│   │       │   └── mocks/       ← Mock data files: care.mocks.ts, health.mocks.ts, gamification.mocks.ts, plan.mocks.ts
│   │       ├── context/    ← AuthContext (JWT-based, stores tokens in secure storage)
│   │       ├── hooks/      ← useAuth (isAuthenticated checks authState.status === 'authenticated')
│   │       ├── constants/  ← config.ts (API_BASE_URL, feature flags)
│   │       └── assets/     ← fonts (PlusJakartaSans, Nunito-Bold), images (logo, splash, icons)
│   ├── shared/            ← Shared types, constants, GraphQL queries
│   ├── design-system/     ← Component library (27+ categories, gamification components)
│   └── web/               ← Next.js frontend (not needed for this task)
└── src/backend/           ← 7 NestJS microservices (NOT running, not needed now)
```

### Key Technical Details

- **Monorepo**: Yarn workspaces. Must install from `src/web/` to resolve all workspace deps.
- **Metro config** watches `../shared` and `../design-system` for monorepo code sharing.
- **No `ios/` directory exists yet** — you need to run `npx expo prebuild --platform ios` to generate it.
- **Android dir exists** but incomplete — ignore it, focus on iOS only.
- **node_modules exists** at `src/web/mobile/node_modules` but may be stale.
- **The backend is NOT running** — the API at `api.austa.com.br` will not respond.
- **Auth blocks all screens** — `RootNavigator.tsx` checks `isAuthenticated` and shows `AuthNavigator` (login) if false, `MainNavigator` (the real app) if true.

### What You Must Do (in order)

#### Phase 1: Install & Prebuild

1. `cd src/web && yarn install` — install all workspace dependencies
2. `cd mobile && npx expo prebuild --platform ios` — generate the `ios/` directory
3. If CocoaPods doesn't run automatically: `cd ios && pod install && cd ..`
4. Fix any prebuild errors (common: missing plugin configs, version mismatches)

#### Phase 2: Enable Demo Mode (CRITICAL — without this you're stuck on the login screen)

The backend isn't running, so auth API calls will fail and you'll be stuck on the login/welcome screen forever. You need to create a demo bypass. Here's the approach:

**Option A (preferred): Mock the AuthContext to auto-authenticate**

Edit `src/web/mobile/src/context/AuthContext.tsx`:
- Add an env check or a simple flag like `const DEMO_MODE = true;`
- When `DEMO_MODE` is true, set initial auth state to `status: 'authenticated'` with a fake user/session
- This lets you skip past the auth screens and land directly in the MainNavigator with bottom tabs

**Option B: Create a mock API interceptor**

Edit `src/web/mobile/src/api/client.ts`:
- Intercept API calls and return mock data from the `mocks/` directory
- Return a fake auth token for login requests
- Return mock data for health, care, plan, gamification endpoints

Whichever approach you choose, make sure:
- The app boots directly into the authenticated MainNavigator
- The mock data from `src/web/mobile/src/api/mocks/` is wired up so screens render with content
- Console errors from failed network requests are minimized
- **Mark all demo changes clearly with `// DEMO_MODE` comments so they're easy to find and revert**

#### Phase 3: Build & Launch

1. `npx expo run:ios` — compile native project and launch in iOS Simulator
2. First build takes 3-5 minutes. Watch for errors.
3. Common issues to watch for:
   - **Missing native modules**: Some deps like `react-native-ssl-pinning`, `react-native-health`, `react-native-agora` may fail on simulator. If they crash, wrap their imports in try/catch or mock them for simulator.
   - **Font loading errors**: Fonts are at `src/assets/fonts/` — verify paths match App.tsx requires.
   - **Metro bundler errors**: Path alias issues — metro.config.js has the aliases, make sure they resolve.
   - **Workspace resolution errors**: If `@austa/design-system` or `@austa/web-shared` can't resolve, check that `src/web/design-system` and `src/web/shared` built correctly.

#### Phase 4: Verify & Polish

1. Confirm the app opens in the simulator
2. Confirm you land on the main screen (bottom tabs: Health, Care, Plan, Gamification)
3. Try navigating between tabs and into sub-screens
4. If any screen crashes, check the Metro terminal for the error and fix it
5. Take a screenshot or let me know what you see

### Important Rules

- **DO NOT modify the backend** — we're running mobile only
- **DO NOT try to start backend services** — no Docker, no database
- **Keep all demo-mode changes reversible** — use a single flag, comment everything with `// DEMO_MODE`
- **If you hit a native module crash on simulator** (HealthKit, Agora, Biometrics, SSL pinning), stub it out rather than trying to make it work — these need a real device
- **Read files before editing them** — this is a large codebase, understand context first
- **If `yarn install` fails**, check for resolution conflicts in package.json — the monorepo has specific overrides for React 18 vs 19 compatibility

### Success Criteria

The app is running in the iOS Simulator, I can see the main screens with realistic healthcare data (appointments, health metrics, insurance plans, achievements), and I can navigate between the different journeys (Health, Care, Plan, Gamification). Login is bypassed for demo purposes.
