"use client";

import React from "react";
import { CalendarDays, MessageCircle } from "lucide-react";
import { createWhatsAppUrl } from "@/lib/contact";

interface ConversionActionsProps {
  onOpenAppointment: () => void;
}

export const ConversionActions: React.FC<ConversionActionsProps> = ({
  onOpenAppointment,
}) => {
  const whatsappUrl = createWhatsAppUrl();

  return (
    <>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="ed-interactive fixed bottom-6 right-6 z-40 hidden min-h-12 items-center gap-2 rounded-full border border-[#9A5C2F]/30 bg-[#0A1B2E] px-5 text-sm font-semibold text-[#F6F2EA] shadow-xl shadow-[#0A1B2E]/20 transition-colors hover:bg-[#102B49] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] md:inline-flex"
        aria-label="WhatsApp'tan yaz"
      >
        <MessageCircle className="h-4 w-4 text-[#9A5C2F]" />
        <span>WhatsApp&apos;tan Yaz</span>
      </a>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#102B49]/10 bg-[#F6F2EA]/96 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-16px_40px_rgba(10,27,46,0.12)] backdrop-blur-md md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onOpenAppointment}
            className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-4 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <CalendarDays className="h-4 w-4" />
            <span>Randevu</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ed-interactive inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#102B49]/15 bg-white px-4 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
};
