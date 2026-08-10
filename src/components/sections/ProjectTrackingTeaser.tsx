"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface ProjectTrackingTeaserProps {
  onOpenProjectTracking: () => void;
}

export const ProjectTrackingTeaser: React.FC<ProjectTrackingTeaserProps> = ({
  onOpenProjectTracking,
}) => {
  return (
    <section
      id="project-tracking"
      className="ed-section-shell-tight relative w-full border-t border-[#102B49]/10 bg-[#FBFAF7] px-5 py-12 text-[#102B49] sm:px-10 lg:px-20"
    >
      <div className="absolute inset-0 bg-blueprint-light opacity-10 pointer-events-none" />

      <ScrollReveal className="relative z-10 mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="ed-eyebrow text-[11px] font-semibold uppercase tracking-[0.24em] text-[#9A5C2F]">
            PROJEM NEREDE?
          </span>
          <h2 className="ed-panel-title mt-3 max-w-xl font-serif text-2xl font-bold leading-tight text-[#102B49] sm:text-3xl">
            Projeniz hangi aşamada?
          </h2>
          <p className="ed-body-copy-sm mt-2 max-w-xl text-sm leading-6 text-[#102B49]/68">
            Planlamadan teslime kadar süreci tek bakışta takip edin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenProjectTracking}
          className="ed-interactive inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#102B49]/20 bg-[#102B49] px-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#F6F2EA] transition-colors hover:border-[#9A5C2F] hover:bg-[#9A5C2F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A5C2F]"
        >
          <span>Proje Durumunu Gör</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </ScrollReveal>
    </section>
  );
};
