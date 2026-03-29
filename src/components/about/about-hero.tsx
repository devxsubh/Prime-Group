"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const PARTICLE_LAYOUT = Array.from({ length: 14 }, (_, i) => ({
  left: ((i * 41) % 90) + 5,
  top: ((i * 29) % 85) + 8,
  scale: 0.5 + (i % 5) * 0.09,
  duration: 14 + (i % 7),
  delay: (i % 5) * 0.85,
}))

function HeroParticles({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {PARTICLE_LAYOUT.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 rounded-full bg-[#E2C285] opacity-25 shadow-[0_0_6px_#E2C285]"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          initial={{ scale: p.scale }}
          animate={{
            y: ["0%", "-100%", "100%"],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  )
}

export default function AboutHero() {
  const reduceMotion = useReducedMotion()
  const [particlesOn, setParticlesOn] = useState(false)

  useEffect(() => {
    setParticlesOn(true)
  }, [])

  const showParticles = particlesOn && !reduceMotion
  const instant = { duration: 0 }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#003366] pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-36 lg:pb-24"
      aria-labelledby="about-hero-heading"
    >
      <HeroParticles visible={showParticles} />
      <div className="absolute top-0 right-0 w-[min(100%,420px)] h-[420px] bg-[#E2C285]/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(100%,320px)] h-[320px] bg-blue-900/20 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? instant : { duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="text-center md:text-left"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E2C285]/90 font-general mb-4">
            Our story
          </p>
          <h1
            id="about-hero-heading"
            className="font-playfair-display font-black text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] sm:leading-[1.05] tracking-tight"
          >
            About{" "}
            <span className="text-gold-gradient bg-clip-text text-transparent">
              Prime Group
            </span>
            <br className="hidden sm:block" />
            <span className="sm:ml-2">Matrimony</span>
          </h1>
          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-white/75 font-general font-medium max-w-2xl md:mx-0 mx-auto leading-relaxed">
            Where traditional values meet a secure, modern experience—so
            families and individuals can connect with confidence.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start items-stretch sm:items-center">
            <Button
              asChild
              className="h-12 sm:h-14 px-8 rounded-2xl bg-gold-gradient text-[#001a33] font-bold text-sm sm:text-base shadow-[0_0_24px_rgba(226,194,133,0.25)] hover:shadow-[0_0_32px_rgba(226,194,133,0.35)] border-none hover:scale-[1.02] transition-transform"
            >
              <Link href="/discover" className="inline-flex items-center justify-center gap-2">
                Browse profiles
                <ArrowRight className="w-5 h-5" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 sm:h-14 px-8 rounded-2xl border-2 border-white/25 bg-white/5 text-white text-sm sm:text-base font-semibold backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact-us" className="inline-flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" aria-hidden />
                Contact us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
