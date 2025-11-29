"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import { CarData } from "@/types";
import { BannerData } from "@/lib/firebase-data";

interface HomePageProps {
    data: BannerData | null;
    slideData: CarData[];
    outstandingData: CarData[];
}

const HomePage: React.FC<HomePageProps> = ({ data, slideData, outstandingData }) => {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    // Detect window width
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // Set initial width
        if (typeof window !== "undefined") {
            setWindowWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    // Slick Carousel 配置
    // Tính toán slidesToShow dựa trên window width
    const getSlidesToShow = () => {
        if (windowWidth === 0) return 1; // Default 1 khi chưa detect được width (SSR safe)
        if (windowWidth <= 768) return 1; // Mobile: 1 slide
        if (windowWidth <= 1024) return 2; // Tablet: 2 slides
        return 3; // Desktop: 3 slides
    };

    // Tính breakpoint key để re-render slider khi chuyển breakpoint
    const getBreakpointKey = () => {
        if (windowWidth === 0) return "mobile";
        if (windowWidth <= 768) return "mobile";
        if (windowWidth <= 1024) return "tablet";
        return "desktop";
    };

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: getSlidesToShow(),
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        pauseOnHover: true,
        arrows: windowWidth > 1280, // Chỉ bật arrows trên desktop
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: false, // Tắt arrows khi ≤ 1024px
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false, // Tắt arrows khi ≤ 768px
                },
            },
        ],
    };

    return (
        <section className="flex flex-col">
            <div className="w-full h-full relative flex items-center justify-center">
                <div className="w-full">
                    <video src={data?.video} autoPlay muted loop playsInline poster={data?.poster} className="w-full h-full object-cover  aspect-[16/5]"></video>
                </div>
                <div className="absolute w-full max-w-[1536px] p-4 sm:p-6 top-1/2 left-1/2 -translate-x-1/2">
                    <div className="flex flex-col">
                        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-shadow-sm text-shadow-black font-[Times_New_Roman] px-2 sm:px-0">
                            {data?.title}
                        </h1>
                        <p className="text-white text-shadow-xs mt-1 text-shadow-black text-sm sm:text-base lg:text-lg px-2 sm:px-0">{data?.subtitle}</p>
                    </div>
                </div>
            </div>
            <div className="w-full h-full relative flex flex-col items-center justify-center py-10 sm:py-16 lg:py-20">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-4 text-center">{data?.titleSlide}</h2>
                <p className="mb-8 mt-3">{data?.subtitleSlide}</p>

                {/* Slick Carousel */}
                <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
                    <Slider key={getBreakpointKey()} {...settings}>
                        {(() => {
                            // 如果数据少于6个，则重复数据直到至少有6个
                            const minItems = 6;
                            const dataArray = slideData || [];
                            let expandedData = [...dataArray];

                            if (dataArray.length > 0 && dataArray.length < minItems) {
                                while (expandedData.length < minItems) {
                                    expandedData = [...expandedData, ...dataArray];
                                }
                                // 只取前6个
                                expandedData = expandedData.slice(0, minItems);
                            }

                            return expandedData.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="px-2 py-1">
                                    <div className="bg-white">
                                        <div className="aspect-video  hover:scale-110 transition-all duration-300 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                                            {item.images ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover rounded-md" />
                                            ) : (
                                                <span className="text-gray-400 text-2xl">{item.id}</span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2 text-center">{item.name}</h3>
                                        {/* {item.description && <p className="text-gray-600">{item.type}</p>} */}
                                    </div>
                                </div>
                            ));
                        })()}
                    </Slider>
                </div>
            </div>

            {/* Brand Introduction Section */}
            <div className="w-full py-12 sm:py-16 lg:py-20 bg-white">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="space-y-6">
                                <div className="inline-block">
                                    <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">Về VinFast</span>
                                </div>
                                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">Thương hiệu xe điện hàng đầu Việt Nam</h2>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    VinFast tự hào là thương hiệu xe điện đầu tiên của Việt Nam, mang đến những sản phẩm chất lượng cao với công nghệ tiên tiến và thiết
                                    kế hiện đại. Chúng tôi cam kết mang đến trải nghiệm lái xe tuyệt vời cho mọi khách hàng.
                                </p>
                                <div className="flex flex-wrap gap-6 pt-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Chất lượng cao</div>
                                            <div className="text-sm text-gray-600">Tiêu chuẩn quốc tế</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Công nghệ mới</div>
                                            <div className="text-sm text-gray-600">Đổi mới liên tục</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <div className="relative">
                                <div className="aspect-[4/3] bg-[] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.8)),url('https://vinfastvietnam.com.vn/wp-content/uploads/2024/08/bannervinfastvietnam.jpg')] bg-cover bg-center">
                                    <div className="text-center p-8">
                                        <svg className="w-24 h-24 mx-auto text-white mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        <h3 className="text-3xl font-bold text-white mb-2">VinFast</h3>
                                        <p className="text-blue-100 text-lg">Định hình tương lai di chuyển</p>
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
                                <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Outstanding Cars Section */}
            {outstandingData.length > 0 && (
                <div className="w-full h-full relative flex flex-col items-center justify-center py-10 sm:py-16 lg:py-20 bg-gray-50">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-4 text-center mb-4">{data?.titleOutstanding}</h2>
                    <p className="mb-8 mt-3 text-gray-600 text-center px-4">{data?.subtitleOutstanding}</p>

                    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {outstandingData.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        {item.images && item.images[0] ? (
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-400 text-xl">{item.name || item.id}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 sm:p-6">
                                        <h3 className="text-xl sm:text-2xl font-semibold mb-2">{item.name}</h3>
                                        {item.type && <p className="text-gray-600 text-sm mb-3">{item.type}</p>}
                                        {item.price && <p className="text-lg font-bold text-blue-600 mb-2">{item.price}</p>}
                                        {item.description && <p className="text-gray-500 text-sm line-clamp-2">{item.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Features Section */}
            <div className="w-full py-10 sm:py-16 lg:py-20 bg-white">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Tại sao chọn VinFast?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">Khám phá những ưu điểm vượt trội của dòng xe VinFast</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Công nghệ hiện đại</h3>
                            <p className="text-gray-600 text-sm">Công nghệ tiên tiến và kết nối thông minh</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">An toàn vượt trội</h3>
                            <p className="text-gray-600 text-sm">Hệ thống an toàn tiên tiến, đạt chuẩn quốc tế</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Giá cả hợp lý</h3>
                            <p className="text-gray-600 text-sm">Giá thành cạnh tranh với nhiều ưu đãi hấp dẫn</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Dịch vụ chuyên nghiệp</h3>
                            <p className="text-gray-600 text-sm">Hỗ trợ 24/7 và bảo hành toàn diện</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="w-full py-10 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">100K+</div>
                            <div className="text-sm sm:text-base text-blue-100">Khách hàng tin dùng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">10+</div>
                            <div className="text-sm sm:text-base text-blue-100">Mẫu xe đa dạng</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">200+</div>
                            <div className="text-sm sm:text-base text-blue-100">Đại lý toàn quốc</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">24/7</div>
                            <div className="text-sm sm:text-base text-blue-100">Hỗ trợ khách hàng</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-full py-10 sm:py-16 lg:py-20 bg-gray-50">
                <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Sẵn sàng trải nghiệm VinFast?</h2>
                    <p className="text-gray-600 mb-8 text-lg">Khám phá những điều tuyệt vời từ VinFast</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {/* <a
                            href="/contact"
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                        >
                            Đặt lịch lái thử
                        </a> */}
                        <a
                            href="/models"
                            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                        >
                            Xem tất cả mẫu xe
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { HomePage };
