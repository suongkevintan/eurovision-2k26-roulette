import { Settings, Users } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import { EurovisionLogo } from "@/components/eurovision-logo/eurovision-logo";

type HeaderProps = {
  participantCount: number;
  onOpenAdmin?: () => void;
  adminVisible?: boolean;
};

export function Header({ participantCount, onOpenAdmin, adminVisible = true }: HeaderProps) {
  return (
    <header className={"header"}>
      <div className={"header__logo"}>
        <EurovisionLogo size="md" />
      </div>
      <div className={"header__cluster"}>
        <div className={"header__incentive"} role="status">
          <Users size={24} aria-hidden="true" />
          <p className={"header__incentive-text"}>
            <span className={"header__incentive-count"}>{participantCount}</span>
            {` participant·es en lice`}
          </p>
        </div>
        {adminVisible ? (
          <CtaButton
            variant="icon-only"
            surface="dark"
            aria-label="Ouvrir le panneau admin"
            onClick={onOpenAdmin}
            icon={<Settings />}
            className="header__admin-trigger"
          />
        ) : null}
      </div>
    </header>
  );
}
