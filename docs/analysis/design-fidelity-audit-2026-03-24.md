# AUSTA SuperApp — Design Fidelity Audit Report
## Date: 2026-03-24 | Screens: 307 mobile + 295 web | Figma: 277 | Modules: 21

---

## 1. Executive Summary

### Overall ADR-005 Compliance
- **3 of 13 rules PASS** (R1 Hex Colors, R2 Journey Colors, R10 i18n)
- **10 of 13 rules FAIL** with **~1,051 discrete violations**
- **Top-3 systemic issues:**
  1. **R8 Shadows (249 violations, Critical)** — All shadow properties hardcoded inline, no DS token usage
  2. **R7 Border Radius (207 invalid values of 304 total, Critical)** — 68.1% of borderRadius values are non-standard tokens
  3. **R9 Dark Mode (191 files missing useTheme, Critical)** — 62.2% of screen files lack useTheme()

### Token Fidelity
- 101 tokens compared: **76% match rate** (77 match, 6 mismatch, 17 missing)
- 3 critical drifts: brand.primary dual value, semantic alias tokens missing, borderRadius.2xl

### Screen Coverage
- 277 Figma screens mapped to 319 code files (307 mobile screens)
- 6 actionable missing screens, 27 extra code files (sub-components, extensions)

### Navigation Integrity
- 265 Stack.Screen entries across 13 navigators, all ParamLists match
- 9 bottom tabs (Figma expects 5) — 4 extra tabs
- 4 orphaned screens, no deep links, no modal presentation

### Frontend-Backend Wiring
- **53.4% of mobile screens have zero API wiring** (~164 of 307)
- 15 hooks exist on web but missing on mobile
- All v2.0 modules have backend controllers but mobile screens use MOCK_ data

### Remediation Manifest Progress
- **54 of 66 verifiable tasks FIXED** (81.8%)
- 7 OPEN, 5 PARTIAL

---

## 2. ADR-005 Compliance Scorecard

| Rule | Description | Status | Violations | Severity | Details |
|------|------------|--------|------------|----------|---------|
| R1 | Hex Colors | **PASS** | 0 | -- | 1 match in JSDoc comment only (AppointmentDetail.tsx:28). Zero in shared components. |
| R2 | Journey Colors | **PASS** | 0 | -- | All sampled screens use colors.journeys.\<journey\>.primary/background correctly. |
| R3 | Layout Patterns | **INFO** | N/A | -- | All 6 archetypes represented: Dashboard, List, Detail, Form, Chart, Modal. |
| R4 | Component Reuse | **FAIL** | 10 | High | 7x Stepper import (care/Symptom\*.tsx), 3x Avatar import (home/Profile, care/Doctor\*). |
| R5 | Typography | **FAIL** | 87 | High | 413 total hardcoded fontSize, 87 use non-token values (21.1%). Top: 18x fontSize:13, 14x fontSize:15, 13x fontSize:48. |
| R6 | Spacing | **FAIL** | 31 | Medium | 113 hardcoded margin/padding, 31 use non-token values. Top: 10x value:2, 7x value:10, 5x value:40. |
| R7 | Border Radius | **FAIL** | 207 | Critical | 304 total hardcoded borderRadius, 207 invalid (68.1%). Top: 41x value:4, 27x value:12, 16x value:5. |
| R8 | Shadows | **FAIL** | 249 | Critical | All shadow properties hardcoded inline. Top dirs: plan/:75, wellness/:65, home/:51, gamification/:35. |
| R9 | Dark Mode | **FAIL** | 191 | Critical | 191 of 307 files (62.2%) missing useTheme(). Worst: settings/ (100%), profile/ (100%), auth/ (92%). |
| R10 | i18n | **PASS** | 2 | Low | 305/307 (99.3%) comply. Missing: plan/ClaimStatusTimeline.tsx, plan/ClaimDocuments.tsx. |
| R11 | Test IDs | **FAIL** | 1 dir | Low | gamification/ ratio=1.75 (below 2.0 threshold). All other dirs pass. |
| R12 | File Size | **FAIL** | 8 | Medium | 8 files over 500L. Worst: LeaderboardScreen.tsx:603, RewardDetail.tsx:577, ClaimSubmission.tsx:573. |
| R13 | Icons | **FAIL** | 40 files | High | All health/ v2.0 subdirs (sleep, activity, nutrition, wellness-resources) use Ionicons directly instead of DS icon registry. 265 references across 40 files. |

### Severity Summary

| Severity | Rules | Total Violations |
|----------|-------|-----------------|
| Critical | R7, R8, R9 | 647 |
| High | R4, R5, R13 | 362 |
| Medium | R6, R12 | 39 |
| Low | R10, R11 | 3 |
| Pass | R1, R2, R3 | 0 |
| **Grand Total** | | **~1,051** |

---

## 3. Per-Module Report (01-21)

### Module 01+02 — Welcome + Auth (auth/)
- **Figma:** 17 | **Code:** 13 | **Status:** MERGED (4 onboarding slides + login merged)
- **Extra:** EmailVerify.tsx, SetPassword.tsx (no Figma counterpart)
- **R9 violation:** 12 of 13 files missing useTheme (92%)
- **Wiring:** 8 useAuth refs, PARTIAL

### Module 03 — Health Assessment (health/assessment/)
- **Figma:** 52 (26 steps x 2 variants) | **Code:** 27 (1 wizard + 26 steps) | **Status:** EXACT match
- **Wiring:** NONE — steps use controlled props pattern, wizard has no API integration

### Module 04 — Profile Setup (profile/)
- **Figma:** 9 | **Code:** 10 | **Extra:** ProfileDocuments.tsx
- **R9 violation:** 10 of 10 files missing useTheme (100%)
- **Wiring:** PARTIAL (21 useAuth refs)

### Module 05+14 — Home + Notifications/Search (home/)
- **Figma:** 29 | **Code:** 33 | **Extra:** 14 sub-components and Settings duplicates
- **R8:** 51 hardcoded shadow violations
- **R9:** 21 of 33 files missing useTheme (64%)
- **Wiring:** PARTIAL (15 API refs)

### Module 06 — AI Wellness Companion (wellness/)
- **Figma:** 15 | **Code:** 15 | **Status:** EXACT match
- **R5:** 188 hardcoded fontSize (highest of any module)
- **R8:** 65 hardcoded shadow violations
- **R9:** 0 missing (all 15 have useTheme) — COMPLIANT
- **Wiring:** NONE — all 15 screens use MOCK_ data

### Module 07 — Symptom Checker (care/Symptom\*)
- **Figma:** 30 | **Code:** 28 | **Extra:** SymptomComparison.tsx, SymptomDiary.tsx
- **R4:** 7x Stepper import violations
- **R9:** Part of care/ — 51 of 70 care files missing useTheme

### Module 08 — Medication Tracker (health/Medication\*)
- **Figma:** 26 | **Code:** 27 | **Extra:** MedicationAlarm.tsx
- **R12:** MedicationDetail.tsx at 501 lines (over 500L limit)

### Module 09 — Sleep Management (health/sleep/)
- **Figma:** 12 | **Code:** 12 | **Status:** EXACT match
- **R13:** All 12 files use Ionicons directly (bypasses icon registry)
- **Wiring:** NONE — all use MOCK_ data, backend controller exists

### Module 10 — Activity Tracker (health/activity/)
- **Figma:** 10 | **Code:** 10 | **Status:** EXACT match
- **R13:** All 10 files use Ionicons directly
- **Wiring:** NONE — all use MOCK_ data, backend controller exists

### Module 11 — Nutrition Monitoring (health/nutrition/)
- **Figma:** 10 | **Code:** 10 | **Status:** EXACT match
- **R13:** All 10 files use Ionicons directly
- **Wiring:** NONE — all use MOCK_ data, backend controller exists

### Module 12 — Period & Cycle Tracking (health/cycle-tracking/)
- **Figma:** 15 | **Code:** 15 | **Status:** EXACT match
- **Wiring:** NONE — all use MOCK_ data, backend controller exists

### Module 13 — Doctor Consultation (care/ non-Symptom)
- **Figma:** 38 | **Code:** 42 | **Extra:** Dashboard.tsx, DoctorFilters.tsx, ProviderSearch.tsx, TreatmentPlan.tsx
- **Wiring:** LOW — 67 of 70 care screens (95.7%) have no API integration on mobile

### Module 15 — Error & Utility (error/)
- **Figma:** 4 | **Code:** 4 | **Status:** EXACT match
- **R9:** 4 of 4 files missing useTheme (100%)
- **Wiring:** N/A (static error screens, intentionally not in navigator)

### Module 16 — Wellness Resources (health/wellness-resources/)
- **Figma:** 8 | **Code:** 8 | **Status:** EXACT match
- **R13:** All 8 files use Ionicons directly
- **Wiring:** NONE — all use MOCK_ data

### Module 18 — Settings & Help Center (settings/)
- **Figma:** 33 | **Code:** 29 | **Missing:** 4 (Main menu in home/, Notif prefs in home/, Profile edit merged, LGPD consent partial)
- **R9:** 29 of 29 files missing useTheme (100%)
- **Wiring:** LOW (6 useAuth refs only)

### Module 19 — Achievements/Gamification (gamification/)
- **Figma:** 7 | **Code:** 8 | **Missing:** StreakTracker, ShareAchievement | **Extra:** QuestDetail.tsx, QuestListItem.tsx, RewardDetail.tsx
- **R5:** 89 hardcoded fontSize violations
- **R8:** 35 hardcoded shadow violations
- **R11:** testID ratio 1.75 (below 2.0 threshold)
- **R12:** LeaderboardScreen.tsx:603, RewardDetail.tsx:577, RewardCatalog.tsx:504
- **Wiring:** LOW (2 useGamification refs)

### Module 17 — Community: DEFERRED (0 code files, expected)
### Module 20 — Dark Mode: Theme-driven (useTheme coverage is R9)
### Module 21 — Bonus Dashboard: DEFERRED (0 code files, expected)

---

## 4. Screen Coverage Matrix (Summary)

| Module | Figma | Code | Match | Missing | Extra | Wired % | Backend? |
|--------|:-----:|:----:|:-----:|:-------:|:-----:|:-------:|:--------:|
| 01+02 Auth | 17 | 13 | MERGED | 0 | 2 | PARTIAL | Yes |
| 03 Assessment | 52 | 27 | EXACT | 0 | 0 | NONE | Partial |
| 04 Profile | 9 | 10 | +1 | 0 | 1 | PARTIAL | Yes |
| 05+14 Home | 29 | 33 | +4 | 0 | 14 | PARTIAL | Yes |
| 06 Wellness | 15 | 15 | EXACT | 0 | 0 | NONE | Yes |
| 07 Symptom | 30 | 28 | MERGED | 0 | 2 | LOW | Yes |
| 08 Medications | 26 | 27 | +1 | 0 | 1 | PARTIAL | Yes |
| 09 Sleep | 12 | 12 | EXACT | 0 | 0 | NONE | Yes |
| 10 Activity | 10 | 10 | EXACT | 0 | 0 | NONE | Yes |
| 11 Nutrition | 10 | 10 | EXACT | 0 | 0 | NONE | Yes |
| 12 Cycle | 15 | 15 | EXACT | 0 | 0 | NONE | Yes |
| 13 Consultation | 38 | 42 | +4 | 0 | 4 | LOW | Yes |
| 15 Error | 4 | 4 | EXACT | 0 | 0 | N/A | N/A |
| 16 Resources | 8 | 8 | EXACT | 0 | 0 | NONE | Yes |
| 17 Community | 1 | 0 | DEFER | 1 | 0 | -- | -- |
| 18 Settings | 33 | 29 | -4 | 4 | 0 | LOW | Partial |
| 19 Gamification | 7 | 8 | -2/+3 | 2 | 3 | LOW | Yes |
| 20 Dark Mode | N/A | N/A | THEME | -- | -- | -- | -- |
| 21 Dashboard | 6 | 0 | DEFER | 6 | 0 | -- | -- |
| **TOTAL** | **277** | **319** | | **13** | **27** | | |

---

## 5. Token Drift Report

### Critical Drifts

| Category | Token | Figma Value | Code Value | Match | Action |
|----------|-------|-------------|------------|-------|--------|
| Color | brand.primary | #00C3F7 (canonical) | #05AEDB (brand.primary) | MISMATCH | Dual value: brandPalette[300]=#00c3f7 coexists with brand.primary=#05AEDB. Needs resolution. |
| Color | Semantic aliases (12 tokens) | fg.default, bg.default, accent.default, etc. from light.json/dark.json | NOT IMPLEMENTED | MISSING | Theme layer has no runtime semantic alias mapping. |
| Radius | borderRadius.2xl | 32 | 20 | MISMATCH | 12px gap affects cards and modals. |
| Radius | borderRadius.3xl | 48 | NOT IN CODE | MISSING | Large container radius unavailable. |
| Radius | borderRadius.4xl | 64 | NOT IN CODE | MISSING | Large container radius unavailable. |
| Typography | letterSpacing.decreased | -2% (~-0.02em at 16px) | -0.044em (tight) | MISMATCH | Code is 2.2x tighter than Figma. |
| Typography | letterSpacing.increased | 150% | 0.025em (wide) | MISMATCH | Fundamentally different unit system. |
| Typography | lineHeight.body | 150% (core.json generic) | 1.375 (code) | MISMATCH | Code uses specific text-md value (22/16=1.375), not generic 150%. Naming confusion. |
| Typography | display-xl | Not in core.json (handoff spec only) | 60px (code) | CODE-ONLY | Unverified: exists only in handoff spec, not DTCG source. |

### Token Match Scorecard

| Category | Compared | Matches | Mismatches | Missing | Rate |
|----------|:--------:|:-------:|:----------:|:-------:|:----:|
| Brand colors | 7 | 6 | 1 | 0 | 86% |
| Gray scale | 10 | 10 | 0 | 0 | 100% |
| Semantic colors | 7 | 7 | 0 | 0 | 100% |
| Semantic aliases | 12 | 0 | 0 | 12 | 0% |
| Font sizes | 19 | 18 | 1 | 0 | 95% |
| Line heights | 4 | 3 | 1 | 0 | 75% |
| Letter spacing | 3 | 1 | 2 | 0 | 33% |
| Font weights | 4 | 4 | 0 | 0 | 100% |
| Spacing | 13 | 13 | 0 | 0 | 100% |
| Border radius | 12 | 9 | 1 | 2 | 75% |
| Shadows | 3 | 3 | 0 | 0 | 100% |
| **TOTAL** | **101** | **77** | **6** | **17** | **76%** |

### Hardcoded Value Violations in Screens

| Category | Total Hardcoded | Valid Token Values | Invalid Values | % Invalid |
|----------|:--------------:|:-----------------:|:-------------:|:---------:|
| fontSize | 413 | 326 | 87 | 21.1% |
| borderRadius | 304 | 97 | 207 | 68.1% |
| spacing | 113 | 82 | 31 | 27.4% |
| shadows | 249 | 0 | 249 | 100% |

### effects.ts Three-Way Conflict

| Token | Figma | borderRadius.ts | effects.ts | Conflict? |
|-------|:-----:|:---------------:|:----------:|:---------:|
| sm | 6 | 6px | 4px | YES |
| md | 8 | 8px | 8px | No |
| lg | 16 | 16px | 12px | YES |
| xl | 24 | 24px | 16px | YES |
| 2xl | 32 | 20px | 20px | BOTH wrong |

---

## 6. Navigation Gap Map

### Navigator Summary (265 registered screens)

| Navigator | Screens | ParamList Match |
|-----------|:-------:|:---------------:|
| AuthNavigator | 23 | YES |
| HomeStack (MainNavigator) | 20 | YES |
| HealthNavigator | 37 | YES |
| CareNavigator | 68 | YES |
| PlanNavigator | 8 | YES |
| WellnessNavigator | 15 | YES |
| GamificationNavigator | 7 | YES |
| SettingsNavigator | 32 | YES |
| ActivityNavigator | 10 | YES |
| CycleTrackingNavigator | 15 | YES |
| NutritionNavigator | 10 | YES |
| SleepNavigator | 12 | YES |
| WellnessResourcesNavigator | 8 | YES |
| **TOTAL** | **265** | **ALL MATCH** |

### Tab Bar Mismatch (9 tabs vs. Figma 5)

| Tab | Component | In Figma 5-Tab? |
|-----|-----------|:---------------:|
| Home | HomeStack | YES |
| Health | HealthNavigator | YES |
| Care | CareNavigator | YES |
| Plan | PlanNavigator | YES |
| Profile | ProfileScreen | YES |
| Notifications | NotificationsScreen | NO — extra |
| Achievements | GamificationNavigator | NO — extra |
| Wellness | WellnessNavigator | NO — extra |
| Settings | SettingsNavigator | NO — extra |

**Finding:** Tab names use lowercase JOURNEY_IDS ("health", "care", "plan") but MainTabParamList expects capitalized ("Health", "Care", "Plan"). Runtime mismatch hidden by `as keyof` cast.

### Route Registration

| Metric | Count |
|--------|:-----:|
| Route constants (routes.ts) | 178 |
| Stack.Screen entries | 265 |
| Unregistered route constants | 5 (HOME_HEADER, 4 error screens) |
| Literal string screen names (no ROUTES constant) | 9 |

### Orphaned Screens (not in any navigator)

| Screen File | Expected Navigator |
|-------------|-------------------|
| care/DoctorSearchFilters.tsx | CareNavigator |
| care/DoctorSearchList.tsx | CareNavigator |
| plan/ClaimDocuments.tsx | PlanNavigator |
| home/HomeHeader.tsx | HomeStack |

### Other Navigation Findings
- **Modal flows:** NONE configured (no `presentation: 'modal'` anywhere)
- **Deep links:** NOT CONFIGURED (no `linking` prop on NavigationContainer)
- **SettingsNavigator:** Not exported from navigation barrel index.tsx
- **GamificationNavigator:** Imports Achievements from `home/Achievements`, not `gamification/Achievements` (potential duplicate)

---

## 7. Remediation Manifest Status

### Summary: 54 FIXED / 7 OPEN / 5 PARTIAL (of 66 verifiable items)

### Token Tasks

| Task ID | Title | Tier | Status | Evidence |
|---------|-------|:----:|:------:|----------|
| TOK-001 | Brand primary color | P0 | FIXED | brand.primary = #05AEDB, brandPalette[300] = #00c3f7 |
| TOK-002 | Missing gray/80 | P0 | FIXED | gray[80] = #1F2937 at line 140 |
| TOK-003 | Strangeicons (37 SVGs) | P0 | FIXED | iconRegistry.ts: 575 icons, 126 strangeicons with real SVG paths |
| TOK-003d | Icon Container variants | P0 | OPEN | No style variant prop (line/fill/duo). Only size + color + interactive. |
| TOK-004 | display-xl 60px | P1 | FIXED | fontSize['display-xl'] = '60px' at line 88 |
| TOK-005 | Line-height 1.375 | P1 | FIXED | lineHeight.body = 1.375 at line 160 |
| TOK-006 | Letter-spacing -0.044em | P1 | FIXED | letterSpacing.tight = '-0.044em' at line 177 |
| TOK-007 | Button variants | P1 | PARTIAL | Has color/hierarchy/loading. Missing 8 size variants (2xl-2xs). |
| TOK-007b | Button sizes | P1 | OPEN | Only sm/md/lg. No 2xl, xl, xs, 2xs. |
| TOK-008 | semantic.infoBg | P2 | FIXED | infoBg = '#eff6ff' at line 114 |
| TOK-009 | Effects/elevation tokens | P2 | FIXED | effects.ts with boxShadow scale |
| TOK-010 | Gamification medal colors | P2 | FIXED | colors.gamification gold/silver/bronze + bg/text variants |

### Hardcoded Color Tasks

| Task ID | Title | Tier | Status | Evidence |
|---------|-------|:----:|:------:|----------|
| HC-001 | FileUploader hex | P2 | FIXED | All 10 hex replaced with tokens |
| HC-002 | Leaderboard hex | P2 | FIXED | Medal colors use colors.gamification.\* |
| HC-003 | EmptyState hex | P2 | FIXED | Journey colors use colors.journeys.\* |
| HC-004 | JourneyHeader #FFFFFF | P2 | FIXED | Uses colors.gray[0] |
| HC-005 | Toast hex | P2 | FIXED | Uses colors.semantic.\*Bg |
| HC-006 | VideoConsultation hex | P2 | FIXED | Zero hardcoded hex |

### Component Tasks

| Task ID | Title | Tier | Status | Evidence |
|---------|-------|:----:|:------:|----------|
| COMP-001 | Toggle/Switch | P2 | FIXED | Toggle/ directory with size (sm/md/lg) |
| COMP-002 | Alert component | P2 | FIXED | Alert/ directory with type (success/error/warning/info) |
| COMP-003 | Badge variants | P2 | FIXED | size + type + status props |
| COMP-004 | Input variants | P2 | PARTIAL | PasscodeInput exists, Slider missing |
| COMP-005 | Tabs orientation | P2 | FIXED | orientation + tabStyle props |
| COMP-006 | Tooltip color | P2 | FIXED | color prop implemented |
| COMP-007 | ProgressBar labels | P2 | FIXED | labelPosition (above/below/inline/none) |
| COMP-008 | ChatMessage AI | P2 | FIXED | ai-assistant + ai-companion variants |
| COMP-009 | Arrow/Keyboard helpers | P3 | OPEN | Not created |
| COMP-010 | Breadcrumb dividers | P3 | FIXED | dividerType (colon/icon/slash) |

### Other Tasks

| Task ID | Title | Tier | Status | Evidence |
|---------|-------|:----:|:------:|----------|
| A11Y-001 | Accessibility labels audit | P3 | OPEN | No codebase-wide sweep performed |
| A11Y-002 | Icon aria-hidden | P3 | FIXED | interactive prop controls aria |
| ILL-001 | Illustration assets | P1 | FIXED | 176 PNGs across 18 sections |
| ARCH-001 | Unified color system | P1 | PARTIAL | componentColors exists, journey wrapper incomplete |
| ASSET-001 | Screen illustrations | P0 | FIXED | 176 PNGs |
| ASSET-002 | Strangeicons SVG | P0 | FIXED | 575 icon paths in registry |
| ASSET-003 | Plus Jakarta Sans | P1 | FIXED | All 7 font files present |
| ASSET-004 | Logo/brand assets | P1 | OPEN | No brand/ directory |
| ASSET-005 | Achievement badges | P2 | OPEN | No achievement SVG assets |
| ASSET-006 | Notification assets | P3 | OPEN | Not verified |

---

## 8. Prioritized Remediation Plan

### P0 Critical — Brand-Breaking / Production-Blocking

| # | Issue | Scope | Est. Files |
|---|-------|-------|:----------:|
| P0-1 | Resolve brand.primary dual value (#00C3F7 vs #05AEDB) | 1 token file + design team decision | 1 |
| P0-2 | Create 6 missing mobile hooks (useActivity, useSleep, useNutrition, useCycle, useMedications, useAssessment) | hooks/ directory | 6 |
| P0-3 | Wire 97 v2.0 mobile screens to API hooks (replace MOCK_ data) | sleep/activity/nutrition/cycle/wellness-resources/wellness | 97 |
| P0-4 | Add error handling to 4 HIGH-risk screens (plan/Dashboard, ClaimDetail, Coverage, health/MetricDetail) | 4 screen files | 4 |

### P1 Token Drift — Systematic Token Replacement

| # | Issue | Scope | Est. Files |
|---|-------|-------|:----------:|
| P1-1 | R8: Replace 249 hardcoded shadows with DS shadow tokens | plan/, wellness/, home/, gamification/ | ~40 |
| P1-2 | R9: Add useTheme() to 191 files missing dark mode | settings/(29), health/(61), care/(51), home/(21), auth/(12), profile/(10), error/(4) | 191 |
| P1-3 | R7: Replace 207 invalid borderRadius values with tokens | health/(192), care/(41), plan/(27), wellness/(22) | ~80 |
| P1-4 | R5: Replace 87 non-token fontSize values | wellness/(188 total, ~40 invalid), gamification/(89 total) | ~30 |
| P1-5 | Implement 12 semantic alias tokens (fg/bg/accent/border) from Figma light.json/dark.json | design-system tokens | 2 |
| P1-6 | Fix borderRadius.2xl (code=20, Figma=32) + add 3xl(48), 4xl(64) | borderRadius.ts | 1 |
| P1-7 | Resolve effects.ts borderRadius 3-way conflict | effects.ts | 1 |

### P1 File Size — 8 Files Over 500L

| File | Lines | Action |
|------|:-----:|--------|
| gamification/LeaderboardScreen.tsx | 603 | Split into LeaderboardScreen + LeaderboardFilters |
| gamification/RewardDetail.tsx | 577 | Extract RewardActions sub-component |
| plan/ClaimSubmission.tsx | 573 | Extract form steps into sub-components |
| home/SettingsPrivacy.tsx | 534 | Extract consent sections |
| settings/EmergencyContacts.tsx | 524 | Extract contact form |
| wellness/CompanionStreaks.tsx | 509 | Extract streak chart |
| gamification/RewardCatalog.tsx | 504 | Extract filter/sort logic |
| health/MedicationDetail.tsx | 501 | Extract info sections |

### P2 Missing Screens

| Screen | Module | Action |
|--------|--------|--------|
| 19-04 Streak Tracker | gamification/ | Create StreakTracker.tsx |
| 19-07 Share Achievement | gamification/ | Create ShareAchievement.tsx |
| 18-07 Notification Prefs | settings/ | Move from home/SettingsNotifications.tsx to settings/ |
| 18-08 LGPD Consent | settings/ | Create dedicated LGPDConsent.tsx |

### P2 Navigation Fixes

| Issue | Action |
|-------|--------|
| 9 tabs (Figma expects 5) | Move Notifications/Achievements/Wellness/Settings to push navigation |
| Tab name type mismatch | Use capitalized JOURNEY_IDS or fix MainTabParamList to lowercase |
| 4 orphaned screens | Register DoctorSearchFilters, DoctorSearchList, ClaimDocuments, HomeHeader |
| No modal presentation | Add modal navigator for confirmation/bottom-sheet flows |
| No deep links | Configure linking prop on NavigationContainer |

### P2 Component Gaps

| Issue | Action |
|-------|--------|
| Button missing 8 sizes | Add 2xl, xl, xs, 2xs size variants |
| Input missing Slider variant | Create SliderInput component |
| Icon missing style variants | Add line/fill/duo style prop |
| Logo/brand assets | Export SVG logo variants from Figma |
| Achievement badge SVGs | Export badge assets from Figma |

### P2 Backend Wiring

| Module | Mobile Screens | Action |
|--------|:--------------:|--------|
| care/ | 67 unwired | Create useAppointments/useTelemedicine wiring |
| wellness/ | 15 unwired | Create mobile useWellness hook |
| assessment/ | 27 unwired | Wire wizard to submission endpoint |

### P3 Polish

| Issue | Scope |
|-------|-------|
| R4: Remove 7x Stepper + 3x Avatar web-only imports | 10 files in care/ and home/ |
| R6: Fix 31 non-token spacing values | Mostly settings/ |
| R13: Replace 265 Ionicons refs with DS icon registry | 40 files in health/ v2.0 subdirs |
| R11: Add testIDs to gamification/ (ratio 1.75 < 2.0) | 8 files |
| A11Y-001: Codebase-wide accessibility label audit | ~2,493 interactive components |
| Arrow/Keyboard helper primitives (COMP-009) | New components |

---

## Appendix A: R5 fontSize Per-Directory Breakdown

| Directory | Total Hardcoded | Invalid Values |
|-----------|:--------------:|:--------------:|
| wellness/ | 188 | ~40 |
| gamification/ | 89 | ~20 |
| plan/ | 70 | ~15 |
| health/ | 31 | ~8 |
| care/ | 18 | ~3 |
| home/ | 17 | ~1 |

## Appendix B: R7 borderRadius Per-Directory Breakdown

| Directory | Total Hardcoded | Invalid Values |
|-----------|:--------------:|:--------------:|
| health/ | 192 | ~130 |
| care/ | 41 | ~30 |
| plan/ | 27 | ~20 |
| wellness/ | 22 | ~15 |
| gamification/ | 10 | ~7 |
| home/ | 9 | ~4 |
| auth/ | 2 | ~1 |
| profile/ | 1 | ~0 |

## Appendix C: R12 File Size Violations

| File | Lines |
|------|:-----:|
| gamification/LeaderboardScreen.tsx | 603 |
| gamification/RewardDetail.tsx | 577 |
| plan/ClaimSubmission.tsx | 573 |
| home/SettingsPrivacy.tsx | 534 |
| settings/EmergencyContacts.tsx | 524 |
| wellness/CompanionStreaks.tsx | 509 |
| gamification/RewardCatalog.tsx | 504 |
| health/MedicationDetail.tsx | 501 |

## Appendix D: Mobile vs. Web Hook Parity

| Hook | Mobile | Web |
|------|:------:|:---:|
| useAuth | YES | YES |
| useAppointments | YES | YES |
| useClaims | YES | YES |
| useCoverage | YES | YES |
| useDevices | YES | YES |
| useGamification | YES | YES |
| useHealthMetrics | YES | YES |
| useJourney | YES | YES |
| useNotifications | YES | YES |
| useTelemedicine | YES | YES |
| useActivity | NO | YES |
| useSleep | NO | YES |
| useNutrition | NO | YES |
| useCycle | NO | YES |
| useMedications | NO | YES |
| useAssessment | NO | YES |
| useWellness | NO | YES |
| useProfile | NO | YES |
| useSettings | NO | YES |
| usePayments | NO | YES |
| usePlan | NO | YES |
| useSearch | NO | YES |
| useMedicalRecords | NO | YES |
| useSymptomChecker | NO | YES |
| useVisits | NO | YES |

**Mobile: 10 hooks | Web: 25 hooks | Gap: 15 hooks**
