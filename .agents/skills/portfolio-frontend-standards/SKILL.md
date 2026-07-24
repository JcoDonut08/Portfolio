---
name: portfolio-frontend-standards
description: Enforce this portfolio's frontend engineering and interface-quality standards. Use for any task that creates, changes, refactors, reviews, or fixes React/Next.js components, hooks, styling, layouts, interactions, animation, images, accessibility, or responsive behavior in this repository.
---

# Portfolio Frontend Standards

Build portfolio UI that is responsive, reusable, accessible, performant, and consistent with the existing visual system.

## Start With Context

1. Read `PRODUCT.md` and `DESIGN.md` when the task affects appearance or interaction.
2. Inspect the relevant components and existing tokens before introducing new patterns.
3. Read `../../rules/frontend-quality.md` and treat its requirements as the acceptance checklist.
4. Preserve existing copy, behavior, and visual identity unless the user explicitly requests a change.

## Implement Deliberately

- Design mobile-first, then verify intermediate and desktop widths.
- Prefer semantic HTML and CSS layout primitives before JavaScript layout logic.
- Reuse an existing component, hook, token, or utility when it already expresses the behavior.
- Extract a component when a UI unit repeats, owns meaningful behavior, or has a clear independent responsibility.
- Extract a hook only when stateful behavior is reused or isolating it materially clarifies the component.
- Keep one-off presentation local. Do not create abstractions that only rename a few lines.
- Keep client components and browser-only state as narrow as practical.
- Preserve reduced-motion behavior for every animation.

## Verify Before Handoff

1. Test the smallest supported phone layout, a tablet/intermediate layout, and a desktop layout.
2. Check keyboard use, focus visibility, semantic names, contrast, overflow, and touch targets.
3. Exercise hover, focus, active, loading, empty, and reduced-motion states relevant to the change.
4. Run `npm run lint` and `npm run build`.
5. Report what changed, what was verified, and any remaining limitation.
