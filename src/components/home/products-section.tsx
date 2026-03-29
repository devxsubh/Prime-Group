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
    <section
      className="relative w-full max-w-[100vw] overflow-x-clip bg-white py-20 md:py-28 lg:py-32"
      style={{ backgroundColor: "var(--pure-white)" }}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10 min-h-0">
        {/* Background watermarks — kept inside section bounds so nothing is clipped */}
        <div className="pointer-events-none absolute inset-0 z-0 select-none" aria-hidden>
          <div
            className="absolute top-2 sm:top-4 md:top-8 left-1 sm:left-2 md:left-4 font-playfair-display font-black leading-[0.85] opacity-[0.06] text-[clamp(3.25rem,14vw,12rem)] sm:text-[clamp(4rem,16vw,14rem)] md:text-[clamp(5rem,18vw,18rem)]"
            style={{ color: "var(--primary-blue)" }}
          >
            CONNECT
          </div>
          <div
            className="absolute bottom-6 sm:bottom-10 md:bottom-14 right-1 sm:right-2 md:right-4 text-right font-playfair-display font-black leading-[0.85] opacity-[0.06] text-[clamp(3.25rem,14vw,12rem)] sm:text-[clamp(4rem,16vw,14rem)] md:text-[clamp(5rem,18vw,18rem)]"
            style={{ color: "var(--primary-blue)" }}
          >
            UNITE
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="flex flex-col gap-12 md:gap-20 lg:gap-24">
            {/* Top Section */}
            <div className="flex justify-between items-start gap-4">
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

            {/* Main Title Section — room for morph + scale so glyphs aren’t clipped */}
            <div className="flex flex-col items-center justify-center space-y-8 py-4 md:py-8 overflow-visible">
              <div className="scale-110 sm:scale-125 md:scale-[1.45] transform-gpu w-full max-w-full flex items-center justify-center min-h-[5.5rem] sm:min-h-[6.5rem] md:min-h-[9rem]">
                <MorphingText
                  texts={texts}
                  className="font-playfair-display font-black text-black tracking-tighter !h-auto min-h-[4.5rem] sm:min-h-28 md:min-h-36 text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
                />
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
            <div className="text-center md:pt-6 px-2">
              <h2 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black font-playfair-display text-gold-gradient tracking-tighter leading-[1.02] sm:leading-[0.98] md:leading-[0.95]">
                YOUR LIFE<br />PARTNER
              </h2>
            </div>

            {/* Bottom CTA Section */}
            <div className="flex flex-col items-center space-y-8">
              <p className="text-base sm:text-lg md:text-xl text-center max-w-2xl font-general font-medium leading-relaxed opacity-70 px-1" style={{ color: 'var(--primary-blue)' }}>
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

            {/* Polaroid 3 — inset so it isn’t cut off by overflow-x-clip */}
            <div className="hidden lg:block absolute bottom-4 right-0 xl:-right-4 transform rotate-6 bg-white p-2 shadow-2xl border-4 border-white rounded-sm z-30">
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

