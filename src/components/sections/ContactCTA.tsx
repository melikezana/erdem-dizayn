"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, PhoneCall, Mail, MessageSquare, MapPin } from "lucide-react";

interface ContactCTAProps {
  onOpenQuote: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onOpenQuote }) => {
  return (
    <section
      id="contact"
      className="py-28 bg-[#102B49] text-[#F6F2EA] relative overflow-hidden"
    >
      {/* Blueprint Dark Grid */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-30 pointer-events-none" />

      {/* Subtle Copper Ambient Light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#9A5C2F]/10 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-10">
        
        {/* Small Label */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A1B2E] border border-[#9A5C2F]/40 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#9A5C2F] animate-pulse" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-[#F6F2EA] font-semibold">
            YENİ BİR PROJE Mİ?
          </span>
        </motion.div>

        {/* Heading & Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Bir fikriniz varsa,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9A5C2F] to-[#B8733E] italic font-normal">
              onu birlikte gerçeğe dönüştürelim.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-xl mx-auto font-sans leading-relaxed">
            Projenizi, ihtiyaçlarınızı ve hayal ettiğiniz mekânı konuşalım.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {/* Primary CTA */}
          <button
            onClick={onOpenQuote}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#9A5C2F] to-[#B8733E] text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2.5 shadow-lg hover:shadow-2xl hover:shadow-[#9A5C2F]/30 transition-all cursor-pointer group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Projenizi Anlatın</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>

          {/* Secondary CTA: WhatsApp */}
          <a
            href="https://wa.me/905320000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0A1B2E] border border-[#9A5C2F]/50 text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2.5 hover:border-[#9A5C2F] hover:bg-[#16365C] transition-all"
          >
            <PhoneCall className="w-4 h-4 text-[#9A5C2F]" />
            <span>WhatsApp</span>
          </a>

          {/* Direct Email */}
          <a
            href="mailto:info@erdemdizayn.com"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0A1B2E] border border-[#9A5C2F]/50 text-white font-mono text-xs tracking-wider uppercase font-semibold flex items-center justify-center gap-2.5 hover:border-[#9A5C2F] hover:bg-[#16365C] transition-all"
          >
            <Mail className="w-4 h-4 text-[#9A5C2F]" />
            <span>E-posta</span>
          </a>
        </motion.div>

        {/* Location Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="pt-10 inline-flex flex-col sm:flex-row items-center gap-4 px-6 py-4 rounded-xl bg-[#0A1B2E]/80 border border-[#9A5C2F]/20 text-left text-xs text-gray-300"
        >
          <MapPin className="w-5 h-5 text-[#9A5C2F] shrink-0" />
          <div>
            <span className="font-mono uppercase tracking-wider text-[#9A5C2F] font-semibold block text-[11px]">
              ERDEM DİZAYN & MEKANİK STÜDYO
            </span>
            <span className="text-gray-200">
              Maslak Mahallesi, Büyükdere Caddesi No:245, Sarıyer / İstanbul
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
