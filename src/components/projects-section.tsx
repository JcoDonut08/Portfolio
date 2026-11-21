import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projects } from "@/data/projects";

const accents = { amber: "#f2b84b", cyan: "#32e6e2", green: "#6fd08c", magenta: "#ff8db5" };

export function ProjectsSection() {
  return (
    <section aria-labelledby="projects-title" className="work-section" id="projects">
      <header className="work-heading">
        <p className="section-kicker">Selected work</p>
        <h2 id="projects-title">Ideas turned into <span>working applications.</span></h2>
        <p>Web and mobile projects, the role I played, and a closer look at how each system works.</p>
      </header>
      <div className="work-grid">
        {projects.map((project) => (
          <article className="work-card" key={project.slug} style={{ "--project-accent": accents[project.accent] } as CSSProperties}>
            <Link aria-label={`Read the ${project.title} case study`} className={`work-visual${project.imageLayout === "mobile" ? " work-visual-mobile" : ""}`} href={`/projects/${project.slug}`}>
              {project.imageSrc ? <Image alt={project.imageAlt ?? project.title} fill sizes="(min-width: 800px) 46vw, 92vw" src={project.imageSrc} /> : (
                <div className="work-type-preview" aria-hidden="true"><span>{project.type}</span><strong>{project.title}</strong><p>{project.slug === "saan-tayo" ? "Discover. Match. Go together." : "Storefront, checkout & store operations."}</p><small>{project.status}</small></div>
              )}
              {project.imageLayout === "mobile" ? <div aria-hidden="true" className="work-mobile-label"><span>Mobile discovery</span><strong>Saan Tayo?</strong><p>Find your next tambayan.</p></div> : null}
            </Link>
            <div className="work-card-body">
              <p className="work-category">{project.type}</p>
              <div className="work-title-row"><h3><Link href={`/projects/${project.slug}`}>{project.title}</Link></h3><span className="work-status">{project.status}</span></div>
              <p className="work-role">{project.role} <span>· {project.context}</span></p>
              <p className="work-description">{project.description}</p>
              <ul aria-label={`${project.title} technology stack`} className="work-stack">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              <div className="work-links"><Link className="work-case-link" href={`/projects/${project.slug}`}>Case study</Link>{project.demoUrl ? <a href={project.demoUrl} rel="noreferrer" target="_blank">{project.demoLabel}</a> : null}<a aria-label={`View ${project.title} code on GitHub`} href={project.repoUrl} rel="noreferrer" target="_blank">Code</a></div>
            </div>
          </article>
        ))}
      </div>
      <aside className="portfolio-build-note"><div><p className="section-kicker">About this website</p><h3>The portfolio is a project, too.</h3><p>Next.js, TypeScript, Three.js, and Motion bring the celestial identity to life. The implementation includes keyboard support, adaptive visual effects, a protected contact endpoint, and browser checks.</p></div><a href="https://github.com/JcoDonut08/Portfolio" rel="noreferrer" target="_blank">Explore the portfolio source</a></aside>
    </section>
  );
}
