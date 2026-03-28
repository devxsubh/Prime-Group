import Image from "next/image";
import Link from "next/link";

interface SuccessStoryCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    category: string;
    excerpt: string | null;
    cover_image_url: string | null;
  };
  couple_names?: string;
  city?: string;
  journey_type?: string; 
  isVerified?: boolean;
}

export function SuccessStoryCard({ 
  post, 
  couple_names, 
  city, 
  journey_type = "Verified Match", 
  isVerified = true 
}: SuccessStoryCardProps) {
  return (
    <div className="group rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col h-full transform-gpu hover:-translate-y-2">
      <div className="relative aspect-[1.1] overflow-hidden">
        <Image 
          src={post.cover_image_url || "/placeholder.svg"} 
          alt={post.title}
          fill
          className="object-cover group-hover:scale-110 transition duration-1000 ease-out"
        />
        {isVerified && (
          <span className="absolute top-5 left-5 bg-[#003366] text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 uppercase tracking-[0.2em] animate-in slide-in-from-left-4">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#E2C285" className="text-[#E2C285]">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            Verified Match
          </span>
        )}
      </div>

      <div className="p-8 flex flex-col flex-1 relative">
        {/* Subtle background icon for premium feel */}
        <div className="absolute top-8 right-8 text-[#E2C285]/5 scale-[5] pointer-events-none lowercase font-serif italic font-thin select-none">prime</div>
        
        <div className="flex flex-col mb-4">
          <h3 className="font-playfair-display font-bold text-2xl text-[#003366] leading-tight mb-2 group-hover:text-[#E2C285] transition-colors">
            {couple_names || post.title.split("-")[0].trim()}
          </h3>
          <span className="text-[10px] bg-gold-gradient text-white px-3 py-1 rounded-sm w-fit font-black uppercase tracking-[0.2em] shadow-sm">
            {journey_type}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-5 flex items-center gap-2 font-bold uppercase tracking-widest">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E2C285" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#E2C285]">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {city || "Member Story"}
        </p>

        <p className="text-gray-600 mb-8 line-clamp-3 italic leading-relaxed font-light">
          &quot;{post.excerpt || "What started as a simple match turned into a beautiful journey..."}&quot;
        </p>

        <div className="mt-auto">
          <Link 
            href={`/blog/${post.slug}`}
            className="flex items-center text-xs font-black uppercase tracking-[0.3em] text-[#003366] hover:text-[#E2C285] transition group/btn"
          >
            Read Story
            <span className="ml-3 transform group-hover/btn:translate-x-2 transition-transform duration-300 h-[1.5px] w-8 bg-[#E2C285] inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
