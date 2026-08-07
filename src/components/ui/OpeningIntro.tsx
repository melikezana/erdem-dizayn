"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OpeningIntroProps {
  onComplete?: () => void;
}

export const OpeningIntro: React.FC<OpeningIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"masking" | "revealing" | "shrinking" | "done">("masking");

  useEffect(() => {
    // Stage 1: Initial masked reveal (0s -> 1.0s)
    const t1 = setTimeout(() => setStage("revealing"), 300);
    // Stage 2: Main typography focus & model emergence (1.0s -> 2.8s)
    const t2 = setTimeout(() => setStage("shrinking"), 2600);
    // Stage 3: Shift / transition out (3.6s)
    const t3 = setTimeout(() => {
      setStage("done");
      if (onComplete) onComplete();
    }, 3800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  if (stage === "done") return null;

  return (
    <AnimatePresence>
      <motion.div
        key="opening-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: stage === "shrinking" ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F6F2EA] pointer-events-none select-none overflow-hidden"
      >
        {/* Subtle Architectural Blueprint Grid Background */}
        <div className="absolute inset-0 bg-blueprint-light opacity-40 pointer-events-none" />

        {/* Minimal Architectural Indicator Line */}
        <div className="absolute top-8 left-8 sm:top-12 sm:left-12 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#102B49]/60 font-semibold">
            ERDEM DİZAYN & MEKANİK — MIMARİ SUNUM
          </span>
        </div>

        {/* Giant Masked Word ERDEM */}
        <div className="relative overflow-hidden max-w-full px-4 text-center">
          <motion.h1
            initial={{ y: "100%", opacity: 0 }}
            animate={{
              y: stage === "masking" ? "100%" : "0%",
              opacity: stage === "masking" ? 0 : 1,
              scale: stage === "shrinking" ? 0.92 : 1,
            }}
            transition={{
              duration: 1.4,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="opening-display-text font-serif font-bold text-[#102B49] tracking-tighter uppercase leading-none"
          >
            ERDEM
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{
              opacity: stage === "revealing" || stage === "shrinking" ? 1 : 0,
              y: stage === "revealing" || stage === "shrinking" ? 0 : 15,
            }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-4 flex items-center justify-center gap-4 text-[#9A5C2F]"
          >
            <span className="h-[1px] w-12 bg-[#9A5C2F]/40" />
            <p className="font-mono text-xs sm:text-sm tracking-[0.35em] uppercase font-semibold text-[#102B49]/80">
              DİZAYN & MEKANİK
            </p>
            <span className="h-[1px] w-12 bg-[#9A5C2F]/40" />
          </motion.div>
        </div>

        {/* Minimal Progress Line Indicator */}
        <div className="absolute bottom-10 sm:bottom-14 w-32 sm:w-48 h-[2px] bg-[#102B49]/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.4, ease: "easeInOut" }}
            className="h-full bg-[#9A5C2F]"
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
