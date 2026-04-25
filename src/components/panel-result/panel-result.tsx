import { Eye, EyeOff, ShoppingBasket } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import { Flag } from "@/components/flag/flag";
import type { Country, DinnerSlot } from "@/lib/types";
import { dinnerSlots } from "@/lib/data";
import { youtubeEmbedUrl } from "@/lib/youtube";
import styles from "./panel-result.module.css";

type PanelResultProps = {
  country: Country | null;
  slot: DinnerSlot | null;
  guestName: string | null;
  shoppingDone: boolean;
  onToggleShopping: () => void;
  isAdmin: boolean;
  revealed: boolean;
  onToggleReveal: () => void;
};

export function PanelResult({
  country,
  slot,
  guestName,
  shoppingDone,
  onToggleShopping,
  isAdmin,
  revealed,
  onToggleReveal
}: PanelResultProps) {
  if (!country || !slot) {
    return (
      <section className={styles["panel-result"]} aria-label="Résultat du tirage">
        <header className={styles["panel-result__header"]}>
          <EurovisionLogo size="sm" />
          <div className={styles["panel-result__header-text"]}>
            <p className={styles["panel-result__header-title"]}>En attente</p>
            <p className={styles["panel-result__header-subtitle"]}>Lance la roulette</p>
          </div>
        </header>
        <p className={styles["panel-result__placeholder"]}>
          Le résultat apparaîtra ici une fois le tirage lancé.
        </p>
      </section>
    );
  }

  const slotLabel = dinnerSlots[slot].label.toLowerCase();
  return (
    <section className={styles["panel-result"]} aria-label="Résultat du tirage">
      <header className={styles["panel-result__header"]}>
        <EurovisionLogo size="sm" />
        <div className={styles["panel-result__header-text"]}>
          <p className={styles["panel-result__header-title"]}>
            {guestName ?? "Eurovision Roulette"}
          </p>
          <p className={styles["panel-result__header-subtitle"]}>2026</p>
        </div>
      </header>
      <div className={styles["panel-result__command"]}>
        <p className={styles["panel-result__command-eyebrow"]}>Nouvelle commande Chef !</p>
        <p className={styles["panel-result__command-line"]}>
          Pour le dîner ce sera{" "}
          <strong className={styles["panel-result__command-highlight"]}>{slotLabel}</strong>{" "}
          à réaliser pour ce soir.
        </p>
        <p className={styles["panel-result__command-line"]}>
          Et pour le pays de référence ce sera :{" "}
          <strong className={styles["panel-result__command-highlight"]}>{country.name}</strong>
        </p>
        <Flag code={country.code} countryName={country.name} size="lg" className={styles["panel-result__flag"]} />
      </div>
      <div className={styles["panel-result__media"]}>
        <p className={styles["panel-result__song"]}>
          {country.artist} — &quot;{country.song}&quot;
        </p>
        {country.youtubeId ? (
          <iframe
            src={youtubeEmbedUrl(country.youtubeId)}
            title={`${country.artist} — ${country.song}`}
            className={styles["panel-result__video"]}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className={styles["panel-result__video-placeholder"]} aria-label="Aperçu indisponible">
            <Flag code={country.code} countryName={country.name} size="lg" />
          </div>
        )}
      </div>
      <div className={styles["panel-result__ctas"]}>
        <CtaButton
          variant="panel"
          icon={<ShoppingBasket />}
          onClick={onToggleShopping}
        >
          {shoppingDone ? "Courses prêtes" : "Marquer les courses"}
        </CtaButton>
        {isAdmin ? (
          <CtaButton
            variant="panel"
            icon={revealed ? <EyeOff /> : <Eye />}
            onClick={onToggleReveal}
          >
            {revealed ? "Cacher" : "Révéler"}
          </CtaButton>
        ) : null}
      </div>
    </section>
  );
}
