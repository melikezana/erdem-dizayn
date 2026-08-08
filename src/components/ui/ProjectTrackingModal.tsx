"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, Check, MessageCircle, Search, X } from "lucide-react";
import {
  PROJECT_STAGES,
  findDemoProjectByCode,
  normalizeProjectCode,
  type ProjectStageState,
  type ProjectTrackingRecord,
} from "@/data/project-tracking";
import { createWhatsAppUrl } from "@/lib/contact";

interface ProjectTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAppointment: () => void;
}

function toTitleCaseTr(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
}

function getStageState(index: number, currentIndex: number): ProjectStageState {
  if (index < currentIndex) return "completed";
  if (index === currentIndex) return "active";
  return "upcoming";
}

export const ProjectTrackingModal: React.FC<ProjectTrackingModalProps> = ({
  isOpen,
  onClose,
  onOpenAppointment,
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const [projectCode, setProjectCode] = useState("");
  const [submittedCode, setSubmittedCode] = useState("");
  const [selectedProject, setSelectedProject] = useState<ProjectTrackingRecord | null>(null);
  const [lookupState, setLookupState] = useState<"idle" | "found" | "empty">("idle");

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

  const currentStageIndex = useMemo(() => {
    if (!selectedProject) return -1;
    return PROJECT_STAGES.findIndex((stage) => stage.id === selectedProject.currentStageId);
  }, [selectedProject]);

  const currentStage = currentStageIndex >= 0 ? PROJECT_STAGES[currentStageIndex] : null;
  const nextStage = currentStageIndex >= 0 ? PROJECT_STAGES[currentStageIndex + 1] : null;
  const visibleProjectCode = submittedCode || selectedProject?.code || normalizeProjectCode(projectCode);

  const whatsappMessage = useMemo(
    () =>
      ["Merhaba Erdem Bey,", `${visibleProjectCode || "ERD-XXXXX"} kodlu projem hakkında bilgi almak istiyorum.`].join(
        "\n"
      ),
    [visibleProjectCode]
  );

  const whatsappUrl = createWhatsAppUrl(whatsappMessage);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCode = normalizeProjectCode(projectCode);
    const project = findDemoProjectByCode(normalizedCode);

    setSubmittedCode(normalizedCode);
    setSelectedProject(project);
    setLookupState(project ? "found" : "empty");
  };

  const handleAppointmentClick = () => {
    onClose();
    onOpenAppointment();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto px-4 py-6 sm:p-6">
          <motion.button
            type="button"
            aria-label="Proje durumu penceresini kapat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 cursor-pointer bg-[#0A1B2E]/72 backdrop-blur-md"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={{ scale: 0.97, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.97, opacity: 0, y: 18 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-xl border border-[#9A5C2F]/25 bg-[#FBFAF7] p-5 text-[#102B49] shadow-2xl sm:p-8"
          >
            <div className="absolute inset-0 bg-blueprint-light opacity-25 pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between gap-5 border-b border-[#102B49]/10 pb-5">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
                  PROJEM NEREDE?
                </span>
                <h2
                  id={titleId}
                  className="mt-2 font-serif text-2xl font-bold leading-tight text-[#102B49] sm:text-3xl"
                >
                  Projeniz hangi aşamada?
                </h2>
                <p
                  id={descriptionId}
                  className="mt-3 max-w-xl text-sm leading-6 text-[#102B49]/72 sm:text-base"
                >
                  Planlamadan teslime kadar süreci şeffaf biçimde takip edin.
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

            <form
              onSubmit={handleSubmit}
              className="relative z-10 mt-6 grid grid-cols-1 gap-3 border-b border-[#102B49]/10 pb-6 sm:grid-cols-[1fr_auto]"
            >
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#102B49]/72">
                  Proje Kodu
                </span>
                <input
                  type="text"
                  value={projectCode}
                  onChange={(event) => setProjectCode(event.target.value)}
                  autoComplete="off"
                  autoCapitalize="characters"
                  placeholder="ERD-24018"
                  className="min-h-12 w-full rounded-lg border border-[#102B49]/15 bg-white px-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#102B49] shadow-xs transition-colors placeholder:text-[#102B49]/35 focus:border-[#9A5C2F] focus:outline-none focus:ring-2 focus:ring-[#9A5C2F]/20"
                />
              </label>

              <button
                type="submit"
                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F] sm:self-end"
              >
                <Search className="h-4 w-4" />
                <span>Projemi Görüntüle</span>
              </button>
            </form>

            <div className="relative z-10 mt-6">
              {lookupState === "empty" && (
                <div
                  role="status"
                  className="rounded-lg border border-[#102B49]/10 bg-[#F6F2EA] p-5 text-sm leading-7 text-[#102B49]/72"
                >
                  Bu kod için demo proje bulunamadı. Kodu kontrol edip tekrar deneyin.
                </div>
              )}

              {selectedProject && currentStage && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                  <div>
                    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/10">
                      {[
                        ["Proje", selectedProject.project],
                        ["Konum", selectedProject.location],
                        ["Başlangıç", selectedProject.startDate],
                        ["Güncel Aşama", toTitleCaseTr(currentStage.title)],
                      ].map(([label, value]) => (
                        <div key={label} className="bg-[#FBFAF7] p-4">
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A5C2F]">
                            {label}
                          </span>
                          <span className="mt-2 block text-sm font-semibold text-[#102B49]">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 border-y border-[#102B49]/10 py-6">
                      <h3 className="font-serif text-2xl font-bold text-[#102B49]">
                        Şu anda buradayız.
                      </h3>
                      <p className="mt-3 text-sm font-semibold text-[#9A5C2F]">
                        Uygulama devam ediyor.
                      </p>
                      {nextStage && (
                        <p className="mt-2 text-sm text-[#102B49]/68">
                          Bir sonraki aşama: {toTitleCaseTr(nextStage.title)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#102B49] px-6 text-sm font-semibold text-[#F6F2EA] transition-colors hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp&apos;tan Sor</span>
                      </a>
                      <button
                        type="button"
                        onClick={handleAppointmentClick}
                        className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-white px-6 text-sm font-semibold text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
                      >
                        <CalendarDays className="h-4 w-4" />
                        <span>Randevu Oluştur</span>
                      </button>
                    </div>
                  </div>

                  <ol className="space-y-0">
                    {PROJECT_STAGES.map((stage, index) => {
                      const state = getStageState(index, currentStageIndex);
                      const isCompleted = state === "completed";
                      const isActive = state === "active";

                      return (
                        <li
                          key={stage.id}
                          className="relative grid grid-cols-[3rem_1fr] gap-4 pb-5 last:pb-0"
                          aria-current={isActive ? "step" : undefined}
                        >
                          <div className="relative flex justify-center">
                            {index < PROJECT_STAGES.length - 1 && (
                              <span
                                className={`absolute top-10 bottom-0 w-px ${
                                  isCompleted || isActive ? "bg-[#9A5C2F]" : "bg-[#102B49]/14"
                                }`}
                              />
                            )}
                            <span
                              className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border text-[11px] font-bold ${
                                isCompleted
                                  ? "border-[#102B49] bg-[#102B49] text-[#F6F2EA]"
                                  : isActive
                                    ? "border-[#9A5C2F] bg-[#9A5C2F] text-white shadow-[0_0_0_6px_rgba(154,92,47,0.12)]"
                                    : "border-[#102B49]/14 bg-[#F6F2EA] text-[#102B49]/45"
                              }`}
                            >
                              {isCompleted ? <Check className="h-4 w-4" /> : stage.id}
                            </span>
                          </div>

                          <div
                            className={`rounded-lg border px-4 py-3 ${
                              isActive
                                ? "border-[#9A5C2F]/35 bg-[#F6F2EA]"
                                : "border-[#102B49]/10 bg-[#FBFAF7]/70"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-serif text-lg font-bold text-[#9A5C2F]/70">
                                {stage.id}
                              </span>
                              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-[#102B49]">
                                {stage.title}
                              </h4>
                            </div>
                            <p className="mt-2 text-sm leading-6 text-[#102B49]/68">
                              {stage.description}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {lookupState === "idle" && (
                <div className="flex min-h-24 items-center justify-between gap-4 rounded-lg border border-[#102B49]/10 bg-[#F6F2EA] p-5 text-sm text-[#102B49]/68">
                  <span>Demo için ERD-24018 kodunu deneyebilirsiniz.</span>
                  <ArrowRight className="hidden h-4 w-4 text-[#9A5C2F] sm:block" />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
