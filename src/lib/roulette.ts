import { countries, dinnerSlots } from "./data";
import type { DinnerSlot, Guest } from "./types";

const slotOrder: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];

export function makeCode(name: string, pin: string) {
  const stem = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, "X");
  return `${stem}-${pin.toUpperCase()}`;
}

export function expectedDistribution(total: number): Record<DinnerSlot, number> {
  const base = { apero: 0, entree: 0, plat: 0, dessert: 0, snacks: 0 };
  if (total <= 0) return base;
  const perSlot = Math.floor(total / 5);
  const remainder = total % 5;
  for (const slot of slotOrder) base[slot] = perSlot;
  for (let i = 0; i < remainder; i++) base[slotOrder[i]] += 1;
  return base;
}

// Always picks from the least-assigned slot(s), with random tiebreaking.
// Produces a natural cycle of 5: each slot appears once before any repeats.
// Pass `exclude` to guarantee the returned slot differs from the current one.
export function pickDinnerSlot(guests: Guest[], _targetTotal: number, exclude?: DinnerSlot): DinnerSlot {
  const counts = countBySlot(guests);
  const candidates = slotOrder.filter(s => s !== exclude);
  const minCount = Math.min(...candidates.map(s => counts[s]));
  const tied = candidates.filter(s => counts[s] === minCount);
  return tied[Math.floor(Math.random() * tied.length)];
}

export function pickCountry(guests: Guest[]) {
  const used = new Set(guests.map((guest) => guest.countryCode));
  const available = countries.filter((country) => !used.has(country.code));
  const pool = available.length ? available : countries;
  return pool[Math.floor(Math.random() * pool.length)].code;
}

export function createGuest(name: string, pin: string, guests: Guest[]) {
  return {
    id: crypto.randomUUID(),
    name,
    code: makeCode(name, pin),
    dinnerSlot: pickDinnerSlot(guests, guests.length + 1),
    countryCode: pickCountry(guests),
    shoppingDone: false,
    createdAt: new Date().toISOString()
  } satisfies Guest;
}

export function countBySlot(guests: Guest[]) {
  return guests.reduce(
    (acc, guest) => {
      acc[guest.dinnerSlot] += 1;
      return acc;
    },
    { apero: 0, entree: 0, plat: 0, dessert: 0, snacks: 0 } as Record<DinnerSlot, number>
  );
}

export function slotLabel(slot: DinnerSlot) {
  return dinnerSlots[slot].label;
}
