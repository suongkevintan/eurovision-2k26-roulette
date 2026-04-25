"use client";

import { useState } from "react";
import { SectionHero } from "@/components/section-hero/section-hero";

export default function Home() {
  const [participantCount, setParticipantCount] = useState(0);

  return (
    <main>
      <SectionHero
        participantCount={participantCount}
        onLaunch={() => setParticipantCount((c) => c + 1)}
      />
    </main>
  );
}
