"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setMessage("Vui lòng nhập đầy đủ email và mật khẩu");
            return;
        }

        // Kiểm tra thông tin đăng nhập với environment variables
        const adminEmail = process.env.NEXT_PUBLIC_USER_NAME_ADMIN;
        const adminPassword = process.env.NEXT_PUBLIC_PASSWORD_ADMIN;

        if (email !== adminEmail || password !== adminPassword) {
            setMessage("Email hoặc mật khẩu không đúng!");
            return;
        }

        // Lưu thông tin vào cookies với thời gian 1 ngày
        Cookies.set("userEmail", email, { expires: 1 });
        Cookies.set("userPassword", password, { expires: 1 });

        setMessage("Đăng nhập thành công! Đang chuyển hướng...");

        // Chuyển hướng về trang admin sau 1 giây
        setTimeout(() => {
            router.push("/admin");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Đăng Nhập</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập email của bạn"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Mật khẩu
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập mật khẩu"
                        />
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                        Đăng Nhập
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded-md ${message.includes("thành công") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{message}</div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
