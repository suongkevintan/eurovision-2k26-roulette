import { FormEvent, useState } from "react";
import { KeyRound, Search } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import styles from "./panel-retrieve.module.css";

type PanelRetrieveProps = {
  onSubmit: (code: string) => void;
};

export function PanelRetrieve({ onSubmit }: PanelRetrieveProps) {
  const [code, setCode] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    onSubmit(trimmed);
  }

  return (
    <section className={styles["panel-retrieve"]} aria-labelledby="retrieve-title">
      <header className={styles["panel-retrieve__header"]}>
        <KeyRound size={24} aria-hidden="true" />
        <h2 id="retrieve-title" className={styles["panel-retrieve__title"]}>
          Retrouver ses informations
        </h2>
      </header>
      <form className={styles["panel-retrieve__form"]} onSubmit={handleSubmit}>
        <div className={styles["panel-retrieve__field"]}>
          <label htmlFor="retrieve-code" className={styles["panel-retrieve__label"]}>
            Code
          </label>
          <input
            id="retrieve-code"
            type="text"
            placeholder="MAR-A1B2"
            autoComplete="off"
            className={styles["panel-retrieve__input"]}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <p className={styles["panel-retrieve__help"]}>
            Ce code permet de retrouver le résultat et le profil.
          </p>
        </div>
        <CtaButton
          variant="panel"
          type="submit"
          icon={<Search />}
          disabled={!code.trim()}
        >
          Retrouver ses informations
        </CtaButton>
      </form>
    </section>
  );
}
