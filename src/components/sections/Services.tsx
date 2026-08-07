"use client";

import React, { useState } from "react";
import { SERVICES_DATA } from "@/data/services";
import { ArrowUpRight } from "lucide-react";

interface ServicesProps {
  onOpenQuote: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenQuote }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="services" className="relative w-full py-32 px-6 sm:px-12 lg:px-20 border-t border-[#102B49]/10">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 pb-8 border-b border-[#102B49]/10">
          <div>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-[#102B49]/20 font-mono text-[10px] tracking-[0.25em] uppercase text-[#9A5C2F] mb-4">
              <span>04 / DİSİPLİNLER VE HİZMETLER</span>
            </div>
            <h2 className="section-title font-serif font-bold text-[#102B49] tracking-tight">
              Bütüncül Mimari & Mühendislik
            </h2>
          </div>

          <p className="text-sm font-mono text-[#102B49]/70 uppercase tracking-widest max-w-xs">
            Çizgiden sahaya uzanan 8 temel disiplin
          </p>
        </div>

        {/* Scroll-driven Editorial Presentation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Interactive Service Navigation Stack */}
          <div className="lg:col-span-5 space-y-3">
            {SERVICES_DATA.map((service, idx) => {
              const isActive = activeIndex === idx;

              return (
                <button
                  key={service.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-between border cursor-pointer ${
                    isActive
                      ? "bg-[#102B49] text-white border-[#102B49] shadow-md transform translate-x-2"
                      : "bg-[#F6F2EA] text-[#102B49]/70 border-[#102B49]/10 hover:border-[#9A5C2F] hover:text-[#102B49]"
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`font-mono text-sm font-bold ${isActive ? "text-[#9A5C2F]" : "text-[#102B49]/50"}`}>
                      {service.number}
                    </span>
                    <span className="font-serif text-base sm:text-lg font-bold tracking-wider">
                      {service.title}
                    </span>
                  </div>

                  <span className={`font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded ${isActive ? "bg-white/10 text-white" : "bg-[#102B49]/5 text-[#102B49]/60"}`}>
                    {service.discipline}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Featured Service Editorial Spotlight */}
          <div className="lg:col-span-7 sticky top-28 bg-white/70 border border-[#102B49]/10 rounded-2xl p-8 sm:p-12 backdrop-blur-md shadow-xs">
            {/* Huge Service Index */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#102B49]/10">
              <span className="font-serif text-6xl sm:text-8xl font-bold text-[#9A5C2F]/25 leading-none">
                {SERVICES_DATA[activeIndex].number}
              </span>
              <span className="font-mono text-xs tracking-[0.3em] uppercase text-[#9A5C2F] font-bold">
                {SERVICES_DATA[activeIndex].discipline}
              </span>
            </div>

            {/* Service Title & Description */}
            <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#102B49] tracking-tight mb-6">
              {SERVICES_DATA[activeIndex].title}
            </h3>

            <p className="text-lg sm:text-xl text-[#102B49]/85 font-sans font-light leading-relaxed mb-10">
              “{SERVICES_DATA[activeIndex].description}”
            </p>

            {/* Feature Details List */}
            <div className="mb-10">
              <h4 className="font-mono text-xs tracking-widest text-[#102B49]/60 uppercase mb-4">
                KAPSAM VE UYGULAMA DETAYLARI
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICES_DATA[activeIndex].details.map((detail, dIdx) => (
                  <li key={dIdx} className="flex items-center gap-3 text-sm text-[#102B49]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Button */}
            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#102B49] hover:bg-[#9A5C2F] text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <span>Bu Hizmet İçin Teklif Alın</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
