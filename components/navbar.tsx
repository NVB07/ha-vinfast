"use client";
import { Navbar as HeroUINavbar, NavbarContent, NavbarMenu, NavbarMenuToggle, NavbarBrand, NavbarItem, NavbarMenuItem } from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import NextLink from "next/link";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";
import { SearchIcon } from "@/components/icons";
import Image from "next/image";

export const Navbar = () => {
    const pathname = usePathname();
    const searchInput = (
        <div className="flex items-center gap-2 bg-[#222222] p-2 rounded-md w-full max-w-xs">
            <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
            <input aria-label="Search" className="text-white outline-none border-none text-sm w-full bg-transparent" placeholder="Search..." type="search" />
        </div>
    );

    return (
        <HeroUINavbar className="bg-black" maxWidth="2xl" position="sticky">
            {/* Logo - 移动端左侧，桌面端居中 */}
            <NavbarBrand as="li" className="gap-3 max-w-fit lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                <NextLink className="flex justify-start items-center gap-1 flex-col" href="/">
                    <Image src="/logo-gif.gif" alt="logo" width={32} height={32} unoptimized />
                    <p className="font-bold tracking-[.25em] animate-shiny text-xs sm:text-sm">VINFAST</p>
                </NextLink>
            </NavbarBrand>

            {/* 桌面端导航菜单 - 左侧 */}
            <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                <ul className="hidden lg:flex gap-4 justify-start ml-2">
                    {siteConfig.navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <NextLink
                                className={clsx(linkStyles({ color: "foreground" }), "relative data-[active=true]:text-primary data-[active=true]:font-medium")}
                                color="foreground"
                                href={item.href}
                            >
                                <span className={`${pathname === item.href ? "text-white" : "text-gray-300"} text-[15px]`}>{item.label}</span>
                                {pathname === item.href && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute -bottom-1 w-full h-0.5 left-0 right-0  bg-[#ffffffd1]"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    ></motion.div>
                                )}
                            </NextLink>
                        </NavbarItem>
                    ))}
                </ul>
            </NavbarContent>

            {/* 桌面端搜索框 - 右侧 */}
            <NavbarContent className="hidden lg:flex basis-1/5 sm:basis-full" justify="end">
                <NavbarItem>{searchInput}</NavbarItem>
            </NavbarContent>

            {/* 移动端和中等屏幕菜单切换按钮 (< 1024px) */}
            <NavbarContent className="lg:hidden basis-1 pl-4" justify="end">
                <NavbarMenuToggle />
            </NavbarContent>

            {/* 移动端菜单 */}
            <NavbarMenu>
                <div className="w-full mb-4 px-2">{searchInput}</div>
                <div className="mx-4 mt-2 flex flex-col gap-2">
                    {siteConfig.navItems.map((item, index) => (
                        <NavbarMenuItem key={`${item.href}-${index}`}>
                            <NextLink
                                className={clsx(
                                    "w-full text-lg py-2 px-3 rounded-md transition-colors",
                                    pathname === item.href ? "text-white font-semibold bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800"
                                )}
                                href={item.href}
                            >
                                {item.label}
                            </NextLink>
                        </NavbarMenuItem>
                    ))}
                </div>
            </NavbarMenu>
        </HeroUINavbar>
    );
};
