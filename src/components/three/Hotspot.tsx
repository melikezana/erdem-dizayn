"use client";

import React, { useState } from "react";
import { Html } from "@react-three/drei";
import { HotspotData } from "@/data/hotspots";
import { ChevronRight } from "lucide-react";

interface HotspotProps {
  data: HotspotData;
  activeHotspot: string | null;
  setActiveHotspot: (id: string | null) => void;
}

export const Hotspot: React.FC<HotspotProps> = ({
  data,
  activeHotspot,
  setActiveHotspot,
}) => {
  const isOpen = activeHotspot === data.id;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <group position={data.position}>
      <Html
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
        style={{
          transition: "all 0.25s ease-out",
          pointerEvents: "auto",
        }}
      >
        <div className="relative group">
          {/* Default State: Small Copper Dot, Thin Pulse Ring, Minimal Line */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveHotspot(isOpen ? null : data.id);
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`Hotspot: ${data.title}`}
            className="relative flex items-center justify-center w-6 h-6 rounded-full focus:outline-none transition-transform duration-300 transform hover:scale-125 cursor-pointer"
          >
            {/* Outer Thin Pulse Ring */}
            <span className="absolute -inset-1 rounded-full border border-[#9A5C2F] opacity-50 animate-ping pointer-events-none" />

            {/* Middle Glow Ring */}
            <span className="absolute inset-0 rounded-full bg-[#9A5C2F]/20 backdrop-blur-xs transition-opacity group-hover:opacity-100" />

            {/* Core Copper Dot */}
            <span className="relative w-3 h-3 rounded-full bg-[#9A5C2F] border-2 border-white shadow-md group-hover:bg-[#102B49] transition-colors" />

            {/* Minimal Label Badge (Hidden on mobile) */}
            <span className="absolute left-8 whitespace-nowrap px-2 py-0.5 rounded bg-white/90 border border-[#102B49]/10 text-[10px] font-mono tracking-wider uppercase text-[#102B49] shadow-sm backdrop-blur-md opacity-80 group-hover:opacity-100 transition-opacity hidden sm:block pointer-events-none">
              {data.number} • {data.title}
            </span>
          </button>

          {/* Expanded Hover/Click Card */}
          {(isOpen || isHovered) && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-8 sm:left-8 sm:translate-x-0 sm:bottom-0 w-72 sm:w-80 p-5 rounded-xl bg-white/95 text-[#171717] shadow-2xl border border-[#9A5C2F]/30 backdrop-blur-xl transition-all duration-300 z-50 animate-in fade-in zoom-in-95"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-[#9A5C2F]/15 mb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9A5C2F] font-semibold block">
                    {data.number} — {data.discipline}
                  </span>
                  <h4 className="font-serif text-base font-bold text-[#102B49] tracking-wide mt-0.5">
                    {data.title}
                  </h4>
                </div>
                {isOpen && (
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-gray-400 hover:text-[#102B49] text-xs p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Quote Statement */}
              <p className="text-xs text-[#171717] italic font-serif leading-relaxed mb-3 border-l-2 border-[#9A5C2F] pl-2.5">
                &quot;{data.quote}&quot;
              </p>

              {/* Specs List */}
              <div className="space-y-1 pt-1 border-t border-[#102B49]/5">
                {data.specs.map((spec, index) => (
                  <div
                    key={index}
                    className="flex items-center text-[11px] text-gray-600 gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-[#9A5C2F] shrink-0" />
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
};
