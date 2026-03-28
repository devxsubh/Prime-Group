"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, UserPlus, Mail, MapPin, RefreshCw, Loader2 } from "lucide-react";
import { AddAdminModal } from "@/components/admin/add-admin-modal";

interface ProfileInfo {
  full_name: string | null;
  city: string | null;
  profile_status: string | null;
}

interface AdminRow {
  id: string;
  email: string;
  role: string;
  status: string;
  permissions: string[] | null;
  created_at: string;
  profiles: ProfileInfo | ProfileInfo[] | null;
}

const cardStyle = {
  borderColor: "rgba(212, 175, 55, 0.25)",
};

function getProfile(profiles: ProfileInfo | ProfileInfo[] | null): ProfileInfo | null {
  if (!profiles) return null;
  return Array.isArray(profiles) ? profiles[0] ?? null : profiles;
}

export default function AdminAccessPage() {
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/access", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && Array.isArray(data.admins)) {
        setAdmins(data.admins);
      } else {
        setAdmins([]);
      }
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-playfair-display font-bold flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
            <Shield className="w-7 h-7" style={{ color: "var(--accent-gold)" }} />
            Admin Access
          </h1>
          <p className="font-montserrat text-sm mt-1 text-gray-600">
            Manage who has admin access. Admins have both user and admin permissions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            style={{ borderColor: "var(--accent-gold)" }}
            onClick={fetchAdmins}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button
            className="rounded-xl gap-2 font-montserrat"
            style={{ backgroundColor: "var(--primary-blue)" }}
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="w-4 h-4" />
            Add admin
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary-blue)" }} />
        </div>
      ) : admins.length === 0 ? (
        <Card className="rounded-xl border shadow-sm" style={cardStyle}>
          <CardContent className="py-12 text-center font-montserrat text-gray-500">
            No admins yet. Use &quot;Add admin&quot; to grant a user admin access and set their role and permissions.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {admins.map((admin) => {
            const profile = getProfile(admin.profiles);
            const name = profile?.full_name || "—";
            const city = profile?.city || "—";
            const perms = Array.isArray(admin.permissions) ? admin.permissions : [];
            return (
              <Card key={admin.id} className="rounded-xl border shadow-sm overflow-hidden" style={cardStyle}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "var(--primary-blue)" }}
                      >
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="font-playfair-display text-lg truncate" style={{ color: "var(--primary-blue)" }}>
                          {name}
                        </CardTitle>
                        <p className="font-montserrat text-sm text-gray-500 truncate">{admin.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex-shrink-0 rounded-lg font-montserrat"
                      style={{
                        backgroundColor: admin.role === "super_admin" ? "rgba(212, 175, 55, 0.2)" : "rgba(0, 82, 155, 0.1)",
                        color: "var(--primary-blue)",
                      }}
                    >
                      {admin.role === "super_admin" ? "Super Admin" : "Admin"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{admin.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-montserrat">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{city}</span>
                  </div>
                  {perms.length > 0 && (
                    <div className="pt-2 border-t" style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}>
                      <p className="text-xs font-montserrat font-medium text-gray-500 mb-1">Permissions</p>
                      <div className="flex flex-wrap gap-1">
                        {perms.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs rounded-md font-montserrat">
                            {p.replace(/_/g, " ")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {admin.role === "super_admin" && (
                    <p className="text-xs font-montserrat text-gray-500">Full system access</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AddAdminModal open={addOpen} onOpenChange={setAddOpen} onSuccess={fetchAdmins} />
    </div>
  );
}
