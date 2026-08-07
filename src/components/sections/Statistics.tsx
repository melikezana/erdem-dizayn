"use client";

import React from "react";
import { motion } from "framer-motion";
import { STATS_DATA, StatItem } from "@/data/stats";

export const Statistics: React.FC = () => {
  return (
    <section className="py-20 bg-[#F6F2EA] text-[#171717] relative overflow-hidden border-t border-b border-[#102B49]/10">
      {/* Blueprint background grid */}
      <div className="absolute inset-0 bg-blueprint-light opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 divide-y md:divide-y-0 md:divide-x divide-[#102B49]/10">
          {STATS_DATA.map((stat: StatItem, index: number) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="flex flex-col items-center text-center pt-6 md:pt-0 md:px-6 space-y-2"
            >
              <span className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#9A5C2F] via-[#875128] to-[#102B49]">
                {stat.value}
              </span>
              <h3 className="font-serif text-lg font-bold text-[#102B49] tracking-wide">
                {stat.label}
              </h3>
              <p className="text-xs text-gray-600 font-sans max-w-xs leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
