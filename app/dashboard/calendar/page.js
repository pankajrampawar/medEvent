'use client';

import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { Calendar, Menu, X } from 'lucide-react';

const CalendarComponent = () => {
    const [show, setShow] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = (eventInfo) => {
        setSelectedEvent(eventInfo.event);
        setShow(true);
    };

    const events = [
        { title: "Doctor's Appointment", date: "2025-01-31", description: "Visit Dr. Smith at 10:00 AM", color: "#ff4d4f" },
        { title: "Family Trip", date: "2025-02-19", description: "Going to the beach with family", color: "#52c41a" },
        { title: "Design Review", date: "2025-02-14", description: "Review UI/UX designs with team", color: "#9254de" },
        { title: "Dinner", date: "2025-02-14", description: "Dinner at 7:00 PM with friends", color: "#faad14" },
    ];

    return (
        <div className="flex h-screen">
            {/* Main Content */}
            <div className="flex-grow p-4 bg-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <button
                        className="p-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? <X /> : <Menu />}
                    </button>
                    <h2 className="text-center text-xl font-bold">📅 Event Calendar</h2>
                </div>

                <div className="p-4 bg-white rounded-lg shadow-md">
                    <FullCalendar
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={handleShow}
                        height="auto"
                        headerToolbar={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                        }}
                    />
                </div>
            </div>

            {/* Event Details Modal */}
            {show && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
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
                            <strong>📅 Date:</strong> {selectedEvent?.start?.toISOString().split("T")[0]}
                        </p>
                        <p>
                            <strong>📝 Details:</strong> {selectedEvent?.extendedProps?.description || "No details provided"}
                        </p>
                        <div className="mt-4 text-right">
                            <button
                                className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarComponent;