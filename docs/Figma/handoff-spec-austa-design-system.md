# Handoff Spec: Austa App — Full Design System & Components

**Figma source:** [Austa App — Design System & Components](https://www.figma.com/design/OcG9oRNdUEskvAPUcKiKMe/Austa-app?node-id=10611-33504)
**Page:** ↳ Design System & Components
**Total symbols/variants:** 4,658+
**Total internal components:** 40

---

## 1. Architecture Overview

The design system is organized into **2 top-level sections**:

| Section | Contents |
|---------|----------|
| **Foundations** | Colors, Typography, Logo, Media, Effects, Variables, Grid & Spacing |
| **Components** | 24 component groups (Alert, Accordion, Badge, Button, etc.) + Mobile App Components |

---

## 2. Foundations

### 2.1 Color System

**Primary brand palette** (extracted from design tokens):

| Token | Hex | Usage |
|-------|-----|-------|
| `Gray/0 (White)` | `#FFFFFF` | Backgrounds, button labels on brand |
| `Gray/5` | `#F8FAFC` | Subtle backgrounds, cards |
| `Gray/20` | `#E2E8F0` | Borders, dividers |
| `Gray/40` | `#94A3B8` | Placeholder text, disabled states |
| `Gray/60` | `#4B5563` | Secondary text, icons |
| `Gray/80` | `#1F2937` | Primary text, headings |
| `Brand/60` | `#05AEDB` | Primary CTA, links, active states |
| `azul aust` | `#00C3F7` | Brand accent, gradients |

**Color swatch types defined in Figma:**
- `Type=Solid` — flat color fills
- `Type=Gradient` — linear/radial gradients
- `Type=Mesh` — mesh gradients (decorative/hero use)

**Additional color categories** (from the Variables section):
- Semantic colors: Success, Destructive, Brand, Gray
- Each has Primary and Secondary hierarchy variants
- Each has Mobile (`Is Mobile=True`) and Desktop (`Is Mobile=False`) variants

### 2.2 Typography

**Font family:** Plus Jakarta Sans (Google Fonts)

| Token | Weight | Size | Line Height | Letter Spacing | Usage |
|-------|--------|------|-------------|----------------|-------|
| `Heading xl/Bold` | 700 | 60px | 68px | -1.8px | Page titles |
| `Text lg/SemiBold` | 600 | 18px | 24px | -0.8px | Subheadings, breadcrumbs |
| `Text md/SemiBold` | 600 | 16px | 22px | -0.7px | Button labels, body emphasis |

> **Note:** The full typography scale is documented in the "Typography" frame in Figma with `_TypographyRowItem` and `_TypographyMetadata` components. Developers should reference the Figma file for the complete type scale (additional sizes: xs, sm, md, lg, xl, 2xl, 3xl, 4xl).

### 2.3 Logo

The Austa logo is available in the "Logo" frame with the "AUSTA SUPER APP" wordmark. The logomark is a geometric symbol used at 40×40px in headers and navigation.

### 2.4 Effects (Shadows, Blur, Focus)

Documented in the "Effects (Shadow, Blur, Focus)" frame using `_EffectsBase` components. Includes elevation levels for cards, modals, dropdowns, and focus rings.

### 2.5 Grid & Spacing

Defined in the "Grid & Spacing" frame. The spacing scale uses the following size tokens:

| Size Token | Scale |
|------------|-------|
| `3xs` | Tightest |
| `2xs` | — |
| `xs` | — |
| `sm` | — |
| `md` | Base |
| `lg` | — |
| `xl` | — |
| `2xl` | — |
| `3xl` | — |
| `4xl` | Loosest |

---

## 3. Component Library

### 3.1 Component Index

| Component Group | Key Variants / Props | Notes |
|----------------|---------------------|-------|
| **Alert & Notification** | Community Notification | Toast/banner notifications |
| **Accordion** | `Is Active`, `Is Expanded` | Collapsible content sections |
| **Badge/Tag** | Badge Icon; `Status` (Active, etc.), `Size` (lg/md/sm), `Type` (Dot/Icon/Text) | 94 status variants |
| **Button** | `Color` (Brand/Destructive/Gray/Success), `Hierarchy` (Primary/Secondary/No Fill), `Size` (2xl–sm), `State` (Default/Disabled/Focused/Hovered/Pressed), `Is Mobile` | 576+ hierarchy variants; Button Icon frame (1672×2342px) |
| **Breadcrumb** | `Divider Type` (Colon/Icon/Slash) | Navigation breadcrumbs |
| **Chat System** | AI Assistant, AI Companion, Text Input AI Immersive | Chat bubbles, input bars |
| **Line Chart** | `Data` (7/12/30 Point), `Series` (1–3), `Thickness` (sm/md/lg), `Trend` (Negative/Neutral/Positive, Type=Curve/Realistic/Sharp) | Full charting system with axes |
| **Date Picker** | `_CalendarDateCell`, `_CalendarHeader`, `_CalendarLabel`, Date Picker Alt | Calendar grid + header |
| **Dialog/Modal** | — | Modal overlays |
| **Dropdown** | `_DropdownAccountHeader`, `_DropdownListItem` | Dropdown menus |
| **File Upload** | File Types Icon | Upload UI with file type indicators |
| **Form Controls** | `_FormControlCheck`, `_FormControlMinus`, `_FormControlPlus`; Checkbox, Radio, Toggle | Check/uncheck/indeterminate states |
| **Input** | `_InputTextBase`, `_InputPasscodeBase`, `_InputSliderDot`, `_InputSliderRange`; `Digits` (4/6), `Size` (sm/md/lg) | Text fields, passcode, sliders |
| **Loader** | — | Loading spinners/skeletons |
| **Misc & Helper** | Divider, `_Dot`, Arrow (27 variants: direction × color), Key/Keyboard | Utility components |
| **Pagination** | `_PaginationBase`, `_PaginationDotBase` | Page navigation |
| **Progress & Indicator** | `_ProgressBarAtom`, `Progression` (0–100%, Size, Label position) | 108 progression variants |
| **Slider** | `Range` (Center/End/Start), `Is Bottom Label`, `Is Label` | Range sliders |
| **Step** | `_StepBaseItem`, `_StepBaseText`; `State` (Completed/Current/Incomplete/Skipped) | Multi-step flows |
| **Table** | — | Data tables |
| **Tab** | `_TabBarItem`; `Orientation` (Horizontal/Vertical), `Size`, `Style` (Bottom Border/Default/Left Border) | 24 orientation variants |
| **Tooltip** | `Arrow` direction × `Color` (Black/Brand/White) | 27 tooltip arrow variants |
| **Navigations** | `_TopNavHeading`, Breadcrumb | Top nav, tab bars |

### 3.2 Platform & Store Components

| Component | Variants |
|-----------|----------|
| **Platform Icons** | 81 variants: Apple/Google/etc., Style (Dark/Original/White) |
| **Store Badges** | App Store & Google Play, Style (Black outline/Brand), Size (lg/md) |

### 3.3 Country Flags

**260 country flags** available as symbols (e.g., `Country=afghanistan`, `Country=brazil`, etc.). Used in locale selectors, phone inputs, and profile settings.

### 3.4 Company Logos

**405 company/insurance logos** (e.g., `Company=Adidas`, `Company=Amazon`, `Company=Anthem`, etc.). Used in insurance provider selection, partner displays.

---

## 4. Mobile App Components (115 unique)

This section contains healthcare-specific, app-level components built from the base component library:

### 4.1 Health & Medical

| Component | Description |
|-----------|-------------|
| `Health Metric Widget` | Individual metric card (heart rate, steps, etc.) |
| `Health Metrics` | Metrics dashboard view |
| `Health Metrics History` | Historical data timeline |
| `Health Score Detail` | Overall health score breakdown |
| `Heart Rate Zone` | Zone indicator for exercise |
| `EHR Medication Timeline` | Electronic health record medication view |
| `EHR Medication Insight Timeline` | Medication insights over time |
| `Medication List` | List of active medications |
| `Medication Reminder` | Reminder card/notification |
| `Medication Search Result` | Search result card |
| `Medication Date Cell` | Calendar cell with medication status |
| `Similar Medication` | Alternative medication suggestion |
| `Symptom Result` | Symptom checker result card |
| `Risk Level` | High / Mild / Low indicator |
| `Body Area` | 13 body regions × selected/unselected (Abs, Back, Bicep, Calf, Chest, Forearm, Glute, Hamstring, Lower Leg, Neck, Shoulder, Trap, Upper Leg) |

### 4.2 Doctor & Appointments

| Component | Description |
|-----------|-------------|
| `Doctor Card` | Doctor profile card |
| `Doctor Review` | Patient review of doctor |
| `Upcoming Consultation` | Scheduled appointment card |
| `Availability Slot` | `Is Available` (true/false), Size (sm/md) |

### 4.3 Wellness & Tracking

| Component | Description |
|-----------|-------------|
| `Mood Level` | 5 levels (1–5 scale) |
| `Mood Date` | Mood entry with date |
| `Nutrition Metadata` | Nutritional information display |
| `Water Type` | Hydration tracking |
| `Progress Metrics` | Goal progress display |

### 4.4 Community & Content

| Component | Description |
|-----------|-------------|
| `Community Post` | Social post card |
| `Community Comment` | Comment on post |
| `Blog` / `Blog Card` / `Blog Minimal` | Article displays (3 density variants) |
| `News & Resources` | News feed item |
| `Short Video` | Video card |
| `Related Article` | Suggested content |
| `Workshop Card` | Workshop/class listing |
| `Course` | Educational content |

### 4.5 Gamification & Engagement

| Component | Description |
|-----------|-------------|
| `Achievement Leaderboard` | Rankings display |
| `Achievement Progress` | Achievement tracking |
| `Premios` | Rewards/prizes |
| `Free Trial Progress` | Trial period tracker |

### 4.6 AI Features

| Component | Description |
|-----------|-------------|
| `AI Assistant Immersive Text` | Full-screen AI chat |
| `AI Companion Text` | Inline AI response |
| `AI Recommendation` | AI-powered suggestion card |
| `Text Input AI Immersive` | AI chat input field |
| `Insight Item` / `Insight List` / `Insight List + Icon` | AI-generated health insights |

### 4.7 Onboarding & Settings

| Component | Description |
|-----------|-------------|
| `App Purpose` | Onboarding purpose selection |
| `Assessment Gender` | Gender selection during assessment |
| `Occupation` | Occupation picker |
| `Pricing Tier` | Subscription plan card |
| `Settings Simple` | Basic settings row |
| `Connect Device` | Wearable/device connection |
| `Scan UI` / `Scan Metadata` | QR/barcode scanning interface |

### 4.8 Data Entry Patterns

| Component | States |
|-----------|--------|
| `Is Empty` widget | `Type=Nutrition`, `Type=Medication`, `Type=Doctor Appointment` (filled + empty) |
| `Star` rating | 0–5 stars, Size (md), Color (Black/Default/White) — 104 variants |
| `Rating Bar` | Star-based rating input |

---

## 5. Shared Component Props Reference

These props appear across many components and should be implemented as a consistent prop API:

| Prop | Values | Description |
|------|--------|-------------|
| `Size` | `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `Default` | Sizing scale |
| `Color` | `Brand`, `Destructive`, `Gray`, `Success`, `Black`, `White` | Color theme |
| `State` | `Default`, `Hovered`, `Pressed`, `Focused`, `Disabled`, `Active` | Interaction state |
| `Hierarchy` | `Primary`, `Secondary`, `No Fill` | Visual emphasis |
| `Is Mobile` | `True` / `False` | Platform-specific styling |
| `Is Selected` | `True` / `False` | Selection state |
| `Is Active` | `True` / `False` | Active/inactive toggle |
| `Is Dark Mode` | `True` / `False` | Theme mode |
| `Orientation` | `Horizontal` / `Vertical` | Layout direction |
| `Style` | `Bottom Border`, `Default`, `Left Border`, `Dark`, `Original`, `White` | Visual style variant |

---

## 6. Icon System

The icon set referenced in the header is sourced from **strangeicons** (strangehelix.bio). Icons are used throughout the component library in these contexts:

| Context | Icon Size | Notes |
|---------|-----------|-------|
| Button icons | 20×20px | Left-aligned with 10px gap to label |
| Badge icons | Varies | Within `Badge Icon` frame (1376×608px) |
| Navigation | 24×24px | Tab bar, breadcrumb separators |
| File type icons | Varies | Within `File Types Icon` frame (906×483px) |
| Tooltip arrows | 24×24px | Directional indicators |
| Avatar verified | Within `_AvatarVerifiedIcon` | Verification badge overlay |
| Avatar company | Within `_AvatarCompanyIcon` | Company logo in avatar |

> **Note:** The Figma MCP tool call limit was reached before I could pull the full icon inventory from node `5367:38988`. To get the complete icon catalog, open that node directly in Figma or re-run with refreshed API limits.

---

## 7. Accessibility Baseline

Based on the token analysis:

| Check | Status | Notes |
|-------|--------|-------|
| `Gray/80` on `Gray/5` (text on bg) | **Pass AAA** (~14.5:1) | Primary text |
| `Gray/60` on `Gray/5` (secondary text) | **Pass AA** (~7.2:1) | Secondary text |
| `Brand/60` on `White` (links) | **Borderline** (~3.1:1) | Passes large text only; flag for review |
| `White` on `Brand/60` (button labels) | **Borderline** (~3.1:1) | Meets 3:1 large-text threshold at 16px SemiBold |
| `Gray/40` on `Gray/5` (placeholders) | **Review needed** | Placeholder text doesn't require contrast compliance but should be readable |

**Recommendation:** Consider introducing a `Brand/70` or `Brand/80` darker variant for text-on-white usage to ensure AA compliance across all sizes.

---

## 8. Implementation Notes

1. **Font loading:** Plus Jakarta Sans weights 600 and 700 are required. Self-host or load from Google Fonts.
2. **Component architecture:** The 40 internal `_` prefixed components (e.g., `_InputTextBase`, `_ProgressBarAtom`) are atomic building blocks. The named components (e.g., `Button`, `Badge`) are composed from these atoms.
3. **Prop consistency:** Use the shared prop API (Section 5) across all components for a predictable developer experience.
4. **Mobile variants:** Many components have `Is Mobile=True/False` — implement as responsive variants or separate component sets depending on your framework.
5. **Dark mode:** `Is Dark Mode` prop exists on select components — plan for theme context propagation.
6. **Country flags (260) and company logos (405)** are significant asset bundles — consider lazy-loading and CDN delivery.
