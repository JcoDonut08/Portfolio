"use client";

import { Html, Line } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type CSSProperties } from "react";
import * as THREE from "three";

import { skills, type Skill, type SkillId } from "@/components/skills-data";

type SkillsOrbitSceneProps = {
  isDragging: boolean;
  onRotate: (amount: number) => void;
  onSelect: (skillId: SkillId) => void;
  reducedMotion: boolean;
  rotation: number;
  selectedId: SkillId;
};

type OrbitPlaneProps = {
  isDragging: boolean;
  orbit: Skill["orbit"];
  onRotate: SkillsOrbitSceneProps["onRotate"];
  onSelect: SkillsOrbitSceneProps["onSelect"];
  reducedMotion: boolean;
  rotation: number;
  selectedId: SkillId;
};

const ORBIT_CONFIGURATION = {
  inner: {
    ambientSpeed: 0.055,
    color: "#D8B06A",
    radius: 1.72,
    rotationFactor: 0.82,
    tilt: 0.72,
    yaw: -0.18,
  },
  outer: {
    ambientSpeed: 0.032,
    color: "#789CFF",
    radius: 2.78,
    rotationFactor: 1,
    tilt: 0.96,
    yaw: 0.14,
  },
} as const;

const SUN_VERTEX_SHADER = `
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const SUN_FRAGMENT_SHADER = `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    float ribbons = sin(vPosition.x * 12.0 + uTime * 0.55)
      * sin(vPosition.y * 10.0 - uTime * 0.34);
    float convection = sin(
      (vPosition.x + vPosition.y + vPosition.z) * 18.0 - uTime * 0.7
    );
    float heat = ribbons * 0.11 + convection * 0.07;
    float facing = max(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)), 0.0);
    float limb = pow(facing, 0.38);

    vec3 ember = vec3(0.96, 0.20, 0.015);
    vec3 gold = vec3(1.0, 0.68, 0.10);
    vec3 color = mix(ember, gold, clamp(0.64 + heat, 0.0, 1.0));
    color *= 0.72 + limb * 0.46;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function getOrbitPosition(angle: number, radius: number) {
  const radians = THREE.MathUtils.degToRad(angle);

  return [
    Math.sin(radians) * radius,
    Math.cos(radians) * radius,
    0,
  ] as [number, number, number];
}

function BrandIcon({ skill }: { skill: Skill }) {
  const brandColor =
    skill.icon.hex === "000000" ? "#F5F4EF" : `#${skill.icon.hex}`;

  return (
    <svg
      aria-hidden="true"
      className="skills-node-logo"
      style={{ "--skill-brand": brandColor } as CSSProperties}
      viewBox="0 0 24 24"
    >
      <path d={skill.icon.path} />
    </svg>
  );
}

function SkillNode({
  onSelect,
  onRotate,
  position,
  selected,
  skill,
}: {
  onSelect: SkillsOrbitSceneProps["onSelect"];
  onRotate: SkillsOrbitSceneProps["onRotate"];
  position: [number, number, number];
  selected: boolean;
  skill: Skill;
}) {
  const brandColor =
    skill.icon.hex === "000000" ? "#F5F4EF" : `#${skill.icon.hex}`;

  return (
    <group position={position}>
      <Html
        center
        distanceFactor={6}
        position={[0, 0, 0.08]}
        sprite
        transform
        zIndexRange={[4, 2]}
      >
        <button
          aria-label={`${skill.name}, ${skill.category}`}
          aria-pressed={selected}
          className="skills-node"
          onClick={() => onSelect(skill.id)}
          onFocus={() => onSelect(skill.id)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
              return;
            }

            event.preventDefault();
            onRotate(event.key === "ArrowLeft" ? -18 : 18);
          }}
          onPointerDown={(event) => event.stopPropagation()}
          style={{ "--skill-brand": brandColor } as CSSProperties}
          type="button"
        >
          <BrandIcon skill={skill} />
          <span className="skills-node-name">{skill.name}</span>
        </button>
      </Html>
    </group>
  );
}

function OrbitPlane({
  isDragging,
  onRotate,
  onSelect,
  orbit,
  reducedMotion,
  rotation,
  selectedId,
}: OrbitPlaneProps) {
  const ambientRotationRef = useRef(0);
  const groupRef = useRef<THREE.Group>(null);
  const configuration = ORBIT_CONFIGURATION[orbit];
  const orbitSkills = useMemo(
    () => skills.filter((skill) => skill.orbit === orbit),
    [orbit],
  );
  const selectedSkill = orbitSkills.find((skill) => skill.id === selectedId);
  const selectedPosition = selectedSkill
    ? getOrbitPosition(selectedSkill.angle, configuration.radius)
    : null;

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (reducedMotion) {
      ambientRotationRef.current = 0;
    } else if (!isDragging) {
      ambientRotationRef.current += delta * configuration.ambientSpeed;
    }

    const targetRotation = THREE.MathUtils.degToRad(
      rotation * configuration.rotationFactor,
    ) + ambientRotationRef.current;
    groupRef.current.rotation.z = reducedMotion
      ? targetRotation
      : THREE.MathUtils.damp(
          groupRef.current.rotation.z,
          targetRotation,
          8,
          delta,
        );
  });

  return (
    <group
      ref={groupRef}
      rotation={[configuration.tilt, configuration.yaw, 0]}
    >
      <mesh>
        <torusGeometry args={[configuration.radius, 0.012, 12, 192]} />
        <meshBasicMaterial
          color={configuration.color}
          opacity={orbit === "outer" ? 0.34 : 0.5}
          transparent
        />
      </mesh>

      <mesh rotation={[0, 0, orbit === "outer" ? 0.08 : -0.12]}>
        <torusGeometry
          args={[configuration.radius * 0.94, 0.004, 8, 160]}
        />
        <meshBasicMaterial
          color={configuration.color}
          opacity={0.16}
          transparent
        />
      </mesh>

      {selectedPosition ? (
        <Line
          color={configuration.color}
          lineWidth={0.7}
          opacity={0.7}
          points={[[0, 0, 0], selectedPosition]}
          transparent
        />
      ) : null}

      {orbitSkills.map((skill) => (
        <SkillNode
          key={skill.id}
          onRotate={onRotate}
          onSelect={onSelect}
          position={getOrbitPosition(skill.angle, configuration.radius)}
          selected={skill.id === selectedId}
          skill={skill}
        />
      ))}
    </group>
  );
}

function OrbitSun({ reducedMotion }: { reducedMotion: boolean }) {
  const coronaRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const sunRef = useRef<THREE.Group>(null);
  const sunUniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame(({ clock }, delta) => {
    if (!sunRef.current || !coronaRef.current || !materialRef.current) {
      return;
    }

    const elapsed = clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = reducedMotion ? 0 : elapsed;

    if (reducedMotion) {
      sunRef.current.rotation.set(0.18, -0.22, 0);
      coronaRef.current.scale.setScalar(1.14);
      return;
    }

    sunRef.current.rotation.x = THREE.MathUtils.damp(
      sunRef.current.rotation.x,
      0.18 + Math.sin(elapsed * 0.38) * 0.035,
      4,
      delta,
    );
    sunRef.current.rotation.y = elapsed * 0.11;
    coronaRef.current.scale.setScalar(
      1.14 + Math.sin(elapsed * 1.15) * 0.02,
    );
  });

  return (
    <group ref={sunRef}>
      <mesh>
        <sphereGeometry args={[0.72, 56, 56]} />
        <shaderMaterial
          fragmentShader={SUN_FRAGMENT_SHADER}
          ref={materialRef}
          uniforms={sunUniforms}
          vertexShader={SUN_VERTEX_SHADER}
        />
      </mesh>

      <mesh scale={1.012}>
        <icosahedronGeometry args={[0.72, 4]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#FFC85A"
          depthWrite={false}
          opacity={0.11}
          transparent
          wireframe
        />
      </mesh>

      <mesh position={[0.2, 0.14, 0.68]} scale={0.075}>
        <sphereGeometry args={[1, 18, 18]} />
        <meshBasicMaterial color="#B93D12" />
      </mesh>

      <mesh position={[-0.26, -0.18, 0.64]} scale={0.052}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#7F2811" />
      </mesh>

      <mesh ref={coronaRef} scale={1.26}>
        <sphereGeometry args={[0.72, 40, 40]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#FF941A"
          depthWrite={false}
          opacity={0.08}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      <pointLight
        color="#FFAA36"
        decay={2}
        distance={10}
        intensity={7.5}
      />
    </group>
  );
}

function OrbitInstrument({
  isDragging,
  onRotate,
  onSelect,
  reducedMotion,
  rotation,
  selectedId,
}: SkillsOrbitSceneProps) {
  const instrumentRef = useRef<THREE.Group>(null);
  const viewportWidth = useThree((state) => state.size.width);
  const scale =
    viewportWidth < 430 ? 0.64 : viewportWidth < 760 ? 0.78 : 0.88;

  useFrame(({ clock, pointer }, delta) => {
    if (!instrumentRef.current) {
      return;
    }

    if (reducedMotion) {
      instrumentRef.current.position.y = 0;
      instrumentRef.current.rotation.x = 0;
      instrumentRef.current.rotation.y = 0;
      return;
    }

    const elapsed = clock.getElapsedTime();
    const targetY = pointer.x * 0.08;
    const targetX = pointer.y * -0.04;

    instrumentRef.current.rotation.y = THREE.MathUtils.damp(
      instrumentRef.current.rotation.y,
      targetY,
      4,
      delta,
    );
    instrumentRef.current.rotation.x = THREE.MathUtils.damp(
      instrumentRef.current.rotation.x,
      targetX,
      4,
      delta,
    );
    instrumentRef.current.position.y = Math.sin(elapsed * 0.35) * 0.04;
  });

  return (
    <group
      ref={instrumentRef}
      scale={scale}
    >
      <OrbitPlane
        isDragging={isDragging}
        onRotate={onRotate}
        onSelect={onSelect}
        orbit="outer"
        reducedMotion={reducedMotion}
        rotation={rotation}
        selectedId={selectedId}
      />
      <OrbitPlane
        isDragging={isDragging}
        onRotate={onRotate}
        onSelect={onSelect}
        orbit="inner"
        reducedMotion={reducedMotion}
        rotation={rotation}
        selectedId={selectedId}
      />
      <OrbitSun reducedMotion={reducedMotion} />
    </group>
  );
}

export function SkillsOrbitScene({
  isDragging,
  onRotate,
  onSelect,
  reducedMotion,
  rotation,
  selectedId,
}: SkillsOrbitSceneProps) {
  return (
    <Canvas
      camera={{ far: 40, fov: 43, near: 0.1, position: [0, 0, 8.2] }}
      className="skills-orbit-canvas"
      dpr={reducedMotion ? 1 : [1, 1.5]}
      frameloop="always"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <ambientLight intensity={0.72} />
      <directionalLight
        color="#DCE5FF"
        intensity={1.9}
        position={[-3, 4, 6]}
      />
      <pointLight color="#D8B06A" intensity={1.2} position={[4, -2, 4]} />

      <OrbitInstrument
        isDragging={isDragging}
        onRotate={onRotate}
        onSelect={onSelect}
        reducedMotion={reducedMotion}
        rotation={rotation}
        selectedId={selectedId}
      />

      {isDragging ? (
        <pointLight color="#789CFF" intensity={1.6} position={[0, 0, 3]} />
      ) : null}
    </Canvas>
  );
}
