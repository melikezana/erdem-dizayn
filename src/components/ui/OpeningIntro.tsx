"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward } from "lucide-react";

export type IntroPhase = "drawing" | "plan" | "volume" | "architecture";

interface OpeningIntroProps {
  isIntroActive: boolean;
  onSkip: () => void;
  currentPhase?: IntroPhase;
}

const PHASES: { id: IntroPhase; label: string; number: string }[] = [
  { id: "drawing", label: "ÇİZİM", number: "01" },
  { id: "plan", label: "PLAN", number: "02" },
  { id: "volume", label: "HACİM", number: "03" },
  { id: "architecture", label: "MİMARİ", number: "04" },
];

export const OpeningIntro: React.FC<OpeningIntroProps> = ({
  isIntroActive,
  onSkip,
  currentPhase = "drawing",
}) => {
  // Keypress support to skip intro via Escape or Space
  useEffect(() => {
    if (!isIntroActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIntroActive, onSkip]);

  return (
    <AnimatePresence>
      {isIntroActive && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-6 sm:p-10"
        >
          {/* Top Bar: Story Phase Indicator HUD & Skip Button */}
          <div className="w-full flex items-center justify-between pointer-events-auto">
            {/* Story Phase Pills */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-[#F6F2EA]/95 border border-[#102B49]/15 backdrop-blur-md shadow-xs"
            >
              {PHASES.map((phase, idx) => {
                const isActive = phase.id === currentPhase;
                const isPast =
                  PHASES.findIndex((p) => p.id === currentPhase) > idx;

                return (
                  <React.Fragment key={phase.id}>
                    {idx > 0 && (
                      <span className="text-[10px] text-[#102B49]/30 font-mono">
                        →
                      </span>
                    )}
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                          isActive
                            ? "bg-[#9A5C2F] animate-pulse"
                            : isPast
                            ? "bg-[#102B49]/60"
                            : "bg-[#102B49]/20"
                        }`}
                      />
                      <span
                        className={`text-[10px] sm:text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${
                          isActive
                            ? "text-[#102B49] font-bold"
                            : isPast
                            ? "text-[#102B49]/70"
                            : "text-[#102B49]/40"
                        }`}
                      >
                        {phase.label}
                      </span>
                    </div>
                  </React.Fragment>
                );
              })}
            </motion.div>

            {/* Small "Geç" Skip Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onSkip}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-[#102B49]/20 bg-[#F6F2EA]/95 backdrop-blur-md text-[#102B49] hover:bg-[#102B49] hover:text-[#F6F2EA] text-xs font-mono tracking-wider uppercase font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 cursor-pointer pointer-events-auto"
              aria-label="Giriş animasyonunu geç"
            >
              <span>Geç</span>
              <SkipForward className="w-3 h-3 text-[#9A5C2F]" />
            </motion.button>
          </div>

          {/* Bottom Center: Subtle Intro Guidance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full flex justify-between items-end text-[10px] sm:text-xs font-mono tracking-widest text-[#102B49]/40 uppercase pointer-events-none"
          >
            <div className="flex items-center gap-2 bg-[#F6F2EA]/80 px-3 py-1 rounded-full backdrop-blur-xs border border-[#102B49]/05">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
              <span>ERDEM MİMARİ AÇILIŞ SÜRECİ</span>
            </div>
            <span className="hidden sm:inline bg-[#F6F2EA]/80 px-3 py-1 rounded-full backdrop-blur-xs border border-[#102B49]/05">
              ÇİZGİ → PLAN → HACİM → MİMARİ
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

