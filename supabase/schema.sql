create table if not exists roulette_events (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Eurovision Roulette 2026',
  reveal_draws boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists roulette_guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references roulette_events(id) on delete cascade,
  name text not null,
  code text not null unique,
  dinner_slot text,
  country_code text,
  shopping_done boolean not null default false,
  created_at timestamptz not null default now()
);

alter table roulette_events enable row level security;
alter table roulette_guests enable row level security;

create policy "public event read" on roulette_events for select using (true);
create policy "public event insert" on roulette_events for insert with check (true);
create policy "public event update" on roulette_events for update using (true);

create policy "public guest read" on roulette_guests for select using (true);
create policy "public guest insert" on roulette_guests for insert with check (true);
create policy "public guest update" on roulette_guests for update using (true);
