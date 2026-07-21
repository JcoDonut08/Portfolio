"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const introLines = [
  "A signal sharpens.",
  "Ideas take shape.",
  "Motion becomes proof.",
  "Jericho / Creative Developer.",
];

const storageKey = "jericho-portfolio-intro-played";

export function OpeningSequence() {
  const prefersReducedMotion = useReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(storageKey, "true");
    } catch {
      // Session storage can be unavailable in strict browser modes.
    }

    setIsVisible(false);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsReady(true);
      return;
    }

    let hasPlayed = false;

    try {
      hasPlayed = window.sessionStorage.getItem(storageKey) === "true";
    } catch {
      hasPlayed = false;
    }

    setIsReady(true);

    if (hasPlayed) {
      return;
    }

    setIsVisible(true);
    const timer = window.setTimeout(dismiss, 2050);

    return () => window.clearTimeout(timer);
  }, [dismiss, prefersReducedMotion]);

  if (!isReady) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-night px-6"
          exit={{ opacity: 0, filter: "blur(10px)" }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="noise-layer absolute inset-0" />
          <motion.div
            animate={{ scaleX: [0, 1, 0.36], opacity: [0, 1, 0.35] }}
            className="absolute h-px w-[min(34rem,80vw)] bg-cyan"
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="relative flex w-full max-w-[min(44rem,calc(100vw-3rem))] flex-col gap-4 sm:gap-5">
            {introLines.map((line, index) => (
              <motion.p
                animate={{ opacity: index === introLines.length - 1 ? 1 : 0.62, x: 0 }}
                className="max-w-full whitespace-normal break-words font-display text-[clamp(1.15rem,5vw,5.2rem)] font-semibold uppercase leading-[1.05] tracking-normal text-bone sm:leading-[0.92]"
                initial={{ opacity: 0, x: -32 }}
                key={line}
                transition={{
                  delay: index * 0.22,
                  duration: 0.58,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.p>
            ))}
          </div>
          <button
            className="absolute bottom-5 right-5 rounded-full border border-white/20 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-stone transition hover:border-cyan hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:bottom-6 sm:right-6 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
            onClick={dismiss}
            type="button"
          >
            Skip intro
          </button>
          <div className="scanline absolute left-0 top-0 h-24 w-full bg-gradient-to-b from-transparent via-cyan/20 to-transparent blur-sm" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
