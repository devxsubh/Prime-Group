import Image from "next/image";
import Link from "next/link";
import { BlogCategoryTabs } from "@/components/blog/blog-category-tabs";
import { BlogNewsletterForm } from "@/components/blog/blog-newsletter-form";
import { getPublishedBlogs } from "@/lib/blogs";

const PARCHMENT = "#F4EBDC";
const CARD_CREAM = "#FBF7EF";
const NAVY_DARK = "#14233B";
const GOLD = "var(--accent-gold)";
const PRIMARY_BLUE = "var(--primary-blue)";

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPublishedBlogs({
    category: category && category !== "All" ? category : undefined,
    limit: 20,
  });
  const featured = posts[0];
  const rest = posts.slice(1, 5);
  const hasMore = posts.length > 5;

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: PARCHMENT,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E\")",
      }}
    >
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

      {featured && (
        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div
            className="rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[400px]"
            style={{ backgroundColor: "rgba(20,35,59,0.03)" }}
          >
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[420px]">
              <Image
                src={featured.cover_image_url || "/placeholder.svg"}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-12">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase mb-3" style={{ color: GOLD }}>
                {featured.category}
              </span>
              <h2 className="font-playfair-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: PRIMARY_BLUE }}>
                {featured.title}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6 max-w-lg">
                {featured.excerpt || ""}
              </p>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 font-medium text-sm tracking-wide hover:opacity-90 transition-colors"
                style={{ color: GOLD }}
              >
                Read Full Story →
              </Link>
            </div>
          </div>
        </section>
      )}

      <OrnamentDivider />

      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <BlogCategoryTabs currentCategory={category ?? "All"} />
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <p>No posts yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-[40px] mt-12">
              {rest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    backgroundColor: CARD_CREAM,
                    borderTop: "3px solid var(--accent-gold)",
                    boxShadow: "0 4px 20px rgba(20,35,59,0.06)",
                  }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.cover_image_url || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold tracking-[0.15em] uppercase" style={{ color: GOLD }}>
                      {post.category}
                    </span>
                    <h3 className="font-playfair-display text-xl font-bold mt-2 mb-2 group-hover:underline decoration-2 underline-offset-2" style={{ color: PRIMARY_BLUE, textDecorationColor: "var(--accent-gold)" }}>
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{post.excerpt || ""}</p>
                    <span className="inline-block mt-3 text-sm font-medium" style={{ color: GOLD }}>
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-14">
                <Link
                  href={category ? `/blog?category=${encodeURIComponent(category)}` : "/blog"}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full font-medium text-sm border-2 transition-all hover:opacity-90"
                  style={{ borderColor: GOLD, color: PRIMARY_BLUE }}
                >
                  View More Stories
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="w-full py-20 px-4 text-center" style={{ backgroundColor: NAVY_DARK }}>
        <p className="font-playfair-display text-2xl sm:text-3xl md:text-4xl font-bold max-w-3xl mx-auto leading-snug" style={{ color: "#F4EBDC" }}>
          Where Meaningful Connections Become Lifelong Journeys.
        </p>
        <Link
          href="/blog"
          className="inline-block mt-8 px-8 py-3 rounded-full font-semibold text-sm transition-all hover:opacity-90"
          style={{ backgroundColor: GOLD, color: NAVY_DARK }}
        >
          Read Success Stories
        </Link>
      </section>

      <section className="w-full max-w-2xl mx-auto px-4 py-20" style={{ backgroundColor: "rgba(20,35,59,0.04)" }}>
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
