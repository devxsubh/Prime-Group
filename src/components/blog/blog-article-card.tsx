import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

interface BlogArticleCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    cover_image_url: string | null;
    author_name: string | null;
  };
  readTime?: string;
}

export function BlogArticleCard({ post, readTime = "5 MIN READ" }: BlogArticleCardProps) {
  return (
    <Link 
      href={`/blog/${post.slug}`}
      className="group block relative bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 transform-gpu border border-gray-50"
    >
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Container */}
        <div className="md:w-5/12 relative aspect-[16/10] md:aspect-auto overflow-hidden">
          <Image 
            src={post.cover_image_url || "/placeholder.svg"} 
            alt={post.title}
            fill
            className="object-cover group-hover:scale-110 transition duration-[2000ms] ease-out"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative bg-white">
          {/* Top Meta */}
          <div className="flex items-center justify-between mb-8">
            <span className="text-[#003366] text-[10px] font-black px-4 py-2 border border-[#E2C285]/30 rounded-md tracking-[0.2em] uppercase bg-[#E2C285]/5">
              {post.category?.toUpperCase() || "STORIES"}
            </span>
            <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold tracking-[0.2em] uppercase">
              {readTime}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-playfair-display font-medium text-2xl md:text-3xl text-[#003366] mb-4 group-hover:text-[#E2C285] transition-colors duration-500 leading-tight">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-500 leading-relaxed font-light mb-8 line-clamp-2 text-base italic">
            {post.excerpt}
          </p>

          {/* Footer Info & CTA */}
          <div className="mt-4 flex items-center justify-between pt-6 border-t border-gray-50 uppercase tracking-[0.3em]">
             <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-300 font-black">PRIME</span>
                <span className="text-[9px] text-[#003366] font-black">GROUP</span>
             </div>

             <div className="flex items-center gap-4 text-[#003366] group/read transition-all duration-300">
                <div className="flex flex-col gap-1 items-end">
                   <span className="text-[9px] text-[#E2C285] font-black group-hover:text-[#003366] transition-colors">READ</span>
                   <span className="text-[9px] text-[#E2C285] font-black group-hover:text-[#003366] transition-colors">NOW</span>
                </div>
                <div className="w-8 h-[2px] bg-[#003366] group-hover:w-16 transition-all duration-500 rounded-full" />
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
