"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { MessageCircle, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

interface FaqHeroProps {
  searchValue: string
  onSearchChange: (value: string) => void
  visibleCount: number
  totalCount: number
}

export default function FaqHero({
  searchValue,
  onSearchChange,
  visibleCount,
  totalCount,
}: FaqHeroProps) {
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
      aria-labelledby="faq-hero-heading"
    >
      <HeroParticles visible={showParticles} />
      <div className="absolute top-0 right-0 w-[min(100%,400px)] h-[400px] bg-[#E2C285]/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[min(100%,300px)] h-[300px] bg-blue-900/20 rounded-full blur-[72px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? instant : { duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.35em] text-[#E2C285]/90 font-general mb-4">
            Help center
          </p>
          <h1
            id="faq-hero-heading"
            className="font-playfair-display font-black text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] sm:leading-[1.05] tracking-tight"
          >
            Questions{" "}
            <span className="text-gold-gradient bg-clip-text text-transparent">&amp; answers</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-white/75 font-general font-medium max-w-2xl mx-auto leading-relaxed">
            Find quick answers about profiles, privacy, and how Prime Group Matrimony works. Search
            below or browse every topic.
          </p>

          <div className="mt-10 max-w-xl mx-auto">
            <label htmlFor="faq-search" className="sr-only">
              Search frequently asked questions
            </label>
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 pointer-events-none"
                aria-hidden
              />
              <Input
                id="faq-search"
                type="search"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search questions…"
                autoComplete="off"
                className="h-14 pl-12 pr-4 rounded-2xl border-2 border-white/15 bg-[#002244]/80 text-white placeholder:text-white/40 focus-visible:ring-[#E2C285] focus-visible:ring-offset-0 focus-visible:border-[#E2C285]/50"
              />
            </div>
            <p className="mt-3 text-xs text-white/50 font-general" aria-live="polite">
              {searchValue.trim()
                ? `${visibleCount} of ${totalCount} questions match`
                : `${totalCount} questions`}
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
            <Button
              asChild
              variant="outline"
              className="h-12 px-6 rounded-xl border-2 border-white/25 bg-white/5 text-white font-semibold backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact-us" className="inline-flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" aria-hidden />
                Contact support
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
