import { HomePage } from "@/components/pages/home";
import { fetchHomeData, fetchPinnedModels, fetchOutstandingModels } from "@/lib/firebase-data";

export default async function Home() {
    const [homeData, pinnedModels, outstandingModels] = await Promise.all([fetchHomeData(), fetchPinnedModels(), fetchOutstandingModels()]);

    return <HomePage data={homeData} slideData={pinnedModels} outstandingData={outstandingModels} />;
}
