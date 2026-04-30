# Spec — Supabase Persistence for Eurovision Roulette

**Date:** 2026-04-30
**Scope:** Persist draws to Supabase so guests can retrieve their result via code between May 1–16 2026.

---

## Context

The code-based draw system already exists in full:
- `src/lib/storage.ts` has `loadState()` / `persistState()` with Supabase client and graceful localStorage fallback.
- `src/lib/roulette.ts` has `makeCode()` generating codes like `MAR-A1B2`.
- `src/components/panel-retrieve/panel-retrieve.tsx` has the retrieval form.
- `@supabase/supabase-js ^2.49.4` is already installed.

The only missing pieces are: database tables, env vars, and a "code not found" UX feedback.

---

## Database schema

Two tables, created via the Supabase SQL Editor.

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

RLS is disabled on both tables — the app is private and the anon key provides sufficient access control for a single-event dinner party app.

---

## Environment variables

Two vars required, added to `.env.local` (gitignored) and Vercel Project Settings → Environment Variables:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vzccowbabblrbfmyekrt.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | JWT anon key |

`storage.ts` already reads these via `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY`. When absent, the app silently falls back to localStorage.

---

## Data flow

1. **Page load** → `loadState()` fetches `roulette_events` (first row) then all `roulette_guests` for that event. If no event exists yet, one is created automatically.
2. **Guest registers + spins** → `createGuest()` generates id, code, countryCode, dinnerSlot → guest added to state → `persistState()` upserts to `roulette_guests`.
3. **Guest retrieves later** → enters code in `PanelRetrieve` → `handleRetrieve(code)` looks up `state.guests` (loaded from Supabase on mount) → shows result or "not found" message.

---

## UX fix — "code not found"

Currently `handleRetrieve` sets `phase = "revealed"` regardless of whether the code matches a guest. When no match, panels show empty placeholder states with no explanation.

**Fix:** In `eurovision-roulette.tsx`, check `activeGuest` after setting `activeCode`. If null, set a dedicated error state visible to the user (inline message near `PanelRetrieve`).

Implementation: add a `retrieveError` boolean to component state, set to `true` when `handleRetrieve` finds no matching guest, clear on next register/retrieve attempt.

---

## Out of scope

- Row Level Security policies (unnecessary for a private single-event app)
- Supabase Auth
- Realtime subscriptions
- The `sb_publishable_...` key (this is a newer Supabase key format, not needed — the standard JWT anon key is used)
