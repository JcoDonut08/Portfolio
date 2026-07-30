"use client";

import { useEffect, useRef, useState } from "react";

type SiteNavigationProps = {
  isActive: boolean;
};

const navigationItems = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteNavigation({ isActive }: SiteNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const updateScrollState = () => setIsScrolled(window.scrollY > 24);

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => window.removeEventListener("scroll", updateScrollState);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    const closeOutsideMenu = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOutsideMenu);

    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOutsideMenu);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const desktopNavigation = window.matchMedia("(min-width: 901px)");
    const closeAtDesktopWidth = () => {
      if (desktopNavigation.matches) {
        setIsMenuOpen(false);
      }
    };

    desktopNavigation.addEventListener("change", closeAtDesktopWidth);

    return () =>
      desktopNavigation.removeEventListener("change", closeAtDesktopWidth);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsMenuOpen(false);
    }
  }, [isActive]);

  return (
    <header
      className={`hero-nav site-navigation${isActive ? " is-active" : ""}${
        isScrolled ? " is-scrolled" : ""
      }${isMenuOpen ? " is-menu-open" : ""}`}
      ref={headerRef}
    >
      <div className="hero-brand">
        <a aria-label="Jericho Paul Salvador — home" className="hero-logo" href="#home">
          JPS
        </a>
        <a className="hero-name" href="#home">
          Jericho Paul Salvador
        </a>
      </div>

      <button
        aria-controls="primary-navigation"
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        className="nav-menu-toggle"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        ref={menuButtonRef}
        type="button"
      >
        <span aria-hidden="true" className="nav-menu-glyph">
          <span />
          <span />
        </span>
      </button>

      <nav
        aria-label="Primary navigation"
        className="hero-nav-links"
        id="primary-navigation"
      >
        {navigationItems.map((item) => (
          <a
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          className="site-nav-resume"
          download
          href="/assets/resume/Jericho-Salvador-Resume.pdf"
          onClick={() => setIsMenuOpen(false)}
        >
          Résumé
        </a>
      </nav>
    </header>
  );
}
