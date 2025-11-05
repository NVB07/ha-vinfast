"use client";

import { CarManagement } from "@/components/admin/car-management";

const CARS_PAGE: React.FC<{}> = () => {
    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Quản lý xe</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý thông tin và danh sách xe</p>
            </div>
            <CarManagement />
        </div>
    );
};

export default CARS_PAGE;
