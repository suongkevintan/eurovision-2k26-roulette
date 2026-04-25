import { FormEvent, useState } from "react";
import { Sparkles, UserPlus } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import styles from "./panel-inscription.module.css";

type PanelInscriptionProps = {
  code: string | null;
  disabled?: boolean;
  onSubmit: (name: string) => void;
};

export function PanelInscription({ code, disabled, onSubmit }: PanelInscriptionProps) {
  const [name, setName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setName("");
  }

  return (
    <section className={styles["panel-inscription"]} aria-labelledby="inscription-title">
      <header className={styles["panel-inscription__header"]}>
        <UserPlus size={24} aria-hidden="true" />
        <h2 id="inscription-title" className={styles["panel-inscription__title"]}>
          Inscription
        </h2>
      </header>
      <form className={styles["panel-inscription__form"]} onSubmit={handleSubmit}>
        <div className={styles["panel-inscription__field"]}>
          <label htmlFor="inscription-name" className={styles["panel-inscription__label"]}>
            Prénom
          </label>
          <input
            id="inscription-name"
            type="text"
            autoComplete="given-name"
            placeholder="John Doe"
            className={styles["panel-inscription__input"]}
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={disabled}
          />
        </div>
        <div className={styles["panel-inscription__field"]}>
          <span className={styles["panel-inscription__label"]}>Code</span>
          <div
            className={styles["panel-inscription__code"]}
            role="status"
            aria-live="polite"
            aria-label={code ? `Votre code est ${code}` : "Code en attente"}
          >
            {code ?? "— — —"}
          </div>
          <p className={styles["panel-inscription__help"]}>
            Ce code permet de retrouver le résultat et le profil.
          </p>
        </div>
        <CtaButton
          variant="panel"
          type="submit"
          icon={<Sparkles />}
          disabled={disabled || !name.trim()}
        >
          Lancer la roulette
        </CtaButton>
      </form>
    </section>
  );
}
