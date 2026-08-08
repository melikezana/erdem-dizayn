"use client";

import React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { SERVICES_DATA } from "@/data/services";

interface ServicesProps {
  onOpenAppointment: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenAppointment }) => {
  return (
    <section
      id="services"
      className="relative w-full border-t border-[#102B49]/10 px-5 py-24 sm:px-10 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-light opacity-20 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 grid grid-cols-1 gap-8 border-b border-[#102B49]/10 pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[#102B49]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
              <span>HİZMETLER</span>
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight text-[#102B49] sm:text-5xl lg:text-6xl">
              Tasarım, mekanik ve uygulama aynı masada.
            </h2>
          </div>

          <p className="max-w-xl text-base leading-8 text-[#102B49]/72 lg:col-span-5">
            Süreci karmaşıklaştırmadan, ihtiyacınızı doğru sıraya koyar ve her
            adımı uygulanabilir bir plana dönüştürürüz.
          </p>
        </div>

        <div className="divide-y divide-[#102B49]/10 border-b border-[#102B49]/10">
          {SERVICES_DATA.map((service) => (
            <article
              key={service.id}
              className="grid grid-cols-1 gap-6 py-9 transition-colors hover:bg-[#FBFAF7]/70 lg:grid-cols-12 lg:gap-10"
            >
              <div className="flex items-start gap-5 lg:col-span-4">
                <span className="font-serif text-4xl font-bold leading-none text-[#9A5C2F]/55 sm:text-5xl">
                  {service.number}
                </span>
                <h3 className="font-serif text-2xl font-bold leading-tight text-[#102B49] sm:text-3xl">
                  {service.title}
                </h3>
              </div>

              <div className="lg:col-span-4">
                <p className="text-base leading-8 text-[#102B49]/78 sm:text-lg">
                  {service.description}
                </p>
              </div>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-4">
                {service.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex min-h-8 items-center gap-2 text-sm text-[#102B49]/82"
                  >
                    <Check className="h-4 w-4 shrink-0 text-[#9A5C2F]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-6 text-[#102B49]/65">
            Hangi başlıkla başlayacağınızdan emin değilseniz, kısa bir görüşme
            yeterli olur.
          </p>
          <button
            type="button"
            onClick={onOpenAppointment}
            className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <span>Randevu Oluştur</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
