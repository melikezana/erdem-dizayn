"use client";

import React from "react";

export const StatementOne: React.FC = () => {
  return (
    <section id="statement-1" className="relative w-full min-h-[85vh] flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24">
      {/* Background Subtle Blueprint Grid */}
      <div className="absolute inset-0 bg-blueprint-dense-light opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#102B49]/15 text-[11px] font-mono tracking-[0.3em] uppercase text-[#9A5C2F] mb-12">
          <span>01 / YAKLAŞIM</span>
        </div>

        <h2 className="statement-headline font-serif font-bold text-[#102B49] leading-tight tracking-tight max-w-5xl mx-auto">
          “Mimari, görünen yüzdür.<br />
          <span className="text-[#9A5C2F]">Mühendislik</span> ise onu yaşanabilir kılan sistemdir.”
        </h2>
      </div>
    </section>
  );
};
