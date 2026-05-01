"use client";

import { createClient } from "@supabase/supabase-js";
import type { DinnerSlot, Guest, RouletteState } from "./types";

const STORAGE_KEY = "eurovision-roulette-v2";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(url && anon);
export const supabase = hasSupabase ? createClient(url!, anon!) : null;

// ── LocalStorage (offline fallback + revealDraws UI preference) ───────────

function loadLocal(): RouletteState {
  if (typeof window === "undefined") return { revealDraws: false, guests: [] };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RouletteState) : { revealDraws: false, guests: [] };
  } catch {
    return { revealDraws: false, guests: [] };
  }
}

export function persistLocalState(state: RouletteState): void {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

// ── Remote reads ──────────────────────────────────────────────────────────

export async function loadState(): Promise<RouletteState> {
  if (!supabase) return loadLocal();

  const { data: rows, error } = await supabase
    .from("roulette_guests")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[loadState]", error.message);
    return loadLocal();
  }

  return {
    revealDraws: false,
    guests: (rows ?? []).map((row) => ({
      id: row.id as string,
      name: row.name as string,
      code: row.code as string,
      dinnerSlot: row.dinner_slot as DinnerSlot,
      countryCode: row.country_code as string,
      shoppingDone: Boolean(row.shopping_done),
      createdAt: row.created_at as string,
    })),
  };
}

// ── Remote writes (one operation per mutation — no bulk upserts) ──────────

export async function saveGuestToRemote(guest: Guest): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("roulette_guests").upsert({
    id: guest.id,
    name: guest.name,
    code: guest.code,
    dinner_slot: guest.dinnerSlot,
    country_code: guest.countryCode,
    shopping_done: guest.shoppingDone,
    created_at: guest.createdAt,
  });
  if (error) console.error("[saveGuestToRemote]", error.message);
}

export async function updateGuestInRemote(guest: Guest): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("roulette_guests")
    .update({
      dinner_slot: guest.dinnerSlot,
      country_code: guest.countryCode,
      shopping_done: guest.shoppingDone,
    })
    .eq("id", guest.id);
  if (error) console.error("[updateGuestInRemote]", error.message);
}

export async function deleteGuestFromRemote(guestId: string): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("roulette_guests")
    .delete()
    .eq("id", guestId);
  if (error) console.error("[deleteGuestFromRemote]", error.message);
}

export async function clearAllGuestsFromRemote(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from("roulette_guests")
    .delete()
    .not("id", "is", null);
  if (error) console.error("[clearAllGuestsFromRemote]", error.message);
}
