# Prompt for Claude Code / Claude in VS Code

Copy everything below the line and paste it as your first message to Claude Code or Claude in VS Code.

---

## Task: Launch the AUSTA Healthcare SuperApp in the iOS Simulator

I need you to get this React Native / Expo mobile app building and running in the iOS Simulator on my Mac. A previous session already did significant prep work (detailed below). Pick up where it left off — fix any remaining build errors and get the app rendering in the simulator. Minimize manual steps for me.

### Project Context

This is the **AUSTA Healthcare SuperApp** — a healthcare platform with gamification. It's a monorepo:

```
/                          ← root (yarn workspaces)
├── src/web/               ← frontend workspace root (yarn workspaces: design-system, shared, mobile, web)
│   ├── mobile/            ← React Native / Expo app ← THIS IS WHAT WE'RE LAUNCHING
│   │   ├── App.tsx        ← Entry point (loads fonts, providers, RootNavigator)
│   │   ├── index.js       ← AppRegistry entry (registers 'main' for Expo Go)
│   │   ├── app.json       ← Expo config (bundle ID: br.com.austa.superapp)
│   │   ├── eas.json       ← EAS build profiles
│   │   ├── babel.config.js ← babel-preset-expo + reanimated plugin
│   │   ├── metro.config.js ← Monorepo-aware, path aliases, native module mocks
│   │   ├── package.json   ← React Native 0.76.9, Expo ~52, React 19.2.0
│   │   ├── ios/           ← ALREADY GENERATED via expo prebuild
│   │   └── src/
│   │       ├── screens/    ← 465 screens (auth, care, health, plan, gamification, wellness, etc.)
│   │       ├── navigation/ ← RootNavigator → AuthNavigator (if !authenticated) or MainNavigator (bottom tabs)
│   │       ├── api/        ← Apollo Client (GraphQL) + Axios (REST)
│   │       │   ├── client.ts
│   │       │   └── mocks/  ← Mock data: care.mocks.ts, health.mocks.ts, gamification.mocks.ts, plan.mocks.ts
│   │       ├── context/    ← AuthContext (DEMO_MODE=true already set — auto-authenticates)
│   │       ├── mocks/      ← Metro-resolved mocks: device-info-mock.js, mmkv-mock.js
│   │       ├── hooks/      ← useAuth (isAuthenticated checks authState.status === 'authenticated')
│   │       ├── constants/  ← config.ts (API_BASE_URL, feature flags)
│   │       └── assets/     ← fonts (PlusJakartaSans Regular/Medium/SemiBold/Bold, Nunito-Bold), images
│   ├── shared/            ← Shared types, constants, GraphQL queries
│   ├── design-system/     ← Component library (27+ categories, gamification components)
│   └── web/               ← Next.js frontend (not needed for this task)
└── src/backend/           ← 7 NestJS microservices (NOT running, not needed)
```

### What a Previous Session Already Completed

A previous Claude session made these changes to prepare for demo mode. **Do NOT redo or revert these — they are intentional:**

1. **package.json** — Upgraded to Expo SDK 52 compatible versions:
   - React 19.2.0, React Native 0.76.9
   - react-native-reanimated 3.16.7, gesture-handler 2.20.2, safe-area-context 4.12.0, screens 4.4.0
   - Added expo-image-picker, expo-local-authentication, react-native-url-polyfill
   - Removed formik, yup, @hookform/resolvers (replaced by zod), removed expo-dev-client
   - Removed @react-native-firebase/*, @react-native-community/netinfo, @react-native-async-storage/async-storage
   - Removed overrides/resolutions blocks (consolidated to root)
   - Added `"main": "./index.js"`

2. **app.json** — Cleaned for Expo Go compatibility:
   - Removed `googleServicesFile` references (Firebase removed)
   - Cleared `plugins: []` (no native plugins that break Expo Go)
   - Cleared `extra: {}` and removed EAS project ID / update URL placeholders

3. **metro.config.js** — Added demo mode support:
   - Added `config.projectRoot = __dirname` (fixes yarn workspaces hoisting)
   - Added `DEMO_MOCKS` resolver for `react-native-device-info` → `src/mocks/device-info-mock.js`
   - Added `DEMO_MOCKS` resolver for `react-native-mmkv` → `src/mocks/mmkv-mock.js`
   - Updated `watchFolders` to include project root and root node_modules

4. **AuthContext.tsx** — Demo mode bypass:
   - Added `const DEMO_MODE = true;` at top
   - When DEMO_MODE=true, useEffect sets auth state to `{status: 'authenticated', session: {accessToken: 'demo-token-xxx', ...}}`
   - Skips `loadPersistedSession()`, `migrateFromAsyncStorage()`, and `persistSession()` calls

5. **App.tsx** — Font adjustments:
   - Commented out PlusJakartaSans-Light and PlusJakartaSans-ExtraBold (font files not present)
   - Added `HUMAN-ACTION(ASSET-003)` comment about downloading missing fonts

6. **tsconfig.json** — Fixed typeRoots to `["../../../node_modules/@types", "./src/types"]`

7. **index.js** — Created new entry point:
   - Imports `react-native-url-polyfill/auto` (Hermes URL.protocol fix)
   - Registers app as `'main'` (required by Expo Go)
   - Suppresses noisy LogBox warnings

8. **New mock files created:**
   - `src/mocks/device-info-mock.js` — Stubs react-native-device-info (returns simulator values)
   - `src/mocks/mmkv-mock.js` — In-memory MMKV replacement

9. **ios/ directory** — Generated via `npx expo prebuild --platform ios` (Xcode project, Pods installed)

### What You Need To Do Now

The prep work above got the project configured but the build may not be clean yet. Your job:

#### Step 1: Verify dependencies are installed
```bash
cd src/web && yarn install
cd mobile
```
If yarn install fails, diagnose and fix. Common issues: workspace resolution conflicts, peer dependency mismatches.

#### Step 2: Try building for iOS Simulator
```bash
npx expo run:ios
```
This will compile the native project and launch the simulator. Watch for errors.

#### Step 3: Fix any build/runtime errors
Likely issues you may encounter:

- **Import errors for removed packages** — Firebase (`@react-native-firebase/*`), AsyncStorage, NetInfo were removed from package.json but may still be imported in source files. Find and stub/mock those imports.
- **Shared workspace build errors** — `@austa/design-system` and `@austa/web-shared` may need building first: `cd ../design-system && yarn build` and `cd ../shared && yarn build`
- **Native module crashes on simulator** — `react-native-agora`, `react-native-health`, `react-native-biometrics`, `react-native-ssl-pinning`, `react-native-vision-camera` won't work in simulator. If they crash at import time, add them to the `DEMO_MOCKS` map in metro.config.js with stub files.
- **Missing type exports from @shared/** — The `@shared/types/auth.types` import in AuthContext.tsx must resolve. Check `../shared/types/auth.types.ts` exists and exports `AuthSession` and `AuthState`.
- **Metro bundler can't resolve modules** — Check metro.config.js extraNodeModules and watchFolders. The monorepo structure means some deps are hoisted to `src/web/node_modules` or the root `node_modules`.
- **CocoaPods out of sync** — If Xcode build fails with linking errors: `cd ios && pod install && cd ..`
- **Missing fonts at runtime** — If app crashes on font load, check that all 5 font .ttf files exist in `src/assets/fonts/`

#### Step 4: Get past the auth screen
DEMO_MODE is already set in AuthContext.tsx. The app should auto-authenticate and show MainNavigator with bottom tabs. If you still see the login screen, check that:
- `DEMO_MODE = true` in `src/context/AuthContext.tsx`
- The fake session object has `status: 'authenticated'`
- `RootNavigator.tsx` reads `isAuthenticated` from `useAuth()` hook

#### Step 5: Wire up mock data for screen content (if screens are empty)
Mock data files exist at `src/api/mocks/`:
- `care.mocks.ts` — Appointments, doctor reviews, doctor details
- `health.mocks.ts` — Health metrics, goals
- `gamification.mocks.ts` — Achievements, quests, leaderboard
- `plan.mocks.ts` — Insurance plans, benefits

If screens render but show no data (because the API is unreachable), intercept the API calls in `src/api/client.ts` to return this mock data instead of making real network requests.

### Important Rules

- **DO NOT modify the backend** — we're running mobile only
- **DO NOT try to start backend services** — no Docker, no database needed
- **Keep all demo changes marked with `// DEMO_MODE` comments** so they're easy to find and revert
- **If a native module crashes on simulator**, stub it in metro.config.js DEMO_MOCKS rather than removing it from the codebase
- **Read files before editing them**
- **When you fix one error, rebuild immediately** to see if the next error appears — don't try to fix everything speculatively

### Success Criteria

The app is running in the iOS Simulator. I can see the main screen with bottom tabs (Health, Care, Plan, Gamification). I can navigate between tabs and into sub-screens. Login is bypassed via DEMO_MODE. Ideally screens show mock healthcare data (appointments, metrics, plans, achievements).
