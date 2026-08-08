"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const LoadingScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 350);
          return 100;
        }
        return prev + Math.floor(Math.random() * 20) + 12;
      });
    }, 90);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F6F2EA] text-[#171717] overflow-hidden"
        >
          {/* Subtle architectural grid pattern */}
          <div className="absolute inset-0 bg-blueprint-light opacity-60 pointer-events-none" />

          {/* Luxury Brand Logo / Title reveal */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-10 rounded border border-[#102B49]/20 flex items-center justify-center bg-[#102B49] text-white font-serif font-bold text-base shadow-sm">
                ED
              </div>
              <div className="text-left">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#102B49] block">
                  ERDEM
                </span>
                <span className="text-[10px] tracking-[0.24em] text-[#9A5C2F] uppercase block -mt-1 font-mono font-semibold">
                  DİZAYN & MEKANİK
                </span>
              </div>
            </motion.div>

            {/* Slogan */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 0.9 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-xs sm:text-sm font-serif italic text-gray-700 tracking-widest max-w-sm mb-10"
            >
              &quot;Tasarımdan Uygulamaya Güvenilir Çözümler.&quot;
            </motion.p>

            {/* Progress Bar Container */}
            <div className="w-48 sm:w-64 h-1 bg-[#102B49]/10 rounded-full overflow-hidden relative border border-[#9A5C2F]/20">
              <motion.div
                className="h-full bg-gradient-to-r from-[#9A5C2F] to-[#875128]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut", duration: 0.2 }}
              />
            </div>

            {/* Percentage Number */}
            <div className="mt-3 flex items-center gap-2">
              <span className="font-mono text-xs text-[#9A5C2F] font-bold">
                {progress}%
              </span>
              <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                Yükleniyor
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
