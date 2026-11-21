export type Project = {
  slug: string;
  title: string;
  type: string;
  role: string;
  context: string;
  status: string;
  description: string;
  stack: readonly string[];
  accent: "amber" | "cyan" | "green" | "magenta";
  repoName: string;
  repoUrl: string;
  demoUrl?: string;
  demoLabel?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageLayout?: "mobile";
  problem: string;
  contribution: string;
  features: readonly { title: string; description: string }[];
  architecture: readonly string[];
  decision: { title: string; description: string };
  verification: string;
  boundary: string;
  gallery?: readonly { src: string; alt: string; caption: string }[];
};

export const projects: readonly Project[] = [
  {
    slug: "agrifarm", title: "AgriFarm", type: "Local agricultural marketplace",
    role: "Full-stack Developer", context: "Web application", status: "Source available",
    description: "A marketplace connecting Pasig farmers and local buyers, with seller inventory, cash-on-delivery orders, and harvest planning.",
    stack: ["Laravel", "React", "Inertia.js", "PostgreSQL", "Tailwind CSS"], accent: "green",
    repoName: "JcoDonut08/agrifarm", repoUrl: "https://github.com/JcoDonut08/agrifarm",
    imageSrc: "/assets/projects/reviewed/agrifarm-homepage-share.jpg",
    imageAlt: "AgriFarm interface with a fresh produce marketplace for Pasig farmers and buyers",
    problem: "Local buyers need a clear path from discovering produce to placing an order. Farmers need the corresponding tools to manage listings, stock, orders, and upcoming harvests.",
    contribution: "My role is full-stack development, working across the Laravel backend and the React interface. The flows below describe the application as a whole, from customer discovery to seller operations.",
    features: [
      { title: "Discover local produce", description: "Search, filter, and sort products; browse public seller shops; save favorites and review product details." },
      { title: "Complete a COD order", description: "Review shipping information and an order summary. The server checks current prices and reserves available stock when an order is placed." },
      { title: "Manage the selling workflow", description: "Seller tools bring product photos, inventory, orders, cancellation reasons, notifications, and harvest records into one workspace." },
    ],
    architecture: ["React + Inertia interface", "Laravel validation and authorization", "Eloquent + PostgreSQL", "Background order notifications"],
    decision: { title: "Keep order rules on the server", description: "Laravel owns authorization, validation, stock checks, and persistence. React handles presentation and temporary interface state. Transactional stock checks and saved order-price snapshots keep the checkout separate from a device-local cart." },
    verification: "The repository includes PHPUnit feature checks and Playwright browser checks, with isolated test data and documented local setup. Architecture and storefront notes explain the implemented flows and their constraints. A public demo is currently unavailable.",
    boundary: "Cash on Delivery is implemented. Online payment processing and automatic delivery-fee calculation are deferred. Forecasting and planting recommendations are planning aids, not guarantees of yield or sales.",
  },
  {
    slug: "gabayiskolar", title: "GabayIskolar", type: "Scholarship preparation",
    role: "Frontend Developer", context: "The Prompters · OVERCLOCK 2026 hackathon", status: "Hackathon prototype",
    description: "A scholarship preparation workspace that brings published guides, personal checklists, document review, and next steps together.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Motion"], accent: "amber",
    repoName: "Rikitu03/Hackathon-Da-Prompters-2026", repoUrl: "https://github.com/Rikitu03/Hackathon-Da-Prompters-2026",
    demoUrl: "https://hackathon-da-prompters-2026.vercel.app", demoLabel: "View deployed prototype",
    imageSrc: "/assets/projects/reviewed/gabayiskolar-home-desktop.jpg",
    imageAlt: "GabayIskolar homepage showing its scholarship preparation interface",
    problem: "Scholarship preparation is spread across requirements, instructions, documents, and application links. Students need to understand what to prepare and what still needs attention.",
    contribution: "I worked as a frontend developer on The Prompters' hackathon team. My role sits in the Next.js and React interface; the project also has separate backend, scholarship-content, and AI integration responsibilities.",
    features: [
      { title: "A guided starting point", description: "Applicants browse published guides and choose a preparation workspace without creating an account." },
      { title: "Preparation that stays organized", description: "A personal checklist and a device-local draft help applicants track their own progress and return to unfinished steps." },
      { title: "Clear review and handoff", description: "Document review and source-backed assistance have explicit review states, followed by a handoff to the official application destination." },
    ],
    architecture: ["Next.js + React applicant interface", "Local checklist and draft state", "Team-owned API integrations", "Official application handoff"],
    decision: { title: "Separate preparation from official decisions", description: "The interface treats checklist progress as self-reported preparation. It provides review and unavailable states around assistance, while the scholarship office remains responsible for official applications and eligibility decisions." },
    verification: "The repository contains frontend and applicant regression tests, desktop/mobile Playwright scenarios, interface handoff notes, and dated verification records. Those records describe the tested checkpoint rather than a guarantee of live AI-service availability.",
    boundary: "An independent hackathon prototype. The deployed version may differ from the repository screenshots. AI-assisted flows depend on configured services and reviewed published content. Demonstration records may be synthetic; use sample documents when exploring them.",
    gallery: [
      { src: "/assets/projects/reviewed/gabayiskolar-dashboard-desktop.jpg", alt: "GabayIskolar applicant dashboard", caption: "Applicant dashboard from the project repository." },
      { src: "/assets/projects/reviewed/gabayiskolar-document-review-desktop.jpg", alt: "GabayIskolar document review interface", caption: "Document review interface from the project repository." },
    ],
  },
  {
    slug: "loveby-ade", title: "Loveby Ade", type: "Dessert e-commerce",
    role: "Full-stack Developer", context: "Academic project · three-person team", status: "Source available",
    description: "A Laravel dessert storefront with a shopping journey, order tracking, promotions, and an administration workspace.",
    stack: ["Laravel", "PHP", "Blade", "JavaScript", "Tailwind CSS"], accent: "magenta",
    repoName: "JcoDonut08/Loveby_Ade", repoUrl: "https://github.com/JcoDonut08/Loveby_Ade",
    problem: "A dessert shop needs more than a product gallery: customers need a coherent shopping and ordering flow, while the team running the store needs tools to manage the business.",
    contribution: "I served as team leader and a full-stack developer, with UI/UX design and quality-assurance responsibilities. The team's contribution report records these roles alongside the work of the other two developers.",
    features: [
      { title: "Explore the storefront", description: "Product discovery, favorites, and cart interactions lead into the customer shopping journey." },
      { title: "Follow an order", description: "Authenticated checkout and order-management views connect the storefront to the store's operational workflow." },
      { title: "Run the store", description: "The administration area covers products, promotions, analytics, reports, and audit views." },
    ],
    architecture: ["Blade + JavaScript interface", "Laravel routes and controllers", "Application models and persistence", "Customer + admin workspaces"],
    decision: { title: "Connect storefront and operations", description: "The Laravel application brings customer-facing pages and the administration workspace into one codebase. The case study follows that boundary so interface work can be considered alongside the order-management behavior it supports." },
    verification: "The source exposes customer and administration routes, application models, views, and the team's contribution report. A public hosted demo is not currently listed, so the repository is the available implementation reference.",
    boundary: "An academic team application. No production usage, sales results, or live payment processing is claimed here.",
  },
  {
    slug: "saan-tayo", title: "Saan Tayo?", type: "Mobile discovery application",
    role: "Full-stack Developer", context: "Expo application prototype", status: "Frontend prototype",
    description: "A mobile-first way to discover Metro Manila hangout spots by budget, mood, location, and group preferences.",
    stack: ["React Native", "Expo", "TypeScript", "Expo Router", "Zustand"], accent: "cyan",
    repoName: "JcoDonut08/Saan-Tayo-", repoUrl: "https://github.com/JcoDonut08/Saan-Tayo-",
    imageSrc: "/assets/projects/reviewed/saan-tayo-discover-mobile.jpg",
    imageAlt: "Actual Saan Tayo discovery interface with Metro Manila place categories and saved-place controls",
    imageLayout: "mobile",
    problem: "Choosing a place with friends means balancing budget, mood, location, and travel limits. This prototype explores a discovery flow that makes those preferences easier to consider together.",
    contribution: "My role on this project is full-stack development. The repository version presented here currently demonstrates the mobile frontend and local application logic described below.",
    features: [
      { title: "Start with preferences", description: "Branded entry and onboarding establish the discovery experience and the preferences used by matching." },
      { title: "Browse and compare", description: "Browse-first discovery and place details use dated, source-linked Metro Manila venue data." },
      { title: "Match and save locally", description: "Deterministic Smart Match results and locally persisted saves support repeat exploration on the same device." },
    ],
    architecture: ["Expo Router screens", "React Native components", "Local place data + matching", "Zustand + local persistence"],
    decision: { title: "Explore the flow with local data", description: "A local dataset and deterministic matching make the discovery behavior inspectable while the prototype develops. The current authentication screens validate input; they do not establish a real account or server session." },
    verification: "The README documents the prototype's implemented behavior and Expo development workflow. The source separates navigation, feature logic, local data, state, and shared types.",
    boundary: "Real authentication, maps, backend services, live availability, and AI recommendations are not implemented. Smart Match currently uses deterministic local logic.",
  },
];

export function getProject(slug: string) { return projects.find((project) => project.slug === slug); }
