"use client";

import {
  siClaude,
  siFigma,
  siGithub,
  siGooglegemini,
  siVercel,
  type SimpleIcon,
} from "simple-icons";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type WorkflowTool = {
  accent: string;
  icon?: SimpleIcon;
  mark?: string;
  name: string;
};

const workflowTools: WorkflowTool[] = [
  { accent: "#F24E1E", icon: siFigma, name: "Figma" },
  { accent: "#F5F4EF", icon: siGithub, name: "GitHub" },
  { accent: "#23A9F2", mark: "VS", name: "VS Code" },
  { accent: "#74AA9C", mark: "GPT", name: "ChatGPT" },
  { accent: "#D97757", icon: siClaude, name: "Claude" },
  { accent: "#8E75B2", icon: siGooglegemini, name: "Gemini" },
  { accent: "#F5F4EF", icon: siVercel, name: "Vercel" },
];

function WorkflowToolColumns() {
  return workflowTools.map((tool) => (
    <li
      className="skills-workflow-column"
      key={tool.name}
      style={
        {
          "--workflow-accent": tool.accent,
        } as CSSProperties
      }
    >
      <span aria-hidden="true" className="skills-workflow-mark">
        {tool.icon ? (
          <svg viewBox="0 0 24 24">
            <path d={tool.icon.path} />
          </svg>
        ) : (
          <span>{tool.mark}</span>
        )}
      </span>
      <span className="skills-workflow-name">{tool.name}</span>
    </li>
  ));
}

export function WorkflowTools() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    let isIntersecting = false;
    const syncRunningState = () => {
      setIsRunning(
        isIntersecting && document.visibilityState === "visible",
      );
    };

    if (!("IntersectionObserver" in window)) {
      isIntersecting = true;
      syncRunningState();
      document.addEventListener("visibilitychange", syncRunningState);

      return () => {
        document.removeEventListener("visibilitychange", syncRunningState);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        syncRunningState();
      },
      { rootMargin: "120px 0px" },
    );

    observer.observe(carousel);
    document.addEventListener("visibilitychange", syncRunningState);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncRunningState);
    };
  }, []);

  return (
    <section
      aria-labelledby="workflow-tools-title"
      className="skills-workflow"
      data-reveal="skills-workflow"
    >
      <div className="skills-workflow-frame">
        <div className="skills-workflow-heading">
          <h3 id="workflow-tools-title">Workflow tools</h3>
          <p>Design, versioning, development, and AI-assisted iteration.</p>
        </div>

        <div
          aria-label="Workflow tools carousel"
          className="skills-workflow-carousel"
          data-running={isRunning}
          ref={carouselRef}
          role="group"
        >
          <div className="skills-workflow-track">
            <ul className="skills-workflow-set">
              <WorkflowToolColumns />
            </ul>
            <ul aria-hidden="true" className="skills-workflow-set">
              <WorkflowToolColumns />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
