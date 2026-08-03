"use client";

import Image from "next/image";
import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";

import { AgriSphereCaseStudyDialog } from "@/components/agrisphere-case-study-dialog";
import { projects } from "@/data/projects";

const projectAccents = {
  amber: "#f2b84b",
  cyan: "#32e6e2",
  green: "#6fd08c",
  magenta: "#ff4d8d",
} as const;

type CarouselPosition = "back" | "center" | "left" | "right";

type DragState = {
  currentX: number;
  pointerId: number;
  startX: number;
};

function getCarouselPosition(
  projectIndex: number,
  activeIndex: number,
): CarouselPosition {
  const offset =
    (projectIndex - activeIndex + projects.length) % projects.length;

  if (offset === 0) {
    return "center";
  }

  if (offset === 1) {
    return "right";
  }

  if (offset === projects.length - 1) {
    return "left";
  }

  return "back";
}

export function ProjectsSection() {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isAgriSphereOpen, setIsAgriSphereOpen] = useState(false);
  const agriSphereTriggerRef = useRef<HTMLButtonElement>(null);
  const didDragRef = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);

  const rotateProjects = (direction: -1 | 1) => {
    setActiveIndex(
      (current) =>
        (current + direction + projects.length) % projects.length,
    );
  };

  const resetDragStyles = () => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    stage.dataset.dragging = "false";
    stage.style.setProperty("--projects-drag-x", "0px");
    stage.style.setProperty("--projects-drag-tilt", "0deg");
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target;

    if (
      !event.isPrimary ||
      event.button !== 0 ||
      (target instanceof Element && target.closest("a, button"))
    ) {
      return;
    }

    didDragRef.current = false;
    dragStateRef.current = {
      currentX: event.clientX,
      pointerId: event.pointerId,
      startX: event.clientX,
    };
    event.currentTarget.dataset.dragging = "true";
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const stage = event.currentTarget;
    const dragLimit = stage.clientWidth * 0.22;
    const distance = event.clientX - dragState.startX;
    const clampedDistance = Math.max(
      -dragLimit,
      Math.min(dragLimit, distance),
    );
    const tilt = (clampedDistance / stage.clientWidth) * -14;

    dragState.currentX = event.clientX;

    if (Math.abs(distance) > 6) {
      didDragRef.current = true;
    }

    stage.style.setProperty("--projects-drag-x", `${clampedDistance}px`);
    stage.style.setProperty("--projects-drag-tilt", `${tilt}deg`);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, rotate: boolean) => {
    const dragState = dragStateRef.current;

    if (!dragState || dragState.pointerId !== event.pointerId) {
      return;
    }

    const distance = dragState.currentX - dragState.startX;
    const threshold = Math.min(
      92,
      Math.max(42, event.currentTarget.clientWidth * 0.1),
    );

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragStateRef.current = null;
    resetDragStyles();

    if (rotate && Math.abs(distance) >= threshold) {
      rotateProjects(distance < 0 ? 1 : -1);
    }

    requestAnimationFrame(() => {
      didDragRef.current = false;
    });
  };

  const handleProjectCardClick = (
    event: MouseEvent<HTMLElement>,
    projectTitle: string,
    position: CarouselPosition,
  ) => {
    const target = event.target;

    if (
      projectTitle !== "AgriSphere" ||
      position !== "center" ||
      didDragRef.current ||
      (target instanceof Element && target.closest("a, button"))
    ) {
      return;
    }

    setIsAgriSphereOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      rotateProjects(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      rotateProjects(1);
    }
  };

  return (
    <section
      aria-labelledby="projects-title"
      className="projects-section"
      id="projects"
    >
      <div className="projects-shell">
        <header className="projects-heading" data-reveal="projects-heading">
          <span aria-hidden="true" className="projects-heading-orbit" />
          <h2 id="projects-title">
            Projects <span>in orbit.</span>
          </h2>
          <p className="projects-intro">
            Four real builds, each with its own system, story, and visual
            gravity.
          </p>
        </header>

        <div className="projects-rotator">
          <p className="projects-rotator-instructions" id="projects-rotator-instructions">
            Drag left or right to rotate projects. Use the left and right arrow
            keys for keyboard navigation.
          </p>
          <div
            aria-describedby="projects-rotator-instructions"
            aria-label="Project gallery"
            aria-roledescription="carousel"
            className="projects-rotator-stage"
            data-dragging="false"
            id="projects-rotator-stage"
            onKeyDown={handleKeyDown}
            onPointerCancel={(event) => finishDrag(event, false)}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(event) => finishDrag(event, true)}
            ref={stageRef}
            role="region"
            tabIndex={0}
          >
            {projects.map((project, index) => {
              const position = getCarouselPosition(index, activeIndex);

              return (
                <article
                  aria-current={position === "center" ? "true" : undefined}
                  aria-hidden={position === "back" ? true : undefined}
                  aria-label={`${project.title}, project ${index + 1} of ${projects.length}`}
                  aria-roledescription="slide"
                  className="project-showcase-card"
                  data-carousel-position={position}
                  data-has-case-study={project.title === "AgriSphere" ? "true" : undefined}
                  inert={position === "back" ? true : undefined}
                  key={project.title}
                  onClick={(event) =>
                    handleProjectCardClick(event, project.title, position)
                  }
                  style={
                    {
                      "--project-accent": projectAccents[project.accent],
                    } as CSSProperties
                  }
                >
                  <div className="project-card-surface">
                    <div className="project-card-media">
                      <div className="project-card-visual">
                        <Image
                          alt={project.imageAlt}
                          className="project-card-image"
                          draggable={false}
                          fill
                          sizes="(max-width: 980px) 82vw, (max-width: 1280px) 30vw, 25rem"
                          src={project.imageSrc}
                        />
                      </div>
                      {project.title === "AgriSphere" ? (
                        <button
                          aria-label="Open the AgriSphere case study"
                          className="project-case-study-trigger"
                          disabled={position !== "center"}
                          onClick={() => setIsAgriSphereOpen(true)}
                          ref={agriSphereTriggerRef}
                          tabIndex={position === "center" ? 0 : -1}
                          type="button"
                        >
                          Explore case study
                          <svg aria-hidden="true" viewBox="0 0 24 24">
                            <path d="M7 17 17 7M9 7h8v8" />
                          </svg>
                        </button>
                      ) : null}
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
                        tabIndex={position === "center" ? 0 : -1}
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
          <div
            aria-label="Project carousel controls"
            className="projects-rotator-controls"
            role="group"
          >
            <button
              aria-controls="projects-rotator-stage"
              aria-label="Show previous project"
              className="projects-rotator-control"
              onClick={() => rotateProjects(-1)}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m14.5 5-7 7 7 7" />
              </svg>
            </button>
            <div aria-hidden="true" className="projects-rotator-dots">
              {projects.map((project, index) => (
                <span
                  data-active={index === activeIndex ? "true" : "false"}
                  key={project.title}
                />
              ))}
            </div>
            <button
              aria-controls="projects-rotator-stage"
              aria-label="Show next project"
              className="projects-rotator-control"
              onClick={() => rotateProjects(1)}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m9.5 5 7 7-7 7" />
              </svg>
            </button>
          </div>
          <p aria-atomic="true" aria-live="polite" className="projects-rotator-announcement">
            {projects[activeIndex].title} is centered. Project {activeIndex + 1}
            of {projects.length}.
          </p>
        </div>
      </div>
      <AgriSphereCaseStudyDialog
        isOpen={isAgriSphereOpen}
        onClose={() => setIsAgriSphereOpen(false)}
        returnFocusRef={agriSphereTriggerRef}
      />
    </section>
  );
}
