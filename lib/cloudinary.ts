/**
 * Client-side utility functions for Cloudinary
 */

export interface UploadResponse {
    success: boolean;
    url: string;
    public_id: string;
}

export interface DeleteResponse {
    success: boolean;
    result: any;
}

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(file: File, folder?: string, resourceType?: "image" | "video" | "auto"): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
        formData.append("folder", folder);
    }
    if (resourceType) {
        formData.append("resource_type", resourceType);
    }

    const response = await fetch("/api/cloudinary/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi tải file lên");
    }

    return response.json();
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string, resourceType?: "image" | "video" | "auto"): Promise<DeleteResponse> {
    const response = await fetch("/api/cloudinary/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            public_id: publicId,
            resource_type: resourceType,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Lỗi khi xóa file");
    }

    return response.json();
}

/**
 * Extract public_id from Cloudinary URL
 * Examples:
 * - https://res.cloudinary.com/demo/image/upload/v1234567890/folder/image.jpg
 *   -> folder/image
 * - https://res.cloudinary.com/demo/video/upload/v1234567890/folder/video.mp4
 *   -> folder/video
 */
export function extractPublicIdFromUrl(url: string): string | null {
    if (!url || !url.includes("cloudinary.com")) {
        return null;
    }

    try {
        // Parse URL
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/");

        // Find "upload" index
        const uploadIndex = pathParts.findIndex((part) => part === "upload");
        if (uploadIndex === -1 || uploadIndex + 1 >= pathParts.length) {
            return null;
        }

        // Get parts after "upload" (skip version if present)
        // Structure: /[resource_type]/upload/[version]/[folder]/[filename]
        let partsAfterUpload = pathParts.slice(uploadIndex + 1);

        // Remove version if present (starts with 'v' followed by digits)
        if (partsAfterUpload.length > 0 && /^v\d+$/.test(partsAfterUpload[0])) {
            partsAfterUpload = partsAfterUpload.slice(1);
        }

        // Join remaining parts and remove file extension
        if (partsAfterUpload.length === 0) {
            return null;
        }

        const fullPath = partsAfterUpload.join("/");
        // Remove file extension (everything after last dot)
        const lastDotIndex = fullPath.lastIndexOf(".");
        if (lastDotIndex !== -1) {
            return fullPath.substring(0, lastDotIndex);
        }

        return fullPath;
    } catch (error) {
        console.error("Error extracting public_id:", error);
        return null;
    }
}
