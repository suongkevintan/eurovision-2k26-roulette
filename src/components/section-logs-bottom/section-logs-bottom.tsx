import type { ReactNode } from "react";

type SectionLogsBottomProps = {
  result: ReactNode;
  recipes: ReactNode;
};

export function SectionLogsBottom({ result, recipes }: SectionLogsBottomProps) {
  return (
    <section
      id="section-logs-bottom"
      className={"section-logs-bottom"}
      aria-label="Résultat et recettes"
    >
      <div className={"section-logs-bottom__inner"}>
        {result}
        {recipes}
      </div>
    </section>
  );
}
