"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Ruler,
  Heart,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface ProfilePhoto {
  id: string;
  photo_url: string;
  thumbnail_url: string | null;
  display_order: number;
  is_primary: boolean;
  status: string;
}

export interface PartnerPreferences {
  age_min: number | null;
  age_max: number | null;
  additional_notes: string | null;
}

export interface ProfileRecord {
  id: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  marital_status: string | null;
  height_cm: number | null;
  religion: string | null;
  mother_tongue: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  highest_education: string | null;
  college_university?: string | null;
  field_of_study?: string | null;
  occupation: string | null;
  organization: string | null;
  profile_status: string;
  verification_status: string;
  profile_completion_pct: number | null;
  about_me?: string | null;
  show_education?: boolean | null;
  show_occupation?: boolean | null;
  show_family?: boolean | null;
  show_location?: boolean | null;
  father_name?: string | null;
  father_occupation?: string | null;
  mother_name?: string | null;
  mother_occupation?: string | null;
  siblings_count?: number | null;
  family_type?: string | null;
  family_values?: string | null;
  family_status?: string | null;
  [key: string]: unknown;
}

export interface ProfileViewProps {
  profile: ProfileRecord;
  photos: ProfilePhoto[];
  preferences: PartnerPreferences | null;
  isOwnProfile?: boolean;
}

function formatAge(dob: string): number {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const cardStyle = {
  boxShadow: "0 10px 30px rgba(25, 80, 150, 0.08), 0 1px 3px rgba(212, 175, 55, 0.08)",
  border: "1px solid rgba(212, 175, 55, 0.15)",
};

function Section({
  title,
  icon: Icon,
  children,
  visible = true,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  visible?: boolean;
}) {
  if (!visible) return null;
  return (
    <div
      className="rounded-2xl p-6 sm:p-8 transition-shadow hover:shadow-xl"
      style={cardStyle}
    >
      <h3 className="font-playfair-display text-xl font-bold mb-1 flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
        <Icon className="h-5 w-5 flex-shrink-0" style={{ color: "var(--accent-gold)" }} />
        {title}
      </h3>
      <div className="w-12 h-0.5 rounded-full mb-4" style={{ backgroundColor: "var(--accent-gold)" }} />
      <div className="font-montserrat text-sm" style={{ color: "var(--primary-blue)" }}>
        {children}
      </div>
    </div>
  );
}

export function ProfileView({
  profile,
  photos,
  preferences,
  isOwnProfile,
}: ProfileViewProps) {
  const age = formatAge(profile.date_of_birth);
  const location = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");
  const sortedPhotos = [...photos].sort((a, b) => a.display_order - b.display_order);
  const primaryPhoto = sortedPhotos.find((p) => p.is_primary) ?? sortedPhotos[0];
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const displayPhoto = sortedPhotos[selectedPhotoIndex] ?? primaryPhoto ?? sortedPhotos[0];

  const showEducation = isOwnProfile ?? (profile.show_education !== false);
  const showOccupation = isOwnProfile ?? (profile.show_occupation !== false);
  const showFamily = isOwnProfile ?? (profile.show_family !== false);
  const showLocation = isOwnProfile ?? (profile.show_location !== false);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Photo gallery */}
        <div className="lg:col-span-1 space-y-4">
          <div
            className="relative aspect-[3/4] max-w-sm mx-auto rounded-2xl overflow-hidden bg-gray-100"
            style={{ boxShadow: "0 20px 40px rgba(25, 80, 150, 0.12)", border: "1px solid rgba(212, 175, 55, 0.2)" }}
          >
            {displayPhoto?.photo_url ? (
              <Image
                src={displayPhoto.photo_url}
                alt={profile.full_name}
                fill
                className="object-cover"
                unoptimized
                sizes="(max-width: 768px) 100vw, 360px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center font-montserrat text-gray-400">
                No photo
              </div>
            )}
          </div>
          {sortedPhotos.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 justify-center flex-wrap">
              {sortedPhotos.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedPhotoIndex === idx ? "ring-2 ring-offset-2" : "border-gray-200 hover:border-gray-300"
                  }`}
                  style={selectedPhotoIndex === idx ? { borderColor: "var(--accent-gold)", ringColor: "var(--accent-gold)" } : {}}
                >
                  <Image
                    src={p.thumbnail_url || p.photo_url}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="56px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <h1 className="font-playfair-display text-3xl font-bold mb-2" style={{ color: "var(--primary-blue)" }}>
              {profile.full_name}
            </h1>
            <div className="w-12 h-1 rounded-full mb-4" style={{ backgroundColor: "var(--accent-gold)" }} />
            <div className="flex flex-wrap gap-4 font-montserrat text-sm" style={{ color: "var(--primary-blue)" }}>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" style={{ color: "var(--accent-gold)" }} />
                {age} years
              </span>
              {showLocation && location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" style={{ color: "var(--accent-gold)" }} />
                  {location}
                </span>
              )}
            </div>
          </div>

          {profile.about_me && (
            <Section title="About" icon={User} visible>
              <p className="whitespace-pre-wrap opacity-90">{profile.about_me}</p>
            </Section>
          )}

          {showEducation && (profile.highest_education || profile.college_university || profile.field_of_study) && (
            <Section title="Education" icon={GraduationCap} visible>
              <p>
                {[profile.highest_education, profile.college_university, profile.field_of_study].filter(Boolean).join(" · ")}
              </p>
            </Section>
          )}

          {showOccupation && (profile.occupation || profile.organization) && (
            <Section title="Occupation" icon={Briefcase} visible>
              <p>
                {profile.occupation}
                {profile.organization && ` at ${profile.organization}`}
              </p>
            </Section>
          )}

          {(profile.height_cm || profile.marital_status || profile.religion || profile.mother_tongue) && (
            <Section
              title="Details"
              icon={Ruler}
              visible
            >
              <p>
                {[
                  profile.height_cm && `${profile.height_cm} cm`,
                  profile.marital_status,
                  profile.religion,
                  profile.mother_tongue,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </Section>
          )}

          {showFamily &&
            (profile.father_name ||
              profile.mother_name ||
              profile.siblings_count != null ||
              profile.family_type ||
              profile.family_values) && (
              <Section title="Family" icon={Users} visible>
                <div className="space-y-2">
                  {profile.father_name && (
                    <p>Father: {profile.father_name}{profile.father_occupation ? ` · ${profile.father_occupation}` : ""}</p>
                  )}
                  {profile.mother_name && (
                    <p>Mother: {profile.mother_name}{profile.mother_occupation ? ` · ${profile.mother_occupation}` : ""}</p>
                  )}
                  {profile.siblings_count != null && <p>Siblings: {profile.siblings_count}</p>}
                  {(profile.family_type || profile.family_values || profile.family_status) && (
                    <p>
                      {[profile.family_type, profile.family_values, profile.family_status].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </div>
              </Section>
            )}

          {preferences && (preferences.age_min != null || preferences.age_max != null || preferences.additional_notes) && (
            <Section title="Partner preferences" icon={Heart} visible>
              <p>
                {preferences.age_min != null && preferences.age_max != null && (
                  <>Age {preferences.age_min}–{preferences.age_max} years</>
                )}
                {preferences.additional_notes && (
                  <span className="block mt-1 opacity-90">{preferences.additional_notes}</span>
                )}
              </p>
            </Section>
          )}
        </div>
      </div>

      {isOwnProfile && (
        <div
          className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t rounded-2xl px-6 py-4"
          style={{ borderColor: "var(--accent-gold)", ...cardStyle }}
        >
          <div className="flex flex-wrap items-center gap-4 font-montserrat text-sm" style={{ color: "var(--primary-blue)" }}>
            <span>Profile completion: <strong>{profile.profile_completion_pct ?? 0}%</strong></span>
            <span>Status: <strong>{profile.profile_status}</strong></span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/profile/edit">Edit profile</Link>
            </Button>
            <Button asChild size="sm" style={{ backgroundColor: "var(--primary-blue)" }}>
              <Link href="/profile">View as others see</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
