"use client";

import { useState, useEffect } from "react";
import { ContactData } from "@/lib/firebase-data";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { title } from "@/components/primitives";

export default function ContactPage() {
    const [contactData, setContactData] = useState<ContactData | null>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    useEffect(() => {
        const loadContactData = async () => {
            try {
                const contactRef = doc(db, "contact", "data");
                const contactSnap = await getDoc(contactRef);
                if (contactSnap.exists()) {
                    setContactData(contactSnap.data() as ContactData);
                }
            } catch (error) {
                console.error("Error loading contact data:", error);
            } finally {
                setLoading(false);
            }
        };
        loadContactData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch("/api/contact/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus("success");
                setFormData({ name: "", phone: "", address: "", message: "" });
            } else {
                setSubmitStatus("error");
                alert(data.error || "Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
            alert("Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            {/* Title Section */}
            <h1 className={title()}>{contactData?.title || "Liên hệ với chúng tôi"}</h1>
            {contactData?.description && <p className="text-lg text-default-600 mt-4 mb-8">{contactData.description}</p>}

            {/* Contact Information */}
            <div className="space-y-6 mb-12 text-left">
                {contactData?.address && (
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-default-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">Địa chỉ</h3>
                            <p className="text-default-600">{contactData.address}</p>
                        </div>
                    </div>
                )}

                {contactData?.phone && (
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-default-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">Điện thoại</h3>
                            <a href={`tel:${contactData.phone}`} className="text-primary hover:opacity-80 transition-opacity">
                                {contactData.phone}
                            </a>
                        </div>
                    </div>
                )}

                {contactData?.email && (
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-default-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">Email</h3>
                            <a href={`mailto:${contactData.email}`} className="text-primary hover:opacity-80 transition-opacity break-all">
                                {contactData.email}
                            </a>
                        </div>
                    </div>
                )}

                {contactData?.workingHours && (
                    <div className="flex items-start gap-4">
                        <svg className="w-6 h-6 text-default-500 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-foreground mb-1">Giờ làm việc</h3>
                            <p className="text-default-600">{contactData.workingHours}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Map Section */}
            {contactData?.mapEmbedUrl && (
                <div className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">Vị trí của chúng tôi</h2>
                    <div className="aspect-video rounded-lg overflow-hidden">
                        <iframe
                            src={contactData.mapEmbedUrl}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        ></iframe>
                    </div>
                </div>
            )}

            {/* Contact Form */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Gửi tin nhắn cho chúng tôi</h2>

                {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-success-800 dark:text-success-200 text-sm">Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                        </div>
                    </div>
                )}

                {submitStatus === "error" && (
                    <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg">
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-danger-600 dark:text-danger-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-danger-800 dark:text-danger-200 text-sm">Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Họ và tên"
                            placeholder="Nhập họ và tên của bạn"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            variant="bordered"
                            isRequired
                        />
                        <Input
                            label="Số điện thoại"
                            type="tel"
                            placeholder="0123 456 789"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            variant="bordered"
                            isRequired
                        />
                    </div>

                    <Input
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ của bạn"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        variant="bordered"
                        isRequired
                    />

                    <Textarea
                        label="Tin nhắn"
                        placeholder="Nhập tin nhắn của bạn..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        variant="bordered"
                        minRows={6}
                        isRequired
                    />

                    <Button type="submit" color="primary" className="w-full" isLoading={submitting} disabled={submitting}>
                        {submitting ? "Đang gửi..." : "Gửi tin nhắn"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
