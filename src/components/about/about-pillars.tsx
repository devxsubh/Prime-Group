import Link from "next/link"
import { Target, ShieldCheck, Mail } from "lucide-react"

const pillars = [
  {
    id: "mission" as const,
    icon: Target,
    title: "Our mission",
    blurb:
      "Trusted connections through verified profiles, privacy you control, and a professional experience.",
    href: "#mission",
  },
  {
    id: "trust" as const,
    icon: ShieldCheck,
    title: "Trust & safety",
    blurb:
      "Verification, consent-based contact, and clear guidelines—so you can focus on what matters.",
    href: "#trust",
  },
  {
    id: "contact" as const,
    icon: Mail,
    title: "Get in touch",
    blurb: "Questions about services or the platform—we are here to help.",
    href: "/contact-us",
    external: true as const,
  },
]

export default function AboutPillars() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
      {pillars.map(({ id, icon: Icon, title, blurb, href, external }) => (
        <article
          key={id}
          className="relative rounded-3xl border bg-white p-6 lg:p-8 shadow-sm transition-shadow hover:shadow-md"
          style={{ borderColor: "rgba(217, 170, 72, 0.22)" }}
        >
          <div
            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0, 51, 102, 0.06)" }}
          >
            <Icon className="h-6 w-6" style={{ color: "var(--accent-gold)" }} aria-hidden />
          </div>
          <h3 className="font-playfair-display text-lg sm:text-xl font-bold tracking-tight mb-2" style={{ color: "var(--primary-blue)" }}>
            {title}
          </h3>
          <p className="font-general text-sm font-medium leading-relaxed mb-4" style={{ color: "var(--primary-blue)", opacity: 0.82 }}>
            {blurb}
          </p>
          {external ? (
            <Link
              href={href}
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest font-general hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              Contact page
              <span className="sr-only"> — {title}</span>
            </Link>
          ) : (
            <a
              href={href}
              className="inline-flex items-center text-xs font-bold uppercase tracking-widest font-general hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              Read more
              <span className="sr-only"> — {title}</span>
            </a>
          )}
        </article>
      ))}
    </div>
  )
}
