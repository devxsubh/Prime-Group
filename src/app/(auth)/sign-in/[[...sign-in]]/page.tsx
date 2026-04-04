import Link from "next/link";
import Image from "next/image";
import { AuthForm } from "@/components/auth/auth-form";
import { cn } from "@/lib/utils";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; next?: string }>;
}) {
  const params = await searchParams;
  const showPasswordResetSuccess = params.message === "password_reset";
  const showEmailVerified = params.message === "email_verified";
  const next = params.next && params.next.trim().startsWith("/") && !params.next.trim().startsWith("//")
    ? params.next
    : undefined;

  return (
    <div className="min-h-screen w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* Left: image panel */}
        <div
          className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden"
        >
          <Image
            src="/img/signin.avif"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(13, 46, 92, 0.72), rgba(13, 46, 92, 0.35) 45%, rgba(198, 167, 94, 0.25))",
            }}
          />
          <div className="absolute inset-0 z-[1] bg-black/50" aria-hidden />
          <div className="space-y-6 relative z-10">
            <div className="inline-flex items-center rounded-xl bg-white/95 px-4 py-2.5 shadow-sm border border-white/40 backdrop-blur-sm">
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--primary-blue)" }}>
                PRIME GROUP
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-4xl font-playfair-display font-bold tracking-tight text-white">
                Welcome back
              </p>
              <p className="text-base text-white/85 font-general leading-relaxed max-w-md">
                Sign in to continue your matchmaking journey.
              </p>
            </div>
          </div>

          <div className="space-y-2 relative z-10">
            <p className="text-sm text-white/85 font-general">
              New to Prime Group?{" "}
              <Link href="/sign-up" className="font-semibold underline underline-offset-2" style={{ color: "var(--accent-gold)" }}>
                Register free
              </Link>
            </p>
            <div className="h-1 w-40 bg-gradient-to-r from-transparent via-[var(--accent-gold)] to-transparent" />
          </div>
        </div>

        {/* Right: form */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 bg-white">
          <div className="w-full max-w-md">
            <div className="md:hidden mb-6 pb-4 border-b border-gray-200/80 text-center">
              <p className="text-xs font-bold tracking-wider uppercase" style={{ color: "var(--primary-blue)" }}>
                PRIME GROUP
              </p>
            </div>

            <div className="mb-7 space-y-2 text-center md:text-left">
              <p className="text-3xl sm:text-4xl font-playfair-display font-bold tracking-tight" style={{ color: "var(--primary-blue)" }}>
                Welcome back
              </p>
              <p className="text-gray-600 text-base leading-relaxed">
                Sign in to continue your matchmaking journey.
              </p>
              <p className="text-sm text-gray-500 font-general">
                New to Prime Group?{" "}
                <Link href="/sign-up" className="font-semibold underline underline-offset-2" style={{ color: "var(--accent-gold)" }}>
                  Register free
                </Link>
              </p>
            </div>

            {showPasswordResetSuccess && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm font-general">
                Password reset successfully. Sign in with your new password.
              </div>
            )}

            {showEmailVerified && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-800 text-sm font-general border border-green-200/80">
                Email verified. Sign in with your email and password to continue.
              </div>
            )}

            <AuthForm mode="sign-in" hideTitle submitLabel="Sign in" className="max-w-none" next={next} />

            <p className="text-center text-sm mt-8 text-gray-500">
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
  );
}
