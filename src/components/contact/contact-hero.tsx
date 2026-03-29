"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const PARTICLE_LAYOUT = Array.from({ length: 12 }, (_, i) => ({
  left: ((i * 43) % 88) + 6,
  top: ((i * 31) % 82) + 9,
  scale: 0.5 + (i % 4) * 0.1,
  duration: 13 + (i % 6),
  delay: (i % 4) * 0.9,
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
            opacity: [0, 0.32, 0],
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

export default function ContactHero() {
  const reduceMotion = useReducedMotion()
  const [particlesOn, setParticlesOn] = useState(false)

  useEffect(() => {
    setParticlesOn(true)
  }, [])

  const showParticles = particlesOn && !reduceMotion
  const instant = { duration: 0 }

  return (
    <section
      className="relative w-full overflow-hidden bg-[#003366] pt-28 pb-14 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20"
      aria-labelledby="contact-hero-heading"
    >
      <HeroParticles visible={showParticles} />
      <div className="absolute top-0 right-0 w-[min(100%,400px)] h-[400px] bg-[#E2C285]/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(100%,300px)] h-[300px] bg-blue-900/20 rounded-full blur-[72px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center lg:text-left">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? instant : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E2C285]/90 font-general mb-4">
            Contact
          </p>
          <h1
            id="contact-hero-heading"
            className="font-outfit font-black text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight"
          >
            Let&apos;s{" "}
            <span className="text-gold-gradient bg-clip-text text-transparent">connect</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg md:text-xl text-white/75 font-general font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Questions about profiles, privacy, or your account? Send us a message—we typically reply
            within one to two business days.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-stretch sm:items-center">
            <Button
              asChild
              className="h-12 sm:h-14 px-8 rounded-2xl bg-gold-gradient text-[#001a33] font-bold shadow-[0_0_24px_rgba(226,194,133,0.25)] hover:shadow-[0_0_32px_rgba(226,194,133,0.38)] border-none hover:scale-[1.02] transition-transform"
            >
              <a href="#contact-form" className="inline-flex items-center justify-center gap-2">
                Write to us
                <ArrowDown className="w-5 h-5" aria-hidden />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 sm:h-14 px-8 rounded-2xl border-2 border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/faqs" className="inline-flex items-center justify-center gap-2">
                <HelpCircle className="w-5 h-5" aria-hidden />
                Browse FAQs
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
