"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  MessageSquareText,
  Send,
  User,
  X,
} from "lucide-react";
import { createWhatsAppUrl } from "@/lib/contact";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PROJECT_TYPES = [
  "Konut",
  "İç Mimari",
  "Tadilat / Yenileme",
  "Mekanik",
  "Ofis / Ticari Alan",
  "Diğer",
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const [name, setName] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const whatsappMessage = useMemo(
    () =>
      [
        "Merhaba Erdem Bey,",
        "",
        "Web siteniz üzerinden bir görüşme planlamak istiyorum.",
        "",
        `Ad Soyad: ${name.trim() || "Belirtilmedi"}`,
        `Proje Türü: ${projectType}`,
        `Tercih Edilen Tarih: ${preferredDate || "Belirtilmedi"}`,
        `Tercih Edilen Saat: ${preferredTime || "Belirtilmedi"}`,
        `Not: ${note.trim() || "Belirtilmedi"}`,
        "",
        "Uygun olduğunuz zamanı paylaşabilir misiniz?",
      ].join("\n"),
    [name, note, preferredDate, preferredTime, projectType]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const whatsappWindow = window.open(
      createWhatsAppUrl(whatsappMessage),
      "_blank",
      "noopener,noreferrer"
    );

    if (whatsappWindow) {
      whatsappWindow.opener = null;
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto px-4 py-6 sm:p-6">
          <motion.button
            type="button"
            aria-label="Randevu penceresini kapat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A1B2E]/70 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ scale: 0.96, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-[#9A5C2F]/25 bg-[#FBFAF7] p-5 text-[#102B49] shadow-2xl sm:p-8"
          >
            <div className="absolute inset-0 bg-blueprint-light opacity-35 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-5 border-b border-[#102B49]/10 pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
                  RANDEVU
                </span>
                <h2
                  id={titleId}
                  className="mt-2 font-serif text-2xl font-bold leading-tight text-[#102B49] sm:text-3xl"
                >
                  Projenizi konuşmak için bir zaman belirleyelim.
                </h2>
                <p
                  id={descriptionId}
                  className="mt-3 max-w-xl text-sm leading-6 text-[#102B49]/72 sm:text-base"
                >
                  Birkaç kısa bilgi bırakın; talebinizi WhatsApp üzerinden
                  doğrudan Erdem Dizayn & Mekanik&apos;e iletelim.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#102B49]/15 bg-white text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                    <User className="h-4 w-4 text-[#9A5C2F]" />
                    Ad Soyad
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                    placeholder="Adınız ve soyadınız"
                  />
                </label>

                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                    <BriefcaseBusiness className="h-4 w-4 text-[#9A5C2F]" />
                    Proje Türü
                  </span>
                  <select
                    required
                    value={projectType}
                    onChange={(event) => setProjectType(event.target.value)}
                    className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                    <CalendarDays className="h-4 w-4 text-[#9A5C2F]" />
                    Tercih Edilen Tarih
                  </span>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(event) => setPreferredDate(event.target.value)}
                    className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                  />
                </label>

                <label className="group block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                    <Clock className="h-4 w-4 text-[#9A5C2F]" />
                    Tercih Edilen Saat
                  </span>
                  <input
                    type="time"
                    required
                    value={preferredTime}
                    onChange={(event) => setPreferredTime(event.target.value)}
                    className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm text-[#102B49] shadow-xs transition-colors focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                  <MessageSquareText className="h-4 w-4 text-[#9A5C2F]" />
                  Kısa Not
                </span>
                <textarea
                  rows={4}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  className="w-full resize-none rounded-lg border border-[#102B49]/15 bg-white px-4 py-3 text-sm leading-6 text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                  placeholder="Mekanınız, ihtiyaçlarınız veya görüşmede konuşmak istediğiniz konu..."
                />
              </label>

              <div className="flex flex-col gap-3 border-t border-[#102B49]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-[#102B49]/62">
                  Gönderim sonrası WhatsApp açılır; mesajı kontrol edip
                  iletebilirsiniz.
                </p>
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  <span>Randevu Talebini Gönder</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
