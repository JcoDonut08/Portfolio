"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ZodiacField } from "@/components/zodiac-field";

const progressDuration = 6200;
const stepThresholds = [28, 49, 70];

const statementLines = [
  { words: ["Every", "great"], className: "splash-title-line-primary" },
  { words: ["future", "starts"], className: "splash-title-line-secondary" },
  { words: ["with", "an", "idea."], className: "splash-title-line-accent" },
];

const steps = [
  "Loading vision",
  "Loading creativity",
  "Loading innovation",
];

type OpeningSequenceProps = {
  onComplete?: () => void;
};

export function OpeningSequence({ onComplete }: OpeningSequenceProps) {
  const [progress, setProgress] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isIgnited, setIsIgnited] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    setHasMounted(true);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduceMotion = mediaQuery.matches;
    setPrefersReducedMotion(reduceMotion);

    if (reduceMotion) {
      setProgress(100);
      return;
    }

    const startedAt = performance.now();
    const timer = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / progressDuration) * 100);

      setProgress(nextProgress);

      if (nextProgress >= 100) {
        window.clearInterval(timer);
      }
    }, 50);

    const finishTimer = window.setTimeout(() => setProgress(100), progressDuration + 100);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(finishTimer);
    };
  }, []);

  useEffect(() => {
    if (!isIgnited || !onComplete) {
      return;
    }

    const exitTimer = window.setTimeout(() => setIsExiting(true), prefersReducedMotion ? 0 : 420);
    const completeTimer = window.setTimeout(onComplete, prefersReducedMotion ? 20 : 1120);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [isIgnited, onComplete, prefersReducedMotion]);

  const percentage = Math.round(progress);
  const isInitializing = progress >= 10;
  const isReady = progress >= 100;
  const enterExperience = () => {
    if (isReady && !isIgnited) {
      setIsIgnited(true);
    }
  };

  return (
    <main
      aria-labelledby="splash-statement"
      className={`splash-screen splash-title-sequence${hasMounted ? " is-mounted" : ""}${
        prefersReducedMotion ? " prefers-reduced-motion" : ""
      }${isReady ? " is-ready" : ""}${isIgnited ? " is-ignited" : ""}${isExiting ? " is-exiting" : ""}`}
    >
      <ZodiacField isActive={hasMounted} variant="splash" />
      <div aria-hidden="true" className="splash-light-leak" />
      <div aria-hidden="true" className="splash-light-sweep" />
      <div aria-hidden="true" className="splash-transition-ripple" />

      <section className="splash-stage">
        <h1
          aria-label="Every great future starts with an idea."
          className="splash-title"
          id="splash-statement"
        >
          {statementLines.map((line, lineIndex) => (
            <span
              aria-hidden="true"
              className={`splash-title-line ${line.className}`}
              key={line.className}
              style={{ "--line-delay": `${lineIndex * 280}ms` } as CSSProperties}
            >
              {line.words.map((word, wordIndex) => (
                <span
                  className="splash-title-word"
                  key={word}
                  style={{ "--word-delay": `${wordIndex * 120}ms` } as CSSProperties}
                >
                  {word}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className={`splash-process${isInitializing ? " is-active" : ""}`}>
          <p className="splash-process-label">Initializing experience…</p>
          <ul aria-label="Experience loading steps" aria-live="polite" className="splash-process-list">
            {steps.map((step, index) => {
              const isDone = progress >= stepThresholds[index];

              return (
                <li className={`splash-process-item${isDone ? " is-done" : ""}`} key={step}>
                  <span aria-hidden="true" className="splash-process-mark">
                    {isDone ? "✓" : "—"}
                  </span>
                  <span>{step}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <footer className="splash-footer">
        <div className="splash-footer-meta">
          <span className="splash-progress-status">{isReady ? "System ready" : "Building the signal"}</span>
          <span className="splash-progress-percent">{percentage}%</span>
        </div>
      </footer>

      <div
        aria-label="Experience loading progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percentage}
        className="splash-progress-track"
        role="progressbar"
      >
        <span className="splash-progress-fill" style={{ transform: `scaleX(${progress / 100})` }} />
      </div>

      <button
        aria-label="Enter Jericho Paul Salvador's portfolio"
        className={`splash-arrival-ready${isReady ? " is-visible" : ""}`}
        disabled={!isReady || isIgnited}
        onClick={enterExperience}
        type="button"
      >
        <span className="splash-arrival-title">Ready.</span>
      </button>
    </main>
  );
}
