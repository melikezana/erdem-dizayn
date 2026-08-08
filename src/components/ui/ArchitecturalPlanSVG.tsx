"use client";

import React from "react";
import { motion } from "framer-motion";

interface ArchitecturalPlanSVGProps {
  isIntroActive?: boolean;
}

export const ArchitecturalPlanSVG: React.FC<ArchitecturalPlanSVGProps> = ({
  isIntroActive = true,
}) => {
  const containerOpacity = isIntroActive ? 0.85 : 0.045;
  const animDuration = isIntroActive ? 1.0 : 0;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden flex items-center justify-center transition-opacity duration-1000">
      <svg
        className="w-full h-full max-w-[1300px] max-h-[850px] transition-all duration-700"
        style={{ opacity: containerOpacity }}
        viewBox="0 0 1000 700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ==================================================
            PHASE 1: MAIN AXES & BLUEPRINT GRID (0.0s - 0.8s)
           ================================================== */}
        <g id="axes-grid">
          {/* Main X Axis */}
          <motion.line
            x1="50"
            y1="350"
            x2="950"
            y2="350"
            stroke="#9A5C2F"
            strokeWidth="1.2"
            strokeDasharray="6 4 2 4"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: animDuration * 0.8, delay: 0.1, ease: "easeInOut" }}
          />
          {/* Main Y Axis */}
          <motion.line
            x1="500"
            y1="50"
            x2="500"
            y2="650"
            stroke="#9A5C2F"
            strokeWidth="1.2"
            strokeDasharray="6 4 2 4"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.4 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: animDuration * 0.8, delay: 0.1, ease: "easeInOut" }}
          />

          {/* Secondary Grid Lines */}
          <motion.line
            x1="250"
            y1="50"
            x2="250"
            y2="650"
            stroke="#102B49"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.2 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: animDuration * 0.6, delay: 0.3 }}
          />
          <motion.line
            x1="750"
            y1="50"
            x2="750"
            y2="650"
            stroke="#102B49"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.2 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: animDuration * 0.6, delay: 0.3 }}
          />
          <motion.line
            x1="50"
            y1="200"
            x2="950"
            y2="200"
            stroke="#102B49"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.2 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: animDuration * 0.6, delay: 0.3 }}
          />
          <motion.line
            x1="50"
            y1="500"
            x2="950"
            y2="500"
            stroke="#102B49"
            strokeWidth="0.6"
            strokeDasharray="2 4"
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.2 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: animDuration * 0.6, delay: 0.3 }}
          />

          {/* Section Cut Line A-A' */}
          <motion.g
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.6 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.4, duration: animDuration * 0.5 }}
          >
            <line x1="180" y1="180" x2="820" y2="180" stroke="#102B49" strokeWidth="1.2" />
            <circle cx="180" cy="180" r="10" stroke="#102B49" strokeWidth="1" fill="#F6F2EA" />
            <text x="176" y="184" fontSize="10" fontFamily="monospace" fill="#102B49" fontWeight="bold">A</text>
            <circle cx="820" cy="180" r="10" stroke="#102B49" strokeWidth="1" fill="#F6F2EA" />
            <text x="816" y="184" fontSize="10" fontFamily="monospace" fill="#102B49" fontWeight="bold">A&apos;</text>
          </motion.g>
        </g>

        {/* ==================================================
            PHASE 2: EXTERIOR WALLS & VILLA FOOTPRINT (0.8s - 1.8s)
           ================================================== */}
        <g id="exterior-walls">
          {/* Main Footprint Contour */}
          <motion.path
            d="M 280 220 L 720 220 L 720 480 L 520 480 L 520 520 L 280 520 Z"
            stroke="#102B49"
            strokeWidth="2.8"
            strokeLinecap="square"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.8 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ duration: animDuration * 1.0, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />
          {/* Offset Double Wall Thickness Line */}
          <motion.path
            d="M 288 228 L 712 228 L 712 472 L 512 472 L 512 512 L 288 512 Z"
            stroke="#9A5C2F"
            strokeWidth="1"
            strokeLinecap="square"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: animDuration * 1.0, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        </g>

        {/* ==================================================
            PHASE 3: ROOM DIVISIONS & INTERIOR ARCHITECTURE (1.1s - 2.2s)
           ================================================== */}
        <g id="interior-divisions">
          {/* Living Room / Salon Partition */}
          <motion.path
            d="M 460 228 L 460 472"
            stroke="#102B49"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: animDuration * 0.6, delay: 1.0, ease: "easeOut" }}
          />
          {/* Entrance & Hallway Partition */}
          <motion.path
            d="M 288 340 L 460 340"
            stroke="#102B49"
            strokeWidth="1.5"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.6 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: animDuration * 0.6, delay: 1.2, ease: "easeOut" }}
          />
          {/* Terrace / Pool Platform Outline */}
          <motion.path
            d="M 520 480 L 760 480 L 760 580 L 520 580 Z"
            stroke="#9A5C2F"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            initial={isIntroActive ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 0.5 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: animDuration * 0.7, delay: 1.3, ease: "easeOut" }}
          />
          {/* Column Cross Marks */}
          {[
            { cx: 280, cy: 220 },
            { cx: 720, cy: 220 },
            { cx: 720, cy: 480 },
            { cx: 280, cy: 520 },
            { cx: 520, cy: 520 },
          ].map((col, idx) => (
            <motion.g
              key={idx}
              initial={isIntroActive ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 0.7 }}
              transition={{ delay: 1.4 + idx * 0.05, duration: animDuration * 0.3 }}
            >
              <rect x={col.cx - 6} y={col.cy - 6} width="12" height="12" fill="#102B49" opacity="0.18" stroke="#102B49" strokeWidth="0.8" />
              <line x1={col.cx - 6} y1={col.cy - 6} x2={col.cx + 6} y2={col.cy + 6} stroke="#9A5C2F" strokeWidth="0.9" />
              <line x1={col.cx + 6} y1={col.cy - 6} x2={col.cx - 6} y2={col.cy + 6} stroke="#9A5C2F" strokeWidth="0.9" />
            </motion.g>
          ))}
        </g>

        {/* ==================================================
            PHASE 4: DIMENSIONS & TECHNICAL ANNOTATIONS (1.8s - 2.8s)
           ================================================== */}
        <g id="dimensions-labels">
          {/* Top Dimension Line */}
          <motion.g
            initial={isIntroActive ? { opacity: 0, y: -5 } : { opacity: 0.6, y: 0 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 1.7, duration: animDuration * 0.5 }}
          >
            <line x1="280" y1="170" x2="720" y2="170" stroke="#102B49" strokeWidth="0.9" />
            <line x1="280" y1="164" x2="280" y2="176" stroke="#102B49" strokeWidth="0.9" />
            <line x1="720" y1="164" x2="720" y2="176" stroke="#102B49" strokeWidth="0.9" />
            <text x="475" y="162" fontSize="10" fontFamily="monospace" fill="#102B49" textAnchor="middle" fontWeight="bold">18.40 m</text>
          </motion.g>

          {/* Left Dimension Line */}
          <motion.g
            initial={isIntroActive ? { opacity: 0, x: -5 } : { opacity: 0.6, x: 0 }}
            animate={{ opacity: 0.6, x: 0 }}
            transition={{ delay: 1.8, duration: animDuration * 0.5 }}
          >
            <line x1="230" y1="220" x2="230" y2="520" stroke="#102B49" strokeWidth="0.9" />
            <line x1="224" y1="220" x2="236" y2="220" stroke="#102B49" strokeWidth="0.9" />
            <line x1="224" y1="520" x2="236" y2="520" stroke="#102B49" strokeWidth="0.9" />
            <text x="220" y="375" fontSize="10" fontFamily="monospace" fill="#102B49" textAnchor="end" transform="rotate(-90 220 375)" fontWeight="bold">12.60 m</text>
          </motion.g>

          {/* Room Labels */}
          <motion.g
            initial={isIntroActive ? { opacity: 0 } : { opacity: 0.55 }}
            animate={{ opacity: 0.55 }}
            transition={{ delay: 2.0, duration: animDuration * 0.5 }}
          >
            <text x="590" y="330" fontSize="11" fontFamily="sans-serif" letterSpacing="0.15em" fill="#102B49" textAnchor="middle" fontWeight="bold">SALON & YAŞAM ALANI</text>
            <text x="590" y="348" fontSize="9" fontFamily="monospace" fill="#9A5C2F" textAnchor="middle" fontWeight="bold">+0.00 M / 64.5 m²</text>

            <text x="370" y="270" fontSize="11" fontFamily="sans-serif" letterSpacing="0.15em" fill="#102B49" textAnchor="middle" fontWeight="bold">GİRİŞ / HOLL</text>
            <text x="370" y="286" fontSize="9" fontFamily="monospace" fill="#9A5C2F" textAnchor="middle" fontWeight="bold">18.2 m²</text>

            <text x="640" y="530" fontSize="10" fontFamily="sans-serif" letterSpacing="0.15em" fill="#9A5C2F" textAnchor="middle" fontWeight="bold">TERAS & PEYZAJ</text>
          </motion.g>

          {/* Architectural Title Block (Bottom Right) */}
          <motion.g
            initial={isIntroActive ? { opacity: 0, y: 10 } : { opacity: 0.75, y: 0 }}
            animate={{ opacity: 0.75, y: 0 }}
            transition={{ delay: 2.2, duration: animDuration * 0.6 }}
          >
            <rect x="700" y="570" width="250" height="90" fill="#FBFAF7" stroke="#102B49" strokeWidth="1" />
            <line x1="700" y1="595" x2="950" y2="595" stroke="#102B49" strokeWidth="0.5" />
            <line x1="700" y1="625" x2="950" y2="625" stroke="#102B49" strokeWidth="0.5" />
            <line x1="825" y1="625" x2="825" y2="660" stroke="#102B49" strokeWidth="0.5" />

            <text x="712" y="586" fontSize="10" fontFamily="sans-serif" fontWeight="bold" fill="#102B49" letterSpacing="0.1em">ERDEM DİZAYN & MEKANİK</text>
            <text x="712" y="612" fontSize="9" fontFamily="monospace" fill="#9A5C2F" fontWeight="bold">PROJE: VİLLA ERDEM / TASARIM UYGULAMA</text>

            <text x="712" y="642" fontSize="8" fontFamily="monospace" fill="#102B49">ÖLÇEK: 1:100</text>
            <text x="712" y="653" fontSize="8" fontFamily="monospace" fill="#102B49">TARİH: 2026</text>

            <text x="837" y="642" fontSize="8" fontFamily="monospace" fill="#102B49">PAFTA NO: A-01</text>
            <text x="837" y="653" fontSize="8" fontFamily="monospace" fill="#9A5C2F" fontWeight="bold">REV: 04 (ONAYLI)</text>
          </motion.g>
        </g>
      </svg>
    </div>
  );
};
