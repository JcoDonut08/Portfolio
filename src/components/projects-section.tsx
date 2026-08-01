import Image from "next/image";
import type { CSSProperties } from "react";

import { projects } from "@/data/projects";

const projectAccents = {
  amber: "#f2b84b",
  cyan: "#32e6e2",
  magenta: "#ff4d8d",
} as const;

const cardPositions = ["left", "center", "right"] as const;

export function ProjectsSection() {
  return (
    <section
      aria-labelledby="projects-title"
      className="projects-section"
      id="projects"
    >
      <div className="projects-shell">
        <header
          className="projects-heading"
          data-reveal="projects-heading"
        >
          <span aria-hidden="true" className="projects-heading-orbit" />
          <h2 id="projects-title">
            Projects <span>in orbit.</span>
          </h2>
          <p className="projects-intro">
            Three real builds, each with its own system, story, and visual
            gravity.
          </p>
        </header>

        <div className="projects-list">
          {projects.map((project, index) => {
            const cardPosition = cardPositions[index] ?? "center";

            return (
              <article
                className={`project-showcase-card project-showcase-card--${cardPosition}`}
                data-reveal="project-item"
                key={project.title}
                style={
                  {
                    "--project-accent": projectAccents[project.accent],
                    "--reveal-index": index,
                  } as CSSProperties
                }
              >
                <div className="project-card-surface">
                  <div className="project-card-media">
                    <div className="project-card-visual">
                      <Image
                        alt={project.imageAlt}
                        className="project-card-image"
                        fill
                        sizes="(max-width: 640px) calc(100vw - 3rem), (max-width: 980px) calc(100vw - 6rem), (max-width: 1280px) 28vw, 25rem"
                        src={project.imageSrc}
                      />
                    </div>
                  </div>

                  <div className="project-card-content">
                    <div className="project-card-meta">
                      <p className="project-card-type">{project.type}</p>
                      <p className="project-card-role">
                        <span>Role</span>
                        {project.role}
                      </p>
                    </div>
                    <h3>{project.title}</h3>
                    <p className="project-card-description">
                      {project.description}
                    </p>

                    <div className="project-card-stack">
                      <p>Tech stack</p>
                      <ul aria-label={`${project.title} technology stack`}>
                        {project.stack.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <a
                      aria-label={`View ${project.title} on GitHub`}
                      className="project-github-link"
                      href={project.repoUrl}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <span className="project-github-copy">
                        View repository
                        <small>{project.repoName}</small>
                      </span>
                      <span
                        aria-hidden="true"
                        className="project-github-arrow"
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
