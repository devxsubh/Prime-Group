"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import ProfileCard from "@/components/discover/profile-card";
import type { DiscoverCardData } from "@/lib/discover";

interface FavoritesGridProps {
  profiles: DiscoverCardData[];
}

export default function FavoritesGrid({ profiles }: FavoritesGridProps) {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center py-20"
      >
        <Heart className="h-24 w-24 mx-auto mb-6 opacity-20" style={{ color: "var(--accent-gold)" }} />
        <p className="text-xl font-general" style={{ color: "var(--primary-blue)" }}>
          Explore profiles and click the heart icon to add them to your favorites.
        </p>
        <Link href="/discover" className="inline-block mt-6 text-gold-gradient font-general font-semibold hover:underline">
          Discover profiles
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {profiles.map((profile, index) => (
        <ProfileCard key={profile.id} data={profile} index={index} />
      ))}
    </div>
  );
}
