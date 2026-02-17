import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { EditProfileForm } from "@/components/profile/edit-profile-form";
import { ArrowLeft } from "lucide-react";

export default async function ProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/profile/edit");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    return (
      <div className="min-h-screen py-16 px-4" style={{ backgroundColor: "var(--pure-white)" }}>
        <div className="container mx-auto max-w-2xl text-center">
          <h1 className="font-playfair-display text-2xl font-bold mb-4" style={{ color: "var(--primary-blue)" }}>
            No profile yet
          </h1>
          <p className="font-montserrat mb-6" style={{ color: "var(--primary-blue)" }}>
            Complete onboarding first to create your profile.
          </p>
          <Button asChild style={{ backgroundColor: "var(--primary-blue)" }}>
            <Link href="/onboarding">Go to onboarding</Link>
          </Button>
        </div>
      </div>
    );
  }

  const { data: photos } = await supabase
    .from("profile_photos")
    .select("id, photo_url, thumbnail_url, display_order, is_primary, status")
    .eq("profile_id", profile.id)
    .order("display_order", { ascending: true });

  const { data: preferences } = await supabase
    .from("partner_preferences")
    .select("age_min, age_max, additional_notes")
    .eq("profile_id", profile.id)
    .single();

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: "var(--pure-white)" }}>
      <div className="container mx-auto max-w-3xl">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/profile">
              <ArrowLeft className="h-4 w-4" />
              Back to profile
            </Link>
          </Button>
        </div>
        <h1 className="font-playfair-display text-3xl font-bold mb-2" style={{ color: "var(--primary-blue)" }}>
          Edit profile
        </h1>
        <p className="font-montserrat text-sm mb-8" style={{ color: "var(--primary-blue)" }}>
          Update your details, photos, and preferences.
        </p>
        <EditProfileForm
          profile={profile}
          photos={photos ?? []}
          preferences={preferences ?? null}
          userId={user.id}
        />
      </div>
    </div>
  );
}
