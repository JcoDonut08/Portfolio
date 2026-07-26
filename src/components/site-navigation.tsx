"use client";

import { useEffect, useState } from "react";

type SiteNavigationProps = {
  isActive: boolean;
};

export function SiteNavigation({ isActive }: SiteNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  return (
    <header
      className={`hero-nav site-navigation${isActive ? " is-active" : ""}${
        isScrolled ? " is-scrolled" : ""
      }`}
    >
      <div className="hero-brand">
        <a aria-label="Jericho Paul Salvador — home" className="hero-logo" href="#home">
          JPS
        </a>
        <a className="hero-name" href="#home">
          Jericho Paul Salvador
        </a>
      </div>
      <nav aria-label="Primary navigation" className="hero-nav-links">
        <a href="#about">About</a>
        <a href="#skills">Skills</a>
        <a href="#education">Education</a>
        <a
          className="site-nav-resume"
          download
          href="/assets/resume/Jericho-Salvador-Resume.pdf"
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
