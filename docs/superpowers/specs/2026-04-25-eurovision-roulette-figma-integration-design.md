# Eurovision Roulette — Plan d'intégration des maquettes Figma

**Date:** 2026-04-25
**Auteur:** Suong Kevin TAN (assisté Claude Opus 4.7)
**Statut:** spec — en attente review utilisateur
**Source maquette:** [Figma — fileKey 3wN1dlbNC0ftKGOFWFOoA2](https://www.figma.com/design/3wN1dlbNC0ftKGOFWFOoA2/Untitled?node-id=0-1)

---

## 1. Contexte

### 1.1 Existant

L'app Eurovision Roulette est une SPA Next.js 15 + React 19 (TypeScript), persistance Supabase avec fallback localStorage. La logique métier (35 pays Eurovision Vienne 2026, tirage pondéré équilibré sur 4 slots dîner, codes personnels, PIN admin, reroll) est dans `src/lib/`. L'UI est concentrée dans un seul composant `src/components/eurovision-roulette.tsx` (345 lignes) stylé via `src/app/globals.css` (522 lignes) avec des classes sémantiques non-BEM. Le rendu actuel est un brouillon technique : pas de design tokens, pas de grille systématique, pas d'échelle typographique cohérente, animation roulette minimaliste (pulse CSS).

### 1.2 Cible (maquette Figma)

Une frame `01. Start` (1920×3505px) compose **4 sections empilées** correspondant à un seul état "résultat révélé" :

| # | Section | y / hauteur | Rôle |
|---|---------|-------------|------|
| 1 | `Section/Hero` | 0 — 927 | Header (logo + pill participants + bouton settings) + titre H1 + body + CTA primaire "Lancer la roulette" |
| 2 | `Section/Logs` (haut) | 895 — 1359 | 2 panels côte à côte : Inscription (prénom + code + CTA) / Retrouver ses informations (code + CTA) |
| 3 | `Section/Leaderboard` | 1423 — 2123 | Grille 3×12 de pays + sidebar 5 moments dîner (Apéro, Entrée, Plat principal, Dessert, **Snacks**) |
| 4 | `Section/Logs` (bas) | 2189 — 3185 | 2 panels côte à côte : Result panel (logo + commande Chef + drapeau + lecteur YouTube + 2 CTA) / Recipes panel (3 niveaux × 3 recettes) |

La ligne de flottaison à 928px coïncide précisément avec la fin du Hero. La section Logs (haut) commence à y=895 et amorce de 32px au-dessus de la ligne de flottaison — c'est la signature visuelle "il se passe quelque chose plus bas".

### 1.3 Contraintes utilisateur

- **Grille** : 24 colonnes, gouttières 8px, mode stretch
- **Référence** : écran 1920×728 (sous la ligne de flottaison à 928px)
- **Base** : 4px (toutes les espacements multiples de 4)
- **Type scale** : 1.26 Major Third, taille de référence 20px
- **Naming** : BEM, calques Figma déjà nommés en BEM (`Section/`, `Panel/`, `Country/Item`, `Recipie/Item`, `CTA/Button`...)
- **Unités** : `rem` pour le macro (sections, layouts), `px` pour le micro (bordures fines, ombres)
- **Drapeaux** : repo [lipis/flag-icons](https://github.com/lipis/flag-icons) (SVG officiels ISO 3166-1 alpha-2)
- **Roulette** : montrer la sélection aléatoire pendant 5s, puis `scrollTo` vers la section 4 (résultat) avec amorces visibles des sections 2 (Logs haut) et 4 (Recipes/Result)

---

## 2. Approche d'intégration recommandée

**Refactor visuel sans toucher à la logique métier.** La logique de tirage (`src/lib/roulette.ts`, `src/lib/data.ts`, `src/lib/storage.ts`, `src/lib/types.ts`) est correcte fonctionnellement et orthogonale à la direction artistique. On garde l'API et le state shape ; on remplace **toute la couche présentationnelle**.

### 2.1 Pourquoi ce choix

- **Risque minimal sur la persistence** : aucun changement schéma Supabase, ni du contrat localStorage v1
- **Rollback trivial** : si on n'aime pas le rendu, on rétablit `eurovision-roulette.tsx` et `globals.css` sans rien casser côté data
- **Vélocité** : la logique de pondération sur les slots dîner est non triviale (déjà testée à la main par toi), pas la peine de la réécrire

### 2.2 Modifications data nécessaires (limitées)

- **Ajouter `snacks`** comme 5e `DinnerSlot` (la maquette montre 5 moments). Impact : `src/lib/types.ts`, `src/lib/data.ts` (ajouter une 5e variante de `dishSet` ou la dériver), `src/lib/roulette.ts` (poids dans `expectedDistribution`), `src/components/...`. Le schéma Supabase est en `text` libre donc pas de migration.
- **Compteur participants en hero** : la pill "10 participants·es en lice" lit déjà `state.guests.length` — pas de nouvelle data
- **Lecteur YouTube** : la maquette montre un screenshot de YouTube ; on ajoute un champ `youtubeId?: string` optionnel sur `Country` (35 valeurs à remplir progressivement), avec fallback sur un placeholder thumbnail si absent

### 2.3 Stack styling — décision

**CSS Modules + design tokens en variables CSS, BEM dans les noms de classes.**

Pourquoi pas Tailwind (que la maquette Figma exporte) :
- Le projet n'a pas Tailwind installé et tu spécifies BEM
- Tailwind contredit la consigne "REM macro / PX micro" (utilities sont en rem-fixe)
- Les noms de calques BEM Figma (`Country/Item`, `Section/Hero`) se traduisent naturellement en CSS Modules (`country-item.module.css` avec classes `.country-item__flag`, `.country-item--selected`)

Pourquoi CSS Modules plutôt que CSS global BEM :
- Scoping automatique = pas de collision même si on duplique un nom de bloc dans 2 composants
- Compatible avec la convention Next.js App Router
- Un seul `tokens.css` global, le reste isolé par composant

---

## 3. Architecture cible

### 3.1 Arborescence de fichiers

```
src/
├── app/
│   ├── globals.css                    # reset + import tokens
│   ├── layout.tsx                     # font Inter + IBM Plex Mono via next/font
│   ├── page.tsx                       # composition root
│   └── tokens.css                     # design tokens (variables CSS)
├── components/
│   ├── header/
│   │   ├── header.tsx
│   │   └── header.module.css          # .header, .header__logo, .header__incentive...
│   ├── eurovision-logo/
│   │   ├── eurovision-logo.tsx        # composant SVG inline (le coeur multicolore)
│   │   └── eurovision-logo.module.css
│   ├── cta-button/
│   │   ├── cta-button.tsx             # le CTA "bevel" double-bordure
│   │   └── cta-button.module.css      # variants: primary / secondary / icon-only
│   ├── section-hero/
│   │   ├── section-hero.tsx
│   │   └── section-hero.module.css
│   ├── section-logs-top/
│   │   ├── section-logs-top.tsx       # wrapper 2 panels
│   │   ├── panel-inscription.tsx
│   │   ├── panel-retrieve.tsx
│   │   └── section-logs-top.module.css
│   ├── section-leaderboard/
│   │   ├── section-leaderboard.tsx
│   │   ├── countries-grid.tsx
│   │   ├── country-item.tsx           # gère states default / selected
│   │   ├── moments-list.tsx
│   │   ├── food-moment-item.tsx
│   │   └── section-leaderboard.module.css
│   ├── section-logs-bottom/
│   │   ├── section-logs-bottom.tsx
│   │   ├── panel-result.tsx           # logo + chef-command + drapeau + youtube + CTAs
│   │   ├── panel-recipes.tsx
│   │   ├── recipe-level.tsx           # subheader stars + level details
│   │   ├── recipe-item.tsx
│   │   └── section-logs-bottom.module.css
│   ├── flag/
│   │   ├── flag.tsx                   # <Flag code="FR" /> → SVG depuis flag-icons
│   │   └── flag.module.css
│   └── eurovision-roulette/
│       ├── eurovision-roulette.tsx    # orchestrateur principal (state + flow)
│       └── eurovision-roulette.module.css
├── lib/
│   ├── data.ts                        # +snacks slot
│   ├── roulette.ts                    # +pondération snacks
│   ├── storage.ts                     # inchangé
│   ├── types.ts                       # +snacks dans DinnerSlot
│   ├── flags.ts                       # mapping code ISO → import flag SVG
│   └── youtube.ts                     # helper id → embed URL
└── styles/                            # alternative à app/tokens.css si plus pratique
```

### 3.2 Couches sémantiques

```
EurovisionRoulette (orchestrateur)
├── état: idle | spinning | revealed
├── flow: register → spin (5s) → scrollTo(section-bottom) → revealed
└── rend:
    ├── Header                       (sticky? ou statique haut)
    ├── SectionHero
    ├── SectionLogsTop
    │   ├── PanelInscription          (formulaire prénom + résultat code)
    │   └── PanelRetrieve             (input code + dispatch sélection)
    ├── SectionLeaderboard
    │   ├── CountriesGrid (3 cols × 12 rows = 36 slots, 35 pays + 1 vide)
    │   │   └── CountryItem[]         (default | spinning | selected | used-by-other)
    │   └── MomentsList (5 items)
    │       └── FoodMomentItem[]      (default | spinning | selected)
    └── SectionLogsBottom (visible quand revealed)
        ├── PanelResult
        │   ├── EurovisionLogo + status text
        │   ├── ChefCommand           ("Pour le dîner ce sera l'entrée à...")
        │   ├── Flag (résultat)
        │   ├── YouTubeEmbed
        │   └── CTAs (admin reveal / copy codes)
        └── PanelRecipes
            └── RecipeLevel × 3       (Facile, Moyen, Challenge)
                └── RecipeItem × 3
```

---

## 4. Design tokens

Tous les tokens sont définis en CSS variables dans `src/app/tokens.css`. Importé par `globals.css`. Disponibles via `var(--token-name)` dans tous les CSS Modules.

### 4.1 Couleurs

```css
:root {
  /* surfaces */
  --color-bg-primary: #050b30;          /* navy profond, fond global avec noise */
  --color-bg-elevated: #0a1240;         /* panels sur le fond */
  --color-bg-on-light: #fefefe;         /* surface claire (panels Logs haut, hero CTA) */
  --color-bg-input-light: #fefefe;
  --color-bg-input-disabled: #eaeaea;
  --color-bg-code-reveal: #011753;      /* fond du code affiché en blanc mono */

  /* eurovision palette */
  --color-eurovision-blue: #0a23be;     /* couleur signature pour items, badges, flags */
  --color-eurovision-cyan: #00c7f1;     /* accent live (pill participants) */
  --color-eurovision-pink: #e0237a;     /* gradient hero, branding */

  /* texte */
  --color-text-on-dark: #fefefe;
  --color-text-on-light: #181818;
  --color-text-muted: #626262;
  --color-text-italic-help: #181818;    /* "Ce code permet de retrouver..." */

  /* bordures */
  --color-border-input: #8b8b8b;
  --color-border-cta: #ebebeb;          /* l'effet bevel des CTA */
  --color-border-panel: rgba(255, 255, 255, 0.5);

  /* effets */
  --shadow-cta-soft: 0 0 8px rgba(0, 0, 0, 0.1);
  --shadow-cta-mini: 0 0 5px rgba(0, 0, 0, 0.1);
  --gradient-hero-bg: radial-gradient(
    ellipse at 100% 100%,
    rgba(224, 35, 122, 0.45) 0%,
    rgba(10, 35, 190, 0.35) 35%,
    transparent 70%
  );
  --texture-noise: url("/assets/noise.png");  /* texture grain subtil sur le fond */
}
```

### 4.2 Typographie

Échelle 1.26 Major Third sur base 20px, exprimée en `rem` (1rem = 16px par défaut navigateur).

```css
:root {
  --font-family-sans: "Inter", system-ui, sans-serif;
  --font-family-mono: "IBM Plex Mono", ui-monospace, monospace;

  /* échelle 1.26 (steps depuis 16px → 80px) */
  --font-size-xs: 0.8125rem;     /* 13px — italic help text */
  --font-size-sm: 1rem;           /* 16px — body small, CTA secondary */
  --font-size-md: 1.125rem;       /* 18px — food moments */
  --font-size-base: 1.25rem;      /* 20px — body, country names, panel titles */
  --font-size-lg: 1.5625rem;      /* ~25px — non utilisé directement, dispo */
  --font-size-xl: 2rem;           /* 32px — hero titles secondaires */
  --font-size-2xl: 2.5rem;        /* 40px — sub-hero */
  --font-size-3xl: 3.1875rem;     /* ~51px — */
  --font-size-4xl: 4rem;          /* 64px — */
  --font-size-5xl: 5rem;          /* 80px — H1 hero */

  /* line-heights */
  --line-height-tight: 1.15;      /* H1 (92/80 = 1.15) */
  --line-height-snug: 1.2;        /* paragraphs courts */
  --line-height-normal: 1.5;      /* body (30/20 = 1.5) */
  --line-height-cta: 1.4;         /* CTAs (28/20 = 1.4) */

  /* tracking */
  --letter-spacing-h1: -0.03em;   /* -2.4px sur 80px */
  --letter-spacing-body: -0.02em; /* -0.4px sur 20px */

  /* poids */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
}
```

Inter et IBM Plex Mono importés via `next/font/google` dans `app/layout.tsx` pour bénéficier de l'optimisation Next.

### 4.3 Espacements

Base 4px, exprimés en `rem` pour le macro.

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-14: 3.5rem;   /* 56px */
  --space-16: 4rem;     /* 64px */
  --space-18: 4.5rem;   /* 72px */
  --space-20: 5rem;     /* 80px — marge horizontale page */
}
```

### 4.4 Grille

```css
:root {
  --grid-columns: 24;
  --grid-gutter: 0.5rem;          /* 8px */
  --grid-margin: 5rem;            /* 80px (marge page) */
  --grid-content-max: 110.5rem;   /* 1768px = (1920 - 2×80) + 8 stretch ; voir note */
}
```

> Note : la maquette positionne le leaderboard à `x=80, w=1768` ce qui dépasse de 8px la marge droite théorique (1840). C'est compatible avec un container pleine largeur calculé `calc(100% - 2 × var(--grid-margin) + var(--grid-gutter))` ou simplement `1760px` ajusté. On retient **container intérieur 1760px** par défaut, avec stretch.

### 4.5 Rayons

```css
:root {
  --radius-sm: 0.5rem;      /* 8px — country name pill intérieure */
  --radius-md: 0.75rem;     /* 12px — input fields */
  --radius-lg: 1rem;        /* 16px — panels, CTA primary */
  --radius-xl: 1.25rem;     /* 20px — CTA hero */
  --radius-pill: 3rem;      /* 48px — food moment items */
  --radius-full: 99rem;     /* pill incentive */
}
```

### 4.6 Z-index & motion

```css
:root {
  --z-header: 10;
  --z-overlay: 50;

  --duration-spin-tile: 60ms;       /* fréquence cycle tile en spinning */
  --duration-spin-total: 5000ms;    /* durée totale spin avant scrollTo */
  --duration-scroll-to-result: 800ms;
  --duration-press: 120ms;
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --easing-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## 5. États clés et flow d'animation

### 5.1 Machine à états du composant orchestrateur

```
                 register()          (5s timer)            user click ResetCTA
  ┌────────┐  ─────────────────►  ┌──────────┐  ─────►  ┌─────────┐  ─────►  ┌──────┐
  │  idle  │                      │ spinning │           │revealed │           │ idle │
  └────────┘                      └──────────┘           └─────────┘           └──────┘
                                       │                      ▲
                                       │  scrollTo(section-bottom)
                                       └──────────────────────┘
```

- **idle** : leaderboard en état "tous default", panels Logs haut interactifs, panel résultat caché ou en placeholder
- **spinning** : 5 secondes, les country items et food moment items rotent visuellement (highlight aléatoire qui circule), CTA disabled
- **revealed** : pays gagnant en blanc avec check, moment gagnant en blanc avec check, panels résultats peuplés, scrollTo lancé

### 5.2 Animation spinning

**Country grid (35+1 cells):**
- À chaque tick (60ms), un index aléatoire est sélectionné, applique `--country-item--highlight` (scale 1.04, ring eurovision-cyan)
- Vers la fin (4s à 5s), les ticks s'espacent (60ms → 120ms → 240ms → 480ms) — effet ralentissement de roulette physique
- À 5s exactement, le pays final reçoit l'état `selected` (white bg + check icon eurovision-blue)

**Moments sidebar (5 cells):**
- Même principe, ticks parallèles décalés de 80ms vs grid (effet désynchronisé esthétique)
- État final : moment gagnant `selected` (white bg + check)

### 5.3 ScrollTo avec amorces visibles

À la fin du spin (t=5000ms), on déclenche un `window.scrollTo` calé pour que :
- Le **bas de Section/Logs (haut)** soit visible en haut d'écran (~100px d'amorce)
- La **Section/Leaderboard** soit centrée et lisible (700px en plein milieu)
- Le **haut de Section/Logs (bas)** amorce de ~120px en bas d'écran

Pour viewport 1920×728 (sous fold), le scroll target est calculé :
```ts
const target = leaderboardEl.offsetTop - (viewportHeight - leaderboardEl.offsetHeight) / 2;
window.scrollTo({ top: target, behavior: 'smooth' });
```

L'utilisateur a explicitement demandé que les amorces des sections 2 et 4 soient visibles. Si la viewport est trop petite (< 1100px), on tombe en mode "scroll vers section 4 directement, pas d'amorce" — graceful degradation.

---

## 6. Composants détaillés (BEM)

### 6.1 `<CtaButton>` — bouton bevel signature

3 variants, mais structure HTML identique : double `<div>` imbriqué pour l'effet "bevel" (bordure double couche visible dans la maquette).

```html
<button class="cta-button cta-button--primary">
  <span class="cta-button__bevel"></span>
  <span class="cta-button__inner">
    <span class="cta-button__icon">…</span>
    <span class="cta-button__label">Lancer la roulette</span>
  </span>
</button>
```

Variants : `--primary` (hero, white avec ombre), `--panel` (logs, blanc avec border 4px #ebebeb), `--icon-only` (header settings, 48×48), `--secondary` (recipe item, plus compact).

### 6.2 `<CountryItem>` — item leaderboard

```html
<article class="country-item country-item--selected">
  <div class="country-item__flag">
    <Flag code="FR" />
  </div>
  <div class="country-item__name">
    <span class="country-item__name-text">France</span>
    <span class="country-item__check"><CheckIcon /></span>
  </div>
</article>
```

Modifiers :
- `country-item` (default) : nom blanc texte sur fond #0a23be
- `country-item--selected` : nom noir sur fond blanc + carré check #0a23be visible
- `country-item--spinning` : highlight ring + scale 1.04
- `country-item--used-by-other` : opacity 0.4 (autre invité l'a tiré, indispo pour ce nouvel invité — règle métier existante)

### 6.3 `<FoodMomentItem>` — item sidebar moments

```html
<button class="food-moment-item food-moment-item--selected">
  <span class="food-moment-item__icon"><AperoIcon /></span>
  <span class="food-moment-item__name">
    <span class="food-moment-item__name-text">Apéro</span>
    <span class="food-moment-item__check"><CheckIcon /></span>
  </span>
</button>
```

Pill-shape (`border-radius: var(--radius-pill)`). Mêmes modifiers que CountryItem.

### 6.4 `<RecipeItem>` — carte recette

```html
<article class="recipe-item">
  <span class="recipe-item__index">Recette #1</span>
  <div class="recipe-item__title">
    <h3 class="recipe-item__title-text">Karjalanpiirakka</h3>
    <span class="recipe-item__title-icon"><LinkIcon /></span>
  </div>
  <p class="recipe-item__description">Format partageable, parfait…</p>
  <a class="recipe-item__cta cta-button cta-button--secondary" href="…">
    …
  </a>
</article>
```

### 6.5 `<Flag code="FR">` — composant drapeau

Stratégie : copier les 35 SVGs nécessaires depuis [lipis/flag-icons](https://github.com/lipis/flag-icons/tree/main/flags/4x3) dans `public/flags/4x3/` au build (script `scripts/fetch-flags.ts`). Le composant rend `<img src="/flags/4x3/fr.svg" alt="" />` à la taille demandée par le parent (default 80×56, ratio 4:3 légèrement coupé en clip).

Pourquoi pas le package npm `flag-icons` directement : il pousse 250+ flags + un fichier CSS de 250kb. On en utilise 35.

---

## 7. Plan de mise en œuvre (résumé — détail dans le plan d'implémentation suivant)

Étapes ordonnées qui permettent de garder l'app fonctionnelle à chaque palier :

1. **Foundations** — `tokens.css`, fonts via `next/font`, reset BEM-friendly dans `globals.css`, structure dossier `components/` avec un Header simple en place.
2. **Hero** — `SectionHero` + `Header` + `EurovisionLogo` + `CtaButton primary`. La page n'a que le hero, le reste reste l'ancien composant (en bas, transitoirement).
3. **Logs haut** — `SectionLogsTop` avec `PanelInscription` + `PanelRetrieve`. Branche le `register()` et l'accès code sur les nouveaux composants. Désactive les anciens.
4. **Leaderboard** — `SectionLeaderboard` avec `Flag`, `CountryItem`, `FoodMomentItem`. Ajoute `snacks` à `DinnerSlot`. Affiche les 35 pays + état idle.
5. **Logs bas** — `SectionLogsBottom` avec `PanelResult` (ChefCommand + Flag + YouTube placeholder) et `PanelRecipes` avec `RecipeLevel` × 3 et `RecipeItem`.
6. **Animation roulette** — implémente la machine `idle/spinning/revealed`, le tick aléatoire avec ralentissement, et le scrollTo avec amorces.
7. **Polish** — gradient hero, texture noise, micro-anims (hover scale, focus-visible eurovision-cyan ring), responsive < 1280px (single-column fallback), clean-up de l'ancien `eurovision-roulette.tsx` et du gros `globals.css`.

À chaque étape, `npm run build` doit passer et l'app doit rester utilisable end-to-end (un invité peut s'inscrire, recevoir un code, le retrouver).

---

## 8. Hors scope / questions à trancher après review

Volontairement non décidés ici, à confirmer avant ou pendant l'implémentation :

- **Mode admin (PIN 1974)** : la maquette ne montre pas explicitement le panel admin (révéler/cacher tirages, copier codes, reroll, supprimer). On garde un mode admin caché ?  Probablement le faire glisser dans le `PanelResult` côté CTAs (les 2 CTA visibles peuvent être : "Copier les codes" et "Cacher/Révéler" en mode admin, sinon "Ouvrir mon profil" et "Partager" pour un invité standard).
- **YouTube** : on mock un placeholder thumbnail au début ; intégration réelle (ID par pays) en passe 2.
- **Slot `Snacks`** : la pondération à utiliser dans `expectedDistribution` n'est pas définie. Suggestion par défaut : `weights = { apero: 2, entree: 2, plat: 3, dessert: 1, snacks: 1 }` total 9 (préserve l'algo courant).
- **Texture noise** : générée maison (PNG 200×200 tilable) ou récupérée du repo Figma si tu l'as exportée.
- **Gradient hero** : exact gradient à dériver d'un screenshot pixel-perfect. La spec donne une approximation à affiner.
- **Responsive** : la maquette est desktop 1920. Sous 1280px on collapse en single-column ; sous 768px (mobile) on simplifie (1-col grid pays, sidebar moments en pills horizontales scrollables). Détails à confirmer.

---

## 9. Critères d'acceptation

L'intégration est considérée terminée quand :

1. L'app affiche les 4 sections empilées de la maquette à 1920×1080+, fidèle à 95% de la DA (gradient, typographie, espacements, état des items).
2. La fold à 928px tombe pile en fin de Hero, l'amorce de Section/Logs (haut) est visible.
3. Cliquer "Lancer la roulette" depuis le Hero ou depuis Panel/Inscription déclenche : 5s d'animation visible (cycle aléatoire dans la grille pays + sidebar moments), puis lock du résultat, puis `scrollTo` qui centre le leaderboard en montrant les amorces des sections au-dessus et en-dessous.
4. Le rendu utilise des CSS Modules avec naming BEM, pas de classe globale en dehors de `tokens.css` et reset.
5. Toutes les valeurs d'espacement et de typo sont reliées aux variables CSS (pas de `padding: 13px;` magique).
6. Les 35 drapeaux Eurovision rendus correctement depuis `lipis/flag-icons`.
7. `npm run build` et `npm run typecheck` passent sans warning bloquant.
8. La logique de tirage (pondération, code unique, persistance Supabase/localStorage) est inchangée et fonctionne comme avant.
9. **WCAG 2.2 AA respecté** sur la totalité de l'interface : contrastes texte ≥ 4.5:1, large text et UI non-textuel ≥ 3:1, focus visible avec indicateur ≥ 3:1, support `prefers-reduced-motion`, annonces aria-live pendant le spin (cf. §11).

---

## 10. Risques & mitigations

| Risque | Probabilité | Mitigation |
|---|---|---|
| Pixel-perfect impossible sans accès supplémentaire à Figma (rate limit View seat atteinte sur l'org Bedrock) | élevée | Travailler depuis screenshots + design context déjà récupérés ; tweaks iteratifs ensuite avec toi en HMR |
| Animation 5s spinning ressentie comme trop longue si layout lourd | moyenne | Throttle à 60fps via `requestAnimationFrame`, pas de re-render React de la grille à chaque tick (utiliser `data-attribute` + CSS) |
| Les 35 SVG drapeaux ajoutés au repo gonflent le bundle | faible | SVGs servis depuis `/public`, pas de bundling JS, lazy load OK |
| Le nouveau slot `snacks` casse les tirages déjà persistés en Supabase | faible | Slot ajouté côté types/data : les tirages existants gardent leurs valeurs `apero/entree/plat/dessert`, le nouveau slot est juste possible pour les tirages futurs. Aucune migration nécessaire. |
| Régression sur le mode admin pendant le refactor | moyenne | Étape 7 (polish) inclut un test manuel admin avec PIN 1974 : reveal, copy codes, reroll, supprimer |

---

## 11. Conformité WCAG 2.2 AA

L'app cible la conformité **WCAG 2.2 AA** comme baseline (et AAA dès que c'est gratuit). Les points spécifiques au design integration :

### 11.1 Audit contraste de la palette proposée (SC 1.4.3, 1.4.11)

| Pair foreground / background | Ratio | Usage | Norme |
|---|---|---|---|
| `#fefefe` sur `#050b30` (bg primary) | ~17.8:1 | Titre Hero, body, header logo | ✅ AAA |
| `#fefefe` sur `#0a23be` (eurovision-blue) | ~10.2:1 | Country/Item default state, FoodMoment default state | ✅ AAA |
| `#181818` sur `#fefefe` | ~16.0:1 | Texte panels Logs, country/moment selected | ✅ AAA |
| `#626262` sur `#fefefe` (placeholder, body italic help) | ~5.8:1 | Placeholder inputs, "Ce code permet…" | ✅ AA texte normal (échoue AAA — acceptable) |
| `#626262` sur `#eaeaea` (placeholder code disabled) | ~4.9:1 | Code "--- --- ---" dans input retrieve | ✅ AA texte normal |
| `#00c7f1` sur `#050b30` | ~10:1 | Pill incentive cyan, focus ring sur fond sombre | ✅ AAA |
| `#0a23be` sur `#fefefe` | ~10.2:1 | Focus ring sur surfaces claires, badge check selected | ✅ AAA |
| `#8b8b8b` (border input) sur `#fefefe` | ~3.25:1 | Bordure 1px input | ✅ AA non-texte |
| `#ebebeb` (bevel CTA) sur `#fefefe` | ~1.2:1 | **Décoratif uniquement** — n'est pas le seul indicateur d'état | ⚠️ Décoratif — voir §11.3 |

**Décision** : la palette passe AA partout sauf l'effet bevel décoratif des CTAs. Comme ce bevel est purement esthétique et que l'identité du bouton est portée par l'icône + le label + la zone cliquable + le focus ring, c'est acceptable. On documente en commentaire CSS que le bevel border ne porte aucune info essentielle.

### 11.2 Focus visible (SC 2.4.7) et focus appearance (SC 2.4.13, nouveau en 2.2)

Tous les éléments interactifs (buttons, links, inputs, country items focusables au clavier) reçoivent un anneau de focus :

```css
:root {
  --color-focus-ring-on-light: #0a23be;   /* eurovision-blue, 10.2:1 sur blanc */
  --color-focus-ring-on-dark: #00c7f1;    /* eurovision-cyan, 10:1 sur navy */
  --focus-ring-width: 3px;
  --focus-ring-offset: 2px;
}

.cta-button:focus-visible,
.country-item:focus-visible,
.food-moment-item:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring-on-light);
  outline-offset: var(--focus-ring-offset);
}

/* sur surfaces sombres, on bascule la couleur de l'anneau */
.section-hero .cta-button:focus-visible {
  outline-color: var(--color-focus-ring-on-dark);
}
```

L'anneau est de 3px (au-dessus du minimum 2 CSS px de SC 2.4.13) avec un offset 2px qui crée un halo blanc/sombre garantissant le 3:1 contre les couleurs adjacentes même sur des fonds bruyants (gradient hero, noise).

### 11.3 Indicateurs d'état non basés sur la couleur seule (SC 1.4.1)

L'état "selected" d'un Country/Item ou d'un FoodMoment/Item ne repose **pas uniquement** sur le changement de couleur (blanc avec check vs bleu sans check). On ajoute :
- Une icône `<CheckIcon>` (visuelle + `aria-hidden="true"`)
- Un attribut `aria-selected="true"` sur l'élément
- Un `aria-label` ou texte SR-only "Pays sélectionné: France" pour le résultat

L'état "spinning" / "highlight" pendant la roulette ne repose pas uniquement sur la couleur non plus : le scale 1.04 + le ring eurovision-cyan + l'annonce live (cf. §11.5) donnent un signal redondant.

### 11.4 Mouvement et animations (SC 2.3.3 enhanced, 2.2.2)

L'animation de roulette de 5s est longue. On respecte `prefers-reduced-motion` :

```css
@media (prefers-reduced-motion: reduce) {
  .country-item--spinning,
  .food-moment-item--spinning {
    animation: none;
    transform: none;
  }
}
```

En mode reduced-motion, on remplace l'animation visible par :
- Un texte SR-only "Tirage en cours..." (`aria-live="polite"`)
- Un délai de 800ms (au lieu de 5s) pour donner du suspense sans surcharge visuelle
- Le pays + moment apparaissent directement en état `selected`

### 11.5 Annonces aux lecteurs d'écran (SC 4.1.3)

Une région `aria-live="polite"` invisible visuellement est ajoutée en bas du document :

```html
<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
  {liveMessage}
</div>
```

Messages diffusés :
- Au clic sur "Lancer la roulette" : "Tirage en cours, sélection aléatoire pendant 5 secondes."
- À la fin du spin : "Résultat : France, plat principal. Voir les recettes ci-dessous."
- Au scrollTo : pas d'annonce supplémentaire (le focus management peut prendre le relais).

### 11.6 Navigation clavier (SC 2.1.1, 2.4.3)

Ordre du tab :
1. Logo (lien vers home, optionnel)
2. Pill "X participants en lice" (non-interactif → tabindex="-1" ou pas de tabindex)
3. Bouton settings header
4. CTA "Lancer la roulette" hero
5. Input prénom (Panel Inscription)
6. CTA "Lancer la roulette" panel inscription
7. Input code (Panel Retrieve)
8. CTA "Retrouver ses informations"
9. (En état revealed) CTAs du Panel Result
10. (En état revealed) Liens "Voir la recette" du Panel Recipes

Les Country/Items et FoodMoment/Items ne sont **pas** focusables au clavier par défaut (ils ne sont pas interactifs en idle/spinning, juste visuels). En mode admin uniquement, les Country/Items peuvent devenir focusables si on ajoute une feature "reroll par item".

### 11.7 Tailles cibles tactiles (SC 2.5.8, nouveau en 2.2)

WCAG 2.2 introduit SC 2.5.8 (Target Size Minimum, AA) : zones cliquables ≥ 24×24 CSS px.

Audit :
- CTA hero : 299×72 ✅
- CTA panels : ~209×52 et ~284×52 ✅
- Bouton settings header : 48×48 ✅
- Input height : 40px ⚠️ — la zone cliquable du label/wrapper doit englober au moins 44×44 pour confort mobile (recommandation Apple), ou 24×24 strict WCAG → OK strict, à étendre à 44 si possible
- Country/Item : 464×56 ✅ (si rendu interactif)
- FoodMoment/Item : 328×48 ✅
- Recipe item CTA : 184×44 ✅

Tout passe SC 2.5.8 strict.

### 11.8 Outillage de vérification

Pendant l'implémentation, on intègre :
- `axe-core` ou `@axe-core/react` en mode dev pour audit auto en console
- `eslint-plugin-jsx-a11y` (déjà recommandé par Next.js, vérifier qu'il est actif)
- Test manuel au clavier (Tab, Shift+Tab, Enter, Escape) à chaque palier
- Test screen-reader (VoiceOver macOS) au moins une fois en fin de palier 6 (animation)
- Lighthouse CI sur le build de production avec score Accessibility ≥ 95

## 12. Annexes

### 11.1 Mapping calques Figma → composants React

| Calque Figma | Composant React | Module CSS |
|---|---|---|
| `01. Start` | `<EurovisionRoulette>` | `eurovision-roulette.module.css` |
| `Section/Hero` | `<SectionHero>` | `section-hero.module.css` |
| `Header` (dans Hero) | `<Header>` | `header.module.css` |
| `Eurovision/Logo` | `<EurovisionLogo>` | `eurovision-logo.module.css` |
| `Incentive/UsersSubscribed` | `<Header>::__incentive` | (idem) |
| `CTA/Button` (différentes tailles) | `<CtaButton>` | `cta-button.module.css` |
| `Section/Logs` (haut) | `<SectionLogsTop>` | `section-logs-top.module.css` |
| `Panel/Log` (gauche, haut) | `<PanelInscription>` | `panel-inscription.module.css` |
| `Panel/Log` (droite, haut) | `<PanelRetrieve>` | `panel-retrieve.module.css` |
| `Section/Input`, `Section/Code` | sub-éléments des panels | (dans panel CSS) |
| `Input/Code` | `<CodeInput>` ou inline span style mono | (idem) |
| `Section/Leaderboard` | `<SectionLeaderboard>` | `section-leaderboard.module.css` |
| `Leaderboard/Countries` | `<CountriesGrid>` | (idem) |
| `Country/Item` | `<CountryItem>` | `country-item.module.css` |
| `CountryCheck` | `<CountryItem>::__check` | (idem) |
| `Leaderboard/Moment` | `<MomentsList>` | (idem section) |
| `FoodMoment/Item` | `<FoodMomentItem>` | `food-moment-item.module.css` |
| `Section/Logs` (bas) | `<SectionLogsBottom>` | `section-logs-bottom.module.css` |
| `Panel/Log` (gauche, bas) | `<PanelResult>` | `panel-result.module.css` |
| `Section/Youtube` | `<YoutubeEmbed>` ou `<PanelResult>::__video` | (idem) |
| `Panel/Recipies` | `<PanelRecipes>` | `panel-recipes.module.css` |
| `Subheader/Level` | `<RecipeLevel>` | `recipe-level.module.css` |
| `Recipie/Item` | `<RecipeItem>` | `recipe-item.module.css` |

### 11.2 Liens utiles

- Figma : https://www.figma.com/design/3wN1dlbNC0ftKGOFWFOoA2/Untitled?node-id=0-1
- Drapeaux : https://github.com/lipis/flag-icons/tree/main/flags/4x3
- Eurovision 2026 Vienne (35 participants) : référencés dans `src/lib/data.ts`
