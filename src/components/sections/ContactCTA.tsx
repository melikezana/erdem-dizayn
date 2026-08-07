"use client";

import React from "react";
import { ArrowUpRight, MessageCircle, Mail, Phone } from "lucide-react";

interface ContactCTAProps {
  onOpenQuote: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onOpenQuote }) => {
  return (
    <section id="contact" className="relative w-full bg-[#102B49] text-[#F6F2EA] py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
      {/* Deep Navy Blueprint Grid */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />

      {/* Subtle Warm Amber Glow */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#9A5C2F]/20 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Main Editorial Copy */}
          <div className="lg:col-span-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/20 font-mono text-[10px] tracking-[0.3em] uppercase text-[#B8733E] mb-8">
              <span>BİRLİKTE ÇALIŞALIM</span>
            </div>

            <h2 className="section-title font-serif font-bold text-white tracking-tight leading-none mb-8">
              İyi bir proje,<br />
              doğru soruyla başlar.<br />
              <span className="text-[#B8733E]">Sizinkini konuşalım.</span>
            </h2>

            <p className="text-base sm:text-xl text-white/80 font-sans font-light leading-relaxed max-w-2xl mb-12">
              Projenizi, ihtiyaçlarınızı ve hayal ettiğiniz mekânı birlikte değerlendirelim.
            </p>

            {/* Primary Action Button */}
            <div className="flex flex-wrap items-center gap-6">
              <button
                onClick={onOpenQuote}
                className="px-9 py-4 rounded-full bg-[#9A5C2F] hover:bg-[#B8733E] text-white font-mono text-xs tracking-widest uppercase font-semibold flex items-center gap-3 transition-all shadow-lg cursor-pointer"
              >
                <span>Projenizi Anlatın</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Secondary Quick Contact Links */}
          <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md space-y-6">
            <h3 className="font-mono text-xs tracking-widest uppercase text-[#B8733E] mb-6 font-bold">
              HIZLI İLETİŞİM KANALLARI
            </h3>

            {/* WhatsApp */}
            <a
              href="https://wa.me/905000000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-[#B8733E] bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#B8733E]" />
                <span className="font-mono text-xs tracking-wider uppercase font-semibold text-white">
                  WhatsApp
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </a>

            {/* Email */}
            <a
              href="mailto:info@erdemdizaynmekanik.com"
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-[#B8733E] bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#B8733E]" />
                <span className="font-mono text-xs tracking-wider uppercase font-semibold text-white">
                  E-posta
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </a>

            {/* Direct Phone / Contact */}
            <a
              href="tel:+902120000000"
              className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-[#B8733E] bg-white/5 hover:bg-white/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#B8733E]" />
                <span className="font-mono text-xs tracking-wider uppercase font-semibold text-white">
                  İletişim
                </span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
