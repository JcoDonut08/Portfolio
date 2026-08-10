"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { PortfolioCard } from "@/components/portfolio-card";
import { siteConfig } from "@/lib/site";

const roles = [
  "front-end developer",
  "back-end developer",
  "UI/UX designer",
  "creative developer",
];

function GitHubIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M12 2.35a9.65 9.65 0 0 0-3.05 18.8c.48.09.66-.2.66-.46v-1.7c-2.68.58-3.25-1.14-3.25-1.14-.44-1.12-1.08-1.42-1.08-1.42-.88-.6.07-.59.07-.59.97.07 1.48 1 1.48 1 .87 1.47 2.27 1.05 2.82.8.09-.62.34-1.05.61-1.29-2.14-.24-4.39-1.07-4.39-4.77 0-1.06.38-1.93 1-2.61-.1-.25-.44-1.24.1-2.58 0 0 .82-.26 2.65 1a9.2 9.2 0 0 1 4.82 0c1.83-1.26 2.65-1 2.65-1 .54 1.34.2 2.33.1 2.58.62.68 1 1.55 1 2.61 0 3.71-2.25 4.52-4.4 4.76.35.3.65.88.65 1.77v2.63c0 .26.18.55.66.46A9.65 9.65 0 0 0 12 2.35Z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M5.1 8.4H2.25V21h2.86V8.4ZM3.68 3A1.68 1.68 0 1 0 3.7 6.37 1.68 1.68 0 0 0 3.68 3ZM21.75 13.77c0-3.8-2.03-5.57-4.74-5.57-2.18 0-3.16 1.2-3.7 2.05V8.4h-2.86V21h2.86v-6.23c0-1.64.31-3.23 2.34-3.23 2 0 2.03 1.87 2.03 3.34V21h2.85l.01-7.23Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M3.75 5.25h16.5c.83 0 1.5.67 1.5 1.5v10.5c0 .83-.67 1.5-1.5 1.5H3.75c-.83 0-1.5-.67-1.5-1.5V6.75c0-.83.67-1.5 1.5-1.5Zm.12 2.07 8.13 6.16 8.13-6.16H3.87Zm16.38 9.81V9.11l-7.5 5.68a1.25 1.25 0 0 1-1.5 0l-7.5-5.68v8.02h16.5Z" />
    </svg>
  );
}

type HeroSectionProps = {
  disableAmbientMotion: boolean;
  isActive: boolean;
};

export function HeroSection({
  disableAmbientMotion,
  isActive,
}: HeroSectionProps) {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (disableAmbientMotion) {
      setRoleIndex(0);
      return;
    }

    const timer = window.setTimeout(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2600);

    return () => window.clearTimeout(timer);
  }, [disableAmbientMotion, isActive, roleIndex]);

  const handleSignalPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (disableAmbientMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 16;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;

    event.currentTarget.style.setProperty("--hero-signal-x", `${x}px`);
    event.currentTarget.style.setProperty("--hero-signal-y", `${y}px`);
  };

  const resetSignalPosition = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--hero-signal-x", "0px");
    event.currentTarget.style.setProperty("--hero-signal-y", "0px");
  };

  return (
    <section
      className={`hero-section${isActive ? " is-active" : ""}`}
      id="home"
      onPointerLeave={resetSignalPosition}
      onPointerMove={handleSignalPointerMove}
    >
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-intro">Hello, I&apos;m</p>
          <h1>
            Jericho <span>Paul Salvador.</span>
          </h1>
          <p className="hero-role" aria-label={`I am a ${roles[roleIndex]}`}>
            I&apos;m a <span className="hero-role-mask"><span className="hero-role-word" key={roles[roleIndex]}>{roles[roleIndex]}</span></span>
          </p>
          <p className="hero-summary">
            I build clear, expressive digital experiences where interface craft and motion do the talking.
          </p>
          <div className="hero-actions">
            <a className="hero-action hero-action-primary" href="#contact">
              Contact me <span aria-hidden="true">↓</span>
            </a>
            <a className="hero-action hero-action-secondary" href="#projects">
              View projects
            </a>
          </div>
          <div aria-label="Social links" className="hero-social-links">
            <a
              aria-label="GitHub"
              className="hero-social-link"
              href={siteConfig.githubUrl}
              rel="noreferrer"
              target="_blank"
            >
              <GitHubIcon />
            </a>
            <a
              aria-label="LinkedIn — temporarily unavailable"
              className="hero-social-link is-pending"
              href="/unavailable"
            >
              <LinkedInIcon />
            </a>
            <a
              aria-label={`Email ${siteConfig.email}`}
              className="hero-social-link"
              href={`mailto:${siteConfig.email}`}
            >
              <MailIcon />
            </a>
          </div>
        </div>

        <div className="hero-card-wrap">
          <PortfolioCard
            disableMotion={disableAmbientMotion}
            imageSrc="/assets/profile/jericho-paul-salvador-celestial.png"
          />
        </div>
      </div>
    </section>
  );
}
