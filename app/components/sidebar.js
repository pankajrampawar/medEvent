'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, Calendar, HeartPulse, LogOut, BriefcaseMedical, Syringe } from "lucide-react"; // Import LogOut icon
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);
    const [selectedOption, setSelectedOption] = useState("Ongoing");
    const { user, loading: authLoading, logout } = useAuth();

    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';

    const toggleDropdown = () => {
        router.push('/dashboard/events/ongoing')
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleOptionClick = (option) => {
        const smallCaseOption = option.toLowerCase();
        router.push(`/dashboard/events/${smallCaseOption}`)
        setSelectedOption(option);
    };

    const handleLogout = async () => {
        try {
            await logout(); // Ensure logout is completed before redirecting
            router.push('/login'); // Redirect to login page
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="flex flex-col w-64 h-screen text-black sticky top-0">
            <div className="flex items-center justify-start pl-4  h-16">
                <h1 className="text-xl font-bold">DASHBOARD</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    <li className="mb-2">
                        <Link href="/dashboard" className={`flex items-start p-2 hover:bg-gray-200 rounded gap-1  ${pathname === "/dashboard" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                            <Home width={20} height={20} /> Home
                        </Link>
                    </li>
                    <li className="mb-2">
                        <button
                            onClick={toggleDropdown}
                            className="w-full flex items-center justify-between p-2 hover:bg-gray-200 rounded"
                        >
                            <span className="flex items-center gap-1"> <HeartPulse width={20} height={20} /> Events</span>
                            <svg
                                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isDropdownOpen && (
                            <ul className="pl-4 mt-2">
                                <li>
                                    <button
                                        onClick={() => handleOptionClick("Ongoing")}
                                        className={`w-full text-left p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/events/ongoing" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}
                                    >
                                        Ongoing
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleOptionClick("Upcoming")}
                                        className={`w-full text-left p-2  rounded ${pathname === "/dashboard/events/upcoming" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}`}
                                    >
                                        Upcoming
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleOptionClick("Completed")}
                                        className={`w-full text-left p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/events/completed" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}`}
                                    >
                                        Completed
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="mb-2">
                        <Link href="/dashboard/calendar" className={`flex items-start gap-2 p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/calendar" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                            <Calendar width={20} height={20} /> Calendar
                        </Link>
                    </li>
                    {!authLoading &&
                        isAdmin ?
                        <div>
                            <li className="mb-2">
                                <Link href="/dashboard/user-management" className={`flex items-start gap-1 p-2 hover:bg-gray-200 rounded  ${pathname === "/dashboard/user-management" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                                    <User width={20} height={20} /> User Management
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/dashboard/master" className={`flex items-start gap-1 p-2 hover:bg-gray-200 rounded  ${pathname === "/dashboard/master" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                                    <BriefcaseMedical width={20} height={20} /> Medical Kit Management
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link href="/dashboard/items" className={`flex items-start gap-1 p-2 hover:bg-gray-200 rounded  ${pathname === "/dashboard/items" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                                    <Syringe width={20} height={20} /> Items
                                </Link>
                            </li>
                        </div>

                        :
                        isDoctor ? <li className="mb-2">
                            <Link href="/dashboard/profile/" className={`flex items-start gap-1 p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/profile" ? "bg-gradient-to-r from-[#b191f7] to-[#8C57FF] text-white font-medium" : "hover:bg-gray-200"}}`}>
                                <User width={20} height={20} /> Your Profile
                            </Link>
                        </li> : ""
                    }
                </ul>
            </nav>
            {/* Logout Button */}
            <div className="p-4 border-t border-gray-300 mb-2">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                    <LogOut width={20} height={20} /> Log Out
                </button>
            </div>
        </div>
    );
}