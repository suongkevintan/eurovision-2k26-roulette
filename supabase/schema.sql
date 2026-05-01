-- Eurovision Roulette 2026 — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL Editor → New query).
-- Safe to re-run: all statements are idempotent.

-- Drop legacy tables if they exist (from the event-based schema v1).
drop table if exists roulette_guests cascade;
drop table if exists roulette_events cascade;

-- Single guests table — no event abstraction needed for a one-off party.
create table roulette_guests (
  id           uuid        primary key,
  name         text        not null,
  code         text        not null unique,
  dinner_slot  text        not null,
  country_code text        not null,
  shopping_done boolean   not null default false,
  created_at   timestamptz not null default now()
);

alter table roulette_guests enable row level security;

-- Anonymous users (the app) can read, insert, update, and delete guests.
create policy "guests: public select" on roulette_guests for select using (true);
create policy "guests: public insert" on roulette_guests for insert with check (true);
create policy "guests: public update" on roulette_guests for update using (true);
create policy "guests: public delete" on roulette_guests for delete using (true);
