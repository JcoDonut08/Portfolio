"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

const introLines = [
  "A signal sharpens.",
  "Ideas take shape.",
  "Motion finds its rhythm.",
  "Jericho / Creative Developer.",
];

const statusItems = ["signal", "interface", "motion"];
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
    const timer = window.setTimeout(dismiss, 4200);

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
          exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="noise-layer absolute inset-0" />
          <motion.div
            animate={{
              opacity: [0.1, 0.34, 0.2],
              scale: [0.8, 1.16, 1],
              x: ["-10%", "4%", "0%"],
            }}
            className="absolute left-[-18rem] top-[-14rem] h-[36rem] w-[36rem] rounded-full bg-cyan/30 blur-3xl"
            transition={{ duration: 3.6, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            animate={{
              opacity: [0.06, 0.28, 0.18],
              scale: [0.9, 1.2, 1.05],
              x: ["8%", "-5%", "0%"],
            }}
            className="absolute bottom-[-18rem] right-[-16rem] h-[38rem] w-[38rem] rounded-full bg-magenta/28 blur-3xl"
            transition={{ delay: 0.28, duration: 3.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            animate={{ rotate: 180, scale: [0.86, 1.04, 0.98], opacity: [0, 0.42, 0.2] }}
            className="absolute h-[min(82vw,34rem)] w-[min(82vw,34rem)] rounded-full border border-cyan/25"
            transition={{ duration: 3.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            animate={{ rotate: -150, scale: [1.08, 0.92, 1.02], opacity: [0, 0.3, 0.18] }}
            className="absolute h-[min(95vw,42rem)] w-[min(95vw,42rem)] rounded-full border border-amber/25"
            transition={{ delay: 0.18, duration: 3.7, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            animate={{ scaleX: [0, 1, 0.82, 0.24], opacity: [0, 1, 0.7, 0.28] }}
            className="absolute h-px w-[min(42rem,84vw)] bg-cyan"
            transition={{ duration: 3.35, ease: [0.16, 1, 0.3, 1] }}
          />
          <div className="relative flex w-full max-w-[min(44rem,calc(100vw-3rem))] flex-col gap-4 sm:gap-5">
            {introLines.map((line, index) => (
              <motion.p
                animate={{
                  filter: "blur(0px)",
                  opacity: index === introLines.length - 1 ? 1 : 0.66,
                  x: 0,
                }}
                className="max-w-full whitespace-normal break-words font-display text-[clamp(1.15rem,5vw,5.2rem)] font-semibold uppercase leading-[1.05] tracking-normal text-bone sm:leading-[0.92]"
                initial={{ filter: "blur(14px)", opacity: 0, x: -38 }}
                key={line}
                transition={{
                  delay: 0.34 + index * 0.46,
                  duration: 0.78,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                {line}
              </motion.p>
            ))}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 grid max-w-md grid-cols-3 gap-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-stone sm:text-xs"
              initial={{ opacity: 0, y: 16 }}
              transition={{ delay: 2.25, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            >
              {statusItems.map((item, index) => (
                <span className="border border-white/15 px-2 py-2 text-center" key={item}>
                  <motion.span
                    animate={{ opacity: [0.35, 1, 0.55] }}
                    className="mr-1 inline-block text-cyan"
                    transition={{
                      delay: 2.35 + index * 0.18,
                      duration: 0.9,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    +
                  </motion.span>
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
          <div className="absolute inset-x-5 bottom-6 max-w-md sm:left-6 sm:right-auto">
            <div className="mb-2 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.16em] text-stone">
              <span>Opening signal</span>
              <span>4.0s</span>
            </div>
            <div className="h-px overflow-hidden bg-white/15">
              <motion.div
                animate={{ scaleX: 1 }}
                className="h-full origin-left bg-cyan"
                initial={{ scaleX: 0 }}
                transition={{ duration: 3.9, ease: "linear" }}
              />
            </div>
          </div>
          <button
            className="absolute right-5 top-5 rounded-full border border-white/20 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-stone transition hover:border-cyan hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan sm:right-6 sm:top-6 sm:px-4 sm:text-xs sm:tracking-[0.14em]"
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
