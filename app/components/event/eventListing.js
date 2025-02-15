'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Trash, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EventsListing() {

    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 7;

    // Sample data
    const events = [
        { id: 1, name: "Event 1", location: "shebb street 34, ily", startDate: "5/2/2025", endDate: "5/2/2025" },
        { id: 2, name: "Event 2", location: "shebb street 34, ily", startDate: "6/2/2025", endDate: "6/2/2025" },
        { id: 3, name: "Event 3", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 4, name: "Event 4", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 5, name: "Event 5", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 6, name: "Event 6", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 7, name: "Event 7", location: "shebb street 34, ily", startDate: "5/2/2025", endDate: "5/2/2025" },
        { id: 8, name: "Event 8", location: "shebb street 34, ily", startDate: "6/2/2025", endDate: "6/2/2025" },
        { id: 9, name: "Event 9", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 10, name: "Event 10", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 11, name: "Event 11", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
        { id: 12, name: "Event 12", location: "shebb street 34, ily", startDate: "7/2/2025", endDate: "7/2/2025" },
    ];

    // Pagination logic
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.ceil(events.length / eventsPerPage);

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
        <div className="p-6 bg-white min-w-full min-h-[70vh] flex flex-col justify-between">
            {/* Header */}
            <div>
                <div className="flex justify-end items-center mb-6 ">
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            placeholder="Search User"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                        >
                            Add New Event
                        </motion.button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    EVENT
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    LOCATION
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    START DATE
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    END DATE
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    ACTIONS
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentEvents.map((event) => (
                                <motion.tr
                                    key={event.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4">{event.name}</td>
                                    <td className="px-6 py-4">{event.location}</td>
                                    <td className="px-6 py-4">{event.startDate}</td>
                                    <td className="px-6 py-4">{event.endDate}</td>
                                    <td className="px-2 py-4 flex gap-3 justify-start">
                                        <button className="ml-4 text-gray-400 hover:text-red-700"><Trash /></button>
                                        <button className="text-gray-400 hover:text-purple-700" onClick={() => router.push(`/dashboard/events/${123}`)}><Eye /></button>
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
                    Showing {indexOfFirstEvent + 1} to {Math.min(indexOfLastEvent, events.length)} of {events.length} entries
                </span>
                <div className="flex space-x-2">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50"
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