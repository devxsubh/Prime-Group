"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PieChart,
  RefreshCw,
  Users,
  MapPin,
  Heart,
  BookOpen,
  Flag,
  Activity,
  Building2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface CategoryItem {
  name: string;
  count: number;
  pct: number;
}

const BAR_COLORS = [
  "var(--primary-blue)",
  "var(--accent-gold)",
  "#059669",
  "#7c3aed",
  "#dc2626",
  "#ea580c",
  "#0891b2",
  "#4f46e5",
];

function BarChartSection({
  title,
  icon: Icon,
  data,
  colorByIndex = true,
}: {
  title: string;
  icon: React.ElementType;
  data: CategoryItem[];
  colorByIndex?: boolean;
}) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  return (
    <Card className="rounded-xl border shadow-sm" style={{ borderColor: "rgba(212, 175, 55, 0.25)", backgroundColor: "white" }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 font-playfair-display text-lg" style={{ color: "var(--primary-blue)" }}>
          <Icon className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {data.map((item, i) => (
            <div key={item.name} className="space-y-1">
              <div className="flex justify-between text-sm font-general">
                <span className="font-medium truncate max-w-[180px]" title={item.name}>{item.name}</span>
                <span className="text-gray-600 shrink-0">
                  {item.count} <span className="text-gray-400">({item.pct}%)</span>
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: colorByIndex ? BAR_COLORS[i % BAR_COLORS.length] : BAR_COLORS[0],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {data.length === 0 && (
          <p className="text-sm font-general text-gray-500">No data</p>
        )}
      </CardContent>
    </Card>
  );
}

function CategoryTable({ title, data }: { title: string; data: CategoryItem[] }) {
  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-general">{title}</TableHead>
            <TableHead className="font-general text-right">Count</TableHead>
            <TableHead className="font-general text-right">Share</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name} className="font-general">
              <TableCell className="font-medium">{row.name}</TableCell>
              <TableCell className="text-right">{row.count}</TableCell>
              <TableCell className="text-right">
                <span className="text-gray-600">{row.pct}%</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [profiles, setProfiles] = useState<{ gender: string; religion: string | null; city: string | null; state: string | null; profile_status: string; marital_status: string | null; mother_tongue: string | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("gender, religion, city, state, profile_status, marital_status, mother_tongue");
      if (error) throw error;
      setProfiles((data ?? []) as typeof profiles);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const total = profiles.length;
  const toPct = (n: number) => (total ? Math.round((n / total) * 100) : 0);

  const byGender = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const g = p.gender || "other";
      acc[g] = (acc[g] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const byReligion = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const r = p.religion?.trim() || "Not specified";
      acc[r] = (acc[r] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const byStatus = (() => {
    const statuses = ["pending", "active", "rejected", "suspended"] as const;
    return statuses.map((s) => {
      const count = profiles.filter((p) => p.profile_status === s).length;
      return { name: s.charAt(0).toUpperCase() + s.slice(1), count, pct: toPct(count) };
    }).filter((s) => s.count > 0);
  })();

  const byCity = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const c = p.city?.trim() || "Not specified";
      acc[c] = (acc[c] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const byState = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const s = p.state?.trim() || "Not specified";
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const byMarital = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const m = p.marital_status?.trim() || "Not specified";
      acc[m] = (acc[m] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const byMotherTongue = (() => {
    const map = profiles.reduce<Record<string, number>>((acc, p) => {
      const m = p.mother_tongue?.trim() || "Not specified";
      acc[m] = (acc[m] ?? 0) + 1;
      return acc;
    }, {});
    return Object.entries(map)
      .map(([name, count]) => ({ name, count, pct: toPct(count) }))
      .sort((a, b) => b.count - a.count);
  })();

  const cardStyle = { borderColor: "rgba(212, 175, 55, 0.25)", backgroundColor: "white" };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair-display font-bold flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
            <PieChart className="w-7 h-7" style={{ color: "var(--accent-gold)" }} />
            Category breakdown
          </h1>
          <p className="font-general text-sm mt-1 text-gray-600">
            Profile distribution by gender, religion, location, status and more.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-general"
          style={{ borderColor: "var(--accent-gold)" }}
          onClick={() => {
            setRefreshing(true);
            fetchData();
          }}
          disabled={refreshing || loading}
        >
          <RefreshCw className={cn("w-4 h-4", (refreshing || loading) ? "animate-spin" : "")} />
          Refresh
        </Button>
      </div>

      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(0, 51, 102, 0.1)" }}>
            <Users className="w-6 h-6" style={{ color: "var(--primary-blue)" }} />
          </div>
          <div>
            <p className="text-sm font-general text-gray-600">Total profiles</p>
            <p className="text-2xl font-bold font-playfair-display" style={{ color: "var(--primary-blue)" }}>
              {loading ? "..." : total.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-lg font-playfair-display font-semibold mb-4" style={{ color: "var(--primary-blue)" }}>
          Visual breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <BarChartSection title="By gender" icon={Heart} data={byGender} />
          <BarChartSection title="By profile status" icon={Activity} data={byStatus} />
          <BarChartSection title="By religion" icon={BookOpen} data={byReligion.slice(0, 10)} />
          <BarChartSection title="By city" icon={Building2} data={byCity.slice(0, 10)} />
          <BarChartSection title="By state" icon={MapPin} data={byState.slice(0, 10)} />
          <BarChartSection title="By marital status" icon={Heart} data={byMarital} />
          <BarChartSection title="By mother tongue" icon={Flag} data={byMotherTongue.slice(0, 10)} />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-playfair-display font-semibold mb-4" style={{ color: "var(--primary-blue)" }}>
          Detailed tables
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">Gender</h3>
            <CategoryTable title="Gender" data={byGender} />
          </div>
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">Profile status</h3>
            <CategoryTable title="Status" data={byStatus} />
          </div>
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">Religion</h3>
            <CategoryTable title="Religion" data={byReligion} />
          </div>
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">City</h3>
            <CategoryTable title="City" data={byCity} />
          </div>
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">State</h3>
            <CategoryTable title="State" data={byState} />
          </div>
          <div>
            <h3 className="font-general font-semibold mb-2 text-gray-700">Mother tongue</h3>
            <CategoryTable title="Mother tongue" data={byMotherTongue} />
          </div>
        </div>
      </div>
    </div>
  );
}
