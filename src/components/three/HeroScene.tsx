"use client";

import React, { Suspense, useState, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { ArchitecturalModel } from "./ArchitecturalModel";

interface HeroSceneProps {
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
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

function SceneFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#F6F2EA] text-[#102B49] p-6 text-center">
      <div className="w-10 h-10 rounded-full border-2 border-[#9A5C2F] border-t-transparent animate-spin mb-3" />
      <p className="font-serif text-sm text-[#102B49] tracking-wide">
        Mimari Model Yükleniyor...
      </p>
      <span className="text-[10px] text-[#9A5C2F] mt-1 font-mono uppercase tracking-widest">
        ERDEM DİZAYN & MEKANİK
      </span>
    </div>
  );
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  activeHotspot,
  setActiveHotspot,
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

  // Mouse move handler for controlled camera/model yaw & pitch
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    setPointerPos({ x, y });
  };

  const handleMouseLeave = () => {
    setPointerPos({ x: 0, y: 0 });
  };

  if (!isMounted) {
    return <SceneFallback />;
  }

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F6F2EA] text-[#102B49] p-8 text-center border border-[#9A5C2F]/20 rounded-2xl">
        <h3 className="font-serif text-xl font-bold mb-2">3D Mimari Gösterim</h3>
        <p className="text-xs text-gray-600 max-w-sm">
          Cihazınızda 3D hızlandırma aktif olmadığından 2D mimari kataloğumuzu aşağıda inceleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full h-full relative min-h-[440px] sm:min-h-[560px] lg:min-h-[680px] select-none"
    >
      {/* Dynamic Interaction Badge */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#102B49]/10 shadow-sm backdrop-blur-md text-[11px] text-[#102B49] font-mono">
        <span className="w-2 h-2 rounded-full bg-[#9A5C2F] animate-pulse" />
        <span>İnteraktif Mimari Model • İncelemek için sürükleyin</span>
      </div>

      <Canvas
        shadows
        camera={{ position: [6.5, 3.2, 8.0], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        {/* Architectural Studio Lighting Setup */}
        {/* Soft Key Light */}
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.9}
          color="#FBFAF7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />

        {/* Warm Rim Light */}
        <directionalLight
          position={[-10, 12, -8]}
          intensity={1.2}
          color="#9A5C2F"
        />

        {/* Neutral Studio Fill Light */}
        <ambientLight intensity={0.95} color="#F6F2EA" />

        <Suspense fallback={null}>
          <ArchitecturalModel
            activeHotspot={activeHotspot}
            setActiveHotspot={setActiveHotspot}
            pointerPos={pointerPos}
          />

          {/* Floor Soft Contact Shadows */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.55}
            scale={14}
            blur={2.2}
            far={4}
            color="#102B49"
          />
        </Suspense>

        {/* Controlled OrbitControls (Restricted Angle, No Auto-Spin) */}
        <OrbitControls
          enableZoom={true}
          minDistance={5}
          maxDistance={12}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.15}
          enablePan={false}
          rotateSpeed={0.5}
          dampingFactor={0.05}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
};
