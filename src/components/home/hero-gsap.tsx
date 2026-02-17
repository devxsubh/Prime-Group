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

      {/* Content */}
      <div className="relative z-20 h-full flex items-center pt-8 md:pt-12">
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 xl:gap-16">
            {/* Left Section - Heading and CTA */}
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

            {/* Right Section - Search Form */}
            <div className="w-full lg:justify-self-end lg:self-end lg:pb-8 xl:pb-12 2xl:pb-16">
              <div
                className="w-full max-w-md rounded-2xl p-8 space-y-6 border shadow-2xl backdrop-blur-md"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(8, 22, 52, 0.88) 0%, rgba(16, 38, 78, 0.78) 55%, rgba(8, 22, 52, 0.9) 100%)",
                  borderColor: "rgba(226, 194, 133, 0.35)",
                }}
              >
                <div className="rounded-xl bg-black/15 p-4 border border-white/10">
                  <h3 className="font-playfair text-2xl font-bold text-gold-gradient mb-1">
                    Start Searching
                  </h3>
                  <p className="font-montserrat text-sm text-white/60">Find your ideal partner in seconds</p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-widest text-white/70 font-montserrat font-semibold">I Am</label>
                      <select className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white font-montserrat outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8">
                        <option className="bg-slate-900 text-white">Male</option>
                        <option className="bg-slate-900 text-white">Female</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-widest text-white/70 font-montserrat font-semibold">Looking For</label>
                      <select className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white font-montserrat outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8">
                        <option className="bg-slate-900 text-white">Bride</option>
                        <option className="bg-slate-900 text-white">Groom</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-widest text-white/70 font-montserrat font-semibold">Age From</label>
                      <select className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white font-montserrat outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8">
                        <option className="bg-slate-900 text-white">18</option>
                        <option className="bg-slate-900 text-white">21</option>
                        <option className="bg-slate-900 text-white">24</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-widest text-white/70 font-montserrat font-semibold">Age To</label>
                      <select className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white font-montserrat outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/50 transition-all duration-200 backdrop-blur-sm hover:bg-white/8">
                        <option className="bg-slate-900 text-white">30</option>
                        <option className="bg-slate-900 text-white">35</option>
                        <option className="bg-slate-900 text-white">40</option>
                      </select>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gold-gradient text-black font-montserrat font-semibold py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 border-none">
                  Search Profiles
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroGsap
