/**
 * Cloud Storage Service - GCP Cloud Storage Integration
 * Uses Manus built-in S3-compatible storage
 */

import { storagePut } from "../storage";

interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload file to cloud storage
 */
export async function uploadFile(
  file: Buffer | Uint8Array | string,
  fileName: string,
  contentType: string,
  folder: string = "uploads"
): Promise<UploadResult> {
  try {
    // Generate unique file key with folder structure
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileKey = `${folder}/${timestamp}-${randomSuffix}-${fileName}`;

    // Upload to S3-compatible storage
    const result = await storagePut(fileKey, file, contentType);

    return {
      success: true,
      url: result.url,
      key: result.key,
    };
  } catch (error: any) {
    console.error("File upload failed:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Upload image file
 */
export async function uploadImage(
  imageBuffer: Buffer,
  fileName: string,
  folder: string = "images"
): Promise<UploadResult> {
  // Determine content type from file extension
  const ext = fileName.split(".").pop()?.toLowerCase();
  const contentTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  const contentType = contentTypeMap[ext || ""] || "image/jpeg";

  return uploadFile(imageBuffer, fileName, contentType, folder);
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  imageBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  return uploadImage(imageBuffer, fileName, "products");
}

/**
 * Upload gallery image
 */
export async function uploadGalleryImage(
  imageBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  return uploadImage(imageBuffer, fileName, "gallery");
}

/**
 * Upload activity image
 */
export async function uploadActivityImage(
  imageBuffer: Buffer,
  fileName: string
): Promise<UploadResult> {
  return uploadImage(imageBuffer, fileName, "activities");
}

/**
 * Generate mock image URL for development
 */
export function getMockImageUrl(category: string, index: number = 1): string {
  const mockImages: Record<string, string[]> = {
    products: [
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
    ],
    gallery: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    ],
    activities: [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800",
    ],
  };

  const images = mockImages[category] || mockImages.products;
  return images[index % images.length];
}
