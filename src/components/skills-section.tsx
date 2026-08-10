"use client";

import dynamic from "next/dynamic";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { skills, type SkillId } from "@/components/skills-data";
import { WorkflowTools } from "@/components/workflow-tools";

const SkillsOrbitScene = dynamic(
  () =>
    import("@/components/skills-orbit-scene").then(
      (module) => module.SkillsOrbitScene,
    ),
  { ssr: false },
);

type DragState = {
  pointerId: number;
  startRotation: number;
  startX: number;
};

type SkillsSectionProps = {
  lowPowerMode: boolean;
  prefersReducedMotion: boolean;
};

export function SkillsSection({
  lowPowerMode,
  prefersReducedMotion,
}: SkillsSectionProps) {
  const [selectedId, setSelectedId] = useState<SkillId>("react");
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isOrbitNearViewport, setIsOrbitNearViewport] = useState(false);
  const [shouldRenderOrbit, setShouldRenderOrbit] = useState(false);
  const dragState = useRef<DragState | null>(null);
  const orbitStageRef = useRef<HTMLDivElement>(null);
  const selectedSkill =
    skills.find((skill) => skill.id === selectedId) ?? skills[0];

  useEffect(() => {
    const stage = orbitStageRef.current;

    if (!stage || !("IntersectionObserver" in window)) {
      setIsOrbitNearViewport(true);
      setShouldRenderOrbit(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsOrbitNearViewport(entry.isIntersecting);

        if (entry.isIntersecting) {
          setShouldRenderOrbit(true);
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button")) {
      return;
    }

    dragState.current = {
      pointerId: event.pointerId,
      startRotation: rotation,
      startX: event.clientX,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragState.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setRotation(drag.startRotation + (event.clientX - drag.startX) * 0.5);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    dragState.current = null;
    setIsDragging(false);
  };

  const handleOrbitKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
      return;
    }

    event.preventDefault();
    setRotation((currentRotation) =>
      currentRotation + (event.key === "ArrowLeft" ? -18 : 18),
    );
  };

  const rotateOrbit = (amount: number) => {
    setRotation((currentRotation) => currentRotation + amount);
  };

  return (
    <section
      aria-labelledby="skills-title"
      className="skills-section"
      id="skills"
    >
      <div className="skills-shell">
        <header className="skills-intro" data-reveal="skills-copy">
          <p className="skills-label">
            <span>Skills</span>
            <span aria-hidden="true">Interactive system</span>
          </p>
          <h2 id="skills-title">
            <span>Technology</span>
            <span>in orbit</span>
          </h2>
          <p className="skills-summary">
            Tools, frameworks, and systems I use to shape expressive digital
            experiences from interface to backend.
          </p>

          <div aria-live="polite" className="skills-readout">
            <div className="skills-readout-meta">
              <span>{selectedSkill.category}</span>
              <span>
                {String(
                  skills.findIndex((skill) => skill.id === selectedId) + 1,
                ).padStart(2, "0")}
              </span>
            </div>
            <h3>{selectedSkill.name}</h3>
            <p>{selectedSkill.description}</p>
          </div>
        </header>

        <div className="skills-orbit-wrap" data-reveal="skills-orbit">
          <div
            aria-label="Interactive 3D technology orbit. Drag horizontally or use the left and right arrow keys to rotate it."
            aria-busy={!shouldRenderOrbit}
            className={`skills-orbit-stage${isDragging ? " is-dragging" : ""}`}
            onKeyDown={handleOrbitKeyDown}
            onPointerCancel={finishDrag}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishDrag}
            ref={orbitStageRef}
            role="group"
            tabIndex={0}
          >
            {shouldRenderOrbit ? (
              <SkillsOrbitScene
                isDragging={isDragging}
                isVisible={isOrbitNearViewport}
                lowPowerMode={lowPowerMode}
                onRotate={rotateOrbit}
                onSelect={setSelectedId}
                reducedMotion={prefersReducedMotion}
                rotation={rotation}
                selectedId={selectedId}
              />
            ) : null}
          </div>
        </div>
      </div>

      <WorkflowTools disableMotion={lowPowerMode || prefersReducedMotion} />
    </section>
  );
}
