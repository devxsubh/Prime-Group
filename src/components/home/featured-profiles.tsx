"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useFavorites } from "@/context/favorites-context";
import ProfileCard from "@/components/discover/profile-card";
import type { DiscoverCardData } from "@/lib/discover";

interface FeaturedProfilesProps {
  profiles: DiscoverCardData[];
}

export default function FeaturedProfiles({ profiles }: FeaturedProfilesProps) {
  if (!profiles.length) return null;

  return (
    <section className="relative pt-0 pb-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: "var(--pure-white)" }}>
      <div className="absolute top-2 left-4 sm:top-4 sm:left-6 md:top-6 md:left-12 lg:top-8 lg:left-16 z-10 pointer-events-none" style={{ width: "fit-content", height: "fit-content" }}>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
          <Image src="/img/mandala1.png" alt="" fill className="object-contain" style={{ animation: "spin 20s linear infinite" }} />
        </div>
      </div>
      <div className="absolute top-2 right-4 sm:top-4 sm:right-6 md:top-6 md:right-12 lg:top-8 lg:right-16 z-10 pointer-events-none" style={{ width: "fit-content", height: "fit-content" }}>
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56">
          <Image src="/img/mandala1.png" alt="" fill className="object-contain" style={{ animation: "spin 20s linear infinite" }} />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-20">
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
          <div className="flex justify-center mb-4 pt-4">
            <div className="inline-block px-6 py-2 rounded-full font-general" style={{ backgroundColor: "var(--primary-blue)" }}>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gold-gradient">Featured Profiles</span>
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-playfair-display font-black mb-3 sm:mb-4 text-center text-gold-gradient tracking-tighter px-2" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)" }}>
            Find Your Perfect Match
          </h2>
          <p className="text-base sm:text-lg md:text-xl font-general font-medium max-w-2xl mx-auto text-center px-2" style={{ color: "var(--primary-blue)" }}>
            Discover our handpicked profiles of accomplished individuals looking for their life partner
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {profiles.map((profile, index) => (
            <ProfileCard key={profile.id} data={profile} index={index} />
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="text-center mt-12">
          <Link href="/discover">
            <button className="px-8 py-4 rounded-lg font-general font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 hover:shadow-xl border-2" style={{ borderColor: "var(--primary-blue)", color: "var(--primary-blue)", backgroundColor: "transparent" }}>
              View All Profiles
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
