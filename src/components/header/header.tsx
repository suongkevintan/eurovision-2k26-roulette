import { Settings, Users } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";
import styles from "./header.module.css";

type HeaderProps = {
  participantCount: number;
  onOpenAdmin?: () => void;
};

export function Header({ participantCount, onOpenAdmin }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.header__logo}>
        <EurovisionLogo size="md" />
      </div>
      <div
        className={styles.header__incentive}
        role="status"
        aria-label={`${participantCount} participants en lice`}
      >
        <Users size={24} aria-hidden="true" />
        <p className={styles["header__incentive-text"]}>
          <span className={styles["header__incentive-count"]}>{participantCount}</span>
          {` participant·es en lice`}
        </p>
      </div>
      <CtaButton
        variant="icon-only"
        surface="dark"
        aria-label="Ouvrir le panneau admin"
        onClick={onOpenAdmin}
        icon={<Settings />}
      />
    </header>
  );
}
