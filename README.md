# Eurovision Roulette

Application Next.js pour organiser une "Eurovision Roulette" autour du dîner du 16 mai 2026.

## Fonctionnalités

- Inscription des participants.
- Tirage en deux grilles: moment du dîner puis pays Eurovision 2026.
- Répartition équilibrée des moments du dîner selon le nombre de personnes.
- Dashboard candidat accessible par code personnel.
- Vue admin avec révélation, reroll, copie des codes et suivi des courses.
- Mode Supabase si configuré, avec fallback localStorage pour prototyper.

## Lancer en local

```bash
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Variables Supabase

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Le schéma de base est dans `supabase/schema.sql`.
# eurovision-roulette
