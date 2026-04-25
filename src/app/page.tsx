"use client";

import { useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLeaderboard } from "@/components/section-leaderboard/section-leaderboard";
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
        selectedSlot="entree"
        spinningSlot={null}
      />
    </main>
  );
}
