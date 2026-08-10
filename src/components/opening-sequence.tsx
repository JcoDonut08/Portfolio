"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { ZodiacField } from "@/components/zodiac-field";
import { consumeOpeningSequenceSkip } from "@/lib/experience-navigation";

const signatureTimeScale = 1.12;
const autoExitDelay = 3560;
const autoCompleteDelay = 3840;

const signatureStrokes = [
  {
    d: "M82 92 C118 65 178 63 207 79 C187 99 151 104 118 105",
    delay: 80,
    duration: 110,
    end: [118, 105],
    width: 2.3,
  },
  {
    d: "M164 70 C149 111 136 159 127 202 C120 237 105 258 77 257 C55 256 43 244 48 229",
    delay: 175,
    duration: 240,
    end: [48, 229],
    width: 2.8,
  },
  {
    d: "M180 230 C193 181 208 123 224 76 C232 54 245 51 251 66 C257 83 248 111 231 139",
    delay: 400,
    duration: 200,
    end: [231, 139],
    width: 2.8,
  },
  {
    d: "M225 92 C263 70 307 72 317 94 C327 117 296 139 242 141",
    delay: 585,
    duration: 180,
    end: [242, 141],
    width: 2.5,
  },
  {
    d: "M369 95 C350 76 315 79 299 99 C282 120 297 138 326 149 C356 160 369 177 355 200 C338 226 305 224 291 205 C310 219 340 216 367 199",
    delay: 750,
    duration: 260,
    end: [367, 199],
    width: 2.7,
  },
  {
    d: "M371 194 C382 165 415 154 430 173 C445 193 426 217 403 215 C380 213 379 182 402 169 C419 159 435 171 433 191 C432 204 440 213 453 211",
    delay: 995,
    duration: 160,
    end: [453, 211],
    width: 2.4,
  },
  {
    d: "M453 211 C467 172 477 125 487 80 C492 56 508 50 513 66 C520 88 500 129 475 157 C462 171 458 197 475 211",
    delay: 1140,
    duration: 200,
    end: [475, 211],
    width: 2.5,
  },
  {
    d: "M475 211 C478 202 479 190 475 181 C482 211 496 222 511 214 C528 205 540 185 549 169 C541 192 544 211 560 213",
    delay: 1325,
    duration: 150,
    end: [560, 213],
    width: 2.4,
  },
  {
    d: "M560 213 C563 207 563 202 560 198 C570 172 599 158 614 174 C628 190 613 215 592 215 C571 215 569 187 588 174 C604 163 619 173 618 192 C617 206 625 214 638 211",
    delay: 1460,
    duration: 160,
    end: [638, 211],
    width: 2.4,
  },
  {
    d: "M638 211 C641 207 641 203 638 200 C646 175 673 160 687 176 C699 190 686 214 666 215 C646 215 646 187 663 176 C676 168 689 173 692 187",
    delay: 1605,
    duration: 160,
    end: [692, 187],
    width: 2.5,
  },
  {
    d: "M692 190 C702 154 714 112 725 78 C733 56 747 53 751 68 C756 87 741 117 724 139 C708 160 703 198 722 211",
    delay: 1750,
    duration: 210,
    end: [722, 211],
    width: 2.5,
  },
  {
    d: "M722 211 C725 207 725 202 722 198 C731 172 758 160 775 175 C791 190 778 215 755 215 C733 215 730 188 747 174 C761 163 780 173 788 190 C796 205 807 212 819 208",
    delay: 1945,
    duration: 170,
    end: [819, 208],
    width: 2.4,
  },
  {
    d: "M819 210 C827 191 834 173 842 164 C850 155 857 162 854 176 C851 189 852 202 861 207 C872 212 881 199 891 181 C900 164 914 159 924 168",
    delay: 2100,
    duration: 150,
    end: [924, 168],
    width: 2.4,
  },
  {
    d: "M52 244 C267 278 575 276 935 230",
    delay: 2235,
    duration: 300,
    end: [935, 230],
    width: 1.6,
  },
] as const;

const signatureAccentStars = [
  { x: 82, y: 92, delay: 100, radius: 2.4, flare: 7 },
  { x: 164, y: 70, delay: 220, radius: 3.2, flare: 12 },
  { x: 127, y: 202, delay: 355, radius: 2.8, flare: 9 },
  { x: 180, y: 230, delay: 460, radius: 3.3, flare: 13 },
  { x: 369, y: 95, delay: 770, radius: 3, flare: 11 },
  { x: 403, y: 215, delay: 1040, radius: 2.2, flare: 6 },
  { x: 487, y: 80, delay: 1190, radius: 2.8, flare: 9 },
  { x: 549, y: 169, delay: 1370, radius: 2.2, flare: 6 },
  { x: 725, y: 78, delay: 1800, radius: 3, flare: 11 },
  { x: 842, y: 164, delay: 2140, radius: 2.6, flare: 8 },
] as const;

type OpeningSequenceProps = {
  onComplete?: (preserveLocation?: boolean) => void;
  skipForPerformance?: boolean;
};

function SignatureConstellation() {
  return (
    <svg
      aria-hidden="true"
      className="splash-signature"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1000 300"
    >
      <defs>
        <filter
          colorInterpolationFilters="sRGB"
          id="signature-ink-glow"
          x="-25%"
          y="-55%"
          width="150%"
          height="210%"
        >
          <feGaussianBlur in="SourceGraphic" result="wide-blur" stdDeviation="7" />
          <feFlood floodColor="#ffffff" floodOpacity="0.38" result="wide-color" />
          <feComposite in="wide-color" in2="wide-blur" operator="in" result="wide-glow" />
          <feGaussianBlur in="SourceGraphic" result="close-blur" stdDeviation="2.2" />
          <feFlood floodColor="#ffffff" floodOpacity="0.9" result="close-color" />
          <feComposite in="close-color" in2="close-blur" operator="in" result="close-glow" />
          <feMerge>
            <feMergeNode in="wide-glow" />
            <feMergeNode in="close-glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="signature-line-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f4f5f8" />
          <stop offset="0.48" stopColor="#ffffff" />
          <stop offset="0.76" stopColor="#ffffff" />
          <stop offset="1" stopColor="#f0f2f6" />
        </linearGradient>
        <radialGradient id="signature-node-glow">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.18" stopColor="#ffffff" stopOpacity="0.96" />
          <stop offset="0.5" stopColor="#e5e8ee" stopOpacity="0.5" />
          <stop offset="1" stopColor="#d9dde6" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#signature-ink-glow)">
        {signatureStrokes.map((stroke, index) => {
          const [endX, endY] = stroke.end;
          const strokeDelay = Math.round(stroke.delay * signatureTimeScale);
          const strokeDuration = Math.round(stroke.duration * signatureTimeScale);
          const finishDelay = strokeDelay + strokeDuration - 50;
          const isMajorNode = index % 4 === 0 || index === signatureStrokes.length - 1;

          return (
            <g key={stroke.d}>
              <path
                className="splash-signature-stroke"
                d={stroke.d}
                pathLength={1}
                stroke="url(#signature-line-gradient)"
                strokeWidth={stroke.width}
                style={
                  {
                    "--signature-delay": `${strokeDelay}ms`,
                    "--signature-duration": `${strokeDuration}ms`,
                  } as CSSProperties
                }
              />
              <circle
                className="splash-signature-node-halo"
                cx={endX}
                cy={endY}
                fill="url(#signature-node-glow)"
                r={isMajorNode ? 17 : 11}
                style={{ "--signature-delay": `${finishDelay}ms` } as CSSProperties}
              />
              <circle
                className="splash-signature-node"
                cx={endX}
                cy={endY}
                r={isMajorNode ? 3.8 : 2.6}
                style={{ "--signature-delay": `${finishDelay}ms` } as CSSProperties}
              />
            </g>
          );
        })}

        {signatureAccentStars.map((star) => {
          const starDelay = Math.round(star.delay * signatureTimeScale);

          return (
            <g
              className="splash-signature-accent"
              key={`${star.x}-${star.y}`}
              style={{ "--signature-delay": `${starDelay}ms` } as CSSProperties}
            >
              <circle
                className="splash-signature-accent-halo"
                cx={star.x}
                cy={star.y}
                fill="url(#signature-node-glow)"
                r={star.flare * 1.45}
              />
              <path
                className="splash-signature-flare"
                d={`M ${star.x - star.flare} ${star.y} H ${star.x + star.flare} M ${star.x} ${star.y - star.flare} V ${star.y + star.flare}`}
              />
              <circle
                className="splash-signature-accent-core"
                cx={star.x}
                cy={star.y}
                r={star.radius}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function OpeningSequence({
  onComplete,
  skipForPerformance = false,
}: OpeningSequenceProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const shouldSkipSequence = consumeOpeningSequenceSkip();

    if (shouldSkipSequence || skipForPerformance) {
      if (onCompleteRef.current) {
        onCompleteRef.current(true);
      } else {
        setIsComplete(true);
      }

      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      if (onCompleteRef.current) {
        onCompleteRef.current(true);
      } else {
        setIsComplete(true);
      }

      return;
    }

    setHasMounted(true);

    const exitTimer = window.setTimeout(
      () => setIsExiting(true),
      autoExitDelay,
    );
    const completeTimer = window.setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current(false);
      } else {
        setIsComplete(true);
      }
    }, autoCompleteDelay);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(completeTimer);
    };
  }, [skipForPerformance]);

  if (isComplete) {
    return null;
  }

  return (
    <div
      className={`splash-screen splash-title-sequence splash-signature-sequence${
        hasMounted ? " is-mounted" : ""
      }${isExiting ? " is-exiting" : ""}`}
    >
      <ZodiacField isActive={hasMounted} variant="splash" />
      <div aria-hidden="true" className="splash-light-leak" />
      <div aria-hidden="true" className="splash-light-sweep" />

      <div aria-hidden="true" className="splash-signature-stage">
        <SignatureConstellation />
      </div>
    </div>
  );
}
