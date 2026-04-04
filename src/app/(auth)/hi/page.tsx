import { Suspense } from "react";
import { HiContent } from "./hi-content";

function HiFallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="fixed inset-0 -z-10 bg-[#faf9f6]" />
      <p className="font-general text-gray-600">Loading…</p>
    </div>
  );
}

export default function EmailVerifiedHiPage() {
  return (
    <Suspense fallback={<HiFallback />}>
      <HiContent />
    </Suspense>
  );
}
