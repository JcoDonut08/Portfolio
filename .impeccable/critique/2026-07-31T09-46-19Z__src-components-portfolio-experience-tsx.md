---
target: portfolio homepage UI/UX
total_score: 22
p0_count: 0
p1_count: 3
timestamp: 2026-07-31T09-46-19Z
slug: src-components-portfolio-experience-tsx
---
# Portfolio homepage UI/UX critique

Method: dual-agent (A: `/root/assessment_a` · B: `/root/assessment_b`)

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2/4 | Loading and submission states exist, but there is no active-section state and successful contact submission is only a changed button label. |
| 2 | Match between system and real world | 3/4 | Navigation and form language are clear; the faux boot sequence makes a portfolio feel like software initialization. |
| 3 | User control and freedom | 1/4 | Visitors cannot skip the 6.2-second intro and must click “Ready” before accessing the page. |
| 4 | Consistency and standards | 3/4 | The visual system is coherent, but the hero omits the declared “View work” secondary CTA. |
| 5 | Error prevention | 3/4 | Native constraints and server safeguards are strong; server field errors are not mapped back to individual fields. |
| 6 | Recognition rather than recall | 2/4 | Most controls are labeled, but the skills orbit depends heavily on recognizing logos and remembering hidden labels. |
| 7 | Flexibility and efficiency | 2/4 | Anchor navigation and keyboard support exist, but every route is delayed by the same entry gate. |
| 8 | Aesthetic and minimalist design | 2/4 | Distinctive and authored, but repeated cosmic decoration and language compete with project evidence. |
| 9 | Error recognition and recovery | 2/4 | Form content survives errors and email fallback exists, but the API promises highlighted fields that the UI never highlights. |
| 10 | Help and documentation | 2/4 | The site needs little documentation, but unusual interactions lack enough immediate guidance and the intro has no escape. |
| **Total** | | **22/40** | **Acceptable — strong identity, significant conversion friction.** |

## Anti-patterns verdict

### LLM assessment

This does not read as a generic template. The celestial field, reversible Leo identity card, draggable technology orbit, and project-specific visuals form a personal, recognizable world. The AI-adjacent weakness is over-theming: almost every section repeats space, signal, orbit, channel, motion, or gravity language. The metaphor stops feeling special when it has to carry every section.

### Deterministic scan

The detector returned 17 findings:

- `overused-font`: 16 hits in `src/app/globals.css` for the committed `Arial Narrow/Bahnschrift/Segoe UI` display stack. These are best treated as one typography advisory and likely substring false positives, not 16 defects.
- `codex-grid-background`: one hit at `src/app/globals.css:66`. The referenced texture is a radial-dot noise layer in an unused legacy component, not the detector’s prohibited tiled grid. Treat as a false positive for the resolved homepage.

No reliable browser overlay exists. Browser automation, a live URL, and screenshots were unavailable, and no server was started per user instruction. Evidence is source inspection plus the single detector run.

## Overall impression

The portfolio demonstrates taste and frontend ambition, but it makes the interaction itself the hero when the projects should be the belief-changing peak. The biggest opportunity is not adding more visual effects. It is moving credible work earlier and giving each project a clearer story: role, challenge, decision, and result.

## What is working

1. **Authored visual identity.** The zodiac geometry and Leo card feel personal rather than interchangeable with another developer portfolio.
2. **Strong accessibility intent.** Native controls, labeled sections, Escape handling, keyboard-aware skills, and reduced-motion branches show care even where gaps remain.
3. **Contact is a real workflow.** Meaningful labels, autocomplete, input constraints, async states, timeout recovery, security handling, and direct-email fallback are substantially better than a decorative contact form.

## Priority issues

### P1 — The opening gate spends attention before earning it

**Evidence:** `src/components/opening-sequence.tsx:6`, `:44-56`, `:162-166`; `src/components/portfolio-experience.tsx:51-70`.

**Why it matters:** Visitors wait 6.2 seconds and then click again before seeing positioning or work. This contradicts the product brief’s two-second opening and ban on click-to-enter gates. The overlay also nests a second `<main>`, creates two accessible `<h1>` elements, and leaves underlying controls in the accessibility tree.

**Fix:** Make the intro non-blocking and at most 1.5–2 seconds, provide an immediate Skip action, remember completion in `sessionStorage`, bypass it under reduced motion, make underlying content inert, and use only one `<main>`.

**Suggested command:** `$impeccable distill`

### P1 — The strongest proof appears too late

**Evidence:** `src/components/portfolio-experience.tsx:62-67`; `src/components/hero-section.tsx:110-120`.

**Why it matters:** Projects come after About, Skills, and Education. The hero’s secondary action downloads a résumé instead of fulfilling PRODUCT.md’s “View work” intent. Prospective clients must process biography and credentials before capability.

**Fix:** Put “View work” beside “Contact me,” move Projects directly after Hero, keep résumé tertiary, and compress Education unless academic recruiting is the primary goal.

**Suggested command:** `$impeccable layout`

### P1 — Project cards show technology, not enough evidence

**Evidence:** `src/components/projects-section.tsx:65-100`; `src/data/projects.ts:1-40`.

**Why it matters:** Each project has a screenshot, summary, stack, and repository, but not Jericho’s role, the hard problem, the design/engineering decision, outcome, or live experience. Three equal cards also flatten the hierarchy.

**Fix:** Lead with one featured case study. For each project add Role, Challenge, Key decision, and Result; include live demos when available and keep repositories secondary. Use honest qualitative outcomes when metrics do not exist—never invent numbers.

**Suggested command:** `$impeccable shape`

### P2 — Contact recovery is less clear than the API promises

**Evidence:** `src/components/contact-inquiry-form.tsx:142-169`, `:261-282`; `src/app/api/contact/route.ts:217-224`.

**Why it matters:** Server field errors are discarded while the response tells users to inspect highlighted fields. No inputs receive `aria-invalid`, error descriptions, or first-error focus. Success has no persistent live announcement.

**Fix:** Render field errors next to inputs, connect them with `aria-describedby`, set `aria-invalid`, focus the first error, add a polite success status, show the message-length requirement/counter, and keep direct email visible before failure.

**Suggested command:** `$impeccable harden`

### P2 — Positioning and skills require too much interpretation

**Evidence:** `src/components/hero-section.tsx:7-12`; `src/components/skills-section.tsx:96-143`; `src/components/skills-orbit-scene.tsx:141-148`.

**Why it matters:** Rotating among frontend, backend, UI/UX, and creative developer weakens the precise creative-frontend message. The 12-node orbit is memorable, but hidden labels and double arrow-key handling make skill discovery harder than a normal list.

**Fix:** Pin one role—“Creative frontend developer”—and describe backend/UI breadth in supporting text. Keep the orbit as the signature interaction, but add a visible grouped skills summary, make the orbit stage focusable, and prevent bubbled arrow-key events from rotating twice.

**Suggested command:** `$impeccable clarify`

## Persona red flags

### Jordan — first-time visitor

- The boot-language intro does not explain why a portfolio is unavailable.
- The rotating role label creates uncertainty about Jericho’s specialty.
- The pending LinkedIn icon looks actionable but is not a link.
- Technology names are not all visible without interacting with the orbit.

### Riley — stress tester

- Refreshing restarts the intro because completion is not persisted.
- Field-specific server errors are discarded by the client.
- Successful contact submission provides no durable receipt.
- Nested main landmarks and focusable content behind the overlay risk inconsistent assistive-technology behavior.

### Casey — distracted mobile visitor

- A six-second gate is especially expensive during an interruption-prone visit.
- Project proof and the contact workflow sit far down a long page.
- The large portrait and continuously rendering WebGL scene may be costly on slower devices.
- Contact draft state is lost on refresh.

### Avery — prospective client / creative director

- Several seconds pass before Avery sees positioning or work.
- Résumé credentials are promoted above the project portfolio.
- Repositories prove code access, but not ownership, creative decisions, delivery quality, or outcomes.
- Education and student framing can overshadow the stronger creative-developer positioning.

## Minor observations

- `src/components/portfolio-experience.tsx:51-70` — add a skip link before navigation/main content.
- `src/components/hero-section.tsx:132-134` — remove the pending LinkedIn placeholder until a real destination exists.
- `src/components/hero-section.tsx:145-147` and `src/components/about-section.tsx:30-35` — the same identity-card interaction appears twice, reducing its surprise.
- `src/components/contact-inquiry-form.tsx:153-155` — announce success through `role="status"` or `aria-live="polite"`.
- `src/components/contact-inquiry-form.tsx:198-205` — disable spellcheck for email.
- `src/components/skills-section.tsx:125-134` — keyboard instructions require a focusable group or should be assigned to the actual focusable nodes only.
- `src/app/globals.css:3561-3565` and `:5868-5878` — social/footer targets appear below the project’s near-44px touch-target standard.
- `src/app/globals.css:7870-7872` — forced no-wrap contact title may clip under zoom or localization.
- `src/app/layout.tsx:15-19` — add `theme-color`, canonical URL, and Open Graph/Twitter share metadata.
- The 10k-line global stylesheet contains multiple generations of overrides; split by section and remove dead styles to reduce visual drift.

## Questions to consider

- If a client leaves after ten seconds and seven were spent loading creativity, what proof did they see?
- Why is résumé download promoted above work when “View work” is the declared secondary action?
- Would the portfolio feel more authored if the celestial metaphor appeared in fewer, stronger moments?
- Should the page optimize first for clients, recruiters, or fellow creative developers? The current sequence attempts all three.
