# Handoff Spec: Austa App — Icon Set (strangeicons)

**Figma source:** [Austa App — Icon Set](https://www.figma.com/design/OcG9oRNdUEskvAPUcKiKMe/Austa-app?node-id=5367-38988&m=dev)
**Icon library:** strangeicons by Strange Helix ([strangehelix.bio](https://www.strangehelix.bio))
**Total icons:** 5,800+ (per Figma description)
**Available as:** Figma plugin

---

## 1. Icon Container Component

The **Icon Container** is the wrapper component used to display any icon in the system. It has **120 variants** defined by three props:

### Props

| Prop | Values | Description |
|------|--------|-------------|
| **Size** | `xs`, `sm`, `md`, `lg`, `xl`, `2xl` | Icon container dimensions |
| **Color** | `Brand`, `Destructive`, `Gray`, `Success`, `Warning` | Semantic color theme |
| **Style** | `Primary`, `Secondary`, `Outlined`, `No Fill` | Fill/stroke treatment |

### Variant Matrix

Each combination produces a distinct visual:

| Style | Appearance |
|-------|------------|
| `Primary` | Solid filled background, white icon |
| `Secondary` | Tinted background (lighter shade), colored icon |
| `Outlined` | Transparent background, 1px border, colored icon |
| `No Fill` | Transparent background, no border, colored icon |

### Layout

```
layout: row
gap: 20px
padding: 20px
sizing: hug content
borderRadius: 5px (inner component set border)
```

The container wraps around the icon SVG and accepts any icon via instance swap.

---

## 2. Icon Set Structure

The Icon Set page contains **2 main sections**:

| Section | Node ID | Contents |
|---------|---------|----------|
| **Icon Container** | `5546:2332` | The Icon Container component set definition |
| **Icon Set (strangeicons)** | `20304:20086` | The full icon catalog organized by category |

### Icon Categories (10+ groups)

| # | Category | Frame ID | Icons Cataloged | Status |
|---|----------|----------|-----------------|--------|
| 1 | Download Plugin | `20580:102363` | CTA section (not icons) | ✅ Captured |
| 2 | **Health & Biology** | `20580:102315` | **111 icons** | ✅ Full catalog below |
| 3 | **General UI** | `20580:102320` | 4 sub-groups (frames) | ⚠️ Structure only |
| 4 | Category 4 | `20580:102349` | — | ❌ Rate limited |
| 5 | Category 5 | `20580:102356` | — | ❌ Rate limited |
| 6 | Category 6 | `20580:102440` | — | ❌ Rate limited |
| 7 | Category 7 | `20580:102445` | — | ❌ Rate limited |
| 8 | Category 8 | `20580:102446` | — | ❌ Rate limited |
| 9 | Category 9 | `20580:103003` | — | ❌ Rate limited |
| 10 | Category 10 | `20580:103097` | — | ❌ Rate limited |

> **Note:** Figma API rate limits prevented fetching categories 4–10. Each icon is a `COMPONENT_SET` with a `Style=line` variant. The full set can be browsed directly in Figma or via the strangeicons Figma plugin.

---

## 3. Health & Biology Icons — Full Catalog (111 icons)

Each icon below is a `COMPONENT_SET` with at least a `Style=line` variant. All icons follow the same grid and stroke conventions from the strangeicons library.

### Medical & Clinical

| Icon Name | Figma ID | Subcategory |
|-----------|----------|-------------|
| `stethoscope` | 20327:27592 | Diagnostics |
| `syringe` | 20327:27584 | Treatment |
| `iv drip` | 20329:489 | Treatment |
| `hospital` | 20329:27843 | Facilities |
| `truck ambulance` | 20328:825 | Emergency |
| `emergency` | 20329:486 | Emergency |
| `surgical device scalpel` | 20329:27856 | Surgery |
| `medical oral device` | 20329:475 | Devices |
| `briefcase health` | 20328:9101 | General |
| `health plus` | 20328:9098 | General |
| `bed` | 20329:27993 | Facilities |
| `crutches` | 20329:27556 | Mobility |
| `person wheelchair` | 20329:28066 | Mobility |
| `person injured` | 20329:27891 | Patients |
| `bandaid` | 20329:27527 | First aid |
| `face mask` | 20328:865 | Protection |
| `hand wash` | 20329:28078 | Hygiene |
| `hand heart` | 20328:9115 | Care |

### Pharmacy & Medication

| Icon Name | Figma ID | Subcategory |
|-----------|----------|-------------|
| `pill rounded` | 20327:27595 | Pills |
| `pill square` | 20327:27617 | Pills |
| `pill circle` | 20329:27565 | Pills |
| `pill square` (alt) | 20329:27572 | Pills |
| `drug pill diamond` | 20329:27627 | Pills |
| `drug pill oval` | 20329:27634 | Pills |
| `drug pill ring` | 20329:27641 | Pills |
| `drug pill pentagon` | 20329:27648 | Pills |
| `drug pill triangle` | 20329:27660 | Pills |
| `drug pill hexagon` | 20329:27667 | Pills |
| `drug container` | 20329:27835 | Containers |
| `drug container alt` | 20329:27827 | Containers |
| `drug store` | 20329:27530 | Retail |
| `pharmacy mortar pestle` | 20329:27883 | Compounding |
| `rx` | 20329:27610 | Prescription |
| `rx square` | 20329:27613 | Prescription |

### Biology & Science

| Icon Name | Figma ID | Subcategory |
|-----------|----------|-------------|
| `dna` | 20327:27696 | Genetics |
| `rna` | 20327:27733 | Genetics |
| `dna crispr` | 20328:468 | Genetics |
| `chromosome xx` | 20329:27579 | Genetics |
| `chromosome xy` | 20329:27597 | Genetics |
| `virus` | 20327:27637 | Pathogens |
| `virus alt` | 20327:27669 | Pathogens |
| `antibody` | 20329:27864 | Immunology |
| `microscope` | 20327:27392 | Lab |
| `microscope simple` | 20327:27395 | Lab |
| `flask triangle` | 20328:9109 | Lab |
| `flask circle` | 20328:9112 | Lab |
| `flask long` | 20329:478 | Lab |
| `caduceus snake` | 20328:833 | Symbols |

### Anatomy & Organs

| Icon Name | Figma ID | Subcategory |
|-----------|----------|-------------|
| `anatomy heart` | 20329:27729 | Cardiovascular |
| `anatomy lung` | 20329:27774 | Respiratory |
| `anatomy liver` | 20329:27674 | Digestive |
| `anatomy stomach` | 20329:27700 | Digestive |
| `anatomy gut` | 20329:28195 | Digestive |
| `anatomy kidney single` | 20329:27703 | Urinary |
| `anatomy kidney double` | 20329:27706 | Urinary |
| `anatomy ribcage` | 20329:27695 | Skeletal |
| `anatomy skull` | 20328:9134 | Skeletal |
| `anatomy ovarium` | 20329:27768 | Reproductive |
| `anatomy skin` | 20329:27813 | Integumentary |
| `anatomy eye` | 20438:59043 | Sensory |
| `brain profile` | 20327:17213 | Nervous |
| `brain top` | 20328:836 | Nervous |
| `human head` | 20329:27822 | General |
| `human head plus` | 20329:27682 | General |
| `tooth` | 20327:27555 | Dental |

### Heart & Vitals

| Icon Name | Figma ID |
|-----------|----------|
| `heart` | 20327:27523 |
| `heart broken` | 20327:27526 |
| `heart pulse` | 20327:27542 |
| `heartbeat pulse` | 20327:27563 |

### Hydration

| Icon Name | Figma ID |
|-----------|----------|
| `water drop` | 20327:27408 |
| `water drop plus` | 20327:27506 |
| `water drop alt` | 20327:27514 |
| `water glass` | 20329:28181 |
| `water bottle md` | 20329:28189 |
| `water bottle lg` | 20329:28192 |
| `sanitizer` | 20327:27398 |

### Activities & Fitness

| Icon Name | Figma ID |
|-----------|----------|
| `activity yoga` | 20329:498 |
| `activity soccer` | 20329:501 |
| `activity walking` | 20329:504 |
| `activity hiking` | 20329:507 |
| `activity running jogging` | 20329:510 |
| `activity biking cycling` | 20329:538 |
| `activity skating` | 20329:541 |
| `activity karate` | 20329:544 |
| `activity acrobatics` | 20329:547 |
| `activity rowing` | 20329:550 |
| `activity dodgeball` | 20329:556 |
| `activity swimming` | 20329:559 |
| `activity ice skating` | 20329:28051 |
| `activity basketball` | 20329:28122 |
| `activity tennis` | 20329:28165 |
| `activity roller skating` | 20329:28168 |
| `activity meditation` | 20438:58994 |
| `barbell diagonal` | 20329:492 |
| `barbell horizontal` | 20329:495 |
| `steps sneaker` | 20438:59067 |
| `foot step single` | 20329:27916 |
| `foot step double` | 20329:28069 |

### People & Demographics

| Icon Name | Figma ID |
|-----------|----------|
| `person female` | 20329:8955 |
| `person male` | 20329:27483 |
| `person elderly` | 20329:8952 |
| `person pregnant woman` | 20329:568 |
| `person accessibility` | 20329:553 |
| `person sleep` | 20329:28104 |
| `baby face` | 20329:27494 |
| `baby stroller` | 20329:27996 |
| `pediatrics baby bottle` | 20329:27906 |
| `gender female` | 20329:28002 |
| `gender male` | 20329:28015 |
| `gender trans` | 20329:28031 |

### Emotions & Mood

| Icon Name | Figma ID |
|-----------|----------|
| `emotion overjoyed` | 20329:27919 |
| `emotion happy` | 20329:27939 |
| `emotion neutral` | 20329:27947 |
| `emotion nervous` | 20329:27956 |
| `emotion sad` | 20329:27965 |
| `emotion depressed` | 20329:27975 |

### Senses

| Icon Name | Figma ID |
|-----------|----------|
| `sense nose smell` | 20329:28107 |
| `sense tounge taste` | 20329:28136 |
| `sense ear hear` | 20329:28145 |

### Wellness & Lifestyle

| Icon Name | Figma ID |
|-----------|----------|
| `smoking` | 20329:27503 |
| `smoking disabled` | 20329:27509 |
| `shower` | 20329:27512 |
| `weight scale` | 20329:27515 |
| `toothbrush` | 20329:27524 |
| `sleep zzz` | 20329:27562 |
| `fertile menstruation` | 20438:59016 |
| `head sneeze` | 20329:28088 |

---

## 4. General UI Icons (Structure)

The "General UI" category (node `20580:102320`) contains **4 sub-groups** of general-purpose interface icons. The exact icon names weren't captured due to API limits, but these typically include:

- Navigation icons (arrows, chevrons, home, menu)
- Action icons (edit, delete, share, download, upload)
- Communication icons (mail, chat, phone, notification)
- Media icons (play, pause, camera, image, video)

> **Developer action:** Open node `20580:102320` in Figma to browse the full General UI icon set.

---

## 5. Icon Usage Specifications

### Sizing Reference

| Size Token | Recommended px | Typical Usage |
|------------|---------------|---------------|
| `xs` | 16×16 | Inline text icons, badges |
| `sm` | 20×20 | Button icons, form indicators |
| `md` | 24×24 | Navigation, list icons |
| `lg` | 32×32 | Feature highlights, cards |
| `xl` | 40×40 | Section headers, empty states |
| `2xl` | 48×48 | Hero sections, onboarding |

### Color Application

| Color | Hex (from tokens) | Usage |
|-------|-------------------|-------|
| `Brand` | `#05AEDB` | Primary actions, active states, links |
| `Gray` | `#4B5563` | Default/neutral icons |
| `Success` | *(confirm in Figma)* | Positive indicators, completed states |
| `Destructive` | *(confirm in Figma)* | Errors, delete actions, warnings |
| `Warning` | *(confirm in Figma)* | Caution states, attention needed |

### Style Application

| Style | Background | Border | Icon Color | Use Case |
|-------|-----------|--------|------------|----------|
| `Primary` | Solid semantic color | None | White | CTAs, primary actions |
| `Secondary` | Tinted (10-15% opacity) | None | Semantic color | Secondary actions, tags |
| `Outlined` | Transparent | 1px semantic color | Semantic color | Tertiary actions, selectable items |
| `No Fill` | Transparent | None | Semantic color | Inline icons, minimal UI |

---

## 6. Implementation Notes

1. **Icon source:** strangeicons Figma plugin — download from Figma Community or [strangehelix.bio](https://www.strangehelix.bio). The plugin provides 5,800+ icons.

2. **SVG export:** All icons should be exported as SVG from Figma. Each icon is a `COMPONENT_SET` with at least a `Style=line` variant. Export at 24×24 native size and scale via CSS/props.

3. **Icon Container component:** Build a reusable wrapper that accepts `size`, `color`, and `style` props. The container handles the background fill, border, border-radius, and padding — the icon SVG sits inside.

4. **Naming convention:** Icons use kebab-case names (e.g., `heart-pulse`, `activity-running-jogging`). Group by category folder in your asset pipeline:
   ```
   icons/
   ├── health/          (heart, stethoscope, syringe, etc.)
   ├── pharmacy/        (pill-*, drug-*, rx, etc.)
   ├── biology/         (dna, virus, antibody, etc.)
   ├── anatomy/         (anatomy-*, brain-*, human-head, etc.)
   ├── activity/        (activity-*, barbell-*, steps-*, etc.)
   ├── people/          (person-*, baby-*, gender-*, etc.)
   ├── emotion/         (emotion-*)
   ├── senses/          (sense-*)
   ├── hydration/       (water-*, sanitizer)
   ├── wellness/        (smoking-*, sleep-*, weight-*, etc.)
   └── ui/              (General UI icons)
   ```

5. **Remaining categories:** 8 additional icon category frames exist in Figma (node IDs `20580:102349` through `20580:103097`) that couldn't be fetched due to API rate limits. These likely cover additional domains like navigation, communication, finance, technology, and more. Browse directly in Figma to catalog them.
