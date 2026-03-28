import Image from "next/image";
import { getDiscoverProfiles } from "@/lib/discover";
import DiscoverGrid from "@/components/discover/discover-grid";

export default async function DiscoverPage() {
  const profiles = await getDiscoverProfiles();

  return (
    <>
      <div
        className="relative w-screen
  h-[55vh] sm:h-[45vh]
  min-h-[420px] sm:min-h-[380px]
  max-h-[560px] sm:max-h-[480px]
  overflow-hidden"
      >
        <Image
          src="/img/banner1.webp"
          alt="Discover Your Perfect Match"
          fill
          priority
          className="
    object-cover
    scale-105 sm:scale-100
  "
          sizes="100vw"
        />
        <div
          className="absolute inset-0 z-[1]
  bg-gradient-to-r
  from-[#0a1930]/45 sm:from-[#0a1930]/55
  via-[#0a1930]/20 sm:via-[#0a1930]/25
  to-transparent"
        />

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 sm:px-10 lg:px-16">
            <div className="max-w-xl">
              <h1
                className="font-playfair-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl
                font-bold leading-tight text-gold-gradient mb-4 mt-20"
              >
                Discover Your Forever
              </h1>
              <p className="font-montserrat text-base sm:text-lg text-white/85 mb-6">
                Handpicked profiles of accomplished individuals, curated for meaningful and lasting relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
      <section
        className="py-20 px-4 sm:px-6 lg:px-8 shadow-lg"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="inline-block mb-4 px-6 py-2 rounded-full"
              style={{ backgroundColor: "var(--primary-blue)" }}
            >
              <span className="text-sm font-montserrat font-semibold uppercase tracking-wide text-gold-gradient">
                Discover Profiles
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-playfair-display font-bold mb-4 text-gold-gradient"
              style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)" }}
            >
              Find Your Perfect Match
            </h2>
            <p className="text-lg sm:text-xl font-montserrat max-w-2xl mx-auto" style={{ color: "var(--primary-blue)" }}>
              Discover our handpicked profiles of accomplished individuals looking for their life partner.
            </p>
          </div>

          <DiscoverGrid profiles={profiles} />
        </div>
      </section>
    </>
  );
}
