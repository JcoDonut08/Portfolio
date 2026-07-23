"use client";

import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { OpeningSequence } from "@/components/opening-sequence";

export function PortfolioExperience() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <main className="portfolio-experience">
      <HeroSection isActive={hasEntered} />
      {hasEntered ? null : <OpeningSequence onComplete={() => setHasEntered(true)} />}
    </main>
  );
}
