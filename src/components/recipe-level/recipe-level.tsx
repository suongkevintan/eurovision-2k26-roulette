import type { Difficulty } from "@/lib/types";

const difficultyMeta: Record<Difficulty, { stars: number; label: string }> = {
  Facile: { stars: 1, label: "1 étoile Michelin" },
  Moyen: { stars: 2, label: "2 étoiles Michelin" },
  Challenge: { stars: 3, label: "3 étoiles Michelin" }
};

type RecipeLevelProps = {
  difficulty: Difficulty;
};

export function RecipeLevel({ difficulty }: RecipeLevelProps) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className={"recipe-level"}>
      <div className={"recipe-level__stars"} aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <span key={i} className={"recipe-level__star"} data-filled={i < meta.stars ? "true" : undefined}>
            ★
          </span>
        ))}
      </div>
      <span className={"recipe-level__label"}>{meta.label}</span>
    </div>
  );
}
