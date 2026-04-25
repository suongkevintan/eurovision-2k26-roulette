import type { ReactNode } from "react";

type SectionLogsTopProps = {
  inscription: ReactNode;
  retrieve: ReactNode;
};

export function SectionLogsTop({ inscription, retrieve }: SectionLogsTopProps) {
  return (
    <section className={"section-logs-top"} aria-label="Inscription et accès participant">
      <div className={"section-logs-top__inner"}>
        {inscription}
        {retrieve}
      </div>
    </section>
  );
}
