# ADR-005: Design & UI Consistency Standard

## Status

Accepted

## Date

2026-02-23

## Context

AUSTA SuperApp has 249+ mobile screens built across R4 Waves 1-14 by swarm agents. All v1.0/v1.1 modules (Welcome, Auth, Profile, Home, Symptom Checker, Medications, Consultations, Notifications, Search, Settings, Help, Achievements, Dark Mode, Health Assessment) have full Figma designs that agents followed during implementation.

However, 4 v2.0 modules exist in Figma only as **placeholder grouped frames** without individual screen designs:
- Module 09: Sleep Management (1 grouped frame, expected ~12 screens)
- Module 10: Activity Tracker (1 grouped frame, expected ~10 screens)
- Module 11: Nutrition Monitoring (1 grouped frame, expected ~10 screens)
- Module 16: Wellness Resources (1 grouped frame, expected ~8 screens)

These modules need to be built with the same visual quality as Figma-designed modules. Without an explicit standard, swarm agents would make inconsistent design decisions, creating visual debt.

Key pressures:
- **40 new screens** must match 249 existing screens visually
- **Multiple swarm workers** build screens concurrently — no designer in the loop
- **Dark mode** must work from day one (not retrofitted like W18)
- **Design token files** exist (`core.json`, `light.json`, `dark.json`, `theme.json`) but were never codified as enforceable rules

## Decision

All new screens — including v2.0 placeholder modules — MUST follow the Figma design system by **composing established patterns from fully-designed modules**. This ADR codifies 13 mandatory rules.

### Rule 1: Color Tokens Only

Zero hardcoded hex values in screen files. All colors referenced via `theme.colors.*` accessed through the `useTheme()` hook or style factory pattern.

**Enforcement**: `grep -rn "#[0-9a-fA-F]{6}" <screen-dir>/ | wc -l` must equal 0.

### Rule 2: Journey Color Assignment

Every screen belongs to a journey and uses its color token:

| Journey | Token Path | Primary | Secondary | Background |
|---------|-----------|---------|-----------|------------|
| Health | `theme.colors.journeys.health` | `#0ACF83` | `#05A66A` | `#E6FFF5` |
| Care | `theme.colors.journeys.care` | `#FF8C42` | `#F17C3A` | `#FFF3E8` |
| Plan | `theme.colors.journeys.plan` | `#3A86FF` | `#2D6FD9` | `#EBF3FF` |
| Gamification | `theme.colors.journeys.gamification` | `#9F7AEA` | — | — |

Sleep, Activity, Nutrition, and Wellness Resources all belong to the **Health** journey (green).

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
| Screen title | `heading-xl` | 24 | SemiBold (600) | 120% |
| Section header | `heading-md` | 18 | Medium (500) | 120% |
| Card title | `heading-sm` | 16 | Medium (500) | 120% |
| Body text | `text-md` | 16 | Regular (400) | 150% |
| Caption/subtitle | `text-sm` | 14 | Regular (400) | 150% |
| Badge/label | `label` | 12 | Medium (500) | 120% |
| Small text | `text-xs` | 12 | Regular (400) | 150% |

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
- `bg.default`: white → `#334155`
- `bg.muted`: `#F8FAFC` → `#4B5563`
- `fg.default`: `#334155` → white
- `accent.default`: `#00C3F7` → `#00C3F7` (unchanged)

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

Ionicons only (via `@expo/vector-icons`). Module-specific icons:

| Module | Primary Icon | Additional Icons |
|--------|-------------|------------------|
| Sleep | `moon-outline` | `bed-outline`, `alarm-outline`, `time-outline` |
| Activity | `fitness-outline` | `bicycle-outline`, `walk-outline`, `heart-outline` |
| Nutrition | `nutrition-outline` | `restaurant-outline`, `water-outline`, `leaf-outline` |
| Wellness | `leaf-outline` | `book-outline`, `videocam-outline`, `bookmark-outline` |

## Consequences

### Positive

- **Visual consistency**: New placeholder modules are indistinguishable from Figma-designed modules because they use identical tokens, patterns, and components.
- **No design debt**: Every screen is production-ready from day one — no future "design polish" pass needed.
- **Swarm-safe**: Multiple concurrent agents can build screens independently while maintaining visual coherence, because rules are explicit and verifiable.
- **Dark mode built-in**: No W18-style retrofit needed — dark mode is a day-one requirement.
- **Measurable compliance**: Every rule has a `grep`-verifiable exit gate.

### Negative

- **Pattern rigidity**: Novel UI patterns (e.g., a sleep stage animation) must be proposed as extensions to this ADR rather than ad-hoc implementations.
- **No pixel-perfect Figma reference**: For placeholder modules, screens are "designed by composition" rather than pixel-matched. Minor visual differences from a hypothetical future Figma design are acceptable.

### Neutral

- **Token file authority**: `docs/Figma/core.json`, `light.json`, `dark.json`, `theme.json` are the source of truth for values. If Figma tokens are updated, this ADR's value tables must be updated to match.

## References

- Figma File: `OcG9oRNdUEskvAPUcKiKMe` (AUSTA SuperApp)
- Token Files: `docs/Figma/core.json`, `light.json`, `dark.json`, `theme.json`
- Design System: `src/web/design-system/src/tokens/colors.ts`
- Screen Inventory: `docs/Figma/AUSTA_Screen_Inventory_100pct.md`
- W18 Dark Mode Commit: `40d00d1`
- ADR-001 Navigation Architecture (route naming conventions)
