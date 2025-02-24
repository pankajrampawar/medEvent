'use client'
import { motion } from "framer-motion";
import { useState } from "react";
import { Info, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper function to format the date
const formatDate = (dateStrings) => {
    const date = new Date(dateStrings);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function EventsListing({ events, isAdmin }) {
    const router = useRouter();

    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 7;

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
                            placeholder="Search Events"
                            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        {isAdmin && < motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition-colors"
                            onClick={() => { router.push('/dashboard/events/createEvent') }}
                        >
                            Add New Event
                        </motion.button>}
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
                                    key={event._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4">{event.title}</td>
                                    <td className="px-6 py-4">{event.location}</td>
                                    <td className="px-6 py-4">{formatDate(event.startDate)}</td>
                                    <td className="px-6 py-4">{formatDate(event.endDate)}</td>
                                    <td className="px-6 py-4 flex items-center">
                                        <button className="text-gray-400 mr-4 hover:text-purple-700" onClick={() => router.push(`/dashboard/events/edit-event/${event._id}?data=${encodeURIComponent(JSON.stringify(event))}`)}><Info /></button>
                                        <button className="text-gray-400 hover:text-purple-700" onClick={() => router.push(`/dashboard/events/${event._id}`)}><Eye /></button>
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
        </div >
    );
}