"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Textarea } from "@heroui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { AboutData } from "@/lib/firebase-data";
import { uploadToCloudinary, deleteFromCloudinary, extractPublicIdFromUrl } from "@/lib/cloudinary";

export function AboutManagement() {
    const [aboutData, setAboutData] = useState<AboutData>({
        title: "",
        description: "",
        content: "",
        mission: "",
        vision: "",
        values: [],
        image: "",
    });
    const [oldImagePublicId, setOldImagePublicId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Load data from Firestore
    useEffect(() => {
        const loadAboutData = async () => {
            try {
                setLoading(true);
                const aboutRef = doc(db, "about", "data");
                const aboutSnap = await getDoc(aboutRef);

                if (aboutSnap.exists()) {
                    const data = aboutSnap.data();
                    setAboutData({
                        title: data.title || "",
                        description: data.description || "",
                        content: data.content || "",
                        mission: data.mission || "",
                        vision: data.vision || "",
                        values: Array.isArray(data.values) ? data.values : [],
                        image: data.image || "",
                    });
                    if (data.image) {
                        const imageId = extractPublicIdFromUrl(data.image);
                        setOldImagePublicId(imageId);
                    }
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                alert("Không thể tải dữ liệu từ Firestore");
            } finally {
                setLoading(false);
            }
        };

        loadAboutData();
    }, []);

    const handleInputChange = (field: keyof AboutData, value: string | string[]) => {
        setAboutData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleValueChange = (index: number, value: string) => {
        const newValues = [...aboutData.values];
        newValues[index] = value;
        handleInputChange("values", newValues);
    };

    const addValue = () => {
        handleInputChange("values", [...aboutData.values, ""]);
    };

    const removeValue = (index: number) => {
        const newValues = aboutData.values.filter((_, i) => i !== index);
        handleInputChange("values", newValues);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Vui lòng chọn file ảnh");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 10MB");
            return;
        }

        try {
            setUploadingImage(true);

            if (oldImagePublicId) {
                try {
                    await deleteFromCloudinary(oldImagePublicId, "image");
                } catch (error) {
                    console.error("Lỗi khi xóa ảnh cũ:", error);
                }
            }

            const result = await uploadToCloudinary(file, "vinfast/about", "image");
            setAboutData((prev) => ({
                ...prev,
                image: result.url,
            }));

            setOldImagePublicId(result.public_id);
        } catch (error: any) {
            console.error("Lỗi khi tải ảnh:", error);
            alert(error.message || "Không thể tải ảnh lên Cloudinary");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const aboutRef = doc(db, "about", "data");
            await setDoc(aboutRef, aboutData, { merge: true });
            alert("Nội dung trang About đã được lưu thành công!");
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
                    <h2 className="text-2xl font-bold">Quản lý trang Về chúng tôi</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ảnh đại diện</label>
                        <div className="flex gap-2 items-center">
                            <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploadingImage} />
                            <Button color="primary" variant="flat" onPress={() => imageInputRef.current?.click()} isLoading={uploadingImage} disabled={uploadingImage}>
                                {uploadingImage ? "Đang tải..." : "Chọn ảnh"}
                            </Button>
                            {aboutData.image && (
                                <Button
                                    color="danger"
                                    variant="flat"
                                    size="sm"
                                    onPress={() => {
                                        setAboutData((prev) => ({ ...prev, image: "" }));
                                        setOldImagePublicId(null);
                                    }}
                                >
                                    Xóa ảnh
                                </Button>
                            )}
                        </div>
                        {aboutData.image && (
                            <div className="mt-2">
                                <img src={aboutData.image} alt="Preview" className="max-w-md rounded-lg border border-gray-300 shadow-sm" />
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                        <Input
                            type="text"
                            placeholder="Nhập tiêu đề trang About"
                            value={aboutData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả ngắn (SEO)</label>
                        <Textarea
                            placeholder="Nhập mô tả ngắn cho SEO"
                            value={aboutData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="bordered"
                            minRows={2}
                        />
                        <p className="text-xs text-gray-500">Mô tả này sẽ được sử dụng cho SEO meta description</p>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nội dung chính</label>
                        <Textarea
                            placeholder="Nhập nội dung chính của trang About"
                            value={aboutData.content}
                            onChange={(e) => handleInputChange("content", e.target.value)}
                            variant="bordered"
                            minRows={6}
                        />
                    </div>

                    {/* Mission */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sứ mệnh</label>
                            {aboutData.mission && (
                                <Button color="danger" variant="flat" size="sm" onPress={() => handleInputChange("mission", "")}>
                                    Xóa
                                </Button>
                            )}
                        </div>
                        <Textarea
                            placeholder="Nhập sứ mệnh của công ty (để trống nếu không cần hiển thị)"
                            value={aboutData.mission}
                            onChange={(e) => handleInputChange("mission", e.target.value)}
                            variant="bordered"
                            minRows={3}
                        />
                    </div>

                    {/* Vision */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tầm nhìn</label>
                            {aboutData.vision && (
                                <Button color="danger" variant="flat" size="sm" onPress={() => handleInputChange("vision", "")}>
                                    Xóa
                                </Button>
                            )}
                        </div>
                        <Textarea
                            placeholder="Nhập tầm nhìn của công ty (để trống nếu không cần hiển thị)"
                            value={aboutData.vision}
                            onChange={(e) => handleInputChange("vision", e.target.value)}
                            variant="bordered"
                            minRows={3}
                        />
                    </div>

                    {/* Values */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giá trị cốt lõi</label>
                            <div className="flex gap-2">
                                {aboutData.values.length > 0 && (
                                    <Button size="sm" color="danger" variant="flat" onPress={() => handleInputChange("values", [])}>
                                        Xóa tất cả
                                    </Button>
                                )}
                                <Button size="sm" color="primary" variant="flat" onPress={addValue}>
                                    Thêm giá trị
                                </Button>
                            </div>
                        </div>
                        {aboutData.values.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Không có giá trị cốt lõi. Nhấn "Thêm giá trị" để thêm mới.</p>
                        ) : (
                            aboutData.values.map((value, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder={`Giá trị ${index + 1}`}
                                        value={value}
                                        onChange={(e) => handleValueChange(index, e.target.value)}
                                        variant="bordered"
                                    />
                                    <Button color="danger" variant="flat" size="sm" onPress={() => removeValue(index)}>
                                        Xóa
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button color="primary" onClick={handleSave} className="min-w-32" isLoading={saving} disabled={saving}>
                            {saving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
}
