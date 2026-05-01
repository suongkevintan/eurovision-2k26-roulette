import type { ReactNode } from "react";

type SectionLogsBottomProps = {
  result: ReactNode;
  recipes: ReactNode;
  spinning?: boolean;
};

export function SectionLogsBottom({ result, recipes, spinning }: SectionLogsBottomProps) {
  return (
    <section
      id="section-logs-bottom"
      className={`section-logs-bottom${spinning ? " section-logs-bottom--spinning" : ""}`}
      aria-label="Résultat et recettes"
    >
      <div className={"section-logs-bottom__inner"}>
        {result}
        {recipes}
      </div>
    </section>
  );
}
