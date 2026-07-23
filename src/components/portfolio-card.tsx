"use client";

import Image from "next/image";
import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";

type PortfolioCardProps = {
  imageSrc: string;
};

type Tilt = {
  x: number;
  y: number;
};

const restingTilt: Tilt = { x: 0, y: 0 };

export function PortfolioCard({ imageSrc }: PortfolioCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState<Tilt>(restingTilt);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);

    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({ x: offsetX * 9, y: offsetY * -7 });
  };

  const cardStyle = {
    "--portfolio-card-rotate-x": `${tilt.y}deg`,
    "--portfolio-card-rotate-y": `${tilt.x}deg`,
  } as CSSProperties;

  return (
    <button
      aria-label={isFlipped ? "Show Jericho's profile card" : "Show Jericho's skills card"}
      aria-pressed={isFlipped}
      className={`portfolio-card${isFlipped ? " is-flipped" : ""}`}
      onClick={() => setIsFlipped((value) => !value)}
      onPointerLeave={() => setTilt(restingTilt)}
      onPointerMove={handlePointerMove}
      style={cardStyle}
      type="button"
    >
      <span className="portfolio-card-inner">
        <span className="portfolio-card-face portfolio-card-front">
          <span className="portfolio-card-topline">
            <span className="portfolio-card-mark">JPS</span>
            <span>Creative practice</span>
            <span className="portfolio-card-year">2026<i aria-hidden="true" /></span>
          </span>

          <span className="portfolio-card-photo-row">
            <span className="portfolio-card-photo">
              <Image
                alt="Jericho Paul Salvador taking a mirror selfie"
                fill
                priority
                sizes="(max-width: 640px) 52vw, (max-width: 900px) 38vw, 420px"
                src={imageSrc}
              />
            </span>
          </span>

          <span className="portfolio-card-identity">
            <span className="portfolio-card-discipline">Frontend / UI UX / Motion</span>
            <span className="portfolio-card-name">Jericho Paul Salvador</span>
            <span className="portfolio-card-summary">
              Crafting meaningful interfaces with precision, purpose, and a touch of motion.
            </span>
          </span>

          <span className="portfolio-card-footer">
            <span className="portfolio-card-system">
              <span aria-hidden="true" className="portfolio-card-system-mark">◈</span>
              <span>
                <span>Interface systems</span>
                <span>Pixel perfect · Accessible · Impactful</span>
              </span>
            </span>
            <span className="portfolio-card-flip-action">
              <span>Flip for skills</span>
              <span aria-hidden="true" className="portfolio-card-flip-glyph">→</span>
            </span>
          </span>
        </span>

        <span className="portfolio-card-face portfolio-card-back">
          <span className="portfolio-card-topline">
            <span className="portfolio-card-mark">JPS</span>
            <span>What I make</span>
            <span className="portfolio-card-year">Flip side<i aria-hidden="true" /></span>
          </span>

          <span className="portfolio-card-back-copy">
            <span className="portfolio-card-back-title">Make the idea move.</span>
            <span className="portfolio-card-back-summary">
              Clear interfaces with enough character to be remembered.
            </span>
          </span>

          <span className="portfolio-card-skills">
            <span>Front-end systems</span>
            <span>UI/UX direction</span>
            <span>Creative development</span>
          </span>

          <span className="portfolio-card-footer">
            <span>Click to return</span>
            <span className="portfolio-card-flip-action">
              <span>Back to profile</span>
              <span aria-hidden="true" className="portfolio-card-flip-glyph">←</span>
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
