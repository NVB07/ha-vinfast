import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

// 内容管理数据类型
export interface ContentData {
    poster: string; // URL ảnh
    subTitle: string;
    subtitleSlide: string;
    title: string;
    titleSlide: string;
    video: string; // URL video
}

// 车辆详情类型
export interface CarDetails {
    battery: string; // Pin
    power: string;
    range: string;
    seats: string;
    size: string;
    style: string;
    torque: string;
}

// 车辆数据类型
export interface CarData {
    id?: string;
    images: string[]; // Mảng URL ảnh
    name: string; // Tên xe
    description: string; // Mô tả
    price: string; // Giá
    type: string; // Loại xe
    pinOutstanding: boolean; // Để ghim lên trang chủ
    pinSlider: boolean; // Để ghim vào slide
    details: CarDetails; // Chi tiết
}
