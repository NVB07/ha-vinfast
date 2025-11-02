"use client";
import { useEffect, useState } from "react";
import { getDoc, collection, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import Slider from "react-slick";

interface CarouselItem {
    id: number;
    title: string;
    image?: string;
    description?: string;
}
interface BannerData {
    video: string;
    poster: string;
    title: string;
    subtitle: string;
    titleSlide: string;
    subtitleSlide: string;
}

const HomePage: React.FC = () => {
    const [data, setData] = useState<BannerData | null>(null);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    // 示例产品数据
    const carouselItems: CarouselItem[] = [
        { id: 1, title: "Sản phẩm 1", description: "Mô tả sản phẩm 1" },
        { id: 2, title: "Sản phẩm 2", description: "Mô tả sản phẩm 2" },
        { id: 3, title: "Sản phẩm 3", description: "Mô tả sản phẩm 3" },
        { id: 4, title: "Sản phẩm 4", description: "Mô tả sản phẩm 4" },
        { id: 5, title: "Sản phẩm 5", description: "Mô tả sản phẩm 5" },
        { id: 6, title: "Sản phẩm 6", description: "Mô tả sản phẩm 6" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            const docRef = doc(db, "home", "banner"); // "home" là collection, "banner" là ID document
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Data:", docSnap.data());
                setData(docSnap.data() as BannerData);
            } else {
                console.log("Không tìm thấy document 'banner'");
            }
        };
        fetchData();
    }, [db]);

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
                        {carouselItems.map((item) => (
                            <div key={item.id} className="px-2 py-1">
                                <div className="bg-white border rounded-lg p-2 border-gray-300">
                                    <div className="aspect-video bg-gray-200 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-md" />
                                        ) : (
                                            <span className="text-gray-400 text-2xl">{item.id}</span>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                    {item.description && <p className="text-gray-600">{item.description}</p>}
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export { HomePage };
