import { createClient } from "@/lib/supabase/server";

export interface DiscoverCardData {
  id: string;
  name: string;
  age: number;
  location: string;
  profession: string;
  education: string;
  imageUrl: string;
}

function parseAge(dateOfBirth: string | null): number {
  if (!dateOfBirth) return 0;
  const birth = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function buildLocation(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(", ") || "—";
}

/**
 * Fetches active profiles with primary photo for discover/featured/favorites.
 */
export async function getDiscoverProfiles(options?: { limit?: number; profileIds?: string[] }): Promise<DiscoverCardData[]> {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("id, full_name, date_of_birth, city, state, country, occupation, organization, highest_education, college_university, school, field_of_study")
    .eq("profile_status", "active")
    .eq("is_visible", true)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (options?.profileIds?.length) {
    query = query.in("id", options.profileIds);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data: profiles, error: profilesError } = await query;
  if (profilesError || !profiles?.length) return [];

  const ids = profiles.map((p) => p.id);
  const { data: photos } = await supabase
    .from("profile_photos")
    .select("profile_id, thumbnail_url, photo_url, display_order, is_primary")
    .in("profile_id", ids)
    .order("display_order", { ascending: true });

  const photoByProfileId = new Map<string, string>();
  for (const p of photos ?? []) {
    if (!photoByProfileId.has(p.profile_id)) {
      photoByProfileId.set(p.profile_id, p.thumbnail_url || p.photo_url);
    }
  }

  const result = profiles.map((p) => ({
    id: p.id,
    name: p.full_name ?? "—",
    age: parseAge(p.date_of_birth),
    location: buildLocation([p.city, p.state, p.country]),
    profession: p.occupation ?? (p.organization ? `Working at ${p.organization}` : null) ?? "—",
    education: ([p.highest_education, p.school, p.field_of_study].filter(Boolean).join(" – ") || p.college_university) || "—",
    imageUrl: photoByProfileId.get(p.id) || "/placeholder.svg",
  }));

  if (options?.profileIds?.length) {
    const order = new Map(options.profileIds.map((id, i) => [id, i]));
    result.sort((a, b) => (order.get(a.id) ?? 999) - (order.get(b.id) ?? 999));
  }
  return result;
}
