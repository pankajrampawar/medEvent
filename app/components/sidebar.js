'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, User, Calendar, HeartPulse } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isDropdownOpen, setIsDropdownOpen] = useState(true);
    const [selectedOption, setSelectedOption] = useState("Ongoing");
    const { user, loading: authLoading } = useAuth();

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

    return (
        <div className="flex flex-col w-64 h-screen text-black sticky top-0">
            <div className="flex items-center justify-start pl-4  h-16">
                <h1 className="text-xl font-bold">DASHBOARD</h1>
            </div>
            <nav className="flex-grow p-4">
                <ul>
                    <li className="mb-2">
                        <Link href="/dashboard" className="flex items-start p-2 hover:bg-gray-200 rounded gap-1">
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
                                        className={`w-full text-left p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/events/ongoing" ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        Ongoing
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleOptionClick("Upcoming")}
                                        className={`w-full text-left p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/events/upcoming" ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        Upcoming
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => handleOptionClick("Completed")}
                                        className={`w-full text-left p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/events/completed" ? "bg-gray-200" : ""
                                            }`}
                                    >
                                        Completed
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="mb-2">
                        <Link href="/dashboard/calendar" className={`flex items-start gap-2 p-2 hover:bg-gray-200 rounded ${pathname === "/dashboard/calendar" ? "bg-gray-200" : ""}`}>
                            <Calendar width={20} height={20} /> Calendar
                        </Link>
                    </li>
                    {!authLoading &&
                        isAdmin ?
                        <li className="mb-2">
                            <Link href="/dashboard/user-management" className="flex items-start gap-1 p-2 hover:bg-gray-200 rounded">
                                <User width={20} height={20} /> User Management
                            </Link>
                        </li> :
                        isDoctor ? <li className="mb-2">
                            <Link href="/dashboard/profile/" className="flex items-start gap-1 p-2 hover:bg-gray-200 rounded">
                                <User width={20} height={20} /> Your Profile
                            </Link>
                        </li> : ""
                    }
                </ul>
            </nav>
        </div>
    );
}