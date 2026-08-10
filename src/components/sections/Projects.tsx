"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS_DATA } from "@/data/projects";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ProjectsProps {
  onOpenAppointment: () => void;
}

export const Projects: React.FC<ProjectsProps> = ({ onOpenAppointment }) => {
  return (
    <section
      id="projects"
      className="ed-section-shell relative w-full border-t border-[#102B49]/10 px-5 py-24 sm:px-10 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-light opacity-15 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal className="mb-14 grid grid-cols-1 gap-8 border-b border-[#102B49]/10 pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="ed-eyebrow mb-5 inline-flex items-center gap-3 rounded-full border border-[#102B49]/15 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
              <span>SEÇİLİ PROJELER</span>
            </div>
            <h2 className="ed-section-title-sm font-serif text-3xl font-bold leading-tight text-[#102B49] sm:text-5xl lg:text-6xl">
              Önce görün.
              <br />
              <span className="font-normal italic text-[#9A5C2F]">
                Sonra birlikte tasarlayalım.
              </span>
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          {PROJECTS_DATA.map((project, index) => (
            <ScrollReveal
              key={project.id}
              delay={(index % 2) * 0.05}
            >
              <Link
                href={`/projeler/${project.slug}`}
                className="ed-card-lift group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9A5C2F]"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-[#102B49]/10 bg-[#102B49]/5">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="ed-media-lift object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 border-b border-[#102B49]/10 py-5 sm:grid-cols-[1fr_auto] sm:items-end">
                  <div>
                    <h3 className="ed-card-title font-serif text-2xl font-bold text-[#102B49] sm:text-3xl">
                      {project.title}
                    </h3>
                    <p className="ed-eyebrow mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#9A5C2F]">
                      {project.type}
                    </p>
                  </div>
                  <p className="ed-body-copy-sm text-sm text-[#102B49]/68">
                    {project.location}
                  </p>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 flex justify-start">
          <button
            type="button"
            onClick={onOpenAppointment}
            className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#FBFAF7] px-7 text-sm font-semibold uppercase tracking-[0.12em] text-[#102B49] transition-colors hover:border-[#9A5C2F] hover:text-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
          >
            <span>Benzer Bir Projeyi Konuşalım</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
