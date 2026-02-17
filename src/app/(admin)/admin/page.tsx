"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserCircle,
  Image,
  Clock,
  BarChart3,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  IndianRupee,
  TrendingUp,
  PieChart,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface RevenueRow {
  total: number;
  thisMonth: number;
  byPlan: { plan_id: string | null; sum: number }[];
}

interface CategoryCount {
  name: string;
  count: number;
  pct: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProfiles: 0,
    pendingProfiles: 0,
    activeProfiles: 0,
  });
  const [revenue, setRevenue] = useState<RevenueRow>({
    total: 0,
    thisMonth: 0,
    byPlan: [],
  });
  const [byGender, setByGender] = useState<CategoryCount[]>([]);
  const [byReligion, setByReligion] = useState<CategoryCount[]>([]);
  const [byStatus, setByStatus] = useState<CategoryCount[]>([]);
  const [byCity, setByCity] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    const supabase = createClient();
    try {
      const [usersRes, profilesRes, paymentsRes, plansRes] = await Promise.all([
        supabase.from("users").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("id, profile_status, gender, religion, city"),
        supabase.from("payments").select("amount, paid_at, plan_id, created_at").eq("status", "success"),
        supabase.from("plans").select("id, name").catch(() => ({ data: [] })),
      ]);
      const profiles = profilesRes.data ?? [];
      const payments = paymentsRes.data ?? [];
      const plans = (plansRes as { data?: { id: string; name: string }[] }).data ?? [];

      const totalProfiles = profiles.length;
      const pendingProfiles = profiles.filter((p) => p.profile_status === "pending").length;
      const activeProfiles = profiles.filter((p) => p.profile_status === "active").length;
      setStats({
        totalUsers: usersRes.count ?? 0,
        totalProfiles,
        pendingProfiles,
        activeProfiles,
      });

      const totalRevenue = payments.reduce((s, p) => s + (p.amount || 0), 0);
      const now = new Date();
      const thisMonth = payments.filter((p) => {
        const dateStr = (p as { paid_at?: string }).paid_at || (p as { created_at?: string }).created_at;
        if (!dateStr) return false;
        const d = new Date(dateStr);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).reduce((s, p) => s + (p.amount || 0), 0);
      const byPlanMap = new Map<string | null, number>();
      payments.forEach((p) => {
        const key = p.plan_id ?? null;
        byPlanMap.set(key, (byPlanMap.get(key) ?? 0) + (p.amount || 0));
      });
      setRevenue({
        total: totalRevenue,
        thisMonth,
        byPlan: Array.from(byPlanMap.entries()).map(([plan_id, sum]) => ({ plan_id, sum })),
      });

      const toPct = (n: number) => (totalProfiles ? Math.round((n / totalProfiles) * 100) : 0);
      const genderCounts = Object.entries(
        profiles.reduce<Record<string, number>>((acc, p) => {
          const g = p.gender || "other";
          acc[g] = (acc[g] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count, pct: toPct(count) }));
      setByGender(genderCounts.sort((a, b) => b.count - a.count));

      const religionCounts = Object.entries(
        profiles.reduce<Record<string, number>>((acc, p) => {
          const r = p.religion || "Not specified";
          acc[r] = (acc[r] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name, count, pct: toPct(count) }));
      setByReligion(religionCounts.sort((a, b) => b.count - a.count).slice(0, 8));

      setByStatus([
        { name: "Pending", count: pendingProfiles, pct: toPct(pendingProfiles) },
        { name: "Active", count: activeProfiles, pct: toPct(activeProfiles) },
        { name: "Rejected", count: profiles.filter((p) => p.profile_status === "rejected").length, pct: toPct(profiles.filter((p) => p.profile_status === "rejected").length) },
        { name: "Suspended", count: profiles.filter((p) => p.profile_status === "suspended").length, pct: toPct(profiles.filter((p) => p.profile_status === "suspended").length) },
      ].filter((s) => s.count > 0));

      const cityCounts = Object.entries(
        profiles.reduce<Record<string, number>>((acc, p) => {
          const c = p.city?.trim() || "Not specified";
          acc[c] = (acc[c] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, count]) => ({ name, count, pct: toPct(count) }));
      setByCity(cityCounts.sort((a, b) => b.count - a.count).slice(0, 6));
    } catch {
      setStats({ totalUsers: 0, totalProfiles: 0, pendingProfiles: 0, activeProfiles: 0 });
      setRevenue({ total: 0, thisMonth: 0, byPlan: [] });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const cardStyle = {
    borderColor: "rgba(212, 175, 55, 0.25)",
    backgroundColor: "white",
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair-display font-bold flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
            <BarChart3 className="w-7 h-7" style={{ color: "var(--accent-gold)" }} />
            Admin Dashboard
          </h1>
          <p className="font-montserrat text-sm mt-1 text-gray-600">
            Overview of your matrimony platform.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-montserrat"
          style={{ borderColor: "var(--accent-gold)" }}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="rounded-xl border shadow-sm" style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat text-gray-600">Total Users</p>
                <p className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                  {loading ? "..." : stats.totalUsers}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(0, 51, 102, 0.1)" }}>
                <Users className="w-5 h-5" style={{ color: "var(--primary-blue)" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm" style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat text-gray-600">Total Profiles</p>
                <p className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                  {loading ? "..." : stats.totalProfiles}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(226, 194, 133, 0.3)" }}>
                <UserCircle className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm" style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat text-gray-600">Pending</p>
                <p className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                  {loading ? "..." : stats.pendingProfiles}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border shadow-sm" style={cardStyle}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-montserrat text-gray-600">Active</p>
                <p className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                  {loading ? "..." : stats.activeProfiles}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue stats */}
      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            <IndianRupee className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
            Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-montserrat text-gray-600">Total revenue</p>
              <p className="text-xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                {loading ? "..." : `₹${revenue.total.toLocaleString()}`}
              </p>
            </div>
            <div className="rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-montserrat text-gray-600 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> This month
              </p>
              <p className="text-xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
                {loading ? "..." : `₹${revenue.thisMonth.toLocaleString()}`}
              </p>
            </div>
            <div className="rounded-lg p-4 bg-gray-50">
              <p className="text-sm font-montserrat text-gray-600">By plan</p>
              <div className="text-sm font-montserrat mt-1 space-y-0.5">
                {loading ? "..." : revenue.byPlan.length === 0 ? "No payments yet" : revenue.byPlan.map(({ plan_id, sum }) => (
                  <div key={plan_id ?? "none"}>
                    {plan_id ? `Plan: ₹${sum.toLocaleString()}` : `Other: ₹${sum.toLocaleString()}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-based segregation */}
      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            <PieChart className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
            Category breakdown
          </CardTitle>
          <p className="text-sm font-montserrat text-gray-600">Profiles by category</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="font-montserrat font-semibold mb-2" style={{ color: "var(--primary-blue)" }}>By gender</h4>
              <ul className="space-y-1.5 text-sm font-montserrat">
                {loading ? <li className="text-gray-500">...</li> : byGender.length === 0 ? <li className="text-gray-500">No data</li> : byGender.map((g) => (
                  <li key={g.name} className="flex justify-between">
                    <span>{g.name}</span>
                    <span className="font-medium">{g.count} ({g.pct}%)</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold mb-2" style={{ color: "var(--primary-blue)" }}>By religion</h4>
              <ul className="space-y-1.5 text-sm font-montserrat">
                {loading ? <li className="text-gray-500">...</li> : byReligion.length === 0 ? <li className="text-gray-500">No data</li> : byReligion.map((r) => (
                  <li key={r.name} className="flex justify-between">
                    <span className="truncate max-w-[120px]" title={r.name}>{r.name}</span>
                    <span className="font-medium shrink-0">{r.count} ({r.pct}%)</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold mb-2" style={{ color: "var(--primary-blue)" }}>By status</h4>
              <ul className="space-y-1.5 text-sm font-montserrat">
                {loading ? <li className="text-gray-500">...</li> : byStatus.length === 0 ? <li className="text-gray-500">No data</li> : byStatus.map((s) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="font-medium">{s.count} ({s.pct}%)</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-semibold mb-2" style={{ color: "var(--primary-blue)" }}>By city (top)</h4>
              <ul className="space-y-1.5 text-sm font-montserrat">
                {loading ? <li className="text-gray-500">...</li> : byCity.length === 0 ? <li className="text-gray-500">No data</li> : byCity.map((c) => (
                  <li key={c.name} className="flex justify-between">
                    <span className="truncate max-w-[100px]" title={c.name}>{c.name}</span>
                    <span className="font-medium shrink-0">{c.count} ({c.pct}%)</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            <Image className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            <Button
              variant="outline"
              className="h-14 flex-col gap-2 rounded-xl font-montserrat hover:scale-[1.02] transition-transform"
              style={{ borderColor: "var(--accent-gold)" }}
              asChild
            >
              <Link href="/admin/profiles">
                <Users className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                <span>Manage Profiles</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-2 rounded-xl font-montserrat hover:scale-[1.02] transition-transform"
              style={{ borderColor: "var(--accent-gold)" }}
              asChild
            >
              <Link href="/admin/categories">
                <PieChart className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                <span>Categories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-2 rounded-xl font-montserrat hover:scale-[1.02] transition-transform"
              style={{ borderColor: "var(--accent-gold)" }}
              asChild
            >
              <Link href="/admin/revenue">
                <IndianRupee className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                <span>Revenue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-2 rounded-xl font-montserrat hover:scale-[1.02] transition-transform"
              style={{ borderColor: "var(--accent-gold)" }}
              asChild
            >
              <Link href="/admin/pricing">
                <IndianRupee className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                <span>Pricing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-14 flex-col gap-2 rounded-xl font-montserrat hover:scale-[1.02] transition-transform"
              style={{ borderColor: "var(--accent-gold)" }}
              asChild
            >
              <Link href="/admin/settings">
                <BarChart3 className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
                <span>Settings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
