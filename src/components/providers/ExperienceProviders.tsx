"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { LenisProvider } from "@/components/providers/LenisProvider";

function PremiumCursor() {
  const shouldReduceMotion = useReducedMotion();
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (shouldReduceMotion || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const root = document.documentElement;
    root.classList.add("has-premium-cursor");

    const render = () => {
      const { x, y } = positionRef.current;
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      );
      dotRef.current?.style.setProperty(
        "transform",
        `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      );
      animationFrameRef.current = null;
    };

    const requestRender = () => {
      if (animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      root.classList.add("has-premium-cursor-active");
      positionRef.current = { x: event.clientX, y: event.clientY };
      requestRender();

      const target = event.target as HTMLElement | null;
      const interactive = target?.closest<HTMLElement>(
        "a, button, input, textarea, select, [data-cursor]"
      );
      const label = interactive?.dataset.cursor ?? "";

      cursorRef.current?.classList.toggle("is-active", Boolean(interactive));
      cursorRef.current?.classList.toggle("has-label", Boolean(label));
      dotRef.current?.classList.toggle("is-hidden", Boolean(interactive));

      if (labelRef.current) {
        labelRef.current.textContent = label;
      }
    };

    const handlePointerLeave = () => {
      cursorRef.current?.classList.remove("is-active", "has-label");
      dotRef.current?.classList.remove("is-hidden");
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      root.classList.remove("has-premium-cursor", "has-premium-cursor-active");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) return null;

  return (
    <>
      <div ref={cursorRef} className="premium-cursor" aria-hidden="true">
        <span ref={labelRef} />
      </div>
      <div ref={dotRef} className="premium-cursor-dot" aria-hidden="true" />
    </>
  );
}

function PageTransition({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={
          shouldReduceMotion
            ? false
            : { opacity: 0, y: 12, clipPath: "inset(0 0 4% 0)" }
        }
        animate={
          shouldReduceMotion
            ? undefined
            : { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }
        }
        exit={
          shouldReduceMotion
            ? undefined
            : { opacity: 0, y: -10, clipPath: "inset(4% 0 0 0)" }
        }
        transition={{ duration: 0.42, ease: [0.76, 0, 0.24, 1] }}
        className="min-h-full bg-[#151310]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function ExperienceProviders({ children }: React.PropsWithChildren) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <PageTransition>{children}</PageTransition>;
  }

  return (
    <LenisProvider>
      <PageTransition>{children}</PageTransition>
      <PremiumCursor />
    </LenisProvider>
  );
}
