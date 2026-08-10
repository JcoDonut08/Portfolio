"use client";

import Image from "next/image";
import { useState, type CSSProperties, type PointerEvent } from "react";

type PortfolioCardProps = {
  disableMotion?: boolean;
  imageSrc: string;
  priority?: boolean;
};

type Tilt = {
  x: number;
  y: number;
};

const restingTilt: Tilt = { x: 0, y: 0 };

function LeoCardBack() {
  const stars = [
    [44, 90, 4.8],
    [42, 59, 4.1],
    [62, 39, 5.1],
    [149, 35, 4.5],
    [206, 74, 5.2],
    [149, 69, 4.2],
    [57, 16, 4.4],
    [18, 4, 5],
    [7, 17, 4.1],
  ] as const;

  return (
    <svg
      aria-hidden="true"
      className="portfolio-card-leo"
      viewBox="0 0 220 100"
    >
      <defs>
        <radialGradient id="leo-star-glow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.24" stopColor="#b9ceff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#5d84ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        className="portfolio-card-leo-line"
        d="M44 90 42 59 62 39 149 35 206 74 149 69 44 90M62 39 57 16 18 4 7 17"
      />
      {stars.map(([cx, cy, radius]) => (
        <g key={`${cx}-${cy}`}>
          <circle fill="url(#leo-star-glow)" cx={cx} cy={cy} r={radius * 3.6} />
          <circle className="portfolio-card-leo-star" cx={cx} cy={cy} r={radius / 2.8} />
        </g>
      ))}
    </svg>
  );
}

function CompassMark() {
  return (
    <svg aria-hidden="true" className="portfolio-card-compass" viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="3" />
      <path d="m32 4 3 25 25 3-25 3-3 25-3-25-25-3 25-3Z" />
      <path d="m32 14 1.5 16.5L50 32l-16.5 1.5L32 50l-1.5-16.5L14 32l16.5-1.5Z" />
    </svg>
  );
}

export function PortfolioCard({
  disableMotion = false,
  imageSrc,
  priority = true,
}: PortfolioCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState<Tilt>(restingTilt);

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (disableMotion || event.pointerType !== "mouse") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const offsetY = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTilt({ x: offsetX * 8, y: offsetY * -6 });
  };

  const cardStyle = {
    "--portfolio-card-rotate-x": `${tilt.y}deg`,
    "--portfolio-card-rotate-y": `${tilt.x}deg`,
    "--portfolio-card-glare-x": `${(tilt.x + 4) * 10}%`,
    "--portfolio-card-glare-y": `${(4 - tilt.y) * 10}%`,
  } as CSSProperties;

  return (
    <button
      aria-label={isFlipped ? "Show Jericho's portrait card" : "Show Jericho's Leo card back"}
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
          <span aria-hidden="true" className="portfolio-card-edge portfolio-card-edge-outer" />
          <span aria-hidden="true" className="portfolio-card-edge portfolio-card-edge-inner" />
          <span aria-hidden="true" className="portfolio-card-hologram" />

          <span className="portfolio-card-portrait">
            <Image
              alt="Jericho Paul Salvador taking a mirror selfie"
              fill
              priority={priority}
              sizes="(max-width: 640px) 46vw, (max-width: 900px) 38vw, 420px"
              src={imageSrc}
            />
            <span aria-hidden="true" className="portfolio-card-photo-grade" />
          </span>

          <span aria-hidden="true" className="portfolio-card-registration">
            <i />
            <i />
            <i />
          </span>

          <span className="portfolio-card-plaque">
            <span className="portfolio-card-signature-wrap">
              <span className="portfolio-card-signature">JPSalvador</span>
              <span className="portfolio-card-name">Jericho Paul Salvador</span>
            </span>
            <span className="portfolio-card-compass-wrap">
              <CompassMark />
            </span>
          </span>

          <span className="portfolio-card-flip-hint">
            <span>Reveal Leo</span>
            <span aria-hidden="true">↗</span>
          </span>
        </span>

        <span className="portfolio-card-face portfolio-card-back">
          <span aria-hidden="true" className="portfolio-card-edge portfolio-card-edge-outer" />
          <span aria-hidden="true" className="portfolio-card-edge portfolio-card-edge-inner" />
          <span aria-hidden="true" className="portfolio-card-hologram" />

          <span aria-hidden="true" className="portfolio-card-back-pattern" />
          <span aria-hidden="true" className="portfolio-card-back-orbit portfolio-card-back-orbit-one" />
          <span aria-hidden="true" className="portfolio-card-back-orbit portfolio-card-back-orbit-two" />
          <span aria-hidden="true" className="portfolio-card-back-orbit portfolio-card-back-orbit-three" />

          <span className="portfolio-card-back-brand">
            <span>JPSalvador</span>
            <span>Celestial archive</span>
          </span>

          <span className="portfolio-card-leo-seal">
            <span aria-hidden="true" className="portfolio-card-leo-halo" />
            <LeoCardBack />
            <span className="portfolio-card-leo-label">
              <span>Leo</span>
              <span>Fire · Fixed · Sun</span>
            </span>
          </span>

          <span className="portfolio-card-back-footer">
            <span>VIII · XIX — MMXXVI</span>
            <span>Return to portrait ↙</span>
          </span>
        </span>
      </span>
    </button>
  );
}
