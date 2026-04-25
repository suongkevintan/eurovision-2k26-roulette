import { Check } from "lucide-react";
import { Flag } from "@/components/flag/flag";

type CountryItemState = "default" | "spinning" | "selected" | "used";

type CountryItemProps = {
  code: string;
  name: string;
  state?: CountryItemState;
};

export function CountryItem({ code, name, state = "default" }: CountryItemProps) {
  const classNames = [
    "country-item",
    state !== "default" ? `country-item--${state}` : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} data-state={state}>
      <Flag code={code} countryName={name} size="md" />
      <div className={"country-item__name"}>
        <span className={"country-item__name-text"}>{name}</span>
        {state === "selected" ? (
          <span className={"country-item__check"} aria-hidden="true">
            <Check size={32} />
          </span>
        ) : null}
      </div>
    </div>
  );
}
