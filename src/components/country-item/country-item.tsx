import { Check } from "lucide-react";
import { Flag } from "@/components/flag/flag";
import styles from "./country-item.module.css";

type CountryItemState = "default" | "spinning" | "selected" | "used";

type CountryItemProps = {
  code: string;
  name: string;
  state?: CountryItemState;
};

export function CountryItem({ code, name, state = "default" }: CountryItemProps) {
  const classNames = [
    styles["country-item"],
    state !== "default" ? styles[`country-item--${state}`] : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} data-state={state}>
      <Flag code={code} countryName={name} size="md" />
      <div className={styles["country-item__name"]}>
        <span className={styles["country-item__name-text"]}>{name}</span>
        {state === "selected" ? (
          <span className={styles["country-item__check"]} aria-hidden="true">
            <Check size={32} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
