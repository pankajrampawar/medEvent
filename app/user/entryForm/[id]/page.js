'use client'
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import RegistrationForm from "../../../components/form/userEntryForm";
import { getEventDetails } from "@/lib/api";

export default function EntryForm({ params }) {
    const { id } = React.use(params);
    const [loading, setLoading] = useState(true);
    const [eventDetails, setEventDetails] = useState(null);
    const [eventStatus, setEventStatus] = useState("");
    const [allowed, setAllowed] = useState();

    useEffect(() => {
        const getEventById = async (id) => {
            try {
                const result = await getEventDetails(id);
                console.log(result);
                setEventDetails(result); // Store event details in state
                checkEventStatus(result.startDate, result.event.endDate); // Check event status
                setLoading(false);
            } catch (error) {
                throw new Error("Unable to load data, please try again later.");
            }
        };
        getEventById(id);
    }, [id]);

    const checkEventStatus = (startDate, endDate) => {
        const currentDate = new Date();
        const eventStartDate = new Date(startDate);
        const eventEndDate = new Date(endDate);
        console.log(eventStartDate, eventEndDate)
        if (currentDate < eventStartDate) {
            setEventStatus("This event has not started yet.");
            setAllowed(false)
        } else if (currentDate > eventEndDate) {
            setEventStatus("This event has been completed.");
            setAllowed(false)
        } else {
            setEventStatus("This event is ongoing.");
            setAllowed(true)
        }
    };

    // Get icon path based on event status
    const getIconPath = () => {
        if (eventStatus === "This event has not started yet.") {
            return "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z";
        } else if (eventStatus === "This event has been completed.") {
            return "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z";
        } else {
            return "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <motion.div
                    className="flex flex-col items-center space-y-4 p-8 rounded-lg shadow-md bg-white"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-12 h-12 border-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-2xl font-semibold text-gray-700">
                        Loading event details...
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            {eventStatus && !allowed && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center my-8"
                >
                    <p
                        className={`text-2xl font-bold ${eventStatus === "This event has not started yet."
                            ? "text-yellow-600"
                            : "text-red-600"
                            }`}
                    >
                        {eventStatus}
                    </p>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-6 mb-4"
                    >
                        <svg
                            className={`w-16 h-16 mx-auto ${eventStatus === "This event has not started yet."
                                ? "text-yellow-600"
                                : "text-red-600"
                                }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={getIconPath()}
                            />
                        </svg>
                    </motion.div>

                    {eventStatus === "This event has not started yet." && eventDetails && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                        >
                            <p className="text-gray-700">
                                Event will start on {new Date(eventDetails.startDate).toLocaleDateString()} at {new Date(eventDetails.startDate).toLocaleTimeString()}
                            </p>
                        </motion.div>
                    )}

                    {eventStatus === "This event has been completed." && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.5 }}
                            className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200"
                        >
                            <p className="text-gray-700">
                                Thank you for your interest. Please check our upcoming events.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {eventStatus === "This event is ongoing." && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg"
                >
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="flex items-center space-x-3 mb-6"
                    >
                        <svg
                            className="w-6 h-6 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800">Event Registration</h2>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <RegistrationForm eventId={id} />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}