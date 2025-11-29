"use client";

import { useState } from "react";
import { CarData } from "@/types";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import Image from "next/image";
import Slider from "react-slick";
import Link from "next/link";

interface ModelDetailPageProps {
    model: CarData;
}

export function ModelDetailPage({ model }: ModelDetailPageProps) {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        adaptiveHeight: true,
        nextArrow: <div className="slick-arrow slick-next" />,
        prevArrow: <div className="slick-arrow slick-prev" />,
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSubmitStatus("idle");

        try {
            const response = await fetch("/api/models/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    carName: model.name,
                    carId: model.id,
                }),
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

    return (
        <div className="w-full">
            {/* Breadcrumb */}
            <div className="bg-gray-100 dark:bg-gray-900 py-4 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                            Trang chủ
                        </Link>
                        <span className="text-gray-400">/</span>
                        <Link href="/models" className="text-gray-600 dark:text-gray-400 hover:text-primary">
                            Danh sách xe
                        </Link>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-900 dark:text-white">{model.name}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
                    {/* Image Slider - Left */}
                    <div className="w-full">
                        {model.images && model.images.length > 0 ? (
                            <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative model-detail-slider">
                                <Slider {...sliderSettings}>
                                    {model.images.map((image, index) => (
                                        <div key={index} className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                                            <Image
                                                src={image}
                                                alt={`${model.name} - Hình ${index + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                priority={index === 0}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        ) : (
                            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Car Details - Right */}
                    <div className="w-full">
                        {model.type && (
                            <div className="inline-block mb-4">
                                <span className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold">{model.type}</span>
                            </div>
                        )}

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">{model.name}</h1>

                        {model.price && <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-6">{model.price}</p>}

                        {/* Specifications */}
                        {model.details && (
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Thông số kỹ thuật</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {model.details.range && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phạm vi hoạt động</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.range}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.power && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Công suất</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.power}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.torque && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Mô-men xoắn</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.torque}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.battery && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Pin</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.battery}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.seats && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Số chỗ ngồi</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.seats}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.size && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Kích thước</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.size}</p>
                                            </div>
                                        </div>
                                    )}

                                    {model.details.style && (
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Kiểu dáng</p>
                                                <p className="text-lg font-semibold text-gray-900 dark:text-white">{model.details.style}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description Section - Below both columns */}
                {model.description && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Mô tả</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">{model.description}</p>
                    </div>
                )}

                {/* Contact Form Section */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 lg:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quan tâm đến {model.name}?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất</p>

                    {submitStatus === "success" && (
                        <div className="mb-6 p-4 bg-success-50 dark:bg-success-900/20 border border-success-200 dark:border-success-800 rounded-lg">
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-success-800 dark:text-success-200 text-sm">
                                    Cảm ơn bạn đã quan tâm! Chúng tôi sẽ liên hệ lại với bạn sớm nhất có thể.
                                </p>
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
                            minRows={4}
                            isRequired
                        />

                        <Button type="submit" color="primary" className="w-full" isLoading={submitting} disabled={submitting}>
                            {submitting ? "Đang gửi..." : "Gửi thông tin quan tâm"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
