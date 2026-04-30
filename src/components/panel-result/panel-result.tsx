import { MapPin, Music, Users } from "lucide-react";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import { EuropeMap } from "@/components/europe-map/europe-map";
import { Flag } from "@/components/flag/flag";
import { countryInfo } from "@/lib/country-info";
import type { Country, DinnerSlot } from "@/lib/types";
import { dinnerSlots } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";

type PanelResultProps = {
  country: Country | null;
  slot: DinnerSlot | null;
  guestName: string | null;
};

export function PanelResult({ country, slot, guestName }: PanelResultProps) {
  if (!country || !slot) {
    return (
      <section className={"panel-result panel-result--empty"} aria-label="Résultat du tirage">
        <header className={"panel-result__header"}>
          <EurovisionLogo size="xs" />
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

  const slotLabel = dinnerSlots[slot].label;
  const info = countryInfo[country.code] ?? null;
  return (
    <section className={"panel-result"} aria-label="Résultat du tirage">
      <header className={"panel-result__header"}>
        <EurovisionLogo size="xs" />
        <div className={"panel-result__header-text"}>
          <p className={"panel-result__header-title"}>Résultat du tirage au sort</p>
          <p className={"panel-result__header-subtitle"}>
            Le destin a chanté : voici la combinaison pour vous chef !
          </p>
        </div>
      </header>

      <div className={"panel-result__command-printer"}>
        <div className={"panel-result__command"}>
          <div className={"panel-result__command-text"}>
            <div className={"panel-result__command-header"}>
              <div className={"panel-result__command-heading"}>
                <p className={"panel-result__command-kicker"}>Ticket de commande</p>
                <p className={"panel-result__command-title"}>CB12</p>
              </div>
              <div className={"panel-result__command-stamp"} aria-label={`Pays tiré : ${country.name}`}>
                <Flag code={country.code} countryName={country.name} size="sm" />
              </div>
            </div>
            <div className={"panel-result__command-lines"}>
              <p className={"panel-result__command-line"}>
                <span>Chef·fe</span>
                <strong>{guestName ?? "Vous"}</strong>
              </p>
              <p className={"panel-result__command-line"}>
                <span>Moment</span>
                <strong>{slotLabel}</strong>
              </p>
              <p className={"panel-result__command-line"}>
                <span>Pays</span>
                <strong>{country.name}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
      {info && (
        <div className={"panel-result__geo"}>
          <div className={"panel-result__geo-details"}>
            <div className={"panel-result__geo-item"}>
              <MapPin size={14} aria-hidden="true" />
              <span className={"panel-result__geo-label"}>Capitale</span>
              <strong className={"panel-result__geo-value"}>{info.capital}</strong>
            </div>
            <div className={"panel-result__geo-item"}>
              <Users size={14} aria-hidden="true" />
              <span className={"panel-result__geo-label"}>Population</span>
              <strong className={"panel-result__geo-value"}>{info.population}</strong>
            </div>
          </div>
          <EuropeMap highlightCode={country.code} />
        </div>
      )}

      <div className={"panel-result__media"}>
        <div className={"panel-result__song-block"}>
          <span className={"panel-result__song-eyebrow"}>
            <Music size={14} aria-hidden="true" />
            Représentation Eurovision 2026
          </span>
          <p className={"panel-result__song"}>
            {country.artist} - &quot;{country.song}&quot;
          </p>
        </div>
        <div className={"panel-result__video-frame"}>
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
      </div>
    </section>
  );
}
