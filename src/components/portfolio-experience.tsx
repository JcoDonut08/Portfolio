"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { EducationSection } from "@/components/education-section";
import { HeroSection } from "@/components/hero-section";
import { OpeningSequence } from "@/components/opening-sequence";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { SkillsSection } from "@/components/skills-section";
import { ZodiacField } from "@/components/zodiac-field";
import { useScrollReveals } from "@/hooks/use-scroll-reveals";

export function PortfolioExperience() {
  const [hasEntered, setHasEntered] = useState(false);
  useScrollReveals(hasEntered);

  useEffect(() => {
    if (hasEntered) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasEntered]);

  const enterExperience = () => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${window.location.search}`,
    );
    window.scrollTo(0, 0);
    setHasEntered(true);

    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousScrollBehavior;
    });
  };

  return (
    <main className="portfolio-experience">
      <SiteNavigation isActive={hasEntered} />
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
      <SkillsSection />
      <EducationSection />
      <ProjectsSection />
      <ContactSection />
      <SiteFooter />
      {hasEntered ? null : <OpeningSequence onComplete={enterExperience} />}
    </main>
  );
}
