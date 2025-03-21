'use client'
import EventKpi from "@/app/components/event/eventKpi";
import EventListing from "@/app/components/event/eventListing";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { getEventDetails } from "@/lib/api";

export default function UpcomingEvent() {

    const { user, logout } = useAuth();

    const isAdmin = user?.role === 'admin';
    const isDoctor = user?.role === 'doctor';

    const [events, setEvents] = useState([]);
    const [ongoingEvents, setOngoingEvents] = useState([]);
    const [completedEvents, setCompletedEvents] = useState([]);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const categorizeEvents = (allEvents) => {
        const now = new Date();
        const ongoing = [];
        const completed = [];
        const upcoming = [];

        allEvents.forEach((event) => {
            const startDate = new Date(event.startDate);
            const endDate = new Date(event.endDate);

            if (endDate < now) {
                completed.push(event);
            } else if (startDate > now) {
                upcoming.push(event);
            } else {
                ongoing.push(event);
            }
        });

        setOngoingEvents(ongoing);
        setCompletedEvents(completed);
        setUpcomingEvents(upcoming);
    };

    const updateEvents = async () => {
        try {
            const result = await getEventDetails();
            const fetchedEvents = result.events || [];
            const storedEvents = JSON.parse(localStorage.getItem("events")) || [];

            // Merge new events, removing duplicates based on ID
            const eventIds = new Set(storedEvents.map((event) => event.id));
            const updatedEvents = [
                ...fetchedEvents.filter((event) => !eventIds.has(event.id)),
                ...storedEvents,
            ];

            localStorage.setItem("events", JSON.stringify(updatedEvents));
            setEvents(updatedEvents);
            categorizeEvents(updatedEvents);
        } catch (error) {
            console.error("Failed to update events:", error);
        }
    };

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const result = await getEventDetails();
            const fetchedEvents = result.events || [];
            let requiredEvents;

            if (isAdmin) {
                requiredEvents = fetchedEvents;
                setEvents(requiredEvents);
            } else if (isDoctor) {
                // Filter events where the user's email exists in the doctor array
                console.log(fetchedEvents)
                requiredEvents = fetchedEvents.filter(event =>
                    event.doctors?.some(doc => doc.email === user.email)
                );
                setEvents(requiredEvents);
            }

            localStorage.setItem('events', JSON.stringify(requiredEvents));
            categorizeEvents(requiredEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initializeEvents = async () => {
            const storedEvents = JSON.parse(localStorage.getItem("events"));
            if (storedEvents) {
                setEvents(storedEvents);
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

    return (
        <div className="flex flex-col w-full gap-4 p-[5%]">
            <section>
                <EventKpi ongoing={ongoingEvents.length} upcoming={upcomingEvents.length} completed={completedEvents.length} />
            </section>

            <section className="min-w-full">
                <EventListing events={upcomingEvents} isAdmin={isAdmin} refreshEvents={fetchEvents} />
            </section>

            <section className="fixed">

            </section>
        </div>
    )
}