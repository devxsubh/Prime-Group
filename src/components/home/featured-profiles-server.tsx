import FeaturedProfiles from "@/components/home/featured-profiles";
import { getDiscoverProfiles } from "@/lib/discover";

/** Server-only: loads real profiles for the landing “Featured Profiles” section. */
export async function FeaturedProfilesFromBackend() {
  const profiles = await getDiscoverProfiles({ limit: 4 });
  return <FeaturedProfiles profiles={profiles} />;
}
