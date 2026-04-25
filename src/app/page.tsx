"use client";

import { useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRecipes } from "@/components/panel-recipes/panel-recipes";
import { PanelResult } from "@/components/panel-result/panel-result";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
import { SectionLogsBottom } from "@/components/section-logs-bottom/section-logs-bottom";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { countries } from "@/lib/data";
import { makeCode } from "@/lib/roulette";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  function handleRegister(name: string) {
    setCode(makeCode(name));
    setParticipantCount((c) => c + 1);
  }

  // Demo data so the bottom panels show populated content
  const demoCountry = countries.find((c) => c.code === "FR") ?? null;
  const demoSlot = "entree" as const;

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
      />
      <SectionLogsTop
        inscription={<PanelInscription code={code} onSubmit={handleRegister} />}
        retrieve={<PanelRetrieve onSubmit={(c) => console.log(c)} />}
      />
      <SectionLeaderboard
        countries={countries}
        selectedCountryCode="FR"
        spinningCountryCode={null}
        usedCountryCodes={new Set(["IT"])}
        selectedSlot={demoSlot}
        spinningSlot={null}
      />
      <SectionLogsBottom
        result={
          <PanelResult
            country={demoCountry}
            slot={demoSlot}
            guestName="Demo"
            shoppingDone={false}
            onToggleShopping={() => undefined}
            isAdmin={false}
            revealed={false}
            onToggleReveal={() => undefined}
          />
        }
        recipes={<PanelRecipes country={demoCountry} slot={demoSlot} />}
      />
    </main>
  );
}
