"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthInput } from "@/components/auth/AuthInput";
import type { AuthFormData } from "@/components/types/auth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Pick<AuthFormData, "email">>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: Pick<AuthFormData, "email">) => {
    setMessage(null);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/sign-in`,
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    setMessage({
      type: "success",
      text: "Check your email for the password reset link.",
    });
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-black/30">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-playfair-display font-bold text-center mb-2" style={{ color: "var(--primary-blue)" }}>
          Forgot password?
        </h2>
        <p className="text-sm text-center mb-6" style={{ color: "var(--primary-blue)" }}>
          Enter your email and we&apos;ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"
              }`}
            >
              {message.text}
            </div>
          )}
          <AuthInput
            type="email"
            name="email"
            placeholder="Email"
            icon={Mail}
            register={register}
            error={errors.email?.message}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 rounded-lg font-montserrat font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ backgroundColor: "var(--primary-blue)" }}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
          </button>
        </form>
        <p className="text-center text-sm mt-6" style={{ color: "var(--primary-blue)" }}>
          <Link href="/sign-in" className="font-medium underline" style={{ color: "var(--accent-gold)" }}>
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
