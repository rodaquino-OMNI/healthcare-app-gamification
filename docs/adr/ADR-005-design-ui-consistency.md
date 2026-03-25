# ADR-005: Design & UI Consistency Standard

## Status

Accepted

## Date

2026-02-23

## Context

AUSTA SuperApp has 277 Figma-designed mobile screens (light mode) and ~321 implemented TSX screen files across R4 Waves 1-14. All v1.0/v1.1 modules (Welcome, Auth, Profile, Home, Symptom Checker, Medications, Consultations, Notifications, Search, Settings, Help, Achievements, Dark Mode, Health Assessment) have full Figma designs that agents followed during implementation.

5 v2.0/v1.0 modules existed in Figma as **placeholder grouped frames** (without individual screen-level designs) and have since been **fully implemented in code**:
- Module 09: Sleep Management — 12 screens (`src/web/mobile/src/screens/health/sleep/`)
- Module 10: Activity Tracker — 10 screens (`src/web/mobile/src/screens/health/activity/`)
- Module 11: Nutrition Monitoring — 10 screens (`src/web/mobile/src/screens/health/nutrition/`)
- Module 15: Error & Utility — 4 screens (`src/web/mobile/src/screens/error/`)
- Module 16: Wellness Resources — 8 screens (`src/web/mobile/src/screens/health/wellness-resources/`)

These modules were built following this ADR's rules — composing patterns from fully-designed modules. Without an explicit standard, swarm agents would have made inconsistent design decisions, creating visual debt.

Key pressures at time of writing:
- **44 new screens** (now implemented) had to match 277 existing Figma-designed screens visually
- **Multiple swarm workers** build screens concurrently — no designer in the loop
- **Dark mode** must work from day one (not retrofitted like W18)
- **Design token files** exist (`core.json`, `light.json`, `dark.json`, `theme.json`) but were never codified as enforceable rules
- **Icon registry** expanded to 574 custom SVG icons alongside Ionicons

## Decision

All new screens — including v2.0 placeholder modules — MUST follow the Figma design system by **composing established patterns from fully-designed modules**. This ADR codifies 13 mandatory rules.

### Rule 1: Color Tokens Only

Zero hardcoded hex values in screen files. All colors referenced via `theme.colors.*` accessed through the `useTheme()` hook or style factory pattern.

**Enforcement**: `grep -rn "#[0-9a-fA-F]{6}" <screen-dir>/ | wc -l` must equal 0.

### Rule 2: Journey Color Assignment

Every screen belongs to a journey and uses its color token:

| Journey | Token Path | Primary | Secondary | Accent | Background |
|---------|-----------|---------|-----------|--------|------------|
| Health | `colors.journeys.health` | `#0ACF83` | `#05A66A` | `#00875A` | `#F0FFF4` |
| Care | `colors.journeys.care` | `#FF8C42` | `#F17C3A` | `#E55A00` | `#FFF8F0` |
| Plan | `colors.journeys.plan` | `#3A86FF` | `#2D6FD9` | `#0057E7` | `#F0F8FF` |
| Community | `colors.journeys.community` | `#9F7AEA` | `#805AD5` | `#6B46C1` | `#FAF5FF` |

> **Source of truth:** `src/web/design-system/src/tokens/colors.ts` — `journeys` object.

Sleep, Activity, Nutrition, and Wellness Resources all belong to the **Health** journey (green). Error & Utility screens use neutral gray (no journey assignment).

### Rule 3: Screen Layout Patterns

Every screen must match one of 6 established Figma layout patterns:

| Pattern | Structure | Existing Examples |
|---------|-----------|-------------------|
| **Dashboard** | Header (journey color or flat) + ScrollView cards + bottom nav | Home.tsx, CycleHome.tsx, MedicationHome.tsx |
| **List** | Search bar + filter tabs + FlatList with card items | ClaimHistory.tsx, DoctorSearch.tsx, QuestList.tsx |
| **Detail** | Back button + hero section + info cards + action buttons | ClaimDetail.tsx, DoctorProfile.tsx, AchievementDetail.tsx |
| **Form** | Progress indicator + input fields + validation + submit CTA | ClaimSubmission.tsx, MedicationAdd.tsx, AddAddress.tsx |
| **Chart/Report** | Date range selector + chart (line/bar/donut) + summary cards | CycleAnalysis.tsx, MedicationAdherence.tsx, WeeklySummary.tsx |
| **Modal/Overlay** | Dark background (`gray.60` opacity) + centered content + dismiss | MedicationDoseTaken.tsx, BookingConfirmation.tsx |

### Rule 4: Component Reuse

Mobile screens use React Native primitives (`View`, `Text`, `TouchableOpacity`, `FlatList`, `ScrollView`, `TextInput`, `Image`) styled with design tokens. Web-only DS components (`Stepper`, `Loader`, `Dropdown`, `FileUpload`, `Avatar`, `AchievementBadge`, `Leaderboard`, `QuestCard`) are NOT imported in mobile code.

Shared mobile components from `src/web/mobile/src/components/shared/`:
- `JourneyHeader` — screen header with back button and journey color
- `ErrorState` — error display with retry
- `LoadingIndicator` — loading spinner with label
- `ErrorBoundary` — crash protection wrapper

### Rule 5: Typography

Font family: **Plus Jakarta Sans** (primary), **Nunito** (logo only).

| Usage | Token | Size | Weight | Line Height |
|-------|-------|------|--------|-------------|
| Hero / display | `display-sm` | 30 | SemiBold (600) | tight |
| Page title (large) | `heading-2xl` | 28 | SemiBold (600) | heading |
| Screen title | `heading-xl` | 24 | SemiBold (600) | heading |
| Major section header | `heading-lg` | 20 | SemiBold (600) | heading |
| Section header | `heading-md` | 18 | Medium (500) | heading |
| Card title | `heading-sm` | 16 | Medium (500) | heading |
| Sub-card title | `heading-xs` | 14 | Medium (500) | heading |
| Large body text | `text-lg` | 18 | Regular (400) | body |
| Body text | `text-md` | 16 | Regular (400) | body |
| Caption/subtitle | `text-sm` | 14 | Regular (400) | body |
| Badge/label | `label` | 12 | Medium (500) | heading |
| Small text | `text-xs` | 12 | Regular (400) | body |
| Footnotes / legal | `text-2xs` | 10 | Regular (400) | body |

> **Source of truth:** `docs/Figma/core.json` → `fontSizes.*` and `docs/Figma/theme.json` → `typography.*`

### Rule 6: Spacing

Use the token scale from `core.json`. Never use arbitrary pixel values.

| Usage | Token | Value |
|-------|-------|-------|
| Between related items | `xs` | 8px |
| Small gap | `sm` | 12px |
| Card internal padding | `md` | 16px |
| Between cards | `lg` | 20px |
| Section gaps | `xl` | 24px |
| Major sections | `2xl` | 32px |
| Screen padding horizontal | `md` | 16px |

### Rule 7: Border Radius

| Element | Token | Value |
|---------|-------|-------|
| Cards | `lg` | 16px |
| Buttons | `md` | 8px |
| Inputs | `md` | 8px |
| Avatars / Pills / Chips | `full` | 9999px |
| Small badges | `sm` | 6px |
| Modals | `xl` | 24px |

### Rule 8: Shadows

From `theme.json` boxShadow definitions:

| Usage | Token | CSS Equivalent |
|-------|-------|----------------|
| Cards at rest | `boxShadow.sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| Elevated cards | `boxShadow.default` | `0 4px 6px -1px rgba(0,0,0,0.1)` |
| Modals / overlays | `boxShadow.lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` |

In React Native, use `elevation` (Android) + `shadowOffset/shadowRadius/shadowColor` (iOS).

### Rule 9: Dark Mode

All screens MUST work in dark mode via the `useTheme()` hook from `ThemeContext`. Pattern established in W18:

```typescript
const { theme } = useTheme();
const styles = createStyles(theme);
// ...
const createStyles = (theme: Theme) => StyleSheet.create({
  container: { backgroundColor: theme.colors.background.default },
  text: { color: theme.colors.text.primary },
});
```

Color mappings (from `light.json` / `dark.json`):
- `bg.default`: white → `#334155` (gray.70)
- `bg.muted`: `#F8FAFC` (gray.5) → `#4B5563` (gray.60)
- `fg.default`: `#334155` (gray.70) → white
- `accent.default`: `#00C3F7` → `#00C3F7` (unchanged across themes)

> **Note:** Figma tokens reference `brand.300` = `#00C3F7` for accent. Code `colors.ts` maps `brand.primary` to `#05AEDB`. Both are valid — the token files use the Figma source value, while `colors.ts` uses the code-corrected value (see design-audit-remediation-manifest.json COL-001).

### Rule 10: Internationalization

All user-visible text via `useTranslation()` from `react-i18next`. Languages: pt-BR (primary), en-US (secondary).

Namespace convention: `{journey}.{module}.{screen}.{element}`
Example: `health.sleep.home.title`, `health.sleep.log.bedtimeLabel`

### Rule 11: Test IDs

Every interactive element (`TouchableOpacity`, `Button`, `TextInput`, `Switch`) gets a `testID` prop for Maestro E2E tests. Convention: `{screen}-{element}` in kebab-case.

Example: `testID="sleep-home-log-button"`, `testID="sleep-log-bedtime-input"`

**Enforcement**: `grep -rn "testID" <screen-dir>/ | wc -l` must be >= 2× number of screens.

### Rule 12: File Size Limit

Maximum 500 lines per screen file. If a screen exceeds this limit, extract sub-components into the same directory with descriptive names.

Example: `SleepTrends.tsx` (main) + `SleepTrendsChart.tsx` (extracted chart) + `SleepTrendsStats.tsx` (extracted stats).

### Rule 13: Icons

Two icon sources are available:

1. **Icon Registry** (`src/web/design-system/src/primitives/Icon/iconRegistry.ts`) — **574 unique custom SVG icons** (37 legacy + 537 strangeicons). Use the `Icon` design-system primitive for these. Preferred for health, medical, and wellness-specific icons.
2. **Ionicons** (via `@expo/vector-icons`) — Used in mobile screens for standard UI chrome (back arrows, tabs, generic actions). Acceptable for navigation and utility icons.

Module-specific icon recommendations:

| Module | Primary Icon | Additional Icons |
|--------|-------------|------------------|
| Sleep | `moon-outline` (Ionicons) / `moon` (registry) | `bed-outline`, `alarm-outline`, `time-outline` |
| Activity | `fitness-outline` (Ionicons) / `running` (registry) | `bicycle-outline`, `walk-outline`, `heart-outline` |
| Nutrition | `nutrition-outline` (Ionicons) / `apple` (registry) | `restaurant-outline`, `water-outline`, `leaf-outline` |
| Wellness | `leaf-outline` (Ionicons) / `wellness` (registry) | `book-outline`, `videocam-outline`, `bookmark-outline` |
| Error | `warning-outline` (Ionicons) | `wifi-outline`, `construct-outline`, `refresh-outline` |

## Consequences

### Positive

- **Visual consistency**: All 44 placeholder-module screens are indistinguishable from Figma-designed modules because they use identical tokens, patterns, and components. ✅ Validated post-implementation.
- **No design debt**: Every screen was production-ready from day one — no "design polish" pass was needed.
- **Swarm-safe**: Multiple concurrent agents built screens independently while maintaining visual coherence, because rules were explicit and verifiable.
- **Dark mode built-in**: No W18-style retrofit needed — dark mode was a day-one requirement for all 44 screens.
- **Measurable compliance**: Every rule has a `grep`-verifiable exit gate.

### Negative

- **Pattern rigidity**: Novel UI patterns (e.g., a sleep stage animation) must be proposed as extensions to this ADR rather than ad-hoc implementations.
- **No pixel-perfect Figma reference**: For placeholder modules, screens were "designed by composition" rather than pixel-matched. When Figma designs are expanded for these modules, a visual diff pass may reveal minor adjustments.
- **Dual icon system**: Having both Ionicons and iconRegistry creates ambiguity for new contributors about which to use.

### Neutral

- **Token file authority**: `docs/Figma/core.json`, `light.json`, `dark.json`, `theme.json` are the source of truth for design token values. `src/web/design-system/src/tokens/colors.ts` is the source of truth for journey colors and code-corrected values. If Figma tokens are updated, this ADR's value tables must be updated to match.
- **Brand color discrepancy**: Figma uses `#00C3F7` as brand.300 (azul aust). Code corrected brand.primary to `#05AEDB` (Brand/60). Both are documented; the token files preserve Figma source values.

## References

- Figma File (original): `OcG9oRNdUEskvAPUcKiKMe` (AUSTA SuperApp)
- Figma File (Duplicate 2, working): `izQmcRXAJhlsGALJ6FaHIF`
- Token Files (DTCG): `docs/Figma/core.json`, `light.json`, `dark.json`, `theme.json`
- Token Files (legacy): `docs/Figma/austa-design-tokens.json`, `docs/Figma/Mode 1.json`
- Design System Colors: `src/web/design-system/src/tokens/colors.ts`
- Icon Registry: `src/web/design-system/src/primitives/Icon/iconRegistry.ts` (574 icons)
- Screen Inventory: `docs/Figma/AUSTA_Screen_Inventory_100pct.md`
- Figma-to-Code Evaluation: `docs/Figma/figma-to-code-evaluation-report.md`
- Design Audit Remediation: `docs/Figma/design-audit-remediation-manifest.json`
- W18 Dark Mode Commit: `40d00d1`
- ADR-001 Navigation Architecture (route naming conventions)
