"use client";

import { useEffect, useRef, useState } from "react";

import { useActiveSection } from "@/hooks/use-active-section";

type SiteNavigationProps = {
  isActive: boolean;
};

const navigationItems = [
  { href: "#projects", id: "projects", label: "Projects" },
  { href: "#about", id: "about", label: "About" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#education", id: "education", label: "Education" },
  { href: "#contact", id: "contact", label: "Contact" },
] as const;

const navigationSectionIds = navigationItems.map((item) => item.id);

export function SiteNavigation({ isActive }: SiteNavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = useActiveSection(navigationSectionIds, isActive);
  const activeSectionLabel =
    navigationItems.find((item) => item.id === activeSection)?.label ?? "Home";
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

      <span aria-hidden="true" className="site-navigation-section-readout">
        <strong>{activeSectionLabel}</strong>
      </span>

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
            aria-current={activeSection === item.id ? "location" : undefined}
            href={item.href}
            key={item.href}
            onClick={() => setIsMenuOpen(false)}
          >
            <span>{item.label}</span>
            <span aria-hidden="true" className="site-nav-current-status">
              Current
            </span>
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
