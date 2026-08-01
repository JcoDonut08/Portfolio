"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { OpeningSequence } from "@/components/opening-sequence";
import { SiteHeader } from "@/components/site-header";
import { projects } from "@/data/projects";
import { siteConfig } from "@/lib/site";

const HeroScene = dynamic(
  () => import("@/components/hero-scene").then((module) => module.HeroScene),
  {
    loading: () => (
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,230,226,0.24),transparent_42%)]" />
    ),
    ssr: false,
  },
);

const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const accentClasses = {
  amber: "text-amber border-amber/45",
  cyan: "text-cyan border-cyan/45",
  magenta: "text-magenta border-magenta/45",
};

export function AnimatedHome() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-bone">
      <OpeningSequence />
      <div className="noise-layer fixed inset-0" />
      <SiteHeader />

      <section className="relative isolate min-h-[calc(100vh-4.5rem)] overflow-hidden px-5 py-14 sm:px-8 lg:py-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute right-[-24rem] top-[-12rem] h-[48rem] w-[48rem] rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute bottom-[-16rem] left-[-18rem] h-[38rem] w-[38rem] rounded-full bg-magenta/10 blur-3xl" />
        </div>

        <div className="mx-auto grid min-h-[78vh] w-full max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 max-w-3xl"
            initial={{ opacity: 0, y: 26 }}
            transition={{ delay: 0.18, duration: 0.72, ease: easeOutExpo }}
          >
            <p className="mb-6 max-w-max border border-cyan/35 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-cyan">
              Jericho / Creative Developer
            </p>
            <h1 className="font-display text-[clamp(3.4rem,12vw,6rem)] font-semibold uppercase leading-[0.88] tracking-normal text-bone">
              Motion-led websites for ideas that need a pulse.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-stone sm:text-lg">
              I shape cinematic interfaces, animated frontends, and polished web
              experiences that make clients feel the craft before they read the
              stack.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <motion.a
                className="inline-flex items-center justify-center rounded-full bg-bone px-6 py-3 text-sm font-semibold text-night transition hover:bg-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                href={`mailto:${siteConfig.email}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Contact me
              </motion.a>
              <motion.a
                className="inline-flex items-center justify-center rounded-full border border-white/[0.18] px-6 py-3 text-sm font-semibold text-bone transition hover:border-magenta hover:text-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
                href="#work"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                View projects
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative min-h-[22rem] overflow-hidden border border-white/10 bg-ink/70 sm:min-h-[30rem] lg:min-h-[40rem]"
            initial={{ opacity: 0, scale: 0.96 }}
            transition={{ delay: 0.35, duration: 0.8, ease: easeOutExpo }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(50,230,226,0.2),transparent_48%)]" />
            <HeroSignalFallback />
            {prefersReducedMotion ? null : <HeroScene />}
            <div className="pointer-events-none absolute inset-x-5 bottom-5 flex items-center justify-between border-t border-white/10 pt-4 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-stone">
              <span>Live signal field</span>
              <span>R3F / Motion / UI</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="work">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-sm text-cyan">Selected work</p>
              <h2 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,7vw,4.7rem)] font-semibold uppercase leading-[0.92] text-bone">
                Built to feel sharp before the first click.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-stone">
              These are polished placeholders for now. Swap in your real case
              studies, screenshots, and links when they are ready.
            </p>
          </div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                className="group flex min-h-[22rem] flex-col justify-between border border-white/[0.12] bg-bone/[0.035] p-6 transition hover:border-white/[0.28] hover:bg-bone/[0.06]"
                initial={{ opacity: 0, y: 24 }}
                key={project.title}
                transition={{
                  delay: index * 0.08,
                  duration: 0.56,
                  ease: easeOutExpo,
                }}
                viewport={{ once: true, margin: "-80px" }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div>
                  <p
                    className={`inline-flex border px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] ${
                      accentClasses[project.accent as keyof typeof accentClasses]
                    }`}
                  >
                    {project.type}
                  </p>
                  <h3 className="mt-8 font-display text-4xl font-semibold uppercase leading-none text-bone">
                    {project.title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-stone">
                    {project.description}
                  </p>
                </div>
                <div className="mt-10 flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      className="rounded-full bg-white/[0.08] px-3 py-1 text-xs text-bone/[0.82]"
                      key={item}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="about">
        <div className="mx-auto grid max-w-7xl gap-10 border-y border-white/10 py-14 lg:grid-cols-[0.78fr_1.22fr]">
          <p className="font-mono text-sm text-magenta">About the craft</p>
          <div>
            <h2 className="font-display text-[clamp(2.1rem,6vw,4rem)] font-semibold uppercase leading-[0.96] text-bone">
              I care about the moment where design stops being a mockup and
              starts responding.
            </h2>
            <div className="mt-8 grid gap-6 text-sm leading-7 text-stone md:grid-cols-2">
              <p>
                The work is frontend-focused: clear structure, fast interactions,
                expressive motion, and interfaces that still behave properly when
                the screen gets small.
              </p>
              <p>
                The goal is not animation everywhere. It is rhythm, feedback, and
                a memorable first impression that supports the visitor instead of
                slowing them down.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8" id="contact">
        <motion.div
          className="mx-auto flex max-w-7xl flex-col items-start gap-8 bg-bone p-7 text-night sm:p-10 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 18 }}
          transition={{ duration: 0.56, ease: easeOutExpo }}
          viewport={{ once: true, margin: "-80px" }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="font-mono text-sm text-night/62">Available for the next build</p>
            <h2 className="mt-4 max-w-3xl font-display text-[clamp(2.5rem,7vw,5rem)] font-semibold uppercase leading-[0.9] text-night">
              Let&apos;s make the interface feel alive.
            </h2>
          </div>
          <motion.a
            className="inline-flex rounded-full bg-night px-6 py-3 text-sm font-semibold text-bone transition hover:bg-magenta focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-night"
            href={`mailto:${siteConfig.email}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Contact me
          </motion.a>
        </motion.div>
      </section>
    </main>
  );
}

function HeroSignalFallback() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/35" />
      <div className="absolute left-1/2 top-1/2 h-[38%] w-[78%] -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-full border border-magenta/35" />
      <div className="absolute left-1/2 top-1/2 h-[72%] w-[72%] -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-full border border-amber/30" />
      <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan/20 blur-2xl" />
    </div>
  );
}
