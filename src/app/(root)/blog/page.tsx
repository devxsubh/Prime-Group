import Image from "next/image";
import Link from "next/link";
import { BlogCategoryTabs } from "@/components/blog/blog-category-tabs";
import { BlogNewsletterForm } from "@/components/blog/blog-newsletter-form";

const PARCHMENT = "#F4EBDC";
const CARD_CREAM = "#FBF7EF";
const NAVY_DARK = "#14233B";
const GOLD = "var(--accent-gold)";
const PRIMARY_BLUE = "var(--primary-blue)";

const COUPLES = [
  { src: "/couples/image1.png", alt: "Featured couple", category: "Success Story", title: "A Journey of Trust and Tradition", excerpt: "How two families came together through Prime Group, building a bond that goes beyond matchmaking." },
  { src: "/couples/image2.png", alt: "Couple story", category: "Success Story", title: "From First Message to Forever", excerpt: "Their story began with a simple introduction and grew into a lifelong partnership." },
  { src: "/couples/image3.png", alt: "Couple story", category: "Wedding Advice", title: "Planning Your Big Day Together", excerpt: "Essential guidance for couples preparing for their wedding with grace and intention." },
  { src: "/couples/image4.png", alt: "Couple story", category: "Relationship Guidance", title: "Building a Strong Foundation", excerpt: "Expert insights on nurturing understanding and respect in your relationship." },
  { src: "/couples/image5.png", alt: "Couple story", category: "Family Values", title: "When Two Families Become One", excerpt: "Celebrating the coming together of families with shared values and mutual respect." },
];

const ADVICE_CARDS = [
  { title: "First Meeting Tips", excerpt: "How to make your first meeting meaningful and comfortable for both families." },
  { title: "Conversations That Matter", excerpt: "Topics that help you understand compatibility and shared vision." },
  { title: "Honouring Traditions", excerpt: "Ways to respect and blend traditions in your journey together." },
];

function OrnamentDivider() {
  return (
    <div className="flex items-center justify-center gap-4 py-8" aria-hidden>
      <span className="h-px flex-1 max-w-[120px] opacity-40" style={{ backgroundColor: PRIMARY_BLUE }} />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="opacity-50" style={{ color: GOLD }}>
        <circle cx="12" cy="12" r="2" fill="currentColor" />
        <path d="M12 4v2M12 18v2M4 12h2M18 12h2M6.34 6.34l1.42 1.42M16.24 16.24l1.42 1.42M6.34 17.66l1.42-1.42M16.24 7.76l1.42-1.42" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
      </svg>
      <span className="h-px flex-1 max-w-[120px] opacity-40" style={{ backgroundColor: PRIMARY_BLUE }} />
    </div>
  );
}

export default function BlogPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: PARCHMENT,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E\")",
      }}
    >
      {/* 1. Hero Journal Header */}
      <header className="text-center pt-[120px] pb-20 px-4">
        <h1 className="font-playfair-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight" style={{ color: PRIMARY_BLUE }}>
          The Prime Journal
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-600 font-medium tracking-[0.08em] uppercase">
          Stories. Guidance. Meaningful Beginnings.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
          <span className="h-px w-16 sm:w-24 opacity-60" style={{ backgroundColor: GOLD }} />
          <span className="text-sm opacity-70" style={{ color: GOLD }}>❦</span>
          <span className="h-px w-16 sm:w-24 opacity-60" style={{ backgroundColor: GOLD }} />
        </div>
      </header>

      {/* 2. Featured Hero Couple (large cinematic) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div
          className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px]"
          style={{ backgroundColor: "rgba(20,35,59,0.03)" }}
        >
          <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
            <Image
              src={COUPLES[0].src}
              alt={COUPLES[0].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
              {COUPLES[0].category}
            </span>
            <h2 className="font-playfair-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: PRIMARY_BLUE }}>
              {COUPLES[0].title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
              {COUPLES[0].excerpt}
            </p>
            <Link
              href="#"
              className="inline-flex items-center gap-2 font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
              style={{ color: GOLD }}
            >
              Read Full Story →
            </Link>
          </div>
        </div>
      </section>

      <OrnamentDivider />

      {/* 3. Category filter + 4 supporting couples (2x2) */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <BlogCategoryTabs />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-[40px] mt-12">
          {COUPLES.slice(1, 5).map((couple, i) => (
            <Link
              key={i}
              href="#"
              className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{
                backgroundColor: CARD_CREAM,
                borderTop: "3px solid var(--accent-gold)",
                boxShadow: "0 4px 20px rgba(20,35,59,0.06)",
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={couple.src}
                  alt={couple.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                  {couple.category}
                </span>
                <h3 className="font-playfair-display text-xl font-bold mt-2 mb-2 group-hover:underline decoration-2 underline-offset-2" style={{ color: PRIMARY_BLUE, textDecorationColor: "var(--accent-gold)" }}>
                  {couple.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{couple.excerpt}</p>
                <span className="inline-block mt-3 text-sm font-medium" style={{ color: GOLD }}>
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link
            href="#"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm border-2 transition-all hover:opacity-90"
            style={{ borderColor: GOLD, color: PRIMARY_BLUE }}
          >
            View More Stories
          </Link>
        </div>
      </section>

      {/* 4. Success Story Strip */}
      <section
        className="w-full py-20 px-4 text-center"
        style={{ backgroundColor: NAVY_DARK }}
      >
        <p className="font-playfair-display text-2xl sm:text-3xl md:text-4xl font-bold max-w-3xl mx-auto leading-snug" style={{ color: "#F4EBDC" }}>
          Where Meaningful Connections Become Lifelong Journeys.
        </p>
        <Link
          href="#"
          className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: GOLD, color: NAVY_DARK }}
        >
          Read Success Stories
        </Link>
      </section>

      {/* 5. Advice Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="font-playfair-display text-3xl sm:text-4xl font-bold text-center mb-4" style={{ color: PRIMARY_BLUE }}>
          Guidance for Meaningful Beginnings
        </h2>
        <OrnamentDivider />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {ADVICE_CARDS.map((card, i) => (
            <article
              key={i}
              className="rounded-xl p-6 transition-shadow hover:shadow-md"
              style={{
                backgroundColor: CARD_CREAM,
                borderTop: "3px solid var(--accent-gold)",
              }}
            >
              <h3 className="font-playfair-display text-lg font-bold mb-2" style={{ color: PRIMARY_BLUE }}>
                {card.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{card.excerpt}</p>
              <Link href="#" className="inline-block mt-3 text-sm font-medium" style={{ color: GOLD }}>
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* 6. Newsletter CTA */}
      <section
        className="w-full max-w-2xl mx-auto px-4 py-20"
        style={{ backgroundColor: "rgba(20,35,59,0.04)" }}
      >
        <div className="text-center">
          <h2 className="font-playfair-display text-2xl sm:text-3xl font-bold mb-2" style={{ color: PRIMARY_BLUE }}>
            Stay Connected With Prime Stories
          </h2>
          <p className="text-gray-600 text-sm mb-8">
            Receive thoughtful guidance and stories in your inbox.
          </p>
          <BlogNewsletterForm />
        </div>
      </section>
    </div>
  );
}
