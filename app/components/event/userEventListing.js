'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Trash, Eye, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserListing({ eventId, usersList, setShowInventory }) {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState(""); // State for search query
    const usersPerPage = 10;
    const users = usersList;

    // Filter events based on search query
    const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.contactNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );


    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(users.length / usersPerPage);

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

    function formatDate(isoDateString) {
        const date = new Date(isoDateString);

        // Array of month names for readability
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        // Extract date components
        const year = date.getFullYear();
        const month = monthNames[date.getMonth()]; // Get month name from the array
        const day = date.getDate();

        // Format the date as "Month Day, Year"
        return `${month} ${day}, ${year}`;
    }

    return (
        <div className="p-6 bg-white min-h-[70vh] flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold tracking-wide">Patients</h1>
                    <div className="flex space-x-4">
                        <button className="hover:bg-gray-200 rounded-full p-2" onClick={() => setShowInventory(true)}>
                            <Package />
                        </button>
                        <input
                            type="text"
                            placeholder="Search User"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
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
                                    DATE OF BIRTH
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    CONTACT NO
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    STATUS
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user) => (
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
                                    <td className="px-6 py-4">{formatDate(user.dateOfBirth)}</td>
                                    <td className="px-6 py-4">{user.contactNumber}</td>
                                    <td className="px-6 py-4"><span className={` text-sm p-1 rounded-md ${!user.isPending ? "bg-green-200 text-green-950" : "bg-red-200 text-red-950"}`}>{!user.isPending ? "Completed" : "Pending"}</span></td>
                                    <td className="px-6 pt-3">
                                        <button onClick={() => router.push(`/dashboard/events/user/${user._id}?data=${encodeURIComponent(JSON.stringify(user))}`)} className="text-slate-400 hover:text-purple-700"><Eye /></button>
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
                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} entries
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
        </div >
    );
}