import "@/styles/globals.css";
import { Metadata } from "next";
import { AdminLayoutWrapper } from "@/components/admin/admin-layout-wrapper";

export const metadata: Metadata = {
    title: "Ha vinfast - Admin",
    description: "Ha vinfast - Admin",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body>
                <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
            </body>
        </html>
    );
}
