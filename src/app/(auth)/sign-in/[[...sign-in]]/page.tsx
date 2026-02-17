import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="absolute inset-0 bg-[#f3f0ed] p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border-2 bg-white shadow-xl" style={{ borderColor: "var(--accent-gold)" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[620px]">
          <div className="relative hidden md:block">
            <img
              src="/couples/image.png"
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
              <p className="text-xl font-montserrat font-semibold mb-2">Real stories, real matches.</p>
              <p className="text-sm text-white/90">
                Join thousands of members finding meaningful relationships.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">
                New to Prime Group?{" "}
                <Link href="/sign-up" className="font-semibold hover:opacity-80" style={{ color: "var(--accent-gold)" }}>
                  Register free
                </Link>
              </p>
              <h1 className="text-3xl font-montserrat font-bold tracking-tight" style={{ color: "var(--primary-blue)" }}>
                Welcome back
              </h1>
              <p className="text-gray-600 mt-2">Sign in to continue your matchmaking journey.</p>
            </div>

            <AuthForm mode="sign-in" hideTitle submitLabel="Sign in" className="max-w-none" />

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
