"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { AuthFormData, UserType } from "../types/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (data: AuthFormData, _userType: UserType) => {
    setIsLoading(true);
    setError(null);
    const { error: e } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    setIsLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
  };

  const signUp = async (data: AuthFormData, _userType: UserType) => {
    setIsLoading(true);
    setError(null);
    const { error: e } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback?next=/onboarding`,
      },
    });
    setIsLoading(false);
    if (e) {
      setError(e.message);
      return;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return {
    user,
    session: user ? { user } : null,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
  };
}
