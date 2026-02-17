"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Search, RefreshCw, ExternalLink, CheckCircle, XCircle, PauseCircle } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface ProfileRow {
  id: string;
  user_id: string;
  full_name: string;
  gender: string;
  city: string | null;
  profile_status: string;
  profile_completion_pct: number | null;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "active", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
] as const;

export default function AdminProfilesPage() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, gender, city, profile_status, profile_completion_pct, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setProfiles((data as ProfileRow[]) ?? []);
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const filtered = profiles.filter((p) => {
    const matchSearch =
      !search ||
      p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.city?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.profile_status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (profileId: string, newStatus: string) => {
    const supabase = createClient();
    setUpdatingId(profileId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          profile_status: newStatus,
          approved_at: newStatus === "active" ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);
      if (error) throw error;
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, profile_status: newStatus } : p))
      );
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const cardStyle = { borderColor: "rgba(212, 175, 55, 0.25)", backgroundColor: "white" };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair-display font-bold flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
            <Users className="w-7 h-7" style={{ color: "var(--accent-gold)" }} />
            Profiles
          </h1>
          <p className="font-montserrat text-sm mt-1 text-gray-600">
            View and manage user profiles.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-montserrat"
          style={{ borderColor: "var(--accent-gold)" }}
          onClick={() => fetchProfiles()}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardHeader>
          <CardTitle className="font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            All profiles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-lg border-gray-200"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-montserrat"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-montserrat">Name</TableHead>
                  <TableHead className="font-montserrat">Gender</TableHead>
                  <TableHead className="font-montserrat">City</TableHead>
                  <TableHead className="font-montserrat">Status</TableHead>
                  <TableHead className="font-montserrat">Change status</TableHead>
                  <TableHead className="font-montserrat">Completion</TableHead>
                  <TableHead className="font-montserrat">Created</TableHead>
                  <TableHead className="font-montserrat w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-montserrat">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-montserrat">
                      No profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="font-montserrat">
                      <TableCell className="font-medium" style={{ color: "var(--primary-blue)" }}>
                        {p.full_name}
                      </TableCell>
                      <TableCell className="capitalize">{p.gender}</TableCell>
                      <TableCell>{p.city ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            p.profile_status === "active"
                              ? "border-green-300 text-green-700 bg-green-50"
                              : p.profile_status === "pending"
                                ? "border-amber-300 text-amber-700 bg-amber-50"
                                : "border-gray-300 text-gray-600"
                          }
                        >
                          {p.profile_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {STATUS_OPTIONS.map((opt) => (
                            <Button
                              key={opt.value}
                              variant={p.profile_status === opt.value ? "secondary" : "ghost"}
                              size="sm"
                              className="text-xs h-7 px-2"
                              disabled={updatingId === p.id || p.profile_status === opt.value}
                              onClick={() => updateStatus(p.id, opt.value)}
                              title={`Set to ${opt.label}`}
                            >
                              {opt.value === "active" && <CheckCircle className="w-3 h-3 mr-0.5" />}
                              {opt.value === "rejected" && <XCircle className="w-3 h-3 mr-0.5" />}
                              {opt.value === "suspended" && <PauseCircle className="w-3 h-3 mr-0.5" />}
                              {opt.label}
                            </Button>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>{p.profile_completion_pct ?? 0}%</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" asChild className="gap-1">
                          <Link href={`/profile/${p.id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
