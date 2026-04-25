"use client";

import { useEffect, useRef, useState } from "react";
import { Clipboard, Eye, EyeOff, RefreshCw, Trash2, X } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { countries } from "@/lib/data";
import type { Guest } from "@/lib/types";
import styles from "./admin-drawer.module.css";

const ADMIN_PIN = "1974";

type AdminDrawerProps = {
  open: boolean;
  guests: Guest[];
  revealDraws: boolean;
  onClose: () => void;
  onUnlock?: () => void;
  onToggleReveal: () => void;
  onCopyCodes: () => void;
  onReroll: (guest: Guest) => void;
  onRemove: (guest: Guest) => void;
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
  onRemove
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
      className={styles["admin-drawer"]}
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-drawer-title"
    >
      <button
        type="button"
        className={styles["admin-drawer__backdrop"]}
        onClick={onClose}
        aria-label="Fermer le panneau admin (cliquer en dehors)"
      />
      <div className={styles["admin-drawer__panel"]}>
        <header className={styles["admin-drawer__header"]}>
          <h2 id="admin-drawer-title" className={styles["admin-drawer__title"]}>
            Panneau admin
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className={styles["admin-drawer__close"]}
            aria-label="Fermer le panneau admin"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>
        {!unlocked ? (
          <form
            className={styles["admin-drawer__pin-form"]}
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
            <label htmlFor="admin-pin" className={styles["admin-drawer__label"]}>
              PIN admin
            </label>
            <input
              id="admin-pin"
              type="password"
              autoComplete="off"
              className={styles["admin-drawer__input"]}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            <CtaButton variant="panel" type="submit">
              Déverrouiller
            </CtaButton>
          </form>
        ) : (
          <div className={styles["admin-drawer__content"]}>
            <div className={styles["admin-drawer__actions"]}>
              <CtaButton
                variant="panel"
                icon={revealDraws ? <EyeOff /> : <Eye />}
                onClick={onToggleReveal}
              >
                {revealDraws ? "Cacher tirages" : "Révéler tirages"}
              </CtaButton>
              <CtaButton
                variant="panel"
                icon={<Clipboard />}
                onClick={onCopyCodes}
                disabled={!guests.length}
              >
                Copier codes
              </CtaButton>
            </div>
            <ul className={styles["admin-drawer__list"]}>
              {guests.map((guest) => {
                const country = countries.find((c) => c.code === guest.countryCode);
                return (
                  <li key={guest.id} className={styles["admin-drawer__row"]}>
                    <div className={styles["admin-drawer__row-info"]}>
                      <strong>{guest.name}</strong>
                      <span>{guest.code}</span>
                      <span>
                        {country?.name ?? "?"} · {guest.dinnerSlot}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={styles["admin-drawer__row-action"]}
                      onClick={() => onReroll(guest)}
                      aria-label={`Reroll ${guest.name}`}
                    >
                      <RefreshCw size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={`${styles["admin-drawer__row-action"]} ${styles["admin-drawer__row-action--danger"]}`}
                      onClick={() => onRemove(guest)}
                      aria-label={`Supprimer ${guest.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
              {!guests.length ? (
                <li className={styles["admin-drawer__empty"]}>Aucun participant pour l&apos;instant.</li>
              ) : null}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
