import { Eye, EyeOff } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import { Flag } from "@/components/flag/flag";
import type { Country, DinnerSlot } from "@/lib/types";
import { dinnerSlots } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";

type PanelResultProps = {
  country: Country | null;
  slot: DinnerSlot | null;
  guestName: string | null;
  isAdmin: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
};

export function PanelResult({
  country,
  slot,
  guestName,
  isAdmin,
  revealed,
  onToggleReveal
}: PanelResultProps) {
  if (!country || !slot) {
    return (
      <section className={"panel-result"} aria-label="Résultat du tirage">
        <header className={"panel-result__header"}>
          <EurovisionLogo size="sm" />
          <div className={"panel-result__header-text"}>
            <p className={"panel-result__header-title"}>En attente</p>
            <p className={"panel-result__header-subtitle"}>Lance la roulette</p>
          </div>
        </header>
        <p className={"panel-result__placeholder"}>
          Le résultat apparaîtra ici une fois le tirage lancé.
        </p>
      </section>
    );
  }

  const slotLabel = dinnerSlots[slot].label.toLowerCase();
  return (
    <section className={"panel-result"} aria-label="Résultat du tirage">
      <header className={"panel-result__header"}>
        <EurovisionLogo size="sm" />
        <div className={"panel-result__header-text"}>
          <p className={"panel-result__header-title"}>Résultat du tirage au sort</p>
          <p className={"panel-result__header-subtitle"}>
            Pour {guestName ?? "vous"}
          </p>
        </div>
      </header>
            <div className={"panel-result__command"}>
        <div className={"panel-result__command-text"}>
          <p className={"panel-result__command-title"}>Votre CB12 à faire !</p>
          <div className={"panel-result__command-lines"}>
            <p className={"panel-result__command-line"}>
              Pour le dîner ce sera{" "}
              <span className={"panel-result__command-highlight"}>{slotLabel}</span>
              {" "}à réaliser pour ce soir.
            </p>
            <p className={"panel-result__command-line"}>
              Et pour le pays de référence ce sera&nbsp;:{" "}
              <span className={"panel-result__command-highlight"}>{country.name}</span>
            </p>
          </div>
        </div>
        <Flag code={country.code} countryName={country.name} size="lg" />
      </div>
      <div className={"panel-result__media"}>
        <p className={"panel-result__song"}>
          {country.artist} — &quot;{country.song}&quot;
        </p>
        {country.youtubeId ? (
          <iframe
            src={youtubeEmbedUrl(country.youtubeId)}
            title={`${country.artist} — ${country.song}`}
            className={"panel-result__video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={"panel-result__video-placeholder"} aria-label="Aperçu indisponible">
            <Flag code={country.code} countryName={country.name} size="lg" />
          </div>
        )}
      </div>
      {isAdmin ? (
        <div className={"panel-result__ctas"}>
          <CtaButton
            variant="panel"
            icon={revealed ? <EyeOff /> : <Eye />}
            onClick={onToggleReveal}
          >
            {revealed ? "Cacher" : "Révéler"}
          </CtaButton>
        </div>
      ) : null}
    </section>
  );
}
