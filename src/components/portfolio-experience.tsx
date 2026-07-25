"use client";

import { useState } from "react";
import { AboutSection } from "@/components/about-section";
import { HeroSection } from "@/components/hero-section";
import { OpeningSequence } from "@/components/opening-sequence";
import { SiteFooter } from "@/components/site-footer";
import { ZodiacField } from "@/components/zodiac-field";
import { useScrollReveals } from "@/hooks/use-scroll-reveals";

export function PortfolioExperience() {
  const [hasEntered, setHasEntered] = useState(false);
  useScrollReveals(hasEntered);

  return (
    <main className="portfolio-experience">
      <div aria-hidden="true" className="portfolio-backdrop">
        <ZodiacField isActive={hasEntered} />
        <span className="portfolio-backdrop-planet" />
        <span className="portfolio-backdrop-vignette" />
      </div>
      <div aria-hidden="true" className="scroll-progress">
        <span />
      </div>
      <HeroSection isActive={hasEntered} />
      <AboutSection />
      <SiteFooter />
      {hasEntered ? null : <OpeningSequence onComplete={() => setHasEntered(true)} />}
    </main>
  );
}
