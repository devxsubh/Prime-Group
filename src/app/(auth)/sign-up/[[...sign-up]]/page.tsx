import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";
import { cn } from "@/lib/utils";

export default function SignUpPage() {
  return (
    <div className="absolute inset-0 min-h-screen flex items-center justify-center overflow-y-auto overflow-x-hidden p-0 sm:p-4 md:p-6 lg:p-8">
      {/* White background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Main content container */}
      <div className="relative z-10 w-full max-w-5xl my-auto flex-shrink-0">
        <div
          className="w-full overflow-hidden bg-transparent sm:rounded-3xl sm:border-2 sm:bg-white/95 sm:backdrop-blur-sm sm:shadow-2xl animate-in fade-in zoom-in-95 duration-500"
          style={{ borderColor: "var(--accent-gold)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen sm:min-h-[70vh] md:min-h-[720px]">
            {/* Left side - Creative Doodles */}
            <div 
              className="relative hidden md:block overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(13, 46, 92, 0.03), rgba(198, 167, 94, 0.05))'
              }}
            >
              {/* Logo badge */}
              <div className="absolute top-6 left-6 z-30 rounded-xl bg-white px-4 py-2.5 shadow-md border border-gray-200">
                <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--primary-blue)" }}>
                  PRIME GROUP
                </p>
              </div>

              {/* Creative Doodles Container */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg 
                  viewBox="0 0 400 600" 
                  className="w-full h-full max-w-md"
                  fill="none"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Wedding Rings - Gold */}
                  <g opacity="0.2" stroke="var(--accent-gold)">
                    <circle cx="100" cy="120" r="28" />
                    <circle cx="100" cy="120" r="18" />
                    <circle cx="300" cy="180" r="24" />
                    <circle cx="300" cy="180" r="14" />
                    <circle cx="200" cy="450" r="22" />
                    <circle cx="200" cy="450" r="13" />
                  </g>

                  {/* Hearts - Gold */}
                  <g opacity="0.25" fill="var(--accent-gold)">
                    <path d="M150 80 C150 60, 165 60, 170 70 C175 60, 190 60, 190 80 C190 100, 170 125, 150 145 C130 125, 110 100, 110 80 C110 60, 125 60, 130 70 C135 60, 150 60, 150 80 Z" />
                    <path d="M250 320 C250 305, 260 305, 263 312 C266 305, 276 305, 276 320 C276 335, 263 355, 250 370 C237 355, 224 335, 224 320 C224 305, 234 305, 237 312 C240 305, 250 305, 250 320 Z" />
                  </g>

                  {/* Floral Patterns - Blue */}
                  <g opacity="0.18" stroke="var(--primary-blue)" fill="var(--primary-blue)">
                    {/* Flower 1 */}
                    <circle cx="80" cy="280" r="10" />
                    <path d="M80 280 L80 260 M80 280 L80 300 M80 280 L60 280 M80 280 L100 280" />
                    <path d="M80 280 L68 268 M80 280 L68 292 M80 280 L92 268 M80 280 L92 292" />
                    
                    {/* Flower 2 */}
                    <circle cx="320" cy="380" r="12" />
                    <path d="M320 380 L320 355 M320 380 L320 405 M320 380 L295 380 M320 380 L345 380" />
                    <path d="M320 380 L305 365 M320 380 L305 395 M320 380 L335 365 M320 380 L335 395" />
                    
                    {/* Flower 3 */}
                    <circle cx="180" cy="520" r="9" />
                    <path d="M180 520 L180 505 M180 520 L180 535 M180 520 L165 520 M180 520 L195 520" />
                    <path d="M180 520 L171 511 M180 520 L171 529 M180 520 L189 511 M180 520 L189 529" />
                  </g>

                  {/* Decorative Swirls - Gold */}
                  <g opacity="0.15" stroke="var(--accent-gold)">
                    <path d="M50 200 Q70 180, 90 200 T130 200" />
                    <path d="M270 300 Q290 280, 310 300 T350 300" />
                    <path d="M200 450 Q220 430, 240 450 T280 450" />
                    <path d="M120 550 Q140 530, 160 550" />
                  </g>

                  {/* Abstract Curved Lines - Blue */}
                  <g opacity="0.12" stroke="var(--primary-blue)">
                    <path d="M120 250 Q140 230, 160 250" />
                    <path d="M240 150 Q260 130, 280 150" />
                    <path d="M180 500 Q200 480, 220 500" />
                    <path d="M60 350 Q80 330, 100 350" />
                  </g>

                  {/* Decorative Dots Pattern - Gold */}
                  <g opacity="0.15" fill="var(--accent-gold)">
                    <circle cx="60" cy="450" r="4" />
                    <circle cx="90" cy="470" r="4" />
                    <circle cx="120" cy="450" r="4" />
                    <circle cx="340" cy="500" r="4" />
                    <circle cx="310" cy="520" r="4" />
                    <circle cx="280" cy="500" r="4" />
                    <circle cx="150" cy="200" r="3" />
                    <circle cx="250" cy="100" r="3" />
                  </g>

                  {/* Elegant Curves - Blue */}
                  <g opacity="0.1" stroke="var(--primary-blue)">
                    <path d="M100 500 Q150 480, 200 500" />
                    <path d="M200 100 Q250 80, 300 100" />
                    <path d="M50 400 Q100 380, 150 400" />
                  </g>

                  {/* Decorative Leaves - Gold */}
                  <g opacity="0.2" stroke="var(--accent-gold)" fill="none">
                    <path d="M350 250 Q340 240, 330 250 Q340 260, 350 250" />
                    <path d="M50 350 Q40 340, 30 350 Q40 360, 50 350" />
                    <path d="M320 550 Q310 540, 300 550 Q310 560, 320 550" />
                  </g>

                  {/* Wavy Lines - Blue */}
                  <g opacity="0.1" stroke="var(--primary-blue)">
                    <path d="M70 400 Q90 390, 110 400 Q90 410, 70 400" />
                    <path d="M290 250 Q310 240, 330 250 Q310 260, 290 250" />
                  </g>
                </svg>
              </div>

              {/* Bottom text overlay */}
              <div className="absolute bottom-8 left-8 right-8 z-30 space-y-2">
                <p className="text-2xl font-general font-bold leading-tight" style={{ color: "var(--primary-blue)" }}>
                  Find your special someone.
                </p>
                <p className="text-sm text-gray-600 font-light leading-relaxed">
                  Build your profile and start discovering compatible matches.
                </p>
              </div>

              {/* Decorative accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent z-30" />
            </div>

            {/* Right side - Form */}
            <div className="p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-center min-h-0 overflow-y-auto bg-gradient-to-br from-white to-gray-50/30">
              <div className="w-full max-w-md mx-auto -mt-8 sm:mt-0">
                {/* Mobile: small brand line (left panel hidden) */}
                <div className="md:hidden mb-5 pb-3 border-b border-gray-200/80 text-center">
                  <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--primary-blue)" }}>
                    PRIME GROUP
                  </p>
                </div>
                <div className="mb-7 sm:mb-8 space-y-3 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                    <p className="text-sm sm:text-sm text-gray-500">
                      Already registered?{" "}
                      <Link
                        href="/sign-in"
                        className={cn(
                          "font-semibold transition-all duration-200 hover:opacity-100 whitespace-nowrap",
                          "relative inline-block after:absolute after:bottom-0 after:left-0",
                          "after:h-[2px] after:w-0 after:bg-[var(--accent-gold)]",
                          "hover:after:w-full after:transition-all after:duration-300"
                        )}
                        style={{ color: "var(--accent-gold)" }}
                      >
                        Login here
                      </Link>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h1 className="text-3xl sm:text-3xl md:text-4xl font-general font-bold tracking-tight" style={{ color: "var(--primary-blue)" }}>
                      Create your account
                    </h1>
                    <p className="text-gray-600 text-base sm:text-base leading-relaxed">
                      India&apos;s trusted matrimony service for meaningful connections.
                    </p>
                  </div>
                </div>

                <AuthForm mode="sign-up" hideTitle submitLabel="Register free" className="max-w-none" />

                <p className="text-center text-sm mt-7 sm:mt-8 text-gray-500">
                  <Link
                    href="/"
                    className="hover:text-[var(--primary-blue)] transition-colors duration-200 underline underline-offset-2"
                  >
                    Back to home
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
