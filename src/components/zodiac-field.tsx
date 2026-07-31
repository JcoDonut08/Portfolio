import type { CSSProperties } from "react";

type Point = readonly [number, number];

type ZodiacConstellation = {
  id: string;
  lines: readonly (readonly Point[])[];
  placement: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
  };
};

type ZodiacFieldProps = {
  isActive?: boolean;
  variant?: "hero" | "splash";
};

/*
 * Coordinates are right ascension / declination line geometry for the
 * traditional twelve-sign zodiac. The familiar chart-line convention is
 * attributed in ATTRIBUTIONS.md; the field stays unlabeled in the UI.
 */
const zodiacConstellations: readonly ZodiacConstellation[] = [
  {
    id: "aries",
    lines: [[[42.496, 27.2605], [31.7934, 23.4624], [28.66, 20.808], [28.3826, 19.2939]]],
    placement: { x: 132, y: 125, width: 108, height: 66, rotation: -12 },
  },
  {
    id: "taurus",
    lines: [
      [[84.4112, 21.1425], [68.9802, 16.5093], [67.1656, 15.8709], [64.9483, 15.6276], [65.7337, 17.5425], [67.1542, 19.1804], [81.573, 28.6075]],
      [[64.9483, 15.6276], [60.1701, 12.4903], [51.7923, 9.7327], [60.7891, 5.9893]],
      [[51.7923, 9.7327], [51.2033, 9.0289], [54.2183, 0.4017]],
    ],
    placement: { x: 335, y: 78, width: 142, height: 104, rotation: -7 },
  },
  {
    id: "gemini",
    lines: [
      [[93.7194, 22.5068], [95.7401, 22.5136], [100.983, 25.1311], [107.7849, 30.2452], [113.6494, 31.8883], [116.329, 28.0262], [113.9806, 26.8957], [110.0307, 21.9823], [106.0272, 20.5703], [99.4279, 16.3993], [101.3224, 12.8956]],
      [[110.0307, 21.9823], [109.5232, 16.5404]],
    ],
    placement: { x: 565, y: 66, width: 128, height: 112, rotation: 4 },
  },
  {
    id: "cancer",
    lines: [
      [[134.6218, 11.8577], [131.1712, 18.1543], [130.8214, 21.4685], [131.6666, 28.7651]],
      [[131.1712, 18.1543], [124.1288, 9.1855]],
    ],
    placement: { x: 798, y: 76, width: 82, height: 104, rotation: 8 },
  },
  {
    id: "leo",
    lines: [
      [[152.093, 11.9672], [151.8331, 16.7627], [154.9931, 19.8415], [168.5271, 20.5237], [177.2649, 14.5721], [168.56, 15.4296], [152.093, 11.9672]],
      [[154.9931, 19.8415], [154.1726, 23.4173], [148.1909, 26.007], [146.4628, 23.7743]],
    ],
    placement: { x: 1010, y: 76, width: 132, height: 90, rotation: -5 },
  },
  {
    id: "virgo",
    lines: [
      [[176.4648, 6.5294], [177.6738, 1.7647], [-175.0235, -0.6668], [-169.5848, -1.4494], [-162.5125, -5.539], [-158.7018, -11.1613], [-145.9964, -6.0005], [-139.2349, -5.6582]],
      [[-164.4558, 10.9592], [-166.0991, 3.3975], [-169.5848, -1.4494]],
      [[-162.5125, -5.539], [-156.3267, -0.5958], [-149.5884, 1.5445], [-138.4378, 1.8929]],
    ],
    placement: { x: 1263, y: 110, width: 154, height: 106, rotation: 6 },
  },
  {
    id: "libra",
    lines: [
      [[-133.9824, -25.282], [-137.2804, -16.0418], [-130.7483, -9.3829], [-126.1184, -14.7895], [-125.744, -28.1351], [-125.336, -29.7778]],
      [[-137.2804, -16.0418], [-126.1184, -14.7895]],
    ],
    placement: { x: 1446, y: 308, width: 92, height: 112, rotation: 12 },
  },
  {
    id: "scorpius",
    lines: [
      [[-120.287, -26.1141], [-119.9166, -22.6217], [-118.6407, -19.8055]],
      [[-119.9166, -22.6217], [-114.7028, -25.5928], [-112.6481, -26.432], [-111.0294, -28.216], [-107.4591, -34.2932], [-107.0324, -38.0474], [-106.3541, -42.3613], [-101.9617, -43.2392], [-95.6703, -42.9978], [-93.1038, -40.127], [-94.378, -39.03], [-96.5978, -37.1038]],
    ],
    placement: { x: 1432, y: 554, width: 114, height: 138, rotation: 8 },
  },
  {
    id: "sagittarius",
    lines: [
      [[-85.5932, -36.7617], [-83.957, -34.3846], [-84.7515, -29.8281], [-83.0073, -25.4217], [-86.5591, -21.0588]],
      [[-69.3404, -44.459], [-69.0284, -40.6159], [-74.347, -29.8801], [-78.5859, -26.9908], [-83.0073, -25.4217]],
      [[-61.1846, -41.8683], [-60.0659, -35.2763], [-61.0402, -26.2995], [-65.8232, -24.8836], [-68.6813, -24.5086], [-71.1149, -25.2567], [-76.1836, -26.2967], [-78.5859, -26.9908], [-84.7515, -29.8281], [-88.548, -30.4241], [-83.957, -34.3846], [-74.347, -29.8801], [-73.265, -27.6704], [-76.1836, -26.2967], [-73.8292, -21.7415], [-72.559, -21.0236], [-70.5913, -18.9529], [-69.5818, -17.8472], [-69.5682, -15.955]],
      [[-73.8292, -21.7415], [-75.5675, -21.1067], [-76.4576, -22.7448], [-76.1836, -26.2967]],
    ],
    placement: { x: 1190, y: 724, width: 150, height: 118, rotation: 4 },
  },
  {
    id: "capricornus",
    lines: [[[-55.588, -12.5082], [-54.7472, -14.7814], [-52.7849, -17.8137], [-48.4761, -25.2709], [-47.0446, -26.9191], [-38.3332, -22.4113], [-33.2398, -16.1273], [-34.9773, -16.6623], [-39.4383, -16.8345], [-43.5132, -17.2329], [-55.588, -12.5082]]],
    placement: { x: 914, y: 762, width: 142, height: 88, rotation: -4 },
  },
  {
    id: "aquarius",
    lines: [
      [[-48.081, -9.4958], [-46.8365, -8.9833], [-37.1103, -5.5712], [-28.554, -0.3199], [-24.5859, -1.3873], [-22.792, -0.02], [-21.1609, -0.1175], [-16.8464, -7.5796], [-10.5241, -9.1825], [-12.6383, -21.1724]],
      [[-37.1103, -5.5712], [-28.3907, -13.8697]],
      [[-28.554, -0.3199], [-25.7915, -7.7833]],
      [[-22.792, -0.02], [-23.6807, 1.3774]],
      [[-9.2574, -20.1006], [-10.5241, -9.1825], [-4.5591, -17.8165]],
    ],
    placement: { x: 574, y: 728, width: 168, height: 112, rotation: -4 },
  },
  {
    id: "pisces",
    lines: [
      [[18.4373, 24.5837], [17.9152, 30.0896], [19.8666, 27.2641], [18.4373, 24.5837], [17.8634, 21.0347], [22.8709, 15.3458], [26.3485, 9.1577], [30.5118, 2.7638], [28.389, 3.1875], [25.3579, 5.4876], [22.5463, 6.1438], [18.4329, 7.5754], [15.7359, 7.8901], [12.1706, 7.5851], [-0.1721, 6.8633], [-5.0123, 5.6263], [-8.0079, 6.379], [-9.9142, 5.3813], [-10.7086, 3.2823], [-8.2669, 1.2556], [-4.4883, 1.78], [-3.402, 3.4868], [-5.0123, 5.6263]],
      [[-10.7086, 3.2823], [-14.0308, 3.82]],
    ],
    placement: { x: 248, y: 674, width: 176, height: 120, rotation: -8 },
  },
];

const ambientStars = Array.from({ length: 86 }, (_, index) => ({
  x: (index * 137.508 + 43) % 1600,
  y: (index * 83.173 + (index % 7) * 29) % 900,
  radius: index % 17 === 0 ? 1.55 : index % 5 === 0 ? 1.05 : 0.62,
  opacity: 0.22 + (index % 6) * 0.1,
}));

function unwrapLongitude(value: number, anchor: number) {
  let unwrapped = value;

  while (unwrapped - anchor > 180) unwrapped -= 360;
  while (unwrapped - anchor < -180) unwrapped += 360;

  return unwrapped;
}

function projectConstellation(constellation: ZodiacConstellation) {
  const anchor = constellation.lines[0][0][0];
  const unwrappedLines = constellation.lines.map((line) =>
    line.map(([longitude, latitude]) => [unwrapLongitude(longitude, anchor), latitude] as Point),
  );
  const points = unwrappedLines.flat();
  const minX = Math.min(...points.map(([x]) => x));
  const maxX = Math.max(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y));
  const maxY = Math.max(...points.map(([, y]) => y));
  const rangeX = Math.max(maxX - minX, 1);
  const rangeY = Math.max(maxY - minY, 1);
  const scale = Math.min(
    constellation.placement.width / rangeX,
    constellation.placement.height / rangeY,
  );
  const renderedWidth = rangeX * scale;
  const renderedHeight = rangeY * scale;
  const offsetX = (constellation.placement.width - renderedWidth) / 2;
  const offsetY = (constellation.placement.height - renderedHeight) / 2;

  const project = ([x, y]: Point): Point => [
    (x - minX) * scale + offsetX,
    constellation.placement.height - ((y - minY) * scale + offsetY),
  ];

  return {
    lines: unwrappedLines.map((line) => line.map(project)),
    stars: Array.from(
      new Map(
        points.map((point) => {
          const projected = project(point);
          return [`${projected[0].toFixed(2)}-${projected[1].toFixed(2)}`, projected] as const;
        }),
      ).values(),
    ),
  };
}

export function ZodiacField({ isActive = true, variant = "hero" }: ZodiacFieldProps) {
  return (
    <div
      aria-hidden="true"
      className={`zodiac-field zodiac-field--${variant}${isActive ? " is-active" : ""}`}
    >
      <span className="zodiac-nebula zodiac-nebula-primary" />
      <span className="zodiac-nebula zodiac-nebula-secondary" />
      <svg
        className="zodiac-sky"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1600 900"
      >
        <defs>
          <radialGradient id={`zodiac-glow-${variant}`}>
            <stop offset="0" stopColor="#f5f7ff" stopOpacity="0.95" />
            <stop offset="0.22" stopColor="#9eb6ff" stopOpacity="0.72" />
            <stop offset="1" stopColor="#648cff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="zodiac-ambient-stars">
          {ambientStars.map((star, index) => (
            <circle
              cx={star.x}
              cy={star.y}
              fill={index % 29 === 0 ? "#d8b06a" : "#f5f7ff"}
              key={`${star.x}-${star.y}`}
              opacity={star.opacity}
              r={star.radius}
            />
          ))}
        </g>

        <g className="zodiac-chart">
          <ellipse cx="800" cy="458" rx="770" ry="345" />
          <ellipse cx="800" cy="458" rx="625" ry="278" />
          <path d="M-40 585C315 312 742 235 1118 308c205 40 389 139 555 287" />
          <path className="zodiac-chart-dashed" d="M42 654C353 384 727 301 1094 353c202 29 374 108 501 204" />
        </g>

        <g className="zodiac-constellations">
          {zodiacConstellations.map((constellation, constellationIndex) => {
            const projected = projectConstellation(constellation);
            const { x, y, rotation, width, height } = constellation.placement;
            const delayStep = variant === "splash" ? 18 : 90;

            return (
              <g
                className="zodiac-constellation"
                key={constellation.id}
                style={{ "--zodiac-delay": `${constellationIndex * delayStep}ms` } as CSSProperties}
                transform={`translate(${x} ${y}) rotate(${rotation} ${width / 2} ${height / 2})`}
              >
                {projected.lines.map((line, lineIndex) => (
                  <polyline
                    className="zodiac-line"
                    key={`${constellation.id}-line-${lineIndex}`}
                    pathLength="1"
                    points={line.map(([pointX, pointY]) => `${pointX},${pointY}`).join(" ")}
                  />
                ))}
                {projected.stars.map(([starX, starY], starIndex) => (
                  <g key={`${constellation.id}-star-${starIndex}`}>
                    <circle
                      className="zodiac-star-halo"
                      cx={starX}
                      cy={starY}
                      fill={`url(#zodiac-glow-${variant})`}
                      r={starIndex % 7 === 0 ? 8 : 5.5}
                    />
                    <circle
                      className="zodiac-star"
                      cx={starX}
                      cy={starY}
                      r={starIndex % 7 === 0 ? 1.75 : 1.15}
                    />
                  </g>
                ))}
              </g>
            );
          })}
        </g>

      </svg>
    </div>
  );
}
