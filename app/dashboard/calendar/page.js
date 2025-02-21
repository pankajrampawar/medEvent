'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Calendar, Info, X } from 'lucide-react';
import { getEventDetails } from '@/lib/api';

const CalendarComponent = () => {
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

                // Determine color based on event status
                let color;
                if (endDate && endDate < now) {
                    color = "#bbf7d0"; // Light green for completed
                } else if (startDate > now) {
                    color = "#fecaca"; // Light red for upcoming
                } else {
                    color = "#fef9c3"; // Light yellow for ongoing
                }

                return {
                    ...event,
                    start: formattedStart,
                    end: formattedEnd,
                    color,
                    textColor: "black"
                };
            } catch (error) {
                console.error(`Error formatting event: ${error.message}`);
                return null; // Skip this event
            }
        }).filter(Boolean); // Remove null entries
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

        console.log({ ongoing, completed, upcoming });
    };

    const updateEvents = async () => {
        try {
            const result = await getEventDetails();
            const fetchedEvents = result.events || [];
            const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

            // Merge new events, removing duplicates based on ID
            const eventIds = new Set(storedEvents.map((event) => event.id));
            const updatedEvents = [
                ...fetchedEvents.filter((event) => !eventIds.has(event.id)),
                ...storedEvents,
            ];

            // Update only the raw `events` state
            localStorage.setItem('events', JSON.stringify(updatedEvents));
            setEvents(updatedEvents);

            // Format events for FullCalendar and set to `formattedEvents`
            const calendarEvents = formatEventsForCalendar(updatedEvents);
            setFormattedEvents(calendarEvents);

            categorizeEvents(updatedEvents);
        } catch (error) {
            console.error('Failed to update events:', error);
        }
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

        // Set up interval to fetch updates every 2 minutes
        const intervalId = setInterval(updateEvents, 2 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    console.log(events)
    console.log(formattedEvents)

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-grow p-4 bg-gray-100">
                <div className="p-4 bg-white rounded-lg shadow-md text-black text-sm">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        events={formattedEvents} // Use formatted events
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

            {/* Event Details Modal */}
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                    <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md transform transition-all pb-10">
                        {/* Header */}
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

                        {/* Content */}
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