import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";

export async function POST(request: NextRequest) {
    try {
        const { public_id, resource_type } = await request.json();

        if (!public_id) {
            return NextResponse.json({ error: "Không có public_id" }, { status: 400 });
        }

        // Extract public_id from URL if it's a full URL
        let actualPublicId = public_id;
        if (public_id.includes("cloudinary.com")) {
            // Extract public_id from Cloudinary URL
            const urlParts = public_id.split("/");
            const uploadIndex = urlParts.findIndex((part: string) => part === "upload");
            if (uploadIndex !== -1 && uploadIndex + 1 < urlParts.length) {
                const afterUpload = urlParts.slice(uploadIndex + 2).join("/");
                actualPublicId = afterUpload.split(".")[0]; // Remove file extension
            }
        }

        const result = await cloudinary.uploader.destroy(actualPublicId, {
            resource_type: resource_type || "auto",
        });

        return NextResponse.json({
            success: true,
            result,
        });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: error.message || "Lỗi khi xóa file trên Cloudinary" }, { status: 500 });
    }
}
