"use client";

import { createClient } from "@supabase/supabase-js";
import type { Guest, RouletteState } from "./types";

const KEY = "eurovision-roulette-state-v1";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anon);
export const supabase = hasSupabase ? createClient(url!, anon!) : null;

const initialState: RouletteState = { revealDraws: false, guests: [] };

export function loadLocalState(): RouletteState {
  if (typeof window === "undefined") return initialState;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return initialState;
  try {
    return JSON.parse(raw) as RouletteState;
  } catch {
    return initialState;
  }
}

export function saveLocalState(state: RouletteState) {
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export async function loadState(): Promise<RouletteState> {
  if (!supabase) return loadLocalState();
  // Upsert ensures a single event row even under concurrent first loads.
  // ignoreDuplicates: true is a no-op when the row already exists.
  await supabase
    .from("roulette_events")
    .upsert({ name: "Eurovision Roulette 2026" }, { onConflict: "name", ignoreDuplicates: true });
  const { data: events } = await supabase
    .from("roulette_events")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1);
  const event = events?.[0];
  if (!event) return { revealDraws: false, guests: [] };
  const { data: rows } = await supabase
    .from("roulette_guests")
    .select("*")
    .eq("event_id", event.id)
    .order("created_at", { ascending: true });
  return {
    revealDraws: Boolean(event.reveal_draws),
    guests: (rows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      dinnerSlot: row.dinner_slot,
      countryCode: row.country_code,
      shoppingDone: row.shopping_done,
      createdAt: row.created_at
    }))
  };
}

export async function persistState(state: RouletteState) {
  saveLocalState(state);
  if (!supabase) return;
  const { data: events } = await supabase.from("roulette_events").select("*").limit(1);
  const event = events?.[0];
  if (!event) return;
  await supabase.from("roulette_events").update({ reveal_draws: state.revealDraws }).eq("id", event.id);
  for (const guest of state.guests) {
    await supabase.from("roulette_guests").upsert({
      id: guest.id,
      event_id: event.id,
      name: guest.name,
      code: guest.code,
      dinner_slot: guest.dinnerSlot,
      country_code: guest.countryCode,
      shopping_done: guest.shoppingDone,
      created_at: guest.createdAt
    });
  }
}

export async function deleteGuestFromRemote(guestId: string) {
  if (!supabase) return;
  await supabase.from("roulette_guests").delete().eq("id", guestId);
}

export async function clearAllGuestsFromRemote() {
  if (!supabase) return;
  const { data: events } = await supabase.from("roulette_events").select("id").limit(1);
  const event = events?.[0];
  if (!event) return;
  await supabase.from("roulette_guests").delete().eq("event_id", event.id);
}
