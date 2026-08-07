"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { PROJECTS_DATA, ProjectItem } from "@/data/projects";
import { MapPin, Calendar, Maximize2, X, Check } from "lucide-react";

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [filter, setFilter] = useState<string>("Tümü");

  const categories = ["Tümü", "Mimari", "Mekanik", "Entegre Proje"];

  const filteredProjects =
    filter === "Tümü"
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.category === filter);

  return (
    <section
      id="projects"
      className="py-24 bg-[#F6F2EA] text-[#171717] relative overflow-hidden border-t border-[#102B49]/10"
    >
      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-8 border-b border-[#102B49]/10 gap-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#9A5C2F] font-semibold block mb-2">
              SEÇİLİ PROJELER
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102B49] tracking-tight">
              Çizgiden mekâna.
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all border cursor-pointer ${
                  filter === cat
                    ? "bg-[#102B49] text-white border-[#102B49]"
                    : "bg-white text-gray-700 border-[#102B49]/15 hover:border-[#9A5C2F]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Large Editorial Full-Width Portfolio Layout */}
        <div className="space-y-16 lg:space-y-24">
          {filteredProjects.map((project: ProjectItem, index: number) => {
            const isReversed = index % 2 !== 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7 }}
                onClick={() => setSelectedProject(project)}
                className={`group cursor-pointer grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-white p-6 sm:p-8 rounded-2xl border border-[#102B49]/10 shadow-xs hover:shadow-xl hover:border-[#9A5C2F]/40 transition-all duration-300`}
              >
                {/* Image Frame (Cols 1-7 or 6-12) */}
                <div
                  className={`lg:col-span-7 relative h-72 sm:h-[420px] w-full rounded-xl overflow-hidden bg-gray-100 ${
                    isReversed ? "lg:order-2" : ""
                  }`}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 rounded bg-white/90 border border-[#102B49]/10 text-[10px] font-mono uppercase tracking-widest text-[#102B49] backdrop-blur-md font-semibold">
                      {project.category}
                    </span>
                  </div>

                  {/* Expand Icon */}
                  <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-[#102B49]/10 flex items-center justify-center text-[#102B49] opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md">
                    <Maximize2 className="w-4 h-4 text-[#9A5C2F]" />
                  </div>
                </div>

                {/* Text Content (Cols 8-12 or 1-5) */}
                <div className={`lg:col-span-5 space-y-5 ${isReversed ? "lg:order-1" : ""}`}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs font-mono text-[#9A5C2F] font-semibold">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {project.location}
                      </span>
                      <span>•</span>
                      <span>{project.year}</span>
                      <span>•</span>
                      <span>{project.area}</span>
                    </div>

                    <h3 className="font-serif text-3xl sm:text-4xl font-bold text-[#102B49] group-hover:text-[#9A5C2F] transition-colors leading-tight">
                      {project.title}
                    </h3>

                    <p className="text-xs text-gray-500 font-mono font-medium">
                      {project.subtitle}
                    </p>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-sans line-clamp-3">
                    {project.description}
                  </p>

                  {/* Disciplines Badges */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[#102B49]/10">
                    {project.disciplines.map((disc, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded bg-[#F6F2EA] text-[11px] font-mono text-gray-700 border border-[#102B49]/10 font-medium"
                      >
                        {disc}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Project Detail Modal */}
        <AnimatePresence>
          {selectedProject && (
            <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedProject(null)}
                className="fixed inset-0 bg-[#102B49]/70 backdrop-blur-md"
              />

              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="relative w-full max-w-3xl bg-white border border-[#102B49]/20 rounded-2xl overflow-hidden shadow-2xl z-10 text-[#171717]"
              >
                <div className="relative h-72 sm:h-96 w-full">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102B49]/80 via-transparent to-transparent" />
                  
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white border border-[#102B49]/20 flex items-center justify-center text-[#102B49] hover:bg-[#9A5C2F] hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
                    <span className="px-3 py-1 rounded bg-[#9A5C2F] text-[10px] font-mono uppercase tracking-widest text-white mb-2 inline-block font-semibold">
                      {selectedProject.category}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-4xl font-bold">
                      {selectedProject.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Meta stats */}
                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl bg-[#F6F2EA] border border-[#102B49]/10 text-xs font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">KONUM</span>
                      <span className="text-[#102B49] font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#9A5C2F]" />
                        {selectedProject.location}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">TESLİM YILI</span>
                      <span className="text-[#102B49] font-semibold flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3 text-[#9A5C2F]" />
                        {selectedProject.year}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">TOPLAM ALAN</span>
                      <span className="text-[#102B49] font-semibold mt-0.5 block">
                        {selectedProject.area}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed font-sans">
                    {selectedProject.description}
                  </p>

                  <div>
                    <h4 className="font-mono text-xs uppercase tracking-wider text-[#9A5C2F] mb-3 font-semibold">
                      Mühendislik & İmalat Detayları
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedProject.highlights.map((h, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700 font-sans">
                          <Check className="w-4 h-4 text-[#9A5C2F]" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
