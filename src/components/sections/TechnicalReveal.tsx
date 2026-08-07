"use client";

import React, { useState } from "react";
import { Layers, Compass, Wind, Droplets, Flame, Hammer } from "lucide-react";

interface TechnicalRevealProps {
  isTechnicalMode: boolean;
  setIsTechnicalMode: (val: boolean) => void;
}

const DISCIPLINES = [
  { id: "mimari", label: "MİMARİ", icon: Compass, code: "M-01", desc: "Form, kütle ve oran etüdü" },
  { id: "mekanik", label: "MEKANİK", icon: Layers, code: "MK-02", desc: "Disiplinlerarası 3D BIM çakışmasız altyapı" },
  { id: "hvac", label: "HVAC", icon: Wind, code: "HV-03", desc: "VRV iklimlendirme & taze hava santralleri" },
  { id: "sihhi", label: "SIHHİ TESİSAT", icon: Droplets, code: "ST-04", desc: "Sessiz atık su & temiz altyapı" },
  { id: "yangin", label: "YANGIN", icon: Flame, code: "YG-05", desc: "NFPA uyumlu otomatik söndürme" },
  { id: "uygulama", label: "UYGULAMA", icon: Hammer, code: "UY-06", desc: "Milimetrik saha imalat taahhüdü" },
];

export const TechnicalReveal: React.FC<TechnicalRevealProps> = ({
  isTechnicalMode,
  setIsTechnicalMode,
}) => {
  const [activeDiscipline, setActiveDiscipline] = useState<string>("mekanik");

  return (
    <section id="technical-reveal" className="relative w-full py-28 px-6 sm:px-12 lg:px-20 border-y border-[#102B49]/10 bg-[#F6F2EA]/80 backdrop-blur-xs">
      {/* Dense Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-blueprint-dense-light opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Control */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-[#102B49]/10">
          <div>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-[#102B49]/20 font-mono text-[10px] tracking-[0.25em] uppercase text-[#9A5C2F] mb-4">
              <span>02 / TEKNİK SUNUM MODU</span>
            </div>
            <h2 className="section-title font-serif font-bold text-[#102B49] tracking-tight">
              Yapının Görünmeyen Katmanları
            </h2>
          </div>

          {/* Toggle Blueprint Shader Mode Button */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono tracking-widest uppercase text-[#102B49]/70">
              {isTechnicalMode ? "TEKNİK ÇİZGİ MODU AKTİF" : "STUDYO GÖRÜNÜMÜ"}
            </span>
            <button
              onClick={() => setIsTechnicalMode(!isTechnicalMode)}
              className={`px-5 py-2.5 rounded-full font-mono text-xs tracking-wider uppercase font-semibold transition-all border cursor-pointer ${
                isTechnicalMode
                  ? "bg-[#9A5C2F] text-white border-[#9A5C2F] shadow-sm"
                  : "bg-transparent text-[#102B49] border-[#102B49]/30 hover:border-[#102B49]"
              }`}
            >
              {isTechnicalMode ? "Görsel Moduna Dön" : "Teknik Detayı Göster"}
            </button>
          </div>
        </div>

        {/* Refined Discipline Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {DISCIPLINES.map((item) => {
            const Icon = item.icon;
            const isActive = activeDiscipline === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveDiscipline(item.id);
                  if (!isTechnicalMode) setIsTechnicalMode(true);
                }}
                className={`p-5 rounded-xl text-left transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-[#102B49] text-white border-[#102B49] shadow-md"
                    : "bg-[#F6F2EA] text-[#102B49] border-[#102B49]/15 hover:border-[#9A5C2F]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`font-mono text-[10px] tracking-widest ${isActive ? "text-[#9A5C2F]" : "text-[#102B49]/60"}`}>
                    {item.code}
                  </span>
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#9A5C2F]" : "text-[#102B49]/70"}`} />
                </div>
                <h3 className="font-serif text-sm font-bold tracking-wider mb-1">
                  {item.label}
                </h3>
                <p className={`text-[11px] font-sans font-light leading-snug line-clamp-2 ${isActive ? "text-white/80" : "text-[#102B49]/70"}`}>
                  {item.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
