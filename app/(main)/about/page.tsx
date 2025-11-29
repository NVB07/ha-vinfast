import { Metadata } from "next";
import { fetchAboutData } from "@/lib/firebase-data";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Về chúng tôi - VinFast Hanoi",
    description:
        "Tìm hiểu về VinFast - Thương hiệu xe điện hàng đầu Việt Nam. Khám phá sứ mệnh, tầm nhìn và giá trị cốt lõi của chúng tôi trong việc định hình tương lai di chuyển bền vững.",
    keywords: "VinFast, về VinFast, xe điện Việt Nam, thương hiệu xe điện, VinFast Hanoi",
    openGraph: {
        title: "Về chúng tôi - VinFast Hanoi",
        description: "Tìm hiểu về VinFast - Thương hiệu xe điện hàng đầu Việt Nam",
        type: "website",
    },
};
export const dynamic = "force-dynamic";

export default async function AboutPage() {
    const aboutData = await fetchAboutData();

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-gray-900 dark:text-white">{aboutData?.title || "Về VinFast"}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    {aboutData?.description || "Thương hiệu xe điện hàng đầu Việt Nam, mang đến những trải nghiệm lái xe hiện đại và bền vững cho tương lai."}
                </p>
            </div>

            {/* Main Content */}
            {aboutData?.image && (
                <div className="mb-12 rounded-lg overflow-hidden shadow-xl">
                    <Image src={aboutData.image} alt={aboutData.title || "VinFast"} width={1200} height={600} className="w-full h-auto object-cover" priority />
                </div>
            )}

            <div className="prose prose-lg max-w-none dark:prose-invert mb-12">
                <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {aboutData?.content || (
                        <p>
                            VinFast là thương hiệu xe điện đầu tiên của Việt Nam, được thành lập với sứ mệnh mang đến những sản phẩm chất lượng cao, công nghệ tiên tiến
                            và thiết kế hiện đại cho người dùng Việt Nam và thế giới.
                        </p>
                    )}
                </div>
            </div>

            {/* Mission & Vision */}
            {(aboutData?.mission || aboutData?.vision) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {aboutData?.mission && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4 text-blue-900 dark:text-blue-100">Sứ mệnh</h2>
                            <p className="text-gray-700 dark:text-gray-300">{aboutData.mission}</p>
                        </div>
                    )}
                    {aboutData?.vision && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold mb-4 text-green-900 dark:text-green-100">Tầm nhìn</h2>
                            <p className="text-gray-700 dark:text-gray-300">{aboutData.vision}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Values */}
            {aboutData?.values && aboutData.values.filter((v) => v.trim() !== "").length > 0 && (
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Giá trị cốt lõi</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {aboutData.values
                            .filter((v) => v.trim() !== "")
                            .map((value, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{index + 1}</span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 font-medium">{value}</p>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Sẵn sàng trải nghiệm VinFast?</h2>
                <p className="text-lg mb-6 text-blue-100">Khám phá các mẫu xe điện hiện đại của chúng tôi</p>
                <a href="/docs" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
                    Xem các mẫu xe
                </a>
            </div>
        </div>
    );
}
