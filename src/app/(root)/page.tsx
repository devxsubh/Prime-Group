import FeaturedProfiles from "@/components/home/featured-profiles";
import { getDiscoverProfiles } from "@/lib/discover";
import { getFaqs } from "@/lib/faqs";
import FeaturesSection from "@/components/home/features-section";
import HeadSection from "@/components/home/head-section";
import Hero from "@/components/home/hero";
import HeroMeq from "@/components/home/hero-meq";
import BeverageLanding from "@/components/home/products-section";
import ShopSection from "@/components/home/shop-section";
import AnimatedTestimonialsDemo from "@/components/home/testimonials";
import FaqsSection from "@/components/faqs/FaqsSection";
import { Feature6 } from "@/components/home/features";
import { HeroVideoDialogDemoTopInBottomOut } from "@/components/home/video";
import HeroPage from "@/components/home/heropage";
import LoadingOverlay from "@/components/home/loading-overlay";
import HeroGsap from "@/components/home/hero-gsap";
import SubscriptionPlan from "@/components/home/subscription-plan";

export default async function Home() {
  const [featuredProfiles, faqs] = await Promise.all([
    getDiscoverProfiles({ limit: 4 }),
    getFaqs(),
  ]);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <HeroGsap />
      <div className="relative">
        <div className="relative z-20 mt-20">
          <FeaturedProfiles profiles={featuredProfiles} />
        <BeverageLanding />
        {/* <FeaturesSection /> */}
        {/* <HeroVideoDialogDemoTopInBottomOut /> */}
        <HeadSection />
          <SubscriptionPlan />
          <FaqsSection faqs={faqs} />
        </div>
      </div>
    </main>
  );
}
