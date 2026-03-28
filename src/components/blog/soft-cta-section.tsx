import Link from "next/link";

export function SoftCTASection() {
  return (
    <section className="w-full py-40 px-4 bg-[#003366] relative overflow-hidden text-white">
      {/* Decorative patterns strictly following footer style */}
      <div className="absolute top-0 right-0 w-full h-full opacity-5 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="soft-cta-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
            <text x="40" y="40" fill="#E2C285" fontSize="10" opacity="0.3" fontStyle="italic">PRIME</text>
          </pattern>
          <rect width="100%" height="100%" fill="url(#soft-cta-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        <h2 className="font-playfair-display text-5xl md:text-8xl font-black mb-12 animate-in slide-in-from-bottom-6 duration-1000">
           Ready to <span className="text-gold-gradient bg-clip-text text-transparent">Find Your Story?</span>
        </h2>
        <p className="text-2xl text-white/70 max-w-3xl mx-auto mb-20 font-light leading-relaxed">
          The journey of a thousand miles begins with a single match. Don&apos;t leave your happiness to chance when you can find it with Prime Group.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
          <Link 
            href="/onboarding"
            className="w-full sm:w-auto px-16 py-7 bg-gold-gradient text-[#003366] rounded-full font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-[#E2C285]/20 group"
          >
            Create Your Profile
            <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">✨</span>
          </Link>
          <Link 
            href="/discover"
            className="w-full sm:w-auto px-16 py-7 border-2 border-[#E2C285] text-white rounded-full font-black text-xl hover:bg-[#E2C285]/10 transition-all group"
          >
            Browse matches
            <span className="ml-4 group-hover:translate-x-2 transition-transform inline-block">🔍</span>
          </Link>
        </div>

        <div className="mt-20 flex flex-col items-center gap-6">
          <p className="text-[10px] text-white/50 uppercase tracking-[0.5em] font-black">
            Trusted by 50,000+ happy families.
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="#E2C285" className="text-[#E2C285]">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
