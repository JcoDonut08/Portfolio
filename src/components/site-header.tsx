import Link from "next/link";

const navItems = ["Projects", "About", "Contact"];

export function SiteHeader() {
  return (
    <header className="border-b border-neutral-900/10 bg-paper/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link className="font-mono text-sm font-semibold uppercase tracking-[0.18em]" href="/">
          JcoDonut08
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium text-neutral-700">
          {navItems.map((item) => (
            <a className="transition hover:text-accent" href={`#${item.toLowerCase()}`} key={item}>
              {item}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
