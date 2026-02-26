"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthInput } from "@/components/auth/AuthInput";
import { Spinner } from "@/components/ui/spinner";

const schema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
      setCheckingSession(false);
      if (!session) {
        router.replace("/sign-in?next=/reset-password");
      }
    });
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: data.password });
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({ type: "success", text: "Password updated. Redirecting to sign in..." });
    await supabase.auth.signOut();
    router.push("/sign-in?message=password_reset");
  };

  const loadingView = (
    <div className="absolute inset-0 min-h-screen flex items-center justify-center p-4">
      <Spinner label="Loading..." />
    </div>
  );

  if (checkingSession) {
    return loadingView;
  }

  if (!hasSession) {
    return loadingView;
  }

  return (
    <div className="absolute inset-0 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border-2 bg-white/95 backdrop-blur-sm p-8 shadow-xl" style={{ borderColor: "var(--accent-gold)" }}>
        <h2 className="text-2xl font-playfair-display font-bold text-center mb-2" style={{ color: "var(--primary-blue)" }}>
          Set new password
        </h2>
        <p className="text-sm font-montserrat text-center mb-6 text-gray-600">
          Enter your new password below. You&apos;ll be signed out and can sign in with it.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {message && (
            <div
              role="status"
              aria-live="polite"
              className={`p-3 rounded-lg text-sm font-montserrat ${
                message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <AuthInput
            type="password"
            name="password"
            placeholder="New password"
            label="New password"
            icon={Lock}
            register={register}
            error={errors.password?.message}
          />
          <AuthInput
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            label="Confirm new password"
            icon={Lock}
            register={register}
            error={errors.confirmPassword?.message}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            aria-label="Update password"
            className="w-full py-2.5 px-4 rounded-lg font-montserrat font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 transition-colors hover:opacity-95"
            style={{ backgroundColor: "var(--primary-blue)" }}
          >
            {isSubmitting ? <Spinner size="sm" /> : "Update password"}
          </button>
        </form>
        <p className="text-center text-sm mt-6 font-montserrat" style={{ color: "var(--primary-blue)" }}>
          <Link href="/sign-in" className="font-medium underline hover:opacity-90" style={{ color: "var(--accent-gold)" }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
