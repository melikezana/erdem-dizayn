"use client";

import React from "react";
import { ArrowUpRight, CalendarDays, Camera, MessageCircle, Phone } from "lucide-react";
import { BUSINESS_CONTACT, createWhatsAppUrl } from "@/lib/contact";

interface ContactCTAProps {
  onOpenAppointment: () => void;
}

export const ContactCTA: React.FC<ContactCTAProps> = ({ onOpenAppointment }) => {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-[#102B49] px-5 py-24 text-[#F6F2EA] sm:px-10 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-dark opacity-25 pointer-events-none" />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/20 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#B8733E]">
            <span>İLETİŞİM</span>
          </div>

          <h2 className="mb-7 font-serif text-3xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Bir fikriniz mi var?
            <br />
            <span className="font-normal italic text-[#B8733E]">
              Konuşarak başlayalım.
            </span>
          </h2>

          <p className="max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Yeni bir mekân, yenileme ya da mekanik bir ihtiyaç... Projenizi
            kısaca anlatın; size en doğru başlangıç noktasını birlikte
            belirleyelim.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={onOpenAppointment}
              className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9A5C2F] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E]"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Randevu Oluştur</span>
            </button>

            <a
              href={createWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/20 px-7 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:border-[#B8733E] hover:text-[#B8733E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8733E]"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp&apos;tan Yaz</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="border-y border-white/10 py-7">
            <a
              href={BUSINESS_CONTACT.phoneHref}
              className="mb-5 flex min-h-11 items-center gap-3 text-base font-semibold text-white transition-colors hover:text-[#B8733E]"
            >
              <Phone className="h-5 w-5 text-[#B8733E]" />
              <span>{BUSINESS_CONTACT.phoneDisplay}</span>
            </a>

            <a
              href={BUSINESS_CONTACT.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 flex min-h-11 items-center gap-3 text-base font-semibold text-white transition-colors hover:text-[#B8733E]"
            >
              <Camera className="h-5 w-5 text-[#B8733E]" />
              <span>Instagram&apos;da İnceleyin</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>

            <p className="text-sm leading-7 text-white/62">
              Mesajınızı doğrudan WhatsApp üzerinden iletebilir ya da randevu
              formuyla uygun görüşme zamanını paylaşabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
