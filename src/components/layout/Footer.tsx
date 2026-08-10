"use client";

import React from "react";
import { ArrowUpRight, Camera, MessageCircle, Phone } from "lucide-react";
import { BUSINESS_CONTACT, createWhatsAppUrl } from "@/lib/contact";

const FOOTER_LINKS = [
  { label: "Projeler", href: "#projects" },
  { label: "Hizmetler", href: "#services" },
  { label: "Projem Nerede?", href: "#project-tracking" },
  { label: "İletişim", href: "#contact" },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[#9A5C2F]/20 bg-[#0A1B2E] px-5 pb-28 pt-14 text-[#F6F2EA] sm:px-10 md:pb-12 lg:px-20">
      <div className="absolute inset-0 bg-blueprint-dark opacity-[0.18] pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 border-b border-white/10 pb-10 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="ed-panel-title font-serif text-2xl font-bold text-white">
            ERDEM DİZAYN & MEKANİK
          </h2>
          <p className="ed-body-copy-sm mt-3 max-w-md text-sm leading-7 text-white/68">
            Tasarımdan uygulamaya güvenilir çözümler.
          </p>
          <a
            href={BUSINESS_CONTACT.phoneHref}
            className="ed-interactive mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8733E]"
          >
            <Phone className="h-4 w-4 text-[#B8733E]" />
            <span>{BUSINESS_CONTACT.phoneDisplay}</span>
          </a>
        </div>

        <nav className="flex flex-col gap-3 md:col-span-3">
          {FOOTER_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="ed-interactive min-h-8 text-sm font-semibold text-white/72 transition-colors hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8733E]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col items-start gap-3 md:col-span-3">
          <a
            href={createWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-interactive inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8733E]"
          >
            <MessageCircle className="h-4 w-4 text-[#B8733E]" />
            <span>WhatsApp</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href={BUSINESS_CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-interactive inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8733E]"
          >
            <Camera className="h-4 w-4 text-[#B8733E]" />
            <span>Instagram</span>
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-3 pt-7 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Erdem Dizayn & Mekanik.</p>
        <p>İç Mimari · Mekanik · Uygulama</p>
      </div>
    </footer>
  );
};
