"use client";

import { useState } from "react";
import { PanelInscription } from "@/components/panel-inscription/panel-inscription";
import { PanelRetrieve } from "@/components/panel-retrieve/panel-retrieve";
import { SectionHero } from "@/components/section-hero/section-hero";
import { SectionLogsTop } from "@/components/section-logs-top/section-logs-top";
import { makeCode } from "@/lib/roulette";

export default function Home() {
  const [code, setCode] = useState<string | null>(null);
  const [participantCount, setParticipantCount] = useState(0);

  function handleRegister(name: string) {
    // Temporary: full orchestration with persistence comes in Batch 7
    setCode(makeCode(name));
    setParticipantCount((c) => c + 1);
  }

  function handleRetrieve(submittedCode: string) {
    console.log("retrieve code:", submittedCode);
  }

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => document.getElementById("inscription-name")?.focus()}
      />
      <SectionLogsTop
        inscription={<PanelInscription code={code} onSubmit={handleRegister} />}
        retrieve={<PanelRetrieve onSubmit={handleRetrieve} />}
      />
    </main>
  );
}
