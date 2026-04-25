"use client";

import { ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { CtaButton } from "@/components/cta-button/cta-button";
import type { Dish } from "@/lib/types";

type RecipeItemProps = {
  index: number;
  dish: Dish;
  countryName: string;
};

export function RecipeItem({ index, dish, countryName }: RecipeItemProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(dish.name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(dish.name + " recette " + countryName)}`;

  return (
    <article className={"recipe-item"}>
      <span className={"recipe-item__index"}>Recette #{index}</span>
      <div className={"recipe-item__title"}>
        <h4 className={"recipe-item__title-text"}>{dish.name}</h4>
        <button
          type="button"
          className={"recipe-item__copy-btn"}
          onClick={handleCopy}
          aria-label={`Copier le nom ${dish.name}`}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </button>
      </div>
      {dish.story ? (
        <p className={"recipe-item__description"}>{dish.story}</p>
      ) : null}
      <a
        href={googleUrl}
        target="_blank"
        rel="noreferrer"
        className={"recipe-item__cta-link"}
      >
        <CtaButton variant="secondary" icon={<ChevronRight />} aria-label={`Rechercher la recette ${dish.name}`}>
          Voir la recette
        </CtaButton>
      </a>
    </article>
  );
}
