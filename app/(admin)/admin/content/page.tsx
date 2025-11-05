"use client";

import { ContentManagement } from "@/components/admin/content-management";

const CONTENT_PAGE: React.FC<{}> = () => {
    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Quản lý nội dung</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý banner và nội dung trang chủ</p>
            </div>
            <ContentManagement />
        </div>
    );
};

export default CONTENT_PAGE;
