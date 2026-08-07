"use client";

import React from "react";

const PROCESS_STEPS = [
  { step: "01", title: "Keşif", desc: "Mekânın, arazi ve ihtiyaçların sahada yerinde incelenmesi" },
  { step: "02", title: "Analiz", desc: "İklimsel, yapısal ve teknik gereksinimlerin modellenmesi" },
  { step: "03", title: "Konsept", desc: "Estetik kütle ve mimari dil kararlarının netleştirilmesi" },
  { step: "04", title: "Projelendirme", desc: "Ruhsat ve mimari uygulama paftalarının hazırlanması" },
  { step: "05", title: "Mühendislik", desc: "3D BIM tabanlı mekanik tesisat ve HVAC hesapları" },
  { step: "06", title: "Uygulama", desc: "Uzman mühendis denetiminde eksiksiz saha imalatı" },
  { step: "07", title: "Teslim", desc: "Test, ayar, komisyonlama sonrası kusursuz teslimat" },
];

export const Process: React.FC = () => {
  return (
    <section id="process" className="relative w-full py-32 px-6 sm:px-12 lg:px-20 border-t border-[#102B49]/10">
      {/* Background Blueprint Grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 pb-8 border-b border-[#102B49]/10">
          <div>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-[#102B49]/20 font-mono text-[10px] tracking-[0.25em] uppercase text-[#9A5C2F] mb-4">
              <span>05 / ÇALIŞMA SÜRECİ</span>
            </div>
            <h2 className="section-title font-serif font-bold text-[#102B49] tracking-tight">
              Her iyi yapı,<br />
              <span className="italic font-normal text-[#9A5C2F]">doğru bir süreçle</span> başlar.
            </h2>
          </div>

          <p className="text-sm font-mono text-[#102B49]/70 uppercase tracking-widest max-w-xs">
            Disiplinli 7 aşamalı metodoloji
          </p>
        </div>

        {/* Minimal Editorial Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 relative">
          {PROCESS_STEPS.map((item) => (
            <div key={item.step} className="group flex flex-col justify-between py-6 border-t border-[#102B49]/20 hover:border-[#9A5C2F] transition-colors">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-[#9A5C2F]/50 group-hover:text-[#9A5C2F] transition-colors block mb-4">
                  {item.step}
                </span>

                <h3 className="font-serif text-lg font-bold text-[#102B49] tracking-wide mb-2">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-[#102B49]/70 font-sans font-light leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
