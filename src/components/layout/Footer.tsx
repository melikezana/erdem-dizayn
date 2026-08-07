"use client";

import React from "react";
import { ArrowUpRight, MapPin, Phone, Mail, Globe } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0A1B2E] border-t border-[#9A5C2F]/20 text-[#F6F2EA] relative overflow-hidden">
      {/* Blueprint Dark background */}
      <div className="absolute inset-0 bg-blueprint-dark opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-[#9A5C2F]/15">
          {/* Brand Info (Cols 1-5) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border border-[#9A5C2F] flex items-center justify-center bg-[#102B49] text-[#9A5C2F] font-serif font-bold text-base tracking-tighter">
                ED
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold tracking-wider text-white">
                  ERDEM DİZAYN & MEKANİK
                </h3>
                <p className="text-[10px] tracking-[0.22em] text-[#9A5C2F] uppercase font-mono font-semibold">
                  Mimarlık & Mekanik Mühendislik
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300 font-serif italic max-w-md leading-relaxed">
              &quot;Tasarımdan Uygulamaya Güvenilir Çözümler.&quot;
            </p>

            <p className="text-xs text-gray-400 max-w-sm leading-relaxed font-sans">
              Mimari konsept tasarımdan iç mekana, VRV/VRF iklimlendirmeden yangın otomasyonu ve anahtar teslim taahhüt süreçlerine bütüncül mühendislik yaklaşımı.
            </p>

            <div className="pt-2 text-xs font-mono text-[#9A5C2F]">
              Kurucu & Yönetici: <span className="text-white font-semibold">Erdem Çeken</span>
            </div>
          </div>

          {/* Quick Navigation (Cols 6-8) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A5C2F] font-semibold">
              Hızlı Navigasyon
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <a href="#hero" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>Ana Sayfa</span>
                </a>
              </li>
              <li>
                <a href="#philosophy" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>Hakkımızda & Felsefemiz</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>Uzmanlık Alanları</span>
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>Seçili Projeler</span>
                </a>
              </li>
              <li>
                <a href="#process" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>Proje Süreci</span>
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#9A5C2F] transition-colors flex items-center gap-1">
                  <span>İletişim & Teklif</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Summary (Cols 9-12) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[#9A5C2F] font-semibold">
              Stüdyo & Merkez
            </h4>
            <ul className="space-y-3 text-xs text-gray-300 font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9A5C2F] shrink-0 mt-0.5" />
                <span>Maslak Mahallesi, Büyükdere Caddesi No:245, Sarıyer / İstanbul</span>
              </li>
              <li className="flex items-center gap-2.5 font-mono">
                <Phone className="w-4 h-4 text-[#9A5C2F] shrink-0" />
                <a href="tel:+902120000000" className="hover:text-white transition-colors">
                  +90 (212) 000 00 00
                </a>
              </li>
              <li className="flex items-center gap-2.5 font-mono">
                <Mail className="w-4 h-4 text-[#9A5C2F] shrink-0" />
                <a href="mailto:info@erdemdizayn.com" className="hover:text-white transition-colors">
                  info@erdemdizayn.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 font-mono">
                <Globe className="w-4 h-4 text-[#9A5C2F] shrink-0" />
                <span>www.erdemdizaynmekanik.com</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href="https://wa.me/905320000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#9A5C2F] hover:text-white transition-colors"
              >
                <span>WhatsApp İletişim Hattı</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 font-mono gap-4">
          <p>© {new Date().getFullYear()} Erdem Dizayn & Mekanik. Tüm hakları saklıdır.</p>
          <p>
            Kurucu: <span className="text-gray-200 font-semibold">Erdem Çeken</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
