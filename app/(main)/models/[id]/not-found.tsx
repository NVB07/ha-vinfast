import Link from "next/link";
import { Button } from "@heroui/button";

export default function NotFound() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">Không tìm thấy xe</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Xe bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <div className="flex gap-4 justify-center">
                <Button as={Link} href="/models" color="primary">
                    Xem danh sách xe
                </Button>
                <Button as={Link} href="/" variant="bordered">
                    Về trang chủ
                </Button>
            </div>
        </div>
    );
}
