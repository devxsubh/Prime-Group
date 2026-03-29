"use client";

import Link from "next/link";
import { useMemo } from "react";
import ProfileCard from "@/components/discover/profile-card";
import type { DiscoverCardData } from "@/lib/discover";

interface DiscoverGridProps {
  profiles: DiscoverCardData[];
  /** Hero / URL filter: city slug (e.g. delhi) matched against profile location text */
  initialCity?: string;
  initialReligion?: string;
  initialIntent?: string;
}

const CITY_KEYWORDS: Record<string, string[]> = {
  delhi: ["delhi", "new delhi", "ncr", "gurgaon", "noida"],
  mumbai: ["mumbai", "bombay"],
  bangalore: ["bangalore", "bengaluru"],
};

function profileMatchesCity(profile: DiscoverCardData, citySlug: string): boolean {
  const keys = CITY_KEYWORDS[citySlug.toLowerCase()];
  if (!keys) {
    return profile.location.toLowerCase().includes(citySlug.toLowerCase());
  }
  const loc = profile.location.toLowerCase();
  return keys.some((k) => loc.includes(k));
}

export default function DiscoverGrid({
  profiles,
  initialCity,
  initialReligion,
  initialIntent,
}: DiscoverGridProps) {
  const filtered = useMemo(() => {
    if (!initialCity || initialCity === "any") return profiles;
    return profiles.filter((p) => profileMatchesCity(p, initialCity));
  }, [profiles, initialCity]);

  const hasActiveFilters =
    (initialCity && initialCity !== "any") ||
    (initialReligion && initialReligion !== "any") ||
    (initialIntent && initialIntent !== "any");

  const intentLabels: Record<string, string> = {
    casual: "Serious relationship",
    marriage: "Life partner",
    friendship: "Companion",
  };
  const religionLabels: Record<string, string> = {
    hindu: "Hindu",
    muslim: "Muslim",
    sikh: "Sikh",
    christian: "Christian",
  };

  const labelParts: string[] = [];
  if (initialIntent && initialIntent !== "any") {
    labelParts.push(`Intent: ${intentLabels[initialIntent] ?? initialIntent}`);
  }
  if (initialReligion && initialReligion !== "any") {
    labelParts.push(`Religion: ${religionLabels[initialReligion] ?? initialReligion}`);
  }
  if (initialCity && initialCity !== "any") {
    labelParts.push(`Location: ${initialCity.charAt(0).toUpperCase() + initialCity.slice(1)}`);
  }

  if (!profiles.length) {
    return (
      <div className="text-center py-16" style={{ color: "var(--primary-blue)" }}>
        <p className="text-lg font-montserrat">No profiles to show yet. Check back soon for new matches.</p>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="space-y-6">
        {hasActiveFilters && (
          <p className="text-center text-base font-montserrat" style={{ color: "var(--primary-blue)" }}>
            No profiles match your filters yet. Try browsing all profiles or adjust filters later in your account.
          </p>
        )}
        <div className="flex justify-center">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center px-8 py-4 rounded-lg font-montserrat font-semibold text-sm uppercase tracking-wide border-2 transition-all hover:scale-105"
            style={{ borderColor: "var(--primary-blue)", color: "var(--primary-blue)" }}
          >
            View all profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {hasActiveFilters && labelParts.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2">
          {labelParts.map((label) => (
            <span
              key={label}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-montserrat font-medium uppercase tracking-wide bg-white/80 border"
              style={{ borderColor: "rgba(217, 170, 72, 0.35)", color: "var(--primary-blue)" }}
            >
              {label}
            </span>
          ))}
          <Link
            href="/discover"
            className="inline-flex items-center text-xs font-montserrat underline-offset-4 hover:underline ml-2"
            style={{ color: "var(--primary-blue)" }}
          >
            Clear filters
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {filtered.map((profile, index) => (
          <ProfileCard key={profile.id} data={profile} index={index} />
        ))}
      </div>
    </div>
  );
}
