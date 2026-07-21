"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function SignalCore() {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(150 * 3);

    for (let i = 0; i < 150; i += 1) {
      const radius = 1.6 + Math.random() * 2.2;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 2.4;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = height;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    return positions;
  }, []);

  useFrame(({ clock, pointer }) => {
    const elapsed = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = elapsed * 0.16 + pointer.x * 0.22;
      groupRef.current.rotation.x = pointer.y * -0.14;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = elapsed * 0.34;
      innerRef.current.rotation.z = elapsed * -0.2;
    }

    if (outerRef.current) {
      outerRef.current.rotation.y = elapsed * -0.18;
      outerRef.current.rotation.z = elapsed * 0.12;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = elapsed * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particles, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#32E6E2"
          depthWrite={false}
          opacity={0.52}
          size={0.028}
          transparent
        />
      </points>

      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.75, 2]} />
        <meshBasicMaterial color="#32E6E2" opacity={0.22} transparent wireframe />
      </mesh>

      <mesh ref={innerRef}>
        <torusKnotGeometry args={[0.92, 0.18, 160, 18]} />
        <meshBasicMaterial color="#FF4D8D" opacity={0.58} transparent wireframe />
      </mesh>

      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[2.25, 0.01, 16, 180]} />
        <meshBasicMaterial color="#F2B84B" opacity={0.72} transparent />
      </mesh>

      <mesh rotation={[0, Math.PI / 2.8, Math.PI / 5]}>
        <torusGeometry args={[2.8, 0.006, 16, 180]} />
        <meshBasicMaterial color="#32E6E2" opacity={0.5} transparent />
      </mesh>
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 48 }}
      className="absolute inset-0"
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.8} />
      <SignalCore />
    </Canvas>
  );
}
