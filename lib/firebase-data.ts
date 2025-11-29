import { getDoc, collection, doc, query, where, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { CarData } from "@/types";

export interface BannerData {
    video: string;
    poster: string;
    title: string;
    subtitle: string;
    titleSlide: string;
    subtitleSlide: string;
    titleOutstanding: string;
    subtitleOutstanding: string;
}

export interface AboutData {
    title: string;
    description: string;
    content: string;
    mission: string;
    vision: string;
    values: string[];
    image?: string;
}

export interface ContactData {
    title: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    mapEmbedUrl?: string;
}

export async function fetchHomeData(): Promise<BannerData | null> {
    try {
        const docRef = doc(db, "home", "banner");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as BannerData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching home data:", error);
        return null;
    }
}

export async function fetchAboutData(): Promise<AboutData | null> {
    try {
        const docRef = doc(db, "about", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as AboutData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching about data:", error);
        return null;
    }
}

export async function fetchContactData(): Promise<ContactData | null> {
    try {
        const docRef = doc(db, "contact", "data");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as ContactData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching contact data:", error);
        return null;
    }
}

export async function fetchPinnedModels(): Promise<CarData[]> {
    try {
        const colRef = collection(db, "allModels");
        const q = query(colRef, where("pinSlider", "==", true));
        const querySnap = await getDocs(q);

        const results: CarData[] = [];
        querySnap.forEach((doc) => {
            results.push({
                ...doc.data(),
                id: doc.id,
            } as CarData);
        });

        return results;
    } catch (error) {
        console.error("Error fetching pinned models:", error);
        return [];
    }
}

export async function fetchOutstandingModels(): Promise<CarData[]> {
    try {
        const colRef = collection(db, "allModels");
        const q = query(colRef, where("pinOutstanding", "==", true));
        const querySnap = await getDocs(q);

        const results: CarData[] = [];
        querySnap.forEach((doc) => {
            results.push({
                ...doc.data(),
                id: doc.id,
            } as CarData);
        });

        return results;
    } catch (error) {
        console.error("Error fetching outstanding models:", error);
        return [];
    }
}

export async function fetchAllModels(): Promise<CarData[]> {
    try {
        const colRef = collection(db, "allModels");
        const querySnap = await getDocs(colRef);

        const results: CarData[] = [];
        querySnap.forEach((doc) => {
            results.push({
                ...doc.data(),
                id: doc.id,
            } as CarData);
        });

        return results;
    } catch (error) {
        console.error("Error fetching all models:", error);
        return [];
    }
}

export async function fetchModelById(id: string): Promise<CarData | null> {
    try {
        const docRef = doc(db, "allModels", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return {
                ...docSnap.data(),
                id: docSnap.id,
            } as CarData;
        }
        return null;
    } catch (error) {
        console.error("Error fetching model by id:", error);
        return null;
    }
}
