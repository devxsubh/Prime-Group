import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="absolute inset-0 bg-[#f3f0ed] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border-2 bg-white shadow-xl" style={{ borderColor: "var(--accent-gold)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[620px]">
          <div className="relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80"
              alt="Happy couple"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent" />
            <div className="absolute top-5 left-5 rounded-md bg-white/90 px-3 py-2">
              <p className="text-xs font-semibold tracking-wide" style={{ color: "var(--primary-blue)" }}>
                PRIME GROUP
              </p>
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xl font-montserrat font-semibold mb-2">Find your special someone.</p>
              <p className="text-sm text-white/90">
                Build your profile and start discovering compatible matches.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Already registered?{" "}
                <Link href="/sign-in" className="font-semibold hover:opacity-80" style={{ color: "var(--accent-gold)" }}>
                  Login here
                </Link>
              </p>
              <h1 className="text-3xl font-montserrat font-bold tracking-tight" style={{ color: "var(--primary-blue)" }}>
                Create your account
              </h1>
              <p className="text-gray-600 mt-2">India&apos;s trusted matrimony service for meaningful connections.</p>
            </div>

            <AuthForm mode="sign-up" hideTitle submitLabel="Register free" className="max-w-none" />

            <p className="text-center text-xs mt-5 text-gray-500">
              <Link href="/" className="underline hover:opacity-80">
                Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
