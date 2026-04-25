"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminDrawer } from "@/components/admin-drawer/admin-drawer";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries, dinnerSlots } from "@/lib/data";
import { createGuest, pickCountry, pickDinnerSlot } from "@/lib/roulette";
import { generateSpinTicks, prefersReducedMotion } from "@/lib/spinning";
import { loadState, persistState } from "@/lib/storage";
import type { DinnerSlot, Guest, RouletteState } from "@/lib/types";
import styles from "./eurovision-roulette.module.css";

type Phase = "idle" | "spinning" | "revealed";
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
  const [adminOpen, setAdminOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [spinningCountryCode, setSpinningCountryCode] = useState<string | null>(null);
  const [spinningSlot, setSpinningSlot] = useState<DinnerSlot | null>(null);
  const [liveMessage, setLiveMessage] = useState("");
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    loadState().then(setState);
    const ids = timeouts.current;
    return () => {
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  useEffect(() => {
    persistState(state).catch(() => undefined);
  }, [state]);

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
    (name: string) => {
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
        setState((prev) => {
          const guest = createGuest(name, prev.guests);
          setActiveCode(guest.code);
          const country = countries.find((c) => c.code === guest.countryCode);
          const slotLabel = dinnerSlots[guest.dinnerSlot].label;
          setLiveMessage(`Résultat : ${country?.name ?? "?"}, ${slotLabel.toLowerCase()}.`);
          return { ...prev, guests: [...prev.guests, guest] };
        });
        setPhase("revealed");
        scrollIntoLeaderboard();
      }, totalMs);
      timeouts.current.push(completeId);
    },
    []
  );

  function handleRegister(name: string) {
    if (phase === "spinning") return;
    startSpin(name);
  }

  function handleRetrieve(code: string) {
    setActiveCode(code);
    setPhase("revealed");
  }

  function handleToggleShopping() {
    if (!activeGuest) return;
    setState((prev) => ({
      ...prev,
      guests: prev.guests.map((g) =>
        g.id === activeGuest.id ? { ...g, shoppingDone: !g.shoppingDone } : g
      )
    }));
  }

  function handleToggleReveal() {
    setState((prev) => ({ ...prev, revealDraws: !prev.revealDraws }));
  }

  function handleOpenAdmin() {
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
  }

  function handleCopyCodes() {
    const text = state.guests.map((g) => `${g.name}: ${g.code}`).join("\n");
    navigator.clipboard.writeText(text);
  }

  return (
    <main className={styles["eurovision-roulette"]}>
      <SectionHero
        participantCount={state.guests.length}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
        onOpenAdmin={handleOpenAdmin}
      />
      <SectionLogsTop
        inscription={
          <PanelInscription
            code={activeGuest?.code ?? null}
            disabled={phase === "spinning"}
            onSubmit={handleRegister}
          />
        }
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode={phase === "revealed" ? activeGuest?.countryCode ?? null : null}
        spinningCountryCode={phase === "spinning" ? spinningCountryCode : null}
        usedCountryCodes={usedCountryCodes}
        selectedSlot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
        spinningSlot={phase === "spinning" ? spinningSlot : null}
      />
      <SectionLogsBottom
        result={
          <PanelResult
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
            guestName={phase === "revealed" ? activeGuest?.name ?? null : null}
            shoppingDone={activeGuest?.shoppingDone ?? false}
            onToggleShopping={handleToggleShopping}
            isAdmin={isAdmin}
            revealed={state.revealDraws}
            onToggleReveal={handleToggleReveal}
          />
        }
        recipes={
          <PanelRecipes
            country={phase === "revealed" ? activeCountry : null}
            slot={phase === "revealed" ? activeGuest?.dinnerSlot ?? null : null}
          />
        }
      />
      <div className={styles["eurovision-roulette__live"]} role="status" aria-live="polite" aria-atomic="true">
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
        onReroll={handleReroll}
        onRemove={handleRemove}
      />
    </main>
  );
}
