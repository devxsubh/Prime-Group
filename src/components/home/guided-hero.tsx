"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ShieldCheck, 
  Users, 
  Lock, 
  ArrowRight, 
  Heart, 
  Star,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

const PROFILES = [
    {
        name: "Riya",
        age: 26,
        location: "Delhi",
        profession: "Fashion Designer",
        image: "/couples/image6.png",
        match: 92,
        tags: ["Verified Profile", "Family Conscious"]
    },
    {
        name: "Arjun",
        age: 29,
        location: "Mumbai",
        profession: "Software Architect",
        image: "/couples/image4.png",
        match: 88,
        tags: ["Aadhaar Verified", "Modern Values"]
    },
    {
        name: "Sanya",
        age: 25,
        location: "Bangalore",
        profession: "Marketing Lead",
        image: "/couples/image.png",
        match: 95,
        tags: ["Verified Profile", "Career Focused"]
    }
]

// --- Background Particles ---
const GoldParticles = () => {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#E2C285] rounded-full opacity-30 shadow-[0_0_8px_#E2C285]"
                    initial={{ 
                        x: Math.random() * 100 + "%", 
                        y: Math.random() * 100 + "%",
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: [null, "-10%", "110%"],
                        opacity: [0, 0.4, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5
                    }}
                />
            ))}
        </div>
    )
}

const GuidedHero = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [profileIndex, setProfileIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
        setProfileIndex((prev) => (prev + 1) % PROFILES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const currentProfile = PROFILES[profileIndex]

  return (
    <section className="relative min-h-[90vh] w-full bg-[#003366] flex items-center pt-24 pb-20 overflow-hidden">
      <GoldParticles />

      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E2C285]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Emotional Content & DestinyInput */}
          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl lg:text-9xl font-outfit font-black text-white leading-[0.9] tracking-tighter">
                Where Families Connect, <br />
                <span className="text-gold-gradient bg-clip-text text-transparent">Stories Begin.</span>
              </h1>
              <p className="text-xl text-white/70 font-general font-medium max-w-lg leading-relaxed mt-6">
                Let’s find someone meant for you. A journey of trust, tradition, and meaningful beginnings.
              </p>
            </motion.div>

            {/* DestinyInput Component */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="bg-[#1a3a5a]/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-[#E2C285]/20 shadow-2xl relative group"
            >
              <div className="absolute -top-3 left-8 bg-[#E2C285] text-[#003366] px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg font-general">
                Start Your Journey
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-general">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest">Looking for</label>
                  <Select>
                    <SelectTrigger className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]">
                      <SelectValue placeholder="Serious Relationship" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="casual">Serious Relationship</SelectItem>
                      <SelectItem value="marriage">Life Partner</SelectItem>
                      <SelectItem value="friendship">Companion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest">Religion</label>
                  <Select>
                    <SelectTrigger className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]">
                      <SelectValue placeholder="Any Religion" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="hindu">Hindu</SelectItem>
                      <SelectItem value="muslim">Muslim</SelectItem>
                      <SelectItem value="sikh">Sikh</SelectItem>
                      <SelectItem value="christian">Christian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-2 tracking-widest">Location</label>
                  <Select>
                    <SelectTrigger className="bg-[#002244] border-none text-white h-14 rounded-2xl focus:ring-[#E2C285]">
                      <SelectValue placeholder="Current Location" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B1C2C] border-white/10 text-white">
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Link href="/sign-up" className="block mt-6">
                <Button className="w-full h-16 bg-gold-gradient hover:scale-[1.02] text-[#001a33] rounded-[1.5rem] font-bold text-lg shadow-[0_0_30px_rgba(226,194,133,0.2)] hover:shadow-[0_0_40px_rgba(226,194,133,0.4)] transition-all duration-300 group border-none">
                  Find Matches <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Layer */}
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

          {/* Right: Live Match Preview & Minimal Imagery */}
          <div className="relative h-[600px] flex items-center justify-center">
            
            {/* Minimal Background Couple Image (Not overpowering) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none grayscale brightness-50 mix-blend-screen overflow-hidden rounded-[4rem]">
                <Image 
                    src="/couples/image.png" 
                    alt="Background Couple" 
                    fill 
                    className="object-cover scale-110 blur-[4px]"
                />
            </div>

            {/* Enhanced Match Carousel Staked Deck */}
            <div className="relative z-20 w-[340px] h-[550px] flex flex-col items-center justify-start pt-10">
                <AnimatePresence mode="popLayout" initial={false}>
                    {[2, 1, 0].map((offset) => {
                        const index = (profileIndex + offset) % PROFILES.length;
                        const profile = PROFILES[index];
                        const isTop = offset === 0;

                        return (
                            <motion.div 
                                key={index}
                                initial={isTop ? { opacity: 0, x: 150, rotate: 15, scale: 0.8 } : { opacity: 0, scale: 0.7, y: 100 }}
                                animate={{ 
                                    opacity: 1 - offset * 0.25,
                                    scale: 1 - offset * 0.08,
                                    y: offset * 45, // More peak-out
                                    x: 0,
                                    rotate: isTop ? -2 : offset * 2, // Slight fanning
                                    zIndex: 10 - offset,
                                }}
                                exit={{ 
                                    opacity: 0, 
                                    x: -250, 
                                    rotate: -25,
                                    scale: 0.7,
                                    transition: { duration: 0.5, ease: "easeInOut" } 
                                }}
                                transition={{ 
                                    type: "spring",
                                    stiffness: 120,
                                    damping: 30,
                                    duration: 0.8
                                }}
                                className="absolute top-0 w-full bg-white rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-1 border border-white"
                                style={{ 
                                    filter: offset > 0 ? `blur(${offset * 1}px)` : 'none',
                                    pointerEvents: isTop ? 'auto' : 'none',
                                    transformOrigin: "bottom center"
                                }}
                            >
                                <div className="relative h-[260px] rounded-[2rem] overflow-hidden">
                                    <Image 
                                        src={profile.image} 
                                        alt={profile.name} 
                                        fill 
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-[#003366] border border-[#E2C285]/20 shadow-md">
                                        MATCH {profile.match}%
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                                
                                <div className="p-6 space-y-4 font-general">
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-outfit font-black text-[#003366] tracking-tight">{profile.name}, {profile.age}</h3>
                                            <p className="text-[10px] text-[#003366]/50 uppercase tracking-[0.2em] font-black">{profile.location} • {profile.profession}</p>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-[#E2C285]/10 flex items-center justify-center border border-[#E2C285]/20">
                                            <Heart className="w-5 h-5 text-[#E2C285] fill-[#E2C285]" />
                                        </div>
                                    </div>
                                    
                                    <div className="flex space-x-2 font-general">
                                        {profile.tags.slice(0, 2).map((tag) => (
                                            <div key={tag} className="px-3 py-1 bg-[#003366]/5 rounded-full text-[8px] font-black text-[#003366]/60 uppercase tracking-widest border border-[#003366]/10">{tag}</div>
                                        ))}
                                    </div>

                                    <Link href="/discover" className="block pt-2 font-general">
                                        <Button variant="outline" className="w-full border-[#003366]/10 text-[#003366] font-black rounded-xl hover:bg-[#003366] hover:text-white transition-all uppercase text-[10px] tracking-widest py-6">
                                            View Profile
                                        </Button>
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Decorative Floating Icon (Star/Destiny) */}
            <motion.div 
               animate={{ 
                 y: [0, -15, 0],
                 rotate: [0, 10, 0]
               }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute top-10 left-10 p-4 rounded-2xl bg-[#E2C285]/10 backdrop-blur-md border border-[#E2C285]/30 z-30"
            >
                <Star className="w-8 h-8 text-[#E2C285] fill-[#E2C285]" />
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  )
}

export default GuidedHero;
