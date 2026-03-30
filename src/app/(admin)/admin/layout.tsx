"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sidebar } from "./components/Sidebar";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("adminSidebarCollapsed") : null;
    if (saved !== null) setIsSidebarCollapsed(saved === "true");
  }, []);

  const handleToggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    if (typeof window !== "undefined") localStorage.setItem("adminSidebarCollapsed", String(next));
  };

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (pathname === "/admin/login") {
        if (user) {
          const res = await fetch("/api/admin/me", { credentials: "include" });
          const data = await res.json().catch(() => ({}));
          if (res.ok && data.isAdmin) {
            router.replace("/admin");
            return;
          }
        }
        setLoading(false);
        return;
      }
      if (!user) {
        router.replace("/admin/login");
        setLoading(false);
        return;
      }
      const res = await fetch("/api/admin/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.isAdmin) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        setLoading(false);
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };
    check();
  }, [pathname, router]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div
          className="animate-spin rounded-full h-8 w-8 border-2 border-t-transparent"
          style={{ borderColor: "var(--primary-blue)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow border"
        style={{ borderColor: "var(--accent-gold)" }}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-40 transform
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
        `}
      >
        <Sidebar collapsed={isSidebarCollapsed} onToggle={handleToggleSidebar} />
      </div>

      <main className="admin-main flex-1 overflow-y-auto p-4 lg:p-8 w-full bg-gray-50 transition-all duration-300 text-base">
        <div className="pt-14 lg:pt-0">{children}</div>
      </main>
    </div>
  );
}
