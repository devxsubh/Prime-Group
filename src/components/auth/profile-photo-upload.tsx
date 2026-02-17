"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
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

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!canAdd || acceptedFiles.length === 0) return;
      setCompressing(true);
      const file = acceptedFiles[0];
      void compressProfileImage(file)
        .then(({ file: compressed, previewUrl, compressedSize }) => {
          const id = `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
          photoFilesMap.set(id, compressed);
          dispatch(
            addPhoto({
              id,
              previewUrl,
              compressedSize,
            })
          );
        })
        .finally(() => setCompressing(false));
    },
    [canAdd, dispatch]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] },
    maxFiles: 1,
    disabled: !canAdd || compressing,
    maxSize: 10 * 1024 * 1024, // 10MB before compress
    noClick: false,
    noKeyboard: false,
  });

  const handleRemove = (id: string) => {
    dispatch(removePhoto(id));
    photoFilesMap.delete(id);
  };

  return (
    <div className="space-y-4">
      <p className="font-montserrat text-sm" style={{ color: "var(--primary-blue)" }}>
        Add up to {MAX_PROFILE_PHOTOS} photos. They will be compressed to save space.
      </p>
      <div className="flex flex-wrap gap-4">
        {photos.map((p) => (
          <div
            key={p.id}
            className="relative h-28 w-28 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-100"
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
              className="absolute top-1 right-1 rounded-full bg-red-500 text-white p-1 hover:bg-red-600"
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
        {canAdd && (
          <div
            {...getRootProps()}
            className={`h-28 w-28 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragActive ? "border-[var(--accent-gold)] bg-[var(--accent-gold)]/10" : "border-gray-300 hover:border-[var(--primary-blue)]"
            }`}
          >
            <input {...getInputProps()} />
            {compressing ? (
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--primary-blue)" }} />
            ) : (
              <Upload className="h-8 w-8 mb-1" style={{ color: "var(--primary-blue)" }} />
            )}
            <span className="text-xs font-montserrat" style={{ color: "var(--primary-blue)" }}>
              {photos.length}/{MAX_PROFILE_PHOTOS}
            </span>
          </div>
        )}
      </div>
      {canAdd && (
        <Button
          type="button"
          onClick={() => open()}
          disabled={compressing}
          variant="outline"
          className="gap-2"
          style={{ borderColor: "var(--primary-blue)", color: "var(--primary-blue)" }}
        >
          {compressing ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
          Add photo
        </Button>
      )}
    </div>
  );
}

