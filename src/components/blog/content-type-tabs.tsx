"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Sparkles, Heart, Lightbulb, Brain, Users } from "lucide-react";

export function ContentTypeTabs() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const categories = [
    { name: "All", icon: Sparkles },
    { name: "Success Stories", icon: Heart },
    { name: "Wedding Advice", icon: Lightbulb },
    { name: "Relationship Guidance", icon: Brain },
    { name: "Family & Values", icon: Users },
  ];

  return (
    <div className="w-full flex flex-wrap justify-center gap-6 py-16 px-4">
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isActive = currentCategory === cat.name;
        
        return (
          <Link
            key={cat.name}
            href={cat.name === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat.name)}`}
            className={`flex items-center gap-4 px-8 py-3.5 rounded-full font-black text-[10px] uppercase tracking-[0.3em] transition-all duration-500 transform hover:-translate-y-2 shadow-sm ${
              isActive
                ? "bg-[#003366] text-white border-2 border-[#E2C285] shadow-2xl scale-110"
                : "bg-white text-[#003366] border-2 border-gray-100 hover:border-[#E2C285] hover:text-[#E2C285]"
            }`}
          >
            <Icon size={16} strokeWidth={3} className={isActive ? "text-[#E2C285]" : "text-[#003366] group-hover:text-[#E2C285]"} />
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
}
