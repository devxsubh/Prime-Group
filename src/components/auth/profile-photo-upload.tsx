"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ImageIcon, Upload, X, Loader2, Info } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { compressProfileImage, MAX_PROFILE_PHOTOS } from "@/lib/image-compression";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addPhoto, removePhoto, selectPhotos, selectCanAddPhoto } from "@/store/slices/profileDraftSlice";

/** Map of photo id -> original File for upload (not stored in Redux) */
const photoFilesMap = new Map<string, File>();

export function getProfilePhotoFiles(): File[] {
  return Array.from(photoFilesMap.values());
}

export function clearProfilePhotoFiles(): void {
  photoFilesMap.clear();
}

export function ProfilePhotoUpload() {
  const dispatch = useAppDispatch();
  const photos = useAppSelector(selectPhotos);
  const canAdd = useAppSelector(selectCanAddPhoto);
  const [compressing, setCompressing] = useState(false);
  const [compressingIndex, setCompressingIndex] = useState<{ current: number; total: number } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const remaining = useMemo(() => Math.max(0, MAX_PROFILE_PHOTOS - photos.length), [photos.length]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!canAdd || acceptedFiles.length === 0) return;
      setUploadError(null);
      const files = acceptedFiles.slice(0, remaining);
      if (files.length === 0) return;

      setCompressing(true);
      void (async () => {
        try {
          for (let i = 0; i < files.length; i++) {
            setCompressingIndex({ current: i + 1, total: files.length });
            const file = files[i];
            const { file: compressed, previewUrl, compressedSize } = await compressProfileImage(file);
            const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            photoFilesMap.set(id, compressed);
            dispatch(addPhoto({ id, previewUrl, compressedSize }));
          }
        } catch (e) {
          setUploadError(e instanceof Error ? e.message : "Failed to add photo. Please try again.");
        } finally {
          setCompressingIndex(null);
          setCompressing(false);
        }
      })();
    },
    [canAdd, dispatch, remaining]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: Math.max(1, remaining),
    disabled: !canAdd || compressing,
    maxSize: 10 * 1024 * 1024, // 10MB before compress
    noClick: true,
    noKeyboard: false,
  });

  const handleRemove = (id: string) => {
    const photo = photos.find((p) => p.id === id);
    dispatch(removePhoto(id));
    photoFilesMap.delete(id);
    if (photo?.previewUrl) {
      try {
        URL.revokeObjectURL(photo.previewUrl);
      } catch {
        // ignore
      }
    }
  };

  useEffect(() => {
    return () => {
      // best-effort cleanup of previews we created
      for (const p of photos) {
        try {
          URL.revokeObjectURL(p.previewUrl);
        } catch {
          // ignore
        }
      }
    };
    // intentionally only on unmount; previews are still needed while component is alive
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-general text-sm leading-relaxed" style={{ color: "var(--primary-blue)" }}>
          Add up to {MAX_PROFILE_PHOTOS} photos. They will be compressed to save space.
        </p>
        <span className="text-xs font-general px-2 py-1 rounded-full border bg-white" style={{ borderColor: "rgba(212, 175, 55, 0.35)", color: "var(--primary-blue)" }}>
          {photos.length}/{MAX_PROFILE_PHOTOS}
        </span>
      </div>

      {uploadError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-general text-red-700">
          {uploadError}
        </div>
      )}

      {/* Primary drop area (better for mobile) */}
      {canAdd && (
        <div
          {...getRootProps()}
          className={[
            "w-full rounded-2xl border-2 border-dashed p-5 sm:p-6 transition-colors",
            "bg-white/70",
            isDragActive ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10" : "border-gray-300 hover:border-[var(--primary-blue)]",
            compressing ? "opacity-80" : "",
          ].join(" ")}
        >
          <input {...getInputProps()} />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "rgba(0, 51, 102, 0.08)" }}
              >
                {compressing ? (
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--primary-blue)" }} />
                ) : (
                  <ImageIcon className="h-5 w-5" style={{ color: "var(--primary-blue)" }} />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-general font-semibold text-sm" style={{ color: "var(--primary-blue)" }}>
                  {compressingIndex
                    ? `Optimizing photo ${compressingIndex.current}/${compressingIndex.total}...`
                    : isDragActive
                      ? "Drop to add"
                      : "Add photos"}
                </p>
                <p className="text-xs text-gray-600">
                  Tap to choose or drag & drop. JPG/PNG/WebP (max 10MB each).
                </p>
              </div>
            </div>
            <Button
              type="button"
              onClick={() => open()}
              disabled={compressing}
              className="rounded-xl font-general"
              style={{ backgroundColor: "var(--primary-blue)", color: "white" }}
            >
              {compressing ? "Working..." : "Choose"}
            </Button>
          </div>
          <div className="mt-4 flex items-start gap-2 text-xs text-gray-600">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              Tip: Upload 2-3 clear photos with good lighting. Your first photo will be the primary one.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-100"
          >
            <Image
              src={p.previewUrl}
              alt="Profile"
              fill
              className="object-cover"
              unoptimized
            />
            <button
              type="button"
              onClick={() => handleRemove(p.id)}
              className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-1.5 hover:bg-black/75"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
            {p.compressedSize != null && (
              <span className="absolute bottom-1 left-1 right-1 text-[10px] bg-black/60 text-white rounded px-1 truncate">
                {(p.compressedSize / 1024).toFixed(0)} KB
              </span>
            )}
          </div>
        ))}
      </div>

      {!canAdd && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-general text-amber-800 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          You’ve reached the maximum of {MAX_PROFILE_PHOTOS} photos. Remove one to add another.
        </div>
      )}
    </div>
  );
}

