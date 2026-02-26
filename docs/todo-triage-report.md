# TODO/FIXME Triage Report
**Generated**: 2026-02-25
**Total Active Items**: 78 (73 code TODOs + 5 tech debt)
**Resolved Items**: 3 (TD3 i18n structure, TD7 care.ts, TD8 health.ts)

## Summary
| Tier | Count | Description |
|------|-------|-------------|
| Tier 1 — Critical | 14 | Security, LGPD compliance, infrastructure breaking changes |
| Tier 2 — Important | 59 | Non-functional UI — profile/settings/health screens never persist data |
| Tier 3 — Nice-to-Have | 5 | Code style, cosmetic, suppressed warnings |

---

## Tier 1 — Critical
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| 1 | `src/web/mobile/src/api/ssl-pinning.ts:7` | SSL certificate pinning uses placeholder SPKI hashes — production BLOCKER | Security | M |
| 2 | `src/web/web/src/pages/settings/logout.tsx:14` | Logout does not clear session tokens — session hijack risk | Security | S |
| 3 | `src/web/web/src/pages/settings/two-factor.tsx:18` | 2FA toggle does not call API — users believe 2FA is enabled when it is not | Security | S |
| 4 | `src/web/web/src/pages/settings/two-factor.tsx:22` | 2FA config never saved to backend | Security | S |
| 5 | `src/web/web/src/pages/settings/change-password.tsx:31` | Password change form never calls API — password remains unchanged | Security | S |
| 6 | `src/web/web/src/pages/settings/delete-account.tsx:26` | Account deletion navigates away without deleting account — LGPD violation | Security/LGPD | S |
| 7 | `src/web/mobile/src/screens/home/SettingsPrivacy.tsx:319` | Mobile account deletion shows alert only, no backend call | Security/LGPD | S |
| 8 | `src/web/web/src/pages/profile/index.tsx:66` | Profile account deletion not implemented | Security/LGPD | S |
| 9 | `src/web/web/src/pages/profile/privacy.tsx:217` | Privacy settings never persisted to API | Privacy/LGPD | S |
| 10 | `src/web/web/src/pages/profile/privacy.tsx:222` | LGPD data export button has no backend call — compliance violation | LGPD | M |
| 11 | `src/web/web/src/pages/settings/data-export.tsx:32` | LGPD data export request has no API integration | LGPD | M |
| 12 | `src/web/web/src/pages/auth/social-auth.tsx:172` | OAuth flow not implemented — logs only | Security | M |
| 13 | `src/web/mobile/src/screens/auth/SocialAuth.tsx:209` | Social auth shows alert instead of OAuth flow | Security | M |
| 14 | `src/backend/shared/prisma/schema.prisma:7` | Prisma `url` env syntax deprecated — breaking in Prisma 7.x across all services | Infrastructure | M |

---

## Tier 2 — Important

### Group A: Profile Setup Flow (Mobile) — 15 items
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| A1 | `src/web/mobile/src/screens/profile/ProfileSetup.tsx:167` | Profile not saved to backend | API Integration | S |
| A2 | `src/web/mobile/src/screens/profile/ProfileVariant1.tsx:260` | Health info not saved | API Integration | S |
| A3 | `src/web/mobile/src/screens/profile/ProfileVariant2.tsx:247` | Insurance info not saved | API Integration | S |
| A4 | `src/web/mobile/src/screens/profile/ProfileAddress.tsx:224` | CEP lookup is mocked | API Integration | M |
| A5 | `src/web/mobile/src/screens/profile/ProfileAddress.tsx:230,252` | Address not saved to backend | API Integration | M |
| A6 | `src/web/mobile/src/screens/profile/ProfileDocuments.tsx:264` | Document picker is mocked | API Integration | M |
| A7 | `src/web/mobile/src/screens/profile/ProfileDocuments.tsx:283` | Documents not saved | API Integration | M |
| A8 | `src/web/mobile/src/screens/profile/ProfilePhoto.tsx:169` | Camera picker mocked | API Integration | M |
| A9 | `src/web/mobile/src/screens/profile/ProfilePhoto.tsx:195,215` | Gallery picker mocked + photo not saved | API Integration | M |
| A10 | `src/web/mobile/src/screens/profile/ProfileEmergencyContact.tsx:206` | Emergency contact not saved | API Integration | S |
| A11 | `src/web/mobile/src/screens/profile/ProfileNotificationPrefs.tsx:209` | Notification prefs not saved | API Integration | S |
| A12 | `src/web/mobile/src/screens/profile/ProfileConfirmation.tsx:162` | Shows mock data, not real profile | API Integration | S |
| A13 | `src/web/mobile/src/screens/profile/ProfileBiometricSetup.tsx:154` | Biometric enrollment not implemented | API Integration | M |

### Group B: Settings Pages (Web) — 13 items
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| B1 | `src/web/web/src/pages/settings/personal-info.tsx:19` | Personal info save not wired to API | API Integration | S |
| B2 | `src/web/web/src/pages/settings/add-dependent.tsx:20` | Add dependent not persisted | API Integration | S |
| B3 | `src/web/web/src/pages/settings/dependents.tsx:28` | Dependents list uses mock data | API Integration | S |
| B4 | `src/web/web/src/pages/settings/theme.tsx:31` | Theme preference not saved | API Integration | S |
| B5 | `src/web/web/src/pages/settings/language.tsx:27` | Language preference not saved | API Integration | S |
| B6 | `src/web/web/src/pages/settings/accessibility.tsx:30` | Accessibility settings not persisted | API Integration | S |
| B7 | `src/web/web/src/pages/settings/add-address.tsx:25` | CEP lookup is mocked | API Integration | M |
| B8 | `src/web/web/src/pages/settings/add-address.tsx:37` | Address not saved | API Integration | M |
| B9 | `src/web/web/src/pages/settings/addresses.tsx:41` | Addresses list uses mock data | API Integration | S |
| B10 | `src/web/web/src/pages/settings/feedback.tsx:28` | Feedback not sent to backend | API Integration | S |
| B11 | `src/web/web/src/pages/settings/insurance-docs.tsx:28` | Insurance docs not persisted | API Integration | S |

### Group C: Settings Screens (Mobile) — 8 items
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| C1 | `src/web/mobile/src/screens/settings/EmergencyContacts.tsx:292` | Edit mode not implemented | API Integration | S |
| C2 | `src/web/mobile/src/screens/settings/AppFeedback.tsx:183` | Feedback uses mock submit | API Integration | S |
| C3 | `src/web/mobile/src/screens/settings/AppFeedback.tsx:208` | App store link empty | Content | S |
| C4 | `src/web/mobile/src/screens/settings/AddDependent.tsx:226` | Dependent registration is mocked | API Integration | S |
| C5 | `src/web/mobile/src/screens/settings/Dependents.tsx:222` | Edit dependent has no pre-fill | API Integration | S |
| C6 | `src/web/mobile/src/screens/settings/AboutApp.tsx:148,157` | Licenses list + app store link empty | Content | S |
| C7 | `src/web/mobile/src/screens/settings/Addresses.tsx:231` | Edit address has no pre-fill | API Integration | S |
| C8 | `src/web/mobile/src/screens/home/SettingsEdit.tsx:220,240,241` | Profile mock data + camera/gallery empty | API Integration | M |

### Group D: Health & Medication Screens (6 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| D1 | `src/web/mobile/src/screens/health/MedicationReminder.tsx:65` | Reminder not persisted | API Integration | S |
| D2 | `src/web/mobile/src/screens/health/MetricDetail.tsx:56` | Auth fallback needs proper error handling | Error Handling | S |
| D3 | `src/web/mobile/src/screens/health/MedicationAlarm.tsx:65` | Dose taken not recorded | API Integration | M |
| D4 | `src/web/mobile/src/screens/health/MedicationAlarm.tsx:74` | Snooze not recorded | API Integration | M |
| D5 | `src/web/mobile/src/screens/health/MedicationAlarm.tsx:83` | Skip not recorded | API Integration | M |
| D6 | `src/web/web/src/pages/health/medications/reminder.tsx:372` | Web reminder not saved | API Integration | S |

### Group E: Dashboard & Search (4 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| E1 | `src/web/web/src/components/dashboard/MetricsWidget.tsx:20` | Hardcoded user ID | API Integration | M |
| E2 | `src/web/web/src/components/dashboard/MetricsWidget.tsx:44` | Mock trend data | API Integration | M |
| E3 | `src/web/web/src/pages/search/results.tsx:147` | Mock search results | API Integration | M |
| E4 | `src/web/mobile/src/screens/home/SearchArticleResults.tsx:220` | Article detail navigation target empty | Navigation | S |

### Group F: Auth Flow Gaps (2 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| F1 | `src/web/mobile/src/screens/auth/SetPassword.tsx:254` | Set password API never called | API Integration | S |
| F2 | `src/web/mobile/src/screens/auth/EmailVerify.tsx:214` | Email verification API never called | API Integration | M |

### Group G: Profile Pages (Web) (4 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| G1 | `src/web/web/src/pages/profile/edit.tsx:141` | Mock profile data displayed | API Integration | M |
| G2 | `src/web/web/src/pages/profile/edit.tsx:159` | Save uses mock — no API call | API Integration | M |
| G3 | `src/web/web/src/pages/profile/biometric-setup.tsx:136` | Biometric enrollment not implemented | API Integration | M |
| G4 | `src/web/web/src/pages/profile/notifications.tsx:200` | Notification prefs not saved | API Integration | S |

### Group H: Notifications & Help (2 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| H1 | `src/web/web/src/pages/notifications/detail.tsx:20` | Notification detail fetches mock data | API Integration | S |
| H2 | `src/web/web/src/pages/help/report.tsx:42` | Report submission has no API call | API Integration | S |

### Group I: Observability Placeholders (3 items)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| I1 | `src/web/mobile/src/utils/analytics.ts:55` | Google Analytics placeholder ID (G-XXXXXXXXXX) | Config | M |
| I2 | `src/web/mobile/src/utils/analytics.ts:64` | Datadog app ID placeholder | Config | M |
| I3 | `src/web/mobile/src/utils/analytics.ts:65` | Datadog client token placeholder | Config | M |

### Group J: EAS Build Placeholder (1 item — TD5)
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| J1 | `src/web/mobile/app.json:163,167` | "your-project-id" placeholder — EAS builds blocked until replaced via `eas init` | Infrastructure | S |

---

## Tier 3 — Nice-to-Have
| # | File:Line | Description | Category | Effort |
|---|-----------|-------------|----------|--------|
| 1 | `src/web/design-system/tsconfig.json` | `noEmitOnError` missing — 167 TS errors suppressed, no runtime impact (TD2) | Refactoring | L |
| 2 | `src/web/mobile/src/screens/auth/*.tsx` (5 files) | 11 `colors.gray[]/brandPalette[]` occurrences instead of DS tokens (TD4) | Cosmetic | S |
| 3 | `src/web/mobile/src/navigation/PlanNavigator.tsx:25-34` | 9 hardcoded route strings instead of `ROUTES.*` constants (TD6) | Code Style | S |
| 4 | `src/web/web/src/pages/profile/privacy.tsx:227` | Account deletion needs confirmation dialog (UX only, not security) | UX | S |
| 5 | `src/web/mobile/src/screens/plan/PlanNavigator.tsx:1` | Plan E2E test file is a single-line placeholder | Testing | M |

---

## Resolved Tech Debt
| ID | Item | Status |
|----|------|--------|
| TD3 | `src/web/mobile/src/i18n/locales/` — i18n structure mismatch | RESOLVED — en-US and pt-BR share identical top-level structure |
| TD7 | `src/web/mobile/src/api/care.ts` — incomplete API layer | RESOLVED — 47 exported functions, comprehensive coverage |
| TD8 | `src/web/mobile/src/api/health.ts` — incomplete API layer | RESOLVED — 78 exported functions, comprehensive coverage |

---

## Recommendations
1. **IMMEDIATE (pre-launch)**: All 14 Tier 1 items — SSL pinning, session token cleanup, 2FA API, password change API, account deletion, LGPD data export, OAuth, Prisma migration
2. **Sprint 1**: Group A (Profile Setup) — onboarding is fully non-functional without persistence; 15 screens, all save actions are mocked
3. **Sprint 2**: Groups B + C (Settings persistence) — user preferences lost on every reload; 21 items
4. **Sprint 3**: Group D (Health/medication) + Group F (Auth flow) + Group G (Web profile) — 12 items
5. **Sprint 4**: Groups E, H, J (Dashboard, notifications, EAS) + observability config (Groups I) — 11 items
6. **Post-launch**: All Tier 3 items (TD2, TD4, TD6, UX dialog, plan E2E placeholder)

---

## Effort Summary
| Tier | Items | Estimate |
|------|-------|----------|
| Tier 1 — Critical | 14 | ~2-3 weeks (security sprint) |
| Tier 2 — Important | 59 | ~4-6 weeks (API integration sprints, dominated by profile + settings) |
| Tier 3 — Nice-to-Have | 5 | ~1-2 weeks |
| **Grand Total** | **78** | **~7-11 weeks** |
