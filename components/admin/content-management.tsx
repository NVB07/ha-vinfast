"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ContentData } from "@/types";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/cloudinary";

export function ContentManagement() {
    const [contentData, setContentData] = useState<ContentData>({
        poster: "",
        subTitle: "",
        subtitleSlide: "",
        title: "",
        titleSlide: "",
        video: "",
    });
    const [oldPosterPublicId, setOldPosterPublicId] = useState<string | null>(null);
    const [oldVideoPublicId, setOldVideoPublicId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPoster, setUploadingPoster] = useState(false);
    const [uploadingVideo, setUploadingVideo] = useState(false);
    const posterInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // Load data from Firestore
    useEffect(() => {
        const loadBannerData = async () => {
            try {
                setLoading(true);
                const bannerRef = doc(db, "home", "banner");
                const bannerSnap = await getDoc(bannerRef);

                if (bannerSnap.exists()) {
                    const data = bannerSnap.data();
                    setContentData({
                        poster: data.poster || "",
                        subTitle: data.subTitle || "",
                        subtitleSlide: data.subtitleSlide || "",
                        title: data.title || "",
                        titleSlide: data.titleSlide || "",
                        video: data.video || "",
                    });
                    // Extract public IDs for old files
                    if (data.poster) {
                        const posterId = extractPublicIdFromUrl(data.poster);
                        setOldPosterPublicId(posterId);
                    }
                    if (data.video) {
                        const videoId = extractPublicIdFromUrl(data.video);
                        setOldVideoPublicId(videoId);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                alert("Không thể tải dữ liệu từ Firestore");
            } finally {
                setLoading(false);
            }
        };

        loadBannerData();
    }, []);

    const handleInputChange = (field: keyof ContentData, value: string) => {
        setContentData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh");
            return;
        }

        try {
            setUploadingPoster(true);

            // Delete old poster if exists
            if (oldPosterPublicId) {
                try {
                    await deleteFromCloudinary(oldPosterPublicId, "image");
                } catch (error) {
                    console.error("Lỗi khi xóa poster cũ:", error);
                }
            }

            // Upload new poster
            const result = await uploadToCloudinary(file, "vinfast/banner", "image");
            setContentData((prev) => ({
                ...prev,
                poster: result.url,
            }));

            // Update old poster public ID
            setOldPosterPublicId(result.public_id);
        } catch (error: any) {
            console.error("Lỗi khi tải poster:", error);
            alert(error.message || "Không thể tải poster lên Cloudinary");
        } finally {
            setUploadingPoster(false);
        }
    };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("video/")) {
            alert("Vui lòng chọn file video");
            return;
        }

        try {
            setUploadingVideo(true);

            // Delete old video if exists
            if (oldVideoPublicId) {
                try {
                    await deleteFromCloudinary(oldVideoPublicId, "video");
                } catch (error) {
                    console.error("Lỗi khi xóa video cũ:", error);
                }
            }

            // Upload new video
            const result = await uploadToCloudinary(file, "vinfast/banner", "video");
            setContentData((prev) => ({
                ...prev,
                video: result.url,
            }));

            // Update old video public ID
            setOldVideoPublicId(result.public_id);
        } catch (error: any) {
            console.error("Lỗi khi tải video:", error);
            alert(error.message || "Không thể tải video lên Cloudinary");
        } finally {
            setUploadingVideo(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const bannerRef = doc(db, "home", "banner");
            await setDoc(bannerRef, contentData, { merge: true });
            alert("Nội dung đã được lưu thành công!");
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Không thể lưu dữ liệu. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3">
                    <h2 className="text-2xl font-bold">Quản lý nội dung</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Poster Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Poster (Ảnh)</label>
                        <div className="flex gap-2 items-center">
                            <input ref={posterInputRef} type="file" accept="image/*" onChange={handlePosterUpload} className="hidden" disabled={uploadingPoster} />
                            <Button color="primary" variant="flat" onPress={() => posterInputRef.current?.click()} isLoading={uploadingPoster} disabled={uploadingPoster}>
                                {uploadingPoster ? "Đang tải..." : "Chọn ảnh"}
                            </Button>
                            {contentData.poster && (
                                <Button
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                    onPress={() => {
                                        setContentData((prev) => ({ ...prev, poster: "" }));
                                        setOldPosterPublicId(null);
                                    }}
                                >
                                    Xóa ảnh
                                </Button>
                            )}
                        </div>
                        {contentData.poster && (
                            <div className="mt-2">
                                <img
                                    src={contentData.poster}
                                    alt="Poster preview"
                                    className="max-w-xs rounded-lg border border-gray-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <Input
                            type="text"
                            placeholder="Nhập tiêu đề"
                            value={contentData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* SubTitle */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">SubTitle</label>
                        <Input
                            type="text"
                            placeholder="Nhập phụ đề"
                            value={contentData.subTitle}
                            onChange={(e) => handleInputChange("subTitle", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* Title Slide */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title Slide</label>
                        <Input
                            type="text"
                            placeholder="Nhập tiêu đề slide"
                            value={contentData.titleSlide}
                            onChange={(e) => handleInputChange("titleSlide", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* Subtitle Slide */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtitle Slide</label>
                        <Input
                            type="text"
                            placeholder="Nhập phụ đề slide"
                            value={contentData.subtitleSlide}
                            onChange={(e) => handleInputChange("subtitleSlide", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video</label>
                        <div className="flex gap-2 items-center">
                            <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" disabled={uploadingVideo} />
                            <Button color="primary" variant="flat" onPress={() => videoInputRef.current?.click()} isLoading={uploadingVideo} disabled={uploadingVideo}>
                                {uploadingVideo ? "Đang tải..." : "Chọn video"}
                            </Button>
                            {contentData.video && (
                                <Button
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                    onPress={() => {
                                        setContentData((prev) => ({ ...prev, video: "" }));
                                        setOldVideoPublicId(null);
                                    }}
                                >
                                    Xóa video
                                </Button>
                            )}
                        </div>
                        {contentData.video && (
                            <div className="mt-2">
                                <video
                                    src={contentData.video}
                                    controls
                                    className="max-w-xs rounded-lg border border-gray-300"
                                    onError={(e) => {
                                        (e.target as HTMLVideoElement).style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4">
                        <Button color="primary" onClick={handleSave} className="min-w-24" isLoading={saving} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu"}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
