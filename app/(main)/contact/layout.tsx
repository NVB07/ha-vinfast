import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Liên hệ - VinFast Hanoi",
    description: "Liên hệ với VinFast - Thương hiệu xe điện hàng đầu Việt Nam. Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn.",
    keywords: "liên hệ VinFast, contact VinFast, VinFast Hanoi, hỗ trợ khách hàng VinFast",
    openGraph: {
        title: "Liên hệ - VinFast Hanoi",
        description: "Liên hệ với VinFast - Thương hiệu xe điện hàng đầu Việt Nam",
        type: "website",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <div className="inline-block max-w-4xl text-center justify-center w-full">{children}</div>
        </section>
    );
}
