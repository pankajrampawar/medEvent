'use client'
import AddDoctor from "@/app/components/form/addDoctorForm";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import DoctorKpi from "@/app/components/doctor/doctorKpi";
import DoctorListing from "@/app/components/doctor/doctorListing";
import { useEffect, useState, useMemo } from "react";
import { getDoctorsList } from "@/lib/api";

export default function UserManagement() {
    const router = useRouter();

    const [doctorList, setDoctorList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState(null); // Default to no filter

    useEffect(() => {
        const fetchDoctors = async () => {
            const result = await getDoctorsList();
            if (result) {
                setDoctorList(result.doctors);
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    // Segregate doctors by role
    const doctorsByRole = useMemo(() => ({
        emt: doctorList.filter((doctor) => doctor.role === "emt"),
        medic: doctorList.filter((doctor) => doctor.role === "medic"),
        nppa: doctorList.filter((doctor) => doctor.role === "nppa"),
        usP: doctorList.filter((doctor) => doctor.role === "usP"),
        interP: doctorList.filter((doctor) => doctor.role === "interP"),
    }), [doctorList]);

    // Compute the displayed list based on the filter
    const displayedList = useMemo(() => {
        if (!filter) return doctorList;
        return doctorsByRole[filter] || [];
    }, [filter, doctorList, doctorsByRole]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading...
            </div>
        );
    }

    console.log("displayed list:  ", displayedList + " \nFilter applied: ", filter)

    return (
        <div className="flex flex-col gap-8 mr-[5%]">
            <h1 className="p-2 text-2xl flex items-center gap-2 mt-4">
                <button className="hover:bg-gray-200 p-2 rounded-full" onClick={() => router.back()}>
                    <ChevronLeft />
                </button>
                User Management
            </h1>

            <div>
                {/* Pass role-based arrays to the KPI component */}
                <DoctorKpi
                    total={doctorList.length}
                    emt={doctorsByRole.emt.length}
                    medic={doctorsByRole.medic.length}
                    usp={doctorsByRole.usP.length}
                    iP={doctorsByRole.interP.length}
                    setFilter={setFilter} // Pass the setFilter function to control filtering
                />
            </div>

            <div>
                {/* Render the DoctorListing component based on the filtered list */}
                <DoctorListing usersList={displayedList} />
            </div>
        </div>
    );
}