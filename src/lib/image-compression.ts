import imageCompression from "browser-image-compression";

export const MAX_PROFILE_PHOTOS = 5;
export const MAX_IMAGE_SIZE_MB = 0.5;
export const MAX_WIDTH_OR_HEIGHT = 1200;
export const DEFAULT_QUALITY = 0.85;

export interface CompressionResult {
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
}

/**
 * Compress an image file for profile upload. Reduces size and dimensions.
 */
export async function compressProfileImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size;
  const options = {
    maxSizeMB: MAX_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_WIDTH_OR_HEIGHT,
    useWebWorker: true,
    fileType: "image/jpeg" as const,
    initialQuality: DEFAULT_QUALITY,
    alwaysKeepResolution: false,
  };

  const compressed = await imageCompression(file, options);
  const previewUrl = URL.createObjectURL(compressed);

  return {
    file: compressed,
    previewUrl,
    originalSize,
    compressedSize: compressed.size,
  };
}

/**
 * Compress multiple images (e.g. from input multiple or dropzone). Max 5.
 */
export async function compressProfileImages(
  files: File[]
): Promise<CompressionResult[]> {
  const slice = files.slice(0, MAX_PROFILE_PHOTOS);
  return Promise.all(slice.map(compressProfileImage));
}
