'use client';
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Eye, Trash2 } from "lucide-react";

export default function MasterItemListing({ masterList }) {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const mastersPerPage = 20;

    // Filter masters based on search query
    const filteredMasters = masterList.filter(master =>
        master.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastMaster = currentPage * mastersPerPage;
    const indexOfFirstMaster = indexOfLastMaster - mastersPerPage;
    const currentMasters = filteredMasters.slice(indexOfFirstMaster, indexOfLastMaster);
    const totalPages = Math.ceil(filteredMasters.length / mastersPerPage);

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

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when searching
    };

    return (
        <div className="p-6 bg-white min-h-[70vh] flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-wide">Master Kits</h1>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search Master Kit"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                            onClick={() => { router.push(`/dashboard/master/newKit`) }}
                        >
                            Add New Kit
                        </motion.button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    KIT NAME
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentMasters.map((master) => (
                                <tr key={master._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {master.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                                        <button
                                            onClick={() => router.push(`/dashboard/master/${master._id}`)}
                                            className="text-sm text-primary hover:text-primary/80"
                                        >
                                            <Eye />
                                        </button>
                                        <button
                                            onClick={() => router.push(`/dashboard/master/${master._id}`)}
                                            className="text-sm text-primary hover:text-primary/80"
                                        >
                                            <Trash2 />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-700">
                    Showing {indexOfFirstMaster + 1} to {Math.min(indexOfLastMaster, filteredMasters.length)} of {filteredMasters.length} entries
                </span>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </motion.button>
                </div>
            </div>
        </div>
    );
}