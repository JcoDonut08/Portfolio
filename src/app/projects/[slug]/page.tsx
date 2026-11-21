import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";

type ProjectPageProps = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  return { title: `${project.title} — ${project.role} | Jericho Salvador`, description: project.description, alternates: { canonical: `/projects/${project.slug}` } };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return (
    <div className="case-page">
      <header className="case-navigation"><Link href="/#projects">Back to projects</Link><Link href="/#contact">Get in touch</Link></header>
      <main id="main-content">
        <header className="case-heading"><p className="section-kicker">{project.type} · {project.status}</p><h1>{project.title}</h1><p className="case-lede">{project.description}</p>
          <dl className="case-facts"><div><dt>My role</dt><dd>{project.role}</dd></div><div><dt>Context</dt><dd>{project.context}</dd></div><div><dt>Technology</dt><dd>{project.stack.join(" · ")}</dd></div></dl>
          <div className="work-links"><a className="work-case-link" href={project.repoUrl} rel="noreferrer" target="_blank">View source code</a>{project.demoUrl ? <a href={project.demoUrl} rel="noreferrer" target="_blank">{project.demoLabel}</a> : null}</div>
        </header>
        {project.imageSrc ? <figure className={`case-cover${project.imageLayout === "mobile" ? " case-cover-mobile" : ""}`}><Image alt={project.imageAlt ?? project.title} height={project.imageLayout === "mobile" ? 844 : 900} priority sizes={project.imageLayout === "mobile" ? "(max-width: 450px) 88vw, 390px" : "(min-width: 1200px) 1120px, 92vw"} src={project.imageSrc} width={project.imageLayout === "mobile" ? 390 : 1440}/><figcaption>{project.imageLayout === "mobile" ? "Actual local web preview of the Expo prototype, captured in a mobile viewport." : "Interface image from the project repository."}</figcaption></figure> : null}
        <div className="case-overview"><section><p className="section-kicker">The problem</p><h2>What the application is for</h2><p>{project.problem}</p></section><section><p className="section-kicker">My contribution</p><h2>Where I fit in</h2><p>{project.contribution}</p></section></div>
        <section className="case-section"><p className="section-kicker">Application walkthrough</p><h2>From the first screen to the next step.</h2><div className="case-feature-grid">{project.features.map((feature) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.description}</p></article>)}</div></section>
        {project.gallery ? <div className="case-gallery">{project.gallery.map((item) => <figure key={item.src}><Image alt={item.alt} height={900} sizes="(min-width: 1200px) 1120px, 92vw" src={item.src} width={1440}/><figcaption>{item.caption}</figcaption></figure>)}</div> : null}
        <section className="case-section"><p className="section-kicker">Under the hood</p><h2>How the pieces connect.</h2><ol className="case-architecture">{project.architecture.map((layer) => <li key={layer}>{layer}</li>)}</ol><div className="case-decision"><h3>{project.decision.title}</h3><p>{project.decision.description}</p></div></section>
        <div className="case-overview"><section><p className="section-kicker">Implementation evidence</p><h2>What you can inspect</h2><p>{project.verification}</p><a className="text-link" href={`${project.repoUrl}#readme`} rel="noreferrer" target="_blank">Read the project documentation</a></section><section><p className="section-kicker">Current scope</p><h2>Where the project stands</h2><p>{project.boundary}</p></section></div>
        <footer className="case-end"><h2>Want to talk through the implementation?</h2><p>I&apos;m open to frontend and full-stack internship conversations.</p><div className="work-links"><Link className="work-case-link" href="/#contact">Contact Jericho</Link><Link href="/#projects">Explore another project</Link></div></footer>
      </main>
    </div>
  );
}
