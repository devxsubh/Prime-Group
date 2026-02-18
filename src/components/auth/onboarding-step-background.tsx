"use client";

import { useAppSelector } from "@/store/hooks";
import { selectStepIndex } from "@/store/slices/profileDraftSlice";
import { motion, AnimatePresence } from "framer-motion";

const STEP_TEXTS: { line1: string; line2: string }[] = [
  { line1: "Meaningful", line2: "Connections" },
  { line1: "Education", line2: "& Work" },
  { line1: "Your", line2: "Gotra" },
  { line1: "Family", line2: "& Heritage" },
  { line1: "Contact", line2: "& Location" },
  { line1: "Looking", line2: "For" },
  { line1: "Share", line2: "Your Story" },
];

export function OnboardingStepBackground() {
  const stepIndex = useAppSelector(selectStepIndex);
  const { line1, line2 } = STEP_TEXTS[Math.min(stepIndex, STEP_TEXTS.length - 1)] ?? STEP_TEXTS[0];

  return (
    <>
      {/* Warm canvas */}
      <div className="absolute inset-0 -z-20 bg-[#E7D9C2]" aria-hidden />

      {/* Two energies meeting — radial gradients (visible but soft) */}
      <div
        className="absolute inset-0 -z-[18] pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(circle at 30% 50%, rgba(20,35,59,0.12) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(20,35,59,0.12) 0%, transparent 50%)
          `,
        }}
      />

      {/* Beautiful Memory — soft silhouettes: rings, heart, mandala glow. Large, visible texture. */}
      <svg
        viewBox="0 0 1600 900"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full -z-[17] pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="60" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
          <filter id="mandala-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="80" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.08  0 0 0 0 0.1  0 0 0 0 0.15  0 0 0 0.5 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
            </feMerge>
          </filter>
        </defs>
        {/* Two abstract rings overlapping */}
        <g filter="url(#soft-blur)" opacity="0.85">
          <circle cx="420" cy="420" r="280" fill="none" stroke="rgba(20,35,59,0.15)" strokeWidth="2" />
          <circle cx="1180" cy="480" r="260" fill="none" stroke="rgba(20,35,59,0.15)" strokeWidth="2" />
        </g>
        {/* Soft heart curve — abstract */}
        <g filter="url(#soft-blur)" opacity="0.75">
          <path
            d="M800 320 C950 200 1200 280 1100 480 C1050 580 800 720 800 720 C800 720 550 580 500 480 C400 280 650 200 800 320 Z"
            fill="none"
            stroke="rgba(20,35,59,0.12)"
            strokeWidth="2"
          />
        </g>
        {/* Blurred mandala glow — center */}
        <g filter="url(#mandala-glow)">
          <circle cx="800" cy="450" r="200" fill="rgba(20,35,59,0.08)" />
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 800 + 120 * Math.cos(a);
            const y1 = 450 + 120 * Math.sin(a);
            const x2 = 800 + 220 * Math.cos(a);
            const y2 = 450 + 220 * Math.sin(a);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(20,35,59,0.1)" strokeWidth="1.5" />
            );
          })}
        </g>
      </svg>

      {/* Animated step-based calligraphy text — "Meaningful Connections", "Education & Work", etc. */}
      <svg
        viewBox="0 0 1600 900"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full -z-[16] pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.g
            key={stepIndex}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <text
              x="180"
              y="480"
              fontFamily="Playfair Display, serif"
              fontSize="220"
              fill="#1E2A44"
              opacity="0.14"
              transform="rotate(-6 180 480)"
              fontWeight="400"
            >
              {line1}
            </text>
            <text
              x="980"
              y="620"
              fontFamily="Playfair Display, serif"
              fontSize="220"
              fill="#1E2A44"
              opacity="0.14"
              transform="rotate(6 980 620)"
              fontWeight="400"
            >
              {line2}
            </text>
          </motion.g>
        </AnimatePresence>
      </svg>
    </>
  );
}
