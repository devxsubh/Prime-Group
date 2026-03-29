import Image from "next/image";

export function TrustProofSection() {
  const stats = [
    { label: "Successful Matches", value: "25,000+" },
    { label: "Verified Profiles", value: "10,000+" },
    { label: "Families Guided", value: "50,000+" },
    { label: "Monthly New Stories", value: "100+" },
  ];

  return (
    <div className="w-full bg-[#003366] py-32 px-4 relative overflow-hidden">
      {/* Decorative patterns strictly following footer style */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="dot-pattern-footer" width="60" height="60" patternUnits="userSpaceOnUse">
            <circle cx="30" cy="30" r="1" fill="#E2C285" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern-footer)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <h2 className="font-playfair-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-12 sm:mb-16 md:mb-20 text-center leading-[1.12] sm:leading-[1.1] px-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Proof That <span className="text-gold-gradient bg-clip-text text-transparent italic">True Love</span> <br />Still Exists.
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 w-full mb-24">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center group p-8 border border-white/10 rounded-[2rem] hover:border-[#E2C285]/30 transition-all duration-500">
              <p className="text-[#E2C285] text-2xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 group-hover:scale-110 transition duration-300 tracking-tighter shadow-sm tabular-nums">
                {stat.value}
              </p>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 md:p-20 border border-white/10 w-full max-w-6xl flex items-center gap-12 flex-col md:flex-row relative overflow-hidden group">
            {/* Absolute positioning background glow */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#E2C285]/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="flex -space-x-10 shrink-0">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-20 h-20 rounded-full border-4 border-[#003366] overflow-hidden bg-[#003366] group-hover:z-10 transition-all duration-500 hover:scale-110 shadow-2xl">
                   <div className="w-full h-full bg-gold-gradient shadow-inner opacity-90" />
                </div>
              ))}
            </div>
            <div className="text-center md:text-left relative">
              <p className="text-white text-2xl md:text-3xl font-light leading-relaxed italic animate-in fade-in duration-1000 delay-300">
                &quot;Prime Group isn&apos;t just a platform; it&apos;s a bridge between souls. Each story we share is a testament to our commitment to finding you not just a partner, but a lifelong home.&quot;
              </p>
              <p className="mt-8 text-[#E2C285] font-black text-xs uppercase tracking-[0.5em]">
                — MANAGING DIRECTOR, PRIME GROUP
              </p>
            </div>
        </div>
      </div>
    </div>
  );
}
