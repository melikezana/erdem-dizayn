"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, PenTool, Layers, CheckCircle } from "lucide-react";

export const Philosophy: React.FC = () => {
  return (
    <section
      id="philosophy"
      className="py-28 bg-[#F6F2EA] text-[#171717] relative overflow-hidden border-t border-[#102B49]/10"
    >
      {/* Faint Blueprint technical lines background */}
      <div className="absolute inset-0 bg-blueprint-dense-light opacity-50 pointer-events-none" />

      {/* Decorative Compass Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-[#102B49]/5 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-12">
        
        {/* Top Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#102B49]/10 shadow-xs"
        >
          <Compass className="w-4 h-4 text-[#9A5C2F]" />
          <span className="text-xs font-mono tracking-widest uppercase text-[#102B49] font-semibold">
            TASARIM & MÜHENDİSLİK FELSEFEMİZ
          </span>
        </motion.div>

        {/* Big Manifesto Quote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <blockquote className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#102B49] leading-[1.08] max-w-4xl mx-auto">
            &quot;Tasarım yalnızca görünen değildir.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A5C2F] to-[#875128] italic font-normal">
              İyi bir yapı, aynı zamanda doğru çalışan bir sistemdir.
            </span>&quot;
          </blockquote>

          <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto font-sans leading-relaxed">
            Bu nedenle mimariyi ve mühendisliği birbirinden bağımsız iki disiplin olarak değil, aynı yapının birbirini tamamlayan iki temel unsuru olarak ele alıyoruz.
          </p>
        </motion.div>

        {/* 3 Core Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 text-left"
        >
          <div className="p-7 rounded-2xl bg-white border border-[#102B49]/10 shadow-xs space-y-3 hover:border-[#9A5C2F] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#9A5C2F]/10 border border-[#9A5C2F]/30 flex items-center justify-center text-[#9A5C2F]">
              <PenTool className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#102B49]">
              Bütüncül Yaklaşım
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Mimari çizim ile iklimlendirme ve tesisat projesini aynı masada, ilk günden itibaren paralel kurguluyoruz.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white border border-[#102B49]/10 shadow-xs space-y-3 hover:border-[#9A5C2F] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#9A5C2F]/10 border border-[#9A5C2F]/30 flex items-center justify-center text-[#9A5C2F]">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#102B49]">
              Sıfır Çakışma (BIM)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              3D BIM simülasyonları ile şantiyeye inmeden önce tüm mekanik, elektrik ve mimari detayları dijitalde çözüyoruz.
            </p>
          </div>

          <div className="p-7 rounded-2xl bg-white border border-[#102B49]/10 shadow-xs space-y-3 hover:border-[#9A5C2F] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#9A5C2F]/10 border border-[#9A5C2F]/30 flex items-center justify-center text-[#9A5C2F]">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#102B49]">
              Saha Disiplini
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">
              Çizimdeki vizyonu sahada milimetrik imalatla hayata geçiriyor, test ve komisyonlama sonrası teslim ediyoruz.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
