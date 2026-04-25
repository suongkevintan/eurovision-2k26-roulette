import type { Difficulty } from "@/lib/types";
import styles from "./recipe-level.module.css";

const difficultyMeta: Record<Difficulty, { stars: number; label: string }> = {
  Facile: { stars: 1, label: "Niveau accessible" },
  Moyen: { stars: 2, label: "Niveau intermédiaire" },
  Challenge: { stars: 3, label: "Niveau audacieux" }
};

type RecipeLevelProps = {
  difficulty: Difficulty;
  count: number;
};

export function RecipeLevel({ difficulty, count }: RecipeLevelProps) {
  const meta = difficultyMeta[difficulty];
  return (
    <div className={styles["recipe-level"]}>
      <div className={styles["recipe-level__stars"]} aria-hidden="true">
        {Array.from({ length: 3 }).map((_, i) => (
          <span
            key={i}
            className={
              i < meta.stars
                ? `${styles["recipe-level__star"]} ${styles["recipe-level__star--filled"]}`
                : styles["recipe-level__star"]
            }
          />
        ))}
      </div>
      <span className={styles["recipe-level__label"]}>
        {difficulty} — {meta.label}
      </span>
      <span className={styles["recipe-level__details"]}>{count} recette{count > 1 ? "s" : ""}</span>
    </div>
  );
}
