# Handoff Spec: _DesignSystemHeader

**Figma source:** [Austa App — node 20580:101479](https://www.figma.com/design/OcG9oRNdUEskvAPUcKiKMe/Austa-app?node-id=20580-101479)
**Component instance:** `_DesignSystemHeader`
**Dimensions:** 1552 × 268 px (fluid width, auto height)

---

## Overview

This is the **page header** for the design-system "Icons" section in the Austa app. It contains a page title, a breadcrumb trail with the app logomark, a navigational CTA button ("Foundations"), and an external attribution link. The component is a reusable instance used across design-system documentation pages — the title, breadcrumb labels, CTA label, and link are all configurable.

---

## Layout

The root container uses **Flexbox** (row, `align-items: center`).

```
┌─ Root container (full width, padding 40px, rounded 40px, border) ──────────────┐
│                                                                                 │
│  ┌─ Content (flex-col, gap 80px, flex: 1) ───────────────────────────────────┐  │
│  │                                                                           │  │
│  │  ┌─ Row 1: Title + CTA (flex-row, justify: space-between) ────────────┐  │  │
│  │  │  Title (flex: 1, max-width 960px)     │  CTA Button (shrink: 0)    │  │  │
│  │  └────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                           │  │
│  │  ┌─ Row 2: Breadcrumb + Link (flex-row, gap 16px, align: center) ─────┐  │  │
│  │  │  Logomark (40×40)  Breadcrumb text (flex: 1)  │  External link     │  │  │
│  │  └────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                           │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Root padding | 40px (all sides) |
| Root border-radius | 40px |
| Root border | 1px solid `Gray/20` |
| Root background | `Gray/5` |
| Content direction | column |
| Content gap (title → breadcrumb) | 80px |
| Row 1 alignment | space-between, center |
| Row 2 gap | 16px |
| Title max-width | 960px |

---

## Design Tokens Used

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `Gray/5` | `#F8FAFC` | Root background |
| `Gray/20` | `#E2E8F0` | Root border |
| `Gray/80` | `#1F2937` | Page title text |
| `Gray/60` | `#4B5563` | Breadcrumb text |
| `Gray/40` | `#94A3B8` | *(available, not directly used in default state)* |
| `Brand/60` | `#05AEDB` | CTA button background, external link text |
| `azul aust` | `#00C3F7` | *(brand variant — available for hover/accent use)* |
| `Gray/0 (White)` | `#FFFFFF` | CTA button label text |

### Typography

| Token | Properties | Usage |
|-------|-----------|-------|
| `Heading xl/Bold` | Plus Jakarta Sans, 700, 60px/68px, letter-spacing -1.08px | Page title |
| `Text md/SemiBold` | Plus Jakarta Sans, 600, 16px/22px, letter-spacing -0.11px | CTA button label |
| `Text lg/SemiBold` | Plus Jakarta Sans, 600, 18px/24px, letter-spacing -0.14px | Breadcrumb labels, external link |

### Spacing

| Token/Value | Usage |
|-------------|-------|
| 40px | Root padding |
| 80px | Gap between title row and breadcrumb row |
| 24px | Gap between title and subtitle (if subtitle exists) |
| 16px | Gap between breadcrumb and external link |
| 12px | Gap between logomark and breadcrumb text |
| 8px | Gap between breadcrumb segments; gap between CTA buttons |
| 10px | Internal CTA button gap (icon ↔ label) |

### Radii

| Value | Usage |
|-------|-------|
| 40px | Root container |
| 14px | CTA button |

---

## Components

| Component | Variant/Type | Props / Content | Notes |
|-----------|-------------|-----------------|-------|
| **Root** | `_DesignSystemHeader` | — | Reusable component instance; configurable content |
| **Title** | `<h1>` / heading element | text: "Icon Set (strangeicons)" | Uses `Heading xl/Bold`. Wraps naturally. |
| **CTA Button** | Filled / Primary | icon + label: "Foundations" | `Brand/60` bg, white text, 14px radius, min-height 48px |
| **CTA Icon** | 20×20 icon slot | Icon asset (download vector) | Positioned left of label, 10px gap |
| **Logomark** | 40×40 container | Austa logo SVG | Vertically flipped (`scaleY(-1)`, `rotate(180deg)`) |
| **Breadcrumb** | Text chain | "Foundations → Icons" | Arrow icon (24×24) separates segments |
| **External Link** | `<a>` | href, text: "www.strangehelix.bio" | Underlined, `Brand/60` color, right-aligned |

---

## States and Interactions

| Element | State | Behavior |
|---------|-------|----------|
| **CTA Button** | Default | `Brand/60` (#05AEDB) background, white text |
| **CTA Button** | Hover | Darken background ~10% or shift to `#049CC5` (spec not provided — confirm with design) |
| **CTA Button** | Active/Pressed | Further darken or scale down slightly |
| **CTA Button** | Focus | Visible focus ring (2px offset, `Brand/60` or system default) |
| **External Link** | Default | Underlined, `Brand/60` text |
| **External Link** | Hover | Underline removal or opacity shift (confirm with design) |
| **External Link** | Focus | Visible focus ring |
| **Breadcrumb segments** | Default | Static text, not interactive in this design |
| **Breadcrumb arrow** | — | Decorative separator, not clickable |

> **Note to developer:** Hover/active states are not explicitly specified in the Figma file for this component. Confirm with the design team or implement sensible defaults (darken 10% on hover, darken 15% on press for the button; underline toggle for the link).

---

## Responsive Behavior

| Breakpoint | Changes |
|------------|---------|
| **Desktop (≥1200px)** | Default layout as designed. Title and CTA side by side. |
| **Tablet (768–1199px)** | Title `max-width` can fill available space. CTA button may wrap below title if space is tight. Reduce root padding to ~24px. |
| **Mobile (<768px)** | Stack title and CTA vertically (flex-direction: column on Row 1). Breadcrumb row stacks: logomark + crumbs on one line, external link below. Reduce title font to ~36px/42px. Root padding 20px. Border-radius reduce to 24px. |

> **Note:** Responsive behavior is not explicitly defined in Figma. The above are recommendations — confirm breakpoints with the design team.

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| **Long title text** | Wraps naturally within the `max-width: 960px` constraint. Line-height 68px ensures readable multi-line. |
| **Very short title** | No minimum width — flexes naturally. |
| **No CTA button** | Row 1 should still align correctly (title takes full width). |
| **Multiple CTA buttons** | The CTA container uses `gap: 8px` and flex-wrap — additional buttons flow horizontally. |
| **Internationalization (long strings)** | Breadcrumb text should truncate with ellipsis if it overflows; external link should truncate with `text-overflow: ellipsis`. |
| **Missing logo** | Show a placeholder or hide the 40×40 container. |
| **Missing link** | Hide the external link element; breadcrumb row takes full width. |
| **Loading** | Not applicable — this is a static header. If data-driven, show skeleton blocks matching title (60% width) and breadcrumb (40% width). |

---

## Assets

| Asset | Type | Source | Notes |
|-------|------|--------|-------|
| CTA icon (download/link) | SVG vector | [Asset URL (expires 7 days)](https://www.figma.com/api/mcp/asset/dd418a35-da28-474c-989a-76a07fcb4160) | 20×20, white fill |
| Austa Logomark | SVG/PNG | [Asset URL (expires 7 days)](https://www.figma.com/api/mcp/asset/a0259ead-1377-4ce4-b15a-e518dc76f3cf) | 30×30 actual, rendered in 40×40 box, vertically flipped |
| Breadcrumb arrow | SVG vector | [Asset URL (expires 7 days)](https://www.figma.com/api/mcp/asset/c2d187d4-4f7b-49dc-b37f-dc617e59a1e0) | 24×24, `Gray/60` fill |

> **Important:** These asset URLs expire after 7 days. Export and save to your asset pipeline before then.

---

## Animation / Motion

| Element | Trigger | Animation | Duration | Easing |
|---------|---------|-----------|----------|--------|
| CTA Button | Hover | Background color transition | 150ms | ease-in-out |
| External Link | Hover | Text decoration / opacity transition | 150ms | ease |

> No explicit animations are specified in the design. Above are recommended micro-interactions for polish.

---

## Accessibility Notes

**Focus order:** Title (if interactive/linked) → CTA Button → Breadcrumb links (if interactive) → External Link.

**ARIA & semantics:**
- Root: Use `<header>` or `role="banner"` if this is the page-level header.
- Title: Use `<h1>` with appropriate heading level for the page hierarchy.
- CTA Button: `<button>` or `<a>` depending on navigation behavior. If it navigates, use `<a>` with `role="link"`.
- Breadcrumb: Wrap in `<nav aria-label="Breadcrumb">` with an `<ol>` list. Current page ("Icons") should have `aria-current="page"`.
- External link: Include `target="_blank"` with `rel="noopener noreferrer"` and `aria-label="Visit strangehelix.bio (opens in new tab)"`.
- CTA icon: Mark as `aria-hidden="true"` (decorative, label provides meaning).

**Keyboard:**
- All interactive elements must be keyboard-focusable.
- CTA button activates on Enter/Space.
- External link activates on Enter.

**Color contrast:**
- Title (`Gray/80` #1F2937 on `Gray/5` #F8FAFC): ~14.5:1 ratio — passes AAA.
- CTA label (White on `Brand/60` #05AEDB): ~3.1:1 ratio — **fails AA for normal text**. Consider using a darker brand shade or ensuring the button meets 4.5:1 for text. At 16px semibold, the large-text threshold (3:1) is met.
- Breadcrumb (`Gray/60` #4B5563 on `Gray/5` #F8FAFC): ~7.2:1 — passes AA.
- External link (`Brand/60` #05AEDB on `Gray/5` #F8FAFC): ~3.1:1 — **borderline for AA**. Flag for design review.

---

## Implementation Notes

1. **Font:** Plus Jakarta Sans must be loaded (Google Fonts or self-hosted). Weights needed: 600 (SemiBold), 700 (Bold).
2. **Logomark transform:** The logo uses `scaleY(-1)` and `rotate(180deg)` — this is likely a Figma artifact. Confirm with design whether the exported SVG already accounts for this or if the CSS transform is required.
3. **Component props:** This is a Figma component instance, meaning the title, breadcrumb labels, CTA label/icon, and link are all slot-based. Build accordingly with configurable props.
4. **Border:** 1px solid `Gray/20` on the root container — ensure `box-sizing: border-box` so the border doesn't add to dimensions.
