"use client";

import { type FormEvent, useState } from "react";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { Header } from "@/components/header/header";

type Phase = "idle" | "code_shown" | "spinning" | "revealed";
type Mode = "register" | "retrieve";

type SectionHeroProps = {
  participantCount: number;
  phase: Phase;
  activeCode: string | null;
  onRegister: (name: string) => void;
  onLaunch: () => void;
  onRetrieve: (code: string) => void;
  onOpenAdmin?: () => void;
};

export function SectionHero({
  participantCount,
  phase,
  activeCode,
  onRegister,
  onLaunch,
  onRetrieve,
  onOpenAdmin
}: SectionHeroProps) {
  const [name, setName] = useState("");
  const [retrieveCode, setRetrieveCode] = useState("");
  const [mode, setMode] = useState<Mode>("register");

  const disabled = phase === "spinning";
  const codeShown = phase === "code_shown" && activeCode;

  function handleRegisterSubmit(event: FormEvent) {
    event.preventDefault();
    if (codeShown) {
      onLaunch();
      return;
    }
    const trimmed = name.trim();
    if (!trimmed || disabled) return;
    onRegister(trimmed);
    setName("");
  }

  function handleRetrieveSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = retrieveCode.trim().toUpperCase();
    if (!trimmed) return;
    onRetrieve(trimmed);
    setMode("register");
    setRetrieveCode("");
  }

  return (
    <section className="section-hero">
      <div className="section-hero__gradient" aria-hidden="true" />
      <Header participantCount={participantCount} onOpenAdmin={onOpenAdmin} />
      <div className="section-hero__content">
        <div className="section-hero__text">
          <h1 className="section-hero__title">
            Ce soir, l&apos;Eurovision s&apos;invite à notre table.
          </h1>
          <p className="section-hero__body">
            Chaque participant tire au sort un pays en lice pour l&apos;Eurovision 2026, un moment du repas, et trois recettes, de la plus accessible à la plus audacieuse.
          </p>
        </div>

        {mode === "register" ? (
          <form className="section-hero__cta-block" onSubmit={handleRegisterSubmit}>
            <label htmlFor="inscription-name" className="section-hero__input-label">
              {codeShown ? "Ton code" : "Prénom"}
            </label>
            <div className="section-hero__cta-row">
              <div className="section-hero__input-main">
                {codeShown ? (
                  <span className="section-hero__code-display" aria-live="polite">
                    {activeCode}
                  </span>
                ) : (
                  <input
                    id="inscription-name"
                    type="text"
                    autoComplete="given-name"
                    placeholder="John Doe"
                    className="section-hero__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={disabled}
                  />
                )}
                <CtaButton
                  variant="panel"
                  surface="dark"
                  type="submit"
                  icon={codeShown ? <Sparkles /> : <ArrowRight />}
                  aria-label={codeShown ? "Lancer la roulette" : "Valider le prénom"}
                  disabled={disabled || (!codeShown && !name.trim())}
                />
              </div>
              <div className="section-hero__retrieve-wrapper">
                <CtaButton
                  variant="icon-only"
                  surface="dark"
                  type="button"
                  icon={<Search />}
                  aria-label="Retrouver mes informations"
                  onClick={() => setMode("retrieve")}
                />
                <span className="section-hero__retrieve-tooltip" aria-hidden="true">
                  Récupérez votre tirage au sort
                </span>
              </div>
            </div>
            {codeShown && (
              <p className="section-hero__code-hint">
                Notez ce code pour retrouver votre tirage au sort.
              </p>
            )}
          </form>
        ) : (
          <form className="section-hero__cta-block" onSubmit={handleRetrieveSubmit}>
            <label htmlFor="retrieve-code" className="section-hero__input-label">
              Code de tirage
            </label>
            <div className="section-hero__cta-row">
              <div className="section-hero__input-main">
                <input
                  id="retrieve-code"
                  type="text"
                  placeholder="TAN-918419"
                  autoComplete="off"
                  className="section-hero__input section-hero__input--mono"
                  value={retrieveCode}
                  onChange={(e) => setRetrieveCode(e.target.value)}
                />
                <CtaButton
                  variant="panel"
                  surface="dark"
                  type="submit"
                  icon={<Search />}
                  aria-label="Retrouver mon tirage"
                  disabled={!retrieveCode.trim()}
                />
              </div>
              <div className="section-hero__retrieve-wrapper">
                <CtaButton
                  variant="icon-only"
                  surface="dark"
                  type="button"
                  icon={<ArrowRight />}
                  aria-label="Retour à l'inscription"
                  onClick={() => setMode("register")}
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
