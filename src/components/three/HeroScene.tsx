"use client";

import React, { Suspense, useState, useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { ArchitecturalModel } from "./ArchitecturalModel";

interface HeroSceneProps {
  isTechnicalMode?: boolean;
  isIntroActive?: boolean;
}

const emptySubscribe = () => () => {};

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

// Camera transition controller: Top-plan view -> 3/4 architectural perspective
function AnimatedCamera({ isIntroActive = true }: { isIntroActive?: boolean }) {
  const animTimeRef = useRef(0);

  useFrame((state, delta) => {
    const targetPos = new THREE.Vector3(6.8, 3.4, 8.2);

    if (!isIntroActive) {
      state.camera.position.lerp(targetPos, 0.12);
      state.camera.lookAt(0, 0, 0);
      return;
    }

    animTimeRef.current += delta;
    const time = animTimeRef.current;

    // Timeline:
    // 0.0s - 2.8s: Overhead top-plan view [0, 11, 1.2]
    // 2.8s - 5.8s: Smooth transition to 3/4 perspective [6.8, 3.4, 8.2]
    const startTime = 2.8;
    const duration = 3.0;

    let progress = 0;
    if (time > startTime) {
      progress = Math.min((time - startTime) / duration, 1);
    }

    const ease = 1 - Math.pow(1 - progress, 3.2);

    const startPos = new THREE.Vector3(0, 11, 1.2);

    state.camera.position.x = THREE.MathUtils.lerp(startPos.x, targetPos.x, ease);
    state.camera.position.y = THREE.MathUtils.lerp(startPos.y, targetPos.y, ease);
    state.camera.position.z = THREE.MathUtils.lerp(startPos.z, targetPos.z, ease);

    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

function SceneFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F6F2EA] text-[#102B49] p-6 text-center">
      <div className="w-8 h-8 rounded-full border border-[#9A5C2F] border-t-transparent animate-spin mb-3" />
      <span className="font-mono text-xs text-[#102B49]/70 uppercase tracking-widest">
        MİMARİ MODEL YÜKLENİYOR
      </span>
    </div>
  );
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  isTechnicalMode = false,
  isIntroActive = true,
}) => {
  const [pointerPos, setPointerPos] = useState({ x: 0, y: 0 });

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const hasWebGL = useSyncExternalStore(
    emptySubscribe,
    checkWebGLSupport,
    () => true
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointerPos({ x, y });
  };

  const handleMouseLeave = () => {
    setPointerPos({ x: 0, y: 0 });
  };

  if (!isMounted) return <SceneFallback />;

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F6F2EA] text-[#102B49] p-8 text-center border border-[#102B49]/10">
        <h3 className="font-serif text-lg font-bold mb-2 uppercase">2D Mimari Sunum</h3>
        <p className="text-xs text-gray-600 max-w-sm font-mono">
          Cihazınızda 3D hızlandırma aktif olmadığından 2D mimari projemiz gösterilmektedir.
        </p>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative select-none"
    >
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 11, 1.2], fov: 35 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          localClippingEnabled: true,
        }}
        className="w-full h-full"
      >
        <AnimatedCamera isIntroActive={isIntroActive} />

        {/* Bright Architectural Studio Lighting Rig */}
        <ambientLight intensity={1.1} color="#FAF8F5" />

        <hemisphereLight
          args={["#FFFFFF", "#EAE5DC", 0.9]}
        />

        {/* Neutral Key Light */}
        <directionalLight
          position={[12, 18, 10]}
          intensity={2.2}
          color="#FFFFFF"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Warm Architectural Rim & Fill Light */}
        <directionalLight
          position={[-12, 10, -8]}
          intensity={0.9}
          color="#E6C5A8"
        />

        <Suspense fallback={null}>
          <ArchitecturalModel
            pointerPos={pointerPos}
            isTechnicalMode={isTechnicalMode}
            isIntroActive={isIntroActive}
          />

          {/* Soft Floor Shadows */}
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.35}
            scale={14}
            blur={2.0}
            far={4}
            color="#102B49"
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

