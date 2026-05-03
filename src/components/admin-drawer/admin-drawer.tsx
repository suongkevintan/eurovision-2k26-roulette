"use client";

import { useEffect, useRef, useState } from "react";
import { Clipboard, Eye, EyeOff, RefreshCw, Shuffle, Sparkles, Trash2, Trash, X } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { countries } from "@/lib/data";
import type { Guest } from "@/lib/types";

const ADMIN_PIN = "1974";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLE_PRESERVED = new Set([" ", "·", "-", "."]);
const SCRAMBLE_TICK_MS = 80;

function noiseLike(source: string) {
  return Array.from(source, (ch) =>
    SCRAMBLE_PRESERVED.has(ch)
      ? ch
      : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
  ).join("");
}

/**
 * Continuously scrambles a single random character of `text` while `revealed`
 * is false, then restores the real value when toggled. Keeps the original
 * length so the row layout doesn't reflow when admin flips the reveal switch.
 */
function ScrambledDraw({ text, revealed }: { text: string; revealed: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (revealed) {
      setDisplay(text);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setDisplay(noiseLike(text));
    if (prefersReducedMotion) return;

    const eligible: number[] = [];
    Array.from(text).forEach((ch, i) => {
      if (!SCRAMBLE_PRESERVED.has(ch)) eligible.push(i);
    });
    if (!eligible.length) return;

    const id = window.setInterval(() => {
      setDisplay((current) => {
        const next = Array.from(current);
        const idx = eligible[Math.floor(Math.random() * eligible.length)];
        next[idx] = SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        return next.join("");
      });
    }, SCRAMBLE_TICK_MS);

    return () => window.clearInterval(id);
  }, [text, revealed]);

  return (
    <>
      <span aria-hidden={!revealed}>{display}</span>
      {!revealed ? (
        <span className="admin-drawer__sr-only">Tirage masqué</span>
      ) : null}
    </>
  );
}

type AdminDrawerProps = {
  open: boolean;
  guests: Guest[];
  revealDraws: boolean;
  onClose: () => void;
  onUnlock?: () => void;
  onToggleReveal: () => void;
  onCopyCodes: () => void;
  onReroll: (guest: Guest) => void;
  onRerollSlot: (guest: Guest) => void;
  onRemove: (guest: Guest) => void;
  onClearAll: () => void;
};

export function AdminDrawer({
  open,
  guests,
  revealDraws,
  onClose,
  onUnlock,
  onToggleReveal,
  onCopyCodes,
  onReroll,
  onRerollSlot,
  onRemove,
  onClearAll
}: AdminDrawerProps) {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) {
      setPin("");
      setUnlocked(false);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeButtonRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={"admin-drawer"}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drawer-title"
    >
      <button
        type="button"
        className={"admin-drawer__backdrop"}
        onClick={onClose}
        aria-label="Fermer le panneau admin (cliquer en dehors)"
      />
      <div className={"admin-drawer__panel"}>
        <span className={"admin-drawer__glow"} aria-hidden="true" />
        <header className={"admin-drawer__header"}>
          <div className={"admin-drawer__heading"}>
            <h2 id="admin-drawer-title" className={"admin-drawer__title"}>
              Panneau admin
            </h2>
            <p className={"admin-drawer__subtitle"}>
              Espace réservé aux organisateur·ices du tirage Eurovision.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={"admin-drawer__close"}
            aria-label="Fermer le panneau admin"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {!unlocked ? (
          <form
            className={"admin-drawer__pin-form"}
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === ADMIN_PIN) {
                setUnlocked(true);
                onUnlock?.();
              } else {
                setPin("");
              }
            }}
          >
            <label htmlFor="admin-pin" className={"admin-drawer__label"}>
              PIN admin
            </label>
            <input
              id="admin-pin"
              type="password"
              inputMode="numeric"
              maxLength={4}
              autoComplete="off"
              className={"admin-drawer__input"}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              autoFocus
              aria-describedby="admin-pin-hint"
            />
            <p id="admin-pin-hint" className={"admin-drawer__pin-hint"}>
              <Sparkles size={14} aria-hidden="true" />
              Entrez le code PIN à 4 chiffres pour gérer les participant·es.
            </p>
            <CtaButton variant="panel" type="submit" className={"admin-drawer__cta"}>
              Déverrouiller
            </CtaButton>
          </form>
        ) : (
          <div className={"admin-drawer__content"}>
            <div className={"admin-drawer__actions"}>
              <CtaButton
                variant="panel"
                className={"admin-drawer__cta"}
                icon={revealDraws ? <EyeOff /> : <Eye />}
                onClick={onToggleReveal}
              >
                {revealDraws ? "Cacher tirages" : "Révéler tirages"}
              </CtaButton>
              <CtaButton
                variant="panel"
                className={"admin-drawer__cta"}
                icon={<Clipboard />}
                onClick={onCopyCodes}
                disabled={!guests.length}
              >
                Copier codes
              </CtaButton>
              <CtaButton
                variant="panel"
                className={"admin-drawer__cta admin-drawer__cta--danger"}
                icon={<Trash />}
                onClick={() => {
                  if (window.confirm("Supprimer tous les participants ?")) onClearAll();
                }}
                disabled={!guests.length}
              >
                Tout supprimer
              </CtaButton>
            </div>
            <ul className={"admin-drawer__list"}>
              {guests.map((guest) => {
                const country = countries.find((c) => c.code === guest.countryCode);
                return (
                  <li key={guest.id} className={"admin-drawer__row"}>
                    <div className={"admin-drawer__row-info"}>
                      <strong>{guest.name}</strong>
                      <span>{guest.code}</span>
                      <span className={revealDraws ? "" : "admin-drawer__row-draw--masked"}>
                        <ScrambledDraw
                          text={`${country?.name ?? "?"} · ${guest.dinnerSlot}`}
                          revealed={revealDraws}
                        />
                      </span>
                    </div>
                    <button
                      type="button"
                      className={"admin-drawer__row-action"}
                      onClick={() => onRerollSlot(guest)}
                      aria-label={`Réajuster le moment de ${guest.name}`}
                      title="Changer le moment (pays conservé)"
                    >
                      <Shuffle size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={"admin-drawer__row-action"}
                      onClick={() => onReroll(guest)}
                      aria-label={`Retirer complètement ${guest.name}`}
                      title="Reroll complet (pays + moment)"
                    >
                      <RefreshCw size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${"admin-drawer__row-action"} ${"admin-drawer__row-action--danger"}`}
                      onClick={() => onRemove(guest)}
                      aria-label={`Supprimer ${guest.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
              {!guests.length ? (
                <li className={"admin-drawer__empty"}>Aucun participant pour l&apos;instant.</li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
