"use client";

import React from "react";
import Image from "next/image";
import { PROJECTS_DATA } from "@/data/projects";
import { ArrowUpRight } from "lucide-react";

export const Projects: React.FC = () => {
  return (
    <section id="projects" className="relative w-full py-32 px-6 sm:px-12 lg:px-20 border-t border-[#102B49]/10">
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 bg-blueprint-light opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 pb-8 border-b border-[#102B49]/10">
          <div>
            <div className="inline-flex items-center gap-3 px-3.5 py-1 rounded-full border border-[#102B49]/20 font-mono text-[10px] tracking-[0.25em] uppercase text-[#9A5C2F] mb-4">
              <span>SEÇİLİ PROJELER</span>
            </div>
            <h2 className="section-title font-serif font-bold text-[#102B49] tracking-tight">
              Çizgiden yapıya.<br />
              <span className="italic font-normal text-[#9A5C2F]">Fikirden gerçeğe.</span>
            </h2>
          </div>

          <p className="text-sm font-mono text-[#102B49]/70 uppercase tracking-widest max-w-xs">
            Mimari tasarım & entegre mekanik uygulama portfolyosu
          </p>
        </div>

        {/* Large Full-Bleed Editorial Project List */}
        <div className="space-y-24">
          {PROJECTS_DATA.map((project, idx) => (
            <div
              key={project.id}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Project Image composition (Near full-width 7 cols) */}
              <div className={`lg:col-span-8 overflow-hidden rounded-2xl border border-[#102B49]/10 relative min-h-[380px] sm:min-h-[480px] lg:min-h-[540px] bg-[#102B49]/5 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 65vw"
                  priority={idx === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102B49]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute top-6 left-6 font-mono text-xs tracking-widest text-white px-3 py-1 rounded-full bg-[#102B49]/70 backdrop-blur-sm border border-white/20 uppercase">
                  {project.category}
                </div>
              </div>

              {/* Project Details Content (5 cols) */}
              <div className={`lg:col-span-4 flex flex-col justify-between h-full py-4 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                <div>
                  {/* Meta Specs Grid */}
                  <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#102B49]/10 mb-6 font-mono text-xs text-[#102B49]/70 uppercase tracking-wider">
                    <div>
                      <span className="block text-[10px] text-[#9A5C2F] mb-1 font-bold">KONUM</span>
                      <span>{project.location}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-[#9A5C2F] mb-1 font-bold">YIL</span>
                      <span>{project.year}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#102B49] tracking-tight mb-4 group-hover:text-[#9A5C2F] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-sm sm:text-base text-[#102B49]/80 font-sans font-light leading-relaxed mb-8">
                    {project.description}
                  </p>

                  {/* Discipline Badges */}
                  <div className="mb-8">
                    <span className="block text-[10px] font-mono text-[#9A5C2F] tracking-widest uppercase mb-3 font-bold">
                      DİSİPLİNLER
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {project.disciplines.map((d, dIdx) => (
                        <span
                          key={dIdx}
                          className="text-[11px] font-mono px-3 py-1 rounded-md bg-[#102B49]/5 text-[#102B49] border border-[#102B49]/10 uppercase"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="#contact"
                    className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase font-semibold text-[#102B49] group-hover:text-[#9A5C2F] transition-colors"
                  >
                    <span>PROJE DETAYINI İNCELEYİN</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
