"use client";

import { Clipboard, Eye, EyeOff, KeyRound, RefreshCw, Search, ShoppingBasket, Sparkles, Trash2, Trophy, UserPlus } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { countries, dinnerSlots, sourceNote } from "@/lib/data";
import { countBySlot, createGuest, expectedDistribution, pickCountry, pickDinnerSlot, slotLabel } from "@/lib/roulette";
import { hasSupabase, loadState, persistState } from "@/lib/storage";
import type { Difficulty, DinnerSlot, Guest, RouletteState } from "@/lib/types";

const adminPin = "1974";

export function EurovisionRoulette() {
  const [state, setState] = useState<RouletteState>({ revealDraws: false, guests: [] });
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [spinning, setSpinning] = useState<"slot" | "country" | null>(null);
  const [status, setStatus] = useState("Chargement de la table...");

  useEffect(() => {
    loadState().then((loaded) => {
      setState(loaded);
      setStatus(hasSupabase ? "Synchronisé avec Supabase" : "Mode local prêt");
    });
  }, []);

  useEffect(() => {
    persistState(state).catch(() => setStatus("Sauvegarde locale active, Supabase indisponible"));
  }, [state]);

  const selectedGuest = useMemo(
    () => state.guests.find((guest) => guest.code.toUpperCase() === (selectedCode ?? accessCode).toUpperCase()),
    [accessCode, selectedCode, state.guests]
  );
  const isAdmin = adminCode === adminPin;
  const slotCounts = countBySlot(state.guests);
  const targets = expectedDistribution(Math.max(9, state.guests.length));
  const assignedCountries = new Set(state.guests.map((guest) => guest.countryCode));
  const shopping = selectedGuest ? countries.find((country) => country.code === selectedGuest.countryCode)?.dishes[selectedGuest.dinnerSlot].flatMap((dish) => dish.shopping) ?? [] : [];

  function update(next: RouletteState) {
    setState(next);
  }

  function register(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSpinning("slot");
    window.setTimeout(() => setSpinning("country"), 650);
    window.setTimeout(() => {
      const guest = createGuest(trimmed, state.guests);
      update({ ...state, guests: [...state.guests, guest] });
      setAccessCode(guest.code);
      setSelectedCode(guest.code);
      setName("");
      setSpinning(null);
      setStatus(`${trimmed} a reçu son code ${guest.code}`);
    }, 1350);
  }

  function reroll(guest: Guest) {
    const others = state.guests.filter((item) => item.id !== guest.id);
    const nextGuest = {
      ...guest,
      dinnerSlot: pickDinnerSlot(others, state.guests.length),
      countryCode: pickCountry(others)
    };
    update({ ...state, guests: state.guests.map((item) => (item.id === guest.id ? nextGuest : item)) });
  }

  function toggleShopping(guest: Guest) {
    update({ ...state, guests: state.guests.map((item) => (item.id === guest.id ? { ...item, shoppingDone: !item.shoppingDone } : item)) });
  }

  function removeGuest(guest: Guest) {
    const confirmed = window.confirm(`Supprimer ${guest.name} de l'Eurovision Roulette ? Son code ne fonctionnera plus.`);
    if (!confirmed) return;
    update({ ...state, guests: state.guests.filter((item) => item.id !== guest.id) });
    if (selectedCode === guest.code) setSelectedCode(null);
    if (accessCode.toUpperCase() === guest.code.toUpperCase()) setAccessCode("");
    setStatus(`${guest.name} a été supprimé`);
  }

  function toggleReveal() {
    update({ ...state, revealDraws: !state.revealDraws });
  }

  function copyCodes() {
    const text = state.guests.map((guest) => `${guest.name}: ${guest.code}`).join("\n");
    navigator.clipboard.writeText(text);
    setStatus("Codes copiés dans le presse-papiers");
  }

  return (
    <main>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Vienna 2026 · 16 mai · dîner participatif</p>
          <h1>Eurovision Roulette</h1>
          <p>
            Chaque invité tire un moment du dîner et un pays participant. L&apos;app garde l&apos;équilibre du menu, protège les tirages et prépare la feuille de route culinaire.
          </p>
        </div>
        <div className="hero-panel">
          <div>
            <span className="signal">70</span>
            <span>ans de concours</span>
          </div>
          <div>
            <span className="signal">{state.guests.length}</span>
            <span>participants inscrits</span>
          </div>
          <div>
            <span className="signal">{countries.length}</span>
            <span>pays dans la roulette</span>
          </div>
        </div>
      </section>

      <section className="workspace">
        <div className="register band">
          <div className="section-title">
            <UserPlus size={20} />
            <h2>Inscription</h2>
          </div>
          <form onSubmit={register} className="join-form">
            <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Prénom ou nom de scène" aria-label="Nom" />
            <button type="submit">
              <Sparkles size={18} />
              Tourner
            </button>
          </form>
          <div className="roulette-grids">
            <Grid title="Moment du dîner" spinning={spinning === "slot"} items={Object.entries(dinnerSlots).map(([key, item]) => ({ key, label: item.label, color: item.tone }))} />
            <Grid title="Pays Eurovision" spinning={spinning === "country"} items={countries.slice(0, 24).map((country) => ({ key: country.code, label: country.name, color: country.color }))} />
          </div>
          <p className="status">{status}</p>
        </div>

        <div className="candidate band">
          <div className="section-title">
            <KeyRound size={20} />
            <h2>Accès candidat</h2>
          </div>
          <div className="code-row">
            <input value={accessCode} onChange={(event) => setAccessCode(event.target.value)} placeholder="Code personnel ex: MAR-A1B2" aria-label="Code candidat" />
            <button type="button" onClick={() => setSelectedCode(accessCode)}>
              <Search size={18} />
              Ouvrir
            </button>
          </div>
          {selectedGuest ? <CandidateCard guest={selectedGuest} reveal={state.revealDraws || selectedCode === selectedGuest.code} shopping={shopping} onShopping={() => toggleShopping(selectedGuest)} /> : <EmptyCandidate />}
        </div>
      </section>

      <section className="dashboard">
        <div className="band balance">
          <div className="section-title">
            <Trophy size={20} />
            <h2>Équilibre du dîner</h2>
          </div>
          <div className="balance-grid">
            {(Object.keys(dinnerSlots) as DinnerSlot[]).map((slot) => (
              <div className="balance-item" key={slot}>
                <span>{dinnerSlots[slot].label}</span>
                <strong>
                  {slotCounts[slot]} / {targets[slot]}
                </strong>
                <div className="bar">
                  <i style={{ width: `${Math.min(100, (slotCounts[slot] / Math.max(1, targets[slot])) * 100)}%`, background: dinnerSlots[slot].tone }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="band admin">
          <div className="section-title">
            <Eye size={20} />
            <h2>Panneau admin</h2>
          </div>
          <div className="code-row">
            <input value={adminCode} onChange={(event) => setAdminCode(event.target.value)} placeholder="PIN admin" type="password" aria-label="PIN admin" />
            <button type="button" onClick={toggleReveal} disabled={!isAdmin}>
              {state.revealDraws ? <EyeOff size={18} /> : <Eye size={18} />}
              {state.revealDraws ? "Cacher" : "Révéler"}
            </button>
            <button type="button" onClick={copyCodes} disabled={!isAdmin || !state.guests.length}>
              <Clipboard size={18} />
              Codes
            </button>
          </div>
          <div className="guest-list">
            {state.guests.map((guest) => {
              const country = countries.find((item) => item.code === guest.countryCode)!;
              return (
                <article className="guest-row" key={guest.id}>
                  <div>
                    <strong>{guest.name}</strong>
                    <span>{guest.code}</span>
                  </div>
                  <div className="assignment">
                    <span>{slotLabel(guest.dinnerSlot)}</span>
                    <span>{state.revealDraws || isAdmin ? `${country.name} · ${country.artist}` : "Tirage caché"}</span>
                  </div>
                  <button type="button" disabled={!isAdmin} onClick={() => reroll(guest)} aria-label={`Reroll ${guest.name}`}>
                    <RefreshCw size={17} />
                  </button>
                  <button type="button" className="danger" disabled={!isAdmin} onClick={() => removeGuest(guest)} aria-label={`Supprimer ${guest.name}`}>
                    <Trash2 size={17} />
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="band country-board">
        <div className="section-title">
          <ShoppingBasket size={20} />
          <h2>Pays disponibles</h2>
        </div>
        <div className="country-grid">
          {countries.map((country) => (
            <div className={assignedCountries.has(country.code) ? "country used" : "country"} key={country.code}>
              <span style={{ background: country.color }}>{country.flag}</span>
              <strong>{country.name}</strong>
              <small>{country.artist}</small>
            </div>
          ))}
        </div>
        <p className="source">{sourceNote}</p>
      </section>
    </main>
  );
}

function Grid({ title, spinning, items }: { title: string; spinning: boolean; items: { key: string; label: string; color: string }[] }) {
  return (
    <div className={spinning ? "grid-box spinning" : "grid-box"}>
      <h3>{title}</h3>
      <div className="tile-grid">
        {items.map((item, index) => (
          <span key={item.key} style={{ "--tile-color": item.color, animationDelay: `${index * 24}ms` } as React.CSSProperties}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function CandidateCard({ guest, reveal, shopping, onShopping }: { guest: Guest; reveal: boolean; shopping: string[]; onShopping: () => void }) {
  const country = countries.find((item) => item.code === guest.countryCode)!;
  const dishes = country.dishes[guest.dinnerSlot];
  const byDifficulty = (["Facile", "Moyen", "Challenge"] as Difficulty[]).map((difficulty) => ({
    difficulty,
    dishes: dishes.filter((dish) => dish.difficulty === difficulty)
  }));
  return (
    <article className="candidate-card">
      <div className="ticket-top">
        <span>{guest.code}</span>
        <strong>{guest.name}</strong>
      </div>
      {reveal ? (
        <>
          <div className="assignment-hero" style={{ "--accent": country.color } as React.CSSProperties}>
            <span>{country.flag}</span>
            <div>
              <p>{slotLabel(guest.dinnerSlot)}</p>
              <h3>{country.name}</h3>
              <small>
                {country.artist} · &quot;{country.song}&quot;
              </small>
            </div>
          </div>
          <div className="dish-groups">
            {byDifficulty.map((group) => (
              <section className="dish-group" key={group.difficulty}>
                <h4>{group.difficulty}</h4>
                <div className="dish-list">
                  {group.dishes.map((dish) => (
                    <div key={dish.id} id={dish.recipeUrl.replace("#", "")} className="dish">
                      <a href={dish.recipeUrl}>Fiche rapide</a>
                      <strong>{dish.name}</strong>
                      <p>{dish.story}</p>
                      <div className="recipe-links" aria-label={`Liens fiables pour ${dish.name}`}>
                        {dish.recipeLinks.map((link) => (
                          <a key={link.label} href={link.url} target="_blank" rel="noreferrer" title={link.query}>
                            Recette fiable · {link.label}
                          </a>
                        ))}
                      </div>
                      <details>
                        <summary>Brief cuisine</summary>
                        <b>Base à prévoir</b>
                        <ul>
                          {dish.ingredients.map((ingredient) => (
                            <li key={ingredient}>{ingredient}</li>
                          ))}
                        </ul>
                        <b>Méthode conseillée</b>
                        <ol>
                          {dish.instructions.map((instruction) => (
                            <li key={instruction}>{instruction}</li>
                          ))}
                        </ol>
                      </details>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <div className="shopping-row">
            <button type="button" onClick={onShopping}>
              <ShoppingBasket size={18} />
              {guest.shoppingDone ? "Courses prêtes" : "Marquer les courses"}
            </button>
            <small>{Array.from(new Set(shopping)).slice(0, 5).join(" · ")}</small>
          </div>
        </>
      ) : (
        <div className="hidden-ticket">
          <EyeOff size={32} />
          <p>Ton tirage est enregistré. L&apos;admin peut révéler les pays quand tout le monde est prêt.</p>
        </div>
      )}
    </article>
  );
}

function EmptyCandidate() {
  return (
    <div className="empty">
      <KeyRound size={28} />
      <p>Entre ton code pour retrouver ton pays, ton moment du dîner et les trois recettes.</p>
    </div>
  );
}
