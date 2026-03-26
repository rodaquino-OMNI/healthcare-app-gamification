# Plan: Make Design System Components React Native Compatible

**Status:** DRAFT
**Date:** 2026-03-26
**Scope:** `src/web/design-system/src/` → native variants for mobile
**Estimated files to create:** 17 `.native.tsx` + 1 `index.native.ts`
**Estimated total new lines:** ~1,400

---

## Context

The AUSTA design system (`src/web/design-system/src/`) was designed from a Figma mobile file — all components are meant to be mobile-compatible. However, the implementation uses web-only APIs:

- **59 `.styles.ts` files** use `styled-components` with HTML elements
- **173 occurrences** of `styled.div`, `styled.span`, `styled.button`, `styled.input`, `styled.label` across **54 of 59** style files
- **0 files** use React Native primitives (`View`, `Text`, `TouchableOpacity`)
- The mobile app relies on type declarations in `module-declarations.d.ts` (lines 427-448) that stub DS modules — all rich DS styling is lost at runtime

## Impact

**186 mobile screen/component files** import from `@austa/design-system` (1,091 total import occurrences). The most-used DS components in mobile:

| Component | Import count | Web-only elements | Complexity |
|-----------|-------------|-------------------|------------|
| Tokens (colors, spacing, borderRadius, typography, sizing) | 500+ | None — pure JS objects | **Already work** |
| Themes (base.theme, darkTheme) | 96 | None — pure JS objects | **Already work** |
| Button | 24 | `styled.span`, `styled.button` | Medium (323L) |
| Text | 16 | `styled.span` | Medium (268L) |
| Card | 15 | Box → `styled.div` | Simple (126L) |
| Input | 9 | `styled.input`, `<span>` | Medium (199L) |
| Badge | 8 | `styled.span` | Medium (278L) |
| Select | 7 | `<a>`, `styled.div` | Complex (336L) |
| Modal | 5 | `styled.div` | Medium (222L) |
| Checkbox | 5 | `<div>`, `<input>`, `<label>`, `<span>` | Medium (168L) |
| ProgressBar | 4 | `styled.div` | Simple (157L) |
| Box (primitive) | 3 | `styled.div` (in Box.styles.ts) | Simple (135L) |
| Avatar | 3 | `styled.div` | Simple (157L) |
| Icon | 1 | `styled.span`, `<svg>`, `<path>` | Medium (277L) |
| LineChart | 1 | `victory` (web), `styled.div` | Complex (256L) |
| MetricCard | 1 | `<div>` | Medium (274L) |
| DeviceCard | 1 | `styled-components` | Simple (157L) |

## Root Cause

Every `.styles.ts` file uses `styled-components` (web) instead of `styled-components/native`. The styled components target HTML elements (`styled.div`, `styled.span`) instead of RN primitives (`styled(View)`, `styled(Text)`).

---

## Approach: Platform-Specific `.native.tsx` Variants

React Native / Metro supports platform-specific file extensions: `Component.native.tsx` is resolved instead of `Component.tsx` when bundling for iOS/Android. This is the standard React Native pattern.

### Strategy

1. **Don't touch existing web files** — they work for the Next.js web app
2. **Create `.native.tsx` variants** for the 17 components used by mobile
3. Each native variant uses `StyleSheet.create()` + RN primitives (`View`, `Text`, `TouchableOpacity`, `TextInput`)
4. **Create a native barrel entry** (`index.native.ts`) for Metro resolution
5. Token files already work cross-platform — no changes needed

### Critical: Metro Resolution Path

**Problem identified during review:** Mobile files import `@austa/design-system` which resolves via `package.json` → `main: "dist/index.js"`. Platform-specific `.native.tsx` files in `src/` will NOT be picked up through the dist path.

**Solution — add `react-native` field to `package.json`:**

```json
{
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "react-native": "src/index.native.ts"
}
```

Metro respects the `react-native` field in `package.json` and will resolve to `src/index.native.ts` when bundling for iOS/Android. This native barrel re-exports from `.native.tsx` variants for components that have them, and passes through web versions for tokens/themes (which already work cross-platform).

**Alternative (if `react-native` field causes issues):** Add to `metro.config.js` `resolveRequest`:

```js
if (moduleName === '@austa/design-system' && platform !== 'web') {
  return { type: 'sourceFile', filePath: path.resolve(__dirname, '../design-system/src/index.native.ts') };
}
```

---

## Priority Order (by import count x visual impact)

### Phase 1 — Primitives (unblock all other components)

1. `primitives/Box/Box.native.tsx` — foundation for Card and others
2. `primitives/Text/Text.native.tsx` — used everywhere
3. `primitives/Icon/Icon.native.tsx` — uses `<svg>` → replace with `react-native-svg` or icon font
4. `primitives/Touchable/Touchable.native.tsx` — already has some RN imports, minimal changes

### Phase 2 — High-use components

5. `components/Button/Button.native.tsx` (24 imports)
6. `components/Card/Card.native.tsx` (15 imports) — wraps Box
7. `components/Input/Input.native.tsx` (9 imports)
8. `components/Badge/Badge.native.tsx` (8 imports)

### Phase 3 — Medium-use components

9. `components/Modal/Modal.native.tsx` (5 imports) — use RN `Modal`
10. `components/Checkbox/Checkbox.native.tsx` (5 imports)
11. `components/ProgressBar/ProgressBar.native.tsx` (4 imports)
12. `components/Avatar/Avatar.native.tsx` (3 imports)
13. `components/Select/Select.native.tsx` (7 imports) — use RN `Picker` or custom dropdown

### Phase 4 — Low-use / complex components

14. `components/DatePicker/DatePicker.native.tsx` (1 import) — use `@react-native-community/datetimepicker`
15. `charts/LineChart/LineChart.native.tsx` (1 import) — use `victory-native` or `react-native-svg`
16. `health/MetricCard/MetricCard.native.tsx` (1 import)
17. `health/DeviceCard/DeviceCard.native.tsx` (1 import)

---

## Implementation Pattern

Each `.native.tsx` file:

- Imports the same TypeScript interface from the web version (or from a shared `.types.ts`)
- Uses RN primitives instead of HTML elements
- Maps DS token values to RN `StyleSheet` properties
- Preserves the same public API (props, exports)

```tsx
// Example: Box.native.tsx
import React from 'react';
import { View, StyleSheet, type ViewStyle } from 'react-native';
import type { BoxProps } from './Box';
import { spacing } from '../../tokens/spacing';
import { colors } from '../../tokens/colors';

export const Box: React.FC<BoxProps> = ({ children, padding, margin, ...rest }) => {
  const dynamicStyles: ViewStyle = {
    ...(padding && { padding: spacing[padding] }),
    ...(margin && { margin: spacing[margin] }),
  };
  return <View style={[styles.container, dynamicStyles]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    // default Box styles
  },
});
```

---

## Files to Create

| New file | Lines (est.) | Based on |
|----------|-------------|----------|
| `src/index.native.ts` | ~50 | New barrel for native |
| `primitives/Box/Box.native.tsx` | ~80 | Box.tsx (135L) |
| `primitives/Text/Text.native.tsx` | ~100 | Text.tsx (268L) |
| `primitives/Icon/Icon.native.tsx` | ~80 | Icon.tsx (277L) |
| `primitives/Touchable/Touchable.native.tsx` | ~60 | Touchable.tsx (164L) |
| `components/Button/Button.native.tsx` | ~120 | Button.tsx (323L) |
| `components/Card/Card.native.tsx` | ~60 | Card.tsx (126L) |
| `components/Input/Input.native.tsx` | ~90 | Input.tsx (199L) |
| `components/Badge/Badge.native.tsx` | ~80 | Badge.tsx (278L) |
| `components/Modal/Modal.native.tsx` | ~80 | Modal.tsx (222L) |
| `components/Checkbox/Checkbox.native.tsx` | ~70 | Checkbox.tsx (168L) |
| `components/ProgressBar/ProgressBar.native.tsx` | ~60 | ProgressBar.tsx (157L) |
| `components/Avatar/Avatar.native.tsx` | ~60 | Avatar.tsx (157L) |
| `components/Select/Select.native.tsx` | ~100 | Select.tsx (336L) |
| `components/DatePicker/DatePicker.native.tsx` | ~80 | DatePicker.tsx |
| `charts/LineChart/LineChart.native.tsx` | ~120 | LineChart.tsx (256L) |
| `health/MetricCard/MetricCard.native.tsx` | ~100 | MetricCard.tsx (274L) |
| `health/DeviceCard/DeviceCard.native.tsx` | ~70 | DeviceCard.tsx (157L) |

**Total: ~1,460 lines across 18 files**

## Files to Modify

| File | Change |
|------|--------|
| `src/web/design-system/package.json` | Add `"react-native": "src/index.native.ts"` field |
| `src/web/mobile/src/types/module-declarations.d.ts` | Remove DS module stubs (lines 427-448) after native variants are in place |
| `src/web/mobile/src/components/shared/ErrorState.tsx` | Revert to use real DS imports (they'll resolve to `.native.tsx`) |

## What NOT to Change

- No changes to web `.tsx` files — they work for Next.js
- No changes to `.styles.ts` files — web-only
- No changes to `tokens/` — already cross-platform
- No changes to `themes/` — already cross-platform
- No changes to mobile screen files — they import from `@austa/design-system` which will auto-resolve `.native.tsx` via the `react-native` package.json field
- No changes to `metro.config.js` `DEMO_MOCKS` — DS is not in the mock list (mocks are for native-only packages like MMKV, biometrics, etc.)

## Dependencies to Add

| Package | Reason | Phase |
|---------|--------|-------|
| `react-native-svg` | Icon component (replaces `<svg>/<path>`) | Phase 1 |
| `@react-native-community/datetimepicker` | DatePicker native equivalent | Phase 4 |
| `victory-native` | LineChart native equivalent (if using victory) | Phase 4 |

Note: `react-native-svg` may already be available via Expo (`expo install react-native-svg`).

---

## Verification

### Per-Phase Gates

After each phase, verify:

1. **Metro resolution:** `npx expo start` — no "Unable to resolve module" errors
2. **Import test:** Confirm Metro bundles `.native.tsx` (not `.tsx`) for each component — check Metro logs
3. **Render test:** Component renders in iOS simulator without crash

### Final Verification (after all phases)

1. **Visual check:** Screenshot each of the 5 main tabs in simulator — DS components should render with proper tokens (colors, spacing, typography)
2. **Tab navigation:** All 5 main tabs render without crashes
3. **Component spot-check:** Open screens that use Button, Card, Badge, Input — verify styled rendering (not plain text stubs)
4. **Web regression:** `cd src/web && yarn build` — verify Next.js still resolves the `.tsx` versions (not `.native.tsx`)
5. **TypeScript:** `tsc --noEmit` passes for both web and mobile
6. **Type declarations cleanup:** Confirm `module-declarations.d.ts` DS stubs (lines 427-448) can be removed without TS errors

### Smoke Test Screens (high DS component density)

| Screen | Key DS components used |
|--------|----------------------|
| `screens/care/SymptomResult.tsx` | Card, Badge, Button, Text, Icon (8 DS imports) |
| `screens/health/MedicationDetail.tsx` | Card, Input, Button, Text, Modal (9 DS imports) |
| `screens/health/MedicationEdit.tsx` | Input, Button, Select, Checkbox (10 DS imports) |
| `screens/care/SymptomConditionsList.tsx` | Card, Badge, Text, ProgressBar (8 DS imports) |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Props interface mismatch between web and native | Medium | High | Import types from web version; create shared `.types.ts` where needed |
| Metro caching old resolution | Low | Medium | Clear Metro cache: `npx expo start --clear` |
| Token mapping gaps (web CSS → RN StyleSheet) | Medium | Medium | Audit each token file; shadows and transforms differ between web/RN |
| `react-native` pkg field breaks web build | Low | High | Test Next.js build immediately after adding field; web bundlers (Webpack/Vite) ignore `react-native` field |
| Animation differences | Medium | Low | Use `Animated` API or `react-native-reanimated` where web uses CSS transitions |

## Execution Model

This work is suitable for **parallel phase execution** with dependencies:

```
Phase 1 (Primitives) ──→ Phase 2 (High-use) ──→ Phase 3 (Medium-use)
                                                         │
                                               Phase 4 (Low-use)
```

Phase 1 must complete first (Box, Text, Icon are dependencies for Phase 2+3 components).
Phases 2 and 3 can overlap once Phase 1 primitives are verified.
Phase 4 is independent (low-use, complex, can be deferred).
