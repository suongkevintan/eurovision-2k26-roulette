import type { ReactNode } from "react";
import styles from "./section-logs-top.module.css";

type SectionLogsTopProps = {
  inscription: ReactNode;
  retrieve: ReactNode;
};

export function SectionLogsTop({ inscription, retrieve }: SectionLogsTopProps) {
  return (
    <section className={styles["section-logs-top"]} aria-label="Inscription et accès participant">
      <div className={styles["section-logs-top__inner"]}>
        {inscription}
        {retrieve}
      </div>
    </section>
  );
}
