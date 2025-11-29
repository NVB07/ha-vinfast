"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Textarea } from "@heroui/input";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { ContactData } from "@/lib/firebase-data";

export function ContactManagement() {
    const [contactData, setContactData] = useState<ContactData>({
        title: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        workingHours: "",
        mapEmbedUrl: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load data from Firestore
    useEffect(() => {
        const loadContactData = async () => {
            try {
                setLoading(true);
                const contactRef = doc(db, "contact", "data");
                const contactSnap = await getDoc(contactRef);

                if (contactSnap.exists()) {
                    const data = contactSnap.data();
                    setContactData({
                        title: data.title || "",
                        description: data.description || "",
                        address: data.address || "",
                        phone: data.phone || "",
                        email: data.email || "",
                        workingHours: data.workingHours || "",
                        mapEmbedUrl: data.mapEmbedUrl || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                alert("Không thể tải dữ liệu từ Firestore");
            } finally {
                setLoading(false);
            }
        };

        loadContactData();
    }, []);

    const handleInputChange = (field: keyof ContactData, value: string) => {
        setContactData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const contactRef = doc(db, "contact", "data");
            await setDoc(contactRef, contactData, { merge: true });
            alert("Nội dung trang Liên hệ đã được lưu thành công!");
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
                    <h2 className="text-2xl font-bold">Quản lý trang Liên hệ</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Title */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiêu đề</label>
                        <Input
                            type="text"
                            placeholder="Nhập tiêu đề trang Liên hệ"
                            value={contactData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            variant="bordered"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả</label>
                        <Textarea
                            placeholder="Nhập mô tả trang Liên hệ"
                            value={contactData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="bordered"
                            minRows={3}
                        />
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Thông tin liên hệ</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
                            <Textarea
                                placeholder="Nhập địa chỉ"
                                value={contactData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                variant="bordered"
                                minRows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Số điện thoại</label>
                            <Input
                                type="tel"
                                placeholder="1900 1234"
                                value={contactData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                variant="bordered"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <Input
                                type="email"
                                placeholder="info@vinfast.vn"
                                value={contactData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                variant="bordered"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Giờ làm việc</label>
                            <Input
                                type="text"
                                placeholder="Thứ 2 - Thứ 6: 8:00 - 17:00"
                                value={contactData.workingHours}
                                onChange={(e) => handleInputChange("workingHours", e.target.value)}
                                variant="bordered"
                            />
                        </div>
                    </div>

                    {/* Map */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Maps Embed URL</label>
                        <Input
                            type="url"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            value={contactData.mapEmbedUrl}
                            onChange={(e) => handleInputChange("mapEmbedUrl", e.target.value)}
                            variant="bordered"
                        />
                        <p className="text-xs text-gray-500">
                            Để lấy embed URL: Vào Google Maps → Chia sẻ → Nhúng bản đồ → Sao chép src của iframe
                        </p>
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

