"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, ArrowRight, CalendarDays, MessageCircle } from "lucide-react";
import { HeroScene } from "@/components/three/HeroScene";
import { CinematicIntro } from "@/components/ui/CinematicIntro";
import { createWhatsAppUrl } from "@/lib/contact";

interface HeroProps {
  isTechnicalMode?: boolean;
  onOpenAppointment: () => void;
}

interface HeroActionsProps {
  onOpenAppointment: () => void;
}

const HeroActions: React.FC<HeroActionsProps> = ({ onOpenAppointment }) => {
  return (
    <>
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
    </>
  );
};

export const Hero: React.FC<HeroProps> = ({
  isTechnicalMode = false,
  onOpenAppointment,
}) => {
  const [isIntroActive, setIsIntroActive] = useState(true);

  const handleIntroComplete = useCallback(() => {
    setIsIntroActive(false);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F6F2EA] px-5 pb-7 pt-24 text-[#102B49] sm:px-10 sm:pt-28 lg:px-16"
    >
      <CinematicIntro
        isIntroActive={isIntroActive}
        onComplete={handleIntroComplete}
      />

      <div className="pointer-events-none absolute inset-0 -z-10 bg-blueprint-light opacity-[0.035]" />

      <div className="z-10 mx-auto grid w-full max-w-[1900px] flex-1 grid-cols-1 items-center gap-y-5 py-2 lg:grid-cols-[minmax(0,0.38fr)_minmax(0,0.62fr)] lg:grid-rows-[auto_auto] lg:gap-x-4 lg:gap-y-0 lg:py-0">
        <div className="relative z-10 order-1 flex flex-col justify-end lg:col-start-1 lg:row-start-1 lg:self-end">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#9A5C2F] sm:text-sm"
          >
            <span className="h-2 w-2 rounded-full bg-[#9A5C2F]" />
            <span>ERDEM DİZAYN & MEKANİK</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.65,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-sans text-[#102B49] tracking-normal"
          >
            <span className="block text-3xl font-normal normal-case leading-[1.16] text-[#102B49]/85 sm:text-4xl lg:text-4xl 2xl:text-5xl">
              Hayal ettiğiniz mekânı,
            </span>
            <span className="mt-2 block text-4xl font-semibold normal-case leading-[1.08] text-[#102B49] sm:text-5xl lg:text-5xl 2xl:text-6xl">
              Birlikte gerçeğe dönüştürelim.
            </span>
          </motion.h1>
        </div>

        <div className="relative z-0 order-2 h-[min(56vh,540px)] min-h-[350px] w-full overflow-hidden sm:min-h-[470px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:-ml-4 lg:-mr-16 lg:h-[min(75vh,760px)] lg:min-h-[620px] lg:overflow-visible xl:-ml-8 xl:-mr-24 2xl:-ml-12 2xl:-mr-32">
          <HeroScene
            isTechnicalMode={isTechnicalMode}
            isIntroActive={isIntroActive}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="relative z-10 order-3 flex max-w-[470px] flex-col gap-5 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-6"
        >
          <p className="text-base leading-8 text-[#102B49]/80 sm:text-lg">
            İç mimari tasarımdan mekanik uygulamaya kadar, mekânınızı
            ihtiyaçlarınıza göre planlıyor ve süreci tek elden yönetiyoruz.
          </p>

          <div className="flex flex-col gap-5">
            <HeroActions onOpenAppointment={onOpenAppointment} />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.55 }}
        className="z-10 mx-auto flex w-full max-w-[1900px] items-center justify-between border-t border-[#102B49]/10 pt-4 text-xs uppercase tracking-[0.18em] text-[#102B49]/55"
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
