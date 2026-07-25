"use client";

import { useEffect } from "react";

const revealSelector = "[data-reveal]";

export function useScrollReveals(isEnabled: boolean) {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const experience = document.querySelector<HTMLElement>(".portfolio-experience");
    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>(revealSelector),
    );

    if (!experience || revealElements.length === 0) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -12% 0px",
        threshold: 0.12,
      },
    );

    revealElements.forEach((element) => {
      const bounds = element.getBoundingClientRect();

      if (bounds.top < window.innerHeight * 0.9) {
        element.classList.add("is-revealed");
      } else {
        observer.observe(element);
      }
    });

    const readyFrame = window.requestAnimationFrame(() => {
      experience.classList.add("motion-ready");
    });

    return () => {
      window.cancelAnimationFrame(readyFrame);
      observer.disconnect();
      experience.classList.remove("motion-ready");
    };
  }, [isEnabled]);
}
