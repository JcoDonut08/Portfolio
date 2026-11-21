# Design

## System

Jericho's portfolio uses a neon-studio and digital-gallery direction: near-black surfaces, luminous accents, sharp spacing, and one signature animated hero field.

## Color

- Night: `#080807`
- Ink: `#10100D`
- Soft white: `#F5F4EF`
- Muted stone: `#A8A29A`
- Electric cyan: `#32E6E2`
- Coral magenta: `#FF4D8D`
- Warm amber: `#F2B84B`

## Typography

- Display: a condensed system display stack using `Arial Narrow`, `Bahnschrift`, and `Segoe UI`.
- Body: Geist Sans from the current Next.js setup.
- Utility: Geist Mono only for short labels, coordinates, and technical metadata.

## Layout

The hero is immersive and asymmetrical. On phones, the identity card becomes a centered second row beneath the hero copy. Selected work uses a readable two-column desktop grid and one column on phones, with genuine interface imagery and an always-available case-study link on every project. Shared dark surfaces and individual accent colors connect the projects to the celestial identity.

## Motion

- Intro overlay finishes the celestial-field entrance first, then draws a
  centered `JPSalvador` signature as thin constellation lines with luminous
  star nodes. It enters automatically after about 3.8 seconds with no controls.
- Hero content reveals after the intro with a short stagger.
- Project details remain available without a carousel or reveal interaction.
- CTAs use fast hover and tap feedback.
- Reduced motion disables the opening sequence, stops ambient CSS movement, and keeps content visible.

## Components

- `OpeningSequence`: lightweight SVG signature intro over the celestial field.
- `PortfolioExperience`: client-side opening handoff and page-section orchestration.
- `PortfolioCard`: accessible interactive identity card in the hero.
- `ProjectsSection`: project grid and links to statically generated, shareable case-study pages.
- `AboutSection`: concise biography and accurately labeled project experience.
- `SkillsOrbitScene`: viewport-deferred React Three Fiber technology orbit.
- `SiteNavigation`: sticky navigation with active-section feedback and direct links.
