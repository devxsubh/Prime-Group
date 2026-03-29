import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import CheckoutSuccessCredits from "@/components/checkout/checkout-success-credits";

export const metadata: Metadata = {
  title: "Payment successful | Prime Group Matrimony",
  description: "Your credits have been added to your account.",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--pure-white)" }}>
      <div className="bg-[#003366] pt-24 pb-12 md:pt-28 md:pb-14 px-4 text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-[#E2C285]/20 flex items-center justify-center mb-4">
          <CheckCircle2 className="w-10 h-10 text-[#E2C285]" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="font-outfit font-black text-3xl sm:text-4xl text-white tracking-tight">
          Payment <span className="text-gold-gradient bg-clip-text text-transparent">successful</span>
        </h1>
        <p className="mt-3 font-montserrat text-white/75 text-sm sm:text-base max-w-md mx-auto">
          Your credits are ready. Start unlocking contact details on profiles you like.
        </p>
      </div>

      <div className="container max-w-md mx-auto px-4 py-12">
        <div
          className="rounded-[2rem] border-2 p-8 text-center shadow-[0_20px_50px_rgba(0,51,102,0.08)]"
          style={{ borderColor: "rgba(226, 194, 133, 0.35)", backgroundColor: "var(--pure-white)" }}
        >
          <div className="inline-flex items-center gap-2 text-[#003366]/70 font-montserrat text-sm mb-4">
            <Sparkles className="w-5 h-5 text-[#E2C285]" aria-hidden />
            You&apos;re all set
          </div>
          <CheckoutSuccessCredits />
          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="h-12 rounded-2xl bg-gold-gradient text-[#001a33] font-bold border-none hover:scale-[1.02] transition-transform shadow-[0_0_24px_rgba(226,194,133,0.3)]"
            >
              <Link href="/discover">Continue to Discover</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-2xl border-2 border-[#003366]/15 text-[#003366] font-semibold hover:bg-[#003366]/5"
            >
              <Link href="/profile">My profile</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
