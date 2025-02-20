'use client'
import EventKpi from "@/app/components/event/eventKpi";
import EventListing from "@/app/components/event/eventListing";
import { useState, useEffect } from "react";


export default function CompletedEvent() {


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
                <EventKpi />
            </section>

            <section className="min-w-full">
                <EventListing events={completedEvents} />
            </section>

            <section className="fixed">

            </section>
        </div>
    )
}