import { SiteHeader } from "@/components/site-header";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <main className="min-h-screen">
      <SiteHeader />

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="mb-4 font-mono text-sm uppercase tracking-[0.18em] text-accent">
            Portfolio
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-6xl">
            Hi, I&apos;m Jericho. I build thoughtful web experiences.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-700">
            This starter portfolio is ready for your projects, case studies,
            contact links, and personal details.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {projects.map((project) => (
            <article
              className="rounded-lg border border-neutral-900/10 bg-white/70 p-5 shadow-sm"
              key={project.title}
            >
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                {project.type}
              </p>
              <h2 className="mt-3 text-xl font-semibold text-ink">
                {project.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-700">
                {project.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
