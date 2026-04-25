import { Check } from "lucide-react";
import type { ReactNode } from "react";

type FoodMomentItemState = "default" | "spinning" | "selected";

type FoodMomentItemProps = {
  label: string;
  icon: ReactNode;
  state?: FoodMomentItemState;
};

export function FoodMomentItem({ label, icon, state = "default" }: FoodMomentItemProps) {
  const classNames = [
    "food-moment-item",
    state !== "default" ? `food-moment-item--${state}` : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} data-state={state}>
      <span className={"food-moment-item__icon"} aria-hidden="true">
        {icon}
      </span>
      <span className={"food-moment-item__name"}>
        <span className={"food-moment-item__name-text"}>{label}</span>
        {state === "selected" ? (
          <span className={"food-moment-item__check"} aria-hidden="true">
            <Check size={24} />
          </span>
        ) : null}
      </span>
    </div>
  );
}
