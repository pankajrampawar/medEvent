'use client'
import EventKpi from "@/app/components/event/eventKpi";
import EventListing from "@/app/components/event/eventListing";
import { getEventDetails } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";

export default function OngoingEvent() {

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

        allEvents?.forEach((event) => {
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

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const result = await getEventDetails();
            const fetchedEvents = result.events || [];
            let requiredEvents;
            if (isAdmin) {
                requiredEvents = fetchedEvents
                setEvents(requiredEvents);
            } else if (isDoctor) {
                console.log("doctor")
                // Filter events where the user's email exists in the doctor array
                requiredEvents = fetchedEvents.filter(event =>
                    event.doctor?.some(doc => doc.email === user.email)
                );
                setEvents(requiredEvents);
            }
            console.log(user)
            localStorage.setItem('events', JSON.stringify(requiredEvents));
            categorizeEvents(requiredEvents);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();

        // Set up interval to fetch updates every 2 minutes
        const intervalId = setInterval(fetchEvents, 2 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center">
            Loading...
        </div>
    );

    return (
        <div className="flex flex-col w-full gap-4 p-[5%]">
            <section>
                <EventKpi ongoing={ongoingEvents.length} upcoming={upcomingEvents.length} completed={completedEvents.length} />
            </section>

            <section className="min-w-full">
                <EventListing events={ongoingEvents} isAdmin={isAdmin} />
            </section>

            <section className="fixed">
                {/* Add content for the fixed section */}
            </section>
        </div>
    );
}