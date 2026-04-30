import { ChefHat } from "lucide-react";
import { RecipeItem } from "@/components/recipe-item/recipe-item";
import { RecipeLevel } from "@/components/recipe-level/recipe-level";
import type { Country, DinnerSlot, Difficulty } from "@/lib/types";

type PanelRecipesProps = {
  country: Country | null;
  slot: DinnerSlot | null;
};

const difficulties: Difficulty[] = ["Facile", "Moyen", "Challenge"];

export function PanelRecipes({ country, slot }: PanelRecipesProps) {
  if (!country || !slot) {
    return (
      <section className={"panel-recipes"} aria-label="Recettes proposées">
        <header className={"panel-recipes__header"}>
          <ChefHat size={32} aria-hidden="true" />
          <h2 className={"panel-recipes__title"}>Recettes</h2>
        </header>
        <p className={"panel-recipes__placeholder"}>
          Les recettes du pays tiré apparaîtront ici.
        </p>
      </section>
    );
  }
  const dishes = country.dishes[slot];
  return (
    <section className={"panel-recipes"} aria-label="Recettes proposées">
      <header className={"panel-recipes__header"}>
        <ChefHat size={32} aria-hidden="true" />
        <div className={"panel-recipes__header-text"}>
          <h2 className={"panel-recipes__title"}>Inspiration de recettes traditionnelles</h2>
          <p className={"panel-recipes__subtitle"}>
            Trois idées de recettes, par difficulté. Pas d&apos;obligation !
          </p>
        </div>
      </header>
      {difficulties.map((difficulty) => {
        const filtered = dishes.filter((d) => d.difficulty === difficulty);
        if (!filtered.length) return null;
        return (
          <section key={difficulty} className={"panel-recipes__group"}>
            <RecipeLevel difficulty={difficulty} />
            <div className={"panel-recipes__items"}>
              {filtered.map((dish, idx) => (
                <RecipeItem key={dish.id} index={idx + 1} dish={dish} countryName={country.name} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
