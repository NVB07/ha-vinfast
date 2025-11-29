import { HomePage } from "@/components/pages/home";
import { fetchHomeData, fetchPinnedModels, fetchOutstandingModels } from "@/lib/firebase-data";
// Disable caching - fetch fresh data on every request
export const dynamic = "force-dynamic";
// Or use revalidation instead (revalidate every 60 seconds):
// export const revalidate = 60;
export default async function Home() {
    const [homeData, pinnedModels, outstandingModels] = await Promise.all([fetchHomeData(), fetchPinnedModels(), fetchOutstandingModels()]);

    return <HomePage data={homeData} slideData={pinnedModels} outstandingData={outstandingModels} />;
}
