import type { ReactNode } from "react";
import styles from "./section-logs-bottom.module.css";

type SectionLogsBottomProps = {
  result: ReactNode;
  recipes: ReactNode;
};

export function SectionLogsBottom({ result, recipes }: SectionLogsBottomProps) {
  return (
    <section
      id="section-logs-bottom"
      className={styles["section-logs-bottom"]}
      aria-label="Résultat et recettes"
    >
      <div className={styles["section-logs-bottom__inner"]}>
        {result}
        {recipes}
      </div>
    </section>
  );
}
