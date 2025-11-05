"use client";

import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ReactNode } from "react";

export function AdminLayoutWrapper({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <main className="min-h-screen">{children}</main>;
    }

    return (
        <div className="flex min-h-screen">
            <AdminSidebar />
            <main className="flex-1 ml-64">{children}</main>
        </div>
    );
}
