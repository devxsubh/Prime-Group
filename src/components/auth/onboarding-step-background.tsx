"use client";

export function OnboardingStepBackground() {
  return (
    <>
      {/* Warm canvas */}
      <div className="absolute inset-0 -z-20 bg-[#E7D9C2]" aria-hidden />

      {/* Two energies meeting — radial gradients */}
      <div
        className="absolute inset-0 -z-[18] pointer-events-none"
        aria-hidden
        style={{
          background: `
            radial-gradient(circle at 30% 50%, rgba(20,35,59,0.06) 0%, transparent 55%),
            radial-gradient(circle at 70% 50%, rgba(20,35,59,0.06) 0%, transparent 55%)
          `,
        }}
      />

      {/* Beautiful Memory — soft silhouettes: rings, heart, mandala glow. Very large, just texture. */}
      <svg
        viewBox="0 0 1600 900"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full -z-[17] pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <filter id="soft-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="80" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
            </feMerge>
          </filter>
          <filter id="mandala-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="120" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.04  0 0 0 0 0.06  0 0 0 0 0.1  0 0 0 0.4 0" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
            </feMerge>
          </filter>
        </defs>
        {/* Two abstract rings overlapping */}
        <g filter="url(#soft-blur)" opacity="0.5">
          <circle cx="420" cy="420" r="280" fill="none" stroke="rgba(20,35,59,0.07)" strokeWidth="1" />
          <circle cx="1180" cy="480" r="260" fill="none" stroke="rgba(20,35,59,0.07)" strokeWidth="1" />
        </g>
        {/* Soft heart curve — abstract */}
        <g filter="url(#soft-blur)" opacity="0.45">
          <path
            d="M800 320 C950 200 1200 280 1100 480 C1050 580 800 720 800 720 C800 720 550 580 500 480 C400 280 650 200 800 320 Z"
            fill="none"
            stroke="rgba(20,35,59,0.05)"
            strokeWidth="1"
          />
        </g>
        {/* Blurred mandala glow — center */}
        <g filter="url(#mandala-glow)">
          <circle cx="800" cy="450" r="200" fill="rgba(20,35,59,0.03)" />
          {[...Array(12)].map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            const x1 = 800 + 120 * Math.cos(a);
            const y1 = 450 + 120 * Math.sin(a);
            const x2 = 800 + 220 * Math.cos(a);
            const y2 = 450 + 220 * Math.sin(a);
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(20,35,59,0.04)" strokeWidth="1" />
            );
          })}
        </g>
      </svg>
    </>
  );
}
