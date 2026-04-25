"use client";

import { useEffect, useMemo, useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries } from "@/lib/data";
import { createGuest } from "@/lib/roulette";
import { hasSupabase, loadState, persistState } from "@/lib/storage";
import type { Guest, RouletteState } from "@/lib/types";
import styles from "./eurovision-roulette.module.css";

const ADMIN_PIN = "1974";

export function EurovisionRoulette() {
  const [state, setState] = useState<RouletteState>({ revealDraws: false, guests: [] });
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [adminPin, setAdminPin] = useState("");
  const [, setStatus] = useState("Chargement...");

  useEffect(() => {
    loadState().then((loaded) => {
      setState(loaded);
      setStatus(hasSupabase ? "Synchronisé avec Supabase" : "Mode local prêt");
    });
  }, []);

  useEffect(() => {
    persistState(state).catch(() => setStatus("Sauvegarde locale active, Supabase indisponible"));
  }, [state]);

  const isAdmin = adminPin === ADMIN_PIN;

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

  function handleRegister(name: string) {
    setState((prev) => {
      const guest = createGuest(name, prev.guests);
      const next: RouletteState = { ...prev, guests: [...prev.guests, guest] };
      setActiveCode(guest.code);
      return next;
    });
  }

  function handleRetrieve(code: string) {
    setActiveCode(code);
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
    const input = window.prompt("PIN admin");
    if (input) setAdminPin(input);
  }

  // Suppress unused var warning — Guest type used in Task 17
  void (null as unknown as Guest);

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
            onSubmit={handleRegister}
          />
        }
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode={activeGuest?.countryCode ?? null}
        spinningCountryCode={null}
        usedCountryCodes={usedCountryCodes}
        selectedSlot={activeGuest?.dinnerSlot ?? null}
        spinningSlot={null}
      />
      <SectionLogsBottom
        result={
          <PanelResult
            country={activeCountry}
            slot={activeGuest?.dinnerSlot ?? null}
            guestName={activeGuest?.name ?? null}
            shoppingDone={activeGuest?.shoppingDone ?? false}
            onToggleShopping={handleToggleShopping}
            isAdmin={isAdmin}
            revealed={state.revealDraws}
            onToggleReveal={handleToggleReveal}
          />
        }
        recipes={
          <PanelRecipes
            country={activeCountry}
            slot={activeGuest?.dinnerSlot ?? null}
          />
        }
      />
    </main>
  );
}
