import {
  siCss,
  siFigma,
  siFlutter,
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
    size: "large",
  },
  {
    id: "typescript",
    name: "TypeScript",
    icon: siTypescript,
    category: "Language",
    description:
      "Type-safe application code that keeps components, data, and interactions dependable as projects grow.",
    angle: 51.43,
    orbit: "outer",
    size: "medium",
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: siJavascript,
    category: "Language",
    description:
      "Modern browser logic for interactive experiences, animation systems, and application behavior.",
    angle: 102.86,
    orbit: "outer",
    size: "medium",
  },
  {
    id: "git",
    name: "Git",
    icon: siGit,
    category: "Tooling",
    description:
      "Structured version control for focused commits, safe collaboration, and reliable delivery.",
    angle: 25.71,
    orbit: "inner",
    size: "small",
  },
  {
    id: "three",
    name: "Three.js",
    icon: siThreedotjs,
    category: "Creative development",
    description:
      "Interactive 3D scenes and visual systems that bring depth, motion, and atmosphere to the browser.",
    angle: 154.29,
    orbit: "outer",
    size: "medium",
  },
  {
    id: "figma",
    name: "Figma",
    icon: siFigma,
    category: "Design",
    description:
      "Interface exploration, component planning, and visual systems shaped before they reach production.",
    angle: 77.14,
    orbit: "inner",
    size: "small",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: siTailwindcss,
    category: "Styling",
    description:
      "Utility-led styling for fast iteration while preserving responsive rules and consistent design tokens.",
    angle: 128.57,
    orbit: "inner",
    size: "medium",
  },
  {
    id: "next",
    name: "Next.js",
    icon: siNextdotjs,
    category: "Framework",
    description:
      "Production React applications with deliberate rendering, routing, performance, and asset handling.",
    angle: 205.71,
    orbit: "outer",
    size: "large",
  },
  {
    id: "react-native",
    name: "React Native",
    icon: siReact,
    category: "Mobile framework",
    description:
      "Cross-platform mobile applications using React patterns, native components, and shared TypeScript logic.",
    angle: 257.14,
    orbit: "outer",
    size: "medium",
  },
  {
    id: "flutter",
    name: "Flutter",
    icon: siFlutter,
    category: "Mobile framework",
    description:
      "Cross-platform mobile interfaces shaped from a shared Dart codebase with responsive, platform-aware UI.",
    angle: 308.57,
    orbit: "outer",
    size: "large",
  },
  {
    id: "laravel",
    name: "Laravel",
    icon: siLaravel,
    category: "Backend",
    description:
      "Structured PHP applications with expressive routing, data workflows, and maintainable server logic.",
    angle: 180,
    orbit: "inner",
    size: "medium",
  },
  {
    id: "php",
    name: "PHP",
    icon: siPhp,
    category: "Backend",
    description:
      "Server-side features, form processing, and database-backed experiences built for the web.",
    angle: 231.43,
    orbit: "inner",
    size: "small",
  },
  {
    id: "css",
    name: "CSS",
    icon: siCss,
    category: "Styling",
    description:
      "Responsive layouts, accessible states, and purposeful motion tuned across screen sizes.",
    angle: 282.86,
    orbit: "inner",
    size: "small",
  },
  {
    id: "html",
    name: "HTML",
    icon: siHtml5,
    category: "Foundation",
    description:
      "Semantic, accessible structure that gives every interface a durable foundation.",
    angle: 334.29,
    orbit: "inner",
    size: "small",
  },
] as const;

export type Skill = (typeof skills)[number];
export type SkillId = Skill["id"];
