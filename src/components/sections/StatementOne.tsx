"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const TRUST_ITEMS = [
  "TEK NOKTADAN İLETİŞİM",
  "TASARIMDAN UYGULAMAYA",
  "ŞEFFAF SÜREÇ",
  "DETAY ODAKLI UYGULAMA",
];

export const StatementOne: React.FC = () => {
  return (
    <section
      id="about"
      className="ed-section-shell relative w-full border-t border-[#102B49]/10 px-5 py-20 sm:px-10 sm:py-24 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-dense-light opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="ed-eyebrow mb-5 inline-flex items-center gap-3 rounded-full border border-[#102B49]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
              <span>HAKKIMIZDA</span>
            </div>
            <h2 className="ed-section-title-sm font-serif text-3xl font-bold leading-tight text-[#102B49] sm:text-5xl lg:text-6xl">
              Mekânınız için doğru kararları birlikte netleştiririz.
            </h2>
          </div>

          <p className="ed-body-copy max-w-xl text-base leading-8 text-[#102B49]/76 sm:text-lg lg:col-span-5">
            Erdem Dizayn & Mekanik; konut, ofis ve ticari alanlarda tasarım,
            mekanik ihtiyaçlar ve uygulama sürecini sade bir planla bir araya
            getirir. Ne yapılacağını, nasıl ilerleyeceğini ve kimin takip
            edeceğini en baştan bilirsiniz.
          </p>
        </ScrollReveal>

        <div className="mt-14 grid grid-cols-1 border-y border-[#102B49]/10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_ITEMS.map((item) => (
            <ScrollReveal
              key={item}
              className="ed-card-lift flex min-h-20 items-center gap-3 border-b border-[#102B49]/10 py-5 sm:px-5 lg:border-b-0 lg:border-r lg:last:border-r-0"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#9A5C2F]" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[#102B49]">
                {item}
              </span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
