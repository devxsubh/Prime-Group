import Image from "next/image";
import Link from "next/link";

interface CarouselStory {
  id: string;
  names: string;
  quote: string;
  image: string;
  city: string;
}

export function StoryCarousel() {
  const stories: CarouselStory[] = [
    { id: "1", names: "Aarav & Meera", quote: "We found each other here and it was the best decision of our lives.", image: "/placeholder.svg", city: "Delhi" },
    { id: "2", names: "Rohit & Sneha", quote: "The guidance and support from Prime Group made our journey effortless.", image: "/placeholder.svg", city: "Mumbai" },
    { id: "3", names: "Arjun & Priya", quote: "A platform that truly understands cultural values and personal preferences.", image: "/placeholder.svg", city: "Bangalore" },
  ];

  return (
    <section className="w-full py-32 px-4 bg-white overflow-hidden border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-20">
          <div className="flex-1">
             <span className="text-[#E2C285] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block animate-pulse">Testimonials</span>
             <h2 className="font-playfair-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#003366] leading-tight max-w-2xl">What Our Couples Say</h2>
          </div>
          <div className="hidden md:flex gap-4">
            <button className="w-14 h-14 rounded-full border-2 border-[#E2C285]/30 flex items-center justify-center hover:bg-[#003366] hover:text-white hover:border-[#003366] transition-all duration-300 transform hover:scale-110 active:scale-90group">
               <span className="text-[#003366] group-hover:text-white text-lg">←</span>
            </button>
            <button className="w-14 h-14 rounded-full border-2 border-[#E2C285]/30 flex items-center justify-center hover:bg-[#003366] hover:text-white hover:border-[#003366] transition-all duration-300 transform hover:scale-110 active:scale-90 group">
               <span className="text-[#003366] group-hover:text-white text-lg">→</span>
            </button>
          </div>
        </div>

        <div className="flex gap-10 overflow-x-auto pb-12 snap-x no-scrollbar scroll-smooth">
          {stories.map((story) => (
            <div key={story.id} className="min-w-[min(100%,320px)] sm:min-w-[350px] md:min-w-[500px] bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] sm:rounded-[3rem] snap-center flex flex-col justify-between border-2 border-gray-50 shadow-2xl hover:shadow-[#003366]/5 transition-all duration-500 relative group overflow-hidden">
               {/* Pattern Overlay */}
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#E2C285]/5 rounded-tl-full pointer-events-none transform translate-x-10 translate-y-10 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <div className="text-[#E2C285] text-6xl font-serif h-12 mb-4">&quot;</div>
                <p className="text-[#003366] text-xl md:text-2xl font-light italic mb-12 italic leading-relaxed">
                  {story.quote}
                </p>
              </div>

              <div className="flex items-center gap-6 relative z-10 pt-8 border-t border-gray-100">
                <div className="w-16 h-16 rounded-full border-4 border-[#E2C285]/20 overflow-hidden bg-gray-200 shadow-xl group-hover:scale-110 transition duration-500">
                   <div className="w-full h-full bg-gold-gradient" />
                </div>
                <div>
                  <p className="font-bold text-lg text-[#003366] mb-1">{story.names}</p>
                  <p className="text-[10px] text-[#E2C285] font-black uppercase tracking-[0.3em] font-sans">{story.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
