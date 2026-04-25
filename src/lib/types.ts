export type DinnerSlot = "apero" | "entree" | "plat" | "dessert" | "snacks";
export type Difficulty = "Facile" | "Moyen" | "Challenge";

export type Dish = {
  id: string;
  name: string;
  difficulty: Difficulty;
  story: string;
  shopping: string[];
  recipeUrl: string;
  recipeLinks: {
    label: string;
    url: string;
    query: string;
  }[];
  ingredients: string[];
  instructions: string[];
};

export type Country = {
  code: string;
  name: string;
  flag: string;
  artist: string;
  song: string;
  color: string;
  dishes: Record<DinnerSlot, Dish[]>;
  youtubeId?: string;
};

export type Guest = {
  id: string;
  name: string;
  code: string;
  dinnerSlot: DinnerSlot;
  countryCode: string;
  shoppingDone: boolean;
  createdAt: string;
};

export type RouletteState = {
  revealDraws: boolean;
  guests: Guest[];
};
