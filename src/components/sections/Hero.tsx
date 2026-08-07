"use client";

import React from "react";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";

interface HeroProps {
  isTechnicalMode?: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isTechnicalMode = false }) => {
  return (
    <section id="hero" className="relative w-full min-h-[calc(100vh-70px)] flex flex-col justify-between pt-24 sm:pt-28 pb-10 px-6 sm:px-12 lg:px-16 bg-[#F6F2EA] overflow-hidden">
      {/* Subtle Architectural Blueprint Grid Pattern (opacity max 0.03) */}
      <div className="absolute inset-0 bg-blueprint-light opacity-[0.035] pointer-events-none -z-10" />

      {/* Main Two-Column Layout */}
      <div className="max-w-[1600px] mx-auto w-full my-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Editorial Typography & CTAs (Desktop: ~42% width) */}
        <div className="lg:col-span-5 flex flex-col justify-center z-10 order-1">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#9A5C2F] uppercase font-semibold mb-5">
            <span className="w-2 h-2 rounded-full bg-[#9A5C2F]" />
            <span>ERDEM DİZAYN & MEKANİK</span>
          </div>

          {/* Headline - Exact required text & semantic line breaks */}
          <h1 className="font-serif font-bold text-[#102B49] tracking-tight text-[clamp(2.4rem,4.2vw,4.5rem)] leading-[1.08] mb-6">
            Bir yapıyı yalnızca tasarlamıyoruz.<br className="hidden sm:inline" />{" "}
            <span>Nasıl yaşayacağını da kurguluyoruz.</span>
          </h1>

          {/* Desktop Paragraph Description */}
          <p className="hidden lg:block text-[18px] sm:text-[19px] text-[#102B49]/80 font-sans leading-[1.55] font-normal mb-8 max-w-xl">
            Erdem Dizayn & Mekanik; mimari tasarım, mühendislik ve uygulamayı aynı proje disiplini içinde buluşturur. Estetik kararları, yapının işleyişiyle birlikte ele alır.
          </p>

          {/* Desktop Tagline & Buttons */}
          <div className="hidden lg:block space-y-6">
            <div className="text-xs font-mono tracking-[0.2em] text-[#9A5C2F] uppercase font-semibold flex items-center gap-2">
              <span>TASARIM · MÜHENDİSLİK · UYGULAMA</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#statement-1"
                className="px-7 py-3.5 rounded-full bg-[#102B49] text-[#F6F2EA] hover:bg-[#9A5C2F] text-sm font-mono tracking-wider uppercase font-semibold flex items-center gap-3 transition-all duration-300 shadow-xs"
              >
                <span>Yapıyı Keşfet</span>
                <ArrowDownRight className="w-4 h-4" />
              </a>

              <a
                href="#projects"
                className="px-7 py-3.5 rounded-full border border-[#102B49]/30 hover:border-[#102B49] text-[#102B49] hover:bg-[#102B49]/5 text-sm font-mono tracking-wider uppercase font-semibold flex items-center gap-3 transition-all duration-300"
              >
                <span>Projeleri Gör</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 3D Villa Interactive Viewport (Desktop: ~58% width) */}
        <div className="lg:col-span-7 w-full h-[360px] sm:h-[460px] lg:h-[600px] xl:h-[660px] relative rounded-2xl overflow-hidden border border-[#102B49]/08 bg-[#FBFAF7]/60 shadow-xs order-2">
          <HeroScene isTechnicalMode={isTechnicalMode} />
        </div>

        {/* MOBILE / TABLET DISPLAY: Paragraph description & CTAs rendered below 3D Model */}
        <div className="lg:hidden col-span-1 space-y-6 pt-2 order-3">
          <p className="text-[17px] text-[#102B49]/80 font-sans leading-[1.55] font-normal">
            Erdem Dizayn & Mekanik; mimari tasarım, mühendislik ve uygulamayı aynı proje disiplini içinde buluşturur. Estetik kararları, yapının işleyişiyle birlikte ele alır.
          </p>

          <div className="text-xs font-mono tracking-[0.2em] text-[#9A5C2F] uppercase font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
            <span>TASARIM · MÜHENDİSLİK · UYGULAMA</span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
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
              <span>Projeleri Gör</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Scroll Indicator Bar */}
      <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between border-t border-[#102B49]/10 pt-4 text-xs font-mono tracking-widest text-[#102B49]/50 uppercase">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F] animate-pulse" />
          <span>AŞAĞI KAYDIRIN</span>
        </div>
        <span className="hidden sm:inline">ESTETİK & İŞLEV BÜTÜNLÜĞÜ</span>
      </div>
    </section>
  );
};
