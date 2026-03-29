"use client"

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Users,
  Lock,
  ArrowRight,
  Heart,
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { DiscoverCardData } from "@/lib/discover"

/** Deterministic particle layout — avoids hydration mismatch vs Math.random() */
const PARTICLE_LAYOUT = Array.from({ length: 20 }, (_, i) => ({
  left: ((i * 47) % 92) + 4,
  top: ((i * 31) % 88) + 6,
  scale: 0.55 + (i % 6) * 0.08,
  duration: 12 + (i % 9),
  delay: (i % 6) * 0.9,
}))

export type HeroDeckProfile = {
  id?: string
  name: string
  age: number
  location: string
  profession: string
  image: string
  match: number
  tags: string[]
}

const FALLBACK_DECK: HeroDeckProfile[] = [
  {
    name: "Riya",
    age: 26,
    location: "Delhi",
    profession: "Fashion Designer",
    image: "/couples/image6.png",
    match: 92,
    tags: ["Verified Profile", "Family Conscious"],
  },
  {
    name: "Arjun",
    age: 29,
    location: "Mumbai",
    profession: "Software Architect",
    image: "/couples/image4.png",
    match: 88,
    tags: ["Aadhaar Verified", "Modern Values"],
  },
  {
    name: "Sanya",
    age: 25,
    location: "Bangalore",
    profession: "Marketing Lead",
    image: "/couples/image.png",
    match: 95,
    tags: ["Verified Profile", "Career Focused"],
  },
]

function mapDiscoverToDeck(p: DiscoverCardData): HeroDeckProfile {
  const match =
    85 + (p.id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 11)
  return {
    id: p.id,
    name: p.name,
    age: p.age || 0,
    location: p.location,
    profession: p.profession,
    image: p.imageUrl,
    match,
    tags: ["Verified Profile", "Active on Prime"],
  }
}

function GoldParticles({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {PARTICLE_LAYOUT.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-[#E2C285] rounded-full opacity-30 shadow-[0_0_8px_#E2C285]"
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          initial={{ scale: p.scale }}
          animate={{
            y: ["0%", "-120%", "120%"],
            opacity: [0, 0.4, 0],
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

function ProfileMatchCard({
  profile,
  className,
  interactive,
  imagePriority,
}: {
  profile: HeroDeckProfile
  className?: string
  interactive?: boolean
  imagePriority?: boolean
}) {
  const viewHref = profile.id ? `/discover/${profile.id}` : "/discover"
  const photoAlt = `Profile photo, ${profile.name}, ${profile.age}, ${profile.location}`

  return (
    <div className={className}>
      <div className="relative h-[240px] sm:h-[260px] overflow-hidden rounded-[2rem]">
        <Image
          src={profile.image}
          alt={photoAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 90vw, 340px"
          priority={imagePriority}
        />
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-black text-[#003366] border border-[#E2C285]/20 shadow-md">
          MATCH {profile.match}%
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="p-5 sm:p-6 space-y-3 font-general">
        <div className="flex justify-between items-end gap-2">
          <div className="space-y-0.5 min-w-0">
            <h3 className="text-xl sm:text-2xl font-outfit font-black text-[#003366] tracking-tight truncate">
              {profile.name}, {profile.age}
            </h3>
            <p className="text-[9px] sm:text-[10px] text-[#003366]/50 uppercase tracking-[0.18em] font-black line-clamp-2">
              {profile.location} • {profile.profession}
            </p>
          </div>
          <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#E2C285]/10 flex items-center justify-center border border-[#E2C285]/20">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#E2C285] fill-[#E2C285]" />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-[#003366]/5 rounded-full text-[8px] font-black text-[#003366]/60 uppercase tracking-widest border border-[#003366]/10"
            >
              {tag}
            </span>
          ))}
        </div>
        {interactive !== false ? (
          <Link href={viewHref} className="block pt-1 font-general">
            <Button
              variant="outline"
              className="w-full border-[#003366]/10 text-[#003366] font-black rounded-xl hover:bg-[#003366] hover:text-white transition-all uppercase text-[10px] tracking-widest py-6"
            >
              View Profile
            </Button>
          </Link>
        ) : (
          <div className="pt-1 min-h-[52px]" aria-hidden />
        )}
      </div>
    </div>
  )
}

interface GuidedHeroProps {
  featuredProfiles?: DiscoverCardData[]
}

const GuidedHero = ({ featuredProfiles }: GuidedHeroProps) => {
  const router = useRouter()
  const reduceMotion = useReducedMotion()
  const [particlesOn, setParticlesOn] = useState(false)
  const [intent, setIntent] = useState("any")
  const [religion, setReligion] = useState("any")
  const [city, setCity] = useState("any")
  const [profileIndex, setProfileIndex] = useState(0)
  const [deckPaused, setDeckPaused] = useState(false)
  const deckRef = useRef<HTMLDivElement>(null)

  const deckProfiles = useMemo(() => {
    if (featuredProfiles?.length) {
      return featuredProfiles.slice(0, 6).map(mapDiscoverToDeck)
    }
    return FALLBACK_DECK
  }, [featuredProfiles])

  const n = deckProfiles.length
  const current = deckProfiles[profileIndex % n]

  useEffect(() => {
    setParticlesOn(true)
  }, [])

  const goNext = useCallback(() => {
    setProfileIndex((prev) => (prev + 1) % n)
  }, [n])

  const goPrev = useCallback(() => {
    setProfileIndex((prev) => (prev - 1 + n) % n)
  }, [n])

  useEffect(() => {
    if (reduceMotion || deckPaused || n < 2) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [reduceMotion, deckPaused, n, goNext])

  useEffect(() => {
    const el = deckRef.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault()
        goNext()
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault()
        goPrev()
      }
    }
    el.addEventListener("keydown", onKey)
    return () => el.removeEventListener("keydown", onKey)
  }, [goNext, goPrev])

  const handleFindMatches = () => {
    const q = new URLSearchParams()
    if (intent && intent !== "any") q.set("intent", intent)
    if (religion && religion !== "any") q.set("religion", religion)
    if (city && city !== "any") q.set("city", city)
    const qs = q.toString()
    router.push(qs ? `/discover?${qs}` : "/discover")
  }

  const showParticles = particlesOn && !reduceMotion
  const spring = { type: "spring" as const, stiffness: 280, damping: 32 }
  const instant = { duration: 0 }

  return (
    <section className="relative min-h-[90vh] w-full bg-[#003366] flex items-center pt-24 pb-20 overflow-hidden">
      <GoldParticles visible={showParticles} />

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E2C285]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? instant : { duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-outfit font-black text-white leading-[0.9] tracking-tighter">
                Where Families Connect, <br />
                <span className="text-gold-gradient bg-clip-text text-transparent">Stories Begin.</span>
              </h1>
              <p className="text-xl text-white/70 font-general font-medium max-w-lg leading-relaxed mt-6">
                Let’s find someone meant for you. A journey of trust, tradition, and meaningful beginnings.
              </p>
              <p className="text-sm text-white/55 font-general max-w-lg leading-relaxed border-l-2 border-[#E2C285]/50 pl-4">
                Trusted by families across India. Profiles are identity-verified — your privacy and safety come first.
              </p>
            </motion.div>

            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={reduceMotion ? instant : { delay: 0.3, duration: 0.8 }}
              className="bg-[#1a3a5a]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[#E2C285]/20 shadow-2xl relative group"
            >
              <div className="absolute -top-3 left-8 bg-[#E2C285] text-[#003366] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg font-general">
                Start Your Journey
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-general">
                <div className="space-y-2">
                  <label
                    htmlFor="hero-intent"
                    className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest"
                  >
                    Looking for
                  </label>
                  <Select value={intent} onValueChange={setIntent}>
                    <SelectTrigger
                      id="hero-intent"
                      className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]"
                    >
                      <SelectValue placeholder="Any preference" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="any">Any preference</SelectItem>
                      <SelectItem value="casual">Serious Relationship</SelectItem>
                      <SelectItem value="marriage">Life Partner</SelectItem>
                      <SelectItem value="friendship">Companion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="hero-religion"
                    className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest"
                  >
                    Religion
                  </label>
                  <Select value={religion} onValueChange={setReligion}>
                    <SelectTrigger
                      id="hero-religion"
                      className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]"
                    >
                      <SelectValue placeholder="Any religion" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="any">Any religion</SelectItem>
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="hero-city"
                    className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest"
                  >
                    Location
                  </label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger
                      id="hero-city"
                      className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]"
                    >
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="any">Any location</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Button
                  type="button"
                  onClick={handleFindMatches}
                  className="w-full h-16 bg-gold-gradient hover:scale-[1.02] text-[#001a33] rounded-[1.5rem] font-bold text-lg shadow-[0_0_30px_rgba(226,194,133,0.2)] hover:shadow-[0_0_40px_rgba(226,194,133,0.4)] transition-all duration-300 group border-none"
                >
                  Find Matches <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-center sm:text-left">
                  <Link
                    href="/sign-up"
                    className="text-sm text-white/60 hover:text-white font-general underline-offset-4 hover:underline"
                  >
                    New here? Create a free account
                  </Link>
                  <Link
                    href="/discover"
                    className="text-sm text-white/60 hover:text-white font-general underline-offset-4 hover:underline"
                  >
                    Browse all profiles
                  </Link>
                </div>
              </div>
            </motion.div>

            <div className="flex flex-wrap gap-8 items-center pt-4 font-general">
              <div className="flex items-center space-x-2 text-white/50">
                <CheckCircle2 className="w-5 h-5 text-[#E2C285]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Aadhaar Verified</span>
              </div>
              <div className="flex items-center space-x-2 text-white/50">
                <Users className="w-5 h-5 text-[#E2C285]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Family Approved</span>
              </div>
              <div className="flex items-center space-x-2 text-white/50">
                <Lock className="w-5 h-5 text-[#E2C285]" />
                <span className="text-[10px] font-black uppercase tracking-widest">Privacy-First</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[520px] lg:min-h-[600px] flex items-center justify-center py-8">
            <div className="absolute inset-0 opacity-20 pointer-events-none grayscale brightness-50 mix-blend-screen overflow-hidden rounded-[3rem] lg:rounded-[4rem]">
              <Image
                src="/couples/image.png"
                alt=""
                fill
                className="object-cover scale-110 blur-[4px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div
              ref={deckRef}
              tabIndex={0}
              role="region"
              aria-roledescription="carousel"
              aria-label="Featured profile highlights. Use arrow keys to change profile."
              className="relative z-20 w-full max-w-[min(100%,340px)] mx-auto min-h-[560px] flex flex-col items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#003366] rounded-3xl"
              onMouseEnter={() => setDeckPaused(true)}
              onMouseLeave={() => setDeckPaused(false)}
              onFocusCapture={() => setDeckPaused(true)}
              onBlurCapture={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDeckPaused(false)
              }}
            >
              <span className="sr-only" aria-live="polite">
                {`Profile ${profileIndex + 1} of ${n}: ${current.name}, ${current.age}, ${current.location}`}
              </span>

              <div className="relative w-full h-[min(580px,calc(100vh-12rem))] max-h-[620px]">
                {n > 1 &&
                  [2, 1].map((slot) => {
                    const depth = slot as 1 | 2
                    const profile = deckProfiles[(profileIndex + depth) % n]
                    return (
                      <motion.div
                        key={`deck-slot-${depth}`}
                        className="absolute inset-x-0 top-0 origin-bottom"
                        initial={false}
                        animate={{
                          y: depth * 16,
                          scale: 1 - depth * 0.04,
                          rotate: reduceMotion ? 0 : depth * 2,
                          opacity: 1 - depth * 0.2,
                        }}
                        transition={reduceMotion ? instant : { type: "spring", stiffness: 260, damping: 28 }}
                        style={{
                          zIndex: 3 - depth,
                          filter: reduceMotion
                            ? "none"
                            : depth === 2
                              ? "saturate(0.92) blur(0.8px)"
                              : "saturate(0.96) blur(0.4px)",
                        }}
                      >
                        <motion.div
                          key={`${profileIndex}-${depth}-${profile.id ?? profile.name}`}
                          initial={{ opacity: reduceMotion ? 1 : 0.65 }}
                          animate={{ opacity: 1 }}
                          transition={reduceMotion ? instant : { duration: 0.4 }}
                          className="w-full rounded-[2.5rem] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.2)] p-1 border border-white/90 bg-white/[0.97] pointer-events-none"
                        >
                          <ProfileMatchCard profile={profile} interactive={false} />
                        </motion.div>
                      </motion.div>
                    )
                  })}

                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={`${profileIndex}-${current.id ?? current.name}`}
                    initial={
                      reduceMotion
                        ? { opacity: 1, x: 0, rotate: 0, scale: 1 }
                        : { opacity: 0, x: 72, rotate: 8, scale: 0.94 }
                    }
                    animate={{
                      opacity: 1,
                      x: 0,
                      rotate: reduceMotion ? 0 : -1.5,
                      scale: 1,
                      y: 0,
                    }}
                    exit={
                      reduceMotion
                        ? { opacity: 0, transition: { duration: 0.2 } }
                        : {
                            opacity: 0,
                            x: -100,
                            rotate: -10,
                            scale: 0.92,
                            transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] },
                          }
                    }
                    transition={reduceMotion ? instant : spring}
                    className="absolute inset-x-0 top-0 origin-bottom"
                    style={{ zIndex: 20 }}
                  >
                    <div className="w-full rounded-[2.5rem] overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-1 border border-white bg-white ring-1 ring-black/[0.04]">
                      <ProfileMatchCard profile={current} imagePriority />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {n > 1 && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    aria-label="Previous profile"
                    onClick={goPrev}
                    className="rounded-full p-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285]"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2" role="tablist" aria-label="Profile slides">
                    {deckProfiles.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === profileIndex % n}
                        aria-label={`Show profile ${i + 1}`}
                        onClick={() => setProfileIndex(i)}
                        className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285] ${
                          i === profileIndex % n ? "w-8 bg-[#E2C285]" : "w-2 bg-white/30 hover:bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Next profile"
                    onClick={goNext}
                    className="rounded-full p-2.5 bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2C285]"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {reduceMotion ? (
              <div className="absolute top-10 left-10 p-4 rounded-2xl bg-[#E2C285]/10 backdrop-blur-md border border-[#E2C285]/30 z-30">
                <Star className="w-8 h-8 text-[#E2C285] fill-[#E2C285]" />
              </div>
            ) : (
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 left-10 p-4 rounded-2xl bg-[#E2C285]/10 backdrop-blur-md border border-[#E2C285]/30 z-30"
                aria-hidden
              >
                <Star className="w-8 h-8 text-[#E2C285] fill-[#E2C285]" />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GuidedHero
