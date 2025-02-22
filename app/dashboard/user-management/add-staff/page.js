'use client'
import AddDoctor from "@/app/components/form/addDoctorForm"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react";

export default function AddStaffMember() {

    const router = useRouter();

    return (
        <div className="flex flex-col gap-8">
            <h1 className="p-2 text-2xl flex items-center gap-2 mt-4">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                Add Staff Member
            </h1>

            <div>
                <AddDoctor />
            </div>
        </div>
    )
}