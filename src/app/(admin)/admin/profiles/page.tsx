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
import { Users, Search, RefreshCw, Eye, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AdminProfileModal } from "@/components/admin/admin-profile-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    const supabase = createClient();
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, gender, city, profile_status, profile_completion_pct, created_at")
        .is("deleted_at", null)
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

  const deleteProfile = async (profileId: string) => {
    if (!confirm("Are you sure you want to delete this profile? This will hide it from the site.")) return;
    const supabase = createClient();
    setDeletingId(profileId);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ deleted_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", profileId);
      if (error) throw error;
      setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
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
          <p className="font-general text-sm mt-1 text-gray-600">
            View and manage user profiles.
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-xl font-general"
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
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-general"
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
                  <TableHead className="font-general">Name</TableHead>
                  <TableHead className="font-general">Gender</TableHead>
                  <TableHead className="font-general">City</TableHead>
                  <TableHead className="font-general">Status</TableHead>
                  <TableHead className="font-general">Change status</TableHead>
                  <TableHead className="font-general">Completion</TableHead>
                  <TableHead className="font-general">Created</TableHead>
                  <TableHead className="font-general w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-general">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500 font-general">
                      No profiles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id} className="font-general">
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
                        <Select
                          value={p.profile_status}
                          onValueChange={(value) => updateStatus(p.id, value)}
                          disabled={updatingId === p.id}
                        >
                          <SelectTrigger className="w-[140px] h-8 text-xs font-general">
                            <SelectValue placeholder="Change status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="font-general text-sm">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{p.profile_completion_pct ?? 0}%</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(p.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1"
                            onClick={() => setViewingProfileId(p.id)}
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteProfile(p.id)}
                            disabled={deletingId === p.id}
                            title="Delete profile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AdminProfileModal
        profileId={viewingProfileId}
        open={viewingProfileId !== null}
        onOpenChange={(open) => {
          if (!open) setViewingProfileId(null);
        }}
        onStatusUpdate={updateStatus}
      />
    </div>
  );
}
