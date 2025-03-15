'use client'
import MasterItemListing from "@/app/components/masterItemListing";
import { useAuth } from "@/context/authContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMasterList } from "@/lib/api";

export default function Master() {

    const router = useRouter();
    const [masterList, setMasterList] = useState([]);
    const { user, loading: authLoading, logout } = useAuth();
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const getMasterData = async () => {
            const result = await getMasterList();
            if (result.error) {
                alert('Failed to fetch master list.');
                return;
            }
            setMasterList(result.masters);
        }

        getMasterData();
    }, [])

    console.log(masterList)

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Authenticating...
                    </div>
                </div>
            </div>
        )
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-2xl font-semibold text-gray-700">
                    You are not authorized to view this page.
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-6 mx-[5%] mb-[5%] mt-10">
            <h1 className="text-2xl flex items-center gap-2">
                Medical Kit Management
            </h1>
            <MasterItemListing masterList={masterList} />
        </div>
    )
}