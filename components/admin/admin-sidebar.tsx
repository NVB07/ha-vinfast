"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { motion } from "framer-motion";
import Image from "next/image";

const adminNavItems = [
    {
        label: "Bảng điều khiển",
        href: "/admin",
        icon: "📊",
    },
    {
        label: "Quản lý nội dung",
        href: "/admin/content",
        icon: "📝",
    },
    {
        label: "Quản lý xe",
        href: "/admin/cars",
        icon: "🚗",
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-800 flex flex-col z-50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-800">
                <Link href="/admin" className="flex items-center gap-3">
                    <Image src="/logo-gif.gif" alt="logo" width={32} height={32} unoptimized />
                    <div>
                        <p className="font-bold tracking-[.25em] animate-shiny text-sm">VINFAST</p>
                        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {adminNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={clsx(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                        isActive ? "bg-gray-900 text-white" : "text-gray-400 hover:text-white hover:bg-gray-900"
                                    )}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="adminActiveTab"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200">
                    <span className="text-xl">🏠</span>
                    <span className="font-medium">Về trang chủ</span>
                </Link>
            </div>
        </aside>
    );
}
