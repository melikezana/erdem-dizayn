"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";
import { ArchitecturalPlanSVG } from "@/components/ui/ArchitecturalPlanSVG";
import { CinematicIntro } from "@/components/ui/CinematicIntro";

interface HeroProps {
  isTechnicalMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isTechnicalMode = false }) => {
  const [isIntroActive, setIsIntroActive] = useState(true);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-between pt-24 sm:pt-28 pb-8 px-6 sm:px-12 lg:px-16 bg-[#F6F2EA] overflow-hidden select-none"
    >
      {/* 0. Cinematic Video Opening Intro & Handoff */}
      <CinematicIntro
        isIntroActive={isIntroActive}
        onComplete={handleIntroComplete}
      />

      {/* 1. Architectural Paper Base Texture & Blueprint SVG Overlay */}
      <div className="absolute inset-0 bg-blueprint-light opacity-[0.035] pointer-events-none -z-10" />
      <ArchitecturalPlanSVG isIntroActive={isIntroActive} />

      {/* 2. Main Horizontal Composition (Desktop: Editorial text ~38%, 3D architecture ~62%) */}
      <div className="max-w-[1700px] mx-auto w-full my-auto py-2 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center z-10">
        
        {/* LEFT COLUMN: Editorial Typography & CTAs */}
        <div className="lg:col-span-5 flex flex-col justify-center order-1">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.2 : 0.1 }}
            className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#9A5C2F] uppercase font-semibold mb-5"
          >
            <span className="w-2 h-2 rounded-full bg-[#9A5C2F]" />
            <span>ERDEM DİZAYN & MEKANİK</span>
          </motion.div>

          {/* Headline with exact Turkish typography & semantic line breaks */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: isIntroActive ? 5.4 : 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-bold text-[#102B49] tracking-tight text-[clamp(2.5rem,5vw,5.5rem)] leading-[1.08] mb-6"
          >
            Her yapı bir çizgiyle başlar.<br className="hidden sm:inline" />{" "}
            <span className="text-[#102B49]/90 font-normal">
              Biz o çizgiyi yaşanabilir bir sisteme dönüştürüyoruz.
            </span>
          </motion.h1>

          {/* Desktop Paragraph Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.6 : 0.3 }}
            className="hidden lg:block text-[18px] xl:text-[20px] text-[#102B49]/80 font-sans leading-[1.6] font-normal mb-8 max-w-xl"
          >
            Erdem Dizayn & Mekanik; mimari tasarım, mühendislik ve uygulamayı aynı proje bütünlüğü içinde ele alır. Fikirden ilk çizgiye, ilk çizgiden yapının son detayına kadar estetik ile işlevi birlikte tasarlarız.
          </motion.p>

          {/* Desktop Tagline & Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.8 : 0.4 }}
            className="hidden lg:block space-y-6"
          >
            <div className="text-xs font-mono tracking-[0.2em] text-[#9A5C2F] uppercase font-semibold flex items-center gap-2">
              <span>MİMARİ · MÜHENDİSLİK · UYGULAMA</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a
                href="#statement-1"
                className="px-8 py-4 rounded-full bg-[#102B49] text-[#F6F2EA] hover:bg-[#9A5C2F] text-sm font-mono tracking-wider uppercase font-semibold flex items-center gap-3 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <span>Yapıyı Keşfet</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#projects"
                className="px-8 py-4 rounded-full border border-[#102B49]/30 hover:border-[#102B49] text-[#102B49] hover:bg-[#102B49]/5 text-sm font-mono tracking-wider uppercase font-semibold flex items-center gap-3 transition-all duration-300"
              >
                <span>Projeleri İncele</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D Villa Interactive Viewport (Desktop: ~62% width, Integrated with paper) */}
        <div className="lg:col-span-7 w-full h-[380px] sm:h-[480px] lg:h-[620px] xl:h-[680px] relative overflow-hidden order-2">
          <HeroScene
            isTechnicalMode={isTechnicalMode}
            isIntroActive={isIntroActive}
          />
        </div>

        {/* MOBILE / TABLET DISPLAY: Sequence (Description -> Subline -> CTAs rendered below 3D Model) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: isIntroActive ? 5.8 : 0.4 }}
          className="lg:hidden col-span-1 space-y-5 pt-2 order-3"
        >
          <p className="text-[17px] text-[#102B49]/80 font-sans leading-[1.55] font-normal">
            Erdem Dizayn & Mekanik; mimari tasarım, mühendislik ve uygulamayı aynı proje bütünlüğü içinde ele alır. Fikirden ilk çizgiye, ilk çizgiden yapının son detayına kadar estetik ile işlevi birlikte tasarlarız.
          </p>

          <div className="text-xs font-mono tracking-[0.2em] text-[#9A5C2F] uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
            <span>MİMARİ · MÜHENDİSLİK · UYGULAMA</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-1">
            <a
              href="#statement-1"
              className="px-7 py-3.5 rounded-full bg-[#102B49] text-[#F6F2EA] hover:bg-[#9A5C2F] text-sm font-mono tracking-wider uppercase font-semibold flex items-center justify-center gap-3 transition-all duration-300"
            >
              <span>Yapıyı Keşfet</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>

            <a
              href="#projects"
              className="px-7 py-3.5 rounded-full border border-[#102B49]/30 hover:border-[#102B49] text-[#102B49] text-sm font-mono tracking-wider uppercase font-semibold flex items-center justify-center gap-3 transition-all duration-300"
            >
              <span>Projeleri İncele</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

      </div>

      {/* 3. Bottom Architectural Paper Indicator Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isIntroActive ? 6.0 : 0.5, duration: 0.8 }}
        className="max-w-[1700px] mx-auto w-full flex items-center justify-between border-t border-[#102B49]/10 pt-4 text-xs font-mono tracking-widest text-[#102B49]/50 uppercase z-10"
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F] animate-pulse" />
          <span>AŞAĞI KAYDIRIN</span>
        </div>
        <span className="hidden sm:inline">ÇİZGİ → PLAN → HACİM → YAPI → YAŞAM</span>
      </motion.div>
    </section>
  );
};

