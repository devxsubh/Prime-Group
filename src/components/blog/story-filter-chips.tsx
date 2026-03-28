"use client";

import { useSearchParams, useRouter } from "next/navigation";

export function StoryFilterChips() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentCategory = searchParams.get("category");

  if (currentCategory !== "Success Stories") return null;

  const filters = [
    { label: "Arranged Match", value: "arranged" },
    { label: "Long Distance", value: "long-distance" },
    { label: "Inter-caste", value: "inter-caste" },
    { label: "Same City", value: "same-city" },
  ];

  const currentFilter = searchParams.get("type");

  const toggleFilter = (val: string) => {
    const params = new URLSearchParams(searchParams);
    if (currentFilter === val) {
      params.delete("type");
    } else {
      params.set("type", val);
    }
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-wrap justify-center gap-3 mb-10 px-4">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => toggleFilter(f.value)}
          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] transition-all duration-300 border ${
            currentFilter === f.value
              ? "bg-[#14233B] text-white border-[#14233B] shadow-md scale-105"
              : "bg-white text-[#14233B]/60 border-gray-100 hover:border-[#D4AF37]/50"
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
