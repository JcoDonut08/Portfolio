# Repository Agent Instructions

These instructions apply to the entire repository.

## Required Frontend Standard

For any task involving React, Next.js, CSS, layout, components, hooks, accessibility, animation, images, or responsive behavior:

1. Use the project skill at `.agents/skills/portfolio-frontend-standards/SKILL.md`.
2. Read and follow `.agents/rules/frontend-quality.md`.
3. Preserve the existing portfolio wording unless the user explicitly asks to edit copy.

## Project Priorities

- Mobile-responsive behavior is required, not optional.
- Prefer reusable components and typed hooks when reuse or separation of responsibility is real.
- Reuse existing design tokens and patterns before creating alternatives.
- Keep accessibility, reduced motion, and keyboard support intact.
- Avoid unnecessary dependencies and broad rewrites.
- Preserve unrelated user changes in the working tree.
- Keep the Technology in orbit section draggable, but do not show a visible
  "Drag to explore" prompt.

## Completion Checks

Before handing off frontend changes, run:

```powershell
npm run lint
npm run build
```

Also inspect the affected interface at phone, tablet, and desktop widths in proportion to the change.
