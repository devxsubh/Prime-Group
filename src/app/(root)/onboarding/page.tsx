import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/auth/onboarding-wizard";
import { OnboardingStepBackground } from "@/components/auth/onboarding-step-background";

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
    <div className="relative min-h-screen overflow-hidden">
      <OnboardingStepBackground />

      <section className="relative z-0 mx-auto max-w-2xl px-6 py-16 md:py-20">
        <OnboardingWizard userId={user.id} existingProfileId={profile?.id} />
      </section>
    </div>
  );
}
