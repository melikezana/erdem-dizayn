"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

const HeroScene = dynamic(
  () => import("../three/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[420px] sm:min-h-[540px] flex flex-col items-center justify-center bg-[#F6F2EA] text-[#102B49] p-6 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#9A5C2F] border-t-transparent animate-spin mb-3" />
        <p className="font-serif text-sm text-[#102B49]">Mimari Model Yükleniyor...</p>
      </div>
    ),
  }
);

interface HeroProps {
  onOpenQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section
      id="hero"
      className="relative min-h-svh pt-28 pb-12 lg:pt-32 lg:pb-16 flex items-center bg-[#F6F2EA] text-[#171717] overflow-hidden"
    >
      {/* Subtle Blueprint Technical Grid (3-5% opacity) */}
      <div className="absolute inset-0 bg-blueprint-light opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* LEFT CONTENT (Cols 1-5 / ~38-40%) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 sm:space-y-7"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#102B49]/5 border border-[#102B49]/10">
              <span className="w-2 h-2 rounded-full bg-[#9A5C2F]" />
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#102B49]">
                ERDEM DİZAYN & MEKANİK
              </span>
            </div>

            {/* Main Statement Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#102B49] leading-[1.06]">
              Hayal edilen mekânı,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A5C2F] to-[#875128] italic font-normal">
                çalışan bir sisteme
              </span>{" "}
              dönüştürüyoruz.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-sans max-w-xl">
              Mimari tasarım ile mühendisliği aynı çizgide buluşturuyor; fikrin ilk eskizinden uygulamanın son detayına kadar bütüncül çözümler üretiyoruz.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <a
                href="#projects"
                className="px-7 py-4 rounded-xl bg-[#102B49] hover:bg-[#16365C] text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all group"
              >
                <span>Projeleri Keşfet</span>
                <ArrowDown className="w-4 h-4 text-[#9A5C2F] group-hover:translate-y-1 transition-transform" />
              </a>

              <button
                onClick={onOpenQuote}
                className="px-7 py-4 rounded-xl bg-transparent border border-[#9A5C2F] text-[#9A5C2F] hover:bg-[#9A5C2F] hover:text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer group"
              >
                <span>Projenizi Konuşalım</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

            {/* Small Architectural Statement */}
            <div className="pt-4 border-t border-[#102B49]/10 text-[11px] font-mono tracking-[0.25em] text-[#9A5C2F] font-semibold uppercase">
              TASARIM · MÜHENDİSLİK · UYGULAMA
            </div>
          </motion.div>

          {/* RIGHT 3D SHOWROOM (Cols 6-12 / ~60-62%) - NO VISIBLE CARD CONTAINER! */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 h-[460px] sm:h-[580px] lg:h-[660px] relative w-full"
          >
            <HeroScene
              activeHotspot={activeHotspot}
              setActiveHotspot={setActiveHotspot}
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
};
