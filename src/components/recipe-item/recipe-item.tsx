"use client";

import { Check, ChevronRight, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import type { Dish } from "@/lib/types";

type RecipeItemProps = {
  index: number;
  dish: Dish;
  countryName: string;
};

type ToastPhase = "hidden" | "visible" | "leaving";

const TOAST_VISIBLE_MS = 2000;
const TOAST_EXIT_MS = 220;

export function RecipeItem({ index, dish, countryName }: RecipeItemProps) {
  const [toastPhase, setToastPhase] = useState<ToastPhase>("hidden");

  function handleCopy() {
    if (!navigator.clipboard) return;

    navigator.clipboard
      .writeText(dish.name)
      .then(() => {
        // Re-trigger the visible state even if a previous toast is still up
        // so a fresh click resets the visible timer + replays the entry anim.
        setToastPhase("hidden");
        // Defer to next frame so React commits the "hidden" pass before we
        // flip back to "visible" — otherwise the state set is coalesced.
        requestAnimationFrame(() => setToastPhase("visible"));
      })
      .catch(() => undefined);
  }

  useEffect(() => {
    if (toastPhase === "visible") {
      const t = window.setTimeout(() => setToastPhase("leaving"), TOAST_VISIBLE_MS);
      return () => window.clearTimeout(t);
    }
    if (toastPhase === "leaving") {
      const t = window.setTimeout(() => setToastPhase("hidden"), TOAST_EXIT_MS);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [toastPhase]);

  const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(dish.name + " recette " + countryName)}`;

  const isToastVisible = toastPhase !== "hidden";
  const toastClassName = `recipe-item__copy-state${
    toastPhase === "leaving" ? " recipe-item__copy-state--leaving" : ""
  }`;

  return (
    <article className={`recipe-item${isToastVisible ? " recipe-item--copied" : ""}`}>
      <div className={"recipe-item__eyebrow"}>
        <span className={"recipe-item__index"}>Recette #{index}</span>
        {isToastVisible ? (
          <span className={toastClassName} role="status" aria-live="polite">
            <span className={"recipe-item__copy-state-icon"} aria-hidden="true">
              <Check size={18} strokeWidth={2.5} />
            </span>
            <span className={"recipe-item__copy-state-content"}>
              <span className={"recipe-item__copy-state-title"}>Copié</span>
              <span className={"recipe-item__copy-state-text"}>{dish.name}</span>
            </span>
            <span className={"recipe-item__copy-state-progress"} aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <h4 className={"recipe-item__title-heading"}>
        <button
          type="button"
          className={"recipe-item__title"}
          onClick={handleCopy}
          aria-label={`Copier le nom ${dish.name}`}
        >
          <span className={"recipe-item__title-text"}>
            {dish.name}
          </span>
          <Copy className={"recipe-item__title-copy-icon"} size={17} aria-hidden="true" />
        </button>
      </h4>
      {dish.story ? (
        <p className={"recipe-item__description"}>{dish.story}</p>
      ) : null}
      <a
        href={googleUrl}
        target="_blank"
        rel="noreferrer"
        className={"recipe-item__cta-link"}
      >
        <span className={"recipe-item__cta-label"}>Voir la recette</span>
        <ChevronRight size={18} aria-hidden="true" />
      </a>
    </article>
  );
}
