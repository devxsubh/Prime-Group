"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * Shown after the user confirms their email via the magic link.
 * We clear the short-lived session from the link so they sign in explicitly with email + password.
 */
export default function EmailVerifiedHiPage() {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      if (!cancelled) setCleared(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
      <div className="fixed inset-0 -z-10 bg-[#faf9f6]" />
      <div
        className="fixed inset-0 -z-[9] opacity-[0.45]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, rgba(198, 167, 94, 0.22), transparent 55%), radial-gradient(ellipse 70% 50% at 85% 75%, rgba(13, 46, 92, 0.12), transparent 50%), radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.9), transparent 70%)",
        }}
      />
      <div
        className="fixed inset-0 -z-[8] opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full border-2 bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm" style={{ borderColor: "rgba(198, 167, 94, 0.45)" }}>
          <Sparkles className="h-4 w-4 mr-2" style={{ color: "var(--accent-gold)" }} aria-hidden />
          <span className="text-xs font-bold tracking-[0.2em] uppercase font-general" style={{ color: "var(--primary-blue)" }}>
            Prime Group
          </span>
        </div>

        <div
          className="rounded-[2rem] border-2 bg-white/95 p-8 sm:p-12 shadow-[0_24px_70px_rgba(13,46,92,0.12),0_0_0_1px_rgba(198,167,94,0.15)_inset] backdrop-blur-md"
          style={{ borderColor: "rgba(198, 167, 94, 0.35)" }}
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: "linear-gradient(145deg, rgba(198,167,94,0.18), rgba(13,46,92,0.08))" }}>
            <CheckCircle2 className="h-10 w-10" style={{ color: "var(--accent-gold)" }} strokeWidth={1.75} aria-hidden />
          </div>

          <h1 className="font-playfair-display text-3xl sm:text-4xl font-bold tracking-tight mb-3" style={{ color: "var(--primary-blue)" }}>
            Hi — you&apos;re verified
          </h1>
          <p className="font-general text-base sm:text-lg text-gray-600 leading-relaxed mb-2">
            Your email is confirmed. You can sign in with the email and password you chose at registration.
          </p>
          <p className="font-general text-sm text-gray-500 mb-10">
            {!cleared ? "Preparing your session…" : "Use the button below to continue."}
          </p>

          <Link
            href="/sign-in?message=email_verified"
            className="inline-flex w-full sm:w-auto min-w-[220px] items-center justify-center rounded-2xl px-8 py-3.5 text-base font-general font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: "var(--primary-blue)", outlineColor: "var(--accent-gold)" }}
          >
            Sign in
          </Link>

          <p className="mt-8 font-general text-sm text-gray-500">
            <Link href="/" className="underline underline-offset-2 hover:text-[var(--primary-blue)] transition-colors">
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
