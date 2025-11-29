"use client";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { FooterData } from "@/components/admin/footer-management";

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [footerData, setFooterData] = useState<FooterData | null>(null);

    useEffect(() => {
        const loadFooterData = async () => {
            try {
                const footerRef = doc(db, "footer", "data");
                const footerSnap = await getDoc(footerRef);
                if (footerSnap.exists()) {
                    setFooterData(footerSnap.data() as FooterData);
                }
            } catch (error) {
                console.error("Error loading footer data:", error);
            }
        };
        loadFooterData();
    }, []);

    const socialLinks = [
        {
            name: "Facebook",
            href: footerData?.facebookUrl || "https://facebook.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        fillRule="evenodd"
                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
        },
        {
            name: "TikTok",
            href: footerData?.tiktokUrl || "https://tiktok.com",
            icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
            ),
        },
    ];

    const footerLinks = {
        company: [
            { label: "Về chúng tôi", href: "/about" },
            { label: "Liên hệ", href: "/contact" },
        ],
        legal: [
            { label: "Chính sách bảo mật", href: "/privacy" },
            { label: "Điều khoản sử dụng", href: "/terms" },
        ],
    };

    return (
        <footer className="bg-black text-gray-300">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Logo và mô tả */}
                    <div className="lg:col-span-2">
                        <NextLink href="/" className="flex items-center gap-2 mb-4">
                            <Image src="/logo-gif.gif" alt="VinFast Logo" width={40} height={40} unoptimized />
                            <p className="font-bold tracking-[.25em] text-white text-lg">VINFAST</p>
                        </NextLink>
                        <p className="text-sm text-gray-400 mb-4 max-w-md">
                            {footerData?.description || "VinFast - Thương hiệu xe điện Việt Nam, mang đến những trải nghiệm lái xe hiện đại và bền vững cho tương lai."}
                        </p>
                        {/* Social Links */}
                        <div className="flex gap-4">
                            {socialLinks.map((item) => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-400 hover:text-white transition-colors"
                                    aria-label={item.name}
                                >
                                    {item.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Công ty */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Công ty</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.href}>
                                    <NextLink href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pháp lý */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Pháp lý</h3>
                        <ul className="space-y-3">
                            {footerLinks.legal.map((link) => (
                                <li key={link.href}>
                                    <NextLink href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                                        {link.label}
                                    </NextLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Thông tin liên hệ */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                        <div>
                            <h4 className="text-white font-semibold mb-2">Địa chỉ</h4>
                            <p className="text-gray-400">{footerData?.address || "Số 7, Đường Bằng Lăng, Phường Vinhomes Riverside, Quận Long Biên, Hà Nội"}</p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Hotline</h4>
                            <p className="text-gray-400">
                                <a href={`tel:${footerData?.hotline || "19001234"}`} className="hover:text-white transition-colors">
                                    {footerData?.hotline || "1900 1234"}
                                </a>
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-semibold mb-2">Email</h4>
                            <p className="text-gray-400">
                                <a href={`mailto:${footerData?.email || "info@vinfast.vn"}`} className="hover:text-white transition-colors">
                                    {footerData?.email || "info@vinfast.vn"}
                                </a>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
                        <p>© {currentYear} VinFast. Tất cả quyền được bảo lưu.</p>
                        <p className="text-xs">Made with ❤️ in Vietnam</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
