import { HomePage } from "@/components/pages/home";
import { fetchHomeData, fetchPinnedModels, fetchOutstandingModels } from "@/lib/firebase-data";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import Script from "next/script";

// Disable caching - fetch fresh data on every request
export const dynamic = "force-dynamic";
// Or use revalidation instead (revalidate every 60 seconds):
// export const revalidate = 60;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
    const homeData = await fetchHomeData();

    const title = `${siteConfig.name} - Thương hiệu xe điện hàng đầu Việt Nam`;

    const description = homeData?.subtitle
        ? `${homeData.subtitle}. ${siteConfig.description}. Khám phá các mẫu xe VinFast với công nghệ tiên tiến, thiết kế hiện đại và giá cả hợp lý.`
        : `VinFast - Thương hiệu xe điện hàng đầu Việt Nam. Khám phá các mẫu xe điện với công nghệ tiên tiến, thiết kế hiện đại, an toàn vượt trội và giá cả hợp lý. Đặt lịch lái thử ngay hôm nay!`;

    const siteUrl = siteConfig.url;
    const ogImage = homeData?.poster || `${siteUrl}/logo-gif.gif`;

    return {
        title: title,
        description: description,
        keywords: [
            "VinFast",
            "xe điện",
            "xe điện Việt Nam",
            "VinFast Hà Nội",
            "xe VinFast",
            "mua xe điện",
            "xe điện giá rẻ",
            "xe điện công nghệ cao",
            "VinFast models",
            "xe điện an toàn",
            "thương hiệu xe điện",
            "xe điện chất lượng",
        ],
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        metadataBase: new URL(siteUrl),
        alternates: {
            canonical: "/",
        },
        openGraph: {
            type: "website",
            locale: "vi_VN",
            url: siteUrl,
            title: title,
            description: description,
            siteName: siteConfig.name,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: homeData?.title || siteConfig.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: title,
            description: description,
            images: [ogImage],
            creator: "@vinfast",
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        verification: {
            // Add your verification codes here when available
            // google: "your-google-verification-code",
            // yandex: "your-yandex-verification-code",
            // yahoo: "your-yahoo-verification-code",
        },
    };
}

export default async function Home() {
    const [homeData, pinnedModels, outstandingModels] = await Promise.all([fetchHomeData(), fetchPinnedModels(), fetchOutstandingModels()]);

    // Structured data for SEO (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo-gif.gif`,
        sameAs: [
            // Add social media links here when available
            // "https://www.facebook.com/vinfast",
            // "https://www.instagram.com/vinfast",
            // "https://www.youtube.com/vinfast",
        ],
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Customer Service",
            areaServed: "VN",
            availableLanguage: ["Vietnamese"],
        },
    };

    const websiteStructuredData = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/models?search={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };

    return (
        <>
            <Script id="organization-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
            <Script id="website-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }} />
            <HomePage data={homeData} slideData={pinnedModels} outstandingData={outstandingModels} />
        </>
    );
}
