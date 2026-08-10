"use client";

import React from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Tanışma",
    desc: "İhtiyacınızı, beklentinizi ve mekânınızı dinliyoruz.",
  },
  {
    step: "02",
    title: "Tasarım",
    desc: "Size özel çözümü, malzemeleri ve mekânsal kararları birlikte netleştiriyoruz.",
  },
  {
    step: "03",
    title: "Uygulama",
    desc: "Planlanan işi sahada titizlikle hayata geçiriyoruz.",
  },
  {
    step: "04",
    title: "Teslim",
    desc: "Son kontrolleri tamamlıyor, mekânı kullanıma hazır şekilde teslim ediyoruz.",
  },
];

export const Process: React.FC = () => {
  return (
    <section
      id="process"
      className="ed-section-shell relative w-full border-t border-[#102B49]/10 px-5 py-24 sm:px-10 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-light opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal className="mb-14 grid grid-cols-1 gap-8 border-b border-[#102B49]/10 pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="ed-eyebrow mb-5 inline-flex items-center gap-3 rounded-full border border-[#102B49]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
              <span>SÜREÇ</span>
            </div>
            <h2 className="ed-section-title-sm font-serif text-3xl font-bold leading-tight text-[#102B49] sm:text-5xl lg:text-6xl">
              Nasıl ilerliyoruz?
            </h2>
          </div>

          <p className="ed-body-copy max-w-sm text-base leading-7 text-[#102B49]/70 lg:col-span-4">
            Net, şeffaf ve gereksiz karmaşadan uzak.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
          {PROCESS_STEPS.map((item, index) => (
            <ScrollReveal
              key={item.step}
              as="article"
              delay={index * 0.04}
              className="ed-card-lift border-t border-[#102B49]/20 py-6 transition-colors hover:border-[#9A5C2F]"
            >
              <span className="mb-6 block font-serif text-4xl font-bold leading-none text-[#9A5C2F]/60">
                {item.step}
              </span>
              <h3 className="ed-card-title mb-3 font-serif text-2xl font-bold text-[#102B49]">
                {item.title}
              </h3>
              <p className="ed-body-copy-sm text-sm leading-7 text-[#102B49]/72">{item.desc}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
