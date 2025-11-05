import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/config/cloudinary";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;
        const folder = formData.get("folder") as string | null;
        const resourceType = formData.get("resource_type") as "image" | "video" | "auto" | null;

        if (!file) {
            return NextResponse.json({ error: "Không có file được tải lên" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Convert to base64
        const base64String = buffer.toString("base64");
        const dataURI = `data:${file.type};base64,${base64String}`;

        // Upload to Cloudinary
        const uploadOptions: any = {
            folder: folder || "vinfast",
            resource_type: resourceType || "auto",
        };

        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload(dataURI, uploadOptions)
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });

        return NextResponse.json({
            success: true,
            url: (result as any).secure_url,
            public_id: (result as any).public_id,
        });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Lỗi khi tải file lên Cloudinary" }, { status: 500 });
    }
}
