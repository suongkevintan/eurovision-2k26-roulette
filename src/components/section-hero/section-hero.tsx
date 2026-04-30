"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDownRight, CloudDownload, Copy, KeyRound, RotateCcw, Ticket } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { Header } from "@/components/header/header";

type Phase = "idle" | "pin_entry" | "code_shown" | "spinning" | "revealed";
type Mode = "register" | "retrieve";

const SCRAMBLE_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const SCRAMBLED_LETTER_COUNT = 5;
const SCRAMBLE_SPEED_MS = 40;

type SectionHeroProps = {
  participantCount: number;
  phase: Phase;
  activeCode: string | null;
  onRegister: (name: string) => void;
  onPinSubmit: (pin: string) => boolean;
  onCancelPinEntry: () => void;
  onLaunch: () => void;
  onRetrieve: (code: string) => boolean;
  onOpenAdmin?: () => void;
};

type ScrambleGlyph = {
  value: string;
  scrambled: boolean;
};

function makeFinalGlyphs(text: string): ScrambleGlyph[] {
  return Array.from(text, (value) => ({ value, scrambled: false }));
}

function randomScrambleCharacter() {
  return SCRAMBLE_CHARACTERS[Math.floor(Math.random() * SCRAMBLE_CHARACTERS.length)];
}

function makeScrambledGlyphs(text: string, revealedCount: number): ScrambleGlyph[] {
  return Array.from(text, (value, index) => {
    if (value === " " || value === "-") return { value, scrambled: false };
    if (index < revealedCount) return { value, scrambled: false };
    if (index < revealedCount + SCRAMBLED_LETTER_COUNT) {
      return { value: randomScrambleCharacter(), scrambled: true };
    }
    return { value: " ", scrambled: false };
  });
}

function ScrambleInText({ text }: { text: string }) {
  const [glyphs, setGlyphs] = useState(() => makeFinalGlyphs(text));

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setGlyphs(makeFinalGlyphs(text));
      return;
    }

    let frame = 0;
    setGlyphs(makeScrambledGlyphs(text, 0));

    const intervalId = window.setInterval(() => {
      frame += 1;
      const revealedCount = Math.min(text.length, Math.floor(frame / 1.35));

      if (revealedCount >= text.length) {
        window.clearInterval(intervalId);
        setGlyphs(makeFinalGlyphs(text));
        return;
      }

      setGlyphs(makeScrambledGlyphs(text, revealedCount));
    }, SCRAMBLE_SPEED_MS);

    return () => window.clearInterval(intervalId);
  }, [text]);

  return (
    <span className="section-hero__scramble-text" aria-hidden="true">
      {glyphs.map((glyph, index) => (
        <span
          key={`${text}-${index}`}
          className={`section-hero__scramble-char${glyph.scrambled ? " section-hero__scramble-char--scrambled" : ""}`}
        >
          {glyph.value}
        </span>
      ))}
    </span>
  );
}

export function SectionHero({
  participantCount,
  phase,
  activeCode,
  onRegister,
  onPinSubmit,
  onCancelPinEntry,
  onLaunch,
  onRetrieve,
  onOpenAdmin
}: SectionHeroProps) {
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [mode, setMode] = useState<Mode>("register");
  const [nameError, setNameError] = useState("");
  const [pinError, setPinError] = useState("");
  const [retrieveError, setRetrieveError] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [adminRevealed, setAdminRevealed] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);
  const codeCopyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (adminRevealed) return;

    const ADMIN_SEQUENCE = "azerty";
    let buffer = "";
    let heroVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.intersectionRatio > 0.4;
      },
      { threshold: [0, 0.4, 1] }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);

    function isTypingTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (target.isContentEditable) return true;
      return false;
    }

    function onKey(event: KeyboardEvent) {
      if (event.key.length !== 1) return;
      if (!heroVisible) return;
      if (isTypingTarget(event.target)) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-ADMIN_SEQUENCE.length);
      if (buffer === ADMIN_SEQUENCE) {
        setAdminRevealed(true);
      }
    }

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      observer.disconnect();
    };
  }, [adminRevealed]);

  const disabled = phase === "spinning";
  const isRetrieveMode = mode === "retrieve";
  const isPinEntry = !isRetrieveMode && phase === "pin_entry";
  const codeVisible = !isRetrieveMode && Boolean(activeCode) && phase !== "idle" && phase !== "pin_entry";
  const canLaunchFromCode = Boolean(activeCode) && phase === "code_shown";
  const inputId = isPinEntry ? "inscription-pin" : isRetrieveMode ? "retrieve-code" : "inscription-name";
  const labelId = `${inputId}-label`;
  const helperId = `${inputId}-helper`;
  const primaryLabel = isRetrieveMode
    ? "Récupérer le tirage"
    : isPinEntry
      ? "Valider le code PIN"
      : canLaunchFromCode
        ? "Lancer la roulette"
        : codeVisible
          ? phase === "spinning"
            ? "Tirage en cours"
            : "Code enregistré"
          : "S'enregistrer";
  const primaryState = isRetrieveMode ? "retrieve" : codeVisible ? "code" : "register";
  const codeHint = codeVisible
    ? "Voici le code pour retrouver votre tirage au sort. Notez-le bien !"
    : isRetrieveMode
      ? "Collez votre code pour reprendre un tirage déjà enregistré."
      : isPinEntry
        ? "Votre PIN sera combiné à votre prénom pour former votre code de récupération."
        : "";
  const helperText = isPinEntry
    ? pinError || "Choisissez un code PIN à 4 chiffres pour retrouver votre tirage"
    : isRetrieveMode
      ? retrieveError || "Entrez votre code pour retrouver votre tirage au sort"
      : nameError || "Inscrivez-vous pour obtenir votre tirage au sort";

  useEffect(() => {
    setCodeCopied(false);
  }, [activeCode]);

  useEffect(() => {
    return () => {
      if (codeCopyTimeoutRef.current !== null) {
        window.clearTimeout(codeCopyTimeoutRef.current);
      }
    };
  }, []);

  function handleRegisterSubmit(event: FormEvent) {
    event.preventDefault();
    if (canLaunchFromCode) { onLaunch(); return; }
    if (codeVisible) return;
    if (isPinEntry) {
      if (pin.length !== 4) {
        setPinError("Le code PIN doit contenir exactement 4 chiffres.");
        return;
      }
      const success = onPinSubmit(pin);
      if (!success) {
        setPinError("Ce code est déjà utilisé. Choisissez un autre PIN.");
        return;
      }
      setPin("");
      setPinError("");
      return;
    }
    const trimmed = name.trim();
    if (disabled) return;
    if (!trimmed) {
      setNameError("Entrez votre prénom pour continuer.");
      return;
    }
    setNameError("");
    onRegister(trimmed);
    setName("");
  }

  function handleRetrieveSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = retrieveCode.trim().toUpperCase();
    if (!trimmed) return;
    const found = onRetrieve(trimmed);
    if (found) {
      setMode("register");
      setRetrieveCode("");
      setRetrieveError("");
    } else {
      setRetrieveError("Code non trouvé. Vérifiez votre code et réessayez.");
    }
  }

  function handleCodeCopy() {
    if (!activeCode || !navigator.clipboard) return;

    navigator.clipboard
      .writeText(activeCode)
      .then(() => {
        setCodeCopied(true);

        if (codeCopyTimeoutRef.current !== null) {
          window.clearTimeout(codeCopyTimeoutRef.current);
        }

        codeCopyTimeoutRef.current = window.setTimeout(() => {
          setCodeCopied(false);
          codeCopyTimeoutRef.current = null;
        }, 1800);
      })
      .catch(() => undefined);
  }

  return (
    <section className="section-hero" ref={sectionRef}>
      <div className="section-hero__gradient" aria-hidden="true" />
      <Header
        participantCount={participantCount}
        onOpenAdmin={onOpenAdmin}
        adminVisible={adminRevealed}
      />
      <div className="section-hero__content">
        <div className="section-hero__text">
          <h1 className="section-hero__title">
            Ce soir, l&apos;Eurovision s&apos;invite à notre table.
          </h1>
          <p className="section-hero__body">
            Chaque participant tire au sort un pays en lice pour l&apos;Eurovision 2026, un moment du repas, et trois recettes, de la plus accessible à la plus audacieuse.
          </p>
        </div>

        <form
          className={`section-hero__flow section-hero__flow--${primaryState}`}
          onSubmit={isRetrieveMode ? handleRetrieveSubmit : handleRegisterSubmit}
        >
          <div className="section-hero__field-copy">
            <label
              id={labelId}
              htmlFor={codeVisible ? undefined : inputId}
              className="section-hero__input-label"
            >
              {isPinEntry ? "Code PIN" : isRetrieveMode ? "Code de tirage" : "Prénom"}
            </label>
            <p
              id={helperId}
              className={`section-hero__input-helper${
                (nameError && !isRetrieveMode && !isPinEntry) || (pinError && isPinEntry) || (retrieveError && isRetrieveMode)
                  ? " section-hero__input-helper--error"
                  : ""
              }`}
            >
              {helperText}
            </p>
          </div>

          <div className="section-hero__control-row">
            <div
              className={`section-hero__input-shell section-hero__input-shell--${primaryState}${
                (nameError && !isRetrieveMode && !isPinEntry) || (pinError && isPinEntry) || (retrieveError && isRetrieveMode) ? " section-hero__input-shell--error" : ""
              }`}
            >
              {codeVisible && activeCode ? (
                <button
                  type="button"
                  className={`section-hero__code-display${codeCopied ? " section-hero__code-display--copied" : ""}`}
                  aria-describedby={helperId}
                  aria-label={codeCopied ? `Code ${activeCode} copié` : `Copier le code ${activeCode}`}
                  onClick={handleCodeCopy}
                >
                  <ScrambleInText text={activeCode} />
                  <span className="section-hero__code-copy-state" aria-live="polite">
                    <Copy className="section-hero__code-copy-icon" size={14} aria-hidden="true" />
                    {codeCopied ? "Copié" : "Copier"}
                  </span>
                </button>
              ) : isPinEntry ? (
                <input
                  id={inputId}
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  autoComplete="off"
                  placeholder="0000"
                  className="section-hero__input section-hero__input--mono"
                  value={pin}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                    setPin(val);
                    if (pinError) setPinError("");
                  }}
                  disabled={disabled}
                  aria-invalid={Boolean(pinError)}
                  aria-describedby={helperId}
                />
              ) : (
                <input
                  id={inputId}
                  type="text"
                  autoComplete={isRetrieveMode ? "off" : "given-name"}
                  placeholder={isRetrieveMode ? "--- --- ---" : "John Doe"}
                  className={`section-hero__input${isRetrieveMode ? " section-hero__input--mono" : ""}`}
                  value={isRetrieveMode ? retrieveCode : name}
                  onChange={(e) => {
                    if (isRetrieveMode) {
                      setRetrieveCode(e.target.value);
                      if (retrieveError) setRetrieveError("");
                    } else {
                      setName(e.target.value);
                      if (nameError) setNameError("");
                    }
                  }}
                  disabled={disabled}
                  aria-invalid={(!isRetrieveMode && Boolean(nameError)) || (isRetrieveMode && Boolean(retrieveError))}
                  aria-describedby={helperId}
                />
              )}

              {/* desktop only — hidden on mobile via CSS */}
              <CtaButton
                variant="panel"
                surface="dark"
                type="submit"
                aria-hidden={true}
                tabIndex={-1}
                className={`section-hero__primary-cta section-hero__primary-cta--${primaryState} section-hero__primary-cta--desktop`}
                icon={isRetrieveMode ? <CloudDownload /> : isPinEntry ? <KeyRound /> : codeVisible ? <Ticket /> : <ArrowDownRight />}
                disabled={disabled || (isRetrieveMode ? !retrieveCode.trim() : isPinEntry ? pin.length !== 4 : codeVisible && !canLaunchFromCode)}
              >
                {primaryLabel}
              </CtaButton>
            </div>

            <div className="section-hero__actions">
              {/* mobile only — hidden on desktop via CSS */}
              <CtaButton
                variant="panel"
                surface="dark"
                type="submit"
                className={`section-hero__primary-cta section-hero__primary-cta--${primaryState} section-hero__primary-cta--mobile`}
                icon={isRetrieveMode ? <CloudDownload /> : isPinEntry ? <KeyRound /> : codeVisible ? <Ticket /> : <ArrowDownRight />}
                disabled={disabled || (isRetrieveMode ? !retrieveCode.trim() : isPinEntry ? pin.length !== 4 : codeVisible && !canLaunchFromCode)}
              >
                {primaryLabel}
              </CtaButton>

              <div className="section-hero__retrieve-wrapper">
                <CtaButton
                  variant="icon-only"
                  surface="dark"
                  type="button"
                  icon={isRetrieveMode ? <RotateCcw /> : <KeyRound />}
                  aria-label={isRetrieveMode ? "Retour à l'inscription" : "Récupérer votre tirage au sort"}
                  onClick={() => {
                    setNameError("");
                    setRetrieveError("");
                    setRetrieveCode("");
                    setPin("");
                    setPinError("");
                    if (isPinEntry) onCancelPinEntry();
                    setMode(isRetrieveMode ? "register" : "retrieve");
                  }}
                  disabled={disabled}
                />
                <span className="section-hero__retrieve-tooltip" aria-hidden="true">
                  {isRetrieveMode ? "Retour à l'inscription" : "Récupérez votre tirage au sort"}
                </span>
              </div>
            </div>
          </div>

          <p
            className={`section-hero__code-hint${codeHint ? "" : " section-hero__code-hint--empty"}`}
            aria-hidden={!codeHint}
          >
            {codeHint || "\u00a0"}
          </p>
        </form>
      </div>
    </section>
  );
}
