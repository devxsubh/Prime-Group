"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Search, Loader2, ChevronRight, User, Shield, ShieldCheck } from "lucide-react";

const ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin", description: "Full system access", icon: ShieldCheck },
  { value: "admin", label: "Admin", description: "Custom permissions", icon: Shield },
] as const;

const PERMISSION_OPTIONS: { value: string; label: string }[] = [
  { value: "manage_profiles", label: "Manage profiles" },
  { value: "manage_blogs", label: "Manage blogs" },
  { value: "manage_faqs", label: "Manage FAQs" },
  { value: "manage_contact", label: "Manage contact" },
  { value: "manage_categories", label: "Manage categories" },
  { value: "view_revenue", label: "View revenue" },
  { value: "manage_pricing", label: "Manage pricing" },
  { value: "manage_settings", label: "Manage settings" },
  { value: "manage_admins", label: "Manage admins" },
];

interface ProfileInfo {
  full_name?: string | null;
  city?: string | null;
}

interface UserOption {
  id: string;
  email: string;
  created_at?: string;
  profiles: ProfileInfo | ProfileInfo[] | null;
}

function getDisplayName(u: UserOption): string {
  const p = Array.isArray(u.profiles) ? u.profiles[0] : u.profiles;
  return (p?.full_name?.trim()) || u.email || "—";
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

interface AddAdminModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddAdminModal({ open, onOpenChange, onSuccess }: AddAdminModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 150);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [role, setRole] = useState<"admin" | "super_admin">("admin");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (search: string) => {
    setLoadingUsers(true);
    setFetchError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/access/users?${params.toString()}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setFetchError(data.error ?? "Could not load users.");
        setUsers([]);
        return;
      }
      if (Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
    } catch {
      setFetchError("Could not load users.");
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    fetchUsers(debouncedSearch);
  }, [open, debouncedSearch, fetchUsers]);

  useEffect(() => {
    if (!open) {
      setStep(1);
      setSearchQuery("");
      setSelectedUser(null);
      setRole("admin");
      setPermissions([]);
      setError(null);
      setFetchError(null);
    }
  }, [open]);

  const togglePermission = (key: string) => {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const handleNext = () => {
    if (selectedUser) {
      setError(null);
      setStep(2);
    } else {
      setError("Select a user to continue.");
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id, role, permissions }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to add admin.");
        return;
      }
      onSuccess();
      onOpenChange(false);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const cardBorder = "rgba(212, 175, 55, 0.25)";
  const cardHover = "rgba(212, 175, 55, 0.12)";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl max-w-2xl max-h-[90vh] overflow-hidden flex flex-col font-montserrat"
        style={{ borderColor: cardBorder }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="font-playfair-display flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
            <UserPlus className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
            Add Admin
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? "Search and select a user, then choose role and permissions." : "Set role and permissions for the selected user."}
          </DialogDescription>
          <div className="flex gap-2 mt-2">
            <span
              className={`text-sm font-medium px-2 py-1 rounded-lg ${step === 1 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              style={step === 1 ? { backgroundColor: "var(--primary-blue)" } : {}}
            >
              1. Select user
            </span>
            <span
              className={`text-sm font-medium px-2 py-1 rounded-lg ${step === 2 ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
              style={step === 2 ? { backgroundColor: "var(--primary-blue)" } : {}}
            >
              2. Role & permissions
            </span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto min-h-0 py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by email or name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9 rounded-xl border-gray-200"
                  autoComplete="off"
                />
                {loadingUsers && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  </div>
                )}
              </div>

              <div className="min-h-[200px]">
                {fetchError && (
                  <p className="text-center text-red-600 py-4 text-sm">{fetchError}</p>
                )}
                {!fetchError && loadingUsers && users.length === 0 && (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-blue)" }} />
                  </div>
                )}
                {!fetchError && !loadingUsers && users.length > 0 && (
                  <>
                    {searchQuery.trim() && (
                      <p className="text-sm text-gray-500 mb-2">
                        {users.length} user{users.length !== 1 ? "s" : ""} found. User exists.
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {users.map((u) => {
                        const isSelected = selectedUser?.id === u.id;
                        return (
                          <button
                            type="button"
                            key={u.id}
                            onClick={() => setSelectedUser(u)}
                            className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                              isSelected ? "border-primary shadow-md" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                            style={{
                              borderColor: isSelected ? "var(--primary-blue)" : undefined,
                              backgroundColor: isSelected ? "rgba(0, 82, 155, 0.06)" : undefined,
                            }}
                          >
                            <div
                              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
                              style={{ backgroundColor: "var(--primary-blue)" }}
                            >
                              {getDisplayName(u).charAt(0).toUpperCase() || "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 truncate">{getDisplayName(u)}</p>
                              <p className="text-sm text-gray-500 truncate">{u.email}</p>
                            </div>
                            {isSelected && (
                              <div className="rounded-full p-1" style={{ backgroundColor: "var(--accent-gold)" }}>
                                <User className="w-4 h-4 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
                {!fetchError && !loadingUsers && users.length === 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-center">
                    {searchQuery.trim() ? (
                      <>
                        <p className="text-amber-800 font-medium">No user found. User doesn&apos;t exist.</p>
                        <p className="text-amber-700 text-sm mt-1">Try a different email or name.</p>
                      </>
                    ) : (
                      <p className="text-gray-600">No users in the system yet. Users with role &quot;user&quot; will appear here.</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 2 && selectedUser && (
            <div className="space-y-6">
              <div className="rounded-xl border p-4 flex items-center gap-4" style={{ borderColor: cardBorder, backgroundColor: "rgba(0, 82, 155, 0.04)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold" style={{ backgroundColor: "var(--primary-blue)" }}>
                  {getDisplayName(selectedUser).charAt(0).toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{getDisplayName(selectedUser)}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: "var(--primary-blue)" }}>Role</Label>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((r) => {
                      const Icon = r.icon;
                      const isSelected = role === r.value;
                      return (
                        <button
                          type="button"
                          key={r.value}
                          onClick={() => setRole(r.value as "admin" | "super_admin")}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                            isSelected ? "border-primary" : "border-gray-200 hover:border-gray-300"
                          }`}
                          style={{
                            borderColor: isSelected ? "var(--primary-blue)" : undefined,
                            backgroundColor: isSelected ? "rgba(0, 82, 155, 0.06)" : undefined,
                          }}
                        >
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isSelected ? "var(--accent-gold)" : "var(--primary-blue)", color: "white" }}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{r.label}</p>
                            <p className="text-xs text-gray-500">{r.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <Label className="text-base font-semibold mb-3 block" style={{ color: "var(--primary-blue)" }}>Permissions</Label>
                  <div className="rounded-xl border p-4 max-h-56 overflow-y-auto" style={{ borderColor: cardBorder }}>
                    <div className="grid grid-cols-1 gap-2">
                      {PERMISSION_OPTIONS.map((p) => (
                        <label
                          key={p.value}
                          className="flex items-center gap-2 cursor-pointer text-sm py-1"
                        >
                          <Checkbox
                            checked={role === "super_admin" || permissions.includes(p.value)}
                            disabled={role === "super_admin"}
                            onCheckedChange={() => togglePermission(p.value)}
                          />
                          {p.label}
                        </label>
                      ))}
                    </div>
                  </div>
                  {role === "super_admin" && (
                    <p className="text-xs text-gray-500 mt-2">Super Admin has all permissions.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 sm:gap-0 border-t pt-4">
          {step === 1 ? (
            <>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button type="button" onClick={handleNext} className="rounded-xl gap-2" style={{ backgroundColor: "var(--primary-blue)" }}>
                Next: Role & permissions
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={handleBack} disabled={submitting} className="rounded-xl">
                Back
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl gap-2"
                style={{ backgroundColor: "var(--primary-blue)" }}
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirm & add admin
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
