import { ChefHat } from "lucide-react";
import { RecipeItem } from "@/components/recipe-item/recipe-item";
import { RecipeLevel } from "@/components/recipe-level/recipe-level";
import type { Country, DinnerSlot, Difficulty } from "@/lib/types";
import styles from "./panel-recipes.module.css";

type PanelRecipesProps = {
  country: Country | null;
  slot: DinnerSlot | null;
};

const difficulties: Difficulty[] = ["Facile", "Moyen", "Challenge"];

export function PanelRecipes({ country, slot }: PanelRecipesProps) {
  if (!country || !slot) {
    return (
      <section className={styles["panel-recipes"]} aria-label="Recettes proposées">
        <header className={styles["panel-recipes__header"]}>
          <ChefHat size={24} aria-hidden="true" />
          <h2 className={styles["panel-recipes__title"]}>Recettes</h2>
        </header>
        <p className={styles["panel-recipes__placeholder"]}>
          Les recettes du pays tiré apparaîtront ici.
        </p>
      </section>
    );
  }
  const dishes = country.dishes[slot];
  return (
    <section className={styles["panel-recipes"]} aria-label="Recettes proposées">
      <header className={styles["panel-recipes__header"]}>
        <ChefHat size={24} aria-hidden="true" />
        <h2 className={styles["panel-recipes__title"]}>Trois recettes pour {country.name}</h2>
      </header>
      {difficulties.map((difficulty) => {
        const filtered = dishes.filter((d) => d.difficulty === difficulty);
        if (!filtered.length) return null;
        return (
          <section key={difficulty} className={styles["panel-recipes__group"]}>
            <RecipeLevel difficulty={difficulty} count={filtered.length} />
            <div className={styles["panel-recipes__items"]}>
              {filtered.map((dish, idx) => (
                <RecipeItem key={dish.id} index={idx + 1} dish={dish} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
