import { ArrowDown } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { Header } from "@/components/header/header";
import styles from "./section-hero.module.css";

type SectionHeroProps = {
  participantCount: number;
  onLaunch: () => void;
  onOpenAdmin?: () => void;
};

export function SectionHero({ participantCount, onLaunch, onOpenAdmin }: SectionHeroProps) {
  return (
    <section className={styles["section-hero"]}>
      <div className={styles["section-hero__gradient"]} aria-hidden="true" />
      <Header participantCount={participantCount} onOpenAdmin={onOpenAdmin} />
      <div className={styles["section-hero__content"]}>
        <h1 className={styles["section-hero__title"]}>
          Ce soir, l&apos;Eurovision s&apos;invite à notre table.
        </h1>
        <p className={styles["section-hero__body"]}>
          Chaque participant tire au sort un pays en lice pour l&apos;Eurovision 2026, un moment du repas, et trois recettes, de la plus accessible à la plus audacieuse.
        </p>
        <CtaButton
          variant="primary"
          surface="dark"
          onClick={onLaunch}
          icon={<ArrowDown />}
        >
          Lancer la roulette
        </CtaButton>
      </div>
    </section>
  );
}
