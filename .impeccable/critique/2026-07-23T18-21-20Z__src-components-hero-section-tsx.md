---
target: hero section
total_score: 21
p0_count: 0
p1_count: 2
timestamp: 2026-07-23T18-21-20Z
slug: src-components-hero-section-tsx
---
# Hero critique

## Design Health Score

| Heuristic | Score | Key issue |
| --- | ---: | --- |
| Visibility of system status | 2/4 | Navigation state is visible, but primary actions do not resolve to a destination. |
| Match with the real world | 3/4 | The profile-card metaphor supports a creative developer portfolio. |
| User control and freedom | 2/4 | The card can be flipped, but the intended next steps are incomplete. |
| Consistency and standards | 3/4 | Palette and interaction styling are cohesive. |
| Error prevention | 1/4 | Placeholder email and unfinished destinations can create dead ends. |
| Recognition rather than recall | 3/4 | Labels are legible, though the flip affordance is subtle. |
| Flexibility and efficiency | 2/4 | Keyboard activation works for the card, but no clear skip/shortcut exists for the opening flow. |
| Aesthetic and minimalist design | 3/4 | The card is distinctive, but its metadata competes with the primary introduction. |
| Error recovery | 1/4 | No user-facing recovery state exists for dead links or server failures. |
| Help and documentation | 1/4 | The social and card interactions lack explicit explanatory copy. |
| **Total** | **21/40** | **Good visual foundation; not yet conversion-ready.** |

## What works

- The page has a clear, personal visual signature: the collectible portrait card is more memorable than a generic portfolio hero.
- The left-to-right reading order is sound: greeting, name, role, supporting line, then a call to action.
- The purple accent is used consistently enough to make the page feel like one system.

## Priority issues

### P1 — The hero promises destinations that do not exist

Navigation and both hero actions point at anchors for sections that are not present. The LinkedIn mark is visibly a social action but cannot be opened, and the email address remains a placeholder. This makes a strong first impression collapse at the exact moment a visitor decides to act.

### P1 — Too many competing signals in one viewport

The name, rotating job title, five navigation choices, two CTAs, three social marks, and dense card metadata are all visible together. The card should be proof; the primary conversion action should remain unmistakable.

### P2 — The typed role weakens the premium tone

While the phrase is half-written, it reads as unfinished rather than cinematic. A word-swap or masked slide between complete roles will feel more deliberate and reduce the time visitors spend reading an incomplete statement.

### P2 — Card interaction is not discoverable enough

The card is a keyboard-accessible button, but the front does not explicitly say that it flips. Add a small `Flip for skills` label or make the arrow visibly communicate the interaction.

### P2 — Mobile needs a deliberate composition check

The hero is intentionally one viewport tall. With a large name, two actions, social icons, and the card overlay, it risks clipping or crowding at 375px and short landscape heights. Test those sizes before calling it complete.

## Personas

### Jordan, first-time client

Jordan understands who Jericho is quickly, but cannot reach a real About, Projects, or Contact destination. The disabled LinkedIn mark also looks like a broken control.

### Casey, mobile visitor

Casey has many top-of-screen choices before reaching a working primary action, and the card can collide with copy on smaller screens. Keep Contact visible and move lower-priority signals behind the first decision.

### Sam, keyboard or screen-reader user

The card has a semantic button and image alt text, and social links have labels. The LinkedIn visual should become a real labelled link once the URL exists; the page also needs a skip link when additional sections are added.

## Questions

- Should the hero optimize for hiring inquiries, freelance client inquiries, or showcasing work first? The answer should determine whether `Contact me` or `View projects` is dominant.
- Is the profile card meant to be a portfolio proof point or the main interaction? If it is proof, simplify its metadata and make it visually secondary to the next action.
