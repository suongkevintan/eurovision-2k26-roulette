"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { AdminDrawer } from "@/components/admin-drawer/admin-drawer";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { countries, dinnerSlots } from "@/lib/data";
import { createGuest, makeCode, pickCountry, pickDinnerSlot } from "@/lib/roulette";
import { generateSpinTicks, prefersReducedMotion } from "@/lib/spinning";
import { loadState, persistLocalState, saveGuestToRemote, updateGuestInRemote, deleteGuestFromRemote, clearAllGuestsFromRemote } from "@/lib/storage";
import type { DinnerSlot, Guest, RouletteState } from "@/lib/types";

type Phase = "idle" | "pin_entry" | "code_shown" | "spinning" | "revealed";
const SLOT_ORDER: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];

function scrollIntoLeaderboard() {
  const leaderboard = document.getElementById("section-leaderboard");
  if (!leaderboard) return;
  const rect = leaderboard.getBoundingClientRect();
  const absoluteTop = rect.top + window.scrollY;
  const target = absoluteTop - (window.innerHeight - rect.height) / 2;
  window.scrollTo({ top: Math.max(target, 0), behavior: "smooth" });
}

export function EurovisionRoulette() {
  const [state, setState] = useState<RouletteState>({ revealDraws: false, guests: [] });
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [pendingGuest, setPendingGuest] = useState<Guest | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [spinningCountryCode, setSpinningCountryCode] = useState<string | null>(null);
  const [spinningSlot, setSpinningSlot] = useState<DinnerSlot | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const [leaderboardHidden, setLeaderboardHidden] = useState(false);
  const timeouts = useRef<number[]>([]);
  // Gate: don't persist until the first remote load has completed — avoids
  // overwriting localStorage with the empty initial state before Supabase replies.
  const hasLoaded = useRef(false);

  useEffect(() => {
    const syncFromRemote = (resetReveal = false) => {
      loadState().then((loaded) => {
        hasLoaded.current = true;
        setState((prev) => ({
          ...loaded,
          revealDraws: resetReveal ? false : prev.revealDraws,
        }));
      });
    };

    // Initial load — force reveal off (design intent: always start masked).
    syncFromRemote(true);

    // Re-fetch whenever the tab regains focus or becomes visible: covers the
    // case where another device registered while this tab was in the background.
    const onVisibility = () => { if (!document.hidden) syncFromRemote(); };
    const onFocus = () => syncFromRemote();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);

    const ids = timeouts.current;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  useEffect(() => {
    // Persist only to localStorage (offline cache + revealDraws UI preference).
    // All Supabase writes are handled explicitly per mutation.
    if (!hasLoaded.current) return;
    persistLocalState(state);
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setInterval(() => {
      loadState().then((loaded) => {
        setState((prev) => ({ ...loaded, revealDraws: prev.revealDraws }));
      });
    }, 5000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const locked = phase === "idle" || phase === "pin_entry" || phase === "code_shown";
    document.body.style.overflow = locked ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [phase]);

  useEffect(() => {
    if (phase === "spinning") scrollIntoLeaderboard();
    if (phase === "revealed") {
      const el = document.getElementById("section-logs-bottom");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      const id = window.setTimeout(() => {
        if (window.matchMedia("(max-width: 48rem)").matches) {
          const el = document.getElementById("section-leaderboard");
          const h = el?.offsetHeight ?? 0;
          flushSync(() => setLeaderboardHidden(true));
          window.scrollBy({ top: -h, behavior: "instant" });
        } else {
          setLeaderboardHidden(true);
        }
      }, 1000);
      timeouts.current.push(id);
    } else {
      setLeaderboardHidden(false);
    }
  }, [phase]);

  const isAdmin = adminUnlocked;

  const activeGuest = useMemo(
    () => state.guests.find((g) => g.code.toUpperCase() === activeCode?.toUpperCase()) ?? null,
    [state.guests, activeCode]
  );

  const usedCountryCodes = useMemo(
    () => new Set(state.guests.map((g) => g.countryCode)),
    [state.guests]
  );

  const activeCountry = activeGuest
    ? countries.find((c) => c.code === activeGuest.countryCode) ?? null
    : null;

  const startSpin = useCallback(
    (guest: Guest) => {
      setPhase("spinning");
      setLiveMessage("Tirage en cours, sélection aléatoire pendant 5 secondes.");

      const reducedMotion = prefersReducedMotion();
      const totalMs = reducedMotion ? 800 : 5000;

      if (!reducedMotion) {
        const countryTicks = generateSpinTicks(countries.length, totalMs);
        const slotTicks = generateSpinTicks(SLOT_ORDER.length, totalMs);

        countryTicks.forEach((tick) => {
          const id = window.setTimeout(() => {
            setSpinningCountryCode(countries[tick.index].code);
          }, tick.delay);
          timeouts.current.push(id);
        });

        slotTicks.forEach((tick) => {
          const id = window.setTimeout(() => {
            setSpinningSlot(SLOT_ORDER[tick.index]);
          }, tick.delay + 80);
          timeouts.current.push(id);
        });
      }

      const completeId = window.setTimeout(() => {
        setSpinningCountryCode(null);
        setSpinningSlot(null);
        setState((prev) => ({
          ...prev,
          guests: prev.guests.some((g) => g.id === guest.id)
            ? prev.guests
            : [...prev.guests, guest],
        }));
        setActiveCode(guest.code);
        const country = countries.find((c) => c.code === guest.countryCode);
        const slotLabel = dinnerSlots[guest.dinnerSlot].label;
        setLiveMessage(`Résultat : ${country?.name ?? "?"}, ${slotLabel.toLowerCase()}.`);
        setPhase("revealed");
        scrollIntoLeaderboard();
      }, totalMs);
      timeouts.current.push(completeId);
    },
    []
  );

  function handleRegister(name: string) {
    if (phase === "spinning") return;
    setPendingName(name);
    setPhase("pin_entry");
  }

  function handlePinSubmit(pin: string): boolean {
    if (!pendingName || phase !== "pin_entry") return false;
    const code = makeCode(pendingName, pin);
    if (state.guests.some((g) => g.code.toUpperCase() === code.toUpperCase())) return false;
    const guest = createGuest(pendingName, pin, state.guests);
    setPendingName(null);
    setPendingGuest(guest);
    setActiveCode(guest.code);
    // Add to state immediately so other devices see the new participant via polling
    setState((prev) => ({ ...prev, guests: [...prev.guests, guest] }));
    setPhase("code_shown");
    saveGuestToRemote(guest).catch(() => undefined);
    return true;
  }

  function handleCancelPinEntry() {
    setPendingName(null);
    setPhase("idle");
  }

  function handleLaunchSpin() {
    if (!pendingGuest || phase !== "code_shown") return;
    const guest = pendingGuest;
    setPendingGuest(null);
    startSpin(guest);
  }

  function handleRetrieve(code: string): boolean {
    const found = state.guests.find(
      (g) => g.code.toUpperCase() === code.toUpperCase()
    ) ?? null;
    if (!found) return false;
    setActiveCode(code);
    setPhase("revealed");
    return true;
  }

function handleToggleReveal() {
    setState((prev) => ({ ...prev, revealDraws: !prev.revealDraws }));
  }

  function handleOpenAdmin() {
    // Always reopen the admin drawer with the draws masked, so the host has to
    // explicitly opt back into the reveal mode each time.
    setState((prev) => (prev.revealDraws ? { ...prev, revealDraws: false } : prev));
    setAdminOpen(true);
  }

  function handleReroll(guest: Guest) {
    setState((prev) => {
      const others = prev.guests.filter((g) => g.id !== guest.id);
      const next: Guest = {
        ...guest,
        dinnerSlot: pickDinnerSlot(others, prev.guests.length),
        countryCode: pickCountry(others)
      };
      updateGuestInRemote(next).catch(() => undefined);
      return {
        ...prev,
        guests: prev.guests.map((g) => (g.id === guest.id ? next : g))
      };
    });
  }

  function handleRemove(guest: Guest) {
    if (!window.confirm(`Supprimer ${guest.name} ?`)) return;
    setState((prev) => ({ ...prev, guests: prev.guests.filter((g) => g.id !== guest.id) }));
    if (activeCode === guest.code) setActiveCode(null);
    deleteGuestFromRemote(guest.id).catch(() => undefined);
  }

  function handleCopyCodes() {
    const text = state.guests.map((g) => `${g.name}: ${g.code}`).join("\n");
    navigator.clipboard.writeText(text);
  }

  function handleClearAll() {
    setState((prev) => ({ ...prev, guests: [] }));
    setActiveCode(null);
    setPhase("idle");
    clearAllGuestsFromRemote().catch(() => undefined);
  }

  return (
    <main className={"eurovision-roulette"} data-phase={phase} {...(leaderboardHidden ? { "data-hide-leaderboard": "" } : {})}>
      <SectionHero
        participantCount={state.guests.length}
        phase={phase}
        activeCode={activeCode}
        onRegister={handleRegister}
        onPinSubmit={handlePinSubmit}
        onCancelPinEntry={handleCancelPinEntry}
        onLaunch={handleLaunchSpin}
        onRetrieve={handleRetrieve}
        onOpenAdmin={handleOpenAdmin}
      />
      <SectionLeaderboard
        countries={countries}
        locked={phase === "idle" || phase === "pin_entry" || phase === "code_shown"}
        selectedCountryCode={phase === "revealed" ? activeGuest?.countryCode ?? null : null}
        spinningCountryCode={phase === "spinning" ? spinningCountryCode : null}
        usedCountryCodes={usedCountryCodes}
        selectedSlot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
        spinningSlot={phase === "spinning" ? spinningSlot : null}
        gif={
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/assets/eurovision-jury.gif" alt="Le jury Eurovision délibère" />
        }
      />
      <SectionLogsBottom
        spinning={phase === "spinning"}
        result={
          <PanelResult
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
            guestName={phase === "revealed" ? activeGuest?.name ?? null : null}
          />
        }
        recipes={
          <PanelRecipes
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
          />
        }
      />
      <div className={"eurovision-roulette__live"} role="status" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </div>
      <AdminDrawer
        open={adminOpen}
        guests={state.guests}
        revealDraws={state.revealDraws}
        onClose={() => setAdminOpen(false)}
        onUnlock={() => setAdminUnlocked(true)}
        onToggleReveal={handleToggleReveal}
        onCopyCodes={handleCopyCodes}
        onClearAll={handleClearAll}
        onReroll={handleReroll}
        onRemove={handleRemove}
      />
    </main>
  );
}
