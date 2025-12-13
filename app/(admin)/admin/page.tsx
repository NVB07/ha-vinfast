"use client";

import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import Link from "next/link";

const ADMIN_PAGE: React.FC<{}> = () => {
    return (
        <div className="container mx-auto p-6 max-w-7xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Huyha Admin - Bảng điều khiển</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Quản lý nội dung website và thông tin xe</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-xl font-bold mb-2">Quản lý nội dung</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Quản lý banner và nội dung trang chủ</p>
                        <Link href="/admin/content">
                            <Button color="primary" fullWidth>
                                Đi đến quản lý nội dung
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-xl font-bold mb-2">Quản lý xe</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Quản lý thông tin và danh sách xe</p>
                        <Link href="/admin/cars">
                            <Button color="primary" fullWidth>
                                Đi đến quản lý xe
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-xl font-bold mb-2">Quản lý Footer</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Quản lý thông tin footer và liên hệ</p>
                        <Link href="/admin/footer">
                            <Button color="primary" fullWidth>
                                Đi đến quản lý Footer
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-xl font-bold mb-2">Quản lý About</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Quản lý nội dung trang Về chúng tôi</p>
                        <Link href="/admin/about">
                            <Button color="primary" fullWidth>
                                Đi đến quản lý About
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                <Card>
                    <CardBody className="p-6">
                        <h2 className="text-xl font-bold mb-2">Quản lý Liên hệ</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Quản lý nội dung trang Liên hệ</p>
                        <Link href="/admin/contact">
                            <Button color="primary" fullWidth>
                                Đi đến quản lý Liên hệ
                            </Button>
                        </Link>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ADMIN_PAGE;
