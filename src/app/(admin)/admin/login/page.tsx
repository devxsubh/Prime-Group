"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Mail, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError(authError.message || "Invalid email or password");
        setLoading(false);
        return;
      }
      if (!authData.user) {
        setError("Login failed");
        setLoading(false);
        return;
      }
      // Use API with service role to check admin (bypasses RLS)
      const res = await fetch("/api/admin/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.isAdmin) {
        await supabase.auth.signOut();
        setError("You do not have admin access. Your role may not be synced yet—try again in a moment.");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div
        className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md border"
        style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
      >
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center p-2"
            style={{ backgroundColor: "var(--primary-blue)" }}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-playfair-display font-bold mb-2 text-center" style={{ color: "var(--primary-blue)" }}>
          Admin Login
        </h1>
        <p className="text-sm font-montserrat text-center mb-8 opacity-80" style={{ color: "var(--primary-blue)" }}>
          Prime Group Admin Panel
        </p>

        {error && (
          <div
            className="rounded-xl mb-6 p-4 text-sm font-montserrat flex items-center gap-2 border border-red-200 bg-red-50 text-red-700"
          >
            <span aria-hidden>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium font-montserrat mb-2" style={{ color: "var(--primary-blue)" }}>
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              disabled={loading}
              className="rounded-lg border-gray-200"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium font-montserrat mb-2" style={{ color: "var(--primary-blue)" }}>
              Password
            </label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="rounded-lg pr-10 border-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full rounded-xl h-11 font-montserrat font-medium text-white"
            style={{ backgroundColor: "var(--primary-blue)" }}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-center font-montserrat text-gray-600 mb-4">
            Can&apos;t log in? Contact the administrator
          </p>
          <a
            href="mailto:support@primegroupmatrimony.com"
            className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:opacity-80"
          >
            <Mail className="w-4 h-4" />
            support@primegroupmatrimony.com
          </a>
        </div>
      </div>
    </div>
  );
}
