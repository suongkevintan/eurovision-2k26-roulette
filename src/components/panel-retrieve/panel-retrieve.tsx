import { FormEvent, useState } from "react";
import { KeyRound, Search } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";

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
    <section className={"panel-retrieve"} aria-labelledby="retrieve-title">
      <header className={"panel-retrieve__header"}>
        <KeyRound size={24} aria-hidden="true" />
        <h2 id="retrieve-title" className={"panel-retrieve__title"}>
          Retrouver ses informations
        </h2>
      </header>
      <form className={"panel-retrieve__form"} onSubmit={handleSubmit}>
        <div className={"panel-retrieve__field"}>
          <label htmlFor="retrieve-code" className={"panel-retrieve__label"}>
            Code
          </label>
          <input
            id="retrieve-code"
            type="text"
            placeholder="MAR-A1B2"
            autoComplete="off"
            className={"panel-retrieve__input"}
            value={code}
            onChange={(event) => setCode(event.target.value)}
          />
          <p className={"panel-retrieve__help"}>
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
