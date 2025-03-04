'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { getEventDetails } from '@/lib/api';
import { useAuth } from '@/context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, User, Stethoscope, Users, X, RefreshCw, Package } from 'lucide-react';


const CalendarComponent = () => {

    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';

    const [show, setShow] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [formattedEvents, setFormattedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = (eventInfo) => {
        setSelectedEvent(eventInfo.event);
        setShow(true);
    };

    function formatEventsForCalendar(events) {
        const now = new Date();

        return events.map((event) => {
            let formattedStart, formattedEnd;

            try {
                if (!event.startDate) {
                    throw new Error("Invalid start date: undefined");
                }

                const startDate = new Date(event.startDate);
                const endDate = new Date(event.endDate);

                if (isNaN(startDate.getTime()) || (event.endDate && isNaN(endDate.getTime()))) {
                    throw new Error(`Invalid start or end date: ${event.startDate}`);
                }

                formattedStart = startDate.toISOString().split("T")[0];
                formattedEnd = endDate ? endDate.toISOString().split("T")[0] : null;

                let color;
                if (endDate && endDate < now) {
                    color = "#d1f2eb"; // Light teal for completed events
                } else if (startDate > now) {
                    color = "#fde2e1"; // Light peach for upcoming events
                } else {
                    color = "#fef4d9"; // Soft yellow for ongoing events
                }

                return {
                    ...event,
                    start: formattedStart,
                    end: formattedEnd,
                    color,
                    textColor: "black", // Black text for better contrast
                };
            } catch (error) {
                console.error(`Error formatting event: ${error.message}`);
                return null;
            }
        }).filter(Boolean);
    }
    const categorizeEvents = (allEvents) => {
        const now = new Date();
        const ongoing = [];
        const completed = [];
        const upcoming = [];

        allEvents.forEach((event) => {
            const startDate = new Date(event.start);
            const endDate = new Date(event.end);

            if (endDate < now) {
                completed.push(event);
            } else if (startDate > now) {
                upcoming.push(event);
            } else {
                ongoing.push(event);
            }
        });
    };

    const updateEvents = async () => {
        try {
            const result = await getEventDetails();
            const fetchedEvents = result.events || [];
            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

            const eventIds = new Set(storedEvents.map((event) => event.id));
            const updatedEvents = [
                ...fetchedEvents.filter((event) => !eventIds.has(event.id)),
                ...storedEvents,
            ];

            let requiredEvents = updatedEvents;

            if (!isAdmin) {
                requiredEvents = updatedEvents.filter(event =>
                    event.doctors?.some(doc => doc.email === user.email)
                );
            }
            localStorage.setItem('events', JSON.stringify(requiredEvents));
            setEvents(updatedEvents);

            const calendarEvents = formatEventsForCalendar(requiredEvents);
            setFormattedEvents(calendarEvents);

            categorizeEvents(requiredEvents);
        } catch (error) {
            console.error('Failed to update events:', error);
        }
    };

    const refreshEvents = async () => {
        localStorage.removeItem('events');
        await updateEvents();
    };

    useEffect(() => {
        const initializeEvents = async () => {
            const storedEvents = JSON.parse(localStorage.getItem('events'));
            if (storedEvents) {
                setEvents(storedEvents);
                setFormattedEvents(formatEventsForCalendar(storedEvents));
                categorizeEvents(storedEvents);
                setLoading(false);
            } else {
                await updateEvents();
                setLoading(false);
            }
        };

        initializeEvents();

        const intervalId = setInterval(updateEvents, 2 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    const popupVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { type: 'spring', stiffness: 300, damping: 20 }
        },
        exit: { opacity: 0, scale: 0.95 }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
        <div className="flex h-screen">
            <div className="flex-grow p-4 bg-gray-100">
                <div className="p-4 bg-white rounded-lg shadow-md text-black text-sm">
                    <div className="flex justify-between mb-4">
                        <h1 className="text-lg font-semibold">Calendar</h1>
                        <button
                            onClick={refreshEvents}
                            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            <RefreshCw size={18} className="mr-2" />
                            Refresh Events
                        </button>
                    </div>
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        events={formattedEvents} // Use the updated formattedEvents
                        eventClick={handleShow}
                        height="auto"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
                        }}
                    />
                </div>
            </div>

            <AnimatePresence>
                {show && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <motion.div
                            className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 pb-14 w-full max-w-lg mx-4 transform transition-all border border-white/20 relative overflow-hidden"
                            variants={popupVariants}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30" />

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">
                                            {selectedEvent?.title || "Event Details"}
                                        </h3>
                                        <p className="text-blue-600 font-medium mt-1 flex items-center gap-2">
                                            <User size={16} />
                                            {selectedEvent?.extendedProps?.clientName || "No client name"}
                                        </p>
                                    </div>
                                    <button
                                        className="p-1 hover:bg-gray-100 rounded-full transition-all"
                                        onClick={handleClose}
                                    >
                                        <X size={24} className="text-gray-600 hover:text-gray-900" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Date & Time Section */}
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                                <Calendar size={18} />
                                                <span className="font-medium">Start</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold">
                                                {selectedEvent?.start
                                                    ? new Date(selectedEvent.start).toLocaleDateString('en-US', {
                                                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                    })
                                                    : "N/A"}
                                            </p>
                                        </div>

                                        <div className="flex-1 bg-white p-4 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                                <Calendar size={18} />
                                                <span className="font-medium">End</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold">
                                                {selectedEvent?.end
                                                    ? new Date(selectedEvent.end).toLocaleDateString('en-US', {
                                                        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                                                    })
                                                    : "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location Section */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-600 mb-2">
                                            <MapPin size={18} />
                                            <span className="font-medium">Location</span>
                                        </div>
                                        <p className="text-gray-900 font-semibold">
                                            {selectedEvent?.extendedProps?.location || "No location specified"}
                                        </p>
                                    </div>

                                    {/* Medical Staff Section */}
                                    <div className="bg-white p-4 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 text-gray-600 mb-3">
                                            <Stethoscope size={18} />
                                            <span className="font-medium">Medical Staff</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedEvent?.extendedProps?.doctors?.map((doctor, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2"
                                                >
                                                    <User size={14} />
                                                    {doctor.name}
                                                </span>
                                            ))}
                                            {!selectedEvent?.extendedProps?.doctors?.length && (
                                                <p className="text-gray-500 text-sm">No medical staff assigned</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Attendees & Medical Kits */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                                <Users size={18} />
                                                <span className="font-medium">Attendees</span>
                                            </div>
                                            <p className="text-gray-900 font-semibold text-2xl">
                                                {selectedEvent?.extendedProps?.attendees || 0}
                                            </p>
                                        </div>

                                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3 text-gray-600 mb-2">
                                                <Package size={18} />
                                                <span className="font-medium">Medical Kits</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2 max-h-[140px] overflow-y-scroll">
                                                {selectedEvent?.extendedProps?.medicalKit?.map((kit, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs"
                                                    >
                                                        {kit}
                                                    </span>
                                                ))}
                                                {!selectedEvent?.extendedProps?.medicalKit?.length && (
                                                    <p className="text-gray-500 text-sm">No kits assigned</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CalendarComponent;