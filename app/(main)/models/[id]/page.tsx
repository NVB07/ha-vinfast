import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ModelDetailPage } from "@/components/pages/model-detail";
import { fetchModelById, fetchAllModels } from "@/lib/firebase-data";

interface PageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const models = await fetchAllModels();
    return models
        .map((model) => ({
            id: model.id || "",
        }))
        .filter((param) => param.id);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const model = await fetchModelById(id);

    if (!model) {
        return {
            title: "Không tìm thấy xe - VinFast Hanoi",
        };
    }

    return {
        title: `${model.name} - VinFast Hanoi`,
        description:
            model.description ||
            `Tìm hiểu chi tiết về ${model.name} - ${model.type || "xe điện VinFast"}. Giá ${model.price || ""}, ${model.details?.range || ""} phạm vi, ${model.details?.power || ""} công suất.`,
        keywords: `VinFast, ${model.name}, ${model.type}, xe điện, ${model.details?.range}, ${model.details?.power}`,
        openGraph: {
            title: `${model.name} - VinFast Hanoi`,
            description: model.description || `Tìm hiểu chi tiết về ${model.name}`,
            type: "website",
            images: model.images && model.images.length > 0 ? [model.images[0]] : [],
        },
    };
}

export default async function ModelDetail({ params }: PageProps) {
    const { id } = await params;
    const model = await fetchModelById(id);

    if (!model) {
        notFound();
    }

    return <ModelDetailPage model={model} />;
}
