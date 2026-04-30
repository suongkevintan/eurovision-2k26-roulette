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
  const weights: Record<DinnerSlot, number> = { apero: 2, entree: 2, plat: 3, dessert: 1, snacks: 1 };
  let allocated = 0;
  for (const slot of slotOrder) {
    base[slot] = Math.floor((total * weights[slot]) / 9);
    allocated += base[slot];
  }
  const priority: DinnerSlot[] = ["entree", "apero", "plat", "dessert", "snacks"];
  while (allocated < total) {
    base[priority[allocated % priority.length]] += 1;
    allocated += 1;
  }
  return base;
}

export function pickDinnerSlot(guests: Guest[], targetTotal: number): DinnerSlot {
  const targets = expectedDistribution(Math.max(targetTotal, guests.length + 1));
  const counts = countBySlot(guests);
  return [...slotOrder].sort((a, b) => {
    const remainingA = targets[a] - counts[a];
    const remainingB = targets[b] - counts[b];
    if (remainingA !== remainingB) return remainingB - remainingA;
    return counts[a] - counts[b];
  })[0];
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
