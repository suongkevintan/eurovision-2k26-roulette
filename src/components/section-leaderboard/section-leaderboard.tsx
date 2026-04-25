import { Croissant, IceCream, Pizza, Soup, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { CountryItem } from "@/components/country-item/country-item";
import { FoodMomentItem } from "@/components/food-moment-item/food-moment-item";
import { dinnerSlots } from "@/lib/data";
import type { Country, DinnerSlot } from "@/lib/types";
import styles from "./section-leaderboard.module.css";

const slotIcons: Record<DinnerSlot, ReactNode> = {
  apero: <Croissant size={28} />,
  entree: <Soup size={28} />,
  plat: <UtensilsCrossed size={28} />,
  dessert: <IceCream size={28} />,
  snacks: <Pizza size={28} />
};

const slotOrder: DinnerSlot[] = ["apero", "entree", "plat", "dessert", "snacks"];

type SectionLeaderboardProps = {
  countries: Country[];
  selectedCountryCode: string | null;
  spinningCountryCode: string | null;
  usedCountryCodes: Set<string>;
  selectedSlot: DinnerSlot | null;
  spinningSlot: DinnerSlot | null;
};

export function SectionLeaderboard({
  countries,
  selectedCountryCode,
  spinningCountryCode,
  usedCountryCodes,
  selectedSlot,
  spinningSlot
}: SectionLeaderboardProps) {
  return (
    <section className={styles["section-leaderboard"]} aria-label="Tableau des pays et moments du dîner">
      <div className={styles["section-leaderboard__inner"]}>
        <div className={styles["section-leaderboard__countries"]}>
          {countries.map((country) => {
            const state = (() => {
              if (country.code === selectedCountryCode) return "selected" as const;
              if (country.code === spinningCountryCode) return "spinning" as const;
              if (usedCountryCodes.has(country.code) && country.code !== selectedCountryCode) return "used" as const;
              return "default" as const;
            })();
            return (
              <div key={country.code} className={styles["section-leaderboard__country-cell"]}>
                <CountryItem code={country.code} name={country.name} state={state} />
              </div>
            );
          })}
        </div>
        <div className={styles["section-leaderboard__moments"]}>
          {slotOrder.map((slot) => {
            const state = slot === selectedSlot
              ? "selected" as const
              : slot === spinningSlot
              ? "spinning" as const
              : "default" as const;
            return (
              <FoodMomentItem
                key={slot}
                label={dinnerSlots[slot].label}
                icon={slotIcons[slot]}
                state={state}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
