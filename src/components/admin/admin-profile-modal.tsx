"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProfileView, type ProfileRecord, type ProfilePhoto, type PartnerPreferences } from "@/components/profile/profile-view";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface AdminProfileModalProps {
  profileId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (profileId: string, newStatus: string) => Promise<void>;
}

export function AdminProfileModal({ profileId, open, onOpenChange, onStatusUpdate }: AdminProfileModalProps) {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [photos, setPhotos] = useState<ProfilePhoto[]>([]);
  const [preferences, setPreferences] = useState<PartnerPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!open || !profileId) {
      setProfile(null);
      setPhotos([]);
      setPreferences(null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      const supabase = createClient();
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData as ProfileRecord);

        const { data: photosData } = await supabase
          .from("profile_photos")
          .select("id, photo_url, thumbnail_url, display_order, is_primary, status")
          .eq("profile_id", profileId)
          .order("display_order", { ascending: true });
        setPhotos(photosData ?? []);

        const { data: prefsData } = await supabase
          .from("partner_preferences")
          .select("*")
          .eq("profile_id", profileId)
          .maybeSingle();
        setPreferences(prefsData as PartnerPreferences | null);
      } catch (err) {
        console.error("[admin-profile-modal]", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [open, profileId]);

  const handleApprove = async () => {
    if (!profileId) return;
    setUpdating(true);
    try {
      await onStatusUpdate(profileId, "active");
      onOpenChange(false);
    } catch (err) {
      console.error("[admin-profile-modal-approve]", err);
    } finally {
      setUpdating(false);
    }
  };

  const handleReject = async () => {
    if (!profileId) return;
    setUpdating(true);
    try {
      await onStatusUpdate(profileId, "rejected");
      onOpenChange(false);
    } catch (err) {
      console.error("[admin-profile-modal-reject]", err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 rounded-xl" style={{ backgroundColor: "var(--pure-white)" }}>
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-playfair-display text-2xl font-bold" style={{ color: "var(--primary-blue)" }}>
              {profile ? profile.full_name : "Loading..."}
            </DialogTitle>
            {profile && (
              <Badge
                variant="outline"
                className={
                  profile.profile_status === "active"
                    ? "border-green-300 text-green-700 bg-green-50"
                    : profile.profile_status === "pending"
                      ? "border-amber-300 text-amber-700 bg-amber-50"
                      : "border-gray-300 text-gray-600"
                }
              >
                {profile.profile_status}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--accent-gold)" }} />
            </div>
          ) : profile ? (
            <ProfileView profile={profile} photos={photos} preferences={preferences} isOwnProfile={false} />
          ) : (
            <div className="text-center py-12 font-montserrat" style={{ color: "var(--primary-blue)" }}>
              Profile not found
            </div>
          )}
        </div>

        {profile && (
          <DialogFooter className="px-6 pb-6 flex-row gap-2 sm:justify-end border-t pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updating}
              className="font-montserrat"
            >
              Close
            </Button>
            {profile.profile_status !== "rejected" && (
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={updating || profile.profile_status === "rejected"}
                className="font-montserrat border-red-300 text-red-700 hover:bg-red-50"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
            )}
            {profile.profile_status !== "active" && (
              <Button
                onClick={handleApprove}
                disabled={updating || profile.profile_status === "active"}
                className="font-montserrat bg-green-600 hover:bg-green-700 text-white"
              >
                {updating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
