"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AuthHeader() {
  const pathname = usePathname();
  const isSignUp = pathname?.startsWith("/sign-up") ?? false;

  const linkClass = cn(
    "text-sm font-medium transition-all duration-200",
    "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md",
    "focus-visible:ring-[var(--accent-gold)]"
  );

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderColor: "rgba(0, 51, 102, 0.12)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-2 font-playfair text-lg font-bold tracking-tight",
            "transition-opacity hover:opacity-90"
          )}
          style={{ color: "var(--primary-blue)" }}
        >
          <span className="hidden sm:inline">Prime Group</span>
          <span className="text-xs font-semibold uppercase tracking-wider sm:hidden">PRIME GROUP</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          {isSignUp ? (
            <Link
              href="/sign-in"
              className={linkClass}
              style={{ color: "var(--primary-blue)" }}
            >
              Sign in
            </Link>
          ) : (
            <Link
              href="/sign-up"
              className={linkClass}
              style={{ color: "var(--accent-gold)" }}
            >
              Register free
            </Link>
          )}
          <span className="hidden text-gray-300 sm:inline" aria-hidden>|</span>
          <Link
            href="/"
            className={cn(linkClass, "text-gray-600")}
          >
            Back to home
          </Link>
        </nav>
      </div>
    </header>
  );
}
