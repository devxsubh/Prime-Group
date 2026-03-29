import Link from "next/link"
import { Clock, Mail, ShieldCheck, MessageSquare } from "lucide-react"

export default function ContactAside() {
  return (
    <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
      <div>
        <h2 className="font-outfit text-2xl font-bold tracking-tight mb-2" style={{ color: "var(--primary-blue)" }}>
          How we can help
        </h2>
        <p className="font-montserrat text-sm leading-relaxed" style={{ color: "var(--primary-blue)", opacity: 0.78 }}>
          Our team supports members with account questions, safety concerns, and general guidance on using
          Prime Group Matrimony.
        </p>
      </div>

      <ul className="space-y-5">
        <li className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0, 51, 102, 0.06)" }}
          >
            <Mail className="h-5 w-5" style={{ color: "var(--accent-gold)" }} aria-hidden />
          </div>
          <div>
            <p className="font-general text-xs font-black uppercase tracking-widest" style={{ color: "var(--primary-blue)", opacity: 0.55 }}>
              Email
            </p>
            <p className="font-montserrat font-semibold mt-0.5" style={{ color: "var(--primary-blue)" }}>
              Use the form — we&apos;ll respond by email
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0, 51, 102, 0.06)" }}
          >
            <Clock className="h-5 w-5" style={{ color: "var(--accent-gold)" }} aria-hidden />
          </div>
          <div>
            <p className="font-general text-xs font-black uppercase tracking-widest" style={{ color: "var(--primary-blue)", opacity: 0.55 }}>
              Response time
            </p>
            <p className="font-montserrat font-semibold mt-0.5" style={{ color: "var(--primary-blue)" }}>
              Usually within 1–2 business days
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "rgba(0, 51, 102, 0.06)" }}
          >
            <ShieldCheck className="h-5 w-5" style={{ color: "var(--accent-gold)" }} aria-hidden />
          </div>
          <div>
            <p className="font-general text-xs font-black uppercase tracking-widest" style={{ color: "var(--primary-blue)", opacity: 0.55 }}>
              Privacy
            </p>
            <p className="font-montserrat text-sm leading-relaxed mt-0.5" style={{ color: "var(--primary-blue)", opacity: 0.85 }}>
              We handle your details carefully and only use them to respond to your enquiry.
            </p>
          </div>
        </li>
      </ul>

      <div
        className="rounded-3xl border p-6"
        style={{
          borderColor: "rgba(226, 194, 133, 0.35)",
          background: "linear-gradient(145deg, rgba(0, 51, 102, 0.04) 0%, rgba(226, 194, 133, 0.08) 100%)",
        }}
      >
        <div className="flex items-start gap-3">
          <MessageSquare className="h-5 w-5 shrink-0 mt-0.5" style={{ color: "var(--accent-gold)" }} aria-hidden />
          <div>
            <p className="font-outfit font-bold text-sm" style={{ color: "var(--primary-blue)" }}>
              Quick answers
            </p>
            <p className="font-montserrat text-sm mt-1 leading-relaxed" style={{ color: "var(--primary-blue)", opacity: 0.8 }}>
              Many common topics are covered in our help center.
            </p>
            <Link
              href="/faqs"
              className="inline-block mt-3 text-xs font-black uppercase tracking-widest font-general hover:opacity-80"
              style={{ color: "var(--accent-gold)" }}
            >
              View FAQs →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}
