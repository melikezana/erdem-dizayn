"use client";

import React from "react";

export const StatementTwo: React.FC = () => {
  return (
    <section id="statement-2" className="relative w-full min-h-[75vh] flex items-center justify-center px-6 sm:px-12 lg:px-20 py-24">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-blueprint-light opacity-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#102B49]/15 text-[11px] font-mono tracking-[0.3em] uppercase text-[#9A5C2F] mb-10">
          <span>03 / PRENSİP</span>
        </div>

        <h2 className="statement-headline font-serif font-bold text-[#102B49] leading-tight tracking-tight mb-8">
          “Estetik ile işlev arasında seçim yapmıyoruz.<br />
          <span className="italic font-normal text-[#9A5C2F]">İkisini aynı projede</span> çözüyoruz.”
        </h2>

        <p className="text-base sm:text-xl text-[#102B49]/75 font-sans font-light leading-relaxed max-w-2xl mx-auto">
          Her mimari kararın arkasında uygulanabilirlik; her mühendislik kararının merkezinde ise insan vardır.
        </p>
      </div>
    </section>
  );
};
