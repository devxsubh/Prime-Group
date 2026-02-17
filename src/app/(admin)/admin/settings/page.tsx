"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function AdminSettingsPage() {
  const cardStyle = { borderColor: "rgba(212, 175, 55, 0.25)", backgroundColor: "white" };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-playfair-display font-bold flex items-center gap-2" style={{ color: "var(--primary-blue)" }}>
          <Settings className="w-7 h-7" style={{ color: "var(--accent-gold)" }} />
          Settings
        </h1>
        <p className="font-montserrat text-sm mt-1 text-gray-600">
          Admin panel configuration.
        </p>
      </div>

      <Card className="rounded-xl border shadow-sm" style={cardStyle}>
        <CardHeader>
          <CardTitle className="font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            General
          </CardTitle>
        </CardHeader>
        <CardContent className="font-montserrat text-sm text-gray-600">
          <p>Settings and configuration options can be added here (e.g. site name, approval workflow, email templates).</p>
        </CardContent>
      </Card>
    </div>
  );
}
