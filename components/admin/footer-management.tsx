"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export interface FooterData {
    description: string;
    facebookUrl: string;
    tiktokUrl: string;
    address: string;
    hotline: string;
    email: string;
}

export function FooterManagement() {
    const [footerData, setFooterData] = useState<FooterData>({
        description: "",
        facebookUrl: "",
        tiktokUrl: "",
        address: "",
        hotline: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Load data from Firestore
    useEffect(() => {
        const loadFooterData = async () => {
            try {
                setLoading(true);
                const footerRef = doc(db, "footer", "data");
                const footerSnap = await getDoc(footerRef);

                if (footerSnap.exists()) {
                    const data = footerSnap.data();
                    setFooterData({
                        description: data.description || "",
                        facebookUrl: data.facebookUrl || "",
                        tiktokUrl: data.tiktokUrl || "",
                        address: data.address || "",
                        hotline: data.hotline || "",
                        email: data.email || "",
                    });
                }
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu footer:", error);
                alert("Không thể tải dữ liệu từ Firestore");
            } finally {
                setLoading(false);
            }
        };

        loadFooterData();
    }, []);

    const handleInputChange = (field: keyof FooterData, value: string) => {
        setFooterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const footerRef = doc(db, "footer", "data");
            await setDoc(footerRef, footerData, { merge: true });
            alert("Thông tin footer đã được lưu thành công!");
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
                    <h2 className="text-2xl font-bold">Quản lý Footer</h2>
                </CardHeader>
                <CardBody className="space-y-6">
                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mô tả công ty</label>
                        <Input
                            type="text"
                            placeholder="Nhập mô tả công ty"
                            value={footerData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            variant="bordered"
                            classNames={{
                                input: "min-h-[80px]",
                            }}
                        />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Liên kết mạng xã hội</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook URL</label>
                            <Input
                                type="url"
                                placeholder="https://facebook.com/..."
                                value={footerData.facebookUrl}
                                onChange={(e) => handleInputChange("facebookUrl", e.target.value)}
                                variant="bordered"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">TikTok URL</label>
                            <Input
                                type="url"
                                placeholder="https://tiktok.com/@..."
                                value={footerData.tiktokUrl}
                                onChange={(e) => handleInputChange("tiktokUrl", e.target.value)}
                                variant="bordered"
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-2">Thông tin liên hệ</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Địa chỉ</label>
                            <Input
                                type="text"
                                placeholder="Nhập địa chỉ"
                                value={footerData.address}
                                onChange={(e) => handleInputChange("address", e.target.value)}
                                variant="bordered"
                                classNames={{
                                    input: "min-h-[60px]",
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hotline</label>
                            <Input
                                type="tel"
                                placeholder="1900 1234"
                                value={footerData.hotline}
                                onChange={(e) => handleInputChange("hotline", e.target.value)}
                                variant="bordered"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                            <Input
                                type="email"
                                placeholder="info@vinfast.vn"
                                value={footerData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                variant="bordered"
                            />
                        </div>
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
