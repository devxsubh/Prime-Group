"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const HeroGsap = () => {
  return (
    <div className="relative h-dvh w-screen overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/couples/image.png"
          alt="Premium matchmaking service - find your perfect partner"
          fill
          priority
          className="object-cover md:object-[center_40%] object-[right_center]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(15,25,55,0.88)] via-[rgba(25,40,80,0.75)] to-[rgba(0,0,0,0.4)]" />
      </div>

      {/* Content: single column so hero image stays visible; padded from top for fixed nav */}
      <div className="relative z-20 h-full flex items-center pt-24 md:pt-28">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <div className="max-w-2xl space-y-8">
            <div className="space-y-4">
              <h1 className="font-playfair text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-gold-gradient">
                Find Your Perfect
                <br />
                Match
              </h1>
            </div>

            <p className="font-montserrat text-lg sm:text-xl leading-relaxed text-white/85 max-w-xl font-light">
              Prime Group brings together natural souls creating beautiful, meaningful relationships built on trust and shared values.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/sign-up" className="inline-block">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-montserrat font-semibold rounded-lg bg-gold-gradient text-black shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-none"
                >
                  Join Now
                </Button>
              </Link>
              <Link href="/sign-in" className="inline-block">
                <Button
                  size="lg"
                  className="px-8 py-6 text-base font-montserrat font-semibold rounded-lg border border-white/40 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/discover" className="inline-block">
                <Button
                  size="lg"
                  variant="ghost"
                  className="px-8 py-6 text-base font-montserrat font-semibold rounded-lg text-white/90 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  Search Profiles
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 text-white/70">
              <div className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-white">5K+</span>
                <span className="text-sm font-montserrat">Happy Matches</span>
              </div>
              <div className="w-px h-10 bg-white/20"></div>
              <div className="flex flex-col">
                <span className="font-playfair text-2xl font-bold text-white">98%</span>
                <span className="text-sm font-montserrat">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroGsap
