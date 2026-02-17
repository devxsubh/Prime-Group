"use client";

import { motion } from "framer-motion";
import ProfileCard from "@/components/discover/profile-card";
import type { DiscoverCardData } from "@/lib/discover";

interface DiscoverGridProps {
  profiles: DiscoverCardData[];
}

export default function DiscoverGrid({ profiles }: DiscoverGridProps) {
  if (!profiles.length) {
    return (
      <div className="text-center py-16" style={{ color: "var(--primary-blue)" }}>
        <p className="text-lg font-montserrat">No profiles to show yet. Check back soon for new matches.</p>
      </div>
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
