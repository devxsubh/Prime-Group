'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CoolMode } from "../ui/cool-mode"
import MorphingText from "../ui/morphing-text"
import ScratchToReveal from "../ui/scratch-to-reveal"


const texts = [
  "MATRIMONY",
  "CONNECT",
  "UNITE",
  "BOND",
  "LOVE",
];

export default function BeverageLanding() {
  return (
    <section className="w-screen relative overflow-hidden bg-white py-16" style={{ backgroundColor: 'var(--pure-white)' }}>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Background Text */}
        <div className="absolute top-[-50px] left-[-20px] text-[150px] md:text-[350px] font-outfit font-black leading-none z-0 opacity-5 select-none pointer-events-none" style={{ color: 'var(--primary-blue)' }}>
          CONNECT
        </div>
        <div className="absolute bottom-[-50px] right-[-20px] text-[150px] md:text-[350px] font-outfit font-black leading-none z-0 opacity-5 select-none pointer-events-none" style={{ color: 'var(--primary-blue)' }}>
          UNITE
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="flex flex-col gap-12 md:gap-20">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              {/* Polaroid 1 */}
              <div className="hidden md:block transform -rotate-12 bg-white p-2 shadow-2xl border-4 border-white rounded-sm">
                <div className="relative w-[300px] h-[300px] grayscale hover:grayscale-0 transition-all duration-1000">
                  <Image
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=600&fit=crop"
                    alt="Happy couple"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              {/* Explore Service Button */}
              <Link href="/discover">
                <Button
                  className="px-8 py-4 rounded-full text-[10px] font-black font-general uppercase tracking-[0.4em] transition-all duration-300 hover:bg-gold-gradient hover:text-[var(--primary-blue)] shadow-xl"
                  style={{ 
                    backgroundColor: 'var(--primary-blue)',
                    color: 'var(--pure-white)'
                  }}
                >
                  EXPLORE PROFILES
                </Button>
              </Link>
            </div>

            {/* Main Title Section */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div className="scale-125 md:scale-[1.8] transform-gpu">
                <MorphingText texts={texts} className="font-outfit font-black text-black tracking-tighter" />
              </div>
              
              <div className="md:hidden transform rotate-3 bg-white p-2 shadow-xl border-4 border-white rounded-sm">
                <div className="relative w-[280px] h-[280px]">
                  <Image
                    src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=500&h=500&fit=crop"
                    alt="Wedding couple"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Middle Branding */}
            <div className="text-center md:pt-10">
              <h2 className="text-4xl md:text-7xl lg:text-8xl font-black font-outfit text-gold-gradient tracking-tighter leading-[0.9]">
                YOUR LIFE<br />PARTNER
              </h2>
            </div>

            {/* Bottom CTA Section */}
            <div className="flex flex-col items-center space-y-8">
              <p className="text-lg md:text-xl text-center max-w-2xl font-general font-medium leading-relaxed opacity-70" style={{ color: 'var(--primary-blue)' }}>
                Connecting Hearts, Building Families — your trusted companion in the journey of finding the perfect match through verified profiles.
              </p>
              
              <CoolMode>
                <Link href="/sign-up">
                  <Button
                    className="px-12 py-8 rounded-full text-xs font-black font-general uppercase tracking-[0.4em] bg-gold-gradient text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(226,194,133,0.3)] transition-all duration-500"
                  >
                    Start Your Journey
                  </Button>
                </Link>
              </CoolMode>
            </div>

            {/* Polaroid 3 */}
            <div className="hidden lg:block absolute bottom-0 -right-20 transform rotate-6 bg-white p-2 shadow-2xl border-4 border-white rounded-sm">
              <div className="relative w-[320px] h-[320px] grayscale hover:grayscale-0 transition-all duration-1000">
                <Image
                  src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=600&fit=crop"
                  alt="Happy married couple"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

