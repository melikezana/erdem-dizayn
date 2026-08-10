"use client";

import React, { useCallback, useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
  LoaderCircle,
  MessageCircle,
  MessageSquareText,
  Phone,
  Send,
  User,
  X,
} from "lucide-react";
import { createAppointmentFollowUpWhatsAppUrl } from "@/lib/contact";
import type { ApiResponse } from "@/types/api";
import type {
  AppointmentCreateResult,
  AppointmentRequest,
} from "@/types/appointments";

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

type SubmitState = "idle" | "submitting" | "success" | "error";

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [note, setNote] = useState("");
  const [website, setWebsite] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const resetModal = useCallback(() => {
    setFullName("");
    setPhone("");
    setProjectType(PROJECT_TYPES[0]);
    setPreferredDate("");
    setPreferredTime("");
    setNote("");
    setWebsite("");
    setSubmitState("idle");
  }, []);

  const handleClose = useCallback(() => {
    resetModal();
    onClose();
  }, [onClose, resetModal]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, isOpen]);

  const isSubmitting = submitState === "submitting";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    const payload: AppointmentRequest = {
      fullName,
      phone,
      projectType,
      preferredDate,
      preferredTime,
      note,
      website,
    };

    setSubmitState("submitting");

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | ApiResponse<AppointmentCreateResult>
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error("Appointment request failed.");
      }

      setFullName("");
      setPhone("");
      setProjectType(PROJECT_TYPES[0]);
      setPreferredDate("");
      setPreferredTime("");
      setNote("");
      setWebsite("");
      setSubmitState("success");
    } catch {
      setSubmitState("error");
    }
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
            onClick={handleClose}
            className="fixed inset-0 cursor-pointer bg-[#151310]/78 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ scale: 0.965, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.965, opacity: 0, y: 18 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
            className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[8px] border border-[#c8a34c]/28 bg-[#f8f0e5] p-5 text-[#1d1b18] shadow-2xl sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 bg-architectural-grid opacity-40" />

            <div className="relative z-10 flex items-start justify-between gap-5 border-b border-[#1d1b18]/10 pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a0613a]">
                  Randevu
                </span>
                <h2
                  id={titleId}
                  className="mt-2 max-w-2xl font-serif text-3xl font-semibold leading-tight text-[#1d1b18] sm:text-4xl"
                >
                  Projenizi konuşmak için sakin bir başlangıç noktası seçelim.
                </h2>
                <p
                  id={descriptionId}
                  className="mt-3 max-w-xl text-sm font-light leading-6 text-[#1d1b18]/72 sm:text-base"
                >
                  Kısa bilgileri bırakın; kapsamı ve doğru ilk adımı birlikte
                  netleştirmek için size dönüş yapalım.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClose}
                data-cursor="Kapat"
                className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#1d1b18]/15 bg-[#fbfaf7] text-[#1d1b18] transition-colors hover:border-[#a0613a] hover:text-[#a0613a]"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitState === "success" ? (
              <div className="relative z-10 mt-6 border border-[#a0613a]/25 bg-[#fbfaf7] p-5 sm:p-6">
                <CheckCircle2 className="h-10 w-10 text-[#a0613a]" />
                <h3 className="mt-4 font-serif text-3xl font-semibold text-[#1d1b18]">
                  Randevu talebiniz alındı.
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#1d1b18]/72">
                  En kısa sürede sizinle iletişime geçeceğiz.
                </p>
                <a
                  href={createAppointmentFollowUpWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Yaz"
                  className="ed-button mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1d1b18] px-6 text-sm font-semibold uppercase tracking-[0.13em] text-[#f8f0e5] transition-colors hover:bg-[#a0613a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp&apos;tan Devam Et</span>
                  <Send className="h-4 w-4" />
                </a>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 mt-6 space-y-5">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
                >
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(event) => setWebsite(event.target.value)}
                    />
                  </label>
                </div>

                {submitState === "error" && (
                  <div
                    role="alert"
                    className="flex gap-3 border border-[#a0613a]/30 bg-[#fbfaf7] p-4 text-sm leading-6 text-[#1d1b18]/76"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#a0613a]" />
                    <p>
                      Talebiniz gönderilemedi. Lütfen tekrar deneyin veya
                      WhatsApp&apos;tan bize ulaşın.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="group block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                      <User className="h-4 w-4 text-[#a0613a]" />
                      Ad Soyad
                    </span>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      autoComplete="name"
                      disabled={isSubmitting}
                      className="min-h-12 w-full border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 text-sm text-[#1d1b18] shadow-sm transition-colors placeholder:text-[#1d1b18]/35 focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                      placeholder="Adınız ve soyadınız"
                    />
                  </label>

                  <label className="group block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                      <Phone className="h-4 w-4 text-[#a0613a]" />
                      Telefon
                    </span>
                    <input
                      type="tel"
                      maxLength={30}
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      disabled={isSubmitting}
                      className="min-h-12 w-full border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 text-sm text-[#1d1b18] shadow-sm transition-colors placeholder:text-[#1d1b18]/35 focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                      placeholder="+90 ..."
                    />
                  </label>

                  <label className="group block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                      <BriefcaseBusiness className="h-4 w-4 text-[#a0613a]" />
                      Proje Türü
                    </span>
                    <select
                      required
                      value={projectType}
                      onChange={(event) => setProjectType(event.target.value)}
                      disabled={isSubmitting}
                      className="min-h-12 w-full border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 text-sm text-[#1d1b18] shadow-sm transition-colors focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                    >
                      {PROJECT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="group block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                      <CalendarDays className="h-4 w-4 text-[#a0613a]" />
                      Tarih
                    </span>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(event) => setPreferredDate(event.target.value)}
                      disabled={isSubmitting}
                      className="min-h-12 w-full border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 text-sm text-[#1d1b18] shadow-sm transition-colors focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                    />
                  </label>

                  <label className="group block">
                    <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                      <Clock className="h-4 w-4 text-[#a0613a]" />
                      Saat
                    </span>
                    <input
                      type="time"
                      required
                      value={preferredTime}
                      onChange={(event) => setPreferredTime(event.target.value)}
                      disabled={isSubmitting}
                      className="min-h-12 w-full border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 text-sm text-[#1d1b18] shadow-sm transition-colors focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#1d1b18]/72">
                    <MessageSquareText className="h-4 w-4 text-[#a0613a]" />
                    Kısa Not
                  </span>
                  <textarea
                    rows={4}
                    maxLength={1000}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    disabled={isSubmitting}
                    className="w-full resize-none border border-[#1d1b18]/14 bg-[#fbfaf7] px-4 py-3 text-sm leading-6 text-[#1d1b18] shadow-sm transition-colors placeholder:text-[#1d1b18]/35 focus:border-[#a0613a] focus:outline-none focus:ring-2 focus:ring-[#a0613a]/18 disabled:cursor-not-allowed disabled:opacity-65"
                    placeholder="Mekânınız, ihtiyaçlarınız veya görüşmede konuşmak istediğiniz konu..."
                  />
                </label>

                <div className="flex flex-col gap-3 border-t border-[#1d1b18]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-[#1d1b18]/62">
                    Form bilgileri yalnızca randevu talebinizi yanıtlamak için
                    kullanılır.
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    data-cursor="Gönder"
                    className="ed-button inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1d1b18] px-6 text-sm font-semibold uppercase tracking-[0.13em] text-[#f8f0e5] transition-colors hover:bg-[#a0613a] disabled:cursor-not-allowed disabled:bg-[#1d1b18]/60 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? "Gönderiliyor" : "Randevu Oluştur"}</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
