'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Calendar, Info, X, RefreshCw } from 'lucide-react';
import { getEventDetails } from '@/lib/api';
import { useAuth } from '@/context/authContext';

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

            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all pb-10">
                        <div className="flex justify-between items-center pb-4 border-b">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {selectedEvent?.title || "Event Details"}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-red-600 transition"
                                onClick={handleClose}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mt-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-600" size={18} />
                                <span className="text-gray-700 font-medium">Start Date:</span>
                                <span className="text-gray-800">
                                    {selectedEvent?.start
                                        ? new Date(selectedEvent.start).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="text-blue-600" size={18} />
                                <span className="text-gray-700 font-medium">End Date:</span>
                                <span className="text-gray-800">
                                    {selectedEvent?.end
                                        ? new Date(selectedEvent.end).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                            <div className="flex items-start gap-3">
                                <Info className="text-blue-600" size={18} />
                                <div>
                                    <span className="text-gray-700 font-medium">Details:</span>
                                    <p className="text-gray-700 mt-1">
                                        {selectedEvent?.extendedProps?.description || "No details provided."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;