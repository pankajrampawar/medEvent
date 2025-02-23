'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserListing({ eventId }) {

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;

    // Sample user data
    const users = [
        { id: 1, name: "Zsazsa McCleverty", username: "@zmcclevertye", dob: "25 Feb 2014", contact: "965284125", status: "completed", case: "Emergency" },
        { id: 2, name: "Yoko Potte", username: "@ypotitec", dob: "20 Feb 1952", contact: "965284125", status: "completed", case: "Emergency" },
        { id: 3, name: "Wesley Burland", username: "@wburland", dob: "12 Jan 1945", contact: "965284125", status: "completed", case: "Emergency" },
        // Add more users as needed
    ];

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

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

    return (
        <div className="p-6 bg-white min-h-[70vh] flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">User Listing</h1>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search User"
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
                                    CASE
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name}</span>
                                            <span className="text-sm text-gray-500">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.dob}</td>
                                    <td className="px-6 py-4">{user.contact}</td>
                                    <td className="px-6 py-4"><span className="bg-green-200 text-green-950 text-sm p-1 rounded-sm">{user.status}</span></td>
                                    <td className="text-sm"><span className="bg-red-200 text-red-900 p-1 rounded-md">{user.case}</span></td>
                                    <td className="px-6 py-4 flex itmes-end">
                                        <button onClick={() => router.push(`/dashboard/events/user/${123}`)} className="text-slate-400 hover:text-purple-700"><Eye /></button>
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