import { ExternalLink, ChevronRight } from "lucide-react";
import { CtaButton } from "@/components/cta-button/cta-button";
import type { Dish } from "@/lib/types";
import styles from "./recipe-item.module.css";

type RecipeItemProps = {
  index: number;
  dish: Dish;
};

export function RecipeItem({ index, dish }: RecipeItemProps) {
  const primaryLink = dish.recipeLinks[0];
  return (
    <article className={styles["recipe-item"]}>
      <span className={styles["recipe-item__index"]}>Recette #{index}</span>
      <div className={styles["recipe-item__title"]}>
        <h4 className={styles["recipe-item__title-text"]}>{dish.name}</h4>
        <span className={styles["recipe-item__title-icon"]} aria-hidden="true">
          <ExternalLink size={15} />
        </span>
      </div>
      <p className={styles["recipe-item__description"]}>{dish.story}</p>
      {primaryLink ? (
        <a
          href={primaryLink.url}
          target="_blank"
          rel="noreferrer"
          className={styles["recipe-item__cta-link"]}
        >
          <CtaButton variant="secondary" icon={<ChevronRight />} aria-label={`Voir la recette ${dish.name}`}>
            Voir la recette
          </CtaButton>
        </a>
      ) : null}
    </article>
  );
}
