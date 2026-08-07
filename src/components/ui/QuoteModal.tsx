"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Send, PhoneCall, Mail } from "lucide-react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DISCIPLINES = [
  "Mimari Tasarım",
  "İç Mimari",
  "Mekanik Projelendirme",
  "Isıtma ve Soğutma",
  "Havalandırma",
  "Sıhhi Tesisat",
  "Yangın Sistemleri",
  "Uygulama ve Taahhüt",
];

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose }) => {
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const toggleDiscipline = (disc: string) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disc) ? prev.filter((d) => d !== disc) : [...prev, disc]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#102B49]/60 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#FBFAF7] border border-[#102B49]/20 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 text-[#171717] overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#102B49]/10 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#9A5C2F] font-semibold">
                  TEKLİF & PROJE TALEP FORMU
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#102B49] mt-1">
                  Projeniz İçin Görüşelim
                </h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white border border-[#102B49]/15 flex items-center justify-center text-gray-500 hover:text-[#102B49] hover:border-[#9A5C2F] transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#9A5C2F]/10 border border-[#9A5C2F] flex items-center justify-center text-[#9A5C2F] mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#102B49] mb-2">
                  Talebiniz Alındı
                </h4>
                <p className="text-sm text-gray-700 max-w-md font-sans">
                  Proje bilgilerinizi inceleyip en kısa sürede Erdem Çeken ve uzman mühendislik ekibimizle sizinle iletişime geçeceğiz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {/* Discipline Multi-select */}
                <div>
                  <label className="block text-xs font-mono tracking-wider text-gray-600 uppercase mb-3 font-semibold">
                    İlgilendiğiniz Disiplinler (Çoklu Seçim)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DISCIPLINES.map((disc) => {
                      const isSelected = selectedDisciplines.includes(disc);
                      return (
                        <button
                          key={disc}
                          type="button"
                          onClick={() => toggleDiscipline(disc)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-[#9A5C2F] text-white border-[#9A5C2F] shadow-xs"
                              : "bg-white text-gray-700 border-[#102B49]/15 hover:border-[#9A5C2F]"
                          }`}
                        >
                          {disc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-mono font-medium">
                      Ad Soyad / Firma *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#102B49]/15 text-[#102B49] placeholder-gray-400 focus:outline-none focus:border-[#9A5C2F] text-sm shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1 font-mono font-medium">
                      Telefon / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0532 000 00 00"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#102B49]/15 text-[#102B49] placeholder-gray-400 focus:outline-none focus:border-[#9A5C2F] text-sm shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-mono font-medium">
                    E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@firma.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#102B49]/15 text-[#102B49] placeholder-gray-400 focus:outline-none focus:border-[#9A5C2F] text-sm shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-mono font-medium">
                    Proje Özeti & Konum
                  </label>
                  <textarea
                    rows={3}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    placeholder="Proje konumu, m² alanı ve özel istekleriniz..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-[#102B49]/15 text-[#102B49] placeholder-gray-400 focus:outline-none focus:border-[#9A5C2F] text-sm resize-none shadow-xs"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-4 text-xs text-gray-600 font-mono">
                    <a
                      href="https://wa.me/905320000000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[#9A5C2F] hover:underline"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Hızlı WhatsApp</span>
                    </a>
                    <a
                      href="mailto:info@erdemdizayn.com"
                      className="flex items-center gap-1.5 text-gray-600 hover:text-[#102B49]"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>E-posta</span>
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 rounded-lg bg-[#102B49] hover:bg-[#9A5C2F] text-white font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>Teklif Talebini Gönder</span>
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
