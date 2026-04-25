import { Check } from "lucide-react";
import type { ReactNode } from "react";
import styles from "./food-moment-item.module.css";

type FoodMomentItemState = "default" | "spinning" | "selected";

type FoodMomentItemProps = {
  label: string;
  icon: ReactNode;
  state?: FoodMomentItemState;
};

export function FoodMomentItem({ label, icon, state = "default" }: FoodMomentItemProps) {
  const classNames = [
    styles["food-moment-item"],
    state !== "default" ? styles[`food-moment-item--${state}`] : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={classNames} aria-selected={state === "selected"}>
      <span className={styles["food-moment-item__icon"]} aria-hidden="true">
        {icon}
      </span>
      <span className={styles["food-moment-item__name"]}>
        <span className={styles["food-moment-item__name-text"]}>{label}</span>
        {state === "selected" ? (
          <span className={styles["food-moment-item__check"]} aria-hidden="true">
            <Check size={24} />
          </span>
        ) : null}
      </span>
    </article>
  );
}
