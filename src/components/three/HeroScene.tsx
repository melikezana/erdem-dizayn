"use client";

import React, { Suspense, useRef, useSyncExternalStore } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import {
  ArchitecturalModel,
  type VillaSceneState,
} from "./ArchitecturalModel";

interface HeroSceneProps {
  storyRef?: React.MutableRefObject<VillaSceneState>;
  isTechnicalMode?: boolean;
  isIntroActive?: boolean;
}

const MOBILE_QUERY = "(max-width: 767px)";
const emptySubscribe = () => () => {};

function subscribeToMobileQuery(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", callback);

  return () => media.removeEventListener("change", callback);
}

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

function getIsMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(MOBILE_QUERY).matches;
}

function SceneFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-[#F6F2EA] p-6 text-center text-[#102B49]">
      <div className="mb-3 h-8 w-8 animate-spin rounded-full border border-[#9A5C2F] border-t-transparent" />
      <span className="font-mono text-xs uppercase tracking-widest text-[#102B49]/70">
        MİMARİ MODEL YÜKLENİYOR
      </span>
    </div>
  );
}

export const HeroScene: React.FC<HeroSceneProps> = ({
  storyRef,
  isTechnicalMode = false,
  isIntroActive = false,
}) => {
  const fallbackStoryRef = useRef<VillaSceneState>({
    scrollProgress: 0,
    pointerX: 0,
    pointerY: 0,
    pointerInfluence: 0,
    isReducedMotion: false,
    isDesktop: false,
  });
  const sceneStoryRef = storyRef ?? fallbackStoryRef;

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

  const isMobileViewport = useSyncExternalStore(
    subscribeToMobileQuery,
    getIsMobileViewport,
    () => false
  );

  const maxDpr = isMobileViewport ? 1.25 : 1.5;
  const enableRealtimeShadows = !isMobileViewport;

  if (!isMounted) return <SceneFallback />;

  if (!hasWebGL) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center border border-[#102B49]/10 bg-[#F6F2EA] p-8 text-center text-[#102B49]">
        <h3 className="mb-2 font-serif text-lg font-bold uppercase">2D Mimari Sunum</h3>
        <p className="max-w-sm font-mono text-xs text-gray-600">
          Cihazınızda 3D hızlandırma aktif olmadığından 2D mimari projemiz gösterilmektedir.
        </p>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="relative h-full w-full select-none">
      <Canvas
        shadows={enableRealtimeShadows}
        dpr={[1, maxDpr]}
        frameloop="always"
        camera={{ position: [6.2, 3.1, 7.2], fov: 37 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ camera, gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.shadowMap.type = THREE.PCFShadowMap;
          camera.lookAt(0, 0, 0);
        }}
        className="h-full w-full"
      >
        <ambientLight intensity={1.15} color="#FAF8F5" />

        <hemisphereLight args={["#FFFFFF", "#EAE5DC", 0.9]} />

        <directionalLight
          position={[10, 16, 9]}
          intensity={2.15}
          color="#FFFFFF"
          castShadow={enableRealtimeShadows}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        <directionalLight
          position={[-12, 9, -8]}
          intensity={0.85}
          color="#E6C5A8"
        />

        <Suspense fallback={null}>
          <ArchitecturalModel
            storyRef={sceneStoryRef}
            isTechnicalMode={isTechnicalMode}
            isIntroActive={isIntroActive}
            enableRealtimeShadows={enableRealtimeShadows}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
