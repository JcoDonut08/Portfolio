"use client";

import { useEffect, useState } from "react";

export function useActiveSection<T extends string>(
  sectionIds: readonly T[],
  isEnabled: boolean,
) {
  const [activeSection, setActiveSection] = useState<T | null>(null);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    let animationFrame: number | null = null;

    const updateActiveSection = () => {
      animationFrame = null;

      const activationLine = Math.min(window.innerHeight * 0.32, 220);
      let nextActiveSection: T | null = null;

      for (const sectionId of sectionIds) {
        const section = document.getElementById(sectionId);

        if (!section || section.getBoundingClientRect().top > activationLine) {
          continue;
        }

        nextActiveSection = sectionId;
      }

      const lastSection = sectionIds.at(-1) ?? null;
      const isAtPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;

      if (isAtPageEnd && lastSection) {
        nextActiveSection = lastSection;
      }

      setActiveSection((currentSection) =>
        currentSection === nextActiveSection
          ? currentSection
          : nextActiveSection,
      );
    };

    const scheduleUpdate = () => {
      if (animationFrame !== null) {
        return;
      }

      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    return () => {
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame);
      }

      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("scroll", scheduleUpdate);
    };
  }, [isEnabled, sectionIds]);

  return activeSection;
}
