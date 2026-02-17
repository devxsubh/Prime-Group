"use client";

import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ProfilePhotoUpload, getProfilePhotoFiles, clearProfilePhotoFiles } from "@/components/auth/profile-photo-upload";
import type { ProfilePhoto } from "./profile-view";
import { Loader2, GripVertical, Star, Trash2, Plus } from "lucide-react";

interface ProfilePhotoManagerProps {
  profileId: string;
  userId: string;
  initialPhotos: ProfilePhoto[];
  onUpdate: (newCount: number) => void;
}

export function ProfilePhotoManager({
  profileId,
  userId,
  initialPhotos,
  onUpdate,
}: ProfilePhotoManagerProps) {
  const [photos, setPhotos] = useState<ProfilePhoto[]>(initialPhotos);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const supabase = createClient();

  const setPrimary = async (photoId: string) => {
    setError(null);
    setSaving(true);
    try {
      await supabase.from("profile_photos").update({ is_primary: false }).eq("profile_id", profileId);
      const { error: e } = await supabase.from("profile_photos").update({ is_primary: true }).eq("id", photoId);
      if (e) throw e;
      setPhotos((prev) =>
        prev.map((p) => ({ ...p, is_primary: p.id === photoId }))
      );
      onUpdate(photos.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  const removePhoto = async (photoId: string) => {
    setError(null);
    setSaving(true);
    try {
      const { error: e } = await supabase.from("profile_photos").delete().eq("id", photoId).eq("user_id", userId);
      if (e) throw e;
      const next = photos.filter((p) => p.id !== photoId);
      if (next.length && !next.some((p) => p.is_primary)) {
        await supabase.from("profile_photos").update({ is_primary: true }).eq("id", next[0].id);
      }
      setPhotos(next);
      onUpdate(next.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove");
    } finally {
      setSaving(false);
    }
  };

  const moveOrder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= photos.length) return;
    const reordered = [...photos];
    const a = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = a;
    setPhotos(reordered.map((p, i) => ({ ...p, display_order: i })));
    setSaving(true);
    setError(null);
    try {
      for (let i = 0; i < reordered.length; i++) {
        await supabase.from("profile_photos").update({ display_order: i }).eq("id", reordered[i].id);
      }
      onUpdate(photos.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
    } finally {
      setSaving(false);
    }
  };

  const uploadNew = async () => {
    const files = getProfilePhotoFiles();
    if (!files.length) return;
    setAdding(true);
    setError(null);
    const bucket = "profile-photos";
    try {
      const added: ProfilePhoto[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}/${profileId}-${Date.now()}-${i}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600", upsert: false });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
        const { data: inserted, error: insertErr } = await supabase
          .from("profile_photos")
          .insert({
            profile_id: profileId,
            user_id: userId,
            photo_url: urlData.publicUrl,
            display_order: photos.length + i,
            is_primary: photos.length === 0 && i === 0,
            status: "pending",
          })
          .select("id, photo_url, thumbnail_url, display_order, is_primary, status")
          .single();
        if (insertErr) throw insertErr;
        if (inserted) added.push(inserted as ProfilePhoto);
      }
      if (added.length) setPhotos((prev) => [...prev, ...added]);
      clearProfilePhotoFiles();
      onUpdate(photos.length + added.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-playfair-display text-lg font-semibold" style={{ color: "var(--primary-blue)" }}>
        Profile photos
      </h3>
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      <div className="flex flex-wrap gap-4">
        {photos.map((p, idx) => (
          <div
            key={p.id}
            className="relative rounded-xl overflow-hidden border-2 flex-shrink-0 w-28 h-28 group"
            style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
          >
            <Image
              src={p.thumbnail_url || p.photo_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="112px"
            />
            {p.is_primary && (
              <span className="absolute top-1 left-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-current" /> Primary
              </span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 flex-wrap">
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                disabled={saving || p.is_primary}
                onClick={() => setPrimary(p.id)}
                title="Set as primary"
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                disabled={saving || idx === 0}
                onClick={() => moveOrder(idx, "up")}
                title="Move left"
              >
                <GripVertical className="h-4 w-4 rotate-90" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="h-8 w-8"
                disabled={saving || idx === photos.length - 1}
                onClick={() => moveOrder(idx, "down")}
                title="Move right"
              >
                <GripVertical className="h-4 w-4 -rotate-90" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-8 w-8"
                disabled={saving}
                onClick={() => removePhoto(p.id)}
                title="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border-2 border-dashed p-4" style={{ borderColor: "var(--accent-gold)" }}>
        <p className="text-sm font-montserrat mb-2" style={{ color: "var(--primary-blue)" }}>
          Add new photos
        </p>
        <ProfilePhotoUpload />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-2 gap-2"
          disabled={adding}
          onClick={uploadNew}
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Upload selected
        </Button>
      </div>
      <p className="text-sm font-montserrat opacity-80" style={{ color: "var(--primary-blue)" }}>
        Hover over a photo to set as primary, reorder, or remove.
      </p>
    </div>
  );
}
