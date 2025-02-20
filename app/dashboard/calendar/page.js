'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { X } from 'lucide-react';

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
        return events.map((event) => {
            const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate random light color
            let formattedStart;

            try {
                if (!event.startDate) {
                    throw new Error("Invalid start date: undefined");
                }

                const date = new Date(event.startDate);
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid start date: ${event.start}`);
                }

                formattedStart = date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
            } catch (error) {
                console.error(`Error formatting event: ${error.message}`);
                return null; // Skip this event
            }

            return {
                ...event,
                start: formattedStart,
                color: randomColor,
            };
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
            const result = await getEventDetails(); // Replace with your API call
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
                <div className="p-4 bg-white rounded-lg shadow-md">
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
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <h3 className="text-lg font-bold text-gray-800">
                                {selectedEvent?.title}
                            </h3>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={handleClose}
                            >
                                <X />
                            </button>
                        </div>
                        <p className="mb-2">
                            <strong>📅 Start Date:</strong> {new Date(selectedEvent?.start).toLocaleDateString()}
                        </p>
                        <p className="mb-2">
                            <strong>📅 End Date:</strong> {new Date(selectedEvent?.end).toLocaleDateString()}
                        </p>
                        <p>
                            <strong>📝 Details:</strong> {selectedEvent?.extendedProps?.description || 'No details provided'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;