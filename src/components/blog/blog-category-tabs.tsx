"use client";

import { useState } from "react";

const CATEGORIES = [
  "All",
  "Success Stories",
  "Wedding Advice",
  "Relationship Guidance",
  "Family Values",
] as const;

export function BlogCategoryTabs() {
  const [active, setActive] = useState<string>("All");

  return (
    <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 border-b border-[var(--primary-blue)]/15 pb-4">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => setActive(cat)}
          className="relative pb-1 text-sm font-medium tracking-wide transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-gold)]/50 rounded"
          style={{
            color: active === cat ? "var(--primary-blue)" : "var(--primary-blue)",
            opacity: active === cat ? 1 : 0.7,
          }}
        >
          {cat}
          {active === cat && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
              style={{ backgroundColor: "var(--primary-blue)" }}
            />
          )}
        </button>
      ))}
    </nav>
  );
}
