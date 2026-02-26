"use client";

import Link from "next/link";

const CATEGORIES = [
  "All",
  "Success Story",
  "Wedding Advice",
  "Relationship Guidance",
  "Family Values",
  "Stories",
] as const;

interface BlogCategoryTabsProps {
  currentCategory?: string;
}

export function BlogCategoryTabs({ currentCategory = "All" }: BlogCategoryTabsProps) {
  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 border-b border-[var(--primary-blue)]/15 pb-4">
      {CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat;
        const href = cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`;
        return (
          <Link
            key={cat}
            href={href}
            className="relative pb-1 text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 rounded"
            style={{
              color: "var(--primary-blue)",
              opacity: isActive ? 1 : 0.7,
            }}
          >
            {cat}
            {isActive && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ backgroundColor: "var(--primary-blue)" }}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
