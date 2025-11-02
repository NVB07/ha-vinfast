"use client";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect } from "react";
import { HomePage } from "@/components/pages/home";
export default function Home() {
    // useEffect(() => {
    //     const test = async () => {
    //         // thêm document
    //         await addDoc(collection(db, "test"), { name: "Tao", createdAt: new Date() });
    //         // đọc document
    //         const querySnapshot = await getDocs(collection(db, "test"));
    //         querySnapshot.forEach((doc) => {
    //             console.log(doc.id, " => ", doc.data());
    //         });
    //     };
    //     test();
    // }, []);
    return <HomePage />;
}
