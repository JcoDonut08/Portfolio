"use client";

import { useEffect, useState } from "react";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";
import { CursorConstellation } from "@/components/cursor-constellation";
import { EducationSection } from "@/components/education-section";
import { HeroSection } from "@/components/hero-section";
import { OpeningSequence } from "@/components/opening-sequence";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { SkillsSection } from "@/components/skills-section";
import { ZodiacField } from "@/components/zodiac-field";
import { useAdaptivePerformance } from "@/hooks/use-adaptive-performance";
import { useScrollReveals } from "@/hooks/use-scroll-reveals";

export function PortfolioExperience() {
  const [hasEntered, setHasEntered] = useState(false);
  const { lowPowerMode, prefersReducedMotion } = useAdaptivePerformance();
  const disableAmbientMotion = lowPowerMode || prefersReducedMotion;
  useScrollReveals(hasEntered);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.performance = lowPowerMode ? "reduced" : "full";

    return () => {
      delete root.dataset.performance;
    };
  }, [lowPowerMode]);

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

  const enterExperience = (preserveLocation = false) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";

    if (!preserveLocation) {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
      window.scrollTo(0, 0);
    }

    setHasEntered(true);

    window.requestAnimationFrame(() => {
      if (preserveLocation && window.location.hash) {
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ block: "start" });
      }

      root.style.scrollBehavior = previousScrollBehavior;
    });
  };

  return (
    <div className="portfolio-experience">
      <div
        aria-hidden={hasEntered ? undefined : true}
        className="portfolio-content"
        inert={hasEntered ? undefined : true}
      >
        <SiteNavigation isActive={hasEntered} />
        <div aria-hidden="true" className="portfolio-backdrop">
          <ZodiacField isActive={hasEntered} />
          <span className="portfolio-backdrop-planet" />
          <span className="portfolio-backdrop-vignette" />
        </div>
        <div aria-hidden="true" className="scroll-progress">
          <span />
        </div>
        <CursorConstellation
          isActive={hasEntered && !disableAmbientMotion}
        />
        <main id="main-content">
          <HeroSection
            disableAmbientMotion={disableAmbientMotion}
            isActive={hasEntered}
          />
          <ProjectsSection />
          <AboutSection />
          <SkillsSection
            lowPowerMode={lowPowerMode}
            prefersReducedMotion={prefersReducedMotion}
          />
          <EducationSection />
          <ContactSection />
        </main>
        <SiteFooter />
      </div>
      {hasEntered ? null : (
        <OpeningSequence
          onComplete={enterExperience}
          skipForPerformance={disableAmbientMotion}
        />
      )}
    </div>
  );
}
