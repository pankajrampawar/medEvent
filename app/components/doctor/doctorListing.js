'use client';
import { motion } from "framer-motion";
import { useState } from "react";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorListing({ usersList }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = usersList?.slice(indexOfFirstUser, indexOfLastUser); // Use usersList directly

    const totalPages = Math.ceil(usersList?.length / usersPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getRoleDescription = (role) => {
        const roleDescriptions = {
            emt: "Emergency Medical Technician",
            medic: "Medic",
            nppa: "Nurse Practitioner/Physician Assistant",
            usP: "US Physicians",
            interP: "International Physician"
        };

        return roleDescriptions[role] || "Unknown Role";
    };

    return (
        <div className="p-6 bg-white min-h-[70vh] flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Staff</h1>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search Staff"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                            onClick={() => { router.push('/dashboard/user-management/add-staff') }}
                        >
                            Add Staff Member
                        </motion.button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NAME
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    EMAIL
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ROLE
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers?.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.firstName}</span>
                                            <span className="text-sm text-gray-500">{user.lastName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{getRoleDescription(user.role)}</td>
                                    <td className="px-6 py-4 flex items-end">
                                        <button
                                            onClick={() =>
                                                router.push(
                                                    `/dashboard/user-management/${user._id}?data=${encodeURIComponent(
                                                        JSON.stringify(user)
                                                    )}`
                                                )
                                            }
                                            className="text-slate-400 hover:text-purple-700"
                                        >
                                            <Eye />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, usersList?.length)} of {usersList?.length} entries
                </span>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not"
                    >
                        Previous
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    );
}