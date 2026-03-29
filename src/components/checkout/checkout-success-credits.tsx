"use client";

import { useEffect } from "react";
import { useCredits } from "@/context/credits-context";
import { Coins, Loader2 } from "lucide-react";

/** Refreshes balance after Razorpay redirect and shows updated credits. */
export default function CheckoutSuccessCredits() {
  const { credits, loading, refreshCredits } = useCredits();

  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  return (
    <div className="mb-6 rounded-2xl border-2 border-[#E2C285]/30 bg-[#003366]/[0.03] px-5 py-4">
      <div className="flex items-center justify-center gap-3 font-montserrat text-[#003366]">
        <Coins className="h-6 w-6 shrink-0 text-[#E2C285]" aria-hidden />
        {loading ? (
          <span className="inline-flex items-center gap-2 text-sm text-[#003366]/70">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Loading balance…
          </span>
        ) : (
          <span className="text-base">
            Your balance:{" "}
            <strong className="text-xl font-outfit tabular-nums">{credits.toLocaleString()}</strong>{" "}
            credits
          </span>
        )}
      </div>
    </div>
  );
}
