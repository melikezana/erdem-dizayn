"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Lenis, { type ScrollToOptions } from "lenis";

type LenisTarget = number | string | HTMLElement;

interface LenisController {
  lenis: Lenis | null;
  scrollTo: (target: LenisTarget, options?: ScrollToOptions) => void;
  stop: () => void;
  start: () => void;
  resize: () => void;
}

const LenisContext = createContext<LenisController | null>(null);

export function useLenisController() {
  const context = useContext(LenisContext);

  if (!context) {
    throw new Error("useLenisController must be used inside LenisProvider.");
  }

  return context;
}

export const LenisProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const controller = new Lenis({
      lerp: 0.105,
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.86,
      touchMultiplier: 1,
      gestureOrientation: "vertical",
      anchors: false,
      autoRaf: false,
      respectReducedMotion: true,
      prevent: (node) =>
        Boolean(
          node.closest(
            "[data-lenis-prevent], [role='dialog'], input, textarea, select"
          ) || node.isContentEditable
        ),
    });

    lenisRef.current = controller;
    setLenis(controller);

    let frameId = window.requestAnimationFrame(function raf(time) {
      controller.raf(time);
      frameId = window.requestAnimationFrame(raf);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      controller.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const value = useMemo<LenisController>(
    () => ({
      lenis,
      scrollTo: (target, options) => {
        lenisRef.current?.scrollTo(target, {
          duration: 1.05,
          lerp: 0.11,
          ...options,
        });
      },
      stop: () => lenisRef.current?.stop(),
      start: () => lenisRef.current?.start(),
      resize: () => lenisRef.current?.resize(),
    }),
    [lenis]
  );

  return (
    <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
  );
};
