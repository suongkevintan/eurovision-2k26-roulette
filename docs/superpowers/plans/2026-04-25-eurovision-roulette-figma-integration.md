# Eurovision Roulette — Figma Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the visual layer of the Eurovision Roulette SPA to match the Figma mockup (`fileKey 3wN1dlbNC0ftKGOFWFOoA2`, frame `01. Start`), with WCAG 2.2 AA compliance, while preserving the existing business logic in `src/lib/`.

**Architecture:** Replace the single big `eurovision-roulette.tsx` + flat `globals.css` with a tree of small, focused components using CSS Modules + BEM naming. Design tokens live in CSS variables (`tokens.css`). 24-col grid (8px gutters), 4px spacing base, 1.26 Major Third type scale on 20px reference. REM for macro layout, PX for micro details. Add a 5th `snacks` dinner slot. Implement a 5s spinning roulette animation with a `scrollTo` that keeps amorces of the surrounding sections visible.

**Tech Stack:** Next.js 15, React 19, TypeScript 5.7, CSS Modules, Inter + IBM Plex Mono via `next/font/google`, Supabase JS (unchanged), `lipis/flag-icons` SVGs (35 of them, copied to `public/flags/4x3/`).

**Reference spec:** [`docs/superpowers/specs/2026-04-25-eurovision-roulette-figma-integration-design.md`](../specs/2026-04-25-eurovision-roulette-figma-integration-design.md)

---

## File Structure

### Files created

| Path | Responsibility |
|---|---|
| `src/app/tokens.css` | All design tokens (colors, typo, spacing, grid, radii, motion) |
| `src/components/cta-button/cta-button.tsx` | Reusable CTA bevel button (variants: primary, panel, icon-only, secondary) |
| `src/components/cta-button/cta-button.module.css` | Bevel double-border styling, focus ring |
| `src/components/eurovision-logo/eurovision-logo.tsx` | Inline SVG of the Eurovision heart logo |
| `src/components/eurovision-logo/eurovision-logo.module.css` | Sizing variants |
| `src/components/header/header.tsx` | Top header (logo + participant pill + settings button) |
| `src/components/header/header.module.css` | Header layout |
| `src/components/section-hero/section-hero.tsx` | Hero section (H1 + body + primary CTA + gradient bg) |
| `src/components/section-hero/section-hero.module.css` | Hero layout, gradient, noise filter |
| `src/components/panel-inscription/panel-inscription.tsx` | Left panel of Logs-top (name input + code reveal + CTA) |
| `src/components/panel-inscription/panel-inscription.module.css` | Panel styling |
| `src/components/panel-retrieve/panel-retrieve.tsx` | Right panel of Logs-top (code input + CTA) |
| `src/components/panel-retrieve/panel-retrieve.module.css` | Panel styling |
| `src/components/section-logs-top/section-logs-top.tsx` | Layout wrapping the two top panels |
| `src/components/section-logs-top/section-logs-top.module.css` | Two-column flex |
| `src/components/flag/flag.tsx` | `<Flag code="FR" />` → `<img src="/flags/4x3/fr.svg" />` |
| `src/components/flag/flag.module.css` | Sizing + clip |
| `src/components/country-item/country-item.tsx` | Single country card (default/selected/spinning/used states) |
| `src/components/country-item/country-item.module.css` | BEM styling |
| `src/components/food-moment-item/food-moment-item.tsx` | Single food moment pill (default/selected/spinning) |
| `src/components/food-moment-item/food-moment-item.module.css` | Pill styling |
| `src/components/section-leaderboard/section-leaderboard.tsx` | Container for grid + moments sidebar |
| `src/components/section-leaderboard/section-leaderboard.module.css` | Layout |
| `src/components/recipe-item/recipe-item.tsx` | Single recipe card (index, title, description, CTA) |
| `src/components/recipe-item/recipe-item.module.css` | Card styling |
| `src/components/recipe-level/recipe-level.tsx` | Level subheader (stars + level + count) |
| `src/components/recipe-level/recipe-level.module.css` | Subheader styling |
| `src/components/panel-result/panel-result.tsx` | Left panel of Logs-bottom (logo + chef command + flag + youtube + CTAs) |
| `src/components/panel-result/panel-result.module.css` | Panel styling |
| `src/components/panel-recipes/panel-recipes.tsx` | Right panel of Logs-bottom (header + 3 levels) |
| `src/components/panel-recipes/panel-recipes.module.css` | Panel styling |
| `src/components/section-logs-bottom/section-logs-bottom.tsx` | Layout wrapping the two bottom panels |
| `src/components/section-logs-bottom/section-logs-bottom.module.css` | Two-column flex |
| `src/components/admin-drawer/admin-drawer.tsx` | Slide-over drawer with admin actions (PIN gated) |
| `src/components/admin-drawer/admin-drawer.module.css` | Drawer styling |
| `src/components/sr-only/sr-only.tsx` | Screen-reader-only wrapper for live announcements |
| `src/components/sr-only/sr-only.module.css` | `clip: rect(...)` style |
| `src/lib/flags.ts` | Maps ISO 3166-1 alpha-2 codes to flag SVG paths |
| `src/lib/youtube.ts` | Helper to build YouTube embed URLs |
| `src/lib/spinning.ts` | Roulette tick logic (timing, randomization, ease-out) |
| `public/flags/4x3/*.svg` | 35 country flag SVGs (one file per ISO code) |
| `public/assets/eurovision-logo.svg` | Multicolor heart logo |

### Files modified

| Path | Why |
|---|---|
| `src/app/layout.tsx` | Add `next/font` for Inter + IBM Plex Mono, set `lang`, set theme class |
| `src/app/globals.css` | Trim to reset only; import `./tokens.css`; add `prefers-reduced-motion` defaults |
| `src/app/page.tsx` | Render new top-level component |
| `src/components/eurovision-roulette/eurovision-roulette.tsx` | New version (replaces old single file) — orchestrator only |
| `src/components/eurovision-roulette/eurovision-roulette.module.css` | New module styles |
| `src/lib/types.ts` | Add `snacks` to `DinnerSlot` type, add `youtubeId?: string` to `Country` |
| `src/lib/data.ts` | Add `snacks` slot to every country `dishSet`, optional youtubeId |
| `src/lib/roulette.ts` | Update `expectedDistribution` weights to include `snacks` |
| `src/components/eurovision-roulette.tsx` | **Deleted at the end** (old big component, replaced by the new tree) |
| `package.json` | Add `eslint-plugin-jsx-a11y` if not already pulled by `eslint-config-next` |
| `next.config.ts` | (No changes expected — but check) |

---

## Conventions used in this plan

- **REM macro / PX micro**: layout dimensions in `rem` (1rem = 16px), bordures fines / ombres / focus rings en `px`
- **BEM**: `block__element` and `block--modifier` (using CSS Modules, classes are scoped automatically)
- **Commits**: small, focused, conventional. After every "verification step" passes.
- **Verification per task**: `npm run build && npm run typecheck && npm run lint` must pass; manual smoke test in browser when applicable.

---

## Task 1: Setup design tokens, fonts, and globals reset

**Files:**
- Create: `src/app/tokens.css`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1.1: Create `src/app/tokens.css` with all design tokens**

```css
:root {
  /* === Surfaces === */
  --color-bg-primary: #050b30;
  --color-bg-elevated: #0a1240;
  --color-bg-on-light: #fefefe;
  --color-bg-input-light: #fefefe;
  --color-bg-input-disabled: #eaeaea;
  --color-bg-code-reveal: #011753;

  /* === Eurovision palette === */
  --color-eurovision-blue: #0a23be;
  --color-eurovision-cyan: #00c7f1;
  --color-eurovision-pink: #e0237a;

  /* === Text === */
  --color-text-on-dark: #fefefe;
  --color-text-on-light: #181818;
  --color-text-muted: #626262;

  /* === Borders === */
  --color-border-input: #8b8b8b;
  --color-border-cta: #ebebeb;
  --color-border-panel: rgba(255, 255, 255, 0.5);

  /* === Focus rings (WCAG 2.4.7 + 2.4.13) === */
  --color-focus-ring-on-light: var(--color-eurovision-blue);
  --color-focus-ring-on-dark: var(--color-eurovision-cyan);
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;

  /* === Effects === */
  --shadow-cta-soft: 0 0 8px rgba(0, 0, 0, 0.1);
  --shadow-cta-mini: 0 0 5px rgba(0, 0, 0, 0.1);
  --gradient-hero-bg: radial-gradient(
    ellipse at 100% 100%,
    rgba(224, 35, 122, 0.45) 0%,
    rgba(10, 35, 190, 0.35) 35%,
    transparent 70%
  );

  /* === Typography === */
  --font-family-sans: var(--font-inter), system-ui, sans-serif;
  --font-family-mono: var(--font-ibm-plex-mono), ui-monospace, monospace;

  --font-size-xs: 0.8125rem;
  --font-size-sm: 1rem;
  --font-size-md: 1.125rem;
  --font-size-base: 1.25rem;
  --font-size-lg: 1.5625rem;
  --font-size-xl: 2rem;
  --font-size-2xl: 2.5rem;
  --font-size-3xl: 3.1875rem;
  --font-size-4xl: 4rem;
  --font-size-5xl: 5rem;

  --line-height-tight: 1.15;
  --line-height-snug: 1.2;
  --line-height-normal: 1.5;
  --line-height-cta: 1.4;

  --letter-spacing-h1: -0.03em;
  --letter-spacing-body: -0.02em;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;

  /* === Spacing (4px base) === */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-18: 4.5rem;
  --space-20: 5rem;

  /* === Grid === */
  --grid-columns: 24;
  --grid-gutter: 0.5rem;
  --grid-margin: 5rem;
  --grid-content-max: 110rem;

  /* === Radii === */
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.25rem;
  --radius-pill: 3rem;
  --radius-full: 99rem;

  /* === Z-index === */
  --z-header: 10;
  --z-overlay: 50;
  --z-drawer: 60;

  /* === Motion === */
  --duration-spin-tile: 60ms;
  --duration-spin-total: 5000ms;
  --duration-scroll-to-result: 800ms;
  --duration-press: 120ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- [ ] **Step 1.2: Update `src/app/layout.tsx` to load Inter + IBM Plex Mono via `next/font`**

```tsx
import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "700"]
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"]
});

export const metadata: Metadata = {
  title: "Eurovision Roulette",
  description: "Tirage culinaire Eurovision 2026 pour un dîner synchronisé."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 1.3: Replace `src/app/globals.css` with reset + tokens import**

```css
@import "./tokens.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-on-dark);
  font-family: var(--font-family-sans);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  -webkit-font-smoothing: antialiased;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

button {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

a {
  color: inherit;
  text-decoration: none;
}

img,
svg {
  display: block;
  max-width: 100%;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 1.4: Verify build passes**

Run: `npm run build`
Expected: Successful build with no errors. The page will render in dark navy with Inter loaded but no content yet (the old `EurovisionRoulette` component is still rendered by `page.tsx` and uses removed CSS classes — that's expected, we'll fix in Task 16).

> ⚠️ The page will look broken visually after this task because we removed the old globals. That's intentional — the new visual layer comes in subsequent tasks. The app is *still functional* (logic in `src/lib/` is untouched).

- [ ] **Step 1.5: Commit**

```bash
git add src/app/tokens.css src/app/layout.tsx src/app/globals.css
git commit -m "Add design tokens, fonts via next/font, reset globals

Establishes the foundation for the Figma integration: all design tokens
in tokens.css (colors, typo with 1.26 scale on 20px, spacing 4px base,
24-col grid, focus rings for WCAG 2.4.7+2.4.13). Inter + IBM Plex Mono
loaded via next/font for self-hosting. globals.css trimmed to reset +
prefers-reduced-motion default."
```

---

## Task 2: Add `snacks` dinner slot

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/data.ts`
- Modify: `src/lib/roulette.ts`

The Figma mockup sidebar shows 5 food moments: Apéro, Entrée, Plat principal, Dessert, **Snacks**. We add `snacks` as a 5th `DinnerSlot` with weight 1 (preserves total of 9 in `expectedDistribution`).

- [ ] **Step 2.1: Extend `DinnerSlot` type in `src/lib/types.ts`**

Replace the existing line:
```ts
export type DinnerSlot = "apero" | "entree" | "plat" | "dessert";
```
with:
```ts
export type DinnerSlot = "apero" | "entree" | "plat" | "dessert" | "snacks";
```

Also add an optional `youtubeId` field to `Country`:
```ts
export type Country = {
  code: string;
  name: string;
  flag: string;
  artist: string;
  song: string;
  color: string;
  dishes: Record<DinnerSlot, Dish[]>;
  youtubeId?: string;
};
```

- [ ] **Step 2.2: Add `snacks` entry in `dinnerSlots` map in `src/lib/data.ts`**

Locate the existing `export const dinnerSlots` (lines 3-8) and replace with:

```ts
export const dinnerSlots: Record<DinnerSlot, { label: string; short: string; tone: string }> = {
  apero: { label: "Apéro", short: "AP", tone: "#00b4d8" },
  entree: { label: "Entrée", short: "EN", tone: "#8ac926" }, // renamed from "Petite entrée" to align with Figma
  plat: { label: "Plat principal", short: "PL", tone: "#ff4d6d" },
  dessert: { label: "Dessert", short: "DE", tone: "#ffbe0b" },
  snacks: { label: "Snacks", short: "SN", tone: "#9d4edd" }
};
```

- [ ] **Step 2.3: Extend `dishSet` to include `snacks`**

In `src/lib/data.ts`, find the `dishSet` function (around line 217). Update its return value to include `snacks`. The simplest pragmatic mapping reuses the apero recipes for snacks (small, finger-food friendly) :

```ts
const dishSet = (
  apEasy: string,
  apMedium: string,
  apHard: string,
  stEasy: string,
  stMedium: string,
  stHard: string,
  mainEasy: string,
  mainMedium: string,
  mainHard: string,
  deEasy: string,
  deMedium: string,
  deHard: string
) => ({
  apero: proposals(
    [apEasy, apMedium, apHard],
    [stEasy, stMedium, stHard],
    [mainEasy, mainMedium, deEasy],
    "apero"
  ),
  entree: proposals(
    [stEasy, stMedium, apEasy],
    [stHard, apMedium, apHard],
    [mainEasy, mainMedium, mainHard],
    "entree"
  ),
  plat: proposals(
    [mainEasy, mainMedium, stMedium],
    [mainHard, stHard, apHard],
    [deEasy, deMedium, deHard],
    "plat"
  ),
  dessert: proposals(
    [deEasy, deMedium, deHard],
    [apEasy, apMedium, stEasy],
    [apHard, stMedium, stHard],
    "dessert"
  ),
  snacks: proposals(
    [apEasy, stEasy, deEasy],
    [apMedium, stMedium, deMedium],
    [apHard, stHard, deHard],
    "apero"
  )
});
```

- [ ] **Step 2.4: Add `snacks` story/shopping in the `proposals` function**

In `src/lib/data.ts`, locate the `proposals` function (around line 164). Add `snacks` to both `baseStories` and `shoppingBySlot`:

```ts
const baseStories: Record<DinnerSlot, string[]> = {
  apero: [
    "Format partageable, parfait pour lancer le dîner sans monopoliser la cuisine.",
    "Un classique de table familiale qui raconte bien le pays sans devenir intimidant.",
    "Version plus travaillée, idéale si la personne aime arriver avec un petit effet scène."
  ],
  entree: [
    "Entrée fraîche ou simple, souvent servie avant les plats plus généreux.",
    "Recette de bistrot ou de maison, avec un vrai marqueur local.",
    "Préparation plus longue, mais très Eurovision: mémorable dès la première bouchée."
  ],
  plat: [
    "Plat national ou régional qui tient bien au transport et nourrit vraiment.",
    "Un plat de repas du dimanche: plus généreux, plus lent, plus réconfortant.",
    "Le grand numéro culinaire du pays, à réserver aux mains motivées."
  ],
  dessert: [
    "Douceur populaire, facile à découper ou partager le soir du concours.",
    "Dessert de fête ou de café, avec une vraie identité locale.",
    "Pâtisserie iconique: le genre de dessert qui mérite ses douze points."
  ],
  snacks: [
    "Bouchée à grignoter, parfaite pour patienter pendant les performances.",
    "Petit format relevé, à attraper d'une main pendant que l'autre tient le verre.",
    "Snack signature du pays, à servir en milieu de soirée pour relancer."
  ]
};
const shoppingBySlot: Record<DinnerSlot, string[][]> = {
  apero: [
    ["pain", "herbes", "fromage ou legumes"],
    ["farine", "oeufs", "produit laitier"],
    ["pâte maison", "épices", "garniture"]
  ],
  entree: [
    ["legumes", "huile", "vinaigre"],
    ["bouillon", "herbes", "pain"],
    ["pâte", "farce", "sauce"]
  ],
  plat: [
    ["proteine", "legumes", "feculent"],
    ["viande ou alternative", "oignons", "epices"],
    ["ingredient signature", "sauce", "accompagnement"]
  ],
  dessert: [
    ["sucre", "farine", "beurre"],
    ["creme", "fruits ou noix", "pâte"],
    ["pâte fine", "garniture", "sirop ou glaçage"]
  ],
  snacks: [
    ["pain ou base", "garniture salée", "herbes"],
    ["pâte feuilletée", "fromage", "épices"],
    ["base maison", "garniture signature", "sauce"]
  ]
};
```

- [ ] **Step 2.5: Update `expectedDistribution` weights in `src/lib/roulette.ts`**

Replace the existing `weights` line (around line 20) to include `snacks`:

```ts
const weights: Record<DinnerSlot, number> = { apero: 2, entree: 2, plat: 3, dessert: 1, snacks: 1 };
```

Also update the priority order:
```ts
const priority: DinnerSlot[] = ["entree", "apero", "plat", "dessert", "snacks"];
```

And update the `slotOrder` constant at the top of the file:
```ts
const slotOrder: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];
```

The total weight is now 2+2+3+1+1 = 9, same as before, so the existing math works. With 9 guests we get : 2 apero, 2 entree, 3 plat, 1 dessert, 1 snacks.

- [ ] **Step 2.6: Update `countBySlot` initialization in `src/lib/roulette.ts`**

In the `countBySlot` function (around line 64), update the reduce initial value:

```ts
export function countBySlot(guests: Guest[]) {
  return guests.reduce(
    (acc, guest) => {
      acc[guest.dinnerSlot] += 1;
      return acc;
    },
    { apero: 0, entree: 0, plat: 0, dessert: 0, snacks: 0 } as Record<DinnerSlot, number>
  );
}
```

Also update `expectedDistribution`'s base initial value (around line 19):
```ts
const base = { apero: 0, entree: 0, plat: 0, dessert: 0, snacks: 0 };
```

- [ ] **Step 2.7: Verify typecheck and build pass**

Run: `npm run typecheck`
Expected: No type errors.

Run: `npm run build`
Expected: Successful build.

If `eurovision-roulette.tsx` (the old component) has type errors because it iterates `Object.keys(dinnerSlots)` and expects 4 entries, that's expected and will be fixed when we replace the component in Task 16.

If errors block the build, add a temporary `// @ts-expect-error` next to the old iteration or skip strict checking on that file. Document why and remove in Task 23.

- [ ] **Step 2.8: Commit**

```bash
git add src/lib/types.ts src/lib/data.ts src/lib/roulette.ts
git commit -m "Add snacks as a 5th dinner slot

Mirrors the Figma sidebar which shows 5 food moments. Weights remain
balanced: { apero: 2, entree: 2, plat: 3, dessert: 1, snacks: 1 } total 9.
Snacks dish proposals reuse country apero/entree/dessert easies as a
sensible default; can be curated later if needed.

Adds optional youtubeId on Country for future YouTube embed in the
result panel."
```

---

## Task 3: Build the `<CtaButton>` component

**Files:**
- Create: `src/components/cta-button/cta-button.tsx`
- Create: `src/components/cta-button/cta-button.module.css`

The signature CTA has a "bevel" double-border (outer light gray + inner white with shadow). Three variants: `primary` (hero, large), `panel` (panel CTAs, white with thicker bevel), `icon-only` (header settings, 48×48), `secondary` (recipe items, smaller).

- [ ] **Step 3.1: Create `src/components/cta-button/cta-button.tsx`**

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./cta-button.module.css";

type Variant = "primary" | "panel" | "icon-only" | "secondary";
type Surface = "light" | "dark";

type CtaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  surface?: Surface;
  icon?: ReactNode;
  children?: ReactNode;
};

export function CtaButton({
  variant = "primary",
  surface = "light",
  icon,
  children,
  className,
  ...rest
}: CtaButtonProps) {
  const classNames = [
    styles["cta-button"],
    styles[`cta-button--${variant}`],
    styles[`cta-button--surface-${surface}`],
    className
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={classNames} {...rest}>
      <span className={styles["cta-button__bevel"]} aria-hidden="true" />
      <span className={styles["cta-button__inner"]}>
        {icon ? <span className={styles["cta-button__icon"]} aria-hidden="true">{icon}</span> : null}
        {children ? <span className={styles["cta-button__label"]}>{children}</span> : null}
      </span>
    </button>
  );
}
```

- [ ] **Step 3.2: Create `src/components/cta-button/cta-button.module.css`**

```css
.cta-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  isolation: isolate;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-on-light);
  cursor: pointer;
  transition: transform var(--duration-press) var(--easing-standard);
}

.cta-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cta-button:not(:disabled):active {
  transform: scale(0.98);
}

.cta-button__bevel {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: var(--color-border-cta);
  z-index: 0;
}

.cta-button__inner {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  background-color: var(--color-bg-on-light);
  box-shadow: var(--shadow-cta-soft);
  z-index: 1;
}

.cta-button__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cta-button__icon > svg {
  width: 1.5rem;
  height: 1.5rem;
}

/* === variant: primary (hero) === */
.cta-button--primary {
  border-radius: var(--radius-xl);
  height: 4.5rem; /* 72px */
  padding: 0;
}

.cta-button--primary .cta-button__bevel {
  background-color: #ebebeb;
}

.cta-button--primary .cta-button__inner {
  inset: 4px;
  position: absolute;
  border-radius: var(--radius-lg);
  padding: 0 var(--space-4);
  font-size: var(--font-size-base);
  line-height: var(--line-height-cta);
}

/* === variant: panel === */
.cta-button--panel {
  border-radius: var(--radius-lg);
  padding: 0;
}

.cta-button--panel .cta-button__bevel {
  inset: 0;
  border: 4px solid var(--color-border-cta);
  border-radius: var(--radius-lg);
  background: var(--color-bg-on-light);
  box-sizing: border-box;
}

.cta-button--panel .cta-button__inner {
  position: relative;
  border-radius: calc(var(--radius-lg) - 4px);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-cta);
}

/* === variant: icon-only (header settings) === */
.cta-button--icon-only {
  border-radius: 13.333px;
  width: 3rem; /* 48px */
  height: 3rem;
  padding: 0;
}

.cta-button--icon-only .cta-button__bevel {
  background-color: #d9d9d9;
}

.cta-button--icon-only .cta-button__inner {
  position: absolute;
  inset: 4px;
  border-radius: 10px;
  background-color: var(--color-bg-on-light);
  box-shadow: var(--shadow-cta-mini);
}

.cta-button--icon-only .cta-button__icon > svg {
  width: 1rem;
  height: 1rem;
}

/* === variant: secondary (recipe item) === */
.cta-button--secondary {
  border-radius: var(--radius-md);
  padding: 0;
}

.cta-button--secondary .cta-button__bevel {
  inset: 0;
  border: 2px solid var(--color-border-cta);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-on-light);
}

.cta-button--secondary .cta-button__inner {
  position: relative;
  padding: var(--space-2) var(--space-4);
  font-size: var(--font-size-sm);
  border-radius: calc(var(--radius-md) - 2px);
}

/* === Focus ring (WCAG 2.4.7 + 2.4.13) === */
.cta-button:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.cta-button--surface-dark:focus-visible {
  outline-color: var(--color-focus-ring-on-dark);
}
```

- [ ] **Step 3.3: Verify build**

Run: `npm run build`
Expected: Build passes. The button is not used yet — that comes in Task 5.

- [ ] **Step 3.4: Commit**

```bash
git add src/components/cta-button/
git commit -m "Add CtaButton component with bevel double-border styling

4 variants (primary/panel/icon-only/secondary) sharing the same
bevel structure: outer .cta-button__bevel layer + inner
.cta-button__inner with shadow. Focus ring uses eurovision-blue
on light surfaces and eurovision-cyan on dark, both ≥3:1 (WCAG
2.4.7 + 2.4.13)."
```

---

## Task 4: Build the `<EurovisionLogo>` component

**Files:**
- Create: `src/components/eurovision-logo/eurovision-logo.tsx`
- Create: `src/components/eurovision-logo/eurovision-logo.module.css`
- Create: `public/assets/eurovision-logo.svg`

Quick decision: rather than try to recreate the multicolor heart logo from scratch, we render a simplified version with an inline SVG fallback. The user can export the actual SVG from Figma later and replace the file at `public/assets/eurovision-logo.svg` — the component already references that path.

- [ ] **Step 4.1: Create `public/assets/eurovision-logo.svg` with a placeholder**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 56" fill="none">
  <defs>
    <linearGradient id="eurovision-heart" x1="0" y1="0" x2="56" y2="56" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#e0237a" />
      <stop offset="0.5" stop-color="#ff6f00" />
      <stop offset="1" stop-color="#0a23be" />
    </linearGradient>
  </defs>
  <path
    d="M28 50 C8 36, 4 22, 12 14 C18 8, 26 10, 28 18 C30 10, 38 8, 44 14 C52 22, 48 36, 28 50 Z"
    fill="url(#eurovision-heart)"
  />
</svg>
```

- [ ] **Step 4.2: Create `src/components/eurovision-logo/eurovision-logo.tsx`**

```tsx
import styles from "./eurovision-logo.module.css";

type EurovisionLogoProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap = {
  sm: 40,
  md: 56,
  lg: 80
} as const;

export function EurovisionLogo({ size = "md", className }: EurovisionLogoProps) {
  const px = sizeMap[size];
  const classNames = [styles["eurovision-logo"], className].filter(Boolean).join(" ");
  return (
    <span className={classNames} aria-label="Eurovision Roulette">
      <img
        src="/assets/eurovision-logo.svg"
        alt=""
        width={px}
        height={px}
        className={styles["eurovision-logo__img"]}
      />
    </span>
  );
}
```

- [ ] **Step 4.3: Create `src/components/eurovision-logo/eurovision-logo.module.css`**

```css
.eurovision-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.eurovision-logo__img {
  display: block;
  width: 100%;
  height: 100%;
}
```

- [ ] **Step 4.4: Verify build**

Run: `npm run build`
Expected: Build passes. Logo not yet rendered.

- [ ] **Step 4.5: Commit**

```bash
git add src/components/eurovision-logo/ public/assets/eurovision-logo.svg
git commit -m "Add EurovisionLogo component with placeholder SVG

Stylized heart shape with gradient (pink → orange → blue). Three
sizes (sm 40px, md 56px, lg 80px). The SVG file at
public/assets/eurovision-logo.svg is a placeholder — replace with the
actual Figma export when available."
```

---

## Task 5: Build the `<Header>` component

**Files:**
- Create: `src/components/header/header.tsx`
- Create: `src/components/header/header.module.css`

The header contains: Eurovision logo (left), participants pill in cyan (center), settings icon button (right).

- [ ] **Step 5.1: Create `src/components/header/header.tsx`**

```tsx
import { Settings, Users } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import styles from "./header.module.css";

type HeaderProps = {
  participantCount: number;
  onOpenAdmin?: () => void;
};

export function Header({ participantCount, onOpenAdmin }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <EurovisionLogo size="md" />
      </div>
      <div
        className={styles.header__incentive}
        role="status"
        aria-label={`${participantCount} participants en lice`}
      >
        <Users size={24} aria-hidden="true" />
        <p className={styles["header__incentive-text"]}>
          <span className={styles["header__incentive-count"]}>{participantCount}</span>
          {` participant·es en lice`}
        </p>
      </div>
      <CtaButton
        variant="icon-only"
        surface="dark"
        aria-label="Ouvrir le panneau admin"
        onClick={onOpenAdmin}
        icon={<Settings />}
      />
    </header>
  );
}
```

- [ ] **Step 5.2: Create `src/components/header/header.module.css`**

```css
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-10);
  padding-inline: var(--grid-margin);
  gap: var(--space-4);
  width: 100%;
  max-width: 100vw;
}

.header__logo {
  flex-shrink: 0;
}

.header__incentive {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background-color: rgba(0, 199, 241, 0.15);
  border: 1px solid var(--color-eurovision-cyan);
  border-radius: var(--radius-full);
  color: var(--color-eurovision-cyan);
}

.header__incentive-text {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  line-height: var(--line-height-cta);
}

.header__incentive-count {
  font-weight: var(--font-weight-bold);
}

@media (max-width: 80rem) {
  .header {
    padding-inline: var(--space-6);
  }
}
```

- [ ] **Step 5.3: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 5.4: Commit**

```bash
git add src/components/header/
git commit -m "Add Header component with logo, participants pill, settings button

Layout: logo left, cyan-bordered status pill center, icon CTA right.
Participants pill announces count via role=status (no aria-live since
the count rarely changes during a session)."
```

---

## Task 6: Build `<SectionHero>` and wire it into the page

**Files:**
- Create: `src/components/section-hero/section-hero.tsx`
- Create: `src/components/section-hero/section-hero.module.css`

The hero is 927px tall (matches the 928px fold). H1 is centered, large, white. Body below. Primary CTA "Lancer la roulette" centered. Background: dark navy with a radial pink/blue gradient bottom-right.

- [ ] **Step 6.1: Create `src/components/section-hero/section-hero.tsx`**

```tsx
import { ArrowDown } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { Header } from "@/components/header/header";
import styles from "./section-hero.module.css";

type SectionHeroProps = {
  participantCount: number;
  onLaunch: () => void;
  onOpenAdmin?: () => void;
};

export function SectionHero({ participantCount, onLaunch, onOpenAdmin }: SectionHeroProps) {
  return (
    <section className={styles["section-hero"]}>
      <div className={styles["section-hero__gradient"]} aria-hidden="true" />
      <Header participantCount={participantCount} onOpenAdmin={onOpenAdmin} />
      <div className={styles["section-hero__content"]}>
        <h1 className={styles["section-hero__title"]}>
          Ce soir, l&apos;Eurovision s&apos;invite à notre table.
        </h1>
        <p className={styles["section-hero__body"]}>
          Chaque participant tire au sort un pays en lice pour l&apos;Eurovision 2026, un moment du repas, et trois recettes, de la plus accessible à la plus audacieuse.
        </p>
        <CtaButton
          variant="primary"
          surface="dark"
          onClick={onLaunch}
          icon={<ArrowDown />}
        >
          Lancer la roulette
        </CtaButton>
      </div>
    </section>
  );
}
```

- [ ] **Step 6.2: Create `src/components/section-hero/section-hero.module.css`**

```css
.section-hero {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 58rem; /* 928px = ligne de flottaison */
  background-color: var(--color-bg-primary);
  overflow: hidden;
  isolation: isolate;
}

.section-hero__gradient {
  position: absolute;
  inset: 0;
  background-image: var(--gradient-hero-bg);
  pointer-events: none;
  z-index: 0;
}

.section-hero__content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  text-align: center;
  padding-inline: var(--grid-margin);
  z-index: 1;
}

.section-hero__title {
  margin: 0;
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-h1);
  color: var(--color-text-on-dark);
  max-width: 49.75rem; /* 796px */
}

.section-hero__body {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  letter-spacing: var(--letter-spacing-body);
  color: var(--color-text-on-dark);
  max-width: 39.625rem; /* 634px */
}

@media (max-width: 80rem) {
  .section-hero {
    height: auto;
    min-height: 100vh;
    padding-block: var(--space-10);
  }

  .section-hero__title {
    font-size: var(--font-size-3xl);
  }
}

@media (max-width: 48rem) {
  .section-hero__title {
    font-size: var(--font-size-2xl);
  }
}
```

- [ ] **Step 6.3: Wire `SectionHero` into a temporary integration in `src/app/page.tsx`**

Replace the existing `src/app/page.tsx` content with:

```tsx
"use client";

import { useState } from "react";
import { SectionHero } from "@/components/section-hero/section-hero";

export default function Home() {
  const [participantCount, setParticipantCount] = useState(0);

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => setParticipantCount((c) => c + 1)}
      />
    </main>
  );
}
```

> Note: this temporarily breaks the user-facing app behavior (no inscription/code flow). Each subsequent task adds back functionality. By Task 16 the full flow is restored.

- [ ] **Step 6.4: Verify build and visual smoke test**

Run: `npm run dev`
Open `http://localhost:3000`
Expected: Hero section renders full viewport, dark navy background with subtle pink/blue gradient bottom-right, white title centered, body below, "Lancer la roulette" button. Click it → counter increments, pill text changes from "0 participant·es" to "1 participant·es".

Run: `npm run build`
Expected: Successful build.

- [ ] **Step 6.5: Commit**

```bash
git add src/components/section-hero/ src/app/page.tsx
git commit -m "Add SectionHero composing Header + title + body + primary CTA

Hero height = 928px (the line of fold the user designed against).
Gradient layer behind content uses pointer-events: none. Responsive
collapses font-size below 1280px and 768px. page.tsx temporarily
shows just the hero — the rest of the app comes back as we wire each
section."
```

---

## Task 7: Build `<PanelInscription>`

**Files:**
- Create: `src/components/panel-inscription/panel-inscription.tsx`
- Create: `src/components/panel-inscription/panel-inscription.module.css`

Left panel of the top Logs section. Has: header (icon + "Inscription"), input for prénom, code reveal area (#011753 navy bg with white mono text "--- --- ---" or the actual code once registered), CTA "Lancer la roulette".

- [ ] **Step 7.1: Create `src/components/panel-inscription/panel-inscription.tsx`**

```tsx
import { FormEvent, useState } from "react";
import { Sparkles, UserPlus } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import styles from "./panel-inscription.module.css";

type PanelInscriptionProps = {
  code: string | null;
  disabled?: boolean;
  onSubmit: (name: string) => void;
};

export function PanelInscription({ code, disabled, onSubmit }: PanelInscriptionProps) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName("");
  }

  return (
    <section className={styles["panel-inscription"]} aria-labelledby="inscription-title">
      <header className={styles["panel-inscription__header"]}>
        <UserPlus size={24} aria-hidden="true" />
        <h2 id="inscription-title" className={styles["panel-inscription__title"]}>
          Inscription
        </h2>
      </header>
      <form className={styles["panel-inscription__form"]} onSubmit={handleSubmit}>
        <div className={styles["panel-inscription__field"]}>
          <label htmlFor="inscription-name" className={styles["panel-inscription__label"]}>
            Prénom
          </label>
          <input
            id="inscription-name"
            type="text"
            placeholder="John Doe"
            className={styles["panel-inscription__input"]}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={disabled}
          />
        </div>
        <div className={styles["panel-inscription__field"]}>
          <span className={styles["panel-inscription__label"]}>Code</span>
          <div
            className={styles["panel-inscription__code"]}
            role="status"
            aria-live="polite"
            aria-label={code ? `Votre code est ${code}` : "Code en attente"}
          >
            {code ?? "— — —"}
          </div>
          <p className={styles["panel-inscription__help"]}>
            Ce code permet de retrouver le résultat et le profil.
          </p>
        </div>
        <CtaButton
          variant="panel"
          type="submit"
          icon={<Sparkles />}
          disabled={disabled || !name.trim()}
        >
          Lancer la roulette
        </CtaButton>
      </form>
    </section>
  );
}
```

- [ ] **Step 7.2: Create `src/components/panel-inscription/panel-inscription.module.css`**

```css
.panel-inscription {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  background-color: var(--color-bg-on-light);
  border: 2px solid var(--color-border-panel);
  border-radius: var(--radius-lg);
  color: var(--color-text-on-light);
  flex: 1;
  min-width: 0;
}

.panel-inscription__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
  width: 100%;
}

.panel-inscription__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.panel-inscription__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  align-items: center;
}

.panel-inscription__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.panel-inscription__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.panel-inscription__input {
  height: 2.5rem; /* 40px */
  padding-inline: var(--space-4);
  background-color: var(--color-bg-input-light);
  border: 1px solid var(--color-border-input);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-on-light);
}

.panel-inscription__input::placeholder {
  color: var(--color-text-muted);
}

.panel-inscription__input:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.panel-inscription__code {
  height: 3.5rem; /* 56px */
  display: flex;
  align-items: center;
  padding-inline: var(--space-4);
  background-color: var(--color-bg-code-reveal);
  color: var(--color-text-on-dark);
  font-family: var(--font-family-mono);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  letter-spacing: 0.06em;
}

.panel-inscription__help {
  margin: 0;
  font-size: var(--font-size-xs);
  font-style: italic;
  line-height: var(--line-height-cta);
}
```

- [ ] **Step 7.3: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 7.4: Commit**

```bash
git add src/components/panel-inscription/
git commit -m "Add PanelInscription with name input, code reveal, submit CTA

Panel uses .panel-inscription BEM block. The code area is a status
region with aria-live=polite so the code is announced when set.
Disabled-empty submit state prevents accidental submits."
```

---

## Task 8: Build `<PanelRetrieve>`

**Files:**
- Create: `src/components/panel-retrieve/panel-retrieve.tsx`
- Create: `src/components/panel-retrieve/panel-retrieve.module.css`

Right panel of the top Logs section. Has: header (icon + "Retrouver ses informations"), code input (#eaeaea light gray bg + mono font), CTA.

- [ ] **Step 8.1: Create `src/components/panel-retrieve/panel-retrieve.tsx`**

```tsx
import { FormEvent, useState } from "react";
import { KeyRound, Search } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import styles from "./panel-retrieve.module.css";

type PanelRetrieveProps = {
  onSubmit: (code: string) => void;
};

export function PanelRetrieve({ onSubmit }: PanelRetrieveProps) {
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <section className={styles["panel-retrieve"]} aria-labelledby="retrieve-title">
      <header className={styles["panel-retrieve__header"]}>
        <KeyRound size={24} aria-hidden="true" />
        <h2 id="retrieve-title" className={styles["panel-retrieve__title"]}>
          Retrouver ses informations
        </h2>
      </header>
      <form className={styles["panel-retrieve__form"]} onSubmit={handleSubmit}>
        <div className={styles["panel-retrieve__field"]}>
          <label htmlFor="retrieve-code" className={styles["panel-retrieve__label"]}>
            Code
          </label>
          <input
            id="retrieve-code"
            type="text"
            placeholder="MAR-A1B2"
            autoComplete="off"
            className={styles["panel-retrieve__input"]}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <p className={styles["panel-retrieve__help"]}>
            Ce code permet de retrouver le résultat et le profil.
          </p>
        </div>
        <CtaButton
          variant="panel"
          type="submit"
          icon={<Search />}
          disabled={!code.trim()}
        >
          Retrouver ses informations
        </CtaButton>
      </form>
    </section>
  );
}
```

- [ ] **Step 8.2: Create `src/components/panel-retrieve/panel-retrieve.module.css`**

```css
.panel-retrieve {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-8);
  background-color: var(--color-bg-on-light);
  border: 2px solid var(--color-border-panel);
  border-radius: var(--radius-lg);
  color: var(--color-text-on-light);
  flex: 1;
  min-width: 0;
}

.panel-retrieve__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
  width: 100%;
}

.panel-retrieve__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.panel-retrieve__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  align-items: center;
}

.panel-retrieve__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  width: 100%;
}

.panel-retrieve__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.panel-retrieve__input {
  height: 3.5rem; /* 56px */
  padding-inline: var(--space-4);
  background-color: var(--color-bg-input-disabled);
  border: 1px solid transparent;
  font-family: var(--font-family-mono);
  font-size: var(--font-size-base);
  color: var(--color-text-on-light);
  text-transform: uppercase;
}

.panel-retrieve__input::placeholder {
  color: var(--color-text-muted);
  text-transform: none;
}

.panel-retrieve__input:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.panel-retrieve__help {
  margin: 0;
  font-size: var(--font-size-xs);
  font-style: italic;
  line-height: var(--line-height-cta);
}
```

- [ ] **Step 8.3: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 8.4: Commit**

```bash
git add src/components/panel-retrieve/
git commit -m "Add PanelRetrieve with code input and submit CTA

The code input uses IBM Plex Mono and uppercases on display.
text-transform: uppercase keeps the typed value visually consistent
with the code format (e.g. MAR-A1B2). Trim+uppercase happens at
submit time, not on each keystroke, so the user can still see
their typing accurately."
```

---

## Task 9: Build `<SectionLogsTop>` wrapping the two panels

**Files:**
- Create: `src/components/section-logs-top/section-logs-top.tsx`
- Create: `src/components/section-logs-top/section-logs-top.module.css`

- [ ] **Step 9.1: Create `src/components/section-logs-top/section-logs-top.tsx`**

```tsx
import type { ReactNode } from "react";
import styles from "./section-logs-top.module.css";

type SectionLogsTopProps = {
  inscription: ReactNode;
  retrieve: ReactNode;
};

export function SectionLogsTop({ inscription, retrieve }: SectionLogsTopProps) {
  return (
    <section className={styles["section-logs-top"]} aria-label="Inscription et accès participant">
      <div className={styles["section-logs-top__inner"]}>
        {inscription}
        {retrieve}
      </div>
    </section>
  );
}
```

- [ ] **Step 9.2: Create `src/components/section-logs-top/section-logs-top.module.css`**

```css
.section-logs-top {
  position: relative;
  margin-top: -2rem; /* amorces de 32px sous la fold */
  padding-block: var(--space-2);
  padding-inline: var(--grid-margin);
  z-index: 2;
}

.section-logs-top__inner {
  display: flex;
  align-items: stretch;
  gap: var(--space-4);
}

@media (max-width: 80rem) {
  .section-logs-top {
    padding-inline: var(--space-6);
  }

  .section-logs-top__inner {
    flex-direction: column;
  }
}
```

> The `-2rem` margin pulls the panels up so they cross the 928px fold by 32px (matching Figma's `y=895` start), creating the amorce effect.

- [ ] **Step 9.3: Wire into `src/app/page.tsx`**

Replace `src/app/page.tsx` with:

```tsx
"use client";

import { useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  function handleRegister(name: string) {
    const fakeCode = `${name.slice(0, 3).toUpperCase().padEnd(3, "X")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCode(fakeCode);
    setParticipantCount((c) => c + 1);
  }

  function handleRetrieve(submittedCode: string) {
    console.log("retrieve code:", submittedCode);
  }

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
      />
      <SectionLogsTop
        inscription={<PanelInscription code={code} onSubmit={handleRegister} />}
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
    </main>
  );
}
```

> The hero CTA now scrolls down to focus the inscription input (light fallback). In Task 16 we wire the real `register()` from the orchestrator.

- [ ] **Step 9.4: Verify build and visual smoke test**

Run: `npm run dev`
Expected: Hero on top, panels visible below with their tops crossing the fold (amorce). Type a name + submit → fake code appears in the navy code area.

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 9.5: Commit**

```bash
git add src/components/section-logs-top/ src/app/page.tsx
git commit -m "Add SectionLogsTop layout wrapping the two panels

Negative top margin of -2rem creates the amorce effect: the panels
cross the 928px fold by 32px, matching the Figma y=895 start.
Two-column flex on desktop, stacked on tablet/mobile. page.tsx
now renders Hero + LogsTop, with a temporary fake-register handler."
```

---

## Task 10: Build the `<Flag>` component and fetch the 35 SVGs

**Files:**
- Create: `src/components/flag/flag.tsx`
- Create: `src/components/flag/flag.module.css`
- Create: `scripts/fetch-flags.mjs`
- Create: `public/flags/4x3/*.svg` (35 files)
- Create: `src/lib/flags.ts`

We use the `lipis/flag-icons` repository directly — copy the 35 country SVGs we need into `public/flags/4x3/` via a script run once.

- [ ] **Step 10.1: Create `scripts/fetch-flags.mjs`**

```js
import { promises as fs } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT_DIR = resolve(ROOT, "public/flags/4x3");
const BASE = "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/";

const codes = [
  "al", "am", "au", "at", "az", "be", "bg", "hr", "cy", "cz",
  "dk", "ee", "fi", "fr", "ge", "de", "gr", "il", "it", "lv",
  "lt", "lu", "mt", "md", "me", "no", "pl", "pt", "ro", "sm",
  "rs", "se", "ch", "ua", "gb"
];

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const code of codes) {
    const url = `${BASE}${code}.svg`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Failed to fetch ${code}: ${res.status}`);
      continue;
    }
    const svg = await res.text();
    const target = resolve(OUT_DIR, `${code}.svg`);
    await fs.writeFile(target, svg, "utf8");
    console.log(`✓ ${code}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- [ ] **Step 10.2: Run the script**

Run: `node scripts/fetch-flags.mjs`
Expected: 35 ✓ lines, no errors. `public/flags/4x3/` contains 35 .svg files.

- [ ] **Step 10.3: Create `src/lib/flags.ts` mapping ISO codes to lowercase paths**

```ts
export function flagPath(isoCode: string): string {
  return `/flags/4x3/${isoCode.toLowerCase()}.svg`;
}
```

- [ ] **Step 10.4: Create `src/components/flag/flag.tsx`**

```tsx
import { flagPath } from "@/lib/flags";
import styles from "./flag.module.css";

type FlagProps = {
  code: string;
  countryName: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const dimensions = {
  sm: { width: 56, height: 42 },
  md: { width: 80, height: 56 },
  lg: { width: 104, height: 72 }
} as const;

export function Flag({ code, countryName, size = "md", className }: FlagProps) {
  const { width, height } = dimensions[size];
  const classNames = [styles.flag, className].filter(Boolean).join(" ");
  return (
    <span
      className={classNames}
      style={{ width, height }}
      role="img"
      aria-label={`Drapeau ${countryName}`}
    >
      <img
        src={flagPath(code)}
        alt=""
        width={width}
        height={height}
        className={styles.flag__img}
        loading="lazy"
      />
    </span>
  );
}
```

- [ ] **Step 10.5: Create `src/components/flag/flag.module.css`**

```css
.flag {
  display: inline-flex;
  flex-shrink: 0;
  overflow: hidden;
  background-color: var(--color-bg-input-disabled);
}

.flag__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 10.6: Verify build**

Run: `npm run build`
Expected: Build passes.

Manual check: open `http://localhost:3000/flags/4x3/fr.svg` in the browser → French flag renders.

- [ ] **Step 10.7: Commit**

```bash
git add scripts/fetch-flags.mjs public/flags/4x3/ src/components/flag/ src/lib/flags.ts
git commit -m "Add Flag component and fetch 35 Eurovision country SVGs

scripts/fetch-flags.mjs downloads the 4x3 SVGs from lipis/flag-icons
into public/flags/4x3/ (run once: node scripts/fetch-flags.mjs).
Flag component renders <img loading=lazy> with countryName as the
accessible label (alt is empty on the img since the parent span
carries role=img + aria-label)."
```

---

## Task 11: Build `<CountryItem>` and `<FoodMomentItem>`

**Files:**
- Create: `src/components/country-item/country-item.tsx`
- Create: `src/components/country-item/country-item.module.css`
- Create: `src/components/food-moment-item/food-moment-item.tsx`
- Create: `src/components/food-moment-item/food-moment-item.module.css`

- [ ] **Step 11.1: Create `src/components/country-item/country-item.tsx`**

```tsx
import { Check } from "lucide-react";
import { Flag } from "@/components/flag/flag";
import styles from "./country-item.module.css";

type CountryItemState = "default" | "spinning" | "selected" | "used";

type CountryItemProps = {
  code: string;
  name: string;
  state?: CountryItemState;
};

export function CountryItem({ code, name, state = "default" }: CountryItemProps) {
  const classNames = [
    styles["country-item"],
    state !== "default" ? styles[`country-item--${state}`] : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={classNames}
      aria-selected={state === "selected"}
      aria-disabled={state === "used"}
    >
      <Flag code={code} countryName={name} size="md" />
      <div className={styles["country-item__name"]}>
        <span className={styles["country-item__name-text"]}>{name}</span>
        {state === "selected" ? (
          <span className={styles["country-item__check"]} aria-hidden="true">
            <Check size={32} />
          </span>
        ) : null}
      </div>
    </article>
  );
}
```

- [ ] **Step 11.2: Create `src/components/country-item/country-item.module.css`**

```css
.country-item {
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  width: 100%;
  height: 3.5rem; /* 56px */
  overflow: hidden;
}

.country-item__name {
  flex: 1;
  display: flex;
  align-items: center;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-eurovision-blue);
  color: var(--color-text-on-dark);
  transition: background-color 240ms var(--easing-standard), transform 240ms var(--easing-standard);
}

.country-item__name-text {
  flex: 1;
  padding-inline: var(--space-4);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-cta);
}

.country-item__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background-color: var(--color-eurovision-blue);
  color: var(--color-text-on-dark);
  flex-shrink: 0;
}

/* === State: spinning === */
.country-item--spinning .country-item__name {
  outline: 2px solid var(--color-eurovision-cyan);
  outline-offset: -2px;
  transform: scale(1.04);
}

/* === State: selected === */
.country-item--selected .country-item__name {
  background-color: var(--color-bg-on-light);
  color: var(--color-text-on-light);
}

/* === State: used (other guest already drew it) === */
.country-item--used {
  opacity: 0.4;
}
```

- [ ] **Step 11.3: Create `src/components/food-moment-item/food-moment-item.tsx`**

```tsx
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./food-moment-item.module.css";

type FoodMomentItemState = "default" | "spinning" | "selected";

type FoodMomentItemProps = {
  label: string;
  icon: ReactNode;
  state?: FoodMomentItemState;
};

export function FoodMomentItem({ label, icon, state = "default" }: FoodMomentItemProps) {
  const classNames = [
    styles["food-moment-item"],
    state !== "default" ? styles[`food-moment-item--${state}`] : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classNames} aria-selected={state === "selected"}>
      <span className={styles["food-moment-item__icon"]} aria-hidden="true">
        {icon}
      </span>
      <span className={styles["food-moment-item__name"]}>
        <span className={styles["food-moment-item__name-text"]}>{label}</span>
        {state === "selected" ? (
          <span className={styles["food-moment-item__check"]} aria-hidden="true">
            <Check size={24} />
          </span>
        ) : null}
      </span>
    </article>
  );
}
```

- [ ] **Step 11.4: Create `src/components/food-moment-item/food-moment-item.module.css`**

```css
.food-moment-item {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 3rem; /* 48px */
  overflow: hidden;
  border-radius: var(--radius-pill);
}

.food-moment-item__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  background-color: rgba(10, 35, 190, 0.5);
  color: var(--color-text-on-dark);
  flex-shrink: 0;
}

.food-moment-item__name {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: var(--color-eurovision-blue);
  color: var(--color-text-on-dark);
  transition: background-color 240ms var(--easing-standard), transform 240ms var(--easing-standard);
}

.food-moment-item__name-text {
  flex: 1;
  padding-inline: var(--space-4);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-cta);
}

.food-moment-item__check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-eurovision-blue);
  color: var(--color-text-on-dark);
  flex-shrink: 0;
}

/* === State: spinning === */
.food-moment-item--spinning .food-moment-item__name {
  outline: 2px solid var(--color-eurovision-cyan);
  outline-offset: -2px;
  transform: scale(1.04);
}

/* === State: selected === */
.food-moment-item--selected .food-moment-item__name {
  background-color: var(--color-bg-on-light);
  color: var(--color-text-on-light);
}
```

- [ ] **Step 11.5: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 11.6: Commit**

```bash
git add src/components/country-item/ src/components/food-moment-item/
git commit -m "Add CountryItem and FoodMomentItem with all states

States: default (blue+white text), spinning (cyan ring + scale 1.04),
selected (white bg + check icon visible), used (40% opacity for
country items already drawn). Selected state uses both color and
the check icon — redundant signal per WCAG 1.4.1."
```

---

## Task 12: Build `<SectionLeaderboard>`

**Files:**
- Create: `src/components/section-leaderboard/section-leaderboard.tsx`
- Create: `src/components/section-leaderboard/section-leaderboard.module.css`

The leaderboard composes a 3-column grid of country items + a sidebar of food moment items. Wires icons for each food moment.

- [ ] **Step 12.1: Create `src/components/section-leaderboard/section-leaderboard.tsx`**

```tsx
import { Croissant, IceCream, Pizza, Soup, UtensilsCrossed } from "lucide-react";
import { CountryItem } from "@/components/country-item/country-item";
import { FoodMomentItem } from "@/components/food-moment-item/food-moment-item";
import { dinnerSlots } from "@/lib/data";
import type { Country, DinnerSlot } from "@/lib/types";
import styles from "./section-leaderboard.module.css";

const slotIcons: Record<DinnerSlot, JSX.Element> = {
  apero: <Croissant size={28} />,
  entree: <Soup size={28} />,
  plat: <UtensilsCrossed size={28} />,
  dessert: <IceCream size={28} />,
  snacks: <Pizza size={28} />
};

const slotOrder: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];

type SectionLeaderboardProps = {
  countries: Country[];
  selectedCountryCode: string | null;
  spinningCountryCode: string | null;
  usedCountryCodes: Set<string>;
  selectedSlot: DinnerSlot | null;
  spinningSlot: DinnerSlot | null;
};

export function SectionLeaderboard({
  countries,
  selectedCountryCode,
  spinningCountryCode,
  usedCountryCodes,
  selectedSlot,
  spinningSlot
}: SectionLeaderboardProps) {
  return (
    <section className={styles["section-leaderboard"]} aria-label="Tableau des pays et moments du dîner">
      <div className={styles["section-leaderboard__inner"]}>
        <div className={styles["section-leaderboard__countries"]}>
          {countries.map((country) => {
            const state = (() => {
              if (country.code === selectedCountryCode) return "selected" as const;
              if (country.code === spinningCountryCode) return "spinning" as const;
              if (usedCountryCodes.has(country.code) && country.code !== selectedCountryCode) return "used" as const;
              return "default" as const;
            })();
            return (
              <div key={country.code} className={styles["section-leaderboard__country-cell"]}>
                <CountryItem code={country.code} name={country.name} state={state} />
              </div>
            );
          })}
        </div>
        <div className={styles["section-leaderboard__moments"]}>
          {slotOrder.map((slot) => {
            const state = slot === selectedSlot
              ? "selected" as const
              : slot === spinningSlot
              ? "spinning" as const
              : "default" as const;
            return (
              <FoodMomentItem
                key={slot}
                label={dinnerSlots[slot].label}
                icon={slotIcons[slot]}
                state={state}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 12.2: Create `src/components/section-leaderboard/section-leaderboard.module.css`**

```css
.section-leaderboard {
  padding-block: var(--space-10);
  padding-inline: var(--grid-margin);
}

.section-leaderboard__inner {
  display: flex;
  align-items: flex-start;
  gap: var(--space-8);
  width: 100%;
}

.section-leaderboard__countries {
  flex: 1 1 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-2);
  min-width: 0;
}

.section-leaderboard__country-cell {
  min-width: 0;
}

.section-leaderboard__moments {
  flex: 0 0 20.5rem; /* 328px */
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

@media (max-width: 80rem) {
  .section-leaderboard {
    padding-inline: var(--space-6);
  }

  .section-leaderboard__inner {
    flex-direction: column-reverse;
    gap: var(--space-6);
  }

  .section-leaderboard__moments {
    flex: 1;
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
    gap: var(--space-3);
  }

  .section-leaderboard__moments > * {
    flex: 0 0 auto;
    width: auto;
    min-width: 12rem;
  }
}

@media (max-width: 48rem) {
  .section-leaderboard__countries {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
```

- [ ] **Step 12.3: Add `SectionLeaderboard` to `src/app/page.tsx` for visual smoke test**

Update `src/app/page.tsx`:

```tsx
"use client";

import { useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries } from "@/lib/data";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  function handleRegister(name: string) {
    const fakeCode = `${name.slice(0, 3).toUpperCase().padEnd(3, "X")}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    setCode(fakeCode);
    setParticipantCount((c) => c + 1);
  }

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
      />
      <SectionLogsTop
        inscription={<PanelInscription code={code} onSubmit={handleRegister} />}
        retrieve={<PanelRetrieve onSubmit={(c) => console.log(c)} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode="FR"
        spinningCountryCode={null}
        usedCountryCodes={new Set(["IT"])}
        selectedSlot="entree"
        spinningSlot={null}
      />
    </main>
  );
}
```

- [ ] **Step 12.4: Verify build and visual smoke test**

Run: `npm run dev`
Expected: Hero + LogsTop + Leaderboard. Leaderboard shows 35 countries in 3 columns, France white with check icon, Italy at 40% opacity. Sidebar shows 5 food moments, Entrée white with check.

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 12.5: Commit**

```bash
git add src/components/section-leaderboard/ src/app/page.tsx
git commit -m "Add SectionLeaderboard composing CountryItem grid + moments sidebar

3-column grid for the 35 country items, fixed 328px sidebar for the
5 food moments. lucide-react icons mapped per slot (Croissant/Soup/
UtensilsCrossed/IceCream/Pizza). Below 1280px the moments collapse
into a horizontally scrollable row above the grid."
```

---

## Task 13: Build `<RecipeItem>` and `<RecipeLevel>`

**Files:**
- Create: `src/components/recipe-item/recipe-item.tsx`
- Create: `src/components/recipe-item/recipe-item.module.css`
- Create: `src/components/recipe-level/recipe-level.tsx`
- Create: `src/components/recipe-level/recipe-level.module.css`

- [ ] **Step 13.1: Create `src/components/recipe-item/recipe-item.tsx`**

```tsx
import { ExternalLink, ChevronRight } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import type { Dish } from "@/lib/types";
import styles from "./recipe-item.module.css";

type RecipeItemProps = {
  index: number;
  dish: Dish;
};

export function RecipeItem({ index, dish }: RecipeItemProps) {
  const primaryLink = dish.recipeLinks[0];
  return (
    <article className={styles["recipe-item"]}>
      <span className={styles["recipe-item__index"]}>Recette #{index}</span>
      <div className={styles["recipe-item__title"]}>
        <h4 className={styles["recipe-item__title-text"]}>{dish.name}</h4>
        <span className={styles["recipe-item__title-icon"]} aria-hidden="true">
          <ExternalLink size={15} />
        </span>
      </div>
      <p className={styles["recipe-item__description"]}>{dish.story}</p>
      {primaryLink ? (
        <a
          href={primaryLink.url}
          target="_blank"
          rel="noreferrer"
          className={styles["recipe-item__cta-link"]}
        >
          <CtaButton variant="secondary" icon={<ChevronRight />} aria-label={`Voir la recette ${dish.name}`}>
            Voir la recette
          </CtaButton>
        </a>
      ) : null}
    </article>
  );
}
```

- [ ] **Step 13.2: Create `src/components/recipe-item/recipe-item.module.css`**

```css
.recipe-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-border-cta);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-on-light);
  color: var(--color-text-on-light);
  flex: 1;
  min-width: 0;
}

.recipe-item__index {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.recipe-item__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.recipe-item__title-text {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.recipe-item__title-icon {
  display: inline-flex;
  align-items: center;
  color: var(--color-text-muted);
}

.recipe-item__description {
  margin: 0;
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
  color: var(--color-text-on-light);
}

.recipe-item__cta-link {
  display: inline-flex;
  margin-top: auto;
  text-decoration: none;
}

.recipe-item__cta-link:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
  border-radius: var(--radius-md);
}
```

- [ ] **Step 13.3: Create `src/components/recipe-level/recipe-level.tsx`**

```tsx
import type { Difficulty } from "@/lib/types";
import styles from "./recipe-level.module.css";

const difficultyMeta: Record<Difficulty, { stars: number; label: string }> = {
  Facile: { stars: 1, label: "Niveau accessible" },
  Moyen: { stars: 2, label: "Niveau intermédiaire" },
  Challenge: { stars: 3, label: "Niveau audacieux" }
};

type RecipeLevelProps = {
  difficulty: Difficulty;
  count: number;
};

export function RecipeLevel({ difficulty, count }: RecipeLevelProps) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className={styles["recipe-level"]}>
      <div className={styles["recipe-level__stars"]} aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={
              i < meta.stars
                ? `${styles["recipe-level__star"]} ${styles["recipe-level__star--filled"]}`
                : styles["recipe-level__star"]
            }
          />
        ))}
      </div>
      <span className={styles["recipe-level__label"]}>
        {difficulty} — {meta.label}
      </span>
      <span className={styles["recipe-level__details"]}>{count} recette{count > 1 ? "s" : ""}</span>
    </div>
  );
}
```

- [ ] **Step 13.4: Create `src/components/recipe-level/recipe-level.module.css`**

```css
.recipe-level {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  width: 100%;
  color: var(--color-text-on-light);
}

.recipe-level__stars {
  display: inline-flex;
  gap: 2px;
  flex-shrink: 0;
}

.recipe-level__star {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-bg-input-disabled);
}

.recipe-level__star--filled {
  background-color: var(--color-eurovision-blue);
}

.recipe-level__label {
  flex: 1;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.recipe-level__details {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  flex-shrink: 0;
}
```

- [ ] **Step 13.5: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 13.6: Commit**

```bash
git add src/components/recipe-item/ src/components/recipe-level/
git commit -m "Add RecipeItem and RecipeLevel components

RecipeItem renders a card per dish (index, title, description, CTA
link to the first recipe URL). RecipeLevel shows the difficulty
header with star indicators (1/2/3 filled circles for
Facile/Moyen/Challenge)."
```

---

## Task 14: Build `<PanelResult>` and `<PanelRecipes>`

**Files:**
- Create: `src/components/panel-result/panel-result.tsx`
- Create: `src/components/panel-result/panel-result.module.css`
- Create: `src/components/panel-recipes/panel-recipes.tsx`
- Create: `src/components/panel-recipes/panel-recipes.module.css`
- Create: `src/lib/youtube.ts`

- [ ] **Step 14.1: Create `src/lib/youtube.ts`**

```ts
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`;
}

export function youtubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}
```

- [ ] **Step 14.2: Create `src/components/panel-result/panel-result.tsx`**

```tsx
import { Eye, EyeOff, ShoppingBasket } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import { Flag } from "@/components/flag/flag";
import type { Country, DinnerSlot } from "@/lib/types";
import { dinnerSlots } from "@/lib/data";
import { youtubeEmbedUrl, youtubeThumbnail } from "@/lib/youtube";
import styles from "./panel-result.module.css";

type PanelResultProps = {
  country: Country | null;
  slot: DinnerSlot | null;
  guestName: string | null;
  shoppingDone: boolean;
  onToggleShopping: () => void;
  isAdmin: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
};

export function PanelResult({
  country,
  slot,
  guestName,
  shoppingDone,
  onToggleShopping,
  isAdmin,
  revealed,
  onToggleReveal
}: PanelResultProps) {
  if (!country || !slot) {
    return (
      <section className={styles["panel-result"]} aria-label="Résultat du tirage">
        <header className={styles["panel-result__header"]}>
          <EurovisionLogo size="sm" />
          <div className={styles["panel-result__header-text"]}>
            <p className={styles["panel-result__header-title"]}>En attente</p>
            <p className={styles["panel-result__header-subtitle"]}>Lance la roulette</p>
          </div>
        </header>
        <p className={styles["panel-result__placeholder"]}>
          Le résultat apparaîtra ici une fois le tirage lancé.
        </p>
      </section>
    );
  }

  const slotLabel = dinnerSlots[slot].label.toLowerCase();
  return (
    <section className={styles["panel-result"]} aria-label="Résultat du tirage">
      <header className={styles["panel-result__header"]}>
        <EurovisionLogo size="sm" />
        <div className={styles["panel-result__header-text"]}>
          <p className={styles["panel-result__header-title"]}>
            {guestName ?? "Eurovision Roulette"}
          </p>
          <p className={styles["panel-result__header-subtitle"]}>2026</p>
        </div>
      </header>
      <div className={styles["panel-result__command"]}>
        <p className={styles["panel-result__command-eyebrow"]}>Nouvelle commande Chef !</p>
        <p className={styles["panel-result__command-line"]}>
          Pour le dîner ce sera{" "}
          <strong className={styles["panel-result__command-highlight"]}>{slotLabel}</strong>{" "}
          à réaliser pour ce soir.
        </p>
        <p className={styles["panel-result__command-line"]}>
          Et pour le pays de référence ce sera :{" "}
          <strong className={styles["panel-result__command-highlight"]}>{country.name}</strong>
        </p>
        <Flag code={country.code} countryName={country.name} size="lg" className={styles["panel-result__flag"]} />
      </div>
      <div className={styles["panel-result__media"]}>
        <p className={styles["panel-result__song"]}>
          {country.artist} — &quot;{country.song}&quot;
        </p>
        {country.youtubeId ? (
          <iframe
            src={youtubeEmbedUrl(country.youtubeId)}
            title={`${country.artist} — ${country.song}`}
            className={styles["panel-result__video"]}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles["panel-result__video-placeholder"]} aria-label="Aperçu indisponible">
            <Flag code={country.code} countryName={country.name} size="lg" />
          </div>
        )}
      </div>
      <div className={styles["panel-result__ctas"]}>
        <CtaButton
          variant="panel"
          icon={<ShoppingBasket />}
          onClick={onToggleShopping}
        >
          {shoppingDone ? "Courses prêtes" : "Marquer les courses"}
        </CtaButton>
        {isAdmin ? (
          <CtaButton
            variant="panel"
            icon={revealed ? <EyeOff /> : <Eye />}
            onClick={onToggleReveal}
          >
            {revealed ? "Cacher" : "Révéler"}
          </CtaButton>
        ) : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 14.3: Create `src/components/panel-result/panel-result.module.css`**

```css
.panel-result {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8);
  background-color: var(--color-bg-on-light);
  border: 2px solid var(--color-border-panel);
  border-radius: var(--radius-lg);
  color: var(--color-text-on-light);
  flex: 1;
  min-width: 0;
}

.panel-result__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding-bottom: var(--space-2);
}

.panel-result__header-text {
  display: flex;
  flex-direction: column;
}

.panel-result__header-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.panel-result__header-subtitle {
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--color-text-muted);
}

.panel-result__placeholder {
  margin: 0;
  padding: var(--space-10) 0;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
}

.panel-result__command {
  position: relative;
  padding: var(--space-6);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-input-disabled);
}

.panel-result__command-eyebrow {
  margin: 0 0 var(--space-3);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.panel-result__command-line {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-base);
  line-height: var(--line-height-cta);
}

.panel-result__command-highlight {
  font-weight: var(--font-weight-bold);
  color: var(--color-eurovision-blue);
}

.panel-result__flag {
  position: absolute;
  top: var(--space-6);
  right: var(--space-6);
}

.panel-result__media {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.panel-result__song {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
}

.panel-result__video,
.panel-result__video-placeholder {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-primary);
  border: 0;
}

.panel-result__video-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-result__ctas {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}
```

- [ ] **Step 14.4: Create `src/components/panel-recipes/panel-recipes.tsx`**

```tsx
import { ChefHat } from "lucide-react";
import { RecipeItem } from "@/components/recipe-item/recipe-item";
import { RecipeLevel } from "@/components/recipe-level/recipe-level";
import type { Country, DinnerSlot, Difficulty } from "@/lib/types";
import styles from "./panel-recipes.module.css";

type PanelRecipesProps = {
  country: Country | null;
  slot: DinnerSlot | null;
};

const difficulties: Difficulty[] = ["Facile", "Moyen", "Challenge"];

export function PanelRecipes({ country, slot }: PanelRecipesProps) {
  if (!country || !slot) {
    return (
      <section className={styles["panel-recipes"]} aria-label="Recettes proposées">
        <header className={styles["panel-recipes__header"]}>
          <ChefHat size={24} aria-hidden="true" />
          <h2 className={styles["panel-recipes__title"]}>Recettes</h2>
        </header>
        <p className={styles["panel-recipes__placeholder"]}>
          Les recettes du pays tiré apparaîtront ici.
        </p>
      </section>
    );
  }
  const dishes = country.dishes[slot];
  return (
    <section className={styles["panel-recipes"]} aria-label="Recettes proposées">
      <header className={styles["panel-recipes__header"]}>
        <ChefHat size={24} aria-hidden="true" />
        <h2 className={styles["panel-recipes__title"]}>Trois recettes pour {country.name}</h2>
      </header>
      {difficulties.map((difficulty) => {
        const filtered = dishes.filter((d) => d.difficulty === difficulty);
        if (!filtered.length) return null;
        return (
          <section key={difficulty} className={styles["panel-recipes__group"]}>
            <RecipeLevel difficulty={difficulty} count={filtered.length} />
            <div className={styles["panel-recipes__items"]}>
              {filtered.map((dish, idx) => (
                <RecipeItem key={dish.id} index={idx + 1} dish={dish} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
```

- [ ] **Step 14.5: Create `src/components/panel-recipes/panel-recipes.module.css`**

```css
.panel-recipes {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  padding: var(--space-8);
  background-color: var(--color-bg-on-light);
  border: 2px solid var(--color-border-panel);
  border-radius: var(--radius-lg);
  color: var(--color-text-on-light);
  flex: 1;
  min-width: 0;
}

.panel-recipes__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.panel-recipes__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-cta);
}

.panel-recipes__placeholder {
  margin: 0;
  padding: var(--space-10) 0;
  text-align: center;
  color: var(--color-text-muted);
  font-style: italic;
}

.panel-recipes__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.panel-recipes__items {
  display: flex;
  gap: var(--space-4);
  align-items: stretch;
}

@media (max-width: 64rem) {
  .panel-recipes__items {
    flex-direction: column;
  }
}
```

- [ ] **Step 14.6: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 14.7: Commit**

```bash
git add src/components/panel-result/ src/components/panel-recipes/ src/lib/youtube.ts
git commit -m "Add PanelResult and PanelRecipes for the bottom logs section

PanelResult shows the chef command with country and slot highlighted,
the artist+song line, and a YouTube embed if youtubeId is present
(graceful flag-based fallback otherwise). Two CTAs: shopping toggle
+ admin reveal toggle (only shown when isAdmin).

PanelRecipes groups dishes by difficulty (Facile/Moyen/Challenge),
each level rendering a RecipeLevel header + the matching RecipeItems."
```

---

## Task 15: Build `<SectionLogsBottom>` wrapping the two bottom panels

**Files:**
- Create: `src/components/section-logs-bottom/section-logs-bottom.tsx`
- Create: `src/components/section-logs-bottom/section-logs-bottom.module.css`

- [ ] **Step 15.1: Create `src/components/section-logs-bottom/section-logs-bottom.tsx`**

```tsx
import type { ReactNode } from "react";
import styles from "./section-logs-bottom.module.css";

type SectionLogsBottomProps = {
  result: ReactNode;
  recipes: ReactNode;
};

export function SectionLogsBottom({ result, recipes }: SectionLogsBottomProps) {
  return (
    <section
      id="section-logs-bottom"
      className={styles["section-logs-bottom"]}
      aria-label="Résultat et recettes"
    >
      <div className={styles["section-logs-bottom__inner"]}>
        {result}
        {recipes}
      </div>
    </section>
  );
}
```

- [ ] **Step 15.2: Create `src/components/section-logs-bottom/section-logs-bottom.module.css`**

```css
.section-logs-bottom {
  padding-block: var(--space-10);
  padding-inline: var(--grid-margin);
}

.section-logs-bottom__inner {
  display: flex;
  align-items: stretch;
  gap: var(--space-4);
}

@media (max-width: 80rem) {
  .section-logs-bottom {
    padding-inline: var(--space-6);
  }

  .section-logs-bottom__inner {
    flex-direction: column;
  }
}
```

- [ ] **Step 15.3: Verify build**

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 15.4: Commit**

```bash
git add src/components/section-logs-bottom/
git commit -m "Add SectionLogsBottom layout wrapping result + recipes panels

Has id=section-logs-bottom for the scrollTo target later. Two-column
flex on desktop, stacked below 1280px."
```

---

## Task 16: Build the `EurovisionRoulette` orchestrator (idle + revealed states)

**Files:**
- Create: `src/components/eurovision-roulette/eurovision-roulette.tsx`
- Create: `src/components/eurovision-roulette/eurovision-roulette.module.css`
- Modify: `src/app/page.tsx`

This is the new top-level component that wires everything together. It manages: state (guests, current selected guest, admin status, revealed flag), event handlers (register, retrieve, toggle shopping, toggle reveal), persistence via the existing `loadState`/`persistState`. It does **not yet** implement spinning — that's Task 17.

- [ ] **Step 16.1: Create `src/components/eurovision-roulette/eurovision-roulette.tsx`**

```tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries } from "@/lib/data";
import { createGuest } from "@/lib/roulette";
import { hasSupabase, loadState, persistState } from "@/lib/storage";
import type { Guest, RouletteState } from "@/lib/types";
import styles from "./eurovision-roulette.module.css";

const ADMIN_PIN = "1974";

export function EurovisionRoulette() {
  const [state, setState] = useState<RouletteState>({ revealDraws: false, guests: [] });
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [adminPin, setAdminPin] = useState("");
  const [, setStatus] = useState("Chargement...");

  useEffect(() => {
    loadState().then((loaded) => {
      setState(loaded);
      setStatus(hasSupabase ? "Synchronisé avec Supabase" : "Mode local prêt");
    });
  }, []);

  useEffect(() => {
    persistState(state).catch(() => setStatus("Sauvegarde locale active, Supabase indisponible"));
  }, [state]);

  const isAdmin = adminPin === ADMIN_PIN;

  const activeGuest = useMemo(
    () => state.guests.find((g) => g.code.toUpperCase() === activeCode?.toUpperCase()) ?? null,
    [state.guests, activeCode]
  );

  const usedCountryCodes = useMemo(
    () => new Set(state.guests.map((g) => g.countryCode)),
    [state.guests]
  );

  const activeCountry = activeGuest
    ? countries.find((c) => c.code === activeGuest.countryCode) ?? null
    : null;

  function handleRegister(name: string) {
    setState((prev) => {
      const guest = createGuest(name, prev.guests);
      const next: RouletteState = { ...prev, guests: [...prev.guests, guest] };
      setActiveCode(guest.code);
      return next;
    });
  }

  function handleRetrieve(code: string) {
    setActiveCode(code);
  }

  function handleToggleShopping() {
    if (!activeGuest) return;
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === activeGuest.id ? { ...g, shoppingDone: !g.shoppingDone } : g
      )
    }));
  }

  function handleToggleReveal() {
    setState((prev) => ({ ...prev, revealDraws: !prev.revealDraws }));
  }

  function handleOpenAdmin() {
    const input = window.prompt("PIN admin");
    if (input) setAdminPin(input);
  }

  return (
    <main className={styles["eurovision-roulette"]}>
      <SectionHero
        participantCount={state.guests.length}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
        onOpenAdmin={handleOpenAdmin}
      />
      <SectionLogsTop
        inscription={
          <PanelInscription
            code={activeGuest?.code ?? null}
            onSubmit={handleRegister}
          />
        }
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode={activeGuest?.countryCode ?? null}
        spinningCountryCode={null}
        usedCountryCodes={usedCountryCodes}
        selectedSlot={activeGuest?.dinnerSlot ?? null}
        spinningSlot={null}
      />
      <SectionLogsBottom
        result={
          <PanelResult
            country={activeCountry}
            slot={activeGuest?.dinnerSlot ?? null}
            guestName={activeGuest?.name ?? null}
            shoppingDone={activeGuest?.shoppingDone ?? false}
            onToggleShopping={handleToggleShopping}
            isAdmin={isAdmin}
            revealed={state.revealDraws}
            onToggleReveal={handleToggleReveal}
          />
        }
        recipes={
          <PanelRecipes
            country={activeCountry}
            slot={activeGuest?.dinnerSlot ?? null}
          />
        }
      />
    </main>
  );
}
```

- [ ] **Step 16.2: Create `src/components/eurovision-roulette/eurovision-roulette.module.css`**

```css
.eurovision-roulette {
  display: block;
}
```

- [ ] **Step 16.3: Update `src/app/page.tsx` to render the new orchestrator**

```tsx
import { EurovisionRoulette } from "@/components/eurovision-roulette/eurovision-roulette";

export default function Home() {
  return <EurovisionRoulette />;
}
```

- [ ] **Step 16.4: Verify build and end-to-end smoke test**

Run: `npm run dev`
Steps:
1. Page loads, hero visible
2. Type a name in Inscription, click "Lancer la roulette" → code appears in code area, leaderboard updates with selected country (white) and selected slot, result panel shows chef command + flag, recipes panel shows 3 levels of dishes
3. Note the code → reload the page → paste the code in PanelRetrieve → click "Retrouver ses informations" → state restored
4. Click the small settings icon top-right → enter `1974` → reveal toggle CTA appears in the result panel

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 16.5: Commit**

```bash
git add src/components/eurovision-roulette/ src/app/page.tsx
git commit -m "Wire up new EurovisionRoulette orchestrator with all sections

Replaces the temporary fake-register page.tsx with the real
orchestrator that uses createGuest from src/lib/roulette and
loadState/persistState from src/lib/storage. Admin PIN entry uses
window.prompt for now (Task 21 replaces with a proper drawer).
Spinning state is not yet implemented — that's Task 17."
```

---

## Task 17: Implement the spinning roulette animation

**Files:**
- Create: `src/lib/spinning.ts`
- Modify: `src/components/eurovision-roulette/eurovision-roulette.tsx`

The spin lasts 5s. Country and moment items receive a `spinning` highlight that cycles via random tick. Tick interval ramps from 60ms to 480ms (decelerate). At the end, the `selected` state is applied.

- [ ] **Step 17.1: Create `src/lib/spinning.ts` with the timing helpers**

```ts
type SpinTick = {
  delay: number;
  index: number;
};

export function generateSpinTicks(itemCount: number, totalMs = 5000): SpinTick[] {
  const ticks: SpinTick[] = [];
  let elapsed = 0;
  let interval = 60;
  while (elapsed < totalMs) {
    const index = Math.floor(Math.random() * itemCount);
    ticks.push({ delay: elapsed, index });
    elapsed += interval;
    const ratio = elapsed / totalMs;
    if (ratio > 0.8) interval = 480;
    else if (ratio > 0.6) interval = 240;
    else if (ratio > 0.4) interval = 120;
    else interval = 60;
  }
  return ticks;
}

export function pickFinalIndex(itemCount: number): number {
  return Math.floor(Math.random() * itemCount);
}
```

- [ ] **Step 17.2: Update `EurovisionRoulette` to add spinning state machine**

Replace `src/components/eurovision-roulette/eurovision-roulette.tsx` with:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries, dinnerSlots } from "@/lib/data";
import { createGuest } from "@/lib/roulette";
import { generateSpinTicks } from "@/lib/spinning";
import { hasSupabase, loadState, persistState } from "@/lib/storage";
import type { DinnerSlot, RouletteState } from "@/lib/types";
import styles from "./eurovision-roulette.module.css";

type Phase = "idle" | "spinning" | "revealed";
const ADMIN_PIN = "1974";
const SLOT_ORDER: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];

export function EurovisionRoulette() {
  const [state, setState] = useState<RouletteState>({ revealDraws: false, guests: [] });
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [adminPin, setAdminPin] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [spinningCountryCode, setSpinningCountryCode] = useState<string | null>(null);
  const [spinningSlot, setSpinningSlot] = useState<DinnerSlot | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    loadState().then(setState);
    return () => {
      timeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    persistState(state).catch(() => undefined);
  }, [state]);

  const isAdmin = adminPin === ADMIN_PIN;

  const activeGuest = useMemo(
    () => state.guests.find((g) => g.code.toUpperCase() === activeCode?.toUpperCase()) ?? null,
    [state.guests, activeCode]
  );

  const usedCountryCodes = useMemo(
    () => new Set(state.guests.map((g) => g.countryCode)),
    [state.guests]
  );

  const activeCountry = activeGuest
    ? countries.find((c) => c.code === activeGuest.countryCode) ?? null
    : null;

  const startSpin = useCallback(
    (name: string) => {
      setPhase("spinning");
      setLiveMessage("Tirage en cours, sélection aléatoire pendant 5 secondes.");

      const countryTicks = generateSpinTicks(countries.length, 5000);
      const slotTicks = generateSpinTicks(SLOT_ORDER.length, 5000);

      countryTicks.forEach((tick) => {
        const id = window.setTimeout(() => {
          setSpinningCountryCode(countries[tick.index].code);
        }, tick.delay);
        timeouts.current.push(id);
      });

      slotTicks.forEach((tick) => {
        const id = window.setTimeout(() => {
          setSpinningSlot(SLOT_ORDER[tick.index]);
        }, tick.delay + 80);
        timeouts.current.push(id);
      });

      const completeId = window.setTimeout(() => {
        setSpinningCountryCode(null);
        setSpinningSlot(null);
        setState((prev) => {
          const guest = createGuest(name, prev.guests);
          setActiveCode(guest.code);
          const country = countries.find((c) => c.code === guest.countryCode);
          const slotLabel = dinnerSlots[guest.dinnerSlot].label;
          setLiveMessage(`Résultat : ${country?.name ?? "?"}, ${slotLabel.toLowerCase()}.`);
          return { ...prev, guests: [...prev.guests, guest] };
        });
        setPhase("revealed");
      }, 5000);
      timeouts.current.push(completeId);
    },
    []
  );

  function handleRegister(name: string) {
    if (phase === "spinning") return;
    startSpin(name);
  }

  function handleRetrieve(code: string) {
    setActiveCode(code);
    setPhase("revealed");
  }

  function handleToggleShopping() {
    if (!activeGuest) return;
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === activeGuest.id ? { ...g, shoppingDone: !g.shoppingDone } : g
      )
    }));
  }

  function handleToggleReveal() {
    setState((prev) => ({ ...prev, revealDraws: !prev.revealDraws }));
  }

  function handleOpenAdmin() {
    const input = window.prompt("PIN admin");
    if (input) setAdminPin(input);
  }

  return (
    <main className={styles["eurovision-roulette"]}>
      <SectionHero
        participantCount={state.guests.length}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
        onOpenAdmin={handleOpenAdmin}
      />
      <SectionLogsTop
        inscription={
          <PanelInscription
            code={activeGuest?.code ?? null}
            disabled={phase === "spinning"}
            onSubmit={handleRegister}
          />
        }
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode={phase === "revealed" ? activeGuest?.countryCode ?? null : null}
        spinningCountryCode={phase === "spinning" ? spinningCountryCode : null}
        usedCountryCodes={usedCountryCodes}
        selectedSlot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
        spinningSlot={phase === "spinning" ? spinningSlot : null}
      />
      <SectionLogsBottom
        result={
          <PanelResult
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
            guestName={phase === "revealed" ? activeGuest?.name ?? null : null}
            shoppingDone={activeGuest?.shoppingDone ?? false}
            onToggleShopping={handleToggleShopping}
            isAdmin={isAdmin}
            revealed={state.revealDraws}
            onToggleReveal={handleToggleReveal}
          />
        }
        recipes={
          <PanelRecipes
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
          />
        }
      />
      <div className={styles["eurovision-roulette__live"]} role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
    </main>
  );
}
```

- [ ] **Step 17.3: Update `eurovision-roulette.module.css` to include the SR-only live region**

```css
.eurovision-roulette {
  display: block;
}

.eurovision-roulette__live {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 17.4: Verify build and visual smoke test**

Run: `npm run dev`
Steps:
1. Type a name → click "Lancer la roulette" → leaderboard items rapidly cycle their highlight (cyan ring + scale 1.04). After 5s, the country and slot lock to their final values. The result panel populates with the chef command, flag, and recipes.

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 17.5: Commit**

```bash
git add src/lib/spinning.ts src/components/eurovision-roulette/
git commit -m "Implement 5s spinning state machine and aria-live announcements

Phase: idle | spinning | revealed. generateSpinTicks() schedules
random highlights with deceleration (60→120→240→480ms intervals).
The country and slot get desynced 80ms offsets for a more natural
feel. SR-only live region announces 'Tirage en cours' at start
and the final result at the end (WCAG 4.1.3)."
```

---

## Task 18: Implement scrollTo with amorces visible

**Files:**
- Modify: `src/components/eurovision-roulette/eurovision-roulette.tsx`
- Modify: `src/components/section-leaderboard/section-leaderboard.tsx`

When the spin completes, smoothly scroll so the leaderboard sits centered, with the bottom of section-logs-top peeking from above and the top of section-logs-bottom peeking from below.

- [ ] **Step 18.1: Add an `id="section-leaderboard"` and a ref to the leaderboard**

Update `src/components/section-leaderboard/section-leaderboard.tsx`. Replace the opening `<section>` tag:

```tsx
<section
  id="section-leaderboard"
  className={styles["section-leaderboard"]}
  aria-label="Tableau des pays et moments du dîner"
>
```

- [ ] **Step 18.2: Add `scrollIntoLeaderboard` helper and call after spin**

In `src/components/eurovision-roulette/eurovision-roulette.tsx`, add this helper after the `SLOT_ORDER` constant (top-level in the file):

```ts
function scrollIntoLeaderboard() {
  const leaderboard = document.getElementById("section-leaderboard");
  if (!leaderboard) return;
  const rect = leaderboard.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const target = absoluteTop - (window.innerHeight - rect.height) / 2;
  window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
}
```

Then call it inside `startSpin` after the `setPhase("revealed")` line:

```ts
const completeId = window.setTimeout(() => {
  setSpinningCountryCode(null);
  setSpinningSlot(null);
  setState((prev) => {
    const guest = createGuest(name, prev.guests);
    setActiveCode(guest.code);
    const country = countries.find((c) => c.code === guest.countryCode);
    const slotLabel = dinnerSlots[guest.dinnerSlot].label;
    setLiveMessage(`Résultat : ${country?.name ?? "?"}, ${slotLabel.toLowerCase()}.`);
    return { ...prev, guests: [...prev.guests, guest] };
  });
  setPhase("revealed");
  scrollIntoLeaderboard();
}, 5000);
```

- [ ] **Step 18.3: Verify visually**

Run: `npm run dev`
1. Inscription → Lancer
2. After 5s, the page should smoothly scroll to position the leaderboard centered in the viewport. The bottom of the top panels (Inscription/Retrieve) peeks from the top, and the top of the bottom panels (Result/Recipes) peeks from below.

If the viewport is < 1100px tall, scrolling may not show all 3 amorces — that's fine, graceful degradation.

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 18.4: Commit**

```bash
git add src/components/section-leaderboard/section-leaderboard.tsx src/components/eurovision-roulette/eurovision-roulette.tsx
git commit -m "Scroll the leaderboard into view with amorces after spinning

scrollIntoLeaderboard() centers the leaderboard in the viewport so
the bottoms of the top panels peek above and the tops of the bottom
panels peek below — matches the Figma frame intent. Uses smooth
behavior; respects prefers-reduced-motion via the global override."
```

---

## Task 19: Implement reduced-motion fallback for the spin

**Files:**
- Modify: `src/lib/spinning.ts`
- Modify: `src/components/eurovision-roulette/eurovision-roulette.tsx`
- Modify: `src/app/globals.css`

When `prefers-reduced-motion: reduce` is on, we skip the 5s tick parade and reveal directly after a short 800ms delay (just enough to feel intentional).

- [ ] **Step 19.1: Add `prefersReducedMotion` helper to `src/lib/spinning.ts`**

```ts
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 19.2: Branch in `startSpin`**

In `src/components/eurovision-roulette/eurovision-roulette.tsx`, update `startSpin`:

```tsx
import { generateSpinTicks, prefersReducedMotion } from "@/lib/spinning";

const startSpin = useCallback(
  (name: string) => {
    setPhase("spinning");
    setLiveMessage("Tirage en cours, sélection aléatoire pendant 5 secondes.");

    const reducedMotion = prefersReducedMotion();
    const totalMs = reducedMotion ? 800 : 5000;

    if (!reducedMotion) {
      const countryTicks = generateSpinTicks(countries.length, totalMs);
      const slotTicks = generateSpinTicks(SLOT_ORDER.length, totalMs);

      countryTicks.forEach((tick) => {
        const id = window.setTimeout(() => {
          setSpinningCountryCode(countries[tick.index].code);
        }, tick.delay);
        timeouts.current.push(id);
      });

      slotTicks.forEach((tick) => {
        const id = window.setTimeout(() => {
          setSpinningSlot(SLOT_ORDER[tick.index]);
        }, tick.delay + 80);
        timeouts.current.push(id);
      });
    }

    const completeId = window.setTimeout(() => {
      setSpinningCountryCode(null);
      setSpinningSlot(null);
      setState((prev) => {
        const guest = createGuest(name, prev.guests);
        setActiveCode(guest.code);
        const country = countries.find((c) => c.code === guest.countryCode);
        const slotLabel = dinnerSlots[guest.dinnerSlot].label;
        setLiveMessage(`Résultat : ${country?.name ?? "?"}, ${slotLabel.toLowerCase()}.`);
        return { ...prev, guests: [...prev.guests, guest] };
      });
      setPhase("revealed");
      scrollIntoLeaderboard();
    }, totalMs);
    timeouts.current.push(completeId);
  },
  []
);
```

- [ ] **Step 19.3: Verify with reduced motion**

In macOS: System Preferences → Accessibility → Display → Reduce motion → on
In Chrome DevTools: Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce"

Run: `npm run dev`
1. Click "Lancer la roulette" → no flicker on items, just an 800ms delay then result appears.

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 19.4: Commit**

```bash
git add src/lib/spinning.ts src/components/eurovision-roulette/eurovision-roulette.tsx
git commit -m "Skip 5s tick parade when prefers-reduced-motion is on

prefersReducedMotion() reads window.matchMedia. When true, we still
keep an 800ms delay so the SR-only 'Tirage en cours' is announced
and the user feels the action — but no visual flicker. The result
locks straight away (WCAG 2.3.3 enhanced)."
```

---

## Task 20: Build the admin drawer

**Files:**
- Create: `src/components/admin-drawer/admin-drawer.tsx`
- Create: `src/components/admin-drawer/admin-drawer.module.css`
- Modify: `src/components/eurovision-roulette/eurovision-roulette.tsx`

Replace the `window.prompt("PIN admin")` with a proper drawer: PIN input first, then upon successful PIN, expose admin actions (reveal toggle, copy codes, list of guests with reroll/delete).

- [ ] **Step 20.1: Create `src/components/admin-drawer/admin-drawer.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { Clipboard, Eye, EyeOff, RefreshCw, Trash2, X } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { countries } from "@/lib/data";
import type { Guest } from "@/lib/types";
import styles from "./admin-drawer.module.css";

const ADMIN_PIN = "1974";

type AdminDrawerProps = {
  open: boolean;
  guests: Guest[];
  revealDraws: boolean;
  onClose: () => void;
  onToggleReveal: () => void;
  onCopyCodes: () => void;
  onReroll: (guest: Guest) => void;
  onRemove: (guest: Guest) => void;
};

export function AdminDrawer({
  open,
  guests,
  revealDraws,
  onClose,
  onToggleReveal,
  onCopyCodes,
  onReroll,
  onRemove
}: AdminDrawerProps) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      setPin("");
      setUnlocked(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles["admin-drawer"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drawer-title"
    >
      <div
        className={styles["admin-drawer__backdrop"]}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={styles["admin-drawer__panel"]}>
        <header className={styles["admin-drawer__header"]}>
          <h2 id="admin-drawer-title" className={styles["admin-drawer__title"]}>
            Panneau admin
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={styles["admin-drawer__close"]}
            aria-label="Fermer le panneau admin"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {!unlocked ? (
          <form
            className={styles["admin-drawer__pin-form"]}
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === ADMIN_PIN) setUnlocked(true);
              else setPin("");
            }}
          >
            <label htmlFor="admin-pin" className={styles["admin-drawer__label"]}>
              PIN admin
            </label>
            <input
              id="admin-pin"
              type="password"
              autoComplete="off"
              className={styles["admin-drawer__input"]}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <CtaButton variant="panel" type="submit">
              Déverrouiller
            </CtaButton>
          </form>
        ) : (
          <div className={styles["admin-drawer__content"]}>
            <div className={styles["admin-drawer__actions"]}>
              <CtaButton
                variant="panel"
                icon={revealDraws ? <EyeOff /> : <Eye />}
                onClick={onToggleReveal}
              >
                {revealDraws ? "Cacher tirages" : "Révéler tirages"}
              </CtaButton>
              <CtaButton
                variant="panel"
                icon={<Clipboard />}
                onClick={onCopyCodes}
                disabled={!guests.length}
              >
                Copier codes
              </CtaButton>
            </div>
            <ul className={styles["admin-drawer__list"]}>
              {guests.map((guest) => {
                const country = countries.find((c) => c.code === guest.countryCode);
                return (
                  <li key={guest.id} className={styles["admin-drawer__row"]}>
                    <div className={styles["admin-drawer__row-info"]}>
                      <strong>{guest.name}</strong>
                      <span>{guest.code}</span>
                      <span>
                        {country?.name ?? "?"} · {guest.dinnerSlot}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles["admin-drawer__row-action"]}
                      onClick={() => onReroll(guest)}
                      aria-label={`Reroll ${guest.name}`}
                    >
                      <RefreshCw size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${styles["admin-drawer__row-action"]} ${styles["admin-drawer__row-action--danger"]}`}
                      onClick={() => onRemove(guest)}
                      aria-label={`Supprimer ${guest.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
              {!guests.length ? (
                <li className={styles["admin-drawer__empty"]}>Aucun participant pour l&apos;instant.</li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 20.2: Create `src/components/admin-drawer/admin-drawer.module.css`**

```css
.admin-drawer {
  position: fixed;
  inset: 0;
  z-index: var(--z-drawer);
  display: flex;
  justify-content: flex-end;
}

.admin-drawer__backdrop {
  position: absolute;
  inset: 0;
  background-color: rgba(5, 11, 48, 0.6);
  backdrop-filter: blur(4px);
}

.admin-drawer__panel {
  position: relative;
  width: min(100%, 28rem); /* 448px */
  height: 100%;
  background-color: var(--color-bg-on-light);
  color: var(--color-text-on-light);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  overflow-y: auto;
}

.admin-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-drawer__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-bold);
}

.admin-drawer__close {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
}

.admin-drawer__close:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.admin-drawer__pin-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.admin-drawer__label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
}

.admin-drawer__input {
  height: 2.5rem;
  padding-inline: var(--space-4);
  background-color: var(--color-bg-input-light);
  border: 1px solid var(--color-border-input);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-on-light);
}

.admin-drawer__input:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.admin-drawer__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.admin-drawer__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.admin-drawer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.admin-drawer__row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: var(--space-3);
  align-items: center;
  padding: var(--space-3);
  border: 1px solid var(--color-border-cta);
  border-radius: var(--radius-md);
}

.admin-drawer__row-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: var(--font-size-xs);
  min-width: 0;
}

.admin-drawer__row-info > strong {
  font-size: var(--font-size-sm);
}

.admin-drawer__row-info > span:last-child {
  color: var(--color-text-muted);
}

.admin-drawer__row-action {
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-input-disabled);
  color: var(--color-text-on-light);
}

.admin-drawer__row-action--danger {
  background-color: var(--color-eurovision-pink);
  color: var(--color-text-on-dark);
}

.admin-drawer__row-action:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

.admin-drawer__empty {
  font-style: italic;
  color: var(--color-text-muted);
  text-align: center;
  padding: var(--space-6) 0;
}
```

- [ ] **Step 20.3: Wire admin drawer in `EurovisionRoulette`**

Update `src/components/eurovision-roulette/eurovision-roulette.tsx`:

1. Import:
```tsx
import { AdminDrawer } from "@/components/admin-drawer/admin-drawer";
import { pickCountry, pickDinnerSlot, createGuest } from "@/lib/roulette";
import type { Guest } from "@/lib/types";
```

2. Replace state related to `adminPin`:
```tsx
const [adminOpen, setAdminOpen] = useState(false);
const [adminUnlocked, setAdminUnlocked] = useState(false);
```

3. Replace `handleOpenAdmin` body with:
```tsx
function handleOpenAdmin() {
  setAdminOpen(true);
}
```

4. Add admin handlers next to existing ones:
```tsx
function handleReroll(guest: Guest) {
  setState((prev) => {
    const others = prev.guests.filter((g) => g.id !== guest.id);
    const next: Guest = {
      ...guest,
      dinnerSlot: pickDinnerSlot(others, prev.guests.length),
      countryCode: pickCountry(others)
    };
    return {
      ...prev,
      guests: prev.guests.map((g) => (g.id === guest.id ? next : g))
    };
  });
}

function handleRemove(guest: Guest) {
  if (!window.confirm(`Supprimer ${guest.name} ?`)) return;
  setState((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== guest.id) }));
  if (activeCode === guest.code) setActiveCode(null);
}

function handleCopyCodes() {
  const text = state.guests.map((g) => `${g.name}: ${g.code}`).join("\n");
  navigator.clipboard.writeText(text);
}
```

5. Replace the `isAdmin` computation:
```tsx
const isAdmin = adminUnlocked;
```

6. Render the drawer at the end of the JSX (right before the closing `</main>`):
```tsx
<AdminDrawer
  open={adminOpen}
  guests={state.guests}
  revealDraws={state.revealDraws}
  onClose={() => setAdminOpen(false)}
  onToggleReveal={handleToggleReveal}
  onCopyCodes={handleCopyCodes}
  onReroll={handleReroll}
  onRemove={handleRemove}
/>
```

7. Inside the `AdminDrawer` component (`src/components/admin-drawer/admin-drawer.tsx`), update the `unlocked` flag handling so the parent can read it. Add this prop:

In `AdminDrawerProps`:
```ts
onUnlock?: () => void;
```

In the form `onSubmit`:
```ts
onSubmit={(e) => {
  e.preventDefault();
  if (pin === ADMIN_PIN) {
    setUnlocked(true);
    onUnlock?.();
  } else {
    setPin("");
  }
}}
```

Then in the orchestrator, pass `onUnlock={() => setAdminUnlocked(true)}`.

- [ ] **Step 20.4: Verify build and admin smoke test**

Run: `npm run dev`
1. Click the small settings icon top-right → drawer opens
2. Type wrong PIN → input clears
3. Type `1974` → admin actions appear
4. Click "Reroll" on a guest → their country/slot rotates
5. Click "Cacher/Révéler tirages" → toggles `state.revealDraws`
6. Press Escape → drawer closes

Run: `npm run build`
Expected: Build passes.

- [ ] **Step 20.5: Commit**

```bash
git add src/components/admin-drawer/ src/components/eurovision-roulette/eurovision-roulette.tsx
git commit -m "Add AdminDrawer with PIN-gated admin actions

Replaces the previous window.prompt with a slide-over drawer
(role=dialog, aria-modal). Locked behind the same PIN 1974.
Once unlocked: reveal toggle, copy codes, per-guest reroll
and remove actions. Escape closes the drawer; focus returns
to header settings button (browser default for trapped focus).
"
```

---

## Task 21: Audit accessibility with eslint-plugin-jsx-a11y

**Files:**
- Modify: `.eslintrc.json`
- (potentially) `package.json` if the plugin isn't already installed via `eslint-config-next`

- [ ] **Step 21.1: Confirm `eslint-plugin-jsx-a11y` is enabled**

Run: `npx next lint`
If the output shows jsx-a11y warnings, the plugin is active. Next.js's default config (`eslint-config-next`) extends `plugin:jsx-a11y/recommended` already.

- [ ] **Step 21.2: Tighten the config**

Replace `.eslintrc.json` with:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-noninteractive-element-interactions": "error"
  }
}
```

- [ ] **Step 21.3: Run lint and fix any issues**

Run: `npm run lint`
Expected: 0 errors, 0 warnings. If any appear, fix them inline (typically: missing `aria-label` on icon-only buttons, anchor tags used as buttons, etc.).

- [ ] **Step 21.4: Commit**

```bash
git add .eslintrc.json
git commit -m "Tighten ESLint with jsx-a11y rules at error level

Catches missing aria-labels on icon buttons, click handlers on
non-interactive elements, and label-input mismatches at lint time.
This is the cheapest WCAG safety net during development."
```

---

## Task 22: Polish — gradient noise, focus on first meaningful element, contrast verification

**Files:**
- Modify: `src/app/tokens.css`
- Modify: `src/components/section-hero/section-hero.module.css`
- Verify with browser DevTools

The Figma hero has a subtle film grain texture overlaid on the gradient. We add it via an SVG `feTurbulence` filter directly in CSS to avoid shipping a PNG.

- [ ] **Step 22.1: Add a noise overlay token in `src/app/tokens.css`**

Add to `:root` at the bottom:

```css
  --noise-overlay: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.18'/></svg>");
```

- [ ] **Step 22.2: Apply to the hero**

Update `src/components/section-hero/section-hero.module.css` to add a second pseudo-element layer:

```css
.section-hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--noise-overlay);
  background-repeat: repeat;
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.5;
  z-index: 0;
}
```

- [ ] **Step 22.3: Manual contrast verification with axe-core via Lighthouse**

1. `npm run build && npm run start`
2. Open `http://localhost:3000`, run Lighthouse → Accessibility audit (Chrome DevTools)
3. Verify Accessibility score ≥ 95
4. Investigate any contrast warnings; if found, raise to 4.5:1 by darkening or lightening the impacted color in `tokens.css`

- [ ] **Step 22.4: Commit**

```bash
git add src/app/tokens.css src/components/section-hero/section-hero.module.css
git commit -m "Add SVG-data-URI noise overlay on the hero gradient

Inline SVG feTurbulence avoids shipping a PNG asset. mix-blend-mode:
overlay keeps the grain subtle (opacity 0.18 in the SVG, 0.5 on the
pseudo-element) — visible on flat areas, invisible on the gradient
center."
```

---

## Task 23: Cleanup old code

**Files:**
- Delete: `src/components/eurovision-roulette.tsx` (the original 345-line component)
- Verify nothing imports it

- [ ] **Step 23.1: Confirm no imports remain**

Run:
```bash
grep -r "from \"@/components/eurovision-roulette\"" src/ --include="*.tsx" --include="*.ts"
```
Expected: only matches in `src/components/eurovision-roulette/eurovision-roulette.tsx` (the new one) and `src/app/page.tsx` (which imports the new path with the trailing slash). The OLD path `@/components/eurovision-roulette` (without trailing slash) should not appear.

If a stale import shows up, fix it to use `@/components/eurovision-roulette/eurovision-roulette`.

- [ ] **Step 23.2: Delete the old file**

```bash
rm "src/components/eurovision-roulette.tsx"
```

- [ ] **Step 23.3: Verify build**

Run: `npm run build && npm run typecheck && npm run lint`
Expected: All pass.

- [ ] **Step 23.4: Commit**

```bash
git add -A src/components/eurovision-roulette.tsx
git commit -m "Remove legacy eurovision-roulette.tsx

The new component tree under src/components/ replaces the original
single 345-line file. All inscription/retrieve/admin/reveal/reroll
functionality is preserved across the new components."
```

---

## Task 24: Final verification, manual smoke test

- [ ] **Step 24.1: Run all checks**

```bash
npm run typecheck
npm run lint
npm run build
```
Expected: All three pass with zero errors.

- [ ] **Step 24.2: Full end-to-end manual smoke**

`npm run dev` and step through:

1. Page loads → hero visible with gradient + noise + Eurovision logo + participants pill (0 inscrits) + settings button
2. Type "Alice" in inscription → "Lancer la roulette" enabled → click → 5s spinning animation visible (cyan highlights cycling), then result locks → page smoothly scrolls so leaderboard centers, with amorces visible
3. Result panel shows the chef command (country + slot in eurovision-blue), Flag, song info, recipes panel populated with 9 recipes (3×3)
4. Click "Marquer les courses" → toggles to "Courses prêtes"
5. Take note of the code shown in inscription panel → reload page
6. Code persisted (Supabase or localStorage) — paste it in PanelRetrieve → click "Retrouver ses informations" → result/recipes restored
7. Click settings button → drawer opens → enter `1974` → admin section shows reveal toggle, copy codes, list with Alice and her reroll/delete buttons → click reroll → Alice's country/slot changes → close drawer (Escape or X)
8. Tab through the page from the top: focus order should be logo (no focus by default) → participants pill (skip, not interactive) → settings → "Lancer la roulette" hero CTA → input prénom → "Lancer la roulette" panel → input code → "Retrouver ses informations" → recipe links (after a tirage)
9. macOS VoiceOver (Cmd+F5): navigate the page; the SR-only live region announces "Tirage en cours…" and the result; aria-labels read as expected
10. Chrome DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → click "Lancer la roulette" → no flicker, just an 800ms delay before result locks

- [ ] **Step 24.3: Lighthouse audit on prod build**

```bash
npm run build && npm run start
```
Open `http://localhost:3000` in Chrome → DevTools → Lighthouse → Accessibility audit.
Expected: Accessibility score ≥ 95.

- [ ] **Step 24.4: Commit (if any tweaks)**

If the Lighthouse audit found small issues that you fixed inline:

```bash
git add -A
git commit -m "Final tweaks from Lighthouse a11y audit"
```

- [ ] **Step 24.5: Tag the integration milestone**

```bash
git tag -a v0.2.0-figma-integration -m "Figma visual integration complete"
```

> Optional — pushing the tag is the user's call.

---

## Self-review checklist

- [x] **Spec coverage** : every section of the design spec is implemented in at least one task
  - §3 Architecture → Tasks 1, 16, 23
  - §4 Tokens → Task 1
  - §5 Animation flow → Tasks 17, 18
  - §6 Components → Tasks 3, 5, 7, 8, 11, 12, 13, 14, 15, 20
  - §7 Implementation order → mirrored in task numbering
  - §8 Snacks slot → Task 2
  - §9 Acceptance criteria → Task 24
  - §11 WCAG 2.2 → Tasks 17 (live region), 19 (reduced motion), 20 (drawer dialog), 21 (lint), 22 (audit)
- [x] **No placeholders** : all "TODO/TBD/...etc" pruned, every step has actual code or commands
- [x] **Type consistency** : `DinnerSlot` includes `snacks` everywhere, `Country.youtubeId?` consistent, `CountryItemState` and `FoodMomentItemState` referenced consistently
