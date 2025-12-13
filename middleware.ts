import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Kiểm tra nếu đang truy cập vào route /admin
    if (pathname.startsWith("/admin")) {
        // Lấy cookies
        const userEmail = request.cookies.get("userEmail")?.value;
        const userPassword = request.cookies.get("userPassword")?.value;

        // Lấy thông tin từ environment variables
        const adminEmail = process.env.NEXT_PUBLIC_USER_NAME_ADMIN;
        const adminPassword = process.env.NEXT_PUBLIC_PASSWORD_ADMIN;

        // Kiểm tra xem cookies có tồn tại và khớp với env variables không
        const isAuthenticated = userEmail && userPassword && userEmail === adminEmail && userPassword === adminPassword;

        // Nếu chưa đăng nhập hoặc thông tin không đúng, chuyển về /login
        if (!isAuthenticated) {
            const loginUrl = new URL("/login", request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    // Nếu đã đăng nhập và đang ở trang /login, có thể chuyển về /admin
    if (pathname.startsWith("/login")) {
        const userEmail = request.cookies.get("userEmail")?.value;
        const userPassword = request.cookies.get("userPassword")?.value;

        const adminEmail = process.env.NEXT_PUBLIC_USER_NAME_ADMIN;
        const adminPassword = process.env.NEXT_PUBLIC_PASSWORD_ADMIN;

        const isAuthenticated = userEmail && userPassword && userEmail === adminEmail && userPassword === adminPassword;

        // Nếu đã đăng nhập, chuyển về /admin
        if (isAuthenticated) {
            const adminUrl = new URL("/admin", request.url);
            return NextResponse.redirect(adminUrl);
        }
    }

    return NextResponse.next();
}

// Cấu hình các routes cần chạy middleware
export const config = {
    matcher: ["/admin/:path*", "/login"],
};
