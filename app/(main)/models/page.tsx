import { Metadata } from "next";
import { ModelsPage } from "@/components/pages/models";
import { fetchAllModels } from "@/lib/firebase-data";

export const metadata: Metadata = {
    title: "Danh sách xe - VinFast Hanoi",
    description: "Khám phá toàn bộ dòng xe điện VinFast - từ xe thành phố đến SUV cao cấp. Tìm hiểu thông tin chi tiết, giá cả và đặt lịch lái thử ngay hôm nay.",
    keywords: "VinFast, xe điện, danh sách xe, VF3, VF5, VF7, VF9, xe điện Việt Nam",
    openGraph: {
        title: "Danh sách xe - VinFast Hanoi",
        description: "Khám phá toàn bộ dòng xe điện VinFast",
        type: "website",
    },
};

export default async function Models() {
    const models = await fetchAllModels();

    return <ModelsPage models={models} />;
}
