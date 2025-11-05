import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontRaleway } from "@/config/fonts";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
    icons: {
        icon: "/favicon.ico",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "white" },
        { media: "(prefers-color-scheme: dark)", color: "black" },
    ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html suppressHydrationWarning lang="en">
            <head />
            <body className={clsx("min-h-screen text-foreground bg-background font-sans antialiased", fontRaleway.variable)}>
                <Providers>
                    <div className="relative flex flex-col h-screen">
                        <Navbar />
                        <main className="">{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
