import Link from "next/link";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-night/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link
          className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-bone transition hover:text-cyan"
          href="/"
        >
          JcoDonut08
        </Link>
        <div className="flex items-center gap-3 text-sm font-medium text-stone sm:gap-6">
          {navItems.map((item) => (
            <a
              className="rounded-full px-2 py-1 transition hover:text-bone focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
              href={item.href}
              key={item.label}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
