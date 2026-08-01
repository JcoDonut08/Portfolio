---
target: src/components/portfolio-experience.tsx
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-01T07-30-27Z
slug: src-components-portfolio-experience-tsx
---
# Portfolio Experience Critique

## Design Health

| Category | Score | Notes |
|---|---:|---|
| Visibility of system status | 2/4 | Contact and skill states are visible, but the opening blocks access for nearly four seconds and navigation does not identify the active section. |
| Match between system and the real world | 3/4 | Most copy is direct, though labels such as “Open channel” and “Interactive system” add interpretation cost. |
| User control and freedom | 2/4 | Navigation and card controls work, but visitors cannot bypass the opening or pause the rotating role copy. |
| Consistency and standards | 3/4 | The visual language is coherent; the pending LinkedIn control and inconsistent “View project”/“View work” wording weaken it. |
| Error prevention | 3/4 | The contact form has native constraints, server validation, rate limiting, bot protection, and invalid-field focus. |
| Recognition rather than recall | 3/4 | Most destinations and card behavior are visible; the technology orbit’s interaction is mainly discoverable through assistive instructions. |
| Flexibility and efficiency of use | N/A | This is a portfolio experience rather than a recurring productivity workflow. |
| Aesthetic and minimalist design | 2/4 | The identity is strong, but decoration, repeated portrait/card imagery, dense labels, and long supporting sections compete with the project evidence. |
| Help users recognize, diagnose, and recover from errors | 3/4 | Inline form errors, focus management, a timeout, and direct email recovery are strong; the security widget can fail or expire without an immediate visible explanation. |
| Help and documentation | N/A | The experience should be self-explanatory and does not require documentation. |

**Total: 21/32 (65.6%) — Acceptable.**

## Overall Assessment

The portfolio is visually authored rather than template-like. The celestial signature, zodiac field, aerospace ID card, Leo reverse, and draggable technology orbit form a coherent personal identity. The largest weakness is not visual polish: the presentation currently makes a stronger case for taste than for the ability to solve, build, and ship useful work.

The cognitive load is moderate. Grouping and hierarchy are generally good, but the header presents six destinations, the footer seven, and the contact category five. The hero also asks visitors to process a role animation, celestial background, interactive card, two calls to action, and three social controls at once. These are manageable individually, but together they compete for attention.

The emotional journey begins with authorship but risks turning into impatience during the fixed opening. The hero is the strongest memorable peak. The main trust valley appears in Projects: it promises three real builds, but two projects are represented by generic subject photography and every project leads only to a repository. About, the repeated card, Skills, and Education then extend the journey before the final conversion moment. Contact is a strong ending because it combines a form, direct email, GitHub, location, clear state handling, and a focused closing statement.

## What Is Working

1. **A distinctive identity system.** The opening signature, zodiac graphics, card, and technology orbit belong to the same world. The Leo reverse side is especially memorable.
2. **Conversion-aware information architecture.** Projects already follows the hero, Contact is a primary action, and the experience ends with a direct contact route.
3. **A solid accessibility and state foundation.** The implementation includes semantic controls and headings, keyboard support, focus management, Escape behavior, reduced-motion handling, safe-area spacing, inline form errors, live status, and a keyboard-operable technology orbit.
4. **Several good performance decisions.** Images use Next.js optimization, the WebGL card is lazy/near-viewport loaded, rendering quality is constrained, and reduced-motion users receive a lighter experience.

## Priority Issues

### 1. P1 — Projects do not yet provide enough proof

**Why it matters:** Recruiters and potential clients need to understand what you personally did, why decisions were made, and what changed as a result. Generic farm and cake photography communicates the subject of the projects, not the quality of their interfaces. Repository-only destinations also assume the reviewer wants to inspect code before seeing the outcome.

**Recommended fix:** Use real interface captures for every project. Give one flagship project dominant visual space, then add a compact proof strip with your role, the problem or constraint, one important design/engineering decision, and a measurable or concrete result. Make a case study or live demo the primary action when available, with the repository as supporting evidence.

**Suggested command:** `$impeccable shape` to redesign the project hierarchy and evidence model.

### 2. P1 — The opening sequence blocks the visitor’s task

**Why it matters:** On each visit the portfolio remains `aria-hidden`, inert, and scroll-locked for roughly 3.8 seconds. The opening has no control and the pre-hydration state also depends on JavaScript to unlock the content. This is a meaningful cost for repeat visitors, keyboard users, and anyone arriving with a specific task. Reduced motion correctly bypasses it, but everyone else is forced through it.

**Recommended fix:** Keep the signature as atmosphere, but make it non-blocking or substantially shorter. Ideally reveal the portfolio as soon as it is usable and let the signature finish above it. If the full cinematic opening remains, provide an immediate Skip control and ensure the underlying document is usable if JavaScript fails.

**Suggested command:** `$impeccable animate` to preserve the authored motion while restoring control and progressive enhancement.

### 3. P2 — The professional positioning is broader than the evidence

**Why it matters:** The hero cycles through frontend developer, backend developer, UI/UX designer, and creative developer. That breadth makes the visitor decide what you are best at, while the strongest visual evidence points toward a creative frontend developer. The promise “Motion becomes proof” is also not yet demonstrated by project explanations, decisions, or outcomes.

**Recommended fix:** Choose one stable primary proposition and make the other abilities supporting strengths. Compress Education and the technology inventory enough to create more room for project thinking, collaboration, constraints, and outcomes.

**Suggested command:** `$impeccable clarify` to align the hero promise, section copy, and project evidence.

### 4. P2 — A few states still feel unfinished or ambiguous

**Why it matters:** LinkedIn is styled like the other social actions but is a non-interactive “pending” element. Active-navigation styling exists but no section is marked current. “View project” leads to a plural projects section while “View work” expresses the same destination differently. The Turnstile security widget clears its token on error or expiry, but it does not immediately explain the failure; visitors see a generic security-check error only after submitting.

**Recommended fix:** Remove the LinkedIn control until the profile exists or provide a real destination. Standardize CTA wording, wire active section state to `aria-current`, and give the security challenge visible loading, expired, and failure messages beside the widget.

**Suggested command:** `$impeccable harden` to complete interaction, validation, and recovery states.

### 5. P2 — Performance and maintainability need a focused cleanup

**Why it matters:** During the opening, two zodiac-field trees can be mounted, each with a large ambient star set and constellation structures. The top-level portfolio component is a client component that imports every section, broadening the hydration boundary. The global stylesheet has grown beyond 10,000 lines with many successive adjustment passes, increasing regression risk. Large source images are transformed by Next.js, but the 1.7 MB portrait and 875 KB portfolio image are still worth profiling on mobile.

**Recommended fix:** Reuse one celestial field across the transition, isolate interactive client islands, profile the mobile animation/WebGL path, and split or consolidate the global stylesheet around real component boundaries and tokens. Optimize source images where that produces a measurable transfer or decoding improvement.

**Suggested command:** `$impeccable optimize` after profiling, then `$impeccable polish` for the final responsive pass.

## Persona Perspectives

### Jordan — First-time visitor

Jordan cannot reach anything during the opening, then encounters four competing professional identities and several metaphorical labels. The LinkedIn item looks actionable even though it is not. The portfolio is memorable, but Jordan may leave without a simple answer to “What does Jericho do best?”

### Riley — Recruiter or hiring manager

Riley needs fast proof of role, constraints, decisions, current status, and results. Generic project imagery and repository-only links make that evaluation slower. Repeated education/card content takes attention that could be used for project evidence. Missing active navigation also weakens orientation during a fast scan.

### Casey — Mobile or impatient visitor

Casey waits almost four seconds before interacting, then scrolls through several visually active sections before reaching the form. The sticky Contact route helps, and the form itself is strong. Mobile performance still deserves profiling because the celestial effects, duplicated opening fields, lazy WebGL card, and large imagery can accumulate on weaker devices.

## Minor and Release-Readiness Items

- The repeated ID card in Hero and About weakens the hero’s visual peak; use the second appearance only if it reveals genuinely new information.
- The footer reopens seven choices at the point where the page should close decisively.
- Some metadata and decorative labels fall around 0.48–0.56rem and are too small for comfortable reading.
- Add a skip-to-main link for keyboard users.
- Add dedicated Open Graph and Twitter preview images, and verify that the canonical base URL is configured in production.
- The metadata uses a basic Twitter summary card; use a large-image card when the social preview asset exists.
- Verify runtime behavior at 320 px, landscape phone, tablet, desktop, keyboard-only, and reduced-motion settings before release.
- Keep the direct email option: it is valuable recovery when the form or security service is unavailable.

## Questions to Consider

1. If the animated card and celestial identity disappeared, would the project evidence alone convince someone to hire you?
2. Should the first four seconds communicate the signature, or reveal the strongest project immediately?
3. Do you want to be remembered primarily as a creative frontend developer, or as an equal frontend/backend/UI/UX generalist?
4. Why do Education and Technology receive full showcase chapters while project decisions and outcomes do not yet receive the same depth?

## Assessment Method

The critique used source, asset, configuration, and repository inspection only. No local server was started. Automated static detection completed successfully with zero rule hits; the issues above are manual UX, accessibility, content, performance, and maintainability findings rather than detector-rule violations. Browser automation and live visual overlays were unavailable, so responsive and runtime observations remain source-based until a later visual verification pass.
