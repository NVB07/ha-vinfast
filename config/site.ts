export type SiteConfig = typeof siteConfig;

export const siteConfig = {
    name: "Vinfast",
    description: "Thương hiệu xe điện hàng đầu Việt Nam với công nghệ tiên tiến, thiết kế hiện đại và giá cả hợp lý.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://vinfast-hanoi.com",
    navItems: [
        {
            label: "Trang chủ",
            href: "/",
        },
        {
            label: "Các mẫu xe",
            href: "/models",
        },

        {
            label: "Về chúng tôi",
            href: "/about",
        },
        {
            label: "Liên hệ",
            href: "/contact",
        },
    ],
    navMenuItems: [
        {
            label: "Profile",
            href: "/profile",
        },
        {
            label: "Dashboard",
            href: "/dashboard",
        },
        {
            label: "Projects",
            href: "/projects",
        },
        {
            label: "Team",
            href: "/team",
        },
        {
            label: "Calendar",
            href: "/calendar",
        },
        {
            label: "Settings",
            href: "/settings",
        },
        {
            label: "Help & Feedback",
            href: "/help-feedback",
        },
        {
            label: "Logout",
            href: "/logout",
        },
    ],
};
