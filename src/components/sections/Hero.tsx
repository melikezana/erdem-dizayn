"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";
import { ArchitecturalPlanSVG } from "@/components/ui/ArchitecturalPlanSVG";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { createWhatsAppUrl } from "@/lib/contact";

interface HeroProps {
  isTechnicalMode?: boolean;
  onOpenAppointment: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  isTechnicalMode = false,
  onOpenAppointment,
}) => {
  const [isIntroActive, setIsIntroActive] = useState(true);

  const handleIntroComplete = () => {
    setIsIntroActive(false);
  };

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#F6F2EA] px-5 pb-8 pt-24 text-[#102B49] sm:px-10 sm:pt-28 lg:px-16"
    >
      <CinematicIntro
        isIntroActive={isIntroActive}
        onComplete={handleIntroComplete}
      />

      <div className="absolute inset-0 -z-10 bg-blueprint-light opacity-[0.035] pointer-events-none" />
      <ArchitecturalPlanSVG isIntroActive={isIntroActive} />

      <div className="z-10 mx-auto grid w-full max-w-[1700px] grid-cols-1 items-center gap-8 py-3 lg:grid-cols-12 lg:gap-10">
        <div className="order-1 flex flex-col justify-center lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.2 : 0.1 }}
            className="mb-5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A5C2F] sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#9A5C2F]" />
            <span>ERDEM DİZAYN & MEKANİK</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: isIntroActive ? 5.4 : 0.2,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-6 font-serif text-4xl font-bold leading-[1.08] text-[#102B49] sm:text-5xl lg:text-6xl xl:text-7xl"
          >
            Hayal ettiğiniz mekânı,
            <br className="hidden sm:block" />
            <span className="font-normal text-[#102B49]/90">
              {" "}
              birlikte gerçeğe dönüştürelim.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.6 : 0.3 }}
            className="max-w-xl text-base leading-8 text-[#102B49]/80 sm:text-lg lg:text-xl"
          >
            İç mimari tasarımdan mekanik uygulamalara kadar, mekânınızı
            ihtiyaçlarınıza göre planlıyor; tasarımdan uygulamaya süreci tek
            elden yönetiyoruz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: isIntroActive ? 5.8 : 0.4 }}
            className="mt-8 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A5C2F]">
              <span>İÇ MİMARİ · MEKANİK · UYGULAMA</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <button
                type="button"
                onClick={onOpenAppointment}
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] shadow-md transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
              >
                <CalendarDays className="h-4 w-4" />
                <span>Randevu Oluştur</span>
              </button>

              <a
                href="#projects"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-full border border-[#102B49]/25 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
              >
                <span>Projeleri İncele</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#102B49] transition-colors hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
            >
              <MessageCircle className="h-4 w-4 text-[#9A5C2F]" />
              <span>WhatsApp&apos;tan Yaz</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>

        <div className="relative order-2 h-[360px] w-full overflow-hidden sm:h-[480px] lg:col-span-7 lg:h-[620px] xl:h-[680px]">
          <HeroScene
            isTechnicalMode={isTechnicalMode}
            isIntroActive={isIntroActive}
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isIntroActive ? 6.0 : 0.5, duration: 0.8 }}
        className="z-10 mx-auto flex w-full max-w-[1700px] items-center justify-between border-t border-[#102B49]/10 pt-4 text-xs uppercase tracking-[0.18em] text-[#102B49]/55"
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#9A5C2F]" />
          <span>Aşağı kaydırın</span>
        </div>
        <span className="hidden sm:inline">
          Tasarım · Planlama · Uygulama · Teslim
        </span>
        <ArrowDownRight className="h-4 w-4 sm:hidden" />
      </motion.div>
    </section>
  );
};
