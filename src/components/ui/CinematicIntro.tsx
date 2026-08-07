"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipForward } from "lucide-react";

interface CinematicIntroProps {
  isIntroActive: boolean;
  onComplete: () => void;
}

const emptySubscribe = () => () => {};

function getIntroPlayedState(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem("erdem_intro_played") === "true";
  } catch {
    return false;
  }
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  isIntroActive,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const hasAlreadyPlayed = useSyncExternalStore(
    emptySubscribe,
    getIntroPlayedState,
    () => false
  );

  // If intro was already played in this session, trigger completion callback once
  useEffect(() => {
    if (hasAlreadyPlayed) {
      onComplete();
    }
  }, [hasAlreadyPlayed, onComplete]);

  // Skip / Finish Handler
  const handleFinish = useCallback(() => {
    try {
      sessionStorage.setItem("erdem_intro_played", "true");
    } catch {
      // Ignore storage error
    }
    setIsFadingOut(true);
    setVideoOpacity(0);
    setTimeout(() => {
      onComplete();
    }, 850);
  }, [onComplete]);

  // Keyboard listeners (Escape or Space to skip)
  useEffect(() => {
    if (!isIntroActive || hasAlreadyPlayed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " ") {
        e.preventDefault();
        handleFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIntroActive, hasAlreadyPlayed, handleFinish]);

  // Video Playback & Handoff timing (last 1.0s cross-fade over ~850ms)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || isFadingOut) return;

    if (video.duration > 0 && video.currentTime >= video.duration - 1.0) {
      handleFinish();
    }
  };

  if (hasAlreadyPlayed || !isIntroActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: videoOpacity }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 bg-[#F6F2EA] flex items-center justify-center overflow-hidden pointer-events-auto"
      >
        {/* Fullscreen Background Intro Video */}
        <video
          ref={videoRef}
          src="/videos/erdem-intro.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleFinish}
          onError={handleFinish}
          className="w-full h-full object-cover transition-opacity duration-850"
        />

        {/* HUD Overlay: Title & Skip Button */}
        <div className="absolute inset-0 pointer-events-none p-6 sm:p-10 flex flex-col justify-between z-10">
          {/* Top Bar HUD */}
          <div className="w-full flex items-center justify-between pointer-events-auto">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#F6F2EA]/90 border border-[#102B49]/15 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#9A5C2F] animate-pulse" />
              <span className="text-xs font-mono tracking-[0.2em] text-[#102B49] uppercase font-bold">
                ERDEM DİZAYN & MEKANİK
              </span>
            </div>

            {/* "Geç" Skip Button */}
            <button
              onClick={handleFinish}
              className="px-4 py-2 rounded-full border border-[#102B49]/20 bg-[#F6F2EA]/95 backdrop-blur-md text-[#102B49] hover:bg-[#102B49] hover:text-[#F6F2EA] text-xs font-mono tracking-wider uppercase font-semibold transition-all duration-300 shadow-sm flex items-center gap-2 cursor-pointer pointer-events-auto"
              aria-label="Giriş animasyonunu geç"
            >
              <span>Geç</span>
              <SkipForward className="w-3.5 h-3.5 text-[#9A5C2F]" />
            </button>
          </div>

          {/* Bottom HUD Bar */}
          <div className="w-full flex justify-between items-end text-xs font-mono tracking-widest text-[#102B49]/70 uppercase pointer-events-none">
            <div className="bg-[#F6F2EA]/90 px-4 py-1.5 rounded-full backdrop-blur-md border border-[#102B49]/10 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
              <span>SİNEMATİK MİMARİ TANITIM</span>
            </div>
            <span className="hidden sm:inline bg-[#F6F2EA]/90 px-4 py-1.5 rounded-full backdrop-blur-md border border-[#102B49]/10">
              ÇİZGİ → PLAN → YAPI
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
