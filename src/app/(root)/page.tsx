import FeaturedProfiles from "@/components/home/featured-profiles";
import { getDiscoverProfiles } from "@/lib/discover";
import HeadSection from "@/components/home/head-section";
import BeverageLanding from "@/components/home/products-section";
import GuidedHero from "@/components/home/guided-hero";
import SubscriptionPlan from "@/components/home/subscription-plan";

export default async function Home() {
  const [featuredProfiles] = await Promise.all([
    getDiscoverProfiles({ limit: 4 }),
  ]);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <GuidedHero featuredProfiles={featuredProfiles} />
      <div className="relative">
        <div className="relative z-20 mt-20">
          <FeaturedProfiles profiles={featuredProfiles} />
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
