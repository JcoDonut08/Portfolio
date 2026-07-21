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

The hero is immersive and asymmetrical: copy sits in the foreground while the animated canvas acts as the visual proof. Sections below use generous spacing, thin dividers, and project panels with varied accent colors instead of a repeated generic card system.

## Motion

- Intro overlay plays once per session for about two seconds.
- Hero content reveals after the intro with a short stagger.
- Project items use a capped stagger.
- CTAs use fast hover and tap feedback.
- Reduced motion disables the opening sequence, stops ambient CSS movement, and keeps content visible.

## Components

- `OpeningSequence`: narrative intro overlay with skip.
- `HeroScene`: dynamically loaded React Three Fiber canvas.
- `AnimatedHome`: client-side orchestration for Motion and page sections.
- `SiteHeader`: sticky navigation with high contrast and direct section links.
