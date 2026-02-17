import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/auth/onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/onboarding");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, profile_status, profile_completion_pct")
    .eq("user_id", user.id)
    .single();

  const isProfileCompleted =
    profile &&
    (profile.profile_status === "active" || (profile.profile_completion_pct ?? 0) >= 75);
  if (isProfileCompleted) {
    redirect("/discover");
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "var(--pure-white)" }}
    >
      <div className="container mx-auto max-w-2xl">
        <OnboardingWizard userId={user.id} existingProfileId={profile?.id} />
      </div>
    </div>
  );
}
