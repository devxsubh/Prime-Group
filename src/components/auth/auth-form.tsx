"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthInput } from "./AuthInput";
import { cn } from "@/lib/utils";
import type { AuthFormData } from "../types/auth";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signUpSchema = signInSchema.extend({
  confirmPassword: z.string(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the Terms and Privacy Policy" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const linkClass =
  "font-medium underline hover:opacity-90 transition-colors";
const inputErrorClass = "text-red-500 text-sm";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  hideTitle?: boolean;
  submitLabel?: string;
  className?: string;
}

export function AuthForm({ mode, hideTitle = false, submitLabel, className }: AuthFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isSignUp = mode === "sign-up";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema),
    defaultValues: {
      rememberMe: false,
      acceptTerms: false,
    },
  });

  const onSubmit = async (data: AuthFormData & { confirmPassword?: string; acceptTerms?: boolean }) => {
    setMessage(null);
    const supabase = createClient();

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
        return;
      }
      setMessage({
        type: "success",
        text: "Check your email for the confirmation link to complete sign up.",
      });
      return;
    }

    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setMessage({ type: "error", text: error.message });
      return;
    }
    const userId = signInData.user?.id;
    if (userId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, profile_status, profile_completion_pct")
        .eq("user_id", userId)
        .single();
      router.refresh();
      const isProfileCompleted =
        profile &&
        (profile.profile_status === "active" || (profile.profile_completion_pct ?? 0) >= 75);
      if (!isProfileCompleted) {
        router.push("/onboarding");
        return;
      }
    }
    router.refresh();
    router.push("/discover");
  };

  return (
    <div className={cn("w-full max-w-sm mx-auto", className)}>
      {!hideTitle && (
        <h2 className="text-2xl font-playfair-display font-bold text-center mb-6" style={{ color: "var(--primary-blue)" }}>
          {isSignUp ? "Create your account" : "Sign in"}
        </h2>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {message && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-800"
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
          register={register as any}
          error={errors.email?.message as string | undefined}
        />
        <AuthInput
          type="password"
          name="password"
          placeholder="Password"
          icon={Lock}
          register={register as any}
          error={errors.password?.message as string | undefined}
        />

        {isSignUp && (
          <>
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-blue)] focus:border-transparent"
                  placeholder="Confirm password"
                />
              </div>
              {(errors as any).confirmPassword && (
                <p className={inputErrorClass}>{(errors as any).confirmPassword.message}</p>
              )}
            </div>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="acceptTerms"
                {...register("acceptTerms")}
                className="rounded border-gray-300 mt-1 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className={linkClass} style={{ color: "var(--accent-gold)" }}>Terms of Service</Link>
                {" "}and{" "}
                <Link href="/privacy" className={linkClass} style={{ color: "var(--accent-gold)" }}>Privacy Policy</Link>
              </label>
            </div>
            {(errors as any).acceptTerms && (
              <p className={inputErrorClass}>{(errors as any).acceptTerms.message}</p>
            )}
          </>
        )}

        {!isSignUp && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="rounded border-gray-300 text-[var(--primary-blue)] focus:ring-[var(--primary-blue)]"
              />
              <span style={{ color: "var(--primary-blue)" }}>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className={linkClass}
              style={{ color: "var(--accent-gold)" }}
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 px-4 rounded-lg font-montserrat font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{ backgroundColor: "var(--primary-blue)" }}
        >
          {isSubmitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            submitLabel ?? (isSignUp ? "Sign up" : "Sign in")
          )}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: "var(--primary-blue)" }}>
        {isSignUp ? "Already have an account? " : "New here? "}
        <Link
          href={isSignUp ? "/sign-in" : "/sign-up"}
          className={linkClass}
          style={{ color: "var(--accent-gold)" }}
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
