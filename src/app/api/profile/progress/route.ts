import { NextResponse } from "next/server";
import { requireUserWithBasicProfile } from "@/lib/api-require-basic-profile";

type ProgressStepKey =
  | "basic_info"
  | "education_work"
  | "gotra"
  | "family"
  | "contact_location"
  | "partner_preferences"
  | "photos";

function hasText(v: unknown): boolean {
  return typeof v === "string" && v.trim().length > 0;
}

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export async function GET() {
  try {
    const gate = await requireUserWithBasicProfile();
    if (!gate.ok) return gate.response;
    const { user, supabase } = gate;

    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select(
        "id, user_id, full_name, gender, date_of_birth, country, city, contact_number, height_cm, highest_education, organization, occupation, father_name, mother_name, gotra, profile_completion_pct"
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }
    if (!profile?.id) {
      return NextResponse.json({
        percent: 0,
        steps: {
          basic_info: false,
          education_work: false,
          gotra: false,
          family: false,
          contact_location: false,
          partner_preferences: false,
          photos: false,
        } satisfies Record<ProgressStepKey, boolean>,
      });
    }

    const [{ data: prefs }, { data: photos }] = await Promise.all([
      supabase
        .from("partner_preferences")
        .select("id, age_min, age_max, additional_notes")
        .eq("profile_id", profile.id)
        .maybeSingle(),
      supabase
        .from("profile_photos")
        .select("id")
        .eq("profile_id", profile.id)
        .limit(1),
    ]);

    const steps: Record<ProgressStepKey, boolean> = {
      basic_info: hasText(profile.full_name) && hasText(profile.gender) && hasText(profile.date_of_birth),
      education_work: Boolean(
        hasText(profile.highest_education) ||
          hasText(profile.organization) ||
          hasText(profile.occupation) ||
          typeof profile.height_cm === "number"
      ),
      gotra: hasText(profile.gotra),
      family: Boolean(hasText(profile.father_name) || hasText(profile.mother_name)),
      contact_location: hasText(profile.country) && hasText(profile.city) && hasText(profile.contact_number),
      partner_preferences: Boolean(prefs?.id),
      photos: Boolean(photos && photos.length > 0),
    };

    const total = Object.keys(steps).length;
    const completed = Object.values(steps).filter(Boolean).length;
    const percent = clampPct((completed / total) * 100);

    // Keep DB field in sync so server-rendered pages remain consistent.
    if ((profile.profile_completion_pct ?? null) !== percent) {
      await supabase
        .from("profiles")
        .update({ profile_completion_pct: percent, updated_at: new Date().toISOString() })
        .eq("id", profile.id)
        .eq("user_id", user.id);
    }

    return NextResponse.json({ percent, steps });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
