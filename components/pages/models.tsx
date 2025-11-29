"use client";

import { useState, useMemo } from "react";
import { CarData } from "@/types";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";

interface ModelsPageProps {
    models: CarData[];
}

export function ModelsPage({ models }: ModelsPageProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredModels = useMemo(() => {
        if (!searchQuery.trim()) {
            return models;
        }

        const query = searchQuery.toLowerCase();
        return models.filter(
            (model) =>
                model.name?.toLowerCase().includes(query) ||
                model.type?.toLowerCase().includes(query) ||
                model.description?.toLowerCase().includes(query) ||
                model.price?.toLowerCase().includes(query)
        );
    }, [models, searchQuery]);

    return (
        <div className="w-full">
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-16 sm:py-20 lg:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Danh sách xe điện</h1>
                        <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">Khám phá toàn bộ dòng xe điện VinFast, từ xe thành phố đến SUV cao cấp</p>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-white dark:bg-gray-900 py-8 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    <div className="max-w-2xl mx-auto">
                        <Input
                            type="text"
                            placeholder="Tìm kiếm xe theo tên, loại, mô tả..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            size="lg"
                            variant="bordered"
                            classNames={{
                                input: "text-base",
                                inputWrapper: "bg-white dark:bg-gray-800",
                            }}
                            startContent={
                                <svg className="w-5 h-5 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Models Grid */}
            <div className="bg-gray-50 dark:bg-gray-950 py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                    {filteredModels.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-lg text-gray-600 dark:text-gray-400">Không tìm thấy xe nào phù hợp với từ khóa tìm kiếm.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {filteredModels.map((model) => (
                                <Card key={model.id} className="bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                                    <CardBody className="p-0 flex flex-col flex-1">
                                        {/* Image */}
                                        <div className="relative w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden flex-shrink-0">
                                            {model.images && model.images.length > 0 ? (
                                                <Image
                                                    src={model.images[0]}
                                                    alt={model.name || "VinFast"}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                </div>
                                            )}
                                            {/* Type Badge */}
                                            {model.type && (
                                                <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                                                    {model.type}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{model.name || "VinFast"}</h3>
                                            {model.price && <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">{model.price}</p>}

                                            {/* Key Specs */}
                                            {model.details && (
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    {model.details.range && (
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                />
                                                            </svg>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-semibold">{model.details.range}</span> phạm vi
                                                            </span>
                                                        </div>
                                                    )}
                                                    {model.details.power && (
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-semibold">{model.details.power}</span> công suất
                                                            </span>
                                                        </div>
                                                    )}
                                                    {model.details.seats && (
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                />
                                                            </svg>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-semibold">{model.details.seats}</span> chỗ ngồi
                                                            </span>
                                                        </div>
                                                    )}
                                                    {model.details.battery && (
                                                        <div className="flex items-center gap-2">
                                                            <svg
                                                                className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                            </svg>
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                <span className="font-semibold">{model.details.battery}</span> pin
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Description */}
                                            {model.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-shrink-0">{model.description}</p>
                                            )}

                                            {/* Buttons */}
                                            <div className="flex gap-3 mt-auto">
                                                <Button as={Link} href={`/models/${model.id}`} color="primary" className="flex-1">
                                                    Xem chi tiết
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
