"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { compressProfileImage, MAX_PROFILE_PHOTOS } from "@/lib/image-compression";
import { useDropzone } from "react-dropzone";
import type { ProfilePhoto } from "./profile-view";
import { Loader2, Star, Trash2, Plus, Upload } from "lucide-react";

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0 || photos.length >= MAX_PROFILE_PHOTOS) return;
    setAdding(true);
    setError(null);
    const bucket = "profile-photos";
    try {
      const added: ProfilePhoto[] = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        
        // compress image internally before uploading
        const { file: compressed } = await compressProfileImage(file);
        
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${userId}/${profileId}-${Date.now()}-${i}.${ext}`;
        
        const { error: uploadErr } = await supabase.storage.from(bucket).upload(path, compressed, { cacheControl: "3600", upsert: false });
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
      if (added.length) {
        setPhotos((prev) => [...prev, ...added]);
        onUpdate(photos.length + added.length);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setAdding(false);
    }
  }, [photos, userId, profileId, supabase, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 5,
    disabled: adding || photos.length >= MAX_PROFILE_PHOTOS,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-playfair-display text-2xl font-bold" style={{ color: "var(--primary-blue)" }}>
          Profile Photos
        </h3>
        <span className="text-sm font-montserrat px-3 py-1 bg-gray-100 rounded-full text-gray-600 font-medium">
          {photos.length} / {MAX_PROFILE_PHOTOS} uploaded
        </span>
      </div>
      
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 shadow-sm border border-red-100">{error}</div>
      )}
      
      <div className="flex flex-wrap gap-5">
        {photos.map((p) => (
          <div
            key={p.id}
            className="relative rounded-2xl overflow-hidden border bg-gray-50 flex-shrink-0 w-36 h-36 group shadow-sm transition-all hover:shadow-md"
            style={{ borderColor: p.is_primary ? "var(--accent-gold)" : "rgba(212, 175, 55, 0.15)", borderWidth: p.is_primary ? "3px" : "1px" }}
          >
            <Image
              src={p.thumbnail_url || p.photo_url}
              alt=""
              fill
              className="object-cover"
              unoptimized
              sizes="144px"
            />
            {p.is_primary && (
              <span className="absolute top-2 left-2 rounded-md bg-[var(--accent-gold)] px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-sm flex items-center gap-1">
                <Star className="h-2.5 w-2.5 fill-current" /> Primary
              </span>
            )}

            <div className="absolute top-2 right-2">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="h-8 w-8 rounded-full shadow-md opacity-90 hover:opacity-100 transition-opacity"
                disabled={saving || adding}
                onClick={() => removePhoto(p.id)}
                title="Remove photo"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {!p.is_primary && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-16px)]">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="w-full text-[11px] h-8 bg-white/95 hover:bg-white text-[var(--primary-blue)] font-bold shadow-sm transition-all"
                  disabled={saving || adding}
                  onClick={() => setPrimary(p.id)}
                >
                  <Star className="h-3 w-3 mr-1.5 fill-current opacity-70 text-[var(--accent-gold)]" /> Set Primary
                </Button>
              </div>
            )}
          </div>
        ))}

        {photos.length < MAX_PROFILE_PHOTOS && (
          <div
            {...getRootProps()}
            className={`h-36 w-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${
              isDragActive ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10 scale-105" : "border-gray-300 hover:border-[var(--primary-blue)] bg-gray-50/50 hover:bg-gray-50"
            }`}
          >
            <input {...getInputProps()} />
            {adding ? (
              <Loader2 className="h-7 w-7 animate-spin mb-2" style={{ color: "var(--primary-blue)" }} />
            ) : (
              <Plus className="h-7 w-7 mb-2 text-gray-400 group-hover:text-[var(--primary-blue)] transition-colors" />
            )}
            <span className="text-sm font-montserrat text-center px-3 text-gray-500 font-semibold">
              {adding ? "Uploading..." : "Add Photo"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
