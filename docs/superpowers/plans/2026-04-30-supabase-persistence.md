# Supabase Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Brancher le projet sur Supabase pour persister les tirages et permettre aux invités de retrouver leur résultat via leur code entre le 1er et le 16 mai 2026.

**Architecture:** `storage.ts` possède déjà le client Supabase, `loadState()` et `persistState()` — tout le code de persistence est en place. Le travail se découpe en : (1) infra Supabase (tables SQL + env vars), (2) micro-fix UX "code non trouvé" dans `SectionHero`.

**Tech Stack:** Next.js 15, `@supabase/supabase-js ^2.49.4`, Vercel env vars.

---

## File map

| Action | Fichier | Rôle |
|--------|---------|------|
| Create | `.env.local` | Variables d'environnement locales (gitignored) |
| Modify | `src/components/eurovision-roulette/eurovision-roulette.tsx` | `handleRetrieve` retourne `boolean` |
| Modify | `src/components/section-hero/section-hero.tsx` | État local `retrieveError`, `helperText` et classe error |

---

## Task 1 — Créer les tables Supabase

> Étape manuelle dans le dashboard Supabase.

- [ ] **Step 1 : Ouvrir le SQL Editor**

  Aller sur [https://supabase.com/dashboard/project/vzccowbabblrbfmyekrt/sql/new](https://supabase.com/dashboard/project/vzccowbabblrbfmyekrt/sql/new)

- [ ] **Step 2 : Exécuter le SQL suivant**

```sql
create table roulette_events (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  reveal_draws boolean not null default false,
  created_at   timestamptz not null default now()
);

create table roulette_guests (
  id            uuid primary key,
  event_id      uuid not null references roulette_events(id) on delete cascade,
  name          text not null,
  code          text not null unique,
  dinner_slot   text not null,
  country_code  text not null,
  shopping_done boolean not null default false,
  created_at    timestamptz not null
);
```

- [ ] **Step 3 : Vérifier**

  Dans le panel **Table Editor**, les deux tables `roulette_events` et `roulette_guests` doivent apparaître.

- [ ] **Step 4 : Désactiver RLS sur les deux tables**

  Toujours dans le SQL Editor :

```sql
alter table roulette_events disable row level security;
alter table roulette_guests disable row level security;
```

---

## Task 2 — Env vars locales

**Files:**
- Create: `.env.local`

- [ ] **Step 1 : Créer `.env.local` à la racine du projet**

```env
NEXT_PUBLIC_SUPABASE_URL=https://vzccowbabblrbfmyekrt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Y2Nvd2JhYmJscmJmbXlla3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MzE3MzIsImV4cCI6MjA5MzEwNzczMn0.luWiV0IEaVXym8qIQH-3231EHxO3DD9Tx0bKGW5BS4o
```

- [ ] **Step 2 : Vérifier que `.env.local` est bien dans `.gitignore`**

  Commande :
  ```bash
  grep ".env.local" .gitignore
  ```
  Attendu : `.env.local` apparaît dans la sortie.

- [ ] **Step 3 : Lancer le serveur de dev et vérifier la connexion Supabase**

  ```bash
  npm run dev
  ```

  Ouvrir [http://localhost:3000](http://localhost:3000) → s'inscrire avec un prénom → tirer → vérifier dans le **Table Editor** de Supabase que la ligne apparaît dans `roulette_guests`.

---

## Task 3 — Env vars Vercel

> Étape manuelle dans le dashboard Vercel ou via CLI.

- [ ] **Step 1 : Ajouter les deux variables dans Vercel**

  Option A — Dashboard : **Project Settings → Environment Variables → Add**

  | Name | Value | Environments |
  |------|-------|--------------|
  | `NEXT_PUBLIC_SUPABASE_URL` | `https://vzccowbabblrbfmyekrt.supabase.co` | Production, Preview, Development |
  | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Y2Nvd2JhYmJscmJmbXlla3J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1MzE3MzIsImV4cCI6MjA5MzEwNzczMn0.luWiV0IEaVXym8qIQH-3231EHxO3DD9Tx0bKGW5BS4o` | Production, Preview, Development |

  Option B — CLI :
  ```bash
  vercel env add NEXT_PUBLIC_SUPABASE_URL
  vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
  ```

- [ ] **Step 2 : Redéployer**

  Après ajout des vars, déclencher un nouveau déploiement (push ou via le dashboard Vercel → **Redeploy**).

---

## Task 4 — Fix UX "code non trouvé"

**Files:**
- Modify: `src/components/eurovision-roulette/eurovision-roulette.tsx`
- Modify: `src/components/section-hero/section-hero.tsx`

### 4a — `handleRetrieve` retourne `boolean`

- [ ] **Step 1 : Modifier `handleRetrieve` dans `eurovision-roulette.tsx`**

  Remplacer la fonction existante (ligne ~142) :

  ```typescript
  function handleRetrieve(code: string): boolean {
    const found = state.guests.find(
      (g) => g.code.toUpperCase() === code.toUpperCase()
    ) ?? null;
    if (!found) return false;
    setActiveCode(code);
    setPhase("revealed");
    return true;
  }
  ```

### 4b — Feedback "code non trouvé" dans `SectionHero`

- [ ] **Step 2 : Mettre à jour le type `SectionHeroProps` dans `section-hero.tsx`**

  Remplacer :
  ```typescript
  onRetrieve: (code: string) => void;
  ```
  Par :
  ```typescript
  onRetrieve: (code: string) => boolean;
  ```

- [ ] **Step 3 : Ajouter l'état local `retrieveError`**

  Après la ligne `const [nameError, setNameError] = useState("");` (ligne ~106), ajouter :

  ```typescript
  const [retrieveError, setRetrieveError] = useState("");
  ```

- [ ] **Step 4 : Mettre à jour `handleRetrieveSubmit`**

  Remplacer la fonction existante (ligne ~207) :

  ```typescript
  function handleRetrieveSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = retrieveCode.trim().toUpperCase();
    if (!trimmed) return;
    const found = onRetrieve(trimmed);
    if (found) {
      setMode("register");
      setRetrieveCode("");
      setRetrieveError("");
    } else {
      setRetrieveError("Code non trouvé. Vérifiez votre code et réessayez.");
    }
  }
  ```

- [ ] **Step 5 : Mettre à jour `helperText` pour afficher l'erreur**

  Remplacer (ligne ~173) :
  ```typescript
  const helperText = isRetrieveMode
    ? "Entrez votre code pour retrouver votre tirage au sort"
    : nameError || "Inscrivez-vous pour obtenir votre tirage au sort";
  ```
  Par :
  ```typescript
  const helperText = isRetrieveMode
    ? retrieveError || "Entrez votre code pour retrouver votre tirage au sort"
    : nameError || "Inscrivez-vous pour obtenir votre tirage au sort";
  ```

- [ ] **Step 6 : Appliquer la classe error au helper quand `retrieveError` est défini**

  Remplacer (ligne ~268) :
  ```typescript
  className={`section-hero__input-helper${nameError && !isRetrieveMode ? " section-hero__input-helper--error" : ""}`}
  ```
  Par :
  ```typescript
  className={`section-hero__input-helper${
    (nameError && !isRetrieveMode) || (retrieveError && isRetrieveMode)
      ? " section-hero__input-helper--error"
      : ""
  }`}
  ```

- [ ] **Step 7 : Effacer `retrieveError` quand l'utilisateur modifie l'input**

  Dans le `onChange` de l'input (ligne ~302), remplacer :
  ```typescript
  onChange={(e) => {
    if (isRetrieveMode) setRetrieveCode(e.target.value);
    else {
      setName(e.target.value);
      if (nameError) setNameError("");
    }
  }}
  ```
  Par :
  ```typescript
  onChange={(e) => {
    if (isRetrieveMode) {
      setRetrieveCode(e.target.value);
      if (retrieveError) setRetrieveError("");
    } else {
      setName(e.target.value);
      if (nameError) setNameError("");
    }
  }}
  ```

- [ ] **Step 8 : Vérifier le build**

  ```bash
  npm run build
  ```
  Attendu : `✓ Compiled successfully` sans erreurs TypeScript.

- [ ] **Step 9 : Commit**

  ```bash
  git add src/components/eurovision-roulette/eurovision-roulette.tsx \
          src/components/section-hero/section-hero.tsx
  git commit -m "feat: add 'code not found' feedback on retrieve"
  ```

---

## Task 5 — Vérification end-to-end

- [ ] **Step 1 : Test du flux complet en local**

  1. Ouvrir [http://localhost:3000](http://localhost:3000)
  2. S'inscrire (ex: "Kévin") → noter le code affiché (ex: `KEV-X7Z2`)
  3. Vérifier dans **Supabase → Table Editor → `roulette_guests`** que la ligne est présente
  4. Recharger la page → cliquer sur l'icône clé (mode retrieve) → entrer le code → vérifier que le résultat s'affiche
  5. Entrer un code invalide (ex: `AAA-0000`) → vérifier le message d'erreur rouge "Code non trouvé."

- [ ] **Step 2 : Push et vérifier le déploiement Vercel**

  ```bash
  git push
  ```

  Attendre la fin du build Vercel → tester le même flux sur l'URL de production.
