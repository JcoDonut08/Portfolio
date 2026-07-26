import {
  siCss,
  siFigma,
  siGit,
  siHtml5,
  siJavascript,
  siLaravel,
  siNextdotjs,
  siPhp,
  siReact,
  siTailwindcss,
  siThreedotjs,
  siTypescript,
} from "simple-icons";

export const skills = [
  {
    id: "react",
    name: "React",
    icon: siReact,
    category: "Frontend",
    description:
      "Component-driven interfaces with reusable state, clear composition, and responsive interaction.",
    angle: 0,
    orbit: "outer",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: siTypescript,
    category: "Language",
    description:
      "Type-safe application code that keeps components, data, and interactions dependable as projects grow.",
    angle: 34,
    orbit: "outer",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: siJavascript,
    category: "Language",
    description:
      "Modern browser logic for interactive experiences, animation systems, and application behavior.",
    angle: 68,
    orbit: "outer",
  },
  {
    id: "git",
    name: "Git",
    icon: siGit,
    category: "Tooling",
    description:
      "Structured version control for focused commits, safe collaboration, and reliable delivery.",
    angle: 105,
    orbit: "outer",
  },
  {
    id: "three",
    name: "Three.js",
    icon: siThreedotjs,
    category: "Creative development",
    description:
      "Interactive 3D scenes and visual systems that bring depth, motion, and atmosphere to the browser.",
    angle: 145,
    orbit: "outer",
  },
  {
    id: "figma",
    name: "Figma",
    icon: siFigma,
    category: "Design",
    description:
      "Interface exploration, component planning, and visual systems shaped before they reach production.",
    angle: 185,
    orbit: "outer",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: siTailwindcss,
    category: "Styling",
    description:
      "Utility-led styling for fast iteration while preserving responsive rules and consistent design tokens.",
    angle: 225,
    orbit: "outer",
  },
  {
    id: "next",
    name: "Next.js",
    icon: siNextdotjs,
    category: "Framework",
    description:
      "Production React applications with deliberate rendering, routing, performance, and asset handling.",
    angle: 270,
    orbit: "outer",
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: siLaravel,
    category: "Backend",
    description:
      "Structured PHP applications with expressive routing, data workflows, and maintainable server logic.",
    angle: 42,
    orbit: "inner",
  },
  {
    id: "php",
    name: "PHP",
    icon: siPhp,
    category: "Backend",
    description:
      "Server-side features, form processing, and database-backed experiences built for the web.",
    angle: 128,
    orbit: "inner",
  },
  {
    id: "css",
    name: "CSS",
    icon: siCss,
    category: "Styling",
    description:
      "Responsive layouts, accessible states, and purposeful motion tuned across screen sizes.",
    angle: 218,
    orbit: "inner",
  },
  {
    id: "html",
    name: "HTML",
    icon: siHtml5,
    category: "Foundation",
    description:
      "Semantic, accessible structure that gives every interface a durable foundation.",
    angle: 310,
    orbit: "inner",
  },
] as const;

export type Skill = (typeof skills)[number];
export type SkillId = Skill["id"];
