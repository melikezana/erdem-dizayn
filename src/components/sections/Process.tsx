"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PROCESS_STEPS, ProcessStep } from "@/data/process";
import { CheckCircle2 } from "lucide-react";

export const Process: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="process"
      ref={containerRef}
      className="py-24 bg-[#FBFAF7] text-[#171717] relative overflow-hidden border-t border-[#102B49]/10"
    >
      {/* Blueprint background grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#9A5C2F] font-semibold block">
            PROJE SÜRECİ
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#102B49] tracking-tight">
            İlk çizgiden son detaya.
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-sans italic font-serif">
            &quot;Her aşama, bir sonraki kararın temelini oluşturur.&quot;
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          
          {/* Animated Progress Line */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-[2px] bg-[#102B49]/10 -translate-x-1/2">
            <motion.div
              style={{ scaleY, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#9A5C2F] via-[#875128] to-[#102B49]"
            />
          </div>

          {/* Process Steps */}
          <div className="space-y-12 sm:space-y-16">
            {PROCESS_STEPS.map((stepItem: ProcessStep, index: number) => {
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={stepItem.step}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5 }}
                  className={`relative flex flex-col sm:flex-row items-start ${
                    isEven ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step Center Node */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-0 z-20 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-[#9A5C2F] text-[#102B49] font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                      {stepItem.step}
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className="ml-16 sm:ml-0 sm:w-1/2 sm:px-8 pt-1 sm:pt-0">
                    <div
                      className={`p-6 rounded-2xl bg-white border border-[#102B49]/10 shadow-xs space-y-3 hover:border-[#9A5C2F] transition-all ${
                        isEven ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <span className="font-mono text-xs text-[#9A5C2F] tracking-widest uppercase font-semibold block">
                        {stepItem.subtitle}
                      </span>

                      <h3 className="font-serif text-2xl font-bold text-[#102B49]">
                        {stepItem.title}
                      </h3>

                      <p className="text-xs text-gray-700 leading-relaxed font-sans">
                        {stepItem.description}
                      </p>

                      {/* Deliverables List */}
                      <div className="pt-3 border-t border-[#102B49]/10 space-y-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block">
                          Teslim Edilenler:
                        </span>
                        <div className={`flex flex-wrap gap-1.5 ${isEven ? "sm:justify-end" : "sm:justify-start"}`}>
                          {stepItem.deliverables.map((del, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-[#F6F2EA] border border-[#102B49]/10 text-[10px] font-mono text-gray-700 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3 text-[#9A5C2F]" />
                              {del}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Spacer Column for Desktop */}
                  <div className="hidden sm:block sm:w-1/2" />
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
