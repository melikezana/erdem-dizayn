"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SERVICES_DATA, ServiceItem } from "@/data/services";
import { Plus, Minus, ArrowUpRight, CheckCircle2 } from "lucide-react";

interface ServicesProps {
  onOpenQuote: () => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenQuote }) => {
  const [activeNumber, setActiveNumber] = useState<string>("01");
  const [filterCategory, setFilterCategory] = useState<string>("Tümü");

  const categories = ["Tümü", "Mimari", "Mekanik", "Uygulama"];

  const filteredServices =
    filterCategory === "Tümü"
      ? SERVICES_DATA
      : SERVICES_DATA.filter((s) => s.category === filterCategory);

  return (
    <section
      id="services"
      className="py-24 bg-[#FBFAF7] text-[#171717] relative overflow-hidden border-t border-[#102B49]/10"
    >
      {/* Subtle blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 pb-8 border-b border-[#102B49]/10 gap-8">
          <div className="space-y-3 max-w-3xl">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#9A5C2F] font-semibold block">
              UZMANLIK ALANLARI
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102B49] tracking-tight leading-tight">
              Bir yapıyı yalnızca tasarlamıyor, bütün sistemleriyle ele alıyoruz.
            </h2>
            <p className="text-sm sm:text-base text-gray-700 font-sans leading-relaxed pt-2">
              Mimari kararları mühendislik gerçeklerinden ayırmadan; estetik, konfor, verimlilik ve uygulanabilirliği aynı proje disiplini içinde çözüyoruz.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all border cursor-pointer ${
                  filterCategory === cat
                    ? "bg-[#102B49] text-white border-[#102B49] shadow-xs"
                    : "bg-white text-gray-700 border-[#102B49]/15 hover:border-[#9A5C2F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Architectural List Separated by Lines */}
        <div className="divide-y divide-[#102B49]/15 border-t border-b border-[#102B49]/15">
          {filteredServices.map((service: ServiceItem) => {
            const isOpen = activeNumber === service.number;

            return (
              <motion.div
                key={service.number}
                layout
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="group transition-colors duration-300"
              >
                {/* Main Row Header */}
                <div
                  onClick={() =>
                    setActiveNumber(isOpen ? "" : service.number)
                  }
                  className={`py-7 px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer transition-colors ${
                    isOpen ? "bg-[#F6F2EA]" : "hover:bg-[#F6F2EA]/60"
                  }`}
                >
                  <div className="flex items-center gap-6 sm:gap-10">
                    {/* Numbering */}
                    <span className="font-mono text-xl sm:text-2xl font-bold text-[#9A5C2F] w-10">
                      {service.number}
                    </span>

                    {/* Title */}
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A5C2F] block sm:hidden font-semibold">
                        {service.category}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#102B49] group-hover:text-[#9A5C2F] transition-colors">
                        {service.title}
                      </h3>
                    </div>
                  </div>

                  {/* Right Meta & Toggle Icon */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-4 sm:mt-0">
                    <span className="hidden sm:inline-block px-3 py-1 rounded bg-[#102B49]/5 border border-[#102B49]/10 text-[11px] font-mono uppercase text-[#102B49] font-medium">
                      {service.category}
                    </span>

                    <p className="text-xs text-gray-600 max-w-sm hidden lg:block truncate font-sans">
                      {service.shortDesc}
                    </p>

                    <div className="w-9 h-9 rounded-full border border-[#102B49]/20 flex items-center justify-center text-[#102B49] group-hover:border-[#9A5C2F] group-hover:bg-[#9A5C2F] group-hover:text-white transition-all">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-8 pt-2 bg-[#F6F2EA] border-t border-[#102B49]/10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                      {/* Description Column */}
                      <div className="md:col-span-6 space-y-4">
                        <h4 className="font-serif text-lg font-bold text-[#102B49]">
                          Disiplin Açıklaması & Yaklaşım
                        </h4>
                        <p className="text-sm text-gray-700 leading-relaxed font-sans">
                          {service.fullDesc}
                        </p>

                        <div className="pt-2">
                          <button
                            onClick={onOpenQuote}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#9A5C2F] hover:text-[#102B49] font-semibold transition-colors cursor-pointer"
                          >
                            <span>Bu Disiplin İçin Proje Görüşün</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Key Features & Deliverables Column */}
                      <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-[#102B49]/10 shadow-xs">
                        <div>
                          <h5 className="font-mono text-xs uppercase tracking-wider text-[#9A5C2F] mb-3 font-semibold">
                            Öne Çıkan Standartlar
                          </h5>
                          <ul className="space-y-2">
                            {service.features.map((feat, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-[#9A5C2F] shrink-0 mt-0.5" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-mono text-xs uppercase tracking-wider text-[#9A5C2F] mb-3 font-semibold">
                            Proje Çıktıları
                          </h5>
                          <ul className="space-y-2">
                            {service.deliverables.map((del, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#9A5C2F] shrink-0 mt-1.5" />
                                <span>{del}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
