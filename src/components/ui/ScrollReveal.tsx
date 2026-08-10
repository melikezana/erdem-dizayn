"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

type RevealElement = "div" | "section" | "article" | "li";

type ScrollRevealProps = React.PropsWithChildren<{
  as?: RevealElement;
  className?: string;
  delay?: number;
  amount?: number;
}>;

const revealTransition = {
  duration: 0.56,
  ease: [0.16, 1, 0.3, 1] as const,
};

export function ScrollReveal({
  as = "div",
  children,
  className = "",
  delay = 0,
  amount = 0.18,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionElement = motion[as] as React.ComponentType<
    React.PropsWithChildren<{
      className?: string;
      initial?: false | { opacity: number; y: number };
      whileInView?: { opacity: number; y: number };
      viewport?: { once: boolean; amount: number };
      transition?: typeof revealTransition & { delay: number };
      "data-cinema-reveal"?: true;
    }>
  >;

  return (
    <MotionElement
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ ...revealTransition, delay }}
      className={className}
      data-cinema-reveal
    >
      {children}
    </MotionElement>
  );
}
