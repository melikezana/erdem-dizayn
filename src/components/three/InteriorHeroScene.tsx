"use client";

import React, { useMemo, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float, SoftShadows } from "@react-three/drei";
import * as THREE from "three";

export interface InteriorHeroSceneProps {
  progressRef?: React.MutableRefObject<number>;
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const emptySubscribe = () => () => {};

function hasWebGLSupport() {
  if (typeof window === "undefined") return true;

  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

function getReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia(REDUCED_MOTION_QUERY);
  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

function seededUnit(seed: number) {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function smoothRange(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0;
  return THREE.MathUtils.smoothstep(value, start, end);
}

function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const vertices = new Float32Array(220 * 3);

    for (let i = 0; i < 220; i += 1) {
      vertices[i * 3] = (seededUnit(i + 1) - 0.5) * 8.6;
      vertices[i * 3 + 1] = seededUnit(i + 221) * 3.9 - 0.15;
      vertices[i * 3 + 2] = (seededUnit(i + 441) - 0.5) * 8.2;
    }

    return vertices;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.012;
    pointsRef.current.position.y = Math.sin(clock.elapsedTime * 0.35) * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#E6C777"
        size={0.022}
        transparent
        opacity={0.34}
        depthWrite={false}
      />
    </points>
  );
}

function CameraRig({
  progressRef,
  reducedMotion,
}: {
  progressRef?: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const target = useRef(new THREE.Vector3(0, 1.12, -1));
  const position = useRef(new THREE.Vector3(3.2, 1.8, 7.4));

  useFrame(({ camera, pointer, clock }, delta) => {
    const progress = reducedMotion ? 0.12 : progressRef?.current ?? 0;
    const entry = smoothRange(progress, 0, 0.28);
    const close = smoothRange(progress, 0.24, 0.62);
    const reveal = smoothRange(progress, 0.58, 0.9);
    const exit = smoothRange(progress, 0.84, 1);
    const breathing = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.5) * 0.035;

    const nextTarget = target.current.set(
      THREE.MathUtils.lerp(0.25, -0.82, close) + reveal * 0.34,
      1.08 + entry * 0.18 + reveal * 0.08,
      THREE.MathUtils.lerp(-1.45, -3.15, close) - exit * 0.6
    );

    const nextPosition = position.current.set(
      THREE.MathUtils.lerp(3.35, -1.75, close) + pointer.x * 0.22,
      1.85 + entry * 0.22 + reveal * 0.36 + pointer.y * 0.08 + breathing,
      THREE.MathUtils.lerp(7.45, 2.06, close) - exit * 0.9
    );

    camera.position.lerp(nextPosition, reducedMotion ? 1 : Math.min(1, delta * 3.8));
    camera.lookAt(nextTarget);
  });

  return null;
}

function SlattedLight({
  progressRef,
}: {
  progressRef?: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const progress = progressRef?.current ?? 0;
    const detail = smoothRange(progress, 0.35, 0.72);

    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.damp(
      groupRef.current.rotation.y,
      -0.16 + detail * 0.22,
      2.4,
      delta
    );
    groupRef.current.position.x = THREE.MathUtils.damp(
      groupRef.current.position.x,
      2.62 - detail * 0.28,
      2.2,
      delta
    );
  });

  return (
    <group ref={groupRef} position={[2.62, 1.78, -2.86]}>
      {[-0.84, -0.42, 0, 0.42, 0.84].map((x, index) => (
        <mesh key={x} castShadow position={[x, 0, index % 2 === 0 ? 0 : 0.03]}>
          <boxGeometry args={[0.035, 2.4, 0.055]} />
          <meshStandardMaterial
            color="#C8A34C"
            emissive="#C8A34C"
            emissiveIntensity={0.08}
            metalness={0.32}
            roughness={0.34}
          />
        </mesh>
      ))}
    </group>
  );
}

function RoomComposition({
  progressRef,
  reducedMotion,
}: {
  progressRef?: React.MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const roomRef = useRef<THREE.Group>(null);
  const sofaRef = useRef<THREE.Group>(null);
  const tableRef = useRef<THREE.Group>(null);
  const artRef = useRef<THREE.Mesh<
    THREE.BufferGeometry,
    THREE.MeshStandardMaterial
  > | null>(null);

  useFrame(({ clock }, delta) => {
    const progress = progressRef?.current ?? 0;
    const entry = smoothRange(progress, 0, 0.24);
    const detail = smoothRange(progress, 0.42, 0.76);
    const exit = smoothRange(progress, 0.78, 1);
    const elapsed = clock.elapsedTime;

    if (roomRef.current) {
      roomRef.current.rotation.y = THREE.MathUtils.damp(
        roomRef.current.rotation.y,
        -0.08 + detail * 0.16 - exit * 0.08,
        2.2,
        delta
      );
      roomRef.current.position.x = THREE.MathUtils.damp(
        roomRef.current.position.x,
        0.08 - entry * 0.22 + exit * 0.32,
        2.4,
        delta
      );
    }

    if (sofaRef.current) {
      sofaRef.current.position.z = THREE.MathUtils.damp(
        sofaRef.current.position.z,
        -1.34 + detail * 0.28,
        2.6,
        delta
      );
    }

    if (tableRef.current && !reducedMotion) {
      tableRef.current.position.y = 0.2 + Math.sin(elapsed * 0.68) * 0.012;
    }

    if (artRef.current) {
      artRef.current.material.opacity = 0.62 + detail * 0.22 - exit * 0.2;
    }
  });

  return (
    <group ref={roomRef} position={[0, -0.58, 0]}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.35]}>
        <planeGeometry args={[9.5, 9.8]} />
        <meshStandardMaterial color="#CFC0AD" roughness={0.86} metalness={0.02} />
      </mesh>

      <mesh receiveShadow position={[0, 1.86, -4.35]}>
        <boxGeometry args={[9.5, 3.72, 0.12]} />
        <meshStandardMaterial color="#EEE2D2" roughness={0.84} />
      </mesh>

      <mesh receiveShadow position={[-4.76, 1.62, -0.38]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 3.24, 0.12]} />
        <meshStandardMaterial color="#B9AB9E" roughness={0.78} />
      </mesh>

      <mesh receiveShadow position={[4.76, 1.62, -0.38]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[8, 3.24, 0.12]} />
        <meshStandardMaterial color="#2A2520" roughness={0.72} />
      </mesh>

      <mesh receiveShadow rotation={[Math.PI / 2, 0, 0]} position={[0, 3.74, -0.35]}>
        <planeGeometry args={[9.5, 8]} />
        <meshStandardMaterial color="#2C2721" roughness={0.76} />
      </mesh>

      <mesh ref={artRef} position={[-1.45, 1.86, -4.27]}>
        <boxGeometry args={[2.25, 1.32, 0.05]} />
        <meshStandardMaterial
          color="#F6EBDD"
          emissive="#C8A34C"
          emissiveIntensity={0.04}
          roughness={0.68}
          transparent
          opacity={0.68}
        />
      </mesh>

      <SlattedLight progressRef={progressRef} />

      <group ref={sofaRef} position={[-1.48, 0.34, -1.34]} rotation={[0, 0.08, 0]}>
        <mesh castShadow receiveShadow position={[0, 0.28, 0]}>
          <boxGeometry args={[2.55, 0.48, 1.02]} />
          <meshStandardMaterial color="#24211D" roughness={0.9} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.78, -0.46]}>
          <boxGeometry args={[2.65, 0.98, 0.22]} />
          <meshStandardMaterial color="#302A24" roughness={0.86} />
        </mesh>
        {[-1.36, 1.36].map((x) => (
          <mesh key={x} castShadow receiveShadow position={[x, 0.57, 0]}>
            <boxGeometry args={[0.24, 0.78, 1.05]} />
            <meshStandardMaterial color="#1D1A17" roughness={0.84} />
          </mesh>
        ))}
        <mesh castShadow position={[-0.55, 0.68, 0.08]}>
          <boxGeometry args={[0.68, 0.2, 0.56]} />
          <meshStandardMaterial color="#A87548" roughness={0.78} />
        </mesh>
        <mesh castShadow position={[0.32, 0.69, 0.09]}>
          <boxGeometry args={[0.72, 0.18, 0.56]} />
          <meshStandardMaterial color="#D9C8B4" roughness={0.78} />
        </mesh>
      </group>

      <group ref={tableRef} position={[0.85, 0.2, 0.45]}>
        <mesh castShadow receiveShadow position={[0, 0.19, 0]}>
          <cylinderGeometry args={[0.68, 0.78, 0.14, 48]} />
          <meshStandardMaterial color="#C8A34C" metalness={0.4} roughness={0.28} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.36, 20]} />
          <meshStandardMaterial color="#5F554A" metalness={0.28} roughness={0.42} />
        </mesh>
      </group>

      <Float
        speed={reducedMotion ? 0 : 0.9}
        rotationIntensity={reducedMotion ? 0 : 0.08}
        floatIntensity={reducedMotion ? 0 : 0.12}
      >
        <group position={[2.52, 1.1, -1.25]} rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.18, 0.24, 1.24, 24]} />
            <meshStandardMaterial color="#B98247" metalness={0.44} roughness={0.32} />
          </mesh>
          <mesh castShadow position={[0, 0.73, 0]}>
            <sphereGeometry args={[0.34, 28, 16]} />
            <meshStandardMaterial
              color="#F6E4BF"
              emissive="#E8BB61"
              emissiveIntensity={0.82}
              roughness={0.4}
            />
          </mesh>
          <pointLight position={[0, 0.8, 0]} intensity={1.65} color="#F8D894" />
        </group>
      </Float>

      <group position={[-3.2, 0.86, -4.2]}>
        {[0, 0.46, 0.92].map((y) => (
          <mesh key={y} castShadow receiveShadow position={[0, y, 0]}>
            <boxGeometry args={[1.52, 0.05, 0.22]} />
            <meshStandardMaterial color="#5A4A3D" roughness={0.66} />
          </mesh>
        ))}
        {[-0.68, 0.68].map((x) => (
          <mesh key={x} castShadow receiveShadow position={[x, 0.46, 0]}>
            <boxGeometry args={[0.05, 0.94, 0.22]} />
            <meshStandardMaterial color="#5A4A3D" roughness={0.66} />
          </mesh>
        ))}
      </group>

      <mesh receiveShadow rotation={[-Math.PI / 2, 0, -0.05]} position={[-0.2, 0.012, 0.42]}>
        <planeGeometry args={[3.45, 1.95]} />
        <meshStandardMaterial color="#8D8276" roughness={0.92} />
      </mesh>

      <mesh position={[0.4, 0.02, 1.48]} rotation={[-Math.PI / 2, 0, -0.05]}>
        <planeGeometry args={[2.04, 0.028]} />
        <meshStandardMaterial
          color="#C8A34C"
          emissive="#C8A34C"
          emissiveIntensity={0.12}
          metalness={0.42}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function InteriorSceneFallback() {
  return (
    <div
      aria-hidden="true"
      className="relative h-full w-full overflow-hidden bg-[#151310]"
    >
      <div className="absolute inset-0 bg-architectural-grid-dark opacity-35" />
      <div className="absolute left-[18%] top-[20%] h-[52%] w-[64%] border border-[#f8f0e5]/12 bg-[#f8f0e5]/5" />
      <div className="absolute bottom-[22%] left-[22%] h-[22%] w-[38%] bg-[#211d1a]" />
      <div className="absolute bottom-[39%] left-[24%] h-[14%] w-[34%] bg-[#302b25]" />
      <div className="absolute right-[24%] top-[18%] h-[36%] w-px bg-[#c8a34c]/60" />
      <div className="absolute right-[29%] top-[18%] h-[36%] w-px bg-[#c8a34c]/35" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(0deg,rgba(21,19,16,0.95)_0%,rgba(21,19,16,0)_100%)]" />
    </div>
  );
}

export function InteriorHeroScene({ progressRef }: InteriorHeroSceneProps) {
  const hasWebGL = useSyncExternalStore(
    emptySubscribe,
    hasWebGLSupport,
    () => true
  );
  const reducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotion,
    () => false
  );

  if (!hasWebGL) {
    return <InteriorSceneFallback />;
  }

  return (
    <div aria-hidden="true" className="h-full w-full select-none">
      <Canvas
        shadows={!reducedMotion}
        dpr={[1, 1.45]}
        frameloop={reducedMotion ? "demand" : "always"}
        camera={{ position: [3.2, 1.8, 7.4], fov: 40 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ camera, gl }) => {
          gl.setClearColor(0x151310, 0);
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          camera.lookAt(0, 1.1, -1);
        }}
      >
        <SoftShadows size={18} samples={8} focus={0.42} />
        <fog attach="fog" args={["#151310", 6.5, 14]} />
        <ambientLight intensity={0.62} color="#F8F0E5" />
        <hemisphereLight args={["#FFF8EA", "#75685D", 0.92]} />
        <directionalLight
          position={[4.5, 7.5, 5.2]}
          intensity={2.15}
          color="#FFF2D2"
          castShadow={!reducedMotion}
          shadow-mapSize-width={896}
          shadow-mapSize-height={896}
          shadow-bias={-0.00015}
        />
        <directionalLight position={[-5.5, 3, -3]} intensity={0.48} color="#9CA58C" />
        <pointLight position={[-2.2, 1.5, 2.2]} intensity={0.48} color="#B98247" />

        <CameraRig progressRef={progressRef} reducedMotion={reducedMotion} />
        <RoomComposition progressRef={progressRef} reducedMotion={reducedMotion} />
        {!reducedMotion && <DustParticles />}

        <ContactShadows
          position={[0, -0.56, 0]}
          opacity={0.34}
          scale={8}
          blur={2.8}
          far={4}
          color="#0E0B09"
        />
      </Canvas>
    </div>
  );
}
