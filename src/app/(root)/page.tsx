import HeadSection from "@/components/home/head-section";
import BeverageLanding from "@/components/home/products-section";
import GuidedHero from "@/components/home/guided-hero";
import { FeaturedProfilesFromBackend } from "@/components/home/featured-profiles-server";
import SubscriptionPlan from "@/components/home/subscription-plan";
import { LANDING_FEATURED_PROFILES } from "@/data/landing-featured-profiles";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <GuidedHero featuredProfiles={LANDING_FEATURED_PROFILES} />
      <div className="relative">
        <div className="relative z-20 mt-20">
          <Suspense fallback={null}>
            <FeaturedProfilesFromBackend />
          </Suspense>
          <BeverageLanding />
          {/* <FeaturesSection /> */}
          {/* <HeroVideoDialogDemoTopInBottomOut /> */}
          <HeadSection />
          <SubscriptionPlan />
        </div>
      </div>
    </main>
  );
}
