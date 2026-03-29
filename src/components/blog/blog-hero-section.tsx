import Image from "next/image";
import Link from "next/link";

interface BlogHeroSectionProps {
  featuredPost?: {
    title: string;
    excerpt: string | null;
    cover_image_url: string | null;
    slug: string;
    category: string;
  };
}

export function BlogHeroSection({ featuredPost }: BlogHeroSectionProps) {
  if (!featuredPost) return null;

  return (
    <section className="relative w-full pt-28 pb-16 sm:pt-36 sm:pb-20 md:pt-40 md:pb-24 px-4 overflow-hidden bg-white">
      {/* Decorative background elements using strict footer colors */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#003366]/5 -skew-x-12 transform translate-x-20 z-0" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E2C285]/10 rounded-full blur-3xl -translate-x-32 translate-y-32 z-0" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="font-outfit text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-[#003366] mb-5 sm:mb-8 leading-[1.02] sm:leading-[0.95] md:leading-[0.9] tracking-tighter px-1">
            Real Stories. <span className="text-gold-gradient bg-clip-text text-transparent">Real Matches.</span> <br />
            Real Love.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-8 sm:mb-10 font-general font-medium leading-relaxed px-1">
            Discover how thousands of families found their perfect life partners through Prime Group's trusted platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link
              href="#success-stories"
              className="px-10 py-5 bg-[#003366] text-white rounded-full font-general font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-[#003366]/20"
            >
              Browse Success Stories
            </Link>
            <Link
              href="#guidance"
              className="px-10 py-5 border-2 border-[#E2C285] text-[#003366] rounded-full font-general font-black text-xs uppercase tracking-[0.2em] hover:bg-[#E2C285]/10 transition-all"
            >
              Get Relationship Guidance
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-5 py-4 font-general">
            <div className="flex -space-x-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-md">
                  <div className="w-full h-full bg-gold-gradient" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black text-[#003366] uppercase tracking-[0.4em]">
              25,000+ Successful Matches
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[2.5rem] overflow-hidden bg-white shadow-2xl flex flex-col lg:flex-row items-stretch border border-gray-100 group">
          <div className="lg:w-1/2 relative min-h-[500px] overflow-hidden">
            <Image
              src={featuredPost.cover_image_url || "/placeholder.svg"}
              alt={featuredPost.title}
              fill
              className="object-cover group-hover:scale-110 transition duration-1000"
              priority
            />
            <div className="absolute top-8 left-8 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-lg border border-gray-100 animate-pulse">
              <span className="text-[#E2C285] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E2C285]" />
                Featured Story
              </span>
            </div>
          </div>
          <div className="lg:w-1/2 p-6 sm:p-10 md:p-16 lg:p-20 flex flex-col justify-center bg-white relative">
            {/* Corner decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E2C285]/5 rounded-bl-[100%] pointer-events-none" />

            <span className="text-[#E2C285] font-black text-[10px] uppercase tracking-[0.3em] mb-6 font-general">
              {featuredPost.category}
            </span>
            <h2 className="font-playfair-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-[#003366] mb-5 sm:mb-8 leading-tight">
              {featuredPost.title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-10 line-clamp-4 font-general font-normal">
              {featuredPost.excerpt}
            </p>
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="inline-flex items-center text-[#003366] font-black text-[10px] uppercase tracking-[0.3em] group/btn border-b-2 border-[#E2C285] pb-2 w-fit transition-all hover:border-[#003366] font-general"
            >
              Read Their Journey
              <span className="ml-3 transform group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
