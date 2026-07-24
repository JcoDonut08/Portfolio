# Frontend Quality Rules

These rules apply to all UI work in this repository.

## Responsive by Default

- Support viewports from `320px` upward without horizontal scrolling.
- Start with the narrow layout; enhance at content-driven breakpoints.
- Verify at approximately `360px`, `768px`, and `1440px`, plus short landscape screens when the hero uses viewport height.
- Use fluid sizing (`clamp`, percentages, flexible grids) where it improves continuity.
- Respect safe-area insets and prefer `100dvh` over `100vh` for full-screen mobile experiences.
- Never hide essential content or interactions merely to make a narrow layout fit.

## Reusable Architecture

- Search for an existing component, hook, token, or utility before adding one.
- Keep components focused on one clear responsibility.
- Extract repeated UI and meaningful interactive units; avoid premature abstraction for one-off markup.
- Put reusable stateful behavior in typed custom hooks.
- Keep constants and static data outside render functions.
- Prefer composition over large components with many boolean branches.
- Avoid duplicated magic numbers; promote recurring design values to existing tokens.
- Do not add a dependency when the platform or current stack already solves the problem cleanly.

## React and Next.js

- Prefer Server Components; add `"use client"` only where browser APIs, state, or event handlers require it.
- Keep client boundaries small.
- Use `next/image` for project images and provide accurate `alt` text and responsive `sizes`.
- Prevent hydration differences, unstable keys, render-time side effects, and unnecessary effects.
- Clean up timers, listeners, observers, and animation resources.
- Keep props and hooks fully typed; do not use `any` to bypass design problems.

## Accessibility

- Use semantic elements and native controls before recreating behavior with ARIA.
- Ensure every interactive element is keyboard accessible and visibly focused.
- Maintain at least WCAG AA contrast: `4.5:1` for normal text and `3:1` for large text and interface graphics.
- Provide meaningful accessible names without duplicating visible text.
- Keep touch targets near `44px` where layout allows.
- Support `prefers-reduced-motion`; content must remain available when motion is disabled.
- Do not rely on color alone to convey state.

## Visual and Motion Quality

- Follow `DESIGN.md` tokens and established component conventions.
- Preserve deliberate hierarchy, readable line lengths, and consistent spacing.
- Avoid accidental overflow, clipped focus rings, illegible background effects, and content-obscuring decoration.
- Animate transforms and opacity where possible; avoid layout-thrashing animation.
- Motion must explain state, reinforce hierarchy, or add restrained atmosphere.

## Required Verification

- Run `npm run lint`.
- Run `npm run build`.
- Inspect relevant pages at phone, tablet, and desktop sizes.
- Check console/runtime errors and the interactions changed by the task.
- Check a reduced-motion rendering when animation changed.
- Do not claim completion when required checks fail; report the failure and its cause.
