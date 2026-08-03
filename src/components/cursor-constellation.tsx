"use client";

import { useEffect, useRef } from "react";

const trailLength = 9;
const trailScales = [1, 0.88, 0.78, 0.69, 0.61, 0.54, 0.47, 0.41, 0.35] as const;

type CursorConstellationProps = {
  isActive: boolean;
};

type TrailPoint = {
  x: number;
  y: number;
};

function buildCometPath(points: TrailPoint[]) {
  const orderedPoints = points.slice().reverse();
  const firstPoint = orderedPoints[0];
  let path = `M${firstPoint.x.toFixed(2)} ${firstPoint.y.toFixed(2)}`;

  for (let index = 1; index < orderedPoints.length - 1; index += 1) {
    const point = orderedPoints[index];
    const nextPoint = orderedPoints[index + 1];
    const midpointX = (point.x + nextPoint.x) / 2;
    const midpointY = (point.y + nextPoint.y) / 2;

    path += ` Q${point.x.toFixed(2)} ${point.y.toFixed(2)} ${midpointX.toFixed(2)} ${midpointY.toFixed(2)}`;
  }

  const lastPoint = orderedPoints[orderedPoints.length - 1];
  return `${path} L${lastPoint.x.toFixed(2)} ${lastPoint.y.toFixed(2)}`;
}

export function CursorConstellation({ isActive }: CursorConstellationProps) {
  const constellationRef = useRef<SVGSVGElement>(null);
  const tailRefs = useRef<Array<SVGPathElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);

  useEffect(() => {
    const constellation = constellationRef.current;

    if (!constellation || !isActive) {
      if (constellation) {
        constellation.dataset.active = "false";
      }

      return;
    }

    const finePointerQuery = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const points: TrailPoint[] = Array.from({ length: trailLength }, () => ({
      x: 0,
      y: 0,
    }));
    const target: TrailPoint = { x: 0, y: 0 };
    let enabled = finePointerQuery.matches && !reducedMotionQuery.matches;
    let frameId: number | null = null;
    let hideTimer: number | null = null;
    let initialized = false;

    const hideConstellation = () => {
      constellation.dataset.active = "false";
      initialized = false;

      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const renderTrail = () => {
      points[0].x = target.x;
      points[0].y = target.y;

      let settled = true;

      for (let index = 1; index < points.length; index += 1) {
        const point = points[index];
        const leader = points[index - 1];
        const easing = Math.max(0.14, 0.31 - index * 0.019);
        const distanceX = leader.x - point.x;
        const distanceY = leader.y - point.y;

        point.x += distanceX * easing;
        point.y += distanceY * easing;

        if (Math.abs(distanceX) > 0.08 || Math.abs(distanceY) > 0.08) {
          settled = false;
        }
      }

      const cometPath = buildCometPath(points);
      tailRefs.current.forEach((tail) => tail?.setAttribute("d", cometPath));

      points.forEach((point, index) => {
        nodeRefs.current[index]?.setAttribute(
          "transform",
          `translate(${point.x.toFixed(2)} ${point.y.toFixed(2)}) scale(${trailScales[index]})`,
        );
      });

      if (settled) {
        frameId = null;
        return;
      }

      frameId = window.requestAnimationFrame(renderTrail);
    };

    const requestTrailFrame = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(renderTrail);
      }
    };

    const handlePointerMove = (event: globalThis.PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        return;
      }

      target.x = event.clientX;
      target.y = event.clientY;

      if (!initialized) {
        points.forEach((point) => {
          point.x = target.x;
          point.y = target.y;
        });
        initialized = true;
      }

      constellation.dataset.active = "true";

      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
      }

      hideTimer = window.setTimeout(hideConstellation, 640);
      requestTrailFrame();
    };

    const handlePointerOut = (event: globalThis.PointerEvent) => {
      if (event.relatedTarget === null) {
        hideConstellation();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hideConstellation();
      }
    };

    const updateMotionAvailability = () => {
      enabled = finePointerQuery.matches && !reducedMotionQuery.matches;

      if (!enabled) {
        hideConstellation();
      }
    };

    window.addEventListener("blur", hideConstellation);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    window.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    finePointerQuery.addEventListener("change", updateMotionAvailability);
    reducedMotionQuery.addEventListener("change", updateMotionAvailability);

    return () => {
      hideConstellation();
      window.removeEventListener("blur", hideConstellation);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      finePointerQuery.removeEventListener("change", updateMotionAvailability);
      reducedMotionQuery.removeEventListener(
        "change",
        updateMotionAvailability,
      );
    };
  }, [isActive]);

  return (
    <svg
      aria-hidden="true"
      className="cursor-constellation"
      data-active="false"
      focusable="false"
      ref={constellationRef}
    >
      <defs>
        <linearGradient
          id="cursor-shooting-star-tail-gradient"
          x1="0"
          x2="1"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#ff4d8d" stopOpacity="0" />
          <stop offset="0.35" stopColor="#9d86ff" stopOpacity="0.22" />
          <stop offset="0.72" stopColor="#8facff" stopOpacity="0.72" />
          <stop offset="1" stopColor="#b8fffd" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="cursor-shooting-star-head-gradient">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.92" />
          <stop offset="0.28" stopColor="#9dffff" stopOpacity="0.48" />
          <stop offset="1" stopColor="#32e6e2" stopOpacity="0" />
        </radialGradient>
        <filter
          height="180%"
          id="cursor-shooting-star-glow-filter"
          width="180%"
          x="-40%"
          y="-40%"
        >
          <feGaussianBlur stdDeviation="2.8" />
        </filter>
      </defs>
      <path
        className="cursor-shooting-star-tail cursor-shooting-star-tail--glow"
        filter="url(#cursor-shooting-star-glow-filter)"
        ref={(tail) => {
          tailRefs.current[0] = tail;
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="cursor-shooting-star-tail cursor-shooting-star-tail--body"
        ref={(tail) => {
          tailRefs.current[1] = tail;
        }}
        vectorEffect="non-scaling-stroke"
      />
      <path
        className="cursor-shooting-star-tail cursor-shooting-star-tail--core"
        ref={(tail) => {
          tailRefs.current[2] = tail;
        }}
        vectorEffect="non-scaling-stroke"
      />
      {trailScales.map((_, index) => {
        const isLead = index === 0;

        return (
          <g
            className={`cursor-shooting-star-particle${isLead ? " cursor-shooting-star-head" : index % 3 === 0 ? " cursor-shooting-star-particle--warm" : ""}`}
            key={index}
            opacity={Math.max(0.18, 1 - index * 0.105)}
            ref={(node) => {
              nodeRefs.current[index] = node;
            }}
          >
            {isLead ? (
              <>
                <circle
                  className="cursor-shooting-star-head-halo"
                  r="14"
                />
                <path d="M0-10 2-2 10 0 2 2 0 10-2 2-10 0-2-2Z" />
                <circle
                  className="cursor-shooting-star-head-core"
                  r="2.2"
                />
              </>
            ) : (
              <circle r={index < 4 ? 1.8 : 1.35} />
            )}
          </g>
        );
      })}
    </svg>
  );
}
