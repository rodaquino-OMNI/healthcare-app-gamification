# AUSTA SuperApp — Complete Screen Inventory (100%)

> **Figma File:** Austa app — `OcG9oRNdUEskvAPUcKiKMe`
> **Generated:** 2026-02-21 | **Source:** Figma API + Manual Analysis
> **Total Screens:** 277 Light Mode + 20 Dark Mode Groups + 6 Dashboard = **303 total frames**
> **Canvas:** `↳ Main - Light Mode ⚪` (ID: `20307:23730`)

---

## Table of Contents

1. [Summary Dashboard](#1-summary-dashboard)
2. [MVP Classification (MoSCoW)](#2-mvp-classification)
3. [Module 01 — Welcome Screen (11 screens)](#module-01--welcome-screen)
4. [Module 02 — Authentication (6 screens)](#module-02--authentication)
5. [Module 03 — Comprehensive Health Assessment (52 screens)](#module-03--comprehensive-health-assessment)
6. [Module 04 — Profile Setup & Account Completion (9 screens)](#module-04--profile-setup--account-completion)
7. [Module 05 — Home & Smart Health Metrics (19 screens)](#module-05--home--smart-health-metrics)
8. [Module 06 — AI Wellness Companion (15 screens)](#module-06--ai-wellness-companion)
9. [Module 07 — AI Symptom Checker (30 screens)](#module-07--ai-symptom-checker)
10. [Module 08 — Medication Tracker (26 screens)](#module-08--medication-tracker)
11. [Module 09 — Sleep Management (1 placeholder)](#module-09--sleep-management)
12. [Module 10 — Activity Tracker (1 placeholder)](#module-10--activity-tracker)
13. [Module 11 — Nutrition Monitoring (1 placeholder)](#module-11--nutrition-monitoring)
14. [Module 12 — Period & Cycle Tracking (15 screens)](#module-12--period--cycle-tracking)
15. [Module 13 — Doctor Consultation (38 screens)](#module-13--doctor-consultation)
16. [Module 14 — Notification & Search (10 screens)](#module-14--notification--search)
17. [Module 15 — Error & Utility (1 placeholder)](#module-15--error--utility)
18. [Module 16 — Wellness Resources (1 placeholder)](#module-16--wellness-resources)
19. [Module 17 — Health Community (1 placeholder)](#module-17--health-community)
20. [Module 18 — Profile Settings & Help Center (33 screens)](#module-18--profile-settings--help-center)
21. [Module 19 — Achievements (7 screens)](#module-19--achievements)
22. [Module 20 — Dark Mode (20 groups)](#module-20--dark-mode)
23. [Module 21 — Bonus Dashboard (6 screens)](#module-21--bonus-dashboard)
24. [Development Routing Matrix](#development-routing-matrix)

---

## 1. Summary Dashboard

| Metric | Value |
|--------|-------|
| Total Modules (Light Mode) | 19 active + 4 placeholder |
| Total Screens (Light Mode) | **277** |
| Dark Mode Module Groups | **20** |
| Bonus Dashboard Screens | **6** |
| **Grand Total Frames** | **303** |
| Frame Size (standard) | 375 × 812 px (iPhone X) |
| Design System Font | Plus Jakarta Sans (primary), Nunito (logo) |
| Primary Brand Color | #00C3F7 (Azul AUSTA) |

### Screens per Module

| # | Module | Screens | MVP Phase | Priority |
|---|--------|---------|-----------|----------|
| 01 | Welcome Screen | 11 | ✅ v1.0 | P0 |
| 02 | Authentication | 6 | ✅ v1.0 | P0 |
| 03 | Comprehensive Health Assessment | 52 | 🔶 v1.1 | P1 |
| 04 | Profile Setup & Account Completion | 9 | ✅ v1.0 | P0 |
| 05 | Home & Smart Health Metrics | 19 | ✅ v1.0 | P0 |
| 06 | AI Wellness Companion | 15 | 🔶 v1.1 | P1 |
| 07 | AI Symptom Checker | 30 | ✅ v1.0 | P0 |
| 08 | Medication Tracker | 26 | ✅ v1.0 | P0 |
| 09 | Sleep Management | 1 ⬜ | ⬜ v2.0 | P2 |
| 10 | Activity Tracker | 1 ⬜ | ⬜ v2.0 | P2 |
| 11 | Nutrition Monitoring | 1 ⬜ | ⬜ v2.0 | P2 |
| 12 | Period & Cycle Tracking | 15 | ⬜ v2.0 | P2 |
| 13 | Doctor Consultation | 38 | ✅ v1.0 | P0 |
| 14 | Notification & Search | 10 | ✅ v1.0 | P0 |
| 15 | Error & Utility | 1 ⬜ | ✅ v1.0 | P0 |
| 16 | Wellness Resources | 1 ⬜ | ⬜ v2.0 | P2 |
| 17 | Health Community | 1 ⬜ | ❌ Future | P3 |
| 18 | Profile Settings & Help Center | 33 | ✅ v1.0 | P0 |
| 19 | Achievements | 7 | 🔶 v1.1 | P1 |
| 20 | Dark Mode (all modules) | 20 groups | 🔶 v1.1 | P1 |
| 21 | Bonus Dashboard (admin) | 6 | ❌ Future | P3 |

> ⬜ = Placeholder frame in Figma (grouped screens not yet expanded into individual flows)

---

## 2. MVP Classification

### ✅ MVP v1.0 — MUST HAVE (Core Launch)
**~172 screens** across 10 modules

Modules: Welcome Screen (11), Authentication (6), Profile Setup (9), Home & Health Metrics (19), AI Symptom Checker (30), Medication Tracker (26), Doctor Consultation (38), Notification & Search (10), Error & Utility (1), Profile Settings (33)

### 🔶 v1.1 — SHOULD HAVE (Fast Follow, +30 days)
**~74 screens** across 3 modules + Dark Mode

Modules: Comprehensive Health Assessment (52), AI Wellness Companion (15), Achievements (7), Dark Mode (20 groups)

### ⬜ v2.0 — COULD HAVE (+90 days)
**~18 screens** across 4 modules

Modules: Period & Cycle Tracking (15), Sleep Management (1), Activity Tracker (1), Nutrition Monitoring (1), Wellness Resources (1)

### ❌ Future — WON'T (this cycle)
**~7 screens** across 2 modules

Modules: Health Community (1), Bonus Dashboard (6)

---

## Module 01 — Welcome Screen
**Screens: 11** | **MVP: ✅ v1.0** | **Figma Section Label:** `Tela de boas-vindas`

These screens form the onboarding carousel and splash sequence shown to first-time users.

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 01-01 | `20307:23954` | Splash / Loading screen | Gray/5 | App logo + brand animation entry point |
| 01-02 | `20311:21206` | Onboarding Slide 1 — Welcome to AUSTA | Gray/5 | Hero illustration + headline |
| 01-03 | `20313:44230` | Onboarding Slide 2 — Health Monitoring | Gray/5 | Feature highlight: vitals tracking |
| 01-04 | `20313:44271` | Onboarding Slide 3 — AI Assistant | Gray/5 | Feature highlight: AI-powered care |
| 01-05 | `20435:38766` | Onboarding Slide 4 — Doctor Access | Gray/5 | Feature highlight: telemedicine |
| 01-06 | `20435:38828` | Onboarding Slide 5 — Medication | Gray/5 | Feature highlight: medication tracking |
| 01-07 | `20435:38859` | Onboarding Slide 6 — Get Started CTA | Gray/5 | Final slide with "Começar" button |
| 01-08 | `20436:40653` | Onboarding — Page Indicator variant | Gray/5 | Alternative pagination dots layout |
| 01-09 | `23533:58258` | Welcome — Personalization Intro | Gray/5 | Post-signup welcome personalization |
| 01-10 | `23533:58329` | Welcome — Goal Selection | Gray/5 | User selects health goals |
| 01-11 | `23533:58393` | Welcome — Confirmation | Gray/5 | Goals confirmed, proceed to app |

**Dev Route:** `src/screens/onboarding/` → React Native carousel with pagination dots + skip/next CTA

---

## Module 02 — Authentication
**Screens: 6** | **MVP: ✅ v1.0** | **Figma Section Label:** `Autenticação`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 02-01 | `20307:23813` | Login — Email/Phone entry | Gray/5 | Primary authentication screen |
| 02-02 | `20313:21317` | Login — Password entry | Gray/5 | Password field + forgot password link |
| 02-03 | `20436:60277` | Login — Social auth options | Gray/5 | Google, Apple, Facebook SSO buttons |
| 02-04 | `20436:60467` | Registration — Create account | Gray/5 | Name, email, phone, password fields |
| 02-05 | `20313:25276` | Forgot Password — Email entry | Gray/5 | Send recovery code flow |
| 02-06 | `20313:22645` | OTP Verification — Code entry | Gray/5 | 6-digit OTP input + resend timer |

**Dev Route:** `src/screens/auth/` → Firebase Auth + Social SSO + OTP verification

---

## Module 03 — Comprehensive Health Assessment
**Screens: 52** | **MVP: 🔶 v1.1** | **Figma Section Label:** (within canvas, no explicit label)

This is the largest module — a multi-step health questionnaire flow with paired screens (each step appears twice: original `23431:*` and variant `23686:*`). The 26 unique steps × 2 variants = 52 screens.

| # | Figma Node ID (Original) | Figma Node ID (Variant) | Screen Description | Fill/BG |
|---|--------------------------|------------------------|--------------------|---------|
| 03-01 | `23431:67051` | `23686:97230` | CHA — Introduction / Welcome | Gray/5 |
| 03-02 | `23431:67065` | `23686:97244` | CHA — Personal Info (name, age, gender) | Gray/5 |
| 03-03 | `23431:67077` | `23686:97256` | CHA — Height & Weight | Gray/5 |
| 03-04 | `23431:67089` | `23686:97268` | CHA — Existing Conditions | Gray/5 |
| 03-05 | `23431:67101` | `23686:97280` | CHA — Current Medications | Gray/5 |
| 03-06 | `23431:67115` | `23686:97294` | CHA — Allergies | Gray/5 |
| 03-07 | `23431:67132` | `23686:97311` | CHA — Family History | Gray/5 |
| 03-08 | `23431:67187` | `23686:97366` | CHA — Lifestyle: Exercise frequency | Gray/5 |
| 03-09 | `23431:67202` | `23686:97381` | CHA — Lifestyle: Diet preferences | Gray/5 |
| 03-10 | `23431:67217` | `23686:97396` | CHA — Lifestyle: Sleep quality | Gray/5 |
| 03-11 | `23431:67245` | `23686:97424` | CHA — Lifestyle: Stress level | Gray/5 |
| 03-12 | `23431:67261` | `23686:97440` | CHA — Lifestyle: Alcohol/Tobacco | Gray/5 |
| 03-13 | `23431:67281` | `23686:97460` | CHA — Lifestyle: Water intake | Gray/5 |
| 03-14 | `23431:67296` | `23686:97475` | CHA — Health Goals selection | Gray/5 |
| 03-15 | `23431:67452` | `23686:97631` | CHA — Mental Health screening | Gray/5 |
| 03-16 | `23431:67477` | `23686:97656` | CHA — Mental Health: Mood assessment | Gray/30 |
| 03-17 | `23431:67499` | `23686:97678` | CHA — Mental Health: Anxiety scale | Gray/30 |
| 03-18 | `23431:67520` | `23686:97699` | CHA — Reproductive Health | Gray/5 |
| 03-19 | `23431:67652` | `23686:97831` | CHA — Chronic Pain assessment | Gray/5 |
| 03-20 | `23431:67771` | `23686:97950` | CHA — Vaccination history | Gray/5 |
| 03-21 | `23431:67800` | `23686:97979` | CHA — Insurance / Health Plan info | Gray/30 |
| 03-22 | `23431:67823` | `23686:98002` | CHA — Emergency contacts | Gray/5 |
| 03-23 | `23431:67839` | `23686:98018` | CHA — Consent & Privacy agreement | Gray/5 |
| 03-24 | `23431:67856` | `23686:98035` | CHA — Review summary | Gray/5 |
| 03-25 | `23431:67881` | `23686:98060` | CHA — Submission confirmation | Gray/5 |
| 03-26 | `23431:68034` | `23686:98213` | CHA — Results / Health Score | Brand (#00C3F7) |

**Dev Route:** `src/screens/health-assessment/` → Stepper wizard with progress bar, form validation, FHIR Questionnaire resource

---

## Module 04 — Profile Setup & Account Completion
**Screens: 9** | **MVP: ✅ v1.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 04-01 | `20442:39819` | Profile Setup — Master overview | Purple overlay | Container for sub-flows |
| 04-02 | `23684:55511` | Profile — Avatar upload | Gray/5 | Camera/gallery photo picker |
| 04-03 | `23684:55524` | Profile — Personal details form | Gray/5 | Full name, DOB, gender, blood type |
| 04-04 | `23686:99808` | Profile — Address entry | Gray/5 | CEP auto-fill, city, state |
| 04-05 | `23686:100199` | Profile — Health plan card | Gray/5 | AUSTA plan number, card scan |
| 04-06 | `23686:100422` | Profile — Emergency contact setup | Gray/5 | Contact name, phone, relationship |
| 04-07 | `23686:100433` | Profile — Notification preferences | Gray/5 | Push, SMS, email toggles |
| 04-08 | `23686:100832` | Profile — Biometric auth setup | Gray/5 | Face ID / fingerprint enrollment |
| 04-09 | `23686:100994` | Profile — Setup complete | Gray/5 | Success state + go to Home CTA |

**Dev Route:** `src/screens/profile-setup/` → Multi-step form with image upload + biometric API

---

## Module 05 — Home & Smart Health Metrics
**Screens: 19** | **MVP: ✅ v1.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 05-01 | `20313:44314` | Home — Main dashboard | Brand (#00C3F7) | Primary landing screen with health score |
| 05-02 | `23694:41325` | Home — Critical alert state | Destructive (#E11D48) | Emergency/urgent notification overlay |
| 05-03 | `20431:66877` | Home — Header component (partial) | — | 375×315 — top portion with greeting |
| 05-04 | `23431:66447` | Home — Full scrollable content | Gray/5 | 371×2497 — complete scrollable page |
| 05-05 | `20365:27251` | Home — Health metrics cards expanded | Gray/5 | Heart rate, steps, sleep, calories |
| 05-06 | `20367:9731` | Home — Weekly summary view | Gray/5 | 7-day trend charts |
| 05-07 | `20368:40705` | Home — Bottom sheet / Quick actions | Gray/60 | Dark overlay with action sheet |
| 05-08 | `20368:33073` | Home — Medication reminders section | Gray/5 | Today's medications card |
| 05-09 | `20372:14379` | Home — Appointments upcoming | Gray/5 | Next doctor appointment card |
| 05-10 | `20368:36141` | Home — Health tips carousel | Gray/5 | AI-generated health recommendations |
| 05-11 | `20451:54981` | Home — Metric Detail: Heart Rate | Row group | Expanded vital sign view |
| 05-12 | `20455:70076` | Home — Metric Detail: Blood Pressure | Row group | BP history chart |
| 05-13 | `20455:70075` | Home — Metric Detail: SpO2 | Row group | Oxygen saturation trend |
| 05-14 | `20457:37610` | Home — Metric Detail: Steps | Row group | Daily step counter + goal |
| 05-15 | `20462:42441` | Home — Metric Detail: Sleep Score | Row group | Sleep quality breakdown |
| 05-16 | `20469:44038` | Home — Metric Detail: Weight | Row group | Weight trend over time |
| 05-17 | `20473:37006` | Home — Metric Detail: Calories | Row group | Caloric intake vs burn |
| 05-18 | `23684:97063` | Home — Empty state / No data | Gray/60 | First-time user with no metrics |
| 05-19 | `23688:102183` | Home — Connected devices | Gray/5 | Wearable pairing status |

**Dev Route:** `src/screens/home/` → Main tab screen + HealthKit/Google Fit integration + recharts

---

## Module 06 — AI Wellness Companion
**Screens: 15** | **MVP: 🔶 v1.1** | **Figma Section Label:** `AI Wellness Companion`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 06-01 | `20414:28939` | Companion — Chat home / Welcome | Gray/5 | AI avatar + "How are you feeling?" |
| 06-02 | `20414:28984` | Companion — Chat conversation active | Gray/5 | Message bubbles + typing indicator |
| 06-03 | `20414:29639` | Companion — Quick replies / Suggestions | Gray/5 | Preset response chips |
| 06-04 | `21643:212395` | Companion — Mood check-in prompt | Gray/5 | Daily mood selection (emoji scale) |
| 06-05 | `20414:60595` | Companion — Wellness tip detail | Gray/5 | Expanded health article / advice |
| 06-06 | `20414:61587` | Companion — Breathing exercise | Gray/5 | Guided breathing animation |
| 06-07 | `20414:60683` | Companion — Meditation guide | Gray/5 | Audio player + timer |
| 06-08 | `20414:61722` | Companion — Daily wellness plan | Gray/5 | Personalized to-do checklist |
| 06-09 | `20414:62154` | Companion — Health insights report | Gray/5 | AI-generated weekly insights |
| 06-10 | `20414:73371` | Companion — Goals progress tracker | Gray/5 | Goal completion rings |
| 06-11 | `20416:46414` | Companion — Journal entry | Gray/5 | Free-text health journal |
| 06-12 | `20416:46856` | Companion — Journal history | Gray/5 | Past entries timeline |
| 06-13 | `20416:47546` | Companion — Wellness challenges | Gray/5 | Gamified challenge cards |
| 06-14 | `20417:47404` | Companion — Challenge detail (375×1006) | Gray/5 | Expanded challenge info |
| 06-15 | `20417:60848` | Companion — Streak & rewards | Gray/5 | Consecutive day streak tracker |

**Dev Route:** `src/screens/ai-companion/` → Claude API integration + chat UI + wellness content engine

---

## Module 07 — AI Symptom Checker
**Screens: 30** | **MVP: ✅ v1.0** | **Figma Section Label:** `AI Symptom Checker`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 07-01 | `20406:25812` | Symptom Checker — Home / Start | Gray/5 | "What's bothering you?" entry point |
| 07-02 | `20406:26230` | Symptom — Body map (front) | Gray/5 | Tap body area to select symptoms |
| 07-03 | `20488:76815` | Symptom — Body map (back) | Gray/5 | Rear body view |
| 07-04 | `20488:77034` | Symptom — Body map (head detail) | Gray/5 | Zoomed head/face areas |
| 07-05 | `20406:48065` | Symptom — Search/text input | Gray/30 | Type symptom with autocomplete |
| 07-06 | `20406:48560` | Symptom — Symptom list selection | Gray/5 | Multi-select from categorized list |
| 07-07 | `20408:23818` | Symptom — Duration question | Gray/5 | "How long have you felt this?" |
| 07-08 | `20408:24437` | Symptom — Severity scale | Gray/5 | 1-10 pain/discomfort slider |
| 07-09 | `20409:23808` | Symptom — Additional symptoms | Gray/5 | "Any other symptoms?" secondary input |
| 07-10 | `21643:215304` | Symptom — Photo upload option | Gray/5 | Camera for skin/visible symptoms |
| 07-11 | `20409:46823` | Symptom — Medical history context | Gray/5 | Relevant existing conditions |
| 07-12 | `20409:47320` | Symptom — Current medications context | Gray/5 | Active medications for interaction check |
| 07-13 | `20409:47387` | Symptom — Vitals entry (temperature) | Gray/5 | Manual vital sign input |
| 07-14 | `20409:47438` | Symptom — AI analyzing (loading) | Gray/5 | Progress animation + "Analisando..." |
| 07-15 | `20409:47907` | Symptom — AI results: Low urgency | Gray/5 | Green result — self-care recommendations |
| 07-16 | `20409:47474` | Symptom — AI results: Medium urgency | Gray/5 | Yellow — schedule appointment suggested |
| 07-17 | `20409:47715` | Symptom — AI results: High urgency | Gray/5 | Red — seek immediate care |
| 07-18 | `20409:47809` | Symptom — Possible conditions list | Gray/5 | Ranked differential diagnosis |
| 07-19 | `20490:60193` | Symptom — Condition detail expanded | Gray/5 | Description, symptoms match %, sources |
| 07-20 | `20409:47951` | Symptom — Recommended actions | Gray/5 | Next steps: self-care, pharmacy, doctor |
| 07-21 | `20409:48378` | Symptom — Self-care instructions | Gray/5 | Home treatment guidance |
| 07-22 | `20409:48392` | Symptom — When to seek emergency | Gray/5 | Red flags / warning signs |
| 07-23 | `20409:48768` | Symptom — Book appointment CTA | Gray/5 | Direct link to doctor booking |
| 07-24 | `20409:49050` | Symptom — Nearest ER / UBS locator | Gray/5 | Map with nearby facilities |
| 07-25 | `20409:49537` | Symptom — Save report | Gray/5 | PDF/save symptom check report |
| 07-26 | `20409:49571` | Symptom — Share with doctor | Gray/5 | Send report to physician |
| 07-27 | `20409:49614` | Symptom — History: Past checks | Gray/5 | Timeline of past symptom checks |
| 07-28 | `20409:49681` | Symptom — History: Check detail | Gray/5 | Individual past check review |
| 07-29 | `20409:49813` | Symptom — Feedback on accuracy | Gray/5 | "Was this helpful?" rating |
| 07-30 | `20409:50165` | Symptom — Follow-up reminder set | Gray/5 | Schedule follow-up check-in |

**Dev Route:** `src/screens/symptom-checker/` → Claude API triage + body map SVG + location services

---

## Module 08 — Medication Tracker
**Screens: 26** | **MVP: ✅ v1.0** | **Figma Section Label:** `Rastreador de Medicamentos`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 08-01 | `20410:27039` | Medications — Home / Today's schedule | Gray/5 | Timeline of today's doses |
| 08-02 | `20410:27615` | Medications — Weekly calendar view | Gray/5 | 7-day medication calendar |
| 08-03 | `20410:27889` | Medications — All medications list | Gray/5 | Full medication inventory |
| 08-04 | `23694:40848` | Medications — Empty state | Gray/5 | No medications added yet |
| 08-05 | `20410:27903` | Medications — Add medication: Search | Gray/5 | Drug name autocomplete search |
| 08-06 | `20410:27876` | Medications — Add: Dosage & form | Gray/5 | Pill, liquid, injection selector |
| 08-07 | `21646:64055` | Medications — Add: Schedule setup | Gray/5 | Frequency, times, duration |
| 08-08 | `20493:46692` | Medications — Add: Reminder setup | Gray/30 | Notification timing preferences |
| 08-09 | `20493:46676` | Medications — Add: Confirmation | Gray/30 | Review + save medication |
| 08-10 | `20411:24471` | Medications — Dose taken confirmation | Gray/60 | "Tomou?" action with dark overlay |
| 08-11 | `20411:24618` | Medications — Dose skipped / Missed | Gray/5 | Missed dose handling + reason |
| 08-12 | `20410:28226` | Medications — Medication detail view | Gray/5 | Full info: drug, dosage, interactions |
| 08-13 | `21646:67161` | Medications — Edit medication | Gray/5 | Modify existing medication |
| 08-14 | `21646:67459` | Medications — Delete confirmation | Gray/30 | "Remove medication?" dialog |
| 08-15 | `20412:24810` | Medications — Adherence chart | Gray/5 | % adherence over time (chart) |
| 08-16 | `23694:41050` | Medications — Monthly adherence report | Gray/5 | Detailed monthly compliance stats |
| 08-17 | `20412:24985` | Medications — Refill reminder | Gray/60 | Low stock / refill alert |
| 08-18 | `20413:25478` | Medications — Drug interaction warning | Gray/5 | AI-detected interaction alert |
| 08-19 | `21646:67544` | Medications — Side effects log | Gray/5 | Track side effects experienced |
| 08-20 | `21646:67555` | Medications — Side effect entry form | Gray/5 | Report new side effect |
| 08-21 | `21646:67585` | Medications — Pharmacy locator | Gray/5 | Nearest pharmacy map |
| 08-22 | `21646:67628` | Medications — Prescription photo | Gray/30 | Camera capture of prescription |
| 08-23 | `23694:40754` | Medications — Prescription review | Gray/30 | OCR result + verify |
| 08-24 | `21646:67648` | Medications — Share with caregiver | Gray/30 | Share med list with family |
| 08-25 | `21646:67684` | Medications — Caregiver access setup | Gray/5 | Permission management |
| 08-26 | `21646:67716` | Medications — Export / Print list | Gray/5 | PDF export of medications |

**Dev Route:** `src/screens/medications/` → Local notifications + drug database API + adherence tracking

---

## Module 09 — Sleep Management
**Screens: 1 (placeholder)** | **MVP: ⬜ v2.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 09-01 | `20477:37838` | Sleep — Module placeholder (grouped) | Gray/40 | Contains sub-screens inside group frame |

**Status:** Screens exist inside the grouped placeholder but are not individually expanded. Expected ~12-15 screens (sleep log, quality analysis, trends, bedtime routine, smart alarm).

**Dev Route:** `src/screens/sleep/` — Deferred to v2.0

---

## Module 10 — Activity Tracker
**Screens: 1 (placeholder)** | **MVP: ⬜ v2.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 10-01 | `20482:62038` | Activity — Module placeholder (grouped) | Gray/40 | Contains sub-screens inside group frame |

**Status:** Expected ~10-12 screens (daily activity, workout log, step goals, exercise library, wearable sync).

**Dev Route:** `src/screens/activity/` — Deferred to v2.0

---

## Module 11 — Nutrition Monitoring
**Screens: 1 (placeholder)** | **MVP: ⬜ v2.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 11-01 | `20488:45260` | Nutrition — Module placeholder (grouped) | Gray/40 | Contains sub-screens inside group frame |

**Status:** Expected ~10-12 screens (food diary, meal logging, calorie tracker, macros, water intake, dietary goals).

**Dev Route:** `src/screens/nutrition/` — Deferred to v2.0

---

## Module 12 — Period & Cycle Tracking
**Screens: 15** | **MVP: ⬜ v2.0** | **Figma Section Label:** `Acompanhamento do ciclo e período`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 12-01 | `20404:22832` | Cycle — Home / Calendar view | Gray/5 | Monthly calendar with cycle overlay |
| 12-02 | `20404:23275` | Cycle — Today's status | Gray/5 | Current day in cycle + predictions |
| 12-03 | `20488:65020` | Cycle — Log period start | Gray/5 | Mark period start date |
| 12-04 | `20404:41200` | Cycle — Log symptoms | Gray/5 | Cramps, mood, energy tracking |
| 12-05 | `20404:41306` | Cycle — Log flow intensity | Gray/5 | Light/Medium/Heavy selector |
| 12-06 | `20488:65104` | Cycle — Fertility window | Gray/5 | Ovulation prediction display |
| 12-07 | `20404:41481` | Cycle — PMS predictions | Gray/5 | Upcoming PMS symptoms forecast |
| 12-08 | `20404:43668` | Cycle — History / Past cycles | Gray/5 | Multi-month cycle history |
| 12-09 | `20488:69481` | Cycle — Cycle analysis (statistics) | Gray/5 | Average length, regularity metrics |
| 12-10 | `20488:71438` | Cycle — Insights & education | Gray/5 | Health articles related to cycle |
| 12-11 | `20488:71482` | Cycle — Article detail | Gray/5 | Expanded educational content |
| 12-12 | `20488:69580` | Cycle — Reminders setup | Gray/5 | Period prediction notifications |
| 12-13 | `20404:42697` | Cycle — Partner sharing | Gray/5 | Share cycle info with partner |
| 12-14 | `23694:41173` | Cycle — Settings & preferences | Gray/5 | Cycle length, notifications config |
| 12-15 | `20404:45148` | Cycle — Export health report | — | PDF of cycle data for doctor |

**Dev Route:** `src/screens/cycle-tracking/` — Deferred to v2.0

---

## Module 13 — Doctor Consultation
**Screens: 38** | **MVP: ✅ v1.0** | **Figma Section Label:** `Doctor Consultation`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 13-01 | `20419:50825` | Consultation — Home / Browse doctors | Gray/5 | Doctor listing with specialties |
| 13-02 | `20419:51528` | Consultation — Search & filters | Gray/5 | Specialty, insurance, distance filters |
| 13-03 | `20419:51204` | Consultation — Doctor profile card | Gray/5 | Name, photo, specialty, rating |
| 13-04 | `20510:42292` | Consultation — Doctor detail page | Gray/5 | Full bio, experience, reviews |
| 13-05 | `20419:52138` | Consultation — Reviews list (375×1229) | Gray/30 | Patient reviews scrollable |
| 13-06 | `21650:51628` | Consultation — Available time slots | Gray/5 | Calendar date + time picker |
| 13-07 | `23688:102942` | Consultation — Slot selection | Gray/5 | Selected date/time confirmation |
| 13-08 | `20419:52688` | Consultation — Appointment type | Gray/5 | In-person / Video / Chat selection |
| 13-09 | `20419:52899` | Consultation — Reason for visit | Gray/20 | Describe symptoms / concern |
| 13-10 | `20419:53130` | Consultation — Attach documents | Gray/5 | Upload labs, prescriptions, photos |
| 13-11 | `20422:32118` | Consultation — Insurance verification | Gray/5 | AUSTA plan card + coverage check |
| 13-12 | `20424:32878` | Consultation — Booking confirmation | Gray/5 | Summary + confirm appointment |
| 13-13 | `20424:51243` | Consultation — Booking success | Gray/5 | ✅ Appointment booked! |
| 13-14 | `20426:31728` | Consultation — My appointments list | Gray/5 | Upcoming & past appointments |
| 13-15 | `20426:32281` | Consultation — Appointment detail | Gray/5 | Full appointment info + actions |
| 13-16 | `20426:32456` | Consultation — Reschedule flow | Gray/5 | Change date/time |
| 13-17 | `20426:32074` | Consultation — Cancel confirmation | Gray/5 | Cancel with reason |
| 13-18 | `20426:32151` | Consultation — Cancelled state | Gray/5 | Appointment cancelled confirmation |
| 13-19 | `20426:32149` | Consultation — No-show handling | Gray/5 | Missed appointment notification |
| 13-20 | `20513:54331` | Consultation — Pre-visit checklist | Gray/5 | Prepare for appointment |
| 13-21 | `20513:72238` | Consultation — Waiting room (virtual) | Gray/5 | Video call waiting screen |
| 13-22 | `20427:58596` | Consultation — Video call: Connecting | Gray/60 | Dark BG — establishing connection |
| 13-23 | `20427:58730` | Consultation — Video call: Active | Gray/5 | Live video with doctor |
| 13-24 | `20427:58910` | Consultation — Video call: Controls | Gray/60 | Mute, camera, chat, end call |
| 13-25 | `20427:59455` | Consultation — Video call: Chat overlay | Gray/5 | Text chat during video |
| 13-26 | `20427:59622` | Consultation — Video call: Screen share | Gray/60 | Doctor sharing results |
| 13-27 | `20427:59754` | Consultation — Video call: End screen | Gray/5 | Call ended summary |
| 13-28 | `20427:60240` | Consultation — Post-visit: Summary | Gray/5 | Doctor's notes + diagnosis |
| 13-29 | `21650:83191` | Consultation — Post-visit: Prescriptions | Gray/5 | New prescriptions from visit |
| 13-30 | `20427:60625` | Consultation — Post-visit: Follow-up | Gray/5 | Schedule follow-up recommendation |
| 13-31 | `20427:60860` | Consultation — Post-visit: Lab orders | Gray/5 | Ordered lab tests list |
| 13-32 | `20515:42161` | Consultation — Post-visit: Referral | Gray/5 | Specialist referral document |
| 13-33 | `20427:60914` | Consultation — Rate your visit | Gray/5 | Star rating + feedback |
| 13-34 | `20427:61423` | Consultation — Payment summary | Gray/5 | Copay, insurance coverage breakdown |
| 13-35 | `23688:103174` | Consultation — Receipt / Invoice | Gray/5 | PDF receipt download |
| 13-36 | `20427:61647` | Consultation — Chat with doctor (async) | Gray/5 | Post-visit messaging |
| 13-37 | `20427:62154` | Consultation — Medical records access | Gray/5 | View shared records from visit |
| 13-38 | `20515:42861` | Consultation — Favorites / Saved doctors | Gray/5 | Bookmarked doctor profiles |

**Dev Route:** `src/screens/consultation/` → WebRTC video + calendar booking + payment gateway

---

## Module 14 — Notification & Search
**Screens: 10** | **MVP: ✅ v1.0** | **Figma Section Label:** `Notification & Search`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 14-01 | `20427:72389` | Notifications — Inbox / All | Gray/5 | All notifications list |
| 14-02 | `20427:74793` | Notifications — Unread filter | Gray/5 | Unread notifications only |
| 14-03 | `20516:63598` | Notifications — Category filter | Gray/5 | Filter by type (health, appts, meds) |
| 14-04 | `20427:76217` | Notifications — Detail / Expanded | Gray/5 | Individual notification content |
| 14-05 | `20427:76131` | Notifications — Empty state | Gray/5 | No notifications yet |
| 14-06 | `20427:75333` | Search — Home / Global search | Gray/5 | Universal search entry |
| 14-07 | `20427:76408` | Search — Results: Doctors | Gray/5 | Doctor search results |
| 14-08 | `20427:76641` | Search — Results: Articles | Gray/5 | Health content search results |
| 14-09 | `20427:76673` | Search — Results: Medications (375×923) | Gray/30 | Drug search results |
| 14-10 | `20427:76810` | Search — No results state | Gray/30 | Empty search results |

**Dev Route:** `src/screens/notifications/` + `src/screens/search/` → Push notifications + Algolia search

---

## Module 15 — Error & Utility
**Screens: 1 (placeholder)** | **MVP: ✅ v1.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 15-01 | `20518:68135` | Error & Utility — Placeholder (grouped) | Green tint | Contains: 404, no connection, maintenance, loading states |

**Status:** Expected ~4-6 screens inside the grouped frame (Error 404, No Internet, Server Error, Maintenance Mode, Force Update, Session Expired).

**Dev Route:** `src/screens/utility/` → Global error boundary + connectivity listener

---

## Module 16 — Wellness Resources
**Screens: 1 (placeholder)** | **MVP: ⬜ v2.0**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 16-01 | `20519:43188` | Wellness Resources — Placeholder (grouped) | Gray/40 | Health articles, videos, educational content |

**Dev Route:** `src/screens/wellness-resources/` — Deferred to v2.0

---

## Module 17 — Health Community
**Screens: 1 (placeholder)** | **MVP: ❌ Future**

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 17-01 | `20519:66013` | Health Community — Placeholder (grouped) | Gray/40 | Social features, forums, support groups |

**Dev Route:** `src/screens/community/` — Deferred to future release

---

## Module 18 — Profile Settings & Help Center
**Screens: 33** | **MVP: ✅ v1.0** | **Figma Section Label:** `Profile Settings & Help Center`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 18-01 | `23512:43073` | Settings — Main menu | Gray/30 | Profile header + settings list |
| 18-02 | `23512:43327` | Settings — Profile edit | Gray/5 | Edit name, photo, contact info |
| 18-03 | `23512:43545` | Settings — Personal information | Gray/5 | Full personal data management |
| 18-04 | `23512:43588` | Settings — Change password | Gray/5 | Current + new password fields |
| 18-05 | `23512:43599` | Settings — Two-factor auth | Gray/5 | 2FA setup / manage |
| 18-06 | `23512:43617` | Settings — Biometric preferences | Gray/5 | Face ID / fingerprint toggle |
| 18-07 | `23512:43625` | Settings — Notification preferences | Gray/5 | Granular notification controls |
| 18-08 | `23512:43799` | Settings — Privacy & data (375×981) | Gray/5 | LGPD consent management |
| 18-09 | `23512:43869` | Settings — Data export / Download | Gray/5 | Request data copy (LGPD right) |
| 18-10 | `23512:43889` | Settings — Delete account | — | Account deletion flow |
| 18-11 | `23512:43922` | Settings — Delete confirmation | Gray/5 | "Are you sure?" + consequences |
| 18-12 | `23512:44176` | Settings — Language selection | Gray/5 | pt-BR, en-US, es options |
| 18-13 | `23512:44200` | Settings — Appearance (theme) | Gray/5 | Light/Dark/System toggle |
| 18-14 | `23512:44252` | Settings — Accessibility options | Gray/5 | Font size, contrast, screen reader |
| 18-15 | `23512:44276` | Settings — Connected devices | Gray/5 | Manage wearables & integrations |
| 18-16 | `23512:44533` | Settings — Health plan info | Gray/5 | AUSTA plan details & card |
| 18-17 | `23512:44581` | Settings — Insurance documents | Gray/5 | Plan documents, ID cards |
| 18-18 | `23512:44641` | Settings — Dependents management | Gray/5 | Add/manage family members |
| 18-19 | `23512:44842` | Settings — Add dependent form | Gray/5 | Dependent registration |
| 18-20 | `23512:44855` | Settings — Emergency contacts | Gray/5 | Edit emergency contacts |
| 18-21 | `23512:44991` | Settings — Address management | Gray/5 | Home, work, other addresses |
| 18-22 | `23694:41429` | Settings — Add address form | Gray/5 | CEP lookup + fields |
| 18-23 | `23512:45151` | Help — Help Center home | Gray/5 | FAQ categories + search |
| 18-24 | `23512:45281` | Help — FAQ category | Gray/5 | Expanded FAQ section |
| 18-25 | `23512:45290` | Help — FAQ article detail | Gray/5 | Individual FAQ answer |
| 18-26 | `23512:45428` | Help — Contact support options | Gray/5 | Chat, phone, email channels |
| 18-27 | `23512:45440` | Help — Live chat with support | Gray/5 | In-app support chat |
| 18-28 | `23512:45458` | Help — Report a problem | Gray/5 | Bug report / feedback form |
| 18-29 | `23512:45601` | Help — Terms of service | Gray/5 | Legal terms document |
| 18-30 | `23512:45707` | Help — Privacy policy | Gray/5 | LGPD privacy policy |
| 18-31 | `23512:45936` | Settings — About the app | Gray/5 | Version, credits, licenses |
| 18-32 | `23512:45949` | Settings — Logout confirmation | — | "Sign out?" dialog |
| 18-33 | `23512:46009` | Settings — App feedback | Gray/5 | Rate app + feedback form |

**Dev Route:** `src/screens/settings/` + `src/screens/help/` → AsyncStorage prefs + LGPD compliance + support integration

---

## Module 19 — Achievements
**Screens: 7** | **MVP: 🔶 v1.1** | **Figma Section Label:** `Achievements`

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 19-01 | `20433:73777` | Achievements — Overview / Trophy room | Gray/5 | All badges & achievements grid |
| 19-02 | `20433:74324` | Achievements — Badge detail | Gray/5 | Individual achievement info |
| 19-03 | `20433:72480` | Achievements — Leaderboard | Gray/5 | Compare with community |
| 19-04 | `20433:72537` | Achievements — Streak tracker | Gray/15 | Consecutive activity streaks |
| 19-05 | `20433:72800` | Achievements — Points history | Gray/5 | Points earned/spent timeline |
| 19-06 | `20433:72823` | Achievements — Rewards store | Gray/5 | Redeem points for rewards |
| 19-07 | `20433:72853` | Achievements — Share achievement | Gray/5 | Share to social media |

**Dev Route:** `src/screens/achievements/` → Gamification engine + badge logic + push celebrations

---

## Module 20 — Dark Mode
**Groups: 20** | **MVP: 🔶 v1.1**

Each module has a corresponding Dark Mode group in the `↳ Main - Dark Mode ⚫` canvas (ID: `20552:42703`):

| # | Figma Node ID | Module Group | Fill/BG |
|---|---------------|-------------|---------|
| 20-01 | `20552:42704` | Splash & Loading | Gray/60 |
| 20-02 | `20552:42833` | Welcome Screen | Gray/60 |
| 20-03 | `20558:43730` | Authentication | Gray/60 |
| 20-04 | `20558:46062` | Comprehensive Health Assessment | Gray/60 |
| 20-05 | `20558:68369` | Profile Setup & Account Completion | Gray/60 |
| 20-06 | `20558:74067` | Home & Smart Health Metrics | Gray/60 |
| 20-07 | `20567:99387` | AI Wellness Companion | Gray/60 |
| 20-08 | `20567:110420` | AI Symptom Checker | Gray/60 |
| 20-09 | `20568:67966` | Medication Tracker | Gray/60 |
| 20-10 | `20561:55744` | Sleep Management | Gray/60 |
| 20-11 | `20561:61845` | Activity Tracker | Gray/60 |
| 20-12 | `20566:81603` | Nutrition Monitoring | Gray/60 |
| 20-13 | `20569:92437` | Period & Cycle Tracking | Gray/60 |
| 20-14 | `20569:95143` | Doctor Consultation | Gray/60 |
| 20-15 | `20570:75110` | Notification & Search | Gray/60 |
| 20-16 | `20570:76677` | Error & Utility | Gray/60 |
| 20-17 | `20570:79242` | Wellness Resources | Gray/60 |
| 20-18 | `20570:99398` | Health Community | Gray/60 |
| 20-19 | `20576:115075` | Profile Settings & Help Center | Gray/60 |
| 20-20 | `20576:130452` | Achievements | Gray/60 |

**Dev Note:** Dark Mode uses `Gray/60` (#4B5563) as base background. Implementation via React Native `useColorScheme()` + design token theme switching (see `dark.json` token file).

---

## Module 21 — Bonus Dashboard (Admin)
**Screens: 6** | **MVP: ❌ Future**

Canvas: `↳ Bonus (Dashboard)` (ID: `20578:80833`) — Desktop-sized frames (1600×1200)

| # | Figma Node ID | Screen Description | Fill/BG | Notes |
|---|---------------|-------------------|---------|-------|
| 21-01 | `20578:83558` | Dashboard — Light theme variant 1 | Gray/20 | Admin overview |
| 21-02 | `20578:83823` | Dashboard — Dark theme | Gray/70 | Dark admin dashboard |
| 21-03 | `20578:84081` | Dashboard — Brand theme | Brand/20 | AUSTA-branded variant |
| 21-04 | `20578:84230` | Dashboard — Analytics view | Gray/30 | Charts & metrics |
| 21-05 | `21682:1976` | Dashboard — Patient management | Gray/30 | Patient list & records |
| 21-06 | `21682:5456` | Dashboard — Settings (dark) | Gray/60 | Admin settings |

**Dev Route:** `src/admin/dashboard/` — Separate web app (Next.js), not mobile. Deferred to future.

---

## Development Routing Matrix

### Recommended Folder Structure

```
src/
├── screens/
│   ├── onboarding/          # Module 01 — Welcome Screen (11)
│   │   ├── SplashScreen.tsx
│   │   ├── OnboardingCarousel.tsx
│   │   └── GoalSelection.tsx
│   ├── auth/                # Module 02 — Authentication (6)
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ForgotPasswordScreen.tsx
│   │   └── OTPVerificationScreen.tsx
│   ├── health-assessment/   # Module 03 — CHA (52 → 26 unique steps)
│   │   ├── AssessmentWizard.tsx
│   │   ├── steps/           # 26 step components
│   │   └── AssessmentResults.tsx
│   ├── profile-setup/       # Module 04 — Profile Setup (9)
│   │   ├── ProfileSetupWizard.tsx
│   │   ├── AvatarUpload.tsx
│   │   └── BiometricSetup.tsx
│   ├── home/                # Module 05 — Home (19)
│   │   ├── HomeScreen.tsx
│   │   ├── HealthMetricsCard.tsx
│   │   ├── MetricDetail.tsx
│   │   └── ConnectedDevices.tsx
│   ├── ai-companion/        # Module 06 — AI Companion (15)
│   │   ├── CompanionChat.tsx
│   │   ├── MoodCheckIn.tsx
│   │   ├── BreathingExercise.tsx
│   │   └── JournalEntry.tsx
│   ├── symptom-checker/     # Module 07 — Symptom Checker (30)
│   │   ├── SymptomHome.tsx
│   │   ├── BodyMap.tsx
│   │   ├── SymptomQuestions.tsx
│   │   ├── AIAnalysis.tsx
│   │   ├── ResultsScreen.tsx
│   │   └── SymptomHistory.tsx
│   ├── medications/         # Module 08 — Medication Tracker (26)
│   │   ├── MedicationHome.tsx
│   │   ├── AddMedication.tsx
│   │   ├── MedicationDetail.tsx
│   │   ├── AdherenceChart.tsx
│   │   └── PrescriptionScanner.tsx
│   ├── sleep/               # Module 09 — Sleep (placeholder)
│   ├── activity/            # Module 10 — Activity (placeholder)
│   ├── nutrition/           # Module 11 — Nutrition (placeholder)
│   ├── cycle-tracking/      # Module 12 — Period & Cycle (15)
│   │   ├── CycleHome.tsx
│   │   ├── CycleCalendar.tsx
│   │   └── CycleAnalysis.tsx
│   ├── consultation/        # Module 13 — Doctor Consultation (38)
│   │   ├── DoctorBrowse.tsx
│   │   ├── DoctorProfile.tsx
│   │   ├── BookingFlow.tsx
│   │   ├── VideoCall.tsx
│   │   ├── PostVisitSummary.tsx
│   │   └── PaymentScreen.tsx
│   ├── notifications/       # Module 14 — Notifications (5)
│   │   ├── NotificationList.tsx
│   │   └── NotificationDetail.tsx
│   ├── search/              # Module 14 — Search (5)
│   │   ├── SearchHome.tsx
│   │   └── SearchResults.tsx
│   ├── utility/             # Module 15 — Error & Utility
│   │   ├── Error404.tsx
│   │   ├── NoConnection.tsx
│   │   └── MaintenanceMode.tsx
│   ├── settings/            # Module 18 — Settings (20)
│   │   ├── SettingsHome.tsx
│   │   ├── ProfileEdit.tsx
│   │   ├── SecuritySettings.tsx
│   │   ├── PrivacySettings.tsx
│   │   ├── HealthPlanInfo.tsx
│   │   └── DependentsManage.tsx
│   ├── help/                # Module 18 — Help Center (13)
│   │   ├── HelpCenter.tsx
│   │   ├── FAQScreen.tsx
│   │   └── SupportChat.tsx
│   └── achievements/        # Module 19 — Achievements (7)
│       ├── AchievementsHome.tsx
│       └── Leaderboard.tsx
├── navigation/
│   ├── RootNavigator.tsx
│   ├── AuthStack.tsx
│   ├── MainTabs.tsx
│   └── stacks/              # Per-module stack navigators
├── components/              # asklepios UI Kit shared components
├── theme/                   # Design tokens (from token files)
│   ├── tokens/
│   │   ├── core.json
│   │   ├── light.json
│   │   ├── dark.json
│   │   └── theme.json
│   └── ThemeProvider.tsx
└── services/                # API & business logic
    ├── auth/
    ├── health/
    ├── ai/
    └── consultation/
```

### Sprint Planning Reference

| Sprint | Modules | Est. Screens | Focus |
|--------|---------|-------------|-------|
| Sprint 1 (2 weeks) | 01 Welcome + 02 Auth + 04 Profile Setup | 26 | Onboarding funnel |
| Sprint 2 (2 weeks) | 05 Home + 15 Error/Utility | 23 | Core navigation + error handling |
| Sprint 3 (2 weeks) | 07 Symptom Checker | 30 | AI triage — key differentiator |
| Sprint 4 (2 weeks) | 08 Medication Tracker | 26 | Daily engagement feature |
| Sprint 5 (2 weeks) | 13 Doctor Consultation (Part 1: browse/book) | 19 | Booking flow |
| Sprint 6 (2 weeks) | 13 Doctor Consultation (Part 2: video/post) | 19 | Video call + post-visit |
| Sprint 7 (2 weeks) | 14 Notifications + 18 Settings/Help | 43 | Polish + settings complete |
| Sprint 8 (2 weeks) | v1.0 QA + Launch prep | — | Bug fixes, performance, launch |
| Sprint 9 (2 weeks) | 03 CHA + 06 AI Companion | 67 | v1.1 features |
| Sprint 10 (2 weeks) | 19 Achievements + 20 Dark Mode | 27 | Gamification + theme |

---

## Appendix: Figma Access Quick Reference

| Resource | Value |
|----------|-------|
| File Key | `OcG9oRNdUEskvAPUcKiKMe` |
| Light Mode Canvas | `20307:23730` |
| Dark Mode Canvas | `20552:42703` |
| Design System Canvas | `10611:33504` |
| Icon Set Canvas | `5367:38988` |
| Dashboard Canvas | `20578:80833` |
| Figma URL | `figma.com/design/OcG9oRNdUEskvAPUcKiKMe` |

> **NOTE on duplicate-named screens:** Figma names all screens within a module identically (e.g., "Doctor Consultation" × 38). The unique identifiers are the **Node IDs** in column 2 of each table. When fetching individual screen data via Figma API or implementing in code, always reference by Node ID, not by name.
