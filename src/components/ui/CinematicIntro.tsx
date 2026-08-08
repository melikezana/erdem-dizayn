"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import { SkipForward } from "lucide-react";

interface CinematicIntroProps {
  isIntroActive: boolean;
  onComplete: () => void;
}

const INTRO_SESSION_KEY = "erdem_intro_played";
const FADE_DURATION_MS = 900;
const FADE_START_SECONDS_FROM_END = 1;

const emptySubscribe = () => () => {};

function shouldForceIntroReplay(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "development") return false;

  return new URLSearchParams(window.location.search).get("intro") === "1";
}

function getIntroPlayedState(): boolean {
  if (typeof window === "undefined") return false;
  if (shouldForceIntroReplay()) return false;

  try {
    return sessionStorage.getItem(INTRO_SESSION_KEY) === "true";
  } catch {
    return false;
  }
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  isIntroActive,
  onComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const finishStartedRef = useRef(false);
  const finishTimerRef = useRef<number | null>(null);
  const [videoOpacity, setVideoOpacity] = useState(1);

  const hasAlreadyPlayed = useSyncExternalStore(
    emptySubscribe,
    getIntroPlayedState,
    () => false
  );

  useEffect(() => {
    if (hasAlreadyPlayed) {
      onComplete();
    }
  }, [hasAlreadyPlayed, onComplete]);

  useEffect(() => {
    return () => {
      if (finishTimerRef.current) {
        window.clearTimeout(finishTimerRef.current);
      }
    };
  }, []);

  const handleFinish = useCallback(() => {
    if (finishStartedRef.current) return;
    finishStartedRef.current = true;

    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "true");
    } catch {
      // Storage can fail in private browsing modes; the intro should still finish.
    }

    setVideoOpacity(0);
    finishTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, FADE_DURATION_MS);
  }, [onComplete]);

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

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || finishStartedRef.current || Number.isNaN(video.duration)) {
      return;
    }

    if (
      video.duration > 0 &&
      video.currentTime >= video.duration - FADE_START_SECONDS_FROM_END
    ) {
      handleFinish();
    }
  };

  if (hasAlreadyPlayed || !isIntroActive) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: videoOpacity }}
      transition={{
        duration: FADE_DURATION_MS / 1000,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#F6F2EA] pointer-events-auto"
    >
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
        className="h-full w-full object-cover"
      />

      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10">
        <div className="flex w-full items-center justify-between pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#102B49]/15 bg-[#F6F2EA]/90 px-4 py-2 shadow-xs backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#9A5C2F] animate-pulse" />
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[#102B49]">
              {"ERDEM D\u0130ZAYN & MEKAN\u0130K"}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-[#102B49]/20 bg-[#F6F2EA]/95 px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wider text-[#102B49] shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-[#102B49] hover:text-[#F6F2EA]"
            aria-label={"Giri\u015f animasyonunu ge\u00e7"}
          >
            <span>{"Ge\u00e7"}</span>
            <SkipForward className="h-3.5 w-3.5 text-[#9A5C2F]" />
          </button>
        </div>

        <div className="flex w-full items-end justify-between font-mono text-xs uppercase tracking-widest text-[#102B49]/70 pointer-events-none">
          <div className="flex items-center gap-2 rounded-full border border-[#102B49]/10 bg-[#F6F2EA]/90 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#9A5C2F]" />
            <span>{"S\u0130NEMAT\u0130K M\u0130MAR\u0130 TANITIM"}</span>
          </div>
          <span className="hidden rounded-full border border-[#102B49]/10 bg-[#F6F2EA]/90 px-4 py-1.5 backdrop-blur-md sm:inline">
            {"\u00c7\u0130ZG\u0130 \u2192 PLAN \u2192 YAPI"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
